'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, User, Building2, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'

export default function GovernmentLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    captcha: '',
    otp: ''
  })
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [captchaCode, setCaptchaCode] = useState('G7X9M')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()
  const supabase = createClientComponentClient()

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
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required'
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
    
    try {
      // Check government official credentials
      const { data: official, error } = await supabase
        .from('government_officials')
        .select('*')
        .eq('employee_id', formData.employeeId)
        .single()
      
      if (error || !official) {
        setErrors({ employeeId: 'Invalid Employee ID' })
        setIsLoading(false)
        return
      }
      
      // Simple password check (in production, use proper hashing)
      const validPasswords = {
        'GOV001': 'password123',
        'GOV002': 'password123', 
        'GOV003': 'password123'
      }
      
      if (validPasswords[formData.employeeId as keyof typeof validPasswords] !== formData.password) {
        setErrors({ password: 'Invalid Password' })
        setIsLoading(false)
        return
      }
      
      // Store official data in session storage for gov dashboard
      sessionStorage.setItem('government_official', JSON.stringify(official))
      
      toast.success(`Welcome ${official.name}!`)
      setStep('otp')
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Login failed. Please try again.' })
    }
    
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
    router.push('/gov-dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .sliding-images-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .sliding-image-login {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: slideRightToLeftLogin 20s linear infinite;
        }
        
        .sliding-image-login:nth-child(1) { 
          animation-delay: 0s; 
        }
        .sliding-image-login:nth-child(2) { 
          animation-delay: 5s; 
        }
        .sliding-image-login:nth-child(3) { 
          animation-delay: 10s; 
        }
        .sliding-image-login:nth-child(4) { 
          animation-delay: 15s; 
        }
        
        @keyframes slideRightToLeftLogin {
          0% { 
            transform: translateX(100%);
            opacity: 0;
          }
          10% { 
            opacity: 0.7;
          }
          90% { 
            opacity: 0.7;
          }
          100% { 
            transform: translateX(-100%);
            opacity: 0;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto">
          {/* Top Government Bar */}
          <div className="bg-gray-100 px-4 py-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🇮🇳 भारत सरकार | Government of India</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🌐 English</span>
                <span>|</span>
                <span>हिंदी</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div className="text-center">
                  <h1 className="text-xl font-bold text-gray-900">PM Internship & Resume Verifier</h1>
                  <p className="text-xs text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500">Government of India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Sliding Images */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-100">
          {/* Sliding Images */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="sliding-images-container">
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                  alt="Government building"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop"
                  alt="Government office"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
                  alt="Digital government"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=800&h=600&fit=crop"
                  alt="Government services"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
            </div>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center h-full p-8">
            <div className="text-center text-white mb-8">
              <h2 className="text-4xl font-bold mb-4">Welcome to</h2>
              <h1 className="text-5xl font-bold mb-6 text-green-400">Government Portal</h1>
              <p className="text-xl mb-8 leading-relaxed max-w-md">
                Secure access for government officials to manage internship programs and verify student credentials
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm opacity-90">Departments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm opacity-90">Officials</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text below images */}
            <div className="text-center text-white/90 mt-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">Official Government Access</h3>
                <p className="text-sm leading-relaxed max-w-lg mx-auto">
                  Ministry of Education - Authorized personnel portal for managing PM Internship programs.
                  Secure access for government officials to oversee student applications and verification processes.
                </p>
                <div className="mt-4 text-xs opacity-75">
                  <p>🔐 High Security | 👥 Official Access | 🏛️ Government Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8">
          <div className="max-w-md w-full">
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
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Government Login</h2>
                <p className="text-gray-600">Secure access for authorized officials</p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">High Security Access</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your employee ID"
                      />
                      {errors.employeeId && (
                        <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Code
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={formData.captcha}
                          onChange={(e) => setFormData({...formData, captcha: e.target.value})}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Enter code"
                        />
                        <div className="bg-gray-100 px-4 py-3 rounded-lg border font-mono text-lg tracking-wider">
                          {captchaCode}
                        </div>
                      </div>
                      {errors.captcha && (
                        <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Authenticating...
                        </div>
                      ) : (
                        'Secure Login'
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleOTPSubmit}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-gray-600">Enter the 6-digit code sent to your registered device</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) => setFormData({...formData, otp: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      {errors.otp && (
                        <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : (
                        'Verify & Login'
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep('login')}
                      className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                    >
                      ← Back to Login
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact{' '}
                  <Link href="/support" className="text-green-600 hover:text-green-700 font-medium">
                    IT Support
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
