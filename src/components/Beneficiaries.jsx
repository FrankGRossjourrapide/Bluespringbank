import React, { useState } from 'react'
import { User, X } from 'lucide-react'

export default function Beneficiaries() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Domestic',
    email: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    country: '',
    currency: 'USD'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Beneficiary form submitted:', formData)
    setShowModal(false)
    setFormData({
      name: '',
      type: 'Domestic',
      email: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      country: '',
      currency: 'USD'
    })
  }

  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'India', 'Japan', 'China', 'Brazil']
  const currencies = ['USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'CAD - Canadian Dollar', 'AUD - Australian Dollar', 'INR - Indian Rupee', 'JPY - Japanese Yen', 'CNY - Chinese Yuan', 'BRL - Brazilian Real']

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6"><h2 className="text-2xl font-bold">Beneficiaries</h2></div>
      <div className="p-6">
        <button onClick={() => setShowModal(true)} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold mb-4 hover:bg-blue-800 transition">+ Add New Beneficiary</button>
        <div className="space-y-3">
          {['John Smith', 'Sarah Johnson', 'Mike Davis'].map((name, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-blue-900" /></div>
                <div>
                  <div className="font-semibold text-gray-900">{name}</div>
                  <div className="text-sm text-gray-500">**** **** {1234 + idx}</div>
                </div>
              </div>
              <button className="text-blue-900 font-medium">Transfer</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Beneficiary Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold">Add New Beneficiary</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Beneficiary Name */}
              <div>
                <label className="block text-lg font-semibold mb-2">Beneficiary Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter beneficiary name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-lg font-semibold mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 appearance-none bg-white"
                >
                  <option>Domestic</option>
                  <option>International</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-semibold mb-2">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="beneficiary@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-lg font-semibold mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-lg font-semibold mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-lg font-semibold mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-lg font-semibold mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 appearance-none bg-white"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-lg font-semibold mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 appearance-none bg-white"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                Add Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
