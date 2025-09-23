'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, User, GraduationCap, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'


export default function StudentLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: '',
    otp: ''
  })
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [captchaCode, setCaptchaCode] = useState('G7X9M')
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

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router])


  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
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
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      )

      // Sign in with Supabase
      const signInPromise = supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Invalid email or password' })
        } else {
          setErrors({ general: error.message || 'Login failed. Please try again.' })
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        toast.success(`Welcome back!`)
        setStep('otp')
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.message === 'Request timeout') {
        setErrors({ general: 'Login request timed out. Please check your connection and try again.' })
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' })
      }
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
    router.push('/dashboard')
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
                  <h1 className="text-xl font-bold text-gray-900">PM Internship Portal</h1>
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
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-blue-100">
          {/* Sliding Images */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="sliding-images-container">
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                  alt="Students studying"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
                  alt="Student internship"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Students collaborating"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full opacity-70"
                />
              </div>
              <div className="sliding-image-login">
                <Image
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
                  alt="Student learning"
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
              <h1 className="text-5xl font-bold mb-6 text-orange-400">Student Portal</h1>
              <p className="text-xl mb-8 leading-relaxed max-w-md">
                Access your internship opportunities and build your career with government-backed programs
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm opacity-90">Internships</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-sm opacity-90">Departments</div>
                  </div>
                </div>
              </div>
            </div>


            {/* Text below images */}
            <div className="text-center text-white/90 mt-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">Student Access Portal</h3>
                <p className="text-sm leading-relaxed max-w-lg mx-auto">
                  Ministry of Education - Official student portal for PM Internship programs.
                  Secure access for students to explore opportunities and manage applications.
                </p>
                <div className="mt-4 text-xs opacity-75">
                  <p>🎓 Student Access | 🔐 Secure Login | 🏛️ Government Verified</p>
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
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Portal Access</h2>
                <p className="text-gray-600">Login to access your internship dashboard and opportunities</p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600 font-medium">Secure Student Access</span>
                </div>
              </div>


              {/* Login Type Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center space-x-2 p-3 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all"
                  >
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Student Login</span>
                  </button>
                  <Link
                    href="/gov-login"
                    className="flex items-center justify-center space-x-2 p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Government Portal</span>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Select your access type to continue
                </p>
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
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
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
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                      className="w-full bg-gradient-to-r from-orange-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Signing In...
                        </div>
                      ) : (
                        'Sign In'
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
                      <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verification</h3>
                      <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) => setFormData({...formData, otp: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
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
                      className="w-full bg-gradient-to-r from-orange-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="text-sm text-gray-600 mb-2">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                    Register here
                  </Link>
                </div>
                <p className="text-sm text-gray-600">
                  Need help? Contact{' '}
                  <Link href="/support" className="text-orange-600 hover:text-orange-700 font-medium">
                    Student Support
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
