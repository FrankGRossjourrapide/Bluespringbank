import React, { useState, useEffect } from 'react'
import { ChevronLeft, Info, CheckCircle, AlertCircle } from 'lucide-react'

export default function Transfer({ transferAmount, setTransferAmount, transferTo, setTransferTo, handleTransfer, totalBalance, setCurrentView, preferences }) {
  const [transferType, setTransferType] = useState('local')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState(() => {
    // Map preferences.defaultAccount to account type values
    const defaultMap = {
      'Checking': 'checking',
      'Savings': 'savings',
      'Money Market': 'money-market'
    }
    return defaultMap[preferences?.defaultAccount] || 'checking'
  })
  const [transferPurpose, setTransferPurpose] = useState('personal')
  const [showSuccess, setShowSuccess] = useState(false)

  // Update accountType when preferences changes
  useEffect(() => {
    const defaultMap = {
      'Checking': 'checking',
      'Savings': 'savings',
      'Money Market': 'money-market'
    }
    setAccountType(defaultMap[preferences?.defaultAccount] || 'checking')
  }, [preferences?.defaultAccount])

  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleLocalTransfer = (e) => {
    e.preventDefault()
    
    // Validation
    if (!transferTo.trim()) {
      alert('Please enter account holder name')
      return
    }
    if (!routingNumber.trim()) {
      alert('Please enter routing number')
      return
    }
    if (!accountNumber.trim()) {
      alert('Please enter account number')
      return
    }
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    if (parseFloat(transferAmount) > totalBalance) {
      alert('Insufficient funds')
      return
    }

    // Process transfer
    handleTransfer()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      resetForm()
    }, 3000)
  }

  const resetForm = () => {
    setTransferTo('')
    setTransferAmount('')
    setRoutingNumber('')
    setAccountNumber('')
    setAccountType('checking')
    setTransferPurpose('personal')
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Transfer Money</h2>
        </div>
        <p className="text-blue-100 text-sm mt-2">Send money locally or internationally</p>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-green-900">Transfer Successful!</div>
              <div className="text-sm text-green-700">Your transfer has been processed and will be delivered within 1-2 business days.</div>
            </div>
          </div>
        )}

        {/* Transfer Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTransferType('local')}
              className={`p-4 rounded-lg border-2 font-medium transition ${
                transferType === 'local'
                  ? 'border-blue-900 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Local Transfer
            </button>
            <button
              onClick={() => setTransferType('international')}
              className={`p-4 rounded-lg border-2 font-medium transition ${
                transferType === 'international'
                  ? 'border-blue-900 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              International Transfer
            </button>
          </div>
        </div>

        {/* Local Transfer Form */}
        {transferType === 'local' && (
          <form onSubmit={handleLocalTransfer} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Local Transfer Details</h3>

            {/* Recipient Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Recipient Name</label>
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter account holder name"
                required
              />
            </div>

            {/* Routing Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Routing Number</label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="9-digit routing number"
                maxLength="9"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your recipient's bank routing number (9 digits)</p>
            </div>

            {/* Account Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 17))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Recipient's account number"
                maxLength="17"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter recipient's bank account number</p>
            </div>

            {/* Account Type */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
                <option value="money-market">Money Market Account</option>
              </select>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  {(() => {
                    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
                    return currencySymbols[preferences?.currency] || '$'
                  })()}
                </span>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Transfer Purpose */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Transfer Purpose</label>
              <select
                value={transferPurpose}
                onChange={(e) => setTransferPurpose(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="personal">Personal Transfer</option>
                <option value="business">Business Payment</option>
                <option value="bill-payment">Bill Payment</option>
                <option value="rent">Rent Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Available Balance */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalBalance)}</div>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition mb-3"
            >
              Confirm Transfer
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </form>
        )}

        {/* International Transfer Info */}
        {transferType === 'international' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-orange-900">International Transfers</div>
                <p className="text-sm text-orange-700">Please navigate to the International Transfer section for SWIFT transfers and multi-currency options.</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('international')}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition mb-3"
            >
              Go to International Transfer
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* How Local Transfers Work */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-blue-900" />
            <h3 className="text-lg font-bold text-gray-900">How USA Local Transfers Work</h3>
          </div>

          <div className="space-y-6">
            {/* ACH Transfers */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">ACH (Automated Clearing House)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ACH is the most common method for domestic USA transfers. It's a secure, electronic network used by banks to process millions of transactions daily. Transfers typically take 1-3 business days to complete.
                  </p>
                </div>
              </div>
            </div>

            {/* Wire Transfers */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Wire Transfers (Fastest)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Wire transfers are the fastest method for local transfers in the USA. Funds are typically delivered within a few hours to other US banks. They're ideal for urgent transfers but may have higher fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Real-Time Payments */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Real-Time Payments (RTP)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    The newest payment method in the US, RTP enables instant transfers between participating banks 24/7, even weekends and holidays. Available for amounts up to $100,000 per transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* What You Need */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Information Required for Local Transfers</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Routing Number:</strong> 9-digit code identifying the recipient's bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Account Number:</strong> Your recipient's bank account number (usually on their checks)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Account Type:</strong> Whether it's a checking, savings, or money market account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Recipient Name:</strong> Name on the account receiving the transfer</span>
                </li>
              </ul>
            </div>

            {/* Transfer Limits & Fees */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-gray-900 mb-3">Transfer Limits & Fees</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>ACH Transfer:</strong> Up to $10,000 per transaction (typically), $0-$3 fee</li>
                <li><strong>Wire Transfer:</strong> No limit, $15-$25 fee, funds available within hours</li>
                <li><strong>RTP:</strong> Up to $100,000, $0-$2 fee, instant delivery</li>
              </ul>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-3">Security & Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Always verify recipient information before confirming a transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Double-check routing and account numbers for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Never share your full account details over unsecured channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Save transfer confirmations for your records</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
