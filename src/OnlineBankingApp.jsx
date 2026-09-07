import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Deposit from './components/Deposit'
import Transfer from './components/Transfer'
import Account from './components/Account'
import History from './components/History'
import Statements from './components/Statements'
import International from './components/International'
import Beneficiaries from './components/Beneficiaries'
import Cheque from './components/Cheque'
import DepositHistory from './components/DepositHistory'
import ProfileSettings from './components/ProfileSettings'
import KYC from './components/KYC'
import DebitCard from './components/DebitCard'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Notification from './components/Notification'
import AdminDashboard from './components/AdminDashboard'
import { api } from './services/api'

export default function OnlineBankingApp() {
  const [currentView, setCurrentView] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [totalBalance, setTotalBalance] = useState(72139.59)
  const [pendingBalance, setPendingBalance] = useState(2084.5)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'deposit', amount: 1500, date: '2026-01-12', description: 'Salary Payment', status: 'completed' },
    { id: 2, type: 'withdrawal', amount: 350, date: '2026-01-11', description: 'Grocery Shopping', status: 'completed' },
    { id: 3, type: 'transfer', amount: 200, date: '2026-01-10', description: 'Transfer to Savings', status: 'pending' },
    { id: 4, type: 'withdrawal', amount: 320, date: '2026-01-09', description: 'Online Shopping', status: 'pending' },
    { id: 5, type: 'withdrawal', amount: 120, date: '2026-01-08', description: 'Utility Bills', status: 'pending' },
    { id: 6, type: 'withdrawal', amount: 210, date: '2026-01-07', description: 'Restaurant', status: 'completed' },
    { id: 7, type: 'deposit', amount: 185, date: '2026-01-06', description: 'Freelance Payment', status: 'completed' },
    { id: 8, type: 'withdrawal', amount: 210, date: '2026-01-05', description: 'Gas Station', status: 'completed' },
  ])

  const [depositAmount, setDepositAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'security', title: 'Welcome to Blue Spring Bank', description: 'Your account has been set up successfully. Keep your credentials secure.', timestamp: 'just now', read: false }
  ])

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Global preferences state
  const [preferences, setPreferences] = useState({
    language: 'English',
    currency: 'USD',
    timezone: 'EST',
    theme: 'light',
    defaultAccount: 'Checking',
    statementDelivery: 'Monthly',
    alertThreshold: 5000,
    hideBalancePublic: false
  })

  // Helper function to add notifications
  const addNotification = (type, title, description) => {
    const newNotification = {
      id: Date.now(),
      type, // 'transaction', 'security', 'alert'
      title,
      description,
      timestamp: 'just now',
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('bankPreferences')
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  // Apply theme globally and save preferences
  useEffect(() => {
    localStorage.setItem('bankPreferences', JSON.stringify(preferences))
    const isDarkMode = preferences.theme === 'dark' || 
      (preferences.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [preferences])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)
    try {
      const result = await api.login({ email: loginEmail, password: loginPassword })
      setCurrentUser(result.user)
      setIsLoggedIn(true)
      setCurrentView(result.user.role === 'admin' ? 'admin' : 'home')
      const account = (await api.me()).account
      setTotalBalance(Number(account.balance_cents) / 100)
      const history = await api.transactions()
      setTransactions(history.transactions.map(transaction => ({ ...transaction, amount: Number(transaction.amount_cents) / 100, date: transaction.created_at })))
      addNotification('security', 'Login Successful', `Welcome back, ${result.user.name}.`)
      setLoginEmail('')
      setLoginPassword('')
    } catch (error) { setAuthError(error.message) } finally { setIsLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (registerName && registerEmail && registerPassword && registerPassword === registerConfirmPassword) {
      setAuthError('')
      setIsLoading(true)
      try {
        await api.register({ name: registerName, email: registerEmail, password: registerPassword })
        setCurrentUser({ name: registerName, role: 'customer' })
        setIsLoggedIn(true)
        setCurrentView('home')
        addNotification('transaction', 'Account Created Successfully', `Welcome ${registerName}! Your account is ready to use.`)
        setRegisterName('')
        setRegisterEmail('')
        setRegisterPassword('')
        setRegisterConfirmPassword('')
      } catch (error) { setAuthError(error.message) } finally { setIsLoading(false) }
    } else if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match!')
    }
  }

  const handleLogout = () => {
    api.logout()
    setCurrentUser(null)
    setIsLoggedIn(false)
    addNotification('security', 'You have logged out', 'You have been successfully logged out from your account.')
    setNotifications([])
    setCurrentView('login')
    setShowSidebar(false)
    setLoginEmail('')
    setLoginPassword('')
  }

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (amount > 0) {
      try {
        await api.deposit({ amount, description: 'Deposit' })
        const account = (await api.me()).account
        setTotalBalance(Number(account.balance_cents) / 100)
        const history = await api.transactions()
        setTransactions(history.transactions.map(transaction => ({ ...transaction, amount: Number(transaction.amount_cents) / 100, date: transaction.created_at })))
        setDepositAmount('')
        setShowNotification(true)
        addNotification('transaction', 'Deposit Completed', `Your deposit of ${amount.toFixed(2)} was completed.`)
        setCurrentView('home')
      } catch (error) { addNotification('alert', 'Deposit Failed', error.message) }
    }
  }

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount)
    if (amount > 0 && amount <= totalBalance && transferTo.trim()) {
      try {
        await api.transfer({ amount, description: `Transfer to ${transferTo}` })
        const account = (await api.me()).account
        setTotalBalance(Number(account.balance_cents) / 100)
        setPendingBalance(Number(account.pending_cents) / 100)
        const history = await api.transactions()
        setTransactions(history.transactions.map(transaction => ({ ...transaction, amount: Number(transaction.amount_cents) / 100, date: transaction.created_at })))
        setTransferAmount('')
        setTransferTo('')
        setShowNotification(true)
        addNotification('transaction', 'Transfer Initiated', `Transfer of ${amount.toFixed(2)} to ${transferTo} is pending.`)
        setCurrentView('home')
      } catch (error) { addNotification('alert', 'Transfer Failed', error.message) }
    }
  }

  return (
    <div className="w-screen h-screen md:h-dvh lg:h-dvh bg-gray-50 flex flex-col max-w-2xl mx-auto lg:max-w-none relative overflow-hidden" style={{ height: '100dvh', maxHeight: '100dvh' }}>
      {!isLoggedIn && currentView === 'login' && <Login loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} onLogin={handleLogin} onSwitchToRegister={() => { setAuthError(''); setCurrentView('register') }} authError={authError} isLoading={isLoading} />}
      {!isLoggedIn && currentView === 'register' && <Register registerName={registerName} setRegisterName={setRegisterName} registerEmail={registerEmail} setRegisterEmail={setRegisterEmail} registerPassword={registerPassword} setRegisterPassword={setRegisterPassword} registerConfirmPassword={registerConfirmPassword} setRegisterConfirmPassword={setRegisterConfirmPassword} onRegister={handleRegister} onSwitchToLogin={() => { setAuthError(''); setCurrentView('login') }} authError={authError} isLoading={isLoading} />}

      {isLoggedIn && (
        <>
          {showSidebar && <Sidebar setShowSidebar={setShowSidebar} setCurrentView={setCurrentView} handleLogout={handleLogout} currentUser={currentUser} />}

          {currentView === 'admin' && currentUser?.role === 'admin' && <AdminDashboard currentUser={currentUser} setCurrentView={setCurrentView} />}
          {currentView === 'home' && <Home totalBalance={totalBalance} pendingBalance={pendingBalance} transactions={transactions} setCurrentView={setCurrentView} setShowSidebar={setShowSidebar} showNotification={showNotification} setShowNotification={setShowNotification} preferences={preferences} notifications={notifications} handleLogout={handleLogout} />}
          {currentView === 'deposit' && <Deposit depositAmount={depositAmount} setDepositAmount={setDepositAmount} handleDeposit={handleDeposit} setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'transfer' && <Transfer transferAmount={transferAmount} setTransferAmount={setTransferAmount} transferTo={transferTo} setTransferTo={setTransferTo} handleTransfer={handleTransfer} totalBalance={totalBalance} setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'account' && <Account />}
          {currentView === 'history' && <History transactions={transactions} setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'statements' && <Statements setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'local-transfer' && <Transfer transferAmount={transferAmount} setTransferAmount={setTransferAmount} transferTo={transferTo} setTransferTo={setTransferTo} handleTransfer={handleTransfer} totalBalance={totalBalance} setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'international' && <International setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'beneficiaries' && <Beneficiaries />}
          {currentView === 'cheque' && <Cheque setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'debit-card' && <DebitCard setCurrentView={setCurrentView} preferences={preferences} />}
          {currentView === 'deposit-history' && <DepositHistory transactions={transactions} preferences={preferences} />}
          {currentView === 'profile-settings' && <ProfileSettings setCurrentView={setCurrentView} preferences={preferences} setPreferences={setPreferences} />}
          {currentView === 'kyc' && <KYC />}

          <Notification showNotification={showNotification} setShowNotification={setShowNotification} notifications={notifications} setNotifications={setNotifications} />
          <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
        </>
      )}
    </div>
  )
}
