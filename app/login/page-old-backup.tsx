'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft, Shield
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import AuthDebugger from '../../components/AuthDebugger'

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
  const [showEmailSentPopup, setShowEmailSentPopup] = useState(false)
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
    
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log('User already logged in, checking profile status...')
          
          // Fast profile check
          try {
            const profilePromise = supabase
              .from('profiles')
              .select('profile_completed')
              .eq('id', session.user.id)
              .single()

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('timeout')), 2000)
            )

            const { data: profile, error: profileError } = await Promise.race([
              profilePromise,
              timeoutPromise
            ]) as any
            
            if (profileError || !profile?.profile_completed) {
              console.log('Profile incomplete, redirecting to profile completion')
              forceRedirect('/dashboard/student', 300)
            } else {
              console.log('Profile complete, redirecting to dashboard')
              forceRedirect('/dashboard', 300)
            }
          } catch (error) {
            console.log('Profile check timed out, defaulting to profile completion')
            forceRedirect('/dashboard/student', 300)
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
        // Continue with normal login flow
      }
    }
    
    checkSession()
  }, [router])

  const forceRedirect = (url: string, delay: number = 1000) => {
    console.log(`Force redirecting to: ${url}`)
    
    // Simple single redirect
    setTimeout(() => {
      router.push(url)
    }, delay)
  }

  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...')
      
      // Test 1: Check auth session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('❌ Session test failed:', sessionError)
        toast.error('Connection to server failed. Please check your internet.')
        return false
      }
      console.log('✅ Session test successful')
      
      // Test 2: Check database connectivity by testing profiles table
      const { data: profilesTest, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (profilesError) {
        console.error('❌ Database test failed:', profilesError)
        toast.error(`Database connection failed: ${profilesError.message}`)
        return false
      }
      console.log('✅ Database test successful')
      
      // Test 3: Check if we can create a simple query
      const { data: testQuery, error: queryError } = await supabase
        .from('profiles')
        .select('count')
        .limit(0)
      
      if (queryError) {
        console.error('❌ Query test failed:', queryError)
        toast.error(`Query test failed: ${queryError.message}`)
        return false
      }
      console.log('✅ Query test successful')
      
      toast.success('✅ All connection tests passed!')
      return true
    } catch (error) {
      console.error('❌ Connection test error:', error)
      toast.error('Unable to connect to server. Please check your internet.')
      return false
    }
  }

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
    console.log('🔥 FORM SUBMITTED - Starting login process')
    console.log('📝 Form data:', formData)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }
    
    console.log('✅ Form validation passed')
    console.log('⏳ Setting loading to true')
    setIsLoading(true)
    
    try {
      console.log('🔐 Starting SIMPLE authentication process...')
      console.log('📧 Email:', formData.email)
      console.log('🔒 Password length:', formData.password.length)
      
      // Simple, direct authentication with timeout
      const loginPromise = supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 15000)
      )

      console.log('🚀 Starting login with 15 second timeout...')
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any

      if (error) {
        console.error('❌ Login error:', error)
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Incorrect email or password. Please check your credentials.')
          setErrors({ 
            email: 'Please check your email address', 
            password: 'Please check your password' 
          })
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address first. Check your email for the verification link.')
          setStep('otp')
        } else if (error.message.includes('too many requests') || error.message.includes('rate limit')) {
          toast.error('Too many login attempts. Please wait 15 minutes before trying again.')
        } else if (error.message.includes('400')) {
          toast.error('Login service temporarily unavailable. Please try again in a few minutes.')
        } else if (error.message.includes('Login timeout')) {
          console.log('🔄 Login timed out, but checking if authentication actually succeeded...')
          
          // Wait a moment for auth state to settle, then check session
          setTimeout(async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession()
              console.log('🔍 Session check result:', session?.user?.id)
              
              if (session?.user) {
                console.log('✅ SUCCESS! User is signed in despite timeout. Redirecting...')
                toast.success('Login successful! Redirecting...')
                
                // Quick profile check and redirect
                try {
                  const profilePromise = supabase
                    .from('profiles')
                    .select('profile_completed')
                    .eq('id', session.user.id)
                    .single()
                  
                  const profileTimeout = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Profile timeout')), 3000)
                  )
                  
                  const { data: profile } = await Promise.race([profilePromise, profileTimeout]) as any
                  
                  if (profile?.profile_completed) {
                    console.log('📍 Redirecting to main dashboard')
                    router.push('/dashboard')
                  } else {
                    console.log('📍 Redirecting to profile completion')
                    router.push('/dashboard/student')
                  }
                } catch (profileError) {
                  console.log('📍 Profile check failed, defaulting to student dashboard')
                  router.push('/dashboard/student')
                }
                setIsLoading(false)
                return
              } else {
                console.log('❌ No session found, login actually failed')
                toast.error('Login timed out. Please try again.')
                setIsLoading(false)
              }
            } catch (sessionError) {
              console.error('Session check failed:', sessionError)
              toast.error('Login timed out. Please try again.')
              setIsLoading(false)
            }
          }, 1000) // Wait 1 second for auth state to settle
          
          return // Don't show error immediately, wait for session check
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          toast.error('Network error. Please check your internet connection and try again.')
        } else {
          toast.error(`Login failed: ${error.message}`)
        }
        return
      }

      if (data?.user) {
        console.log('✅ Login successful for user:', data.user.id)
        toast.success('Login successful! Redirecting...')
        
        // Fast profile check with timeout
        try {
          const profilePromise = supabase
            .from('profiles')
            .select('profile_completed, profile_step')
            .eq('id', data.user.id)
            .single()

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile check timeout')), 2000)
          )

          const { data: profile, error: profileError } = await Promise.race([
            profilePromise,
            timeoutPromise
          ]) as any
          
          if (profileError && !profileError.message?.includes('timeout')) {
            console.log('Profile not found, redirecting to profile completion')
            router.push('/dashboard/student')
            return
          }
          
          if (profile && !profile.profile_completed) {
            console.log('Profile incomplete, redirecting to profile completion')
            router.push('/dashboard/student')
          } else {
            console.log('Profile complete, redirecting to dashboard')
            router.push('/dashboard')
          }
        } catch (error: any) {
          console.error('Error checking profile:', error)
          if (error.message?.includes('timeout')) {
            console.log('⚠️ Profile check timed out, defaulting to profile completion')
          }
          // Default to profile completion page
          router.push('/dashboard/student')
        } finally {
          setIsLoading(false)
        }
        return
        
      } else {
        toast.error('Login failed. No user data received.')
      }
    } catch (error: any) {
      console.error('❌ Outer catch - Login error:', error)
      
      // Handle timeout in outer catch as well
      if (error.message?.includes('Login timeout')) {
        console.log('🔄 OUTER CATCH: Login timed out, checking if authentication succeeded...')
        
        // Wait for auth state to settle, then check session
        setTimeout(async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            console.log('🔍 OUTER CATCH: Session check result:', session?.user?.id)
            
            if (session?.user) {
              console.log('✅ OUTER CATCH SUCCESS! User is signed in. Redirecting...')
              toast.success('Login successful! Redirecting...')
              
              try {
                const profilePromise = supabase
                  .from('profiles')
                  .select('profile_completed')
                  .eq('id', session.user.id)
                  .single()
                
                const profileTimeout = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Profile timeout')), 3000)
                )
                
                const { data: profile } = await Promise.race([profilePromise, profileTimeout]) as any
                
                if (profile?.profile_completed) {
                  console.log('📍 OUTER: Redirecting to main dashboard')
                  router.push('/dashboard')
                } else {
                  console.log('📍 OUTER: Redirecting to profile completion')
                  router.push('/dashboard/student')
                }
              } catch (profileError) {
                console.log('📍 OUTER: Profile check failed, defaulting to student dashboard')
                router.push('/dashboard/student')
              }
              setIsLoading(false)
              return
            } else {
              console.log('❌ OUTER: No session found, login actually failed')
              toast.error('Login timed out. Please try again.')
              setIsLoading(false)
            }
          } catch (sessionError) {
            console.error('OUTER: Session check failed:', sessionError)
            toast.error('Login timed out. Please try again.')
            setIsLoading(false)
          }
        }, 1500) // Wait 1.5 seconds for auth state to settle
        
        return // Don't show error immediately, wait for session check
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network connection failed. Please check your internet and try again.')
      } else if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials.')
      } else {
        toast.error(`Login failed: ${error.message || 'Unknown error'}`)
      }
    } finally {
      // Always reset loading state
      setIsLoading(false)
    }
  }

  const handleDevBypass = () => {
    console.log('🚀 DEV BYPASS: Redirecting to dashboard...')
    toast.success('Development bypass activated!')
    router.push('/dashboard/student')
  }

  const handleResendLink = async () => {
    if (resendCooldown > 0) return
    
    setIsLoading(true)
    try {
      // Add timeout for resend link
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Resend timeout')), 15000)
      )
      
      const resendPromise = supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      const { error } = await Promise.race([resendPromise, timeoutPromise]) as any

      if (error) {
        if (error.message === 'Resend timeout') {
          toast.error('Request timed out. Please try again.')
        } else {
          toast.error('Failed to resend verification link: ' + error.message)
        }
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
      console.error('Resend link error:', error)
      toast.error('Failed to resend link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Email sent popup component
  const EmailSentPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
      >
        <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Verification Link Sent!</h3>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to <strong>{formData.email}</strong>. 
          Please check your email and click the link to complete your login.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowEmailSentPopup(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            I'll Check My Email
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={(e) => {
              console.log('🖱️ LOGIN BUTTON CLICKED')
              console.log('🔄 Current loading state:', isLoading)
              console.log('📝 Current form data:', formData)
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >  
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Link'}
          </button>
        </div>
      </motion.div>
    </div>
  )

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
                      onClick={(e) => {
                        console.log('🖱️ SIGN IN BUTTON CLICKED')
                        console.log('🔄 Current loading state:', isLoading)
                        console.log('📝 Current form data:', formData)
                        console.log('🔍 Button disabled?', isLoading)
                      }}
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

                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                          Register here
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">
                        Connection issues?{' '}
                        <button
                          onClick={testConnection}
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          Test connection
                        </button>
                        {' | '}
                        <button
                          onClick={handleDevBypass}
                          className="text-red-600 hover:text-red-700 underline font-medium"
                        >
                          Dev Bypass
                        </button>
                        {' | '}
                        Having trouble logging in?{' '}
                        <button
                          onClick={async () => {
                            if (!formData.email) {
                              toast.error('Please enter your email address first')
                              return
                            }
                            
                            setIsLoading(true)
                            try {
                              // Add timeout for magic link
                              const timeoutPromise = new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Magic link timeout')), 15000)
                              )
                              
                              const magicLinkPromise = supabase.auth.signInWithOtp({
                                email: formData.email,
                                options: {
                                  emailRedirectTo: `${window.location.origin}/auth/callback`
                                }
                              })
                              
                              const { error } = await Promise.race([magicLinkPromise, timeoutPromise]) as any
                              
                              if (error) {
                                if (error.message === 'Magic link timeout') {
                                  toast.error('Request timed out. Please try again.')
                                } else {
                                  toast.error('Failed to send magic link: ' + error.message)
                                }
                              } else {
                                toast.success('Magic link sent to your email!')
                                setStep('otp')
                              }
                            } catch (err) {
                              console.error('Magic link error:', err)
                              toast.error('Failed to send magic link')
                            } finally {
                              setIsLoading(false)
                            }
                          }}
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          Send magic link
                        </button>
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
      
      {/* Email Sent Popup */}
      {showEmailSentPopup && <EmailSentPopup />}
      
      {/* Auth Debugger */}
      <AuthDebugger />
    </div>
  )
}
