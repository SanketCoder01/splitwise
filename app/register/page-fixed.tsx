'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Shield, Lock, User, Mail, Phone, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface RegisterForm {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  captcha: string
  agreeTerms: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    captcha: '',
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaCode, setCaptchaCode] = useState('G7X9M')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showExistingUserPopup, setShowExistingUserPopup] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.captcha) {
      newErrors.captcha = 'Please enter the captcha'
    } else if (formData.captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = 'Captcha does not match'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
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
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered') || 
            authError.message.includes('already exists') ||
            authError.message.includes('User already registered')) {
          setShowExistingUserPopup(true)
          return
        }
        toast.error(authError.message)
        return
      }

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              profile_completion: 15,
              created_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        toast.success('Registration successful! Please check your email to verify your account.')
        
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }

    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
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
                    <p className="text-orange-100">Student Registration</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Create Your Profile</h3>
                        <p className="text-sm text-orange-100">Join thousands of students in government internships</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Secure Registration</h3>
                        <p className="text-sm text-orange-100">Your data is protected with government-grade security</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Instant Access</h3>
                        <p className="text-sm text-orange-100">Start applying for internships immediately</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="p-8">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
                    <p className="text-gray-600">Join the PM Internship Portal</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.fullName}
                        </div>
                      )}
                    </div>

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

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone}
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
                          placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.confirmPassword}
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

                    {/* Terms and Conditions */}
                    <div>
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the{' '}
                          <Link href="/terms" className="text-orange-600 hover:text-orange-700 underline">
                            Terms and Conditions
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <div className="flex items-center mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.agreeTerms}
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    {/* Links */}
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                          Sign in here
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

      {/* Existing User Popup */}
      {showExistingUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Email Already Registered</h3>
              <button
                onClick={() => setShowExistingUserPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                <p className="text-gray-700">
                  This email address is already registered with PM Internship Portal.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Please try logging in with your existing credentials or use a different email address.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/login')}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowExistingUserPopup(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
