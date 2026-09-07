import React, { useState } from 'react'
import { Plus, DollarSign, ArrowLeftRight, ChevronLeft, X } from 'lucide-react'

export default function History({ transactions, setCurrentView, preferences }) {
  const [filterType, setFilterType] = useState('All Types')
  const [filterStatus, setFilterStatus] = useState('All Statuses')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')

  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filterType === 'All Types' || t.type === filterType
    const statusMatch = filterStatus === 'All Statuses' || t.status === filterStatus
    const amountMatch = (minAmount === '' || t.amount >= parseFloat(minAmount)) && (maxAmount === '' || t.amount <= parseFloat(maxAmount))
    return typeMatch && statusMatch && amountMatch
  })

  const clearFilters = () => {
    setFilterType('All Types')
    setFilterStatus('All Statuses')
    setFromDate('')
    setToDate('')
    setMinAmount('')
    setMaxAmount('')
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Account History</h2>
            <p className="text-blue-100 text-sm">View your master account transaction history</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Account Info Card */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sound mind</h3>
              <p className="text-sm text-gray-500">Account: 6002693421</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">€72,139.59</div>
              <p className="text-sm text-gray-500">Available: €72,139.59</p>
            </div>
          </div>
        </div>

        {/* Filter Transactions Section */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Filter Transactions</h3>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="bg-white rounded-xl p-4 shadow border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'deposit' ? 'bg-green-100' : transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {transaction.type === 'deposit' ? <Plus className="w-5 h-5 text-green-600" /> : transaction.type === 'withdrawal' ? <DollarSign className="w-5 h-5 text-red-600" /> : <ArrowLeftRight className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}</div>
                    <span className={`text-xs px-2 py-1 rounded ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{transaction.status === 'completed' ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
