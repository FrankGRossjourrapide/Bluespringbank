import React, { useState } from 'react'
import { ChevronLeft, Eye, EyeOff, Lock, Unlock, Copy, MoreVertical, Smartphone, Shield, Zap, Info, CheckCircle, AlertCircle, X, Loader, Bitcoin, Coins } from 'lucide-react'

export default function DebitCard({ setCurrentView, preferences }) {
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [cardStates, setCardStates] = useState({
    1: { isLocked: false, contactlessEnabled: true, onlineEnabled: true, atmEnabled: true },
    2: { isLocked: false, contactlessEnabled: true, onlineEnabled: true, atmEnabled: true }
  })
  const [copiedField, setCopiedField] = useState(null)
  const [selectedCard, setSelectedCard] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderForm, setOrderForm] = useState({
    cardholderName: '',
    deliveryAddress: '',
    cardType: 'Visa',
    isCryptoCard: false,
    cryptoType: 'Bitcoin',
    acceptTerms: false
  })
  const [orderError, setOrderError] = useState('')

  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const debitCards = [
    {
      id: 1,
      cardNumber: '4532148803436467',
      cardHolder: 'Sound Cloud',
      expiryDate: '12/26',
      cvv: '847',
      status: 'Active',
      type: 'Visa',
      balance: 72139.59,
      isDefault: true,
      dailySpent: 245.50,
      monthlyLimit: 5000,
      transactions: 24
    },
    {
      id: 2,
      cardNumber: '5425233455550000',
      cardHolder: 'Sound Cloud',
      expiryDate: '08/25',
      cvv: '123',
      status: 'Active',
      type: 'Mastercard',
      balance: 15000.00,
      isDefault: false,
      dailySpent: 0,
      monthlyLimit: 3000,
      transactions: 8
    }
  ]

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const toggleCardFeature = (cardId, feature) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [feature]: !prev[cardId][feature]
      }
    }))
    
    const featureNames = {
      isLocked: 'Card locked successfully',
      contactlessEnabled: 'Contactless payments updated',
      onlineEnabled: 'Online transactions updated',
      atmEnabled: 'ATM settings updated'
    }
    
    setSuccessMessage(featureNames[feature])
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleOrderFormChange = (field, value) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }))
    setOrderError('')
  }

  const handleOrderCard = async () => {
    setOrderError('')
    
    // Validation
    if (!orderForm.cardholderName.trim()) {
      setOrderError('Cardholder name is required')
      return
    }
    if (!orderForm.deliveryAddress.trim()) {
      setOrderError('Delivery address is required')
      return
    }
    if (!orderForm.acceptTerms) {
      setOrderError('Please accept the terms and conditions')
      return
    }

    setOrderLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setOrderLoading(false)
      const cardType = orderForm.isCryptoCard ? `${orderForm.cryptoType} Crypto` : orderForm.cardType
      const deliveryDays = orderForm.isCryptoCard ? '3-5' : '7-10'
      setSuccessMessage(`${cardType} card ordered successfully! You will receive it within ${deliveryDays} business days.`)
      setShowOrderModal(false)
      setOrderForm({
        cardholderName: '',
        deliveryAddress: '',
        cardType: 'Visa',
        isCryptoCard: false,
        cryptoType: 'Bitcoin',
        acceptTerms: false
      })
      setTimeout(() => setSuccessMessage(''), 4000)
    }, 1500)
  }

  const maskCardNumber = (cardNumber) => {
    if (showCardNumber) return cardNumber.slice(0, 4) + ' ' + cardNumber.slice(4, 8) + ' ' + cardNumber.slice(8, 12) + ' ' + cardNumber.slice(12, 16)
    return cardNumber.slice(0, 4) + ' ' + '•'.repeat(4) + ' ' + '•'.repeat(4) + ' ' + cardNumber.slice(-4)
  }

  const currentCard = debitCards.find(card => card.id === selectedCard)
  const currentState = cardStates[selectedCard]

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">My Debit Cards</h1>
        </div>
        <p className="text-blue-100">Manage your cards and mobile banking</p>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Card Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {debitCards.map(card => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCard === card.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {card.type}
            </button>
          ))}
        </div>

        {/* Card Visual */}
        {currentCard && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-6">
            <div className={`p-6 text-white rounded-t-2xl ${selectedCard === 1 ? 'bg-linear-to-br from-blue-900 to-blue-700' : 'bg-linear-to-br from-purple-900 to-purple-700'}`}>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold uppercase tracking-wider">{currentCard.type}</span>
                {currentCard.isDefault && <span className="bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">Default</span>}
              </div>

              <div className="mb-8">
                <div className="text-xs opacity-75 mb-2">Card Number</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl tracking-widest font-mono">{maskCardNumber(currentCard.cardNumber)}</div>
                  <button
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition"
                  >
                    {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-75 mb-1">Card Holder</div>
                  <div className="font-semibold">{currentCard.cardHolder}</div>
                </div>
                <div>
                  <div className="text-xs opacity-75 mb-1">Expires</div>
                  <div className="font-semibold">{currentCard.expiryDate}</div>
                </div>
              </div>
            </div>

            {/* Card Status & Balance */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Status</label>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentState.isLocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className="text-gray-900 font-medium">{currentState.isLocked ? 'Locked' : 'Active'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Today Spent</label>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(currentCard.dailySpent)}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Transactions</label>
                  <div className="text-lg font-bold text-gray-900">{currentCard.transactions}</div>
                </div>
              </div>
            </div>

            {/* CVV and Expiry */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">CVV</label>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-lg text-gray-900">{showCVV ? currentCard.cvv : '•••'}</div>
                    <button
                      onClick={() => setShowCVV(!showCVV)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(currentCard.cvv, `cvv-${currentCard.id}`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedField === `cvv-${currentCard.id}` && <span className="text-xs text-green-600 font-medium">Copied!</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Expiry Date</label>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-lg text-gray-900">{currentCard.expiryDate}</div>
                    <button
                      onClick={() => handleCopy(currentCard.expiryDate, `expiry-${currentCard.id}`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedField === `expiry-${currentCard.id}` && <span className="text-xs text-green-600 font-medium">Copied!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="p-6 space-y-4">
              <button
                onClick={() => toggleCardFeature(currentCard.id, 'isLocked')}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
                  currentState.isLocked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {currentState.isLocked ? (
                  <>
                    <Unlock className="w-5 h-5" />
                    <span>Unlock Card</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Lock Card</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => toggleCardFeature(currentCard.id, 'contactlessEnabled')}
                  className={`py-3 rounded-lg font-medium text-sm transition ${
                    currentState.contactlessEnabled
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <Zap className="w-4 h-4 mx-auto mb-1" />
                  Contactless
                </button>
                <button
                  onClick={() => toggleCardFeature(currentCard.id, 'onlineEnabled')}
                  className={`py-3 rounded-lg font-medium text-sm transition ${
                    currentState.onlineEnabled
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  Online
                </button>
                <button
                  onClick={() => toggleCardFeature(currentCard.id, 'atmEnabled')}
                  className={`py-3 rounded-lg font-medium text-sm transition ${
                    currentState.atmEnabled
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4 mx-auto mb-1" />
                  ATM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order New Card */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Order a New Debit Card?</h3>
              <p className="text-sm sm:text-base text-gray-600">Get an additional debit card with the same account</p>
            </div>
            <button 
              onClick={() => setShowOrderModal(true)}
              className="w-full sm:w-auto bg-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition whitespace-nowrap"
            >
              Order Card
            </button>
          </div>
        </div>

        {/* Order Card Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order New Debit Card</h2>
                <button 
                  onClick={() => {
                    setShowOrderModal(false)
                    setOrderError('')
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Card Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {['Visa', 'Mastercard'].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          handleOrderFormChange('cardType', type)
                          handleOrderFormChange('isCryptoCard', false)
                        }}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                          orderForm.cardType === type && !orderForm.isCryptoCard
                            ? 'bg-blue-900 text-white border-2 border-blue-900'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  
                  {/* Crypto Card Option */}
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Or Crypto Card</label>
                  <button
                    onClick={() => handleOrderFormChange('isCryptoCard', true)}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                      orderForm.isCryptoCard
                        ? 'bg-amber-600 text-white border-2 border-amber-600'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Bitcoin className="w-4 h-4" />
                    Crypto Card
                  </button>
                </div>

                {/* Crypto Type Selection */}
                {orderForm.isCryptoCard && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cryptocurrency Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Bitcoin', 'Ethereum', 'Litecoin', 'USDC'].map(crypto => (
                        <button
                          key={crypto}
                          onClick={() => handleOrderFormChange('cryptoType', crypto)}
                          className={`py-2 px-3 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1 ${
                            orderForm.cryptoType === crypto
                              ? 'bg-amber-600 text-white border-2 border-amber-600'
                              : 'bg-amber-50 text-amber-800 border-2 border-amber-200 hover:border-amber-300'
                          }`}
                        >
                          {crypto === 'Bitcoin' && <Bitcoin className="w-3 h-3" />}
                          {crypto !== 'Bitcoin' && <Coins className="w-3 h-3" />}
                          {crypto}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-amber-700 mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                      💡 Crypto cards debit directly from your {orderForm.cryptoType} wallet and convert to local currency at checkout.
                    </p>
                  </div>
                )}

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={orderForm.cardholderName}
                    onChange={(e) => handleOrderFormChange('cardholderName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    value={orderForm.deliveryAddress}
                    onChange={(e) => handleOrderFormChange('deliveryAddress', e.target.value)}
                    placeholder="Enter your complete address"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                  />
                </div>

                {/* Info Box */}
                {orderForm.isCryptoCard && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-900 font-medium mb-2">Crypto Card Features:</p>
                    <ul className="text-xs text-amber-800 space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>Instant crypto-to-fiat conversion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>Use anywhere Visa/Mastercard accepted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>Real-time transaction notifications</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={orderForm.acceptTerms}
                    onChange={(e) => handleOrderFormChange('acceptTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="acceptTerms" className="text-xs sm:text-sm text-gray-700 cursor-pointer">
                    I agree to the terms and conditions. Delivery will take {orderForm.isCryptoCard ? '3-5' : '7-10'} business days.
                  </label>
                </div>

                {/* Error Message */}
                {orderError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-700">{orderError}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowOrderModal(false)
                    setOrderError('')
                  }}
                  disabled={orderLoading}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderCard}
                  disabled={orderLoading}
                  className="flex-1 py-2 px-4 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {orderLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Order Card'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How Blue Spring Bank Debit Cards Work */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-6 h-6 text-blue-900" />
            <h3 className="text-lg font-bold text-gray-900">How Blue Spring Bank Debit Cards Work</h3>
          </div>

          <div className="space-y-6">
            {/* What is a Debit Card */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">What is a Debit Card?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    A debit card is a payment card that draws money directly from your bank account in real-time. Unlike credit cards, there's no debt created—you can only spend what you have available. Debit cards combine the convenience of a card with the security of your bank account.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Banking with Debit Cards */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mobile Wallet Integration</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Most debit cards can be added to mobile wallets like Apple Pay, Google Pay, and Samsung Pay. This allows you to make contactless payments using your smartphone instead of carrying a physical card. Mobile payments are encrypted and secure.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mt-3 space-y-2">
                    <div className="text-xs font-semibold text-blue-900 mb-2">Popular Mobile Payment Methods:</div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Apple Pay:</strong> For iPhone, iPad, Apple Watch</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Google Pay:</strong> For Android phones</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-blue-800">
                      <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Samsung Pay:</strong> For Samsung Galaxy devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Processing */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">How Transactions Work</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    When you use your debit card, the transaction goes through these steps:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-900 shrink-0">1.</span>
                      <span>You swipe, insert, or tap your debit card at a merchant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-900 shrink-0">2.</span>
                      <span>The transaction is sent to your bank for authorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-900 shrink-0">3.</span>
                      <span>Your bank checks if you have sufficient funds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-900 shrink-0">4.</span>
                      <span>The transaction is approved or declined</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-900 shrink-0">5.</span>
                      <span>Funds are typically deducted immediately or within 24 hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Types of Debit Card Transactions */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Types of Debit Card Transactions</h4>
                  <div className="mt-3 space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">In-Store Purchases</div>
                      <p className="text-xs text-gray-600 mt-1">Swipe or insert your card at physical stores, requiring a PIN or signature</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">Online Shopping</div>
                      <p className="text-xs text-gray-600 mt-1">Enter your card details on secure websites; most require CVV for security</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">Contactless Payments (NFC)</div>
                      <p className="text-xs text-gray-600 mt-1">Tap your card or phone near reader for quick transactions under $100</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">ATM Withdrawals</div>
                      <p className="text-xs text-gray-600 mt-1">Withdraw cash from ATMs; your bank may charge fees at non-network ATMs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="text-blue-900 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Security Features</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>EMV Chip:</strong> Encrypted technology that creates a unique code for each transaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>PIN Protection:</strong> Personal identification number required for ATM and PIN-based transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Fraud Alerts:</strong> Real-time notifications of suspicious activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Card Lock:</strong> Quickly lock/unlock your card through mobile banking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Zero Fraud Liability:</strong> Most banks don't hold you liable for fraudulent transactions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fees & Limits */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-gray-900 mb-3">Common Fees & Limits</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Daily ATM Withdrawal Limit:</strong> Usually $400-$500</li>
                <li><strong>Monthly Withdrawal Limit:</strong> Often $1,000-$2,000</li>
                <li><strong>ATM Fees:</strong> $1-$3 at non-network ATMs</li>
                <li><strong>Foreign ATM Fees:</strong> $3-$5 for international ATMs</li>
                <li><strong>Foreign Transaction Fee:</strong> Usually 1-3% for international purchases</li>
                <li><strong>Card Replacement:</strong> Free for first card, may charge for emergency replacement</li>
              </ul>
            </div>

            {/* Best Practices */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-3">Mobile Banking Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Never share your PIN or CVV with anyone, including bank employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Regularly check your bank account for unauthorized transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Only use secure Wi-Fi networks for mobile banking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Keep your phone and banking app updated with latest security patches</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Enable biometric authentication (fingerprint/face ID) on your phone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Report stolen or lost cards immediately by calling your bank</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
