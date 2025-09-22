'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Shield, Lock, Mail, RefreshCw, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface LoginForm {
  email: string
  password: string
  captcha: string
}

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    captcha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaCode, setCaptchaCode] = useState('G7X9M')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  // Generate captcha
  useEffect(() => {
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }
    setCaptchaCode(generateCaptcha())
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard/student')
      }
    }
    checkUser()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

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
      newErrors.captcha = 'Please enter the captcha'
    } else if (formData.captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = 'Captcha does not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again')
      return
    }

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
          toast.error('Invalid email or password. Please check your credentials.')
        } else {
          toast.error(error.message || 'Login failed. Please try again.')
        }
        return
      }

      if (data.user) {
        toast.success('Login successful! Redirecting to dashboard...')
        router.push('/dashboard/student')
      }

    } catch (error: any) {
      console.error('Login error:', error)
      if (error.message === 'Request timeout') {
        toast.error('Login request timed out. Please check your connection and try again.')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaCode(result)
    setFormData(prev => ({ ...prev, captcha: '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <GovernmentHeader showNavigation={false} showUserActions={false} />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Government Branding */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 text-white">
                <div className="flex flex-col justify-center h-full">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-orange-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">PM Internship Portal</h2>
                    <p className="text-orange-100">Student Login</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Secure Access</h3>
                        <p className="text-sm text-orange-100">Government-grade security for your data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Official Portal</h3>
                        <p className="text-sm text-orange-100">Ministry of Education approved platform</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Data Protection</h3>
                        <p className="text-sm text-orange-100">Your information is safe and encrypted</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center" 
                      alt="Government Building" 
                      className="w-full h-32 object-cover rounded-lg opacity-80"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="p-8">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Student Login</h3>
                    <p className="text-gray-600">Access your internship dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
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
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Captcha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Code *
                      </label>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            name="captcha"
                            value={formData.captcha}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter captcha"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-100 px-4 py-3 rounded-lg font-mono text-lg font-bold text-gray-800 border">
                            {captchaCode}
                          </div>
                          <button
                            type="button"
                            onClick={refreshCaptcha}
                            className="p-3 text-gray-500 hover:text-gray-700 border rounded-lg hover:bg-gray-50"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {errors.captcha && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.captcha}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    {/* Links */}
                    <div className="text-center space-y-2">
                      <div className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                          Register here
                        </Link>
                      </div>
                      <div className="text-sm">
                        <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
