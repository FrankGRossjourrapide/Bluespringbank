import React from 'react'
import { Plus } from 'lucide-react'

export default function DepositHistory({ transactions, preferences }) {
  const deposits = transactions.filter(t => t.type === 'deposit')
  
  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6"><h2 className="text-2xl font-bold">Deposit History</h2></div>
      <div className="p-6">
        <div className="space-y-3">
          {deposits.map(transaction => (
            <div key={transaction.id} className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Plus className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{formatCurrency(transaction.amount)}</div>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{transaction.status === 'completed' ? 'Completed' : 'Pending'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
