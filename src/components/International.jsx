import React, { useState } from 'react'
import { Globe, ChevronLeft } from 'lucide-react'

export default function International({ setCurrentView, preferences }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fromAccount: 'Primary Account',
    recipientName: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swiftCode: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    amount: '',
    currency: 'EUR - Euro (€)',
    purpose: 'Business'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    alert('International transfer initiated!')
    setCurrentView('home')
  }

  const countries = ['Select Country', 'United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Canada', 'Australia', 'Japan', 'Singapore', 'India']

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">International Transfer</h2>
            <p className="text-blue-100 text-sm">Transfer funds to international accounts via SWIFT network</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step === 1 ? 'bg-blue-900 text-white' : 'bg-green-500 text-white'}`}>1</span>
            <span className={`${step === 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Account Selection</span>
          </div>
          <div className={`w-8 h-0.5 ${step > 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step === 2 ? 'bg-blue-900 text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>2</span>
            <span className={`${step === 2 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Recipient Details</span>
          </div>
          <div className={`w-8 h-0.5 ${step > 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step === 3 ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-600'}`}>3</span>
            <span className={`${step === 3 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Transfer Details</span>
          </div>
        </div>

        {/* Step 1: Account Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold">1</span>
              Account Selection
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">From Account *</label>
              <select
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Primary Account - €72,139.59</option>
                <option>Secondary Account - €15,000.00</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold">2</span>
              Recipient Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Enter recipient name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* International Banking Details */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-4">International Banking Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IBAN *</label>
                  <input
                    type="text"
                    name="iban"
                    value={formData.iban}
                    onChange={handleInputChange}
                    placeholder="Enter IBAN"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC Code *</label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleInputChange}
                    placeholder="Enter SWIFT/BIC code"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Optional Contact Details */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Transfer Details */}
        {step === 3 && (
          <div>
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold">3</span>
                Transfer Details
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Currency *</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option>EUR - Euro (€)</option>
                    <option>USD - US Dollar ($)</option>
                    <option>GBP - British Pound (£)</option>
                    <option>JPY - Japanese Yen (¥)</option>
                    <option>AUD - Australian Dollar (A$)</option>
                    <option>CAD - Canadian Dollar (C$)</option>
                    <option>SGD - Singapore Dollar (S$)</option>
                    <option>INR - Indian Rupee (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type *</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option>Instant Transfer</option>
                    <option>Standard Transfer</option>
                    <option>Economy Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Method *</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option>Online Banking</option>
                    <option>SWIFT</option>
                    <option>SEPA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Additional transfer notes (optional)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    rows="4"
                  ></textarea>
                </div>
              </div>

              {/* Note Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Note:</strong> International transfers may take 1-5 business days to complete.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2 border-2 border-blue-900 text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition"
                  >
                    ↺ Reset Form
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    → Continue to Review
                  </button>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-200 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">How It Works</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">International transfers via SWIFT</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Multiple currency support</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">1-3 business day processing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Enhanced compliance checks</span>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Processing Time</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Europe</span>
                  <span className="text-gray-600">1-2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Asia</span>
                  <span className="text-gray-600">2-3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Americas</span>
                  <span className="text-gray-600">2-5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Africa & Middle East</span>
                  <span className="text-gray-600">3-5 days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="flex-1 bg-white text-blue-900 border-2 border-blue-900 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
            >
              Next
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
            >
              Send Transfer
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
