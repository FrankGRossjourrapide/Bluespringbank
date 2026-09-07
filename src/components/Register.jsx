import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, Check, AlertCircle, Shield } from 'lucide-react'

export default function Register({ registerName, setRegisterName, registerEmail, setRegisterEmail, registerPassword, setRegisterPassword, registerConfirmPassword, setRegisterConfirmPassword, onRegister, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [activeTab, setActiveTab] = useState('basic') // 'basic', 'personal', 'security', 'terms'
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    securityQuestion: 'What is your mother\'s maiden name?',
    securityAnswer: ''
  })
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const passwordStrength = (password) => {
    if (!password) return { level: 0, text: 'No password', color: 'bg-gray-300' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++
    
    if (strength <= 1) return { level: 1, text: 'Weak', color: 'bg-red-500' }
    if (strength <= 2) return { level: 2, text: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 3) return { level: 3, text: 'Good', color: 'bg-blue-500' }
    return { level: 4, text: 'Strong', color: 'bg-green-500' }
  }

  const strength = passwordStrength(registerPassword)

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter'
    if (!/[a-z]/.test(password)) return 'Must contain lowercase letter'
    if (!/[0-9]/.test(password)) return 'Must contain number'
    if (!/[!@#$%^&*]/.test(password)) return 'Must contain special character (!@#$%^&*)'
    return ''
  }

  const validatePhone = (phone) => {
    const re = /^\+?1?\s?\(?\d{3}\)?\s?-?\d{3}-?\d{4}$/
    return re.test(phone.replace(/\s/g, ''))
  }

  const validateZipCode = (zip) => {
    const re = /^\d{5}(-\d{4})?$/
    return re.test(zip)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!registerName.trim()) newErrors.name = 'Name is required'
    if (!registerEmail.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(registerEmail)) newErrors.email = 'Invalid email format'
    if (!registerPassword) newErrors.password = 'Password is required'
    else {
      const passwordError = validatePassword(registerPassword)
      if (passwordError) newErrors.password = passwordError
    }
    if (!registerConfirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (registerPassword !== registerConfirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone format (e.g., (555) 123-4567)'
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'
    else if (!validateZipCode(formData.zipCode)) newErrors.zipCode = 'Invalid zip code format (e.g., 12345 or 12345-6789)'
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.securityAnswer.trim()) newErrors.securityAnswer = 'Security answer is required'
    if (!agreedToTerms) newErrors.terms = 'You must agree to Terms of Service'
    if (!agreedToPrivacy) newErrors.privacy = 'You must agree to Privacy Policy'

    if (Object.keys(newErrors).length === 0) {
      setErrors({})
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        onRegister(e)
      }, 2000)
    } else {
      setErrors(newErrors)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '' },
    { id: 'personal', label: 'Personal', icon: '' },
    { id: 'security', label: 'Security', icon: '' },
    { id: 'terms', label: 'Terms', icon: '' }
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-linear-to-br from-blue-900 to-blue-700 p-4 md:p-5 py-8 md:py-10 w-full" style={{ marginTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="w-full mx-auto" style={{ maxWidth: 'min(100%, 480px)' }}>
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-amber-200 to-amber-400 rounded-2xl mx-auto mb-3 md:mb-4 shrink-0"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Blue Spring Capital Bank</h1>
          <p className="text-sm md:text-base text-blue-200">Create your account to get started with mobile banking</p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-green-800 font-semibold text-sm md:text-base">Account registered successfully! Redirecting...</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 px-4 font-semibold text-center transition ${activeTab === tab.id ? 'bg-blue-50 border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-7">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Create a strong password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {registerPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className={`h-full ${strength.color} transition`} style={{ width: `${(strength.level / 4) * 100}%` }}></div>
                        </div>
                        <span className={`text-sm font-semibold ${strength.level === 1 ? 'text-red-600' : strength.level === 2 ? 'text-yellow-600' : strength.level === 3 ? 'text-blue-600' : 'text-green-600'}`}>
                          {strength.text}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Min 8 chars, uppercase, lowercase, number & special char (!@#$%^&*)</p>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Confirm your password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Street Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="123 Main Street"
                    />
                  </div>
                  {errors.addressLine && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.addressLine}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="NY"
                      maxLength="2"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="10001 or 10001-1234"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.zipCode}</p>}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Questions</h2>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Security Question *</label>
                  <select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                    <option value="What city were you born in?">What city were you born in?</option>
                    <option value="What is your favorite book?">What is your favorite book?</option>
                    <option value="What high school did you attend?">What high school did you attend?</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Answer *</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your answer"
                  />
                  {errors.securityAnswer && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.securityAnswer}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-blue-900 flex items-center gap-2"><Shield className="w-5 h-5" /> Security Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Use strong passwords with mixed characters</li>
                    <li>✓ Never share your security questions with anyone</li>
                    <li>✓ Keep your recovery email and phone updated</li>
                    <li>✓ Enable two-factor authentication after registration</li>
                    <li>✓ Use a unique password for your banking account</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Terms Tab */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Agreements</h2>
                
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: errors.terms ? '#ef4444' : '#d1d5db' }}>
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-1 text-blue-600 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-gray-900">I agree to the Terms of Service *</p>
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:underline text-sm mt-1"
                    >
                      View Terms of Service
                    </button>
                  </div>
                </label>
                {errors.terms && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.terms}</p>}

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: errors.privacy ? '#ef4444' : '#d1d5db' }}>
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="w-5 h-5 mt-1 text-blue-600 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-gray-900">I agree to the Privacy Policy *</p>
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:underline text-sm mt-1"
                    >
                      View Privacy Policy
                    </button>
                  </div>
                </label>
                {errors.privacy && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.privacy}</p>}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab)
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id)
                }}
                disabled={activeTab === tabs[0].id}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Back
              </button>
              {activeTab === tabs[tabs.length - 1].id ? (
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Create Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab)
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id)
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center mt-6">
          <span className="text-white">Already have an account? </span>
          <button type="button" onClick={onSwitchToLogin} className="text-amber-300 font-bold hover:underline">Login here</button>
        </div>

        {/* Educational Section */}
        <div className="hidden">
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
            Mobile Banking Registration Guide for Blue Spring Capital Bank
          </h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">1. Registration Information Requirements</h4>
              <p className="text-sm">
                USA banks require comprehensive customer information under Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations mandated by FinCEN. During mobile banking registration, you must provide: full legal name (as on government ID), valid email address, verified phone number, residential address, date of birth, and security questions for account recovery. Banks may also request Social Security Number (SSN) for credit reporting and tax purposes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">2. Password Security & Requirements</h4>
              <p className="text-sm">
                Banks enforce password policies meeting NIST standards: minimum 8 characters, mix of uppercase and lowercase letters, numbers, and special characters. Strong passwords contain 12+ characters and avoid dictionary words or personal information. Your password is never stored in plain text - banks use bcrypt or similar hashing algorithms. Two-factor authentication (2FA) adds an extra security layer by requiring verification through SMS, authenticator apps, or biometric methods after password entry.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">3. Personal & Address Verification</h4>
              <p className="text-sm">
                Address verification helps prevent fraud and ensures regulatory compliance. Banks confirm your address through the USPS database, third-party verification services, or postal records. The address you register must match your current ID documentation. Some banks use address verification questions (AVQ) asking about your past addresses. Updating your address promptly is important for account security and avoiding mail delivery issues for statements and security codes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">4. Security Questions & Account Recovery</h4>
              <p className="text-sm">
                Security questions serve dual purposes: initial identity verification during account setup and account recovery if you forget your password. Choose questions with answers difficult for others to guess - not ones with publicly available information. Examples include pet names, teacher names, or childhood locations (not "Mother's maiden name" if easily found publicly). Banks store these answers securely and use them during suspicious login attempts or phone-based customer service calls for additional authentication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">5. Regulatory Compliance & Data Protection</h4>
              <p className="text-sm">
                USA banks comply with multiple regulations including the Bank Secrecy Act, Gramm-Leach-Bliley Act (GLBA), and Fair Credit Reporting Act (FCRA). Banks must verify customer identity, prevent money laundering, and protect customer data. Sensitive information is encrypted with TLS/SSL during transmission and AES-256 at rest. Banks conduct background checks and may flag high-risk customers for enhanced due diligence. You have rights under FCRA to dispute inaccurate information and opt out of certain data sharing practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>1. Account Ownership:</strong> You must be 18+ years old and responsible for maintaining account security and confidentiality of login credentials.</p>
              <p><strong>2. Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and maintain its accuracy.</p>
              <p><strong>3. Prohibited Activities:</strong> You agree not to use the service for illegal activities, fraud, harassment, or any violation of USA laws.</p>
              <p><strong>4. Liability Limitation:</strong> Bank is not liable for unauthorized access due to your failure to maintain password security or notification of suspicious activity.</p>
              <p><strong>5. Service Modifications:</strong> Bank reserves the right to modify or discontinue service with appropriate notice to customers.</p>
              <p><strong>6. Dispute Resolution:</strong> Disputes will be resolved through arbitration as per FDIC regulations and customer agreement terms.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>1. Information Collection:</strong> We collect information you provide and data generated by your use of our services (transactions, login records, device information).</p>
              <p><strong>2. Data Usage:</strong> Your information is used to provide banking services, prevent fraud, comply with legal obligations, and improve our services.</p>
              <p><strong>3. Data Sharing:</strong> We share information only with authorized service providers, law enforcement when required, and other entities with your consent.</p>
              <p><strong>4. Data Security:</strong> We use industry-standard encryption and security measures. No method is 100% secure, but we maintain strict protocols.</p>
              <p><strong>5. Your Rights:</strong> You have rights to access your data, request corrections, opt out of marketing, and dispute inaccuracies under FCRA.</p>
              <p><strong>6. Policy Updates:</strong> We may update this policy with 30 days notice. Continued use constitutes acceptance of updates.</p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

