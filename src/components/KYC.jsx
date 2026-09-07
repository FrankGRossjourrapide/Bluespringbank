import React, { useState } from 'react'
import { CheckCircle, AlertCircle, Upload, Camera, FileText, MapPin, User, Clock, Shield, Home, Eye, ChevronRight } from 'lucide-react'

export default function KYC() {
  const [currentStep, setCurrentStep] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState('verified') // 'verified', 'pending', 'rejected', 'in-progress'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    ssn: '123-45-****',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  })
  const [documents, setDocuments] = useState({
    identityDoc: 'Passport - Verified',
    addressProof: 'Utility Bill - Verified',
    selfie: 'Photo - Verified'
  })
  const [uploadedFiles, setUploadedFiles] = useState({
    identityDoc: null,
    addressProof: null,
    selfie: null
  })
  const [uploadDragActive, setUploadDragActive] = useState({
    identityDoc: false,
    addressProof: false,
    selfie: false
  })
  const [uploadErrors, setUploadErrors] = useState({
    identityDoc: '',
    addressProof: '',
    selfie: ''
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'passport',
    documentNumber: ''
  })

  const kycSteps = [
    { id: 1, title: 'Personal Info', icon: User, description: 'Enter your details' },
    { id: 2, title: 'Identity Doc', icon: FileText, description: 'Upload ID/Passport' },
    { id: 3, title: 'Address Proof', icon: Home, description: 'Verify residence' },
    { id: 4, title: 'Photo', icon: Camera, description: 'Face verification' },
    { id: 5, title: 'Review', icon: Eye, description: 'Confirm & submit' }
  ]

  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']

  const validateFile = (file, fileType) => {
    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return `Invalid file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`
    }
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }
    return ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (file, fileType) => {
    const error = validateFile(file, fileType)
    if (error) {
      setUploadErrors(prev => ({
        ...prev,
        [fileType]: error
      }))
      return
    }
    
    setUploadErrors(prev => ({
      ...prev,
      [fileType]: ''
    }))
    
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString()
      }
    }))
  }

  const handleFileInputChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], fileType)
    }
  }

  const handleDrag = (e, fileType, isDragging) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadDragActive(prev => ({
      ...prev,
      [fileType]: isDragging
    }))
  }

  const handleDrop = (e, fileType) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadDragActive(prev => ({
      ...prev,
      [fileType]: false
    }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], fileType)
    }
  }

  const removeFile = (fileType) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: null
    }))
    setUploadErrors(prev => ({
      ...prev,
      [fileType]: ''
    }))
  }

  const handleNextStep = () => {
    if (currentStep < kycSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitVerification = () => {
    if (uploadedFiles.identityDoc && uploadedFiles.addressProof && uploadedFiles.selfie) {
      setVerificationStatus('in-progress')
      setTimeout(() => {
        setVerificationStatus('verified')
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      }, 1500)
    } else {
      alert('Please upload all required documents')
    }
  }

  const handleResubmit = () => {
    setCurrentStep(0)
    setVerificationStatus('in-progress')
    setUploadedFiles({ identityDoc: false, addressProof: false, selfie: false })
  }

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold">KYC Verification</h2>
        <p className="text-blue-100 text-sm mt-1">Complete your identity verification for enhanced banking access</p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="m-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-green-800">Verification submitted successfully! Your documents are being reviewed.</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Current Status */}
        {verificationStatus === 'verified' ? (
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-16 h-16 text-green-600 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-green-900">Verification Complete</h3>
                <p className="text-green-700 mt-1">Your identity has been successfully verified. All services are now available.</p>
              </div>
            </div>

            {/* Verified Documents */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Identity Document</span>
                </div>
                <p className="text-sm text-gray-600">{documents.identityDoc}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Address Proof</span>
                </div>
                <p className="text-sm text-gray-600">{documents.addressProof}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Photo Verification</span>
                </div>
                <p className="text-sm text-gray-600">{documents.selfie}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">Your Verified Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Full Name</p>
                  <p className="font-semibold text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{personalInfo.dateOfBirth}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-900">{personalInfo.email}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Phone</p>
                  <p className="font-semibold text-gray-900">{personalInfo.phone}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleResubmit}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Update Verification Information
            </button>
          </div>
        ) : verificationStatus === 'in-progress' ? (
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-4">
              <Clock className="w-16 h-16 text-yellow-600 shrink-0 animate-spin" />
              <div>
                <h3 className="text-xl font-bold text-yellow-900">Verification In Progress</h3>
                <p className="text-yellow-700 mt-1">Your documents are being reviewed. This usually takes 24-48 hours.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Step Progress */}
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Steps</h3>
              <div className="space-y-3">
                {kycSteps.map((step, idx) => {
                  const StepIcon = step.icon
                  const isActive = idx === currentStep
                  const isCompleted = idx < currentStep
                  return (
                    <div
                      key={step.id}
                      onClick={() => setCurrentStep(idx)}
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition ${
                        isActive
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : isCompleted
                          ? 'bg-green-50 border border-green-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || personalInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || personalInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver's License</option>
                      <option value="state-id">State ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document Number</label>
                    <input
                      type="text"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="Enter document number"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Upload Identity Document
                  </h3>
                  <p className="text-gray-600 text-sm">Accepted: Passport, Driver's License, State ID (PNG, JPG, PDF - Max 10MB)</p>
                  
                  {uploadErrors.identityDoc && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-red-700">{uploadErrors.identityDoc}</span>
                    </div>
                  )}

                  {!uploadedFiles.identityDoc ? (
                    <>
                      <input
                        type="file"
                        id="identityDoc-input"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileInputChange(e, 'identityDoc')}
                        className="hidden"
                      />
                      <div
                        onDragEnter={(e) => handleDrag(e, 'identityDoc', true)}
                        onDragLeave={(e) => handleDrag(e, 'identityDoc', false)}
                        onDragOver={(e) => handleDrag(e, 'identityDoc', true)}
                        onDrop={(e) => handleDrop(e, 'identityDoc')}
                        onClick={() => document.getElementById('identityDoc-input').click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                          uploadDragActive.identityDoc
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold text-gray-900">Drag & drop your document here</p>
                        <p className="text-sm text-gray-600 mt-2">or click to browse from your device</p>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF (Max 10MB)</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Document Uploaded</p>
                            <p className="text-sm text-green-700 mt-1">
                              <strong>File:</strong> {uploadedFiles.identityDoc.name}
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Size:</strong> {(uploadedFiles.identityDoc.size / 1024 / 1024).toFixed(2)}MB
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Uploaded:</strong> {uploadedFiles.identityDoc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile('identityDoc')}
                          className="text-green-600 hover:text-green-800 font-semibold text-sm"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Upload Address Proof
                  </h3>
                  <p className="text-gray-600 text-sm">Accepted: Utility Bill, Bank Statement, Government Document (dated within last 3 months) - PNG, JPG, PDF - Max 10MB</p>
                  
                  {uploadErrors.addressProof && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-red-700">{uploadErrors.addressProof}</span>
                    </div>
                  )}

                  {!uploadedFiles.addressProof ? (
                    <>
                      <input
                        type="file"
                        id="addressProof-input"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileInputChange(e, 'addressProof')}
                        className="hidden"
                      />
                      <div
                        onDragEnter={(e) => handleDrag(e, 'addressProof', true)}
                        onDragLeave={(e) => handleDrag(e, 'addressProof', false)}
                        onDragOver={(e) => handleDrag(e, 'addressProof', true)}
                        onDrop={(e) => handleDrop(e, 'addressProof')}
                        onClick={() => document.getElementById('addressProof-input').click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                          uploadDragActive.addressProof
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold text-gray-900">Drag & drop your address proof here</p>
                        <p className="text-sm text-gray-600 mt-2">or click to browse from your device</p>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF (Max 10MB) - Current within 90 days</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Address Proof Uploaded</p>
                            <p className="text-sm text-green-700 mt-1">
                              <strong>File:</strong> {uploadedFiles.addressProof.name}
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Size:</strong> {(uploadedFiles.addressProof.size / 1024 / 1024).toFixed(2)}MB
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Uploaded:</strong> {uploadedFiles.addressProof.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile('addressProof')}
                          className="text-green-600 hover:text-green-800 font-semibold text-sm"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    Take Selfie Photo
                  </h3>
                  <p className="text-gray-600 text-sm">For face verification - ensure good lighting and clear view of your face. PNG, JPG (Max 10MB)</p>
                  
                  {uploadErrors.selfie && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-red-700">{uploadErrors.selfie}</span>
                    </div>
                  )}

                  {!uploadedFiles.selfie ? (
                    <>
                      <input
                        type="file"
                        id="selfie-input"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileInputChange(e, 'selfie')}
                        className="hidden"
                      />
                      <div
                        onDragEnter={(e) => handleDrag(e, 'selfie', true)}
                        onDragLeave={(e) => handleDrag(e, 'selfie', false)}
                        onDragOver={(e) => handleDrag(e, 'selfie', true)}
                        onDrop={(e) => handleDrop(e, 'selfie')}
                        onClick={() => document.getElementById('selfie-input').click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                          uploadDragActive.selfie
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold text-gray-900">Drag & drop your selfie here</p>
                        <p className="text-sm text-gray-600 mt-2">or click to upload from your device</p>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 10MB) - Clear, front-facing photo required</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Selfie Uploaded</p>
                            <p className="text-sm text-green-700 mt-1">
                              <strong>File:</strong> {uploadedFiles.selfie.name}
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Size:</strong> {(uploadedFiles.selfie.size / 1024 / 1024).toFixed(2)}MB
                            </p>
                            <p className="text-sm text-green-700">
                              <strong>Uploaded:</strong> {uploadedFiles.selfie.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile('selfie')}
                          className="text-green-600 hover:text-green-800 font-semibold text-sm"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>Tips for best results:</strong> Make sure your face takes up 70-80% of the photo, ensure good lighting (no shadows), look directly at camera, keep neutral expression, and remove sunglasses/hats.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Review & Submit
                  </h3>
                  <div className="space-y-3">
                    <div className={`rounded-lg p-4 flex items-start justify-between ${
                      uploadedFiles.identityDoc 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div>
                        <p className={`font-semibold ${uploadedFiles.identityDoc ? 'text-green-900' : 'text-red-900'}`}>
                          Identity Document
                        </p>
                        {uploadedFiles.identityDoc && (
                          <div className="text-sm mt-2 space-y-1">
                            <p className="text-green-700"><strong>File:</strong> {uploadedFiles.identityDoc.name}</p>
                            <p className="text-green-700"><strong>Size:</strong> {(uploadedFiles.identityDoc.size / 1024 / 1024).toFixed(2)}MB</p>
                            <p className="text-green-700"><strong>Uploaded:</strong> {uploadedFiles.identityDoc.uploadedAt}</p>
                          </div>
                        )}
                      </div>
                      {uploadedFiles.identityDoc ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Ready
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-5 h-5" /> Missing
                        </span>
                      )}
                    </div>
                    <div className={`rounded-lg p-4 flex items-start justify-between ${
                      uploadedFiles.addressProof 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div>
                        <p className={`font-semibold ${uploadedFiles.addressProof ? 'text-green-900' : 'text-red-900'}`}>
                          Address Proof
                        </p>
                        {uploadedFiles.addressProof && (
                          <div className="text-sm mt-2 space-y-1">
                            <p className="text-green-700"><strong>File:</strong> {uploadedFiles.addressProof.name}</p>
                            <p className="text-green-700"><strong>Size:</strong> {(uploadedFiles.addressProof.size / 1024 / 1024).toFixed(2)}MB</p>
                            <p className="text-green-700"><strong>Uploaded:</strong> {uploadedFiles.addressProof.uploadedAt}</p>
                          </div>
                        )}
                      </div>
                      {uploadedFiles.addressProof ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Ready
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-5 h-5" /> Missing
                        </span>
                      )}
                    </div>
                    <div className={`rounded-lg p-4 flex items-start justify-between ${
                      uploadedFiles.selfie 
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div>
                        <p className={`font-semibold ${uploadedFiles.selfie ? 'text-green-900' : 'text-red-900'}`}>
                          Selfie Photo
                        </p>
                        {uploadedFiles.selfie && (
                          <div className="text-sm mt-2 space-y-1">
                            <p className="text-green-700"><strong>File:</strong> {uploadedFiles.selfie.name}</p>
                            <p className="text-green-700"><strong>Size:</strong> {(uploadedFiles.selfie.size / 1024 / 1024).toFixed(2)}MB</p>
                            <p className="text-green-700"><strong>Uploaded:</strong> {uploadedFiles.selfie.uploadedAt}</p>
                          </div>
                        )}
                      </div>
                      {uploadedFiles.selfie ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Ready
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-5 h-5" /> Missing
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      By submitting, you confirm that all information provided is accurate and authorizes us to verify your identity for AML/KYC compliance.
                    </p>
                  </div>
                  <button
                    onClick={handleSubmitVerification}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Submit for Verification
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === kycSteps.length - 1}
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Educational Section */}
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-indigo-600" />
            Understanding KYC Verification in USA Mobile Banking
          </h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">1. What is KYC (Know Your Customer)?</h4>
              <p className="text-sm">
                KYC is a regulatory requirement enforced by the Financial Crimes Enforcement Network (FinCEN) under the USA PATRIOT Act. Banks must verify customer identity and assess money laundering risk. This protects both banks and customers by preventing fraud, identity theft, and financing of illegal activities. Online banking provides digital identity verification for convenience and security.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">2. Required Documents for Verification</h4>
              <p className="text-sm">
                <strong>Identity Documents:</strong> Accepted forms include valid US Passport, Driver's License, State-issued ID, or Enhanced Driver's License. Must be unexpired and contain a recent photo. <br/>
                <strong>Address Proof:</strong> Recent utility bill (electricity, gas, water), bank statement, government tax document, or residential lease. Must be dated within the last 90 days and show your name and full address.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">3. Photo Verification Process</h4>
              <p className="text-sm">
                Face recognition technology analyzes your selfie to verify it matches your ID document photo. The system checks facial features, expressions, and other biometric data. This prevents fraud and account takeovers. Banks may use additional security measures like liveness checks to ensure the selfie is from a real person in real-time, not a photograph.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">4. Processing Timeline & Verification Levels</h4>
              <p className="text-sm">
                <strong>Instant Verification:</strong> 5-15 minutes for successful automated verification (most common). <br/>
                <strong>Standard Review:</strong> 24-48 hours if additional manual review is needed. <br/>
                <strong>Enhanced Due Diligence:</strong> 5-7 business days for high-risk customers or transactions over $100,000. Banks may request additional documents like business licenses, financial statements, or source of funds documentation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">5. Privacy, Security & Compliance</h4>
              <p className="text-sm">
                All personal data is encrypted using bank-grade 256-bit SSL encryption. Documents are stored in secure servers compliant with SOC 2 Type II standards. Banks follow strict data retention policies (typically 5-7 years). You have rights under the Fair Credit Reporting Act (FCRA) to dispute inaccuracies. Biometric data is never shared with third parties without consent and is protected under state biometric privacy laws (like Illinois BIPA).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
