import React, { useEffect, useState } from 'react'
import { Activity, AlertCircle, CheckCircle, ChevronLeft, ClipboardList, Search, Shield, Users, X } from 'lucide-react'
import { api } from '../services/api'

const formatDate = value => new Date(value).toLocaleString()
const sectionNames = ['profile', 'preferences', 'kyc', 'cards', 'beneficiaries', 'statements']

export default function AdminDashboard({ currentUser, setCurrentView }) {
  const [users, setUsers] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [updatedUserId, setUpdatedUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('profile')
  const [sectionText, setSectionText] = useState('{}')

  const loadDashboard = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [userResult, logResult] = await Promise.all([api.adminUsers(), api.adminAuditLogs()])
      setUsers(userResult.users)
      setAuditLogs(logResult.logs)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  const updateUser = async (id, payload) => {
    setActionError('')
    try {
      const result = await api.updateAdminUser(id, payload)
      setUsers(previous => previous.map(user => user.id === id ? result.user : user))
      setUpdatedUserId(id)
      window.setTimeout(() => setUpdatedUserId(null), 2200)
    } catch (updateError) {
      setActionError(updateError.message)
    }
  }

  const openUserDetail = async user => {
    setSelectedUser(user)
    setDetailLoading(true)
    setActionError('')
    try {
      const result = await api.adminUser(user.id)
      const sectionResult = await api.adminUserSections(user.id)
      setUserDetail(result)
      setSections(sectionResult.sections)
      setProfileForm({ name: result.user.name, email: result.user.email })
      const selected = sectionResult.sections.find(section => section.section === selectedSection)
      setSectionText(JSON.stringify(selected?.data || {}, null, 2))
    } catch (detailError) {
      setActionError(detailError.message)
    } finally {
      setDetailLoading(false)
    }
  }

  const selectSection = section => {
    setSelectedSection(section)
    const selected = sections.find(item => item.section === section)
    setSectionText(JSON.stringify(selected?.data || {}, null, 2))
  }

  const saveSection = async event => {
    event.preventDefault()
    setActionError('')
    try {
      const data = JSON.parse(sectionText)
      const result = await api.updateAdminSection(selectedUser.id, selectedSection, data)
      setSections(previous => previous.map(section => section.section === selectedSection ? result : section))
    } catch (saveError) {
      setActionError(saveError.message === 'Unexpected end of JSON input' || saveError instanceof SyntaxError ? 'Section data must be valid JSON.' : saveError.message)
    }
  }

  const saveProfile = async event => {
    event.preventDefault()
    setActionError('')
    try {
      const result = await api.updateAdminUser(selectedUser.id, profileForm)
      setUserDetail(previous => ({ ...previous, user: result.user }))
      setUsers(previous => previous.map(user => user.id === result.user.id ? { ...user, ...result.user } : user))
    } catch (saveError) {
      setActionError(saveError.message)
    }
  }

  const saveAccount = async (account, field, value) => {
    setActionError('')
    try {
      const result = await api.updateAdminAccount(account.id, { [field]: Number(value) })
      setUserDetail(previous => ({ ...previous, accounts: previous.accounts.map(item => item.id === account.id ? result.account : item) }))
    } catch (saveError) {
      setActionError(saveError.message)
    }
  }

  const updateTransaction = async (transaction, status) => {
    setActionError('')
    try {
      const result = await api.updateAdminTransaction(transaction.id, { status })
      setUserDetail(previous => ({ ...previous, transactions: previous.transactions.map(item => item.id === transaction.id ? result.transaction : item) }))
    } catch (saveError) {
      setActionError(saveError.message)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (statusFilter === 'all' || user.status === statusFilter)
  })
  const activeUsers = users.filter(user => user.status === 'active').length
  const suspendedUsers = users.filter(user => user.status === 'suspended').length
  const adminUsers = users.filter(user => user.role === 'admin').length

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-10">
      <header className="bg-linear-to-r from-blue-950 to-blue-800 text-white px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <button onClick={() => setCurrentView('home')} className="rounded-lg p-2 hover:bg-white/10" aria-label="Back to banking app">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <p className="text-sm font-medium text-blue-200">Operations console</p>
            <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-blue-100">Signed in as {currentUser?.name}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
        {error && <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"><AlertCircle className="h-5 w-5" />{error}</div>}
        {actionError && <div role="alert" className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"><AlertCircle className="h-5 w-5" />{actionError}</div>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Total users', value: users.length, icon: Users, color: 'text-blue-700' },
            { label: 'Active accounts', value: activeUsers, icon: CheckCircle, color: 'text-emerald-600' },
            { label: 'Suspended accounts', value: suspendedUsers, icon: Shield, color: 'text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-500">{stat.label}</span><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
            <div><h2 className="flex items-center gap-2 text-lg font-bold text-gray-900"><Users className="h-5 w-5 text-blue-700" />User management</h2><p className="mt-1 text-sm text-gray-500">Manage account status and administrator access.</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input aria-label="Search users" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search users" className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" /></label>
              <select aria-label="Filter users by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
            </div>
          </div>
          {isLoading ? <div className="p-8 text-center text-gray-500">Loading users...</div> : filteredUsers.length === 0 ? <div className="p-8 text-center text-gray-500">No users found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-180 text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredUsers.map(user => <tr key={user.id}><td className="px-5 py-4"><button onClick={() => openUserDetail(user)} className="text-left"><div className="font-semibold text-blue-700 hover:underline">{user.name}</div><div className="text-gray-500">{user.email}</div></button></td><td className="px-5 py-4"><select value={user.role} onChange={event => updateUser(user.id, { role: event.target.value })} className="rounded border border-gray-300 px-2 py-1"><option value="customer">Customer</option><option value="admin">Admin</option></select></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{user.status}</span></td><td className="px-5 py-4 text-gray-500">{formatDate(user.created_at)}</td><td className="px-5 py-4">{user.id === currentUser?.id ? <span className="text-xs text-gray-400">Current account</span> : <button onClick={() => updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })} className="rounded-lg border border-gray-300 px-3 py-2 font-medium hover:bg-gray-50">{user.status === 'active' ? 'Suspend' : 'Activate'}</button>}{updatedUserId === user.id && <span className="ml-2 text-xs text-emerald-600">Saved</span>}</td></tr>)}</tbody></table></div>}
        </section>

        {selectedUser && <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-5"><div><h2 className="text-lg font-bold text-gray-900">User operations</h2><p className="mt-1 text-sm text-gray-500">Profile, account, and transaction controls for {selectedUser.name}.</p></div><button onClick={() => { setSelectedUser(null); setUserDetail(null) }} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close user operations"><X className="h-5 w-5" /></button></div>
          {detailLoading ? <div className="p-8 text-center text-gray-500">Loading user details...</div> : userDetail && <div className="space-y-6 p-5">
            <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"><label className="text-sm font-medium text-gray-700">Name<input value={profileForm.name} onChange={event => setProfileForm({ ...profileForm, name: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label><label className="text-sm font-medium text-gray-700">Email<input type="email" value={profileForm.email} onChange={event => setProfileForm({ ...profileForm, email: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label><button className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">Save profile</button></form>
            <div><h3 className="mb-3 font-semibold text-gray-900">Accounts</h3><div className="grid gap-3 md:grid-cols-2">{userDetail.accounts.map(account => <div key={account.id} className="rounded-lg border border-gray-200 p-4"><p className="font-medium text-gray-900">{account.name} ({account.currency})</p><label className="mt-3 block text-xs text-gray-500">Balance cents<input type="number" min="0" value={account.balance_cents} onChange={event => saveAccount(account, 'balance_cents', event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm" /></label><label className="mt-2 block text-xs text-gray-500">Pending cents<input type="number" min="0" value={account.pending_cents} onChange={event => saveAccount(account, 'pending_cents', event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm" /></label></div>)}</div></div>
            <form onSubmit={saveSection}><h3 className="mb-3 font-semibold text-gray-900">Customer sections</h3><div className="flex flex-wrap gap-2">{sectionNames.map(section => <button type="button" key={section} onClick={() => selectSection(section)} className={`rounded-lg px-3 py-2 text-sm font-medium ${selectedSection === section ? 'bg-blue-700 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{section}</button>)}</div><textarea aria-label={`${selectedSection} data`} value={sectionText} onChange={event => setSectionText(event.target.value)} className="mt-3 min-h-40 w-full rounded-lg border border-gray-300 p-3 font-mono text-xs" /><div className="mt-3 flex items-center justify-between"><p className="text-xs text-gray-500">Structured JSON is stored and every save is audited.</p><button className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">Save {selectedSection}</button></div></form>
            <div><h3 className="mb-3 font-semibold text-gray-900">Transactions</h3><div className="overflow-x-auto"><table className="w-full min-w-180 text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-3 py-2">Description</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{userDetail.transactions.map(transaction => <tr key={transaction.id}><td className="px-3 py-3">{transaction.description}</td><td className="px-3 py-3">{(Number(transaction.amount_cents) / 100).toFixed(2)}</td><td className="px-3 py-3"><select value={transaction.status} onChange={event => updateTransaction(transaction, event.target.value)} className="rounded border border-gray-300 px-2 py-1"><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option></select></td></tr>)}</tbody></table></div></div>
          </div>}
        </section>}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5"><h2 className="flex items-center gap-2 text-lg font-bold text-gray-900"><ClipboardList className="h-5 w-5 text-blue-700" />Audit activity</h2><p className="mt-1 text-sm text-gray-500">Recent security and administrative events.</p></div>
          <div className="divide-y divide-gray-100">{auditLogs.slice(0, 12).map(log => <div key={log.id} className="flex items-start gap-3 p-4"><Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div className="min-w-0 flex-1"><p className="font-medium text-gray-900">{log.action}</p><p className="truncate text-xs text-gray-500">Resource: {log.resource}</p></div><time className="shrink-0 text-xs text-gray-500">{formatDate(log.created_at)}</time></div>)}{auditLogs.length === 0 && <p className="p-6 text-sm text-gray-500">No audit activity yet.</p>}</div>
        </section>
        <p className="text-xs text-gray-500">{adminUsers} administrator account{adminUsers === 1 ? '' : 's'} currently provisioned.</p>
      </main>
    </div>
  )
}