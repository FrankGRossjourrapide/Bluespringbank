import React, { useState, useMemo } from 'react'
import { Menu, ChevronDown, Bell, Plus, ArrowLeftRight, Wallet, Clock, DollarSign, TrendingUp, TrendingDown, Eye, EyeOff, CreditCard, Send, Download, BarChart3, AlertCircle, CheckCircle, Info, Shield, X, User } from 'lucide-react'
import { getTranslation } from '../utils/languageTranslations'

export default function Home({ totalBalance, pendingBalance, transactions, setCurrentView, setShowSidebar, showNotification, setShowNotification, preferences, notifications = [], handleLogout }) {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState('primary')
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [dismissedAlerts, setDismissedAlerts] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [alertFilter, setAlertFilter] = useState('all')
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  // Formatting functions
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const timezone = preferences?.timezone || 'EST'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone === 'EST' ? 'America/New_York' :
                timezone === 'CST' ? 'America/Chicago' :
                timezone === 'MST' ? 'America/Denver' :
                timezone === 'PST' ? 'America/Los_Angeles' : 'UTC'
    })
  }

  const getLanguageLabel = () => {
    const labels = { 'English': 'English', 'Spanish': 'Español', 'French': 'Français', 'German': 'Deutsch', 'Mandarin': '中文' }
    return labels[preferences?.language] || 'English'
  }

  const percentageChange = -50.4
  
  const accounts = [
    { id: 'primary', name: 'Checking Account', type: 'Checking', balance: totalBalance, color: 'from-blue-900 to-blue-800' },
    { id: 'savings', name: 'Savings Account', type: 'Savings', balance: 15250.00, color: 'from-green-900 to-green-800' },
    { id: 'mm', name: 'Money Market', type: 'Money Market', balance: 8500.00, color: 'from-purple-900 to-purple-800' }
  ]

  const currentAccount = accounts.find(acc => acc.id === selectedAccount)

  // Calculate spending by category from transactions
  const spendingByCategory = useMemo(() => {
    const categories = {
      'Groceries': { amount: 0, icon: '', keywords: ['grocery', 'safeway', 'whole'] },
      'Utilities': { amount: 0, icon: '', keywords: ['electric', 'gas', 'water', 'utility'] },
      'Entertainment': { amount: 0, icon: '', keywords: ['movie', 'netflix', 'spotify', 'cinema'] },
      'Transportation': { amount: 0, icon: '', keywords: ['uber', 'gas', 'parking', 'transit'] },
      'Healthcare': { amount: 0, icon: '', keywords: ['pharmacy', 'medical', 'doctor', 'hospital'] },
      'Other': { amount: 0, icon: '', keywords: [] }
    }

    transactions.forEach(tx => {
      if (tx.type === 'withdrawal') {
        const desc = tx.description.toLowerCase()
        let found = false
        for (const [category, data] of Object.entries(categories)) {
          if (data.keywords.some(keyword => desc.includes(keyword))) {
            categories[category].amount += tx.amount
            found = true
            break
          }
        }
        if (!found) {
          categories['Other'].amount += tx.amount
        }
      }
    })

    const total = Object.values(categories).reduce((sum, cat) => sum + cat.amount, 0)
    const result = Object.entries(categories).map(([name, data]) => ({
      category: name,
      amount: data.amount,
      percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
      icon: data.icon
    })).sort((a, b) => b.amount - a.amount)

    return result
  }, [transactions])

  const totalSpending = spendingByCategory.reduce((sum, item) => sum + item.amount, 0)

  // Calculate statistics
  const stats = useMemo(() => {
    const deposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0)
    const withdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)
    const savings = deposits - withdrawals

    return {
      creditScore: '750',
      monthlySpend: totalSpending.toFixed(2),
      savingsRate: deposits > 0 ? Math.round((savings / deposits) * 100) : 0,
      accounts: accounts.length
    }
  }, [transactions, totalSpending])

  // Generated alerts based on data
  const alerts = useMemo(() => {
    const depositAmount = transactions.find(t => t.type === 'deposit')?.amount
    const generatedAlerts = [
      { 
        id: 1, 
        type: 'success', 
        message: 'Direct deposit received', 
        amount: depositAmount ? `+${formatCurrency(depositAmount)}` : `+${formatCurrency(2500)}`,
        icon: CheckCircle,
        dismissible: true
      },
      { 
        id: 2, 
        type: totalBalance < 1000 ? 'warning' : 'info', 
        message: totalBalance < 1000 ? 'Low balance alert' : 'Balance healthy', 
        amount: formatCurrency(totalBalance),
        icon: AlertCircle,
        dismissible: true
      },
      { 
        id: 3, 
        type: 'info', 
        message: 'Credit score improved', 
        score: stats.creditScore,
        icon: Info,
        dismissible: false
      }
    ]
    return generatedAlerts.filter(a => !dismissedAlerts.includes(a.id))
  }, [totalBalance, transactions, stats, dismissedAlerts, preferences])

  const dismissAlert = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId])
  }

  const quickStats = useMemo(() => [
    { label: getTranslation('Credit Score', preferences?.language), value: stats.creditScore, color: 'text-green-600', icon: CreditCard },
    { label: getTranslation('Monthly Spend', preferences?.language), value: formatCurrency(parseFloat(stats.monthlySpend)), color: 'text-red-600', icon: TrendingDown },
    { label: getTranslation('Savings Rate', preferences?.language), value: `${stats.savingsRate}%`, color: 'text-blue-600', icon: TrendingUp },
    { label: getTranslation('Accounts', preferences?.language), value: stats.accounts.toString(), color: 'text-purple-600', icon: Wallet }
  ], [stats, preferences?.language])

  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') {
      return transactions.slice(0, 10)
    }
    return transactions.filter(t => t.type === transactionFilter).slice(0, 10)
  }, [transactions, transactionFilter])

  const handleAccountSelect = (accountId) => {
    setSelectedAccount(accountId)
    setShowAccountMenu(false)
  }

  const handleQuickAction = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="flex-1 overflow-y-auto w-full" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-3 md:p-4 lg:p-6 sticky top-0 z-30" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
          <button onClick={() => setShowSidebar(true)} className="hover:opacity-80 active:opacity-60 transition p-1 md:p-2 min-h-10 min-w-10 touch:min-h-10 touch:min-w-10">
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="flex items-center gap-2 md:gap-3 bg-blue-800 bg-opacity-50 rounded-lg px-2 md:px-4 py-2 flex-1 min-w-0 cursor-pointer hover:bg-opacity-70 active:bg-opacity-60 transition" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-amber-200 to-amber-400 rounded shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs md:text-sm truncate">Blue Spring Bank</div>
              <div className="text-xs opacity-90 truncate">{currentAccount.name}</div>
            </div>
            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 shrink-0 transition ${showAccountMenu ? 'rotate-180' : ''}`} />
          </div>
          <button onClick={() => setShowNotification(!showNotification)} className="relative hover:opacity-80 active:opacity-60 transition p-1 md:p-2 min-h-10 min-w-10 touch:min-h-10 touch:min-w-10">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
            {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></span>}
          </button>
          <button onClick={() => setShowProfileOptions(!showProfileOptions)} className="relative hover:opacity-80 active:opacity-60 transition p-1 md:p-2 min-h-10 min-w-10 md:min-h-auto md:min-w-auto">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base border-2 border-white">So</div>
          </button>
        </div>

        {/* Account Selection Dropdown */}
        {showAccountMenu && (
          <div className="absolute left-4 right-4 md:left-auto md:right-6 top-16 bg-white text-gray-900 rounded-lg shadow-lg z-40 md:w-64 max-h-64 overflow-y-auto">
            <div className="p-3 space-y-1 md:space-y-2">
              {accounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => handleAccountSelect(account.id)}
                  className={`w-full text-left p-3 md:p-4 rounded-lg transition min-h-12 md:min-h-auto ${  
                    selectedAccount === account.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm md:text-base">{account.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">{formatCurrency(account.balance)}</div>
                  <div className="text-xs text-gray-500">{account.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Options Dropdown */}
        {showProfileOptions && (
          <div className="absolute right-3 md:right-4 top-16 bg-white text-gray-900 rounded-lg shadow-lg z-40 w-72 overflow-hidden">
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">So</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">Sound Cloud</div>
                  <div className="text-xs text-gray-600 truncate">sound3502@gmail.com</div>
                  <div className="text-xs text-gray-500 mt-1">Customer ID: 71544879</div>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-2">
              <button
                onClick={() => { setCurrentView('profile-settings'); setShowProfileOptions(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition text-left text-sm"
              >
                <User className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="font-medium text-gray-900">Profile Settings</span>
              </button>

              <button
                onClick={() => { setCurrentView('profile-settings'); setShowProfileOptions(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition text-left text-sm"
              >
                <CreditCard className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="font-medium text-gray-900">Account Settings</span>
              </button>

              <button
                onClick={() => { setCurrentView('kyc'); setShowProfileOptions(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition text-left text-sm"
              >
                <Shield className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="font-medium text-gray-900">Security Settings</span>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={() => { setShowProfileOptions(false); handleLogout(); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 active:bg-red-100 transition text-left text-sm"
              >
                <X className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {showWelcome && (
            <>
              <span className="text-base md:text-lg font-semibold">{getTranslation('Welcome back!', preferences?.language)}  </span>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-white hover:opacity-70 active:opacity-50 transition p-1"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto w-full">
        {/* Quick Action Buttons */}
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={() => handleQuickAction('deposit')}
            className="flex-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 md:px-6 py-3 md:py-4 rounded-lg font-semibold transition transform active:scale-95 min-h-12 md:min-h-auto touch:min-h-12"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Deposit</span>
          </button>
          <button 
            onClick={() => handleQuickAction('transfer')}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-white border-2 border-gray-300 text-gray-900 px-2 md:px-4 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-200 transition transform active:scale-95 min-h-12 md:min-h-auto touch:min-h-12"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm md:text-base">Transfer</span>
          </button>
          <button 
            onClick={() => handleQuickAction('debit-card')}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-white border-2 border-gray-300 text-gray-900 px-2 md:px-4 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-200 transition transform active:scale-95 min-h-12 md:min-h-auto touch:min-h-12"
          >
            <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm md:text-base">Cards</span>
          </button>
          <button 
            onClick={() => handleQuickAction('statements')}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-white border-2 border-gray-300 text-gray-900 px-2 md:px-4 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-200 transition transform active:scale-95 min-h-12 md:min-h-auto touch:min-h-12"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm md:text-base">Statements</span>
          </button>
        </div>

        {/* Account Balance Card */}
        <div className={`bg-linear-to-br ${currentAccount.color} text-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 sm:mb-8 gap-3">
            <div>
              <span className="text-xs opacity-75 uppercase tracking-wider font-bold text-xs md:text-sm">Total Balance</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="bg-white rounded-full p-2 md:p-3 transition-all active:scale-110 cursor-pointer border-2 border-white shadow-lg min-h-10 min-w-10 md:min-h-12 md:min-w-12 touch:min-h-10 touch:min-w-10 flex items-center justify-center"
                title={balanceVisible ? 'Hide balance' : 'Show balance'}
              >
                {balanceVisible ? <Eye className="w-5 h-5 md:w-6 md:h-6 text-blue-900" /> : <EyeOff className="w-5 h-5 md:w-6 md:h-6 text-blue-900" />}
              </button>
              <div className="bg-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold border-2 border-white shadow-lg">
                <span className="inline-block w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 mr-2 md:mr-2.5 animate-pulse"></span>
                <span className="text-gray-900 text-xs md:text-sm">{currentAccount.type}</span>
              </div>
            </div>
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-mono tracking-tight break-words">
            {balanceVisible ? formatCurrency(currentAccount.balance) : '••••••••'}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 md:pt-6 border-t border-white border-opacity-20 gap-4">
            <div>
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Change</div>
              <div className={`flex items-center gap-2 font-semibold text-sm md:text-base ${percentageChange < 0 ? 'text-red-300' : 'text-green-300'}`}>
                {percentageChange > 0 ? '↑' : '↓'} {Math.abs(percentageChange)}%
                <span className="text-xs opacity-60 font-normal">vs. last month</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-60 uppercase tracking-wider mb-1">Account</div>
              <div className="font-semibold">{currentAccount.type}</div>
              <div className="text-xs opacity-60">Updated just now</div>
            </div>
          </div>
        </div>

        {/* Account Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <span className="text-gray-700 font-medium text-sm md:text-base">Available</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(currentAccount.balance)}</div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">Ready to use</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <span className="text-gray-700 font-medium text-sm md:text-base">Pending</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">${pendingBalance.toFixed(2)}</div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">Processing</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                  <span className="text-xs text-gray-600 font-medium">{stat.label}</span>
                </div>
                <div className={`text-lg md:text-2xl font-bold ${stat.color} break-words`}>{stat.value}</div>
              </div>
            )
          })}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{getTranslation('Recent Alerts', preferences?.language)}</h3>
            <div className="space-y-3">
              {alerts.map(alert => {
                const Icon = alert.icon
                return (
                  <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                    alert.type === 'success' ? 'bg-green-50' :
                    alert.type === 'warning' ? 'bg-yellow-50' :
                    'bg-blue-50'
                  }`}>
                    <Icon className={`w-6 h-6 shrink-0 ${
                      alert.type === 'success' ? 'text-green-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${
                        alert.type === 'success' ? 'text-green-900' :
                        alert.type === 'warning' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {alert.message}
                      </p>
                      <p className="text-sm opacity-75">{alert.amount || alert.score}</p>
                    </div>
                    {alert.dismissible && (
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="hover:opacity-60 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Spending Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            {getTranslation('Spending This Month', preferences?.language)}
          </h3>
          <div className="space-y-3">
            {spendingByCategory.map((item, idx) => (
              <div key={idx} className="space-y-1 hover:bg-gray-50 p-2 rounded transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-semibold text-gray-900">{item.category}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{item.percentage}% of total</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{getTranslation('Total Spending', preferences?.language)}</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(totalSpending)}</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{getTranslation('Recent Transactions', preferences?.language)}</h3>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {['all', 'deposit', 'withdrawal', 'transfer'].map(filter => (
              <button
                key={filter}
                onClick={() => setTransactionFilter(filter)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition transform hover:scale-105 ${
                  transactionFilter === filter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <div 
                  key={transaction.id} 
                  onClick={() => setSelectedTransaction(selectedTransaction?.id === transaction.id ? null : transaction)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      transaction.type === 'deposit' ? 'bg-green-100' :
                      transaction.type === 'withdrawal' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {transaction.type === 'deposit' ? <Plus className={`w-6 h-6 text-green-600`} /> :
                       transaction.type === 'withdrawal' ? <DollarSign className={`w-6 h-6 text-red-600`} /> :
                       <ArrowLeftRight className={`w-6 h-6 text-blue-600`} />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{formatTime(transaction.date)}</div>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {getTranslation('No transactions found', preferences?.language)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
