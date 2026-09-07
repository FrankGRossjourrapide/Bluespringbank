import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pino from 'pino'
import pinoHttp from 'pino-http'
import { z } from 'zod'
import { pool, query } from './db.js'

const app = express()
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
const port = Number(process.env.PORT || 4000)
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret || jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters')

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || false, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(pinoHttp({ logger }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8' }))

const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { error: 'Too many authentication attempts' } })
const credentials = z.object({ email: z.string().email().max(254), password: z.string().min(8).max(128) })
const money = z.object({ amount: z.number().finite().positive().max(1_000_000), description: z.string().trim().min(1).max(200) })
const managedSections = ['profile', 'preferences', 'kyc', 'cards', 'beneficiaries', 'statements']
const sectionData = z.record(z.string(), z.unknown())

const signToken = user => jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '15m' })
const refreshCookie = (res, user) => res.cookie('refreshToken', jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' }), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 86400000 })

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const claims = jwt.verify(token || '', jwtSecret)
    const result = await query('SELECT id, name, email, role, status FROM users WHERE id = $1', [claims.sub])
    if (!result.rows[0] || result.rows[0].status !== 'active') return res.status(401).json({ error: 'Account is not active' })
    req.user = result.rows[0]
    next()
  } catch { res.status(401).json({ error: 'Authentication required' }) }
}

const requireAdmin = (req, res, next) => req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Administrator access required' })
const audit = (client, actorId, action, resource, metadata = {}) => client.query('INSERT INTO audit_logs (actor_id, action, resource, metadata) VALUES ($1, $2, $3, $4)', [actorId, action, resource, metadata])

app.get('/health/live', (_req, res) => res.json({ status: 'ok' }))
app.get('/health/ready', async (_req, res) => { try { await query('SELECT 1'); res.json({ status: 'ready' }) } catch { res.status(503).json({ status: 'unavailable' }) } })

app.post('/api/auth/register', authLimit, async (req, res, next) => {
  try {
    const input = credentials.extend({ name: z.string().trim().min(2).max(120) }).parse(req.body)
    const passwordHash = await bcrypt.hash(input.password, 12)
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const user = (await client.query('INSERT INTO users (name, email, password_hash) VALUES ($1, lower($2), $3) RETURNING id, name, email, role', [input.name, input.email, passwordHash])).rows[0]
      await client.query('INSERT INTO accounts (user_id, balance_cents) VALUES ($1, 0)', [user.id])
      await client.query("INSERT INTO user_sections (user_id, section) SELECT $1, unnest($2::text[])", [user.id, managedSections])
      await audit(client, user.id, 'user.registered', user.id)
      await client.query('COMMIT')
      refreshCookie(res, user)
      res.status(201).json({ token: signToken(user), user })
    } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  } catch (error) { next(error) }
})

app.post('/api/auth/login', authLimit, async (req, res, next) => {
  try {
    const input = credentials.parse(req.body)
    const result = await query('SELECT id, name, email, password_hash, role, status FROM users WHERE email = lower($1)', [input.email])
    const user = result.rows[0]
    if (!user || user.status !== 'active' || !(await bcrypt.compare(input.password, user.password_hash))) return res.status(401).json({ error: 'Invalid credentials' })
    await query('INSERT INTO audit_logs (actor_id, action, resource) VALUES ($1, $2, $3)', [user.id, 'user.login', user.id])
    const { password_hash: _passwordHash, status: _status, ...publicUser } = user
    refreshCookie(res, user)
    res.json({ token: signToken(user), user: publicUser })
  } catch (error) { next(error) }
})

app.get('/api/me', requireAuth, async (req, res, next) => { try { const account = (await query('SELECT id, name, currency, balance_cents, pending_cents FROM accounts WHERE user_id = $1 ORDER BY created_at LIMIT 1', [req.user.id])).rows[0]; res.json({ user: req.user, account }) } catch (error) { next(error) } })
app.get('/api/transactions', requireAuth, async (req, res, next) => { try { const result = await query('SELECT t.id, t.type, t.amount_cents, t.description, t.status, t.created_at FROM transactions t JOIN accounts a ON a.id = t.account_id WHERE a.user_id = $1 ORDER BY t.created_at DESC LIMIT 100', [req.user.id]); res.json({ transactions: result.rows }) } catch (error) { next(error) } })
app.get('/api/me/sections/:section', requireAuth, async (req, res, next) => { try { if (!managedSections.includes(req.params.section)) return res.status(400).json({ error: 'Unknown user section' }); const result = await query('SELECT section, data, updated_at FROM user_sections WHERE user_id = $1 AND section = $2', [req.user.id, req.params.section]); res.json(result.rows[0] || { section: req.params.section, data: {}, updated_at: null }) } catch (error) { next(error) } })
app.put('/api/me/sections/:section', requireAuth, async (req, res, next) => { try { if (!managedSections.includes(req.params.section)) return res.status(400).json({ error: 'Unknown user section' }); const data = sectionData.parse(req.body); const result = await query('INSERT INTO user_sections (user_id, section, data, updated_at) VALUES ($1, $2, $3, now()) ON CONFLICT (user_id, section) DO UPDATE SET data = EXCLUDED.data, updated_at = now() RETURNING section, data, updated_at', [req.user.id, req.params.section, data]); res.json(result.rows[0]) } catch (error) { next(error) } })

const financialAction = type => async (req, res, next) => {
  const client = await pool.connect()
  try {
    const input = money.parse(req.body)
    await client.query('BEGIN')
    const account = (await client.query('SELECT id, balance_cents FROM accounts WHERE user_id = $1 FOR UPDATE', [req.user.id])).rows[0]
    const cents = Math.round(input.amount * 100)
    if (type === 'transfer' && account.balance_cents < cents) {
      await client.query('ROLLBACK')
      return res.status(422).json({ error: 'Insufficient funds' })
    }
    await client.query(type === 'deposit' ? 'UPDATE accounts SET balance_cents = balance_cents + $1 WHERE id = $2' : 'UPDATE accounts SET balance_cents = balance_cents - $1, pending_cents = pending_cents + $1 WHERE id = $2', [cents, account.id])
    const transaction = (await client.query('INSERT INTO transactions (account_id, type, amount_cents, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, type, amount_cents, description, status, created_at', [account.id, type, cents, input.description, type === 'deposit' ? 'completed' : 'pending'])).rows[0]
    await audit(client, req.user.id, `transaction.${type}`, transaction.id, { amount_cents: cents })
    await client.query('COMMIT')
    res.status(201).json({ transaction })
  } catch (error) { await client.query('ROLLBACK'); next(error) } finally { client.release() }
}
app.post('/api/deposits', requireAuth, financialAction('deposit'))
app.post('/api/transfers', requireAuth, financialAction('transfer'))

