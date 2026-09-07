import React, { useState } from 'react'
import { ChevronLeft, Check, DollarSign, Smartphone, Upload, TrendingUp, Info, CheckCircle, AlertCircle, Clock, Shield } from 'lucide-react'

export default function Deposit({ depositAmount, setDepositAmount, handleDeposit, setCurrentView, preferences }) {
  const [depositMethod, setDepositMethod] = useState('ach')
  const [successMessage, setSuccessMessage] = useState('')
  const [depositFormData, setDepositFormData] = useState({
    senderName: '',
    senderBank: '',
    routingNumber: '',
    accountNumber: '',
    transferDescription: '',
    achAmount: '',
    wireAmount: '',
    mobileCheckAmount: '',
    bankTransferAmount: ''
  })
  const [depositHistory, setDepositHistory] = useState([
    { id: 1, date: '2024-04-10', amount: 500, method: 'ACH Transfer', status: 'Completed', daysAgo: '4 days' },
    { id: 2, date: '2024-04-08', amount: 1200, method: 'Mobile Check Deposit', status: 'Completed', daysAgo: '6 days' },
    { id: 3, date: '2024-04-05', amount: 800, method: 'Wire Transfer', status: 'Completed', daysAgo: '9 days' },
    { id: 4, date: '2024-03-28', amount: 250, method: 'Bank Transfer', status: 'Completed', daysAgo: '17 days' }
  ])

  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDepositFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDepositSubmit = (e, method) => {
    e.preventDefault()
    
    const amount = depositFormData[`${method}Amount`]
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (method !== 'mobileCheck' && (!depositFormData.senderName || !depositFormData.senderBank)) {
      alert('Please fill in all required fields')
      return
    }

    // Add to deposit history
    const newDeposit = {
      id: depositHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      method: getMethodLabel(method),
      status: 'Pending',
      daysAgo: 'just now'
    }

    setDepositHistory(prev => [newDeposit, ...prev])
    setSuccessMessage(`${formatCurrency(parseFloat(amount))} deposit initiated successfully!`)
    
    // Reset form
    setDepositFormData({
      senderName: '',
      senderBank: '',
      routingNumber: '',
      accountNumber: '',
      transferDescription: '',
      achAmount: '',
      wireAmount: '',
      mobileCheckAmount: '',
      bankTransferAmount: ''
    })

    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const getMethodLabel = (method) => {
    const labels = {
      ach: 'ACH Transfer',
      wire: 'Wire Transfer',
      mobileCheck: 'Mobile Check Deposit',
      bankTransfer: 'Bank Transfer'
    }
    return labels[method] || method
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 w-full" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-4 md:p-6 sticky top-0 z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 md:p-3 rounded-lg transition active:bg-blue-600 min-h-10 min-w-10 touch:min-h-10 touch:min-w-10">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Add Deposit</h1>
            <p className="text-xs md:text-sm text-blue-100 mt-1">Choose your deposit method</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 md:mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <span className="text-green-700 font-medium text-sm md:text-base">{successMessage}</span>
          </div>
        )}

        {/* Deposit Method Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { id: 'ach', label: 'ACH Transfer', icon: ' ', description: 'Fast & reliable', days: '1-2 days' },
            { id: 'wire', label: 'Wire Transfer', icon: ' ', description: 'Fastest option', days: 'Same day' },
            { id: 'mobileCheck', label: 'Mobile Check', icon: ' ', description: 'Snap & deposit', days: '1-2 days' },
            { id: 'bankTransfer', label: 'Bank Transfer', icon: ' ', description: 'From another bank', days: '2-3 days' }
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setDepositMethod(method.id)}
              className={`p-4 md:p-5 rounded-lg border-2 transition min-h-28 md:min-h-32 flex flex-col items-center justify-center text-center ${
                depositMethod === method.id
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-500 active:bg-gray-50'
              }`}
            >
              <div className="text-2xl md:text-3xl mb-2">{method.icon}</div>
              <div className="font-bold text-gray-900 text-sm md:text-base">{method.label}</div>
              <div className="text-xs text-gray-600 mt-1">{method.description}</div>
              <div className="text-xs text-blue-600 font-medium mt-2">{method.days}</div>
            </button>
          ))}
        </div>

        {/* Deposit Forms */}
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
          {/* ACH Transfer */}
          {depositMethod === 'ach' && (
            <form onSubmit={(e) => handleDepositSubmit(e, 'ach')}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">ACH Transfer Deposit</h3>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={depositFormData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition min-h-12"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Sender's Bank</label>
                  <input
                    type="text"
                    name="senderBank"
                    value={depositFormData.senderBank}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <input
                      type="number"
                      name="achAmount"
                      value={depositFormData.achAmount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Processing time: 1-2 business days</p>
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                  Confirm ACH Deposit
                </button>
              </div>
            </form>
          )}

          {/* Wire Transfer */}
          {depositMethod === 'wire' && (
            <form onSubmit={(e) => handleDepositSubmit(e, 'wire')}>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Wire Transfer Deposit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={depositFormData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sender's Bank</label>
                  <input
                    type="text"
                    name="senderBank"
                    value={depositFormData.senderBank}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <input
                      type="number"
                      name="wireAmount"
                      value={depositFormData.wireAmount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Processing time: Same day (usually 2-4 hours)</p>
                  <p className="text-xs text-amber-600 font-medium mt-2">⚠️ Wire transfer fees may apply</p>
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                  Confirm Wire Transfer
                </button>
              </div>
            </form>
          )}

          {/* Mobile Check Deposit */}
          {depositMethod === 'mobileCheck' && (
            <form onSubmit={(e) => handleDepositSubmit(e, 'mobileCheck')}>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Mobile Check Deposit</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <p className="text-sm text-blue-900"><strong>📸 How it works:</strong> Take clear photos of the front and back of your check, then upload them.</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Check Front (Photo)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Check Back (Photo)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Check Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <input
                      type="number"
                      name="mobileCheckAmount"
                      value={depositFormData.mobileCheckAmount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Processing time: 1-2 business days</p>
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                  Deposit Check
                </button>
              </div>
            </form>
          )}

          {/* Bank Transfer */}
          {depositMethod === 'bankTransfer' && (
            <form onSubmit={(e) => handleDepositSubmit(e, 'bankTransfer')}>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Bank Transfer Deposit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={depositFormData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">From Bank</label>
                  <input
                    type="text"
                    name="senderBank"
                    value={depositFormData.senderBank}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Your bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">$</span>
                    <input
                      type="number"
                      name="bankTransferAmount"
                      value={depositFormData.bankTransferAmount}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Processing time: 2-3 business days</p>
                </div>
                <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                  Confirm Bank Transfer
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Recent Deposits */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Deposits</h3>
          <div className="space-y-3">
            {depositHistory.slice(0, 5).map(deposit => (
              <div key={deposit.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{deposit.method}</div>
                    <div className="text-xs text-gray-600">{deposit.daysAgo}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(deposit.amount)}</div>
                  <div className={`text-xs font-medium ${deposit.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                    {deposit.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How USA Bank Deposits Work */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-blue-900" />
            <h3 className="text-lg font-bold text-gray-900">How USA Bank Deposits Work</h3>
          </div>

          <div className="space-y-6">
            {/* Deposit Methods Overview */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Four Main Deposit Methods</h4>
                  <div className="mt-3 space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">ACH Transfer (Most Common)</div>
                      <p className="text-xs text-gray-600 mt-1">Electronic transfer through the ACH network. Processing: 1-2 business days. Low/no fees. Best for regular transfers.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">Wire Transfer (Fastest)</div>
                      <p className="text-xs text-gray-600 mt-1">Direct bank-to-bank transfer. Processing: Same day (2-4 hours). May include $15-25 fee. Best for urgent deposits.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">Mobile Check Deposit (Most Convenient)</div>
                      <p className="text-xs text-gray-600 mt-1">Photograph check front & back using mobile app. Processing: 1-2 business days. No fee. Fastest for mobile users.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">Bank Transfer (From Other Banks)</div>
                      <p className="text-xs text-gray-600 mt-1">Transfer from another US bank account. Processing: 2-3 business days. Low/no fees. Secure and reliable.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Check Deposit Technology */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mobile Check Deposit Technology</h4>
                  <p className="text-sm text-gray-600 mt-1">Mobile check deposits use OCR (Optical Character Recognition) technology to read check details. Your photos must show:</p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Clear, legible images of both front and back</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>All edges of the check (entire check visible)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Signature on the back (required for deposit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Bright lighting with no shadows or glare</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deposit Processing Timeline */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Deposit Processing Timeline</h4>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Immediate (0-24 hours):</strong> Funds placed hold/available for use in most cases</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>1-2 Business Days:</strong> ACH & mobile check deposits fully processed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Same Day (2-4 hours):</strong> Wire transfers typically completed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>2-3 Business Days:</strong> Bank-to-bank transfers from other institutions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Limits */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Deposit Limits & Holds</h4>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Mobile Check Deposit:</strong> Usually $2,000-$10,000 daily limit, $25,000 monthly</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Wire Transfers:</strong> Typically no limit, but may require approval for large amounts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>ACH Transfers:</strong> Usually $10,000-$25,000 daily limit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Funds Availability:</strong> First $225 usually available next business day; remainder per Regulation CC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Fraud Prevention */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Security & Fraud Prevention</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Banks verify check information using advanced OCR and fraud detection systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Mobile deposits are encrypted end-to-end for security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Original check must be retained for 14+ days after deposit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>Depositing twice (mobile + physical ATM) is illegal and flagged by bank systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deposit Best Practices */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-3">Deposit Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>For mobile checks: Use good lighting and ensure entire check is visible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Endorse checks promptly: Write "For Mobile Deposit Only" on back</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Keep original checks for 14 days after deposit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Provide accurate routing and account numbers for ACH transfers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Save confirmation receipts for all deposits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Double-check recipient information before confirming deposits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
