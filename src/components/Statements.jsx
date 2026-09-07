import React, { useState } from 'react'
import { ChevronLeft, FileText, Download, Mail, Calendar, Filter, Eye, EyeOff, ArrowRight, Check, Clock, AlertCircle, Info, Settings, Shield } from 'lucide-react'

export default function Statements({ setCurrentView, preferences }) {
  const [selectedAccount, setSelectedAccount] = useState('primary')
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedType, setSelectedType] = useState('full')
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-04-14')
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [emailFrequency, setEmailFrequency] = useState('monthly')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedStatements, setSelectedStatements] = useState([])
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Formatting function
  const formatCurrency = (amount) => {
    const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$' }
    const symbol = currencySymbols[preferences?.currency] || '$'
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const accounts = [
    { id: 'primary', name: 'Checking Account', number: '****1234' },
    { id: 'savings', name: 'Savings Account', number: '****5678' },
    { id: 'mm', name: 'Money Market', number: '****9012' }
  ]

  const statementHistory = [
    { id: 1, month: 'April 2026', startDate: '04-01-2026', endDate: '04-14-2026', status: 'ready', transactionCount: 42, balance: 14250.50, generatedDate: '04-14-2026' },
    { id: 2, month: 'March 2026', startDate: '03-01-2026', endDate: '03-31-2026', status: 'ready', transactionCount: 58, balance: 13890.75, generatedDate: '04-01-2026' },
    { id: 3, month: 'February 2026', startDate: '02-01-2026', endDate: '02-28-2026', status: 'ready', transactionCount: 45, balance: 14120.25, generatedDate: '03-01-2026' },
    { id: 4, month: 'January 2026', startDate: '01-01-2026', endDate: '01-31-2026', status: 'processing', transactionCount: 52, balance: 13500.00, generatedDate: '02-01-2026' },
    { id: 5, month: 'December 2025', startDate: '12-01-2025', endDate: '12-31-2025', status: 'ready', transactionCount: 68, balance: 12800.50, generatedDate: '01-01-2026' },
    { id: 6, month: 'November 2025', startDate: '11-01-2025', endDate: '11-30-2025', status: 'ready', transactionCount: 55, balance: 12300.75, generatedDate: '12-01-2025' }
  ]

  const filteredStatements = statementHistory.filter(stmt => {
    const searchTermLower = searchTerm.toLowerCase()
    return stmt.month.toLowerCase().includes(searchTermLower) ||
           stmt.status.toLowerCase().includes(searchTermLower)
  })

  const handleDownload = (statement, format) => {
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const handleSelectStatement = (id) => {
    setSelectedStatements(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleBulkDownload = () => {
    if (selectedStatements.length > 0) {
      setDownloadSuccess(true)
      setTimeout(() => {
        setDownloadSuccess(false)
        setSelectedStatements([])
      }, 3000)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:bg-blue-700 p-2 rounded-lg transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Account Statements</h2>
        </div>
        <p className="text-blue-100 text-sm mt-1">Download and manage your financial statements</p>
      </div>

      {/* Success Message */}
      {downloadSuccess && (
        <div className="m-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-green-800 font-semibold">Statement downloaded successfully!</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Quick Download Section */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Quick Download</h3>
          <div className="space-y-4">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.number})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Statement Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  <option value="full">Full Statement</option>
                  <option value="summary">Summary Only</option>
                  <option value="tax">Tax Summary</option>
                </select>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>

              {/* Download Button */}
              <div className="flex items-end">
                <button
                  onClick={() => handleDownload(null, selectedFormat)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Date Range Filter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Search and Bulk Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search statements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {selectedStatements.length > 0 && (
              <button
                onClick={handleBulkDownload}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download {selectedStatements.length}
              </button>
            )}
          </div>

          {/* Statement History List */}
          <div className="space-y-3">
            {filteredStatements.map(statement => (
              <div
                key={statement.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedStatements.includes(statement.id)}
                  onChange={() => handleSelectStatement(statement.id)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer mr-4"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{statement.month}</p>
                      <p className="text-xs text-gray-600">{statement.startDate} - {statement.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span>{statement.transactionCount} transactions</span>
                    <span>Balance: {formatCurrency(statement.balance)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {statement.status === 'ready' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Ready</span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Processing
                    </span>
                  )}
                  <button
                    onClick={() => handleDownload(statement, 'pdf')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                    title="Download as PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Delivery Settings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Email Delivery
          </h3>
          
          <div className="space-y-4">
            {/* Email Toggle */}
            <label className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <span className="ml-3 font-semibold text-gray-900">Automatically email statements to john@example.com</span>
            </label>

            {/* Email Frequency */}
            {emailEnabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Frequency</label>
                <select
                  value={emailFrequency}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="monthly">Monthly (end of statement period)</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
            )}

            {/* Format for Email */}
            {emailEnabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Format</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="emailFormat" value="secured" defaultChecked className="w-4 h-4 text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">Secure link (recommended)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="emailFormat" value="attachment" className="w-4 h-4 text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">PDF attachment</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statement Options Settings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Statement Preferences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-sm font-medium text-gray-900">Include opening balance</span>
            </label>
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-sm font-medium text-gray-900">Include pending transactions</span>
            </label>
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-sm font-medium text-gray-900">Include investment details</span>
            </label>
            <label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="ml-3 text-sm font-medium text-gray-900">Paper statements (keep paper copies)</span>
            </label>
          </div>
        </div>

        {/* Available Formats Info */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Available Download Formats
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>PDF:</strong> Standard format for viewing and printing, protected and universally compatible</p>
            <p><strong>CSV:</strong> Comma-separated values for data analysis and spreadsheet import</p>
            <p><strong>Excel:</strong> Microsoft Excel format for advanced data analysis and reporting</p>
          </div>
        </div>

        {/* Educational Section */}
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 space-y-4">
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Understanding Bank Statements in USA Mobile Banking
          </h3>

          <div className="space-y-3 text-gray-700">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">1. Statement Formats & Components</h4>
              <p className="text-sm">
                Bank statements include opening balance, deposits, withdrawals, fees, interest earned, and closing balance. Full statements list all transactions with description, date, and amount. Summary statements show only totals. Tax statements include interest income for 1099-INT reporting to the IRS.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">2. Statement Timing & Availability</h4>
              <p className="text-sm">
                Monthly statements typically generate 1-3 days after month-end. Most USA banks provide immediate access to e-statements. Paper statements take 5-7 business days to arrive. You can download statements for the current and prior 7 years under Regulation E.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">3. Data Security & Privacy</h4>
              <p className="text-sm">
                Bank statements contain sensitive personal and financial information. Always download via secure connections. Banks encrypt statements and allow secure links instead of email attachments. Never forward statements to unverified parties.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">4. Tax & Accounting Uses</h4>
              <p className="text-sm">
                Statements serve as proof of transactions for tax purposes and financial audits. Interest income appears on 1099-INT forms. Charitable donation receipts reference statement dates. Some statements show estimated taxes paid.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">5. Reconciliation & Fraud Detection</h4>
              <p className="text-sm">
                Review statements monthly to verify all transactions and catch unauthorized activity. Reconcile checking accounts by matching transactions with your records. Report discrepancies within 60 days (EFTA requirement). Look for unexpected fees or charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
