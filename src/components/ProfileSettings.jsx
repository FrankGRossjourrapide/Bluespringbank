import React, { useState } from 'react'
import { ChevronLeft, Eye, EyeOff, Bell, Lock, Shield, LogOut, Info, CheckCircle, AlertCircle, Smartphone, Mail, Phone, Globe } from 'lucide-react'

export default function ProfileSettings({ setCurrentView, preferences, setPreferences }) {
  const [activeTab, setActiveTab] = useState('personal')
  const [successMessage, setSuccessMessage] = useState('')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)
  const [formData, setFormData] = useState({
    fullName: 'Sound Cloud',
    email: 'soundcloud@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Financial Street, New York, NY 10001'
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    securityQuestion: 'What is your mother\'s maiden name?',
    securityAnswer: '',
    biometricEnabled: true
  })

  const [notifications, setNotifications] = useState({
    emailTransactions: true,
    emailPromotions: false,
    smsAlerts: true,
    pushNotifications: true,
    monthlyStatement: true,
    securityAlerts: true,
    newFeatures: false
  })

  const [privacy, setPrivacy] = useState({
    shareData: false,
    marketingEmails: false,
    cookies: true,
    deviceTracking: false,
    thirdPartySharing: false
  })

  const [linkedDevices, setLinkedDevices] = useState([
    { id: 1, name: 'iPhone 14 Pro', type: 'Mobile', lastAccess: '2 hours ago', status: 'Active' },
    { id: 2, name: 'MacBook Pro', type: 'Desktop', lastAccess: '1 day ago', status: 'Active' },
    { id: 3, name: 'iPad Air', type: 'Tablet', lastAccess: '3 days ago', status: 'Inactive' }
  ])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (activeTab === 'personal') {
      setFormData(prev => ({ ...prev, [name]: value }))
    } else if (activeTab === 'security') {
      setSecurityData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    } else if (activeTab === 'notifications') {
      setNotifications(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    } else if (activeTab === 'privacy') {
      setPrivacy(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    } else if (activeTab === 'preferences') {
      setPreferences(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleSave = () => {
    const savingMessage = activeTab === 'preferences' 
      ? `✅ Preferences Saved!\n📝 Language: ${getLanguageName()}\n💱 Currency: ${preferences.currency}\n🕐 Timezone: ${preferences.timezone.split(' ')[0]}\n🎨 Theme: ${preferences.theme}\n📊 Default Account: ${getAccountName(preferences.defaultAccount)}`
      : '✅ Settings saved successfully!'
    
    setSuccessMessage(savingMessage)
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  const handleRemoveDevice = (deviceId) => {
    setLinkedDevices(prev => prev.filter(device => device.id !== deviceId))
    setSuccessMessage('Device removed successfully')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setSuccessMessage('❌ Only image files (JPG, PNG, GIF, WebP) are allowed')
      setTimeout(() => setSuccessMessage(''), 3000)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSuccessMessage('❌ File size must be less than 5MB')
      setTimeout(() => setSuccessMessage(''), 3000)
      return
    }

    setProfilePhoto(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfilePhotoPreview(event.target?.result)
    }
    reader.readAsDataURL(file)
    setSuccessMessage('✅ Photo updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const triggerPhotoInput = () => {
    document.getElementById('photoInput')?.click()
  }

  // Format currency based on preference
  const formatCurrency = (amount) => {
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$'
    }
    const symbol = currencySymbols[preferences.currency] || '$'
    return `${symbol}${amount.toLocaleString()}`
  }

  // Get language display name
  const getLanguageName = () => {
    const langNames = {
      'English': 'English',
      'Spanish': 'Español',
      'French': 'Français',
      'German': 'Deutsch',
      'Mandarin': '中文'
    }
    return langNames[preferences.language] || preferences.language
  }

  // Format time based on timezone
  const formatTime = () => {
    const timezones = {
      'EST (Eastern Standard Time)': 'America/New_York',
      'CST (Central Standard Time)': 'America/Chicago',
      'MST (Mountain Standard Time)': 'America/Denver',
      'PST (Pacific Standard Time)': 'America/Los_Angeles',
      'GMT (Greenwich Mean Time)': 'Europe/London'
    }
    const tzName = timezones[preferences.timezone] || 'UTC'
    return new Date().toLocaleString('en-US', { timeZone: tzName })
  }

  // Get account name by ID
  const getAccountName = (id) => {
    const accounts = {
      'primary': 'Checking Account',
      'savings': 'Savings Account',
      'mm': 'Money Market Account'
    }
    return accounts[id] || id
  }

  const isDarkMode = preferences.theme === 'dark' || (preferences.theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  const isAutoMode = preferences.theme === 'auto'

  return (
    <div className={`flex-1 overflow-y-auto pb-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>
        <p className="text-blue-100 text-sm mt-2">Manage your account and preferences</p>
      </div>

      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Success Message */}
        {successMessage && (
          <div className={`mb-6 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3 ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
            <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <div className={`font-medium whitespace-pre-wrap ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>{successMessage}</div>
          </div>
        )}

        {/* Settings Tabs */}
        <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {[
            { id: 'personal', label: 'Personal', icon: ' ' },
            { id: 'security', label: 'Security', icon: ' ' },
            { id: 'notifications', label: 'Notifications', icon: ' ' },
            { id: 'privacy', label: 'Privacy', icon: ' ' },
            { id: 'preferences', label: 'Preferences', icon: ' ' },
            { id: 'devices', label: 'Devices', icon: ' ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? isDarkMode ? 'border-b-2 border-blue-400 text-blue-400' : 'border-b-2 border-blue-900 text-blue-900'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Personal Information</h3>
            
            {/* Profile Picture */}
            <div className="mb-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-linear-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  'SC'
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={triggerPhotoInput} className={`px-6 py-2 border-2 rounded-lg font-medium transition ${isDarkMode ? 'border-blue-400 text-blue-400 hover:bg-blue-900' : 'border-blue-900 text-blue-900 hover:bg-blue-50'}`}>
                  Change Photo
                </button>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Max 5MB • JPG, PNG, GIF, WebP</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                />
              </div>
              <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 space-y-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Security Settings</h3>

            {/* Password Change */}
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="Confirm new password"
                  />
                </div>
                <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Two-Factor Authentication (2FA)</h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add an extra layer of security to your account</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactorEnabled"
                    checked={securityData.twoFactorEnabled}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className={`ml-2 font-medium ${securityData.twoFactorEnabled ? isDarkMode ? 'text-green-400' : 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            {/* Biometric Authentication */}
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Biometric Authentication</h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Use fingerprint or face recognition for faster login</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="biometricEnabled"
                    checked={securityData.biometricEnabled}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className={`ml-2 font-medium ${securityData.biometricEnabled ? isDarkMode ? 'text-green-400' : 'text-green-600' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {securityData.biometricEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>

            {/* Security Question */}
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Security Question</h4>
              <div className="space-y-4">
                <div>
                  <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Question</label>
                  <input
                    type="text"
                    value={securityData.securityQuestion}
                    className={`w-full px-4 py-3 border-2 rounded-lg cursor-not-allowed ${isDarkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300'}`}
                    disabled
                  />
                </div>
                <div>
                  <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Answer</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={securityData.securityAnswer}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                    placeholder="Enter answer"
                  />
                </div>
                <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                  Save Security Answer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'emailTransactions', label: 'Transaction Emails', description: 'Receive notifications for all transactions' },
                { key: 'emailPromotions', label: 'Promotional Emails', description: 'Get offers, promotions, and updates' },
                { key: 'smsAlerts', label: 'SMS Alerts', description: 'Receive text messages for important alerts' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'App notifications on your phone' },
                { key: 'monthlyStatement', label: 'Monthly Statement', description: 'Receive monthly account statement' },
                { key: 'securityAlerts', label: 'Security Alerts', description: 'Alerts about suspicious activities' },
                { key: 'newFeatures', label: 'New Features', description: 'Notifications about new features' }
              ].map(item => (
                <div key={item.key} className={`flex items-start justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-white'}`}>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.label}</div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={notifications[item.key]}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              ))}
              <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition mt-6 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Privacy Settings</h3>
            <div className="space-y-4">
              {[
                { key: 'shareData', label: 'Share Data for Analytics', description: 'Allow us to analyze your usage for improvements' },
                { key: 'marketingEmails', label: 'Marketing Communications', description: 'Receive personalized marketing emails' },
                { key: 'cookies', label: 'Accept Cookies', description: 'Allow cookies for enhanced experience' },
                { key: 'deviceTracking', label: 'Device Tracking', description: 'Track your device for security purposes' },
                { key: 'thirdPartySharing', label: 'Third-Party Data Sharing', description: 'Share data with partner services' }
              ].map(item => (
                <div key={item.key} className={`flex items-start justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-white'}`}>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.label}</div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</div>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={privacy[item.key]}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              ))}
              <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition mt-6 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Account Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Language</label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Currency</label>
                <select
                  name="currency"
                  value={preferences.currency}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Timezone</label>
                <select
                  name="timezone"
                  value={preferences.timezone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="EST (Eastern Standard Time)">EST (Eastern Standard Time)</option>
                  <option value="CST (Central Standard Time)">CST (Central Standard Time)</option>
                  <option value="MST (Mountain Standard Time)">MST (Mountain Standard Time)</option>
                  <option value="PST (Pacific Standard Time)">PST (Pacific Standard Time)</option>
                  <option value="GMT (Greenwich Mean Time)">GMT (Greenwich Mean Time)</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <hr className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Account Preferences Section */}
              <div>
                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Account Settings</h4>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Default Account for Transactions</label>
                <select
                  name="defaultAccount"
                  value={preferences.defaultAccount}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="primary">Checking Account (Primary)</option>
                  <option value="savings">Savings Account</option>
                  <option value="mm">Money Market Account</option>
                </select>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transfers and payments will use this account by default</p>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statement Delivery Period</label>
                <select
                  name="statementDelivery"
                  value={preferences.statementDelivery}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transaction Alert Threshold ($)</label>
                <input
                  type="number"
                  name="alertThreshold"
                  value={preferences.alertThreshold}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Amount threshold for alerts"
                />
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You'll receive alerts for transactions exceeding this amount</p>
              </div>

              <hr className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Display Preferences */}
              <div>
                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Display Options</h4>
              </div>

              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="hideBalancePublic"
                    checked={preferences.hideBalancePublic}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />
                  <span className={`ml-3 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Hide Balance on Public Screens</span>
                </label>
                <p className={`text-xs mt-2 ml-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Balance will be masked when displaying account info publicly</p>
              </div>

              <hr className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Live Preview Section */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-blue-700 bg-blue-900/20' : 'border-blue-200 bg-blue-50'}`}>
                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>  Live Preview</h4>
                <div className="space-y-3 text-sm">
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Language:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{getLanguageName()}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Currency:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{formatCurrency(10000)}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Timezone:</span>
                    <span className={`font-semibold text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{formatTime()}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Default Account:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{getAccountName(preferences.defaultAccount)}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Theme:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{preferences.theme === 'auto' ? 'Auto (System)' : preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Alert Threshold:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>${preferences.alertThreshold}</span>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>  Hide Balance:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{preferences.hideBalancePublic ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <button onClick={handleSave} className={`w-full py-3 rounded-lg font-bold transition mt-6 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className={`rounded-2xl p-6 shadow-lg border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Linked Devices</h3>
            <div className="space-y-4">
              {linkedDevices.map(device => (
                <div key={device.id} className="p-4 border border-gray-200 rounded-lg flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-900" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{device.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{device.type} • {device.lastAccess}</div>
                      <div className={`text-xs font-medium mt-2 ${device.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {device.status}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Section: How Blue Spring Bank Profile Settings Work */}
        <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Info className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>How Blue Spring Bank Profile Settings Work</h3>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>1</span>
                </div>
                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Personal Information</h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your profile stores essential personal information including your full name, contact details, and date of birth. This information is used for account verification, legal compliance, and customer service. Banks use this data to comply with KYC (Know Your Customer) and AML (Anti-Money Laundering) regulations required by US authorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className={`border-b pb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>2</span>
                </div>
                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Security Settings</h4>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Security settings protect your account from unauthorized access. Two-Factor Authentication (2FA) requires a second verification step. Biometric authentication uses your fingerprint or face for quick login. Regular password updates and security questions provide additional layers of protection.
                  </p>
                  <div className={`rounded-lg p-3 mt-3 space-y-2 ${isDarkMode ? 'bg-blue-900 border border-blue-800' : 'bg-blue-50'}`}>
                    <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Security Best Practices:</div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Use strong passwords with 12+ characters including uppercase, numbers, symbols</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Enable 2FA for additional account protection</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Change password every 90 days for security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Notification Preferences</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Mobile banking notifications keep you informed about account activities in real-time. You can customize how you receive alerts through email, SMS, or push notifications. Transaction alerts notify you immediately about deposits, withdrawals, and transfers.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mt-3 space-y-2">
                    <div className="text-xs font-semibold text-blue-900 mb-2">Notification Channels:</div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Email:</strong> Detailed information sent to inbox</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>SMS:</strong> Instant text alerts for urgent matters</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Push Notifications:</strong> In-app alerts on your phone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Privacy Controls</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Blue Spring Bank respects your privacy rights under regulations like CCPA (California Consumer Privacy Act) and GDPR compliance. You control how your data is collected, used, and shared. Opt-out options are available for marketing communications and data sharing with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Preferences */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Account Preferences</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Customize your banking experience with language, currency, and timezone settings. These preferences affect how transactions are displayed and when statements are generated. Multi-language support helps non-English speakers navigate the banking app comfortably.
                  </p>
                </div>
              </div>
            </div>

            {/* Device Management */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">6</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Device Management</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Track all devices accessing your account. Remove devices you no longer use or recognize. Most banks allow you to set up fraud alerts if your account is accessed from a new location or device. Session management lets you log out from specific devices remotely.
                  </p>
                  <div className="bg-amber-50 rounded-lg p-3 mt-3 space-y-2 border border-amber-200">
                    <div className="text-xs font-semibold text-amber-900 mb-2">Device Security Tips:</div>
                    <div className="flex items-start gap-2 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Regularly review linked devices and remove unrecognized ones</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Don't login on unsecured public WiFi networks</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Log out after each banking session on shared devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance & Regulations */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-3">Blue Spring Bank Compliance Requirements</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>FDIC Protection:</strong> Deposits insured up to $250,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>KYC/AML:</strong> Banks verify customer identity for legal compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>GLBA:</strong> Financial information is protected and private</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Fair Credit Reporting:</strong> Your credit information is protected</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>CCPA:</strong> California residents have data privacy rights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
