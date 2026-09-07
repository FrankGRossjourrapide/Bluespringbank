import React, { useState } from 'react'
import { FileText, ChevronLeft, Upload, CheckCircle } from 'lucide-react'

export default function Cheque({ setCurrentView, preferences }) {
  const [formData, setFormData] = useState({
    depositAccount: 'Primary Account',
    chequeAmount: '',
    bankName: '',
    chequeNumber: '',
    routingNumber: '',
    accountNumber: '',
    description: '',
    additionalNotes: '',
    agreeTerms: false
  })

  const [uploadedFront, setUploadedFront] = useState(null)
  const [uploadedBack, setUploadedBack] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = (e, side) => {
    const file = e.target.files?.[0]
    if (file) {
      if (side === 'front') {
        setUploadedFront(file.name)
      } else {
        setUploadedBack(file.name)
      }
    }
  }

  const handleReviewDeposit = () => {
    if (!uploadedFront || !uploadedBack) {
      alert('Please upload both front and back images of the cheque')
      return
    }
    alert('Review deposit - All images uploaded successfully!')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!uploadedFront || !uploadedBack) {
      alert('Please upload both front and back images of the cheque')
      return
    }
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions')
      return
    }
    alert('Cheque deposit submitted successfully!')
    setCurrentView('home')
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Cheque Deposit</h2>
            <p className="text-blue-100 text-sm">Deposit cheques into your account for processing</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span className="cursor-pointer hover:text-blue-900">Dashboard</span>
          <span>{'>'}</span>
          <span className="cursor-pointer hover:text-blue-900">Deposits</span>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">Cheque Deposit</span>
        </div>

        {/* Back Button */}
        <button onClick={() => setCurrentView('home')} className="mb-6 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-2">
          ← Back to Dashboard
        </button>

        {/* Cheque Information Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow border border-gray-200 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Cheque Information</h3>

          <div className="space-y-4 mb-6">
            {/* Deposit to Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposit to Account</label>
              <select
                name="depositAccount"
                value={formData.depositAccount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Primary Account - €72,139.59</option>
                <option>Secondary Account - €15,000.00</option>
              </select>
            </div>

            {/* Cheque Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Amount</label>
              <input
                type="number"
                name="chequeAmount"
                value={formData.chequeAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Cheque Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Number</label>
              <input
                type="text"
                name="chequeNumber"
                value={formData.chequeNumber}
                onChange={handleInputChange}
                placeholder="Enter cheque number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Routing Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number (Optional)</label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                placeholder="Enter routing number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number (Optional)</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description for this deposit"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows="3"
              ></textarea>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional notes or comments"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Cheque Images Section */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Cheque Images</h4>
            
            <div className="space-y-6">
              {/* Front of Cheque */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Front of Cheque</label>
                <div className="flex items-center gap-4">
                  <label className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer inline-block">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'front')}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                    />
                    Choose file
                  </label>
                  <span className="text-gray-600">{uploadedFront ? `${uploadedFront}` : 'No file chosen'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a clear image of the front of the cheque (JPG, PNG, or PDF, max 10MB)</p>
              </div>

              {/* Back of Cheque */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Back of Cheque</label>
                <div className="flex items-center gap-4">
                  <label className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer inline-block">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'back')}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                    />
                    Choose file
                  </label>
                  <span className="text-gray-600">{uploadedBack ? `${uploadedBack}` : 'No file chosen'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a clear image of the back of the cheque (JPG, PNG, or PDF, max 10MB)</p>
              </div>
            </div>

            {/* Review Deposit Button */}
            <button
              type="button"
              onClick={handleReviewDeposit}
              className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
            >
              Review Deposit
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 text-blue-900 rounded border-2 border-gray-300 focus:outline-none"
              />
              <span className="text-sm text-gray-700">
                I agree that the information provided is accurate and that I have reviewed the cheque before submission. Cheque deposits are subject to verification and may take 2-5 business days to process.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            Submit Cheque Deposit
          </button>
        </form>

        {/* Deposit Guidelines */}
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-200 mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Deposit Guidelines</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Ensure cheque is properly endorsed</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Take clear, well-lit photos</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Include all required fields</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Deposits are processed within 2 business days</span>
            </div>
          </div>
        </div>

        {/* Processing Times */}
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-200 mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Processing Times</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Same Day</span>
              <span className="text-green-600 font-semibold">Before 2:00 PM</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Next Business Day</span>
              <span className="text-orange-600 font-semibold">After 2:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Weekend/Holiday</span>
              <span className="text-gray-600 font-medium">Next Business Day</span>
            </div>
          </div>
        </div>

        {/* Deposit Limits */}
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Deposit Limits</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Daily Limit</span>
              <span className="text-gray-900 font-bold">$100,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Monthly Limit</span>
              <span className="text-gray-900 font-bold">$500,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Per Cheque Limit</span>
              <span className="text-gray-900 font-bold">€250,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
