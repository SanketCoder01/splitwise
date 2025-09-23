'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Building2, Phone, Mail, MapPin, Upload, 
  CheckCircle, AlertCircle, ArrowLeft, ArrowRight,
  FileText, Globe, Award, Users, Calendar, DollarSign
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'

interface RecruiterProfile {
  id: string
  full_name?: string
  company_name?: string
  profile_image?: string
  profile_completed: boolean
  profile_step: number
  approval_status: 'pending' | 'approved' | 'rejected'
  email?: string
  phone?: string
}

interface RecruiterProfileCompletionProps {
  recruiterData: RecruiterProfile | null
  onProfileUpdate: () => void
}

export default function RecruiterProfileCompletion({ recruiterData, onProfileUpdate }: RecruiterProfileCompletionProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    full_name: '',
    designation: '',
    employee_id: '',
    
    // Step 2: Company Details
    company_name: '',
    company_type: '',
    industry: '',
    company_size: '',
    website: '',
    
    // Step 3: Contact Information
    email: '',
    phone: '',
    alternate_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    
    // Step 4: Documents
    company_registration: null as File | null,
    authorization_letter: null as File | null,
    id_proof: null as File | null,
    
    // Step 5: Internship Details
    internship_types: [] as string[],
    preferred_skills: '',
    min_duration: '',
    max_duration: '',
    stipend_range: '',
    
    // Step 6: Agreement
    terms_accepted: false,
    data_consent: false
  })

  const steps = [
    { id: 1, title: 'Personal Details', icon: User },
    { id: 2, title: 'Company Details', icon: Building2 },
    { id: 3, title: 'Contact Information', icon: Phone },
    { id: 4, title: 'Documents', icon: FileText },
    { id: 5, title: 'Internship Preferences', icon: Award },
    { id: 6, title: 'Agreement', icon: CheckCircle }
  ]

  useEffect(() => {
    if (recruiterData) {
      setCurrentStep(recruiterData.profile_step || 1)
      // Load existing data if available
      setFormData(prev => ({
        ...prev,
        full_name: recruiterData.full_name || '',
        email: recruiterData.email || '',
        phone: recruiterData.phone || ''
      }))
    }
  }, [recruiterData])

  const handleSaveAndContinue = async () => {
    if (!validateCurrentStep()) return

    setIsLoading(true)
    try {
      // Prepare data for Supabase
      const profileData = {
        // Personal Details
        full_name: formData.full_name,
        designation: formData.designation,
        employee_id: formData.employee_id,
        
        // Company Details
        company_name: formData.company_name,
        company_type: formData.company_type,
        industry: formData.industry,
        company_size: formData.company_size,
        website: formData.website,
        
        // Contact Information
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternate_phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        
        // Internship Preferences
        internship_types: formData.internship_types,
        preferred_skills: formData.preferred_skills,
        min_duration: formData.min_duration,
        max_duration: formData.max_duration,
        stipend_range: formData.stipend_range,
        
        // Agreement
        terms_accepted: formData.terms_accepted,
        data_consent: formData.data_consent,
        
        // Profile Status
        profile_step: currentStep === 6 ? 6 : currentStep + 1,
        profile_completed: currentStep === 6,
        updated_at: new Date().toISOString()
      }

      // Handle file uploads for documents (Step 4)
      if (currentStep === 4) {
        // Upload documents to Supabase Storage
        if (formData.company_registration) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('recruiter-documents')
            .upload(`${recruiterData?.id}/company_registration_${Date.now()}.pdf`, formData.company_registration)
          
          if (!uploadError && uploadData) {
            profileData.company_registration_url = uploadData.path
          }
        }
        
        if (formData.authorization_letter) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('recruiter-documents')
            .upload(`${recruiterData?.id}/authorization_letter_${Date.now()}.pdf`, formData.authorization_letter)
          
          if (!uploadError && uploadData) {
            profileData.authorization_letter_url = uploadData.path
          }
        }
        
        if (formData.id_proof) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('recruiter-documents')
            .upload(`${recruiterData?.id}/id_proof_${Date.now()}.pdf`, formData.id_proof)
          
          if (!uploadError && uploadData) {
            profileData.id_proof_url = uploadData.path
          }
        }
      }

      // Save to Supabase
      const { error } = await supabase
        .from('recruiter_profiles')
        .upsert({
          id: recruiterData?.id?.startsWith('temp-') ? undefined : recruiterData?.id,
          ...profileData
        })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (currentStep < 6) {
        setCurrentStep(currentStep + 1)
        toast.success(`Step ${currentStep} completed successfully!`)
      } else {
        toast.success('🎉 Profile completed successfully! Waiting for government approval.')
        // Refresh the parent component
        setTimeout(() => {
          onProfileUpdate()
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateCurrentStep = () => {
    const errors: string[] = []

    switch (currentStep) {
      case 1:
        if (!formData.full_name) errors.push('Full name is required')
        if (!formData.designation) errors.push('Designation is required')
        if (!formData.employee_id) errors.push('Employee ID is required')
        break
      case 2:
        if (!formData.company_name) errors.push('Company name is required')
        if (!formData.company_type) errors.push('Company type is required')
        if (!formData.industry) errors.push('Industry is required')
        break
      case 3:
        if (!formData.email) errors.push('Email is required')
        if (!formData.phone) errors.push('Phone is required')
        if (!formData.address_line1) errors.push('Address is required')
        if (!formData.city) errors.push('City is required')
        if (!formData.state) errors.push('State is required')
        if (!formData.pincode) errors.push('Pincode is required')
        break
      case 4:
        if (!formData.company_registration) errors.push('Company registration document is required')
        if (!formData.authorization_letter) errors.push('Authorization letter is required')
        if (!formData.id_proof) errors.push('ID proof is required')
        break
      case 5:
        if (formData.internship_types.length === 0) errors.push('Select at least one internship type')
        if (!formData.preferred_skills) errors.push('Preferred skills are required')
        if (!formData.min_duration) errors.push('Minimum duration is required')
        break
      case 6:
        if (!formData.terms_accepted) errors.push('Please accept terms and conditions')
        if (!formData.data_consent) errors.push('Please provide data consent')
        break
    }

    if (errors.length > 0) {
      toast.error(errors[0])
      return false
    }
    return true
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetails()
      case 2:
        return renderCompanyDetails()
      case 3:
        return renderContactInformation()
      case 4:
        return renderDocuments()
      case 5:
        return renderInternshipPreferences()
      case 6:
        return renderAgreement()
      default:
        return null
    }
  }

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation *
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({...formData, designation: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., HR Manager, Recruitment Head"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID *
          </label>
          <input
            type="text"
            value={formData.employee_id}
            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your company employee ID"
          />
        </div>
      </div>
    </div>
  )

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Type *
          </label>
          <select
            value={formData.company_type}
            onChange={(e) => setFormData({...formData, company_type: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select company type</option>
            <option value="private">Private Limited</option>
            <option value="public">Public Limited</option>
            <option value="psu">Public Sector Undertaking</option>
            <option value="government">Government Department</option>
            <option value="ngo">NGO/Non-Profit</option>
            <option value="startup">Startup</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select industry</option>
            <option value="it">Information Technology</option>
            <option value="finance">Banking & Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="retail">Retail</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select
            value={formData.company_size}
            onChange={(e) => setFormData({...formData, company_size: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.company.com"
          />
        </div>
      </div>
    </div>
  )

  const renderContactInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@company.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+91 9876543210"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Phone
          </label>
          <input
            type="tel"
            value={formData.alternate_phone}
            onChange={(e) => setFormData({...formData, alternate_phone: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+91 9876543210"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            value={formData.address_line1}
            onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Building, Street, Area"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2
          </label>
          <input
            type="text"
            value={formData.address_line2}
            onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Landmark, District"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter state"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123456"
          />
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Registration Certificate *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload company registration document</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData({...formData, company_registration: e.target.files?.[0] || null})}
              className="mt-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authorization Letter *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Letter authorizing you to recruit interns</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData({...formData, authorization_letter: e.target.files?.[0] || null})}
              className="mt-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Proof *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Aadhaar, PAN, or Passport</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData({...formData, id_proof: e.target.files?.[0] || null})}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderInternshipPreferences = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internship Types *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Technical', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Content', 'Research'].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.internship_types.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({...formData, internship_types: [...formData.internship_types, type]})
                  } else {
                    setFormData({...formData, internship_types: formData.internship_types.filter(t => t !== type)})
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Skills *
        </label>
        <textarea
          value={formData.preferred_skills}
          onChange={(e) => setFormData({...formData, preferred_skills: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="List the skills you're looking for in interns"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Duration *
          </label>
          <select
            value={formData.min_duration}
            onChange={(e) => setFormData({...formData, min_duration: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select minimum duration</option>
            <option value="1">1 month</option>
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Duration
          </label>
          <select
            value={formData.max_duration}
            onChange={(e) => setFormData({...formData, max_duration: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select maximum duration</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stipend Range
          </label>
          <select
            value={formData.stipend_range}
            onChange={(e) => setFormData({...formData, stipend_range: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select stipend range</option>
            <option value="0-10000">₹0 - ₹10,000</option>
            <option value="10000-25000">₹10,000 - ₹25,000</option>
            <option value="25000-50000">₹25,000 - ₹50,000</option>
            <option value="50000+">₹50,000+</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAgreement = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Terms and Conditions</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>• I confirm that all information provided is accurate and complete.</p>
          <p>• I understand that false information may result in account suspension.</p>
          <p>• I agree to comply with government internship program guidelines.</p>
          <p>• I will provide fair opportunities to all eligible students.</p>
          <p>• I will maintain professional standards in all interactions.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.terms_accepted}
            onChange={(e) => setFormData({...formData, terms_accepted: e.target.checked})}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I accept the terms and conditions of the PM Internship Portal *
          </span>
        </label>
        
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.data_consent}
            onChange={(e) => setFormData({...formData, data_consent: e.target.checked})}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I consent to the processing of my data for verification and communication purposes *
          </span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Fill in all required information to start posting internships</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h3>
            </div>
            
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleSaveAndContinue}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <span>{currentStep === 6 ? 'Complete Profile' : 'Save & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
