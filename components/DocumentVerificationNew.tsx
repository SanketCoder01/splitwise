'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, FileText, CheckCircle, AlertCircle, RefreshCw, 
  Lock, Unlock, Eye, EyeOff, Info, ExternalLink, Download
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Image from 'next/image'

export default function DocumentVerificationNew() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'aadhaar' | 'digilocker'>('aadhaar')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [showAadhaar, setShowAadhaar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<any>({})
  const [consent, setConsent] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [diglockerConnected, setDiglockerConnected] = useState(false)

  useEffect(() => {
    fetchVerificationStatus()
    generateCaptcha()
  }, [user])

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('document_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setVerificationStatus(data)
        setDiglockerConnected(data.digilocker_connected || false)
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    }
  }

  const generateCaptcha = () => {
    // Generate a simple captcha (in real implementation, this would be from a service)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaImage(result)
  }

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber || !captcha || !consent) {
      alert('Please fill all required fields and give consent')
      return
    }

    if (captcha !== captchaImage) {
      alert('Invalid captcha. Please try again.')
      generateCaptcha()
      setCaptcha('')
      return
    }

    setLoading(true)
    try {
      // In real implementation, this would call UIDAI API
      // For demo, we'll simulate the process
      
      // Step 1: Send OTP
      await new Promise(resolve => setTimeout(resolve, 2000))
      setOtpSent(true)
      
    } catch (error) {
      console.error('Error in Aadhaar verification:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update verification status in database
      const verificationData = {
        user_id: user?.id,
        aadhaar_number: aadhaarNumber,
        aadhaar_verified: true,
        aadhaar_verification_date: new Date().toISOString(),
        overall_verification_status: 'verified'
      }

      const { error } = await supabase
        .from('document_verifications')
        .upsert(verificationData)

      if (!error) {
        setVerificationStatus({ ...verificationStatus, ...verificationData })
        alert('Aadhaar verification successful!')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectDigiLocker = async () => {
    setLoading(true)
    try {
      // Simulate DigiLocker connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const verificationData = {
        user_id: user?.id,
        digilocker_connected: true,
        digilocker_verified: true,
        digilocker_verification_date: new Date().toISOString(),
        digilocker_documents: JSON.stringify([
          { name: '10th Certificate', verified: true },
          { name: '12th Certificate', verified: true },
          { name: 'Driving License', verified: true }
        ])
      }

      const { error } = await supabase
        .from('document_verifications')
        .upsert(verificationData)

      if (!error) {
        setVerificationStatus({ ...verificationStatus, ...verificationData })
        setDiglockerConnected(true)
        alert('DigiLocker connected successfully!')
      }
    } catch (error) {
      console.error('Error connecting DigiLocker:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderAadhaarVerification = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-gray-700" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Aadhaar based e-KYC</h3>
        <p className="text-gray-600 mt-2">Verify your identity using Aadhaar</p>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          {/* Aadhaar Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Number/Virtual ID *
            </label>
            <div className="relative">
              <input
                type={showAadhaar ? 'text' : 'password'}
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-12"
                placeholder="Enter your Aadhaar number or VID"
                maxLength={12}
              />
              <button
                type="button"
                onClick={() => setShowAadhaar(!showAadhaar)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showAadhaar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {aadhaarNumber && (
              <p className="text-xs text-gray-500 mt-1">
                {aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3')}
              </p>
            )}
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Captcha *
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter captcha"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 px-4 py-3 rounded-lg font-mono text-lg font-bold text-gray-800 select-none">
                  {captchaImage}
                </div>
                <button
                  onClick={generateCaptcha}
                  className="p-3 text-gray-500 hover:text-gray-700"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-gray-700 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">
                I consent to the use of my Aadhaar details for PM Internship Scheme.
                <a href="#" className="text-blue-600 hover:underline ml-1">
                  Read full consent here
                </a>
              </span>
            </label>
          </div>

          {/* Send OTP Button */}
          <button
            onClick={handleAadhaarVerification}
            disabled={!aadhaarNumber || !captcha || !consent || loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending OTP...</span>
              </>
            ) : (
              <span>Send OTP</span>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center bg-green-50 p-4 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">OTP sent successfully!</p>
            <p className="text-green-600 text-sm">Please check your registered mobile number</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP *
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-center text-lg tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setOtpSent(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={verifyOTP}
              disabled={otp.length !== 6 || loading}
              className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Proceed</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status */}
      {verificationStatus.aadhaar_verified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Aadhaar Verified Successfully</p>
              <p className="text-green-600 text-sm">
                Verified on {new Date(verificationStatus.aadhaar_verification_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderDigiLockerVerification = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">DigiLocker</h3>
        <p className="text-gray-600 mt-2">Connect your DigiLocker account to verify documents</p>
      </div>

      {!diglockerConnected ? (
        <div className="space-y-4">
          {/* DigiLocker Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">About DigiLocker</h4>
                <p className="text-blue-700 text-sm mt-1">
                  DigiLocker is a flagship initiative of Digital India programme aimed at 'Digital Empowerment' of citizen by providing access to authentic digital documents.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Secure & Authentic</h4>
              <p className="text-gray-600 text-sm">Government verified documents</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Multiple Documents</h4>
              <p className="text-gray-600 text-sm">Access all your certificates</p>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={connectDigiLocker}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                <span>Proceed Further</span>
              </>
            )}
          </button>

          {/* Help Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Note:</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  If you are facing issues in completing your e-KYC with Digilocker or if you need to update your profile information, please refer to{' '}
                  <a href="#" className="underline">Digilocker FAQ</a> or you can raise a{' '}
                  <a href="#" className="underline">ticket with Digilocker</a> at{' '}
                  <a href="https://support.digilocker.gov.in/open" className="underline">
                    https://support.digilocker.gov.in/open
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">DigiLocker Connected Successfully</p>
                <p className="text-green-600 text-sm">Your documents are now verified</p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Verified Documents:</h4>
            {verificationStatus.digilocker_documents && 
              JSON.parse(verificationStatus.digilocker_documents).map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{doc.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 text-sm">Verified</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Document Verification</h1>
            <p className="text-gray-100">Verify your identity and documents securely</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('aadhaar')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'aadhaar'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Aadhaar e-KYC</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('digilocker')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'digilocker'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>DigiLocker</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'aadhaar' && renderAadhaarVerification()}
              {activeTab === 'digilocker' && renderDigiLockerVerification()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
