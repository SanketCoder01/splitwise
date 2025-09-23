'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft, Shield
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, sendMagicLinkWithTimeout } from '../../lib/supabase'
import toast from 'react-hot-toast'

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
  const [otpSent, setOtpSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showDevBypass, setShowDevBypass] = useState(false)
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
    
    // Always show dev bypass for easy access
    setShowDevBypass(true)
  }, [])

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
      // First, try to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Incorrect email or password. Please try to put them correctly.')
          setErrors({ 
            email: 'Please check your email address', 
            password: 'Please check your password' 
          })
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address first.')
        } else {
          toast.error('Login failed. Please try again.')
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Check if user is already verified
        if (data.user.email_confirmed_at) {
          // User is verified, check profile completion
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('profile_completed, profile_step, full_name')
            .eq('id', data.user.id)
            .single()

          if (profileError || !profileData?.profile_completed || profileData?.profile_step < 6) {
            toast.success('Welcome! Please complete your profile to continue.')
            setIsLoading(false)
            setTimeout(() => {
              router.push('/dashboard?tab=profile-steps&first-time=true')
            }, 1000)
          } else {
            toast.success(`Welcome back, ${profileData.full_name || 'Student'}!`)
            setIsLoading(false)
            setTimeout(() => {
              router.push('/dashboard')
            }, 1000)
          }
        } else {
          // User needs email verification, send magic link
          const { data: magicData, error: magicLinkError } = await sendMagicLinkWithTimeout(formData.email)

          if (magicLinkError) {
            toast.error('Failed to send verification link: ' + magicLinkError.message)
            setIsLoading(false)
            return
          }

          toast.success('Verification link sent to your email! Please check your inbox.')
          setStep('otp')
          setOtpSent(true)
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleResendLink = async () => {
    if (resendCooldown > 0) return
    
    setIsLoading(true)
    try {
      const { data, error } = await sendMagicLinkWithTimeout(formData.email)

      if (error) {
        toast.error('Failed to resend verification link: ' + error.message)
      } else {
        toast.success('New verification link sent to your email!')
        setResendCooldown(60) // 60 second cooldown
        
        // Start countdown
        const interval = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    } catch (error) {
      toast.error('Failed to resend link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevBypass = () => {
    setIsLoading(true)
    toast.success('Development bypass activated! Going to dashboard...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
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
          background-size: cover;
          background-position: center;
          animation: slideImages 15s infinite;
        }
        
        @keyframes slideImages {
          0%, 20% { opacity: 1; transform: scale(1); }
          25%, 95% { opacity: 0; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .sliding-image-login:nth-child(1) { animation-delay: 0s; }
        .sliding-image-login:nth-child(2) { animation-delay: 5s; }
        .sliding-image-login:nth-child(3) { animation-delay: 10s; }
      `}</style>

      <div className="flex min-h-screen">
        {/* Left Side - Sliding Images */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-600 to-blue-700">
          <div className="sliding-images-container">
            <div 
              className="sliding-image-login"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")'
              }}
            />
            <div 
              className="sliding-image-login"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")'
              }}
            />
            <div 
              className="sliding-image-login"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")'
              }}
            />
          </div>
          
          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Shield className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">PM Internship Portal</h1>
              <p className="text-xl mb-8 text-orange-100">
                Secure access to India's premier internship and resume verification platform
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Government-verified internships</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Blockchain-secured resume verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span>Direct placement opportunities</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8 w-full lg:w-1/2">
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
                    <User className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Login</h2>
                <p className="text-gray-600">Secure access for student applications</p>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600 font-medium">Secure Student Access</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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

                    {/* Captcha */}
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
                        <button
                          type="button"
                          onClick={() => {
                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                            let result = ''
                            for (let i = 0; i < 5; i++) {
                              result += chars.charAt(Math.floor(Math.random() * chars.length))
                            }
                            setCaptchaCode(result)
                          }}
                          className="px-3 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          title="Refresh Captcha"
                        >
                          🔄
                        </button>
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
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </motion.button>

                    {/* Development Bypass Button */}
                    {showDevBypass && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        type="button"
                        onClick={handleDevBypass}
                        disabled={isLoading}
                        className="w-full mt-3 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        🚀 Dev Bypass - Go to Dashboard
                      </motion.button>
                    )}

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                          Register here
                        </Link>
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="verification"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
                      <p className="text-gray-600">
                        We've sent a verification link to <strong>{formData.email}</strong>. 
                        Click the link in your email to complete the login process.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Check your email inbox</li>
                        <li>2. Click the verification link</li>
                        <li>3. You'll be automatically redirected to your dashboard</li>
                      </ol>
                    </div>

                    <div className="text-center space-y-4">
                      <button
                        onClick={handleResendLink}
                        disabled={resendCooldown > 0 || isLoading}
                        className="text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {resendCooldown > 0 
                          ? `Resend link in ${resendCooldown}s` 
                          : 'Resend verification link'
                        }
                      </button>
                      
                      <div>
                        <button
                          onClick={() => {
                            setStep('login')
                            setFormData({...formData, otp: ''})
                            setErrors({})
                          }}
                          className="text-sm text-orange-600 hover:text-orange-700"
                        >
                          ← Back to login
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
