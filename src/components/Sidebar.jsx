import React from 'react'
import { X, Clock, FileText, Send, Globe, Users, History, User, Shield, LogOut, CreditCard } from 'lucide-react'

export default function Sidebar({ setShowSidebar, setCurrentView, handleLogout, currentUser }) {
  const customerMenuItems = [
    { icon: Clock, label: 'Account History', view: 'history', section: 'ACCOUNT' },
    { icon: FileText, label: 'Statements', view: 'statements', section: 'ACCOUNT' },
    { icon: CreditCard, label: 'Debit Cards', view: 'debit-card', section: 'CARDS' },
    { icon: Send, label: 'Local Transfer', view: 'local-transfer', section: 'FUND TRANSFER' },
    { icon: Globe, label: 'International Transfer', view: 'international', section: 'FUND TRANSFER' },
    { icon: Users, label: 'Beneficiaries', view: 'beneficiaries', section: 'FUND TRANSFER' },
    { icon: FileText, label: 'Cheque Deposit', view: 'cheque', section: 'DEPOSITS' },
    { icon: History, label: 'Deposit History', view: 'deposit-history', section: 'DEPOSITS' },
    { icon: User, label: 'Profile Settings', view: 'profile-settings', section: 'USER' },
    { icon: Shield, label: 'KYC Verification', view: 'kyc', section: 'USER' },
    { icon: LogOut, label: 'Logout', view: 'logout', section: 'SECURITY', isLogout: true },
  ]
  const menuItems = currentUser?.role === 'admin'
    ? [{ icon: Shield, label: 'Admin Dashboard', view: 'admin', section: 'ADMIN' }, { icon: LogOut, label: 'Logout', view: 'logout', section: 'SECURITY', isLogout: true }]
    : customerMenuItems

  const handleMenuClick = (view) => {
    if (view === 'logout') {
      handleLogout()
    } else {
      setCurrentView(view)
    }
    setShowSidebar(false)
  }

  return (
    <div>
      <div className="fixed inset-0 bg-black/20 z-40 md:hidden pointer-events-auto" onClick={() => setShowSidebar(false)}></div>
      <div className="fixed left-0 top-0 bottom-0 w-56 md:w-72 bg-white z-50 shadow-2xl overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Header with Logo */}
        <div className="bg-white p-3 md:p-4 border-b border-gray-200 sticky top-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-800 leading-tight">BLUE SPRING</div>
                <div className="text-xs font-bold text-gray-800 leading-tight">CAPITALS BANK</div>
              </div>
            </div>
            <button onClick={() => setShowSidebar(false)} className="text-gray-600 hover:text-gray-900 transition p-1 shrink-0 min-h-10 min-w-10 touch:min-h-10 touch:min-w-10">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">So</div>
            <div className="min-w-0">
              <div className="text-gray-800 font-semibold text-sm truncate">{currentUser?.name || 'Sound Cloud'}</div>
              <div className="text-gray-500 text-xs truncate">{currentUser?.role === 'admin' ? 'Administrator' : 'Customer'}</div>
            </div>
          </div>
          <div className="text-gray-500 text-xs mt-2">09 Jan 2026<br />05:18 PM UTC</div>
        </div>

        {/* Menu Items */}
        <nav className="p-2 md:p-3 space-y-1">
          {menuItems.map((item, idx) => {
            const showSection = idx === 0 || menuItems[idx - 1].section !== item.section
            const Icon = item.icon
            return (
              <div key={item.view}>
                {showSection && (
                  <div className="text-xs font-bold text-gray-600 px-3 py-2 uppercase tracking-wide mt-4 md:mt-6 mb-2">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => handleMenuClick(item.view)}
                  className={`flex items-center gap-3 w-full p-3 md:p-4 rounded-lg transition min-h-12 touch:min-h-12 ${
                    item.isLogout
                      ? 'hover:bg-red-50 text-red-600 active:bg-red-100'
                      : 'hover:bg-gray-100 text-gray-700 active:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                  <span className={`text-sm md:text-base ${item.isLogout ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
