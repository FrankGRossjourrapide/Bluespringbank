import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from './db.js'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME || 'Blue Spring Administrator'

if (!email || !password || password.length < 12) throw new Error('ADMIN_EMAIL and a 12+ character ADMIN_PASSWORD are required')
const passwordHash = await bcrypt.hash(password, 12)
await pool.query("INSERT INTO users (name, email, password_hash, role) VALUES ($1, lower($2), $3, 'admin') ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active'", [name, email, passwordHash])
await pool.end()
console.log(`Admin account provisioned for ${email}`)