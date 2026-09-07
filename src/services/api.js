const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
let accessToken = null

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...options.headers },
    credentials: 'include',
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Request failed')
  return body
}

export const api = {
  login: async (credentials) => { const result = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); accessToken = result.token; return result },
  register: async (credentials) => { const result = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(credentials) }); accessToken = result.token; return result },
  me: () => request('/api/me'),
  transactions: () => request('/api/transactions'),
  deposit: (payload) => request('/api/deposits', { method: 'POST', body: JSON.stringify(payload) }),
  transfer: (payload) => request('/api/transfers', { method: 'POST', body: JSON.stringify(payload) }),
  adminUsers: () => request('/api/admin/users'),
  adminUser: (id) => request(`/api/admin/users/${id}`),
  adminUserSections: (id) => request(`/api/admin/users/${id}/sections`),
  adminAuditLogs: () => request('/api/admin/audit-logs'),
  updateAdminUser: (id, payload) => request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateAdminAccount: (id, payload) => request(`/api/admin/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateAdminTransaction: (id, payload) => request(`/api/admin/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateAdminSection: (id, section, data) => request(`/api/admin/users/${id}/sections/${section}`, { method: 'PUT', body: JSON.stringify(data) }),
  logout: () => { accessToken = null },
}