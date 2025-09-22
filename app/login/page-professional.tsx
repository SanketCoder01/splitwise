'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, User, Building2, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'student' | 'government'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
    otp: ''
  })
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [captchaCode, setCaptchaCode] = useState('A7B9C')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  useEffect(() => {
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setCaptchaCode(result)
    }
    generateCaptcha()
  }, [])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.captcha) {
      newErrors.captcha = 'Security code is required'
    } else if (formData.captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = 'Security code is incorrect'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStep('otp')
    setIsLoading(false)
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter valid 6-digit OTP' })
      return
    }
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (userType === 'student') {
      router.push('/dashboard')
    } else {
      router.push('/gov-dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Government Header */}
      <header className="bg-white shadow-sm border-b-4 border-orange-500 relative z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RESUCHAIN</h1>
                <p className="text-sm text-gray-600">Government of India | Ministry of Electronics & IT</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">सत्यमेव जयते</p>
              <p className="text-xs text-gray-500">Truth Alone Triumphs</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 relative z-10">
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Login Portal</h2>
              <p className="text-gray-600">AI-Powered Resume Verification System</p>
              <div className="flex items-center justify-center mt-4 space-x-2">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">256-bit SSL Encrypted</span>
              </div>
            </div>

            {/* User Type Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-4 mb-8"
            >
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl border-2 transition-all duration-300 ${
                  userType === 'student'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <User className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Student</div>
                  <div className="text-xs opacity-75">Resume Verification</div>
                </div>
              </button>
              <button
                onClick={() => setUserType('government')}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl border-2 transition-all duration-300 ${
                  userType === 'government'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <Building2 className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Government</div>
                  <div className="text-xs opacity-75">Official Portal</div>
                </div>
              </button>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  {step === 'login' ? 'Login Credentials' : 'OTP Verification'}
                </h3>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 'login' ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          {userType === 'student' ? 'Email Address' : 'Government ID / Email'}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                            errors.email 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          } focus:ring-2 focus:ring-blue-200`}
                          placeholder={userType === 'student' ? 'Enter your email address' : 'Enter government ID or email'}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all duration-200 ${
                              errors.password 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                            } focus:ring-2 focus:ring-blue-200`}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.password}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="captcha" className="block text-sm font-semibold text-gray-700 mb-2">
                          Security Verification
                        </label>
                        <div className="flex space-x-3">
                          <input
                            id="captcha"
                            name="captcha"
                            type="text"
                            required
                            value={formData.captcha}
                            onChange={(e) => setFormData({ ...formData, captcha: e.target.value.toUpperCase() })}
                            className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                              errors.captcha 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                            } focus:ring-2 focus:ring-blue-200`}
                            placeholder="Enter security code"
                            maxLength={5}
                          />
                          <div className="w-28 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 tracking-wider select-none">
                            {captchaCode}
                          </div>
                        </div>
                        {errors.captcha && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.captcha}
                          </motion.p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          `Sign in as ${userType === 'student' ? 'Student' : 'Government Official'}`
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleOTPSubmit}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">OTP Verification</h4>
                        <p className="text-sm text-gray-600">
                          We've sent a 6-digit verification code to your registered email/mobile
                        </p>
                      </div>

                      <div>
                        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                          Enter OTP
                        </label>
                        <input
                          id="otp"
                          name="otp"
                          type="text"
                          required
                          value={formData.otp}
                          onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                          className={`w-full px-4 py-3 border-2 rounded-lg text-center text-2xl tracking-widest transition-all duration-200 ${
                            errors.otp 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          } focus:ring-2 focus:ring-blue-200`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {errors.otp && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1 text-sm text-red-600 flex items-center justify-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.otp}
                          </motion.p>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setStep('login')}
                          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify & Login'
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Resend OTP
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {step === 'login' && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Register here
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Security Notice</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    This is a secure government portal. All activities are monitored and logged for security purposes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">ResuChain</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-400">Government of India</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/help" className="hover:text-white">Help</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-4 pt-4 text-center text-sm text-gray-400">
            <p>&copy; 2025 ResuChain - Government of India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
