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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captcha, setCaptcha] = useState('gGqOe6')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showExistingUserPopup, setShowExistingUserPopup] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<RegisterForm>()

  const password = watch('password')

  // Debug popup state changes
  useEffect(() => {
    console.log('🔄 Popup state changed - showSuccessPopup:', showSuccessPopup)
  }, [showSuccessPopup])

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
  }

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['fullName', 'email', 'phone'] 
      : ['password', 'confirmPassword']
    
    const isValid = await trigger(fieldsToValidate as any)
    if (!isValid) {
      return
    }

    // If moving from step 1 to step 2, check if email already exists
    if (currentStep === 1) {
      setIsLoading(true)
      
      try {
        const emailValue = watch('email')
        console.log('🔍 Fast checking email:', emailValue)
        
        // Fast email check with timeout
        const checkPromise = supabase
          .from('profiles')
          .select('id')
          .eq('email', emailValue)
          .limit(1)
          .single()

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email check timeout')), 3000)
        )

        const { data: existingUser, error: checkError } = await Promise.race([
          checkPromise,
          timeoutPromise
        ]) as any

        if (existingUser) {
          console.log('❌ Email already registered')
          setShowExistingUserPopup(true)
          toast.error('This email is already registered. Please try logging in instead.')
          return
        }

        // If no existing user found or timeout, proceed
        if (checkError && checkError.code !== 'PGRST116' && !checkError.message?.includes('timeout')) {
          console.error('❌ Database error:', checkError)
          toast.error('Database error. Please try again.')
          return
        }

        console.log('✅ Email available, proceeding')
        setCurrentStep(currentStep + 1)
        
      } catch (error: any) {
        console.error('❌ Email check error:', error)
        if (error.message?.includes('timeout')) {
          console.log('⚠️ Timeout occurred, proceeding anyway')
          toast.error('Email check timed out, proceeding anyway...')
          setCurrentStep(currentStep + 1)
        } else {
          toast.error('Unable to verify email. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      // For other steps, just proceed normally
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Store form data temporarily
  const [pendingRegistrationData, setPendingRegistrationData] = useState<RegisterForm | null>(null)

  const onSubmit = async (data: RegisterForm) => {
    console.log('🔄 Form submitted, current loading state:', isLoading)
    
    // Validation checks first
    if (data.captcha !== captcha) {
      toast.error('Invalid captcha. Please check and try again.')
      return
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: data.fullName,
              email: data.email,
              phone: data.phone,
              profile_completion: 15,
              created_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        setShowSuccessPopup(true)
        
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }

    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || ''
    }
  }

  // Success popup component
  const SuccessPopup = () => {
    console.log(' Rendering SuccessPopup component')
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-lg mx-4 text-center border-2 border-green-200"
        >
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Form Complete!</h3>
            <p className="text-lg text-blue-600 font-medium">Ready to create your account with email verification</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl"></span>
                <p className="font-semibold text-blue-800">Form Data Validated Successfully!</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span></span>
                <p>We'll send a verification email that you must confirm before login</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleProceedToLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Create Account & Send Verification Email</span>
            </button>
            <button
              onClick={() => {
                console.log(' Closing success popup')
                setShowSuccessPopup(false)
                setPendingRegistrationData(null)
              }}
              disabled={isLoading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>🔒 Your data will be encrypted and stored securely</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Existing user popup component
  const ExistingUserPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
      >
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Account Already Exists!</h3>
        <p className="text-gray-600 mb-6">
          An account with this email address already exists. Please try logging in instead.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowExistingUserPopup(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => router.push('/login')}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </motion.div>
    </div>
  )

  const passwordStrength = getPasswordStrength(password)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GovernmentHeader showNavigation={false} showUserActions={false} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-government-blue text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-government-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Step {currentStep} of 3: {
                    currentStep === 1 ? 'Basic Information' :
                    currentStep === 2 ? 'Account Security' : 'Verification'
                  }
                </p>
              </div>
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="card p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Student Account</h2>
              <p className="text-gray-600">Join PM Internship & Resume Verifier platform</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        {...register('fullName', { 
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
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
                        placeholder="Enter your email address"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                        placeholder="Enter your phone number"
                        {...register('phone', { 
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: 'Invalid Indian phone number'
                          }
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message: 'Password must contain uppercase, lowercase, number and special character'
                          }
                        })}
                        className="input-field pl-10 pr-10"
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
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{passwordStrength.label}</span>
                        </div>
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
                        placeholder="Confirm your password"
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        className="input-field pl-10 pr-10"
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
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Security Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-government-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium text-government-blue mb-2">Password Security Tips:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Use at least 8 characters</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Add numbers and special characters</li>
                          <li>• Avoid common words or personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  {/* Captcha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Captcha Verification *
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="text-sm text-government-blue hover:underline"
                        >
                          Refresh Captcha
                        </button>
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="bg-gray-100 px-4 py-2 rounded border-2 border-dashed border-gray-300 font-mono text-lg tracking-wider">
                        {captcha}
                      </div>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2 text-government-blue hover:bg-blue-50 rounded"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Enter the captcha value"
                      {...register('captcha', { required: 'Captcha is required' })}
                      className="input-field mt-2"
                    />
                    {errors.captcha && (
                      <p className="text-red-500 text-sm mt-1">{errors.captcha.message}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        {...register('agreeTerms', { required: 'You must agree to the terms and conditions' })}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link href="/terms" className="text-government-blue hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-government-blue hover:underline">
                          Privacy Policy
                        </Link>{' '}
                        of PM Internship Portal.
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-sm mt-1">{errors.agreeTerms.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    className="btn-primary ml-auto flex items-center space-x-2"
                  >
                    {isLoading && currentStep === 1 ? (
                      <>
                        <div className="spinner w-5 h-5 border-2"></div>
                        <span>Checking Email...</span>
                      </>
                    ) : (
                      <span>Next</span>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary ml-auto flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner w-5 h-5 border-2"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-government-blue hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 PM Internship & Resume Verifier - Government of India. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup />}
      
      {/* Existing User Popup */}
      {showExistingUserPopup && <ExistingUserPopup />}
    </div>
  )
}
