'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, Mail, MapPin, Calendar, BookOpen, CreditCard,
  Award, CheckCircle, ArrowRight, ArrowLeft, Save, Lock,
  Shield, FileText, Globe, Star, Building, GraduationCap, AlertCircle, Upload
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ProfileStep {
  id: number
  title: string
  description: string
  icon: any
  completed: boolean
}

export default function MultiStepProfile() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUploading, setResumeUploading] = useState(false)

  const steps: ProfileStep[] = [
    { id: 1, title: 'Personal Details', description: 'Basic information about you', icon: User, completed: false },
    { id: 2, title: 'Contact Details', description: 'Your contact information', icon: Phone, completed: false },
    { id: 3, title: 'Education Details', description: 'Your educational background', icon: GraduationCap, completed: false },
    { id: 4, title: 'Bank Details', description: 'Banking information for stipend', icon: CreditCard, completed: false },
    { id: 5, title: 'Skills & Languages', description: 'Your skills and language proficiency', icon: Award, completed: false },
    { id: 6, title: 'Profile Completed', description: 'Your profile is ready!', icon: CheckCircle, completed: false }
  ]

  useEffect(() => {
    if (user && !authLoading) {
      fetchProfileData()
    }
  }, [user, authLoading])

  const fetchProfileData = async () => {
    if (!user?.id) {
      console.error('No user ID available')
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfileData(data)
        setCurrentStep(data.profile_step || 1)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const updateProfileStep = async (step: number, data: any) => {
    if (!user?.id) {
      alert('User session expired. Please login again.')
      return
    }

    setLoading(true)
    try {
      // For step 6, don't increment profile_step beyond 6
      const nextStep = step < 6 ? step + 1 : 6

      const updateData = {
        ...data,
        profile_step: nextStep,
        [`step${step}_completed_at`]: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        console.error('Supabase error:', error)
        if (error.code === 'PGRST204' && error.message.includes('resume_url')) {
          console.warn('resume_url column not found. Please add it using: ALTER TABLE profiles ADD COLUMN resume_url TEXT;')
          // Continue without the resume_url field
          const updateDataWithoutResume = { ...updateData }
          delete updateDataWithoutResume.resume_url
          
          const { error: retryError } = await supabase
            .from('profiles')
            .update(updateDataWithoutResume)
            .eq('id', user.id)
            
          if (retryError) {
            alert(`Error updating profile: ${retryError.message}`)
            return
          }
        } else {
          alert(`Error updating profile: ${error.message}`)
          return
        }
      }

      // Update local state
      setProfileData({ ...profileData, ...updateData })

      // Move to next step
      if (step < 6) {
        setCurrentStep(step + 1)
      } else {
        // Profile completed - mark as completed and redirect
        const completionData = {
          ...updateData,
          profile_completed: true,
          step6_completed_at: new Date().toISOString()
        }

        const { error: completionError } = await supabase
          .from('profiles')
          .update(completionData)
          .eq('id', user.id)

        if (!completionError) {
          toast.success('🎉 Profile completed successfully! Welcome to PM Internship Portal!')
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (step: number, data: any) => {
    const newErrors: any = {}

    switch (step) {
      case 1:
        if (!data.full_name) newErrors.full_name = 'Full name is required'
        if (!data.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
        if (!data.gender) newErrors.gender = 'Gender is required'
        if (!data.father_name) newErrors.father_name = 'Father\'s name is required'
        if (!resumeFile) newErrors.resume = 'Resume upload is required'
        break
      case 2:
        if (!data.phone) newErrors.phone = 'Phone number is required'
        if (!data.address_line1) newErrors.address_line1 = 'Address is required'
        if (!data.city) newErrors.city = 'City is required'
        if (!data.state) newErrors.state = 'State is required'
        if (!data.pincode) newErrors.pincode = 'Pincode is required'
        break
      case 3:
        if (!data.education_level) newErrors.education_level = 'Education level is required'
        if (!data.institution_name) newErrors.institution_name = 'Institution name is required'
        if (!data.course_name) newErrors.course_name = 'Course name is required'
        if (!data.year_of_passing) newErrors.year_of_passing = 'Year of passing is required'
        break
      case 4:
        if (!data.bank_name) newErrors.bank_name = 'Bank name is required'
        if (!data.account_number) newErrors.account_number = 'Account number is required'
        if (!data.ifsc_code) newErrors.ifsc_code = 'IFSC code is required'
        if (!data.account_holder_name) newErrors.account_holder_name = 'Account holder name is required'
        break
      case 5:
        if (!data.skills || data.skills.length === 0) newErrors.skills = 'At least one skill is required'
        if (!data.languages || data.languages.length === 0) newErrors.languages = 'At least one language is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAndContinue = async (stepData: any) => {
    if (validateStep(currentStep, stepData)) {
      // For step 1, upload resume first
      if (currentStep === 1 && resumeFile) {
        setResumeUploading(true)
        try {
          // Upload resume to Supabase Storage
          const fileName = `${user?.id}/resume-${Date.now()}.${resumeFile.name.split('.').pop()}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(fileName, resumeFile)

          if (uploadError) {
            console.error('Resume upload error:', uploadError)
            alert('Failed to upload resume. Please try again.')
            setResumeUploading(false)
            return
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName)

          // Add resume URL to step data
          const dataWithResume = {
            ...stepData,
            resume_url: urlData.publicUrl
          }

          setResumeUploading(false)
          updateProfileStep(currentStep, dataWithResume)
        } catch (error) {
          console.error('Resume upload error:', error)
          alert('Failed to upload resume. Please try again.')
          setResumeUploading(false)
        }
      } else {
        updateProfileStep(currentStep, stepData)
      }
    } else {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.border-red-500')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Let's start with your basic information</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium mb-2">Please complete the following required fields:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>• {String(message)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={profileData.full_name || ''}
            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
              errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter your full name"
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={profileData.date_of_birth || ''}
            onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
              errors.date_of_birth ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={profileData.gender || ''}
            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
              errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name *
          </label>
          <input
            type="text"
            value={profileData.father_name || ''}
            onChange={(e) => setProfileData({ ...profileData, father_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
              errors.father_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Enter father's name"
          />
          {errors.father_name && <p className="text-red-500 text-sm mt-1">{errors.father_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name
          </label>
          <input
            type="text"
            value={profileData.mother_name || ''}
            onChange={(e) => setProfileData({ ...profileData, mother_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors hover:border-gray-400"
            placeholder="Enter mother's name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={profileData.category || ''}
            onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors hover:border-gray-400"
          >
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
          </select>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="mt-8">
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Upload</h3>
          <p className="text-gray-600 mb-4">Please upload your resume to help us verify your information and extract relevant details.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload your resume</span>
                      <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setResumeFile(file)
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                </div>
              </div>
              {resumeFile && (
                <div className="mt-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{resumeFile.name}</span>
                  <button
                    onClick={() => setResumeFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600">
          Step 1 of 6 - Personal Details
        </div>
        <button
          onClick={() => handleSaveAndContinue(profileData)}
          disabled={loading || resumeUploading}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
        >
          {(loading || resumeUploading) ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{resumeUploading ? 'Uploading Resume...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 mt-2">How can we reach you?</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Please complete the following required fields:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {String(message)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={profileData.phone || ''}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+91 XXXXX XXXXX"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Phone
          </label>
          <input
            type="tel"
            value={profileData.alternate_phone || ''}
            onChange={(e) => setProfileData({ ...profileData, alternate_phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors hover:border-gray-400"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            value={profileData.address_line1 || ''}
            onChange={(e) => setProfileData({ ...profileData, address_line1: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address_line1 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="House/Flat No., Street Name"
          />
          {errors.address_line1 && <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2
          </label>
          <input
            type="text"
            value={profileData.address_line2 || ''}
            onChange={(e) => setProfileData({ ...profileData, address_line2: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors hover:border-gray-400"
            placeholder="Landmark, Area"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={profileData.city || ''}
            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter city"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={profileData.state || ''}
            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter state"
          />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={profileData.pincode || ''}
            onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.pincode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter pincode"
          />
          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            value={profileData.district || ''}
            onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors hover:border-gray-400"
            placeholder="Enter district"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => handleSaveAndContinue(profileData)}
          disabled={loading}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Education Details</h2>
        <p className="text-gray-600 mt-2">Tell us about your educational background</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Please complete the following required fields:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {String(message)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
          <select
            value={profileData.education_level || ''}
            onChange={(e) => setProfileData({ ...profileData, education_level: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.education_level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Education Level</option>
            <option value="High School">High School (10th)</option>
            <option value="Intermediate">Intermediate (12th)</option>
            <option value="ITI">ITI</option>
            <option value="Polytechnic">Polytechnic</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
          {errors.education_level && <p className="text-red-500 text-sm mt-1">{errors.education_level}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
          <input
            type="text"
            value={profileData.institution_name || ''}
            onChange={(e) => setProfileData({ ...profileData, institution_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.institution_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter institution name"
          />
          {errors.institution_name && <p className="text-red-500 text-sm mt-1">{errors.institution_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
          <input
            type="text"
            value={profileData.course_name || ''}
            onChange={(e) => setProfileData({ ...profileData, course_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.course_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course name"
          />
          {errors.course_name && <p className="text-red-500 text-sm mt-1">{errors.course_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing *</label>
          <input
            type="number"
            value={profileData.year_of_passing || ''}
            onChange={(e) => setProfileData({ ...profileData, year_of_passing: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.year_of_passing ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter year"
            min="1990"
            max="2030"
          />
          {errors.year_of_passing && <p className="text-red-500 text-sm mt-1">{errors.year_of_passing}</p>}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => handleSaveAndContinue(profileData)}
          disabled={loading}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
        <p className="text-gray-600 mt-2">For stipend and payment purposes</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Please complete the following required fields:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {String(message)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
          <input
            type="text"
            value={profileData.bank_name || ''}
            onChange={(e) => setProfileData({ ...profileData, bank_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bank_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter bank name"
          />
          {errors.bank_name && <p className="text-red-500 text-sm mt-1">{errors.bank_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
          <input
            type="text"
            value={profileData.account_number || ''}
            onChange={(e) => setProfileData({ ...profileData, account_number: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.account_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter account number"
          />
          {errors.account_number && <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
          <input
            type="text"
            value={profileData.ifsc_code || ''}
            onChange={(e) => setProfileData({ ...profileData, ifsc_code: e.target.value.toUpperCase() })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ifsc_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter IFSC code"
          />
          {errors.ifsc_code && <p className="text-red-500 text-sm mt-1">{errors.ifsc_code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
          <input
            type="text"
            value={profileData.account_holder_name || ''}
            onChange={(e) => setProfileData({ ...profileData, account_holder_name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.account_holder_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter account holder name"
          />
          {errors.account_holder_name && <p className="text-red-500 text-sm mt-1">{errors.account_holder_name}</p>}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => handleSaveAndContinue(profileData)}
          disabled={loading}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Skills & Languages</h2>
        <p className="text-gray-600 mt-2">Tell us about your skills and language proficiency</p>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-2">Please complete the following required fields:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {String(message)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
          <textarea
            value={profileData.skills || ''}
            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.skills ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your skills (comma separated)"
            rows={3}
          />
          {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Languages *</label>
          <textarea
            value={profileData.languages || ''}
            onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.languages ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter languages you know (comma separated)"
            rows={3}
          />
          {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(4)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => handleSaveAndContinue(profileData)}
          disabled={loading}
          className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save & Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Profile Complete!</h2>
        <p className="text-gray-600 mt-2">Review your information and complete your profile</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-green-800 font-medium mb-4">🎉 Congratulations!</h3>
        <p className="text-green-700 mb-4">
          You have successfully completed all the required steps. Your profile is now ready for the PM Internship program.
        </p>
        <div className="space-y-2 text-sm text-green-600">
          <p>✓ Personal details completed</p>
          <p>✓ Contact information added</p>
          <p>✓ Education details provided</p>
          <p>✓ Bank details configured</p>
          <p>✓ Skills and languages specified</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(5)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => {
            // Mark profile as completed
            updateProfileStep(6, profileData)
          }}
          disabled={loading}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Complete Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  // Show loading state while user is being loaded
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user session...</p>
        </div>
      </div>
    )
  }

  // Show error state if user is not available after loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to access your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / 6) * 100)

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Responsive Design */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Progress Steps */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                        : 'border-gray-300 text-gray-500 bg-white'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-xs mt-1 ${
                        currentStep >= step.id ? 'text-orange-500' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Progress Steps */}
          <div className="md:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  'bg-orange-500 text-white'
                }`}>
                  {currentStep}
                </div>
                <span className="text-gray-600">of</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-600">
                  6
                </div>
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-orange-600">{steps[currentStep - 1]?.title}</h3>
              <p className="text-sm text-gray-500">{steps[currentStep - 1]?.description}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">{progressPercentage}% Complete</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
