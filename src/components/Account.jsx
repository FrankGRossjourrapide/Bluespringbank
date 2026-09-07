import React from 'react'

export default function Account() {
  return (
    <div className="flex-1 overflow-y-auto pb-24 w-full" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-4 md:p-6 sticky top-0 z-20">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Account Details</h2>
      </div>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold shrink-0">SC</div>
            <div className="text-center sm:text-left">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Sound Cloud</div>
              <div className="text-gray-600 text-sm md:text-base">Premium Account</div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-4 border-b border-gray-200 gap-2">
              <span className="text-gray-600 text-sm md:text-base">Account Number</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">**** **** 8965</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-4 border-b border-gray-200 gap-2">
              <span className="text-gray-600 text-sm md:text-base">Account Type</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">Checking</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-4 border-b border-gray-200 gap-2">
              <span className="text-gray-600 text-sm md:text-base">Branch</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">London Central</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-4 gap-2">
              <span className="text-gray-600 text-sm md:text-base">Member Since</span>
              <span className="font-semibold text-gray-900 text-sm md:text-base">January 2020</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
