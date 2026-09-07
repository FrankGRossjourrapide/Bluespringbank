import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login({ loginEmail, setLoginEmail, loginPassword, setLoginPassword, onLogin, onSwitchToRegister, authError, isLoading }) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center bg-linear-to-br from-blue-900 to-blue-700 p-4 md:p-6 py-8 md:py-12 w-full" style={{ marginTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="w-full" style={{ maxWidth: 'min(100%, 420px)' }}>
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-amber-200 to-amber-400 rounded-2xl mx-auto mb-3 md:mb-4 shrink-0"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Blue Spring Capital Bank</h1>
          <p className="text-sm md:text-base text-blue-200">Welcome back! Please login to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Login</h2>
          {authError && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{authError}</div>}

          <form onSubmit={onLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch:p-2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-900 rounded cursor-pointer" />
                <span className="ml-2 text-xs md:text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-xs md:text-sm text-blue-900 font-medium hover:underline active:opacity-70 transition py-2 md:py-0">Forgot Password?</button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 md:py-4 text-base md:text-lg rounded-lg font-bold hover:bg-blue-800 active:bg-blue-700 transition mb-4 min-h-12 touch:min-h-12"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            <div className="text-center">
              <span className="text-gray-600 text-sm md:text-base">Don't have an account? </span>
              <button type="button" onClick={onSwitchToRegister} className="text-blue-900 font-bold hover:underline active:opacity-70 transition text-sm md:text-base">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