app.get('/api/admin/users', requireAuth, requireAdmin, async (_req, res, next) => { try { res.json({ users: (await query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC')).rows }) } catch (error) { next(error) } })
app.get('/api/admin/users/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const user = (await query('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = $1', [req.params.id])).rows[0]; if (!user) return res.status(404).json({ error: 'User not found' }); const accounts = (await query('SELECT id, name, currency, balance_cents, pending_cents, created_at FROM accounts WHERE user_id = $1 ORDER BY created_at', [req.params.id])).rows; const transactions = (await query('SELECT t.id, t.account_id, t.type, t.amount_cents, t.description, t.status, t.created_at FROM transactions t JOIN accounts a ON a.id = t.account_id WHERE a.user_id = $1 ORDER BY t.created_at DESC LIMIT 100', [req.params.id])).rows; res.json({ user, accounts, transactions }) } catch (error) { next(error) } })
app.get('/api/admin/users/:id/sections', requireAuth, requireAdmin, async (req, res, next) => { try { const result = await query('SELECT section, data, updated_at FROM user_sections WHERE user_id = $1 ORDER BY section', [req.params.id]); res.json({ sections: result.rows }) } catch (error) { next(error) } })
app.put('/api/admin/users/:id/sections/:section', requireAuth, requireAdmin, async (req, res, next) => { try { if (!managedSections.includes(req.params.section)) return res.status(400).json({ error: 'Unknown user section' }); const data = sectionData.parse(req.body); const result = await query('INSERT INTO user_sections (user_id, section, data, updated_at) VALUES ($1, $2, $3, now()) ON CONFLICT (user_id, section) DO UPDATE SET data = EXCLUDED.data, updated_at = now() RETURNING section, data, updated_at', [req.params.id, req.params.section, data]); await query('INSERT INTO audit_logs (actor_id, action, resource, metadata) VALUES ($1, $2, $3, $4)', [req.user.id, `admin.${req.params.section}.updated`, req.params.id, { section: req.params.section }]); res.json(result.rows[0]) } catch (error) { next(error) } })
app.patch('/api/admin/users/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const input = z.object({ name: z.string().trim().min(2).max(120).optional(), email: z.string().email().max(254).optional(), role: z.enum(['customer', 'admin']).optional(), status: z.enum(['active', 'suspended']).optional() }).refine(v => Object.keys(v).length > 0).parse(req.body); const result = await query('UPDATE users SET name = COALESCE($1, name), email = COALESCE(lower($2), email), role = COALESCE($3, role), status = COALESCE($4, status), updated_at = now() WHERE id = $5 RETURNING id, name, email, role, status, created_at, updated_at', [input.name || null, input.email || null, input.role || null, input.status || null, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: 'User not found' }); await query('INSERT INTO audit_logs (actor_id, action, resource, metadata) VALUES ($1, $2, $3, $4)', [req.user.id, 'admin.user.updated', req.params.id, input]); res.json({ user: result.rows[0] }) } catch (error) { next(error) } })
app.patch('/api/admin/accounts/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const input = z.object({ balance_cents: z.number().int().min(0).optional(), pending_cents: z.number().int().min(0).optional() }).refine(v => Object.keys(v).length > 0).parse(req.body); const result = await query('UPDATE accounts SET balance_cents = COALESCE($1, balance_cents), pending_cents = COALESCE($2, pending_cents) WHERE id = $3 RETURNING id, user_id, name, currency, balance_cents, pending_cents', [input.balance_cents ?? null, input.pending_cents ?? null, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: 'Account not found' }); await query('INSERT INTO audit_logs (actor_id, action, resource, metadata) VALUES ($1, $2, $3, $4)', [req.user.id, 'admin.account.updated', req.params.id, input]); res.json({ account: result.rows[0] }) } catch (error) { next(error) } })
app.patch('/api/admin/transactions/:id', requireAuth, requireAdmin, async (req, res, next) => { try { const input = z.object({ status: z.enum(['pending', 'completed', 'failed']) }).parse(req.body); const result = await query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING id, account_id, type, amount_cents, description, status, created_at', [input.status, req.params.id]); if (!result.rows[0]) return res.status(404).json({ error: 'Transaction not found' }); await query('INSERT INTO audit_logs (actor_id, action, resource, metadata) VALUES ($1, $2, $3, $4)', [req.user.id, 'admin.transaction.updated', req.params.id, input]); res.json({ transaction: result.rows[0] }) } catch (error) { next(error) } })
app.get('/api/admin/audit-logs', requireAuth, requireAdmin, async (_req, res, next) => { try { res.json({ logs: (await query('SELECT id, actor_id, action, resource, metadata, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 500')).rows }) } catch (error) { next(error) } })

app.use((error, req, res, _next) => { void _next; req.log.error({ err: error }, 'request failed'); if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid request', details: error.issues }); if (error.code === '23505') return res.status(409).json({ error: 'Email is already registered' }); res.status(500).json({ error: 'Internal server error' }) })

const server = app.listen(port, () => logger.info({ port }, 'Blue Spring API started'))
const shutdown = async signal => { logger.info({ signal }, 'shutting down'); server.close(); await pool.end(); process.exit(0) }
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)