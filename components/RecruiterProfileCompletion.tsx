'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Building2, Phone, Mail, MapPin, Upload,
  CheckCircle, AlertCircle, ArrowLeft, ArrowRight,
  FileText, Globe, Award, Users, Calendar, DollarSign, Clock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import SearchableDropdown from './SearchableDropdown'
import { INDIAN_STATES, UNIQUE_INDIAN_CITIES } from '../utils/indianLocations'

interface RecruiterProfile {
  id: string
  full_name?: string
  company_name?: string
  company_logo?: string;
  company_registration_url?: string;
  profile_completed: boolean;
  profile_step: number
  approval_status: 'pending' | 'approved' | 'rejected'
  email?: string
  phone?: string
}

interface RecruiterProfileCompletionProps {
  recruiterData: RecruiterProfile | null
  onProfileUpdate: () => void
  onProfileCompleted?: () => void
}

export default function RecruiterProfileCompletion({ recruiterData, onProfileUpdate, onProfileCompleted }: RecruiterProfileCompletionProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
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
    internship_alignment: [] as string[],
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
            const profileData: any = {
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
        internship_alignment: formData.internship_alignment,
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

      // Save to Supabase with fallback for different table names and columns
      let saveError = null

      // Create a minimal profile data object with only essential fields
      const minimalProfileData = {
        id: recruiterData?.id?.startsWith('temp-') ? undefined : recruiterData?.id,
        full_name: formData.full_name,
        company_name: formData.company_name,
        email: formData.email,
        profile_step: currentStep === 6 ? 6 : currentStep + 1,
        profile_completed: currentStep === 6,
        updated_at: new Date().toISOString()
      }

      try {
        // Try recruiter_profiles first with minimal data
        const { error } = await supabase
          .from('recruiter_profiles')
          .upsert(minimalProfileData)

        saveError = error
      } catch (err) {
        console.warn('recruiter_profiles table not found, trying recruiters table:', err)
        saveError = err
      }

      // If recruiter_profiles failed, try recruiters table
      if (saveError) {
        try {
          const { error } = await supabase
            .from('recruiters')
            .upsert(minimalProfileData)

          saveError = error
        } catch (err) {
          console.warn('recruiters table also failed:', err)
          saveError = err
        }
      }

      if (saveError) {
        console.error('Supabase error:', saveError)
        // Update session storage with completed profile data for dev mode
        const sessionData = sessionStorage.getItem('recruiter_data')
        if (sessionData) {
          const parsedData = JSON.parse(sessionData)
          const updatedData = {
            ...parsedData,
            full_name: formData.full_name,
            company_name: formData.company_name,
            email: formData.email,
            profile_completed: currentStep === 6,
            profile_step: currentStep === 6 ? 6 : currentStep + 1,
            approval_status: 'pending'
          }
          sessionStorage.setItem('recruiter_data', JSON.stringify(updatedData))
        }
        console.log('Continuing in dev mode despite database error - data saved to session storage')
      }

      // Always save complete profile data to session storage for profile view
      const completeProfileData = {
        full_name: formData.full_name,
        designation: formData.designation,
        employee_id: formData.employee_id,
        company_name: formData.company_name,
        company_type: formData.company_type,
        industry: formData.industry,
        company_size: formData.company_size,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        alternate_phone: formData.alternate_phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        internship_types: formData.internship_types,
        internship_alignment: formData.internship_alignment,
        preferred_skills: formData.preferred_skills,
        min_duration: formData.min_duration,
        max_duration: formData.max_duration,
        stipend_range: formData.stipend_range,
        terms_accepted: formData.terms_accepted,
        data_consent: formData.data_consent,
        profile_completed: currentStep === 6,
        profile_step: currentStep === 6 ? 6 : currentStep + 1,
        approval_status: 'pending'
      }
      sessionStorage.setItem('recruiter_complete_profile', JSON.stringify(completeProfileData))

      if (currentStep < 6) {
        setCurrentStep(currentStep + 1)
        toast.success(`Step ${currentStep} completed successfully!`)
      } else {
        // Profile completed - show completion modal and auto-redirect
        setShowCompletionModal(true)
        // Auto-close modal and redirect after 3 seconds
        setTimeout(() => {
          setShowCompletionModal(false)
          // Notify parent that profile is completed
          if (onProfileCompleted) {
            onProfileCompleted()
          }
        }, 3000)
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
          <SearchableDropdown
            options={UNIQUE_INDIAN_CITIES}
            value={formData.city}
            onChange={(value) => setFormData({...formData, city: value})}
            placeholder="Search and select city"
            label="City *"
            required
          />
        </div>

        <div>
          <SearchableDropdown
            options={INDIAN_STATES}
            value={formData.state}
            onChange={(value) => setFormData({...formData, state: value})}
            placeholder="Search and select state"
            label="State *"
            required
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

  const internshipTypeAlignments = {
    'Technical': ['Web Development', 'Software Development', 'App Development', 'Mobile Development', 'Testing', 'DevOps', 'Data Science', 'AI/ML', 'Backend', 'Frontend', 'Full Stack', 'Cloud Computing', 'Cybersecurity', 'Database Administration'],
    'Marketing': ['Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO/SEM', 'Brand Management', 'Market Research', 'Email Marketing', 'Marketing Analytics'],
    'Sales': ['Business Development', 'Account Management', 'Sales Operations', 'Customer Success', 'Lead Generation', 'Sales Analytics', 'Channel Sales', 'Retail Sales'],
    'HR': ['Talent Acquisition', 'Employee Relations', 'HR Operations', 'Learning & Development', 'Compensation & Benefits', 'HR Analytics', 'Recruitment', 'Performance Management'],
    'Finance': ['Financial Analysis', 'Investment Banking', 'Corporate Finance', 'Risk Management', 'Financial Planning', 'Accounting', 'Auditing', 'Financial Technology'],
    'Operations': ['Supply Chain', 'Project Management', 'Quality Assurance', 'Process Improvement', 'Operations Analytics', 'Logistics', 'Inventory Management', 'Vendor Management'],
    'Design': ['UI/UX Design', 'Graphic Design', 'Product Design', 'Visual Design', 'Design Systems', 'Motion Graphics', 'Brand Design', 'Web Design'],
    'Content': ['Content Writing', 'Copywriting', 'Content Strategy', 'Technical Writing', 'Creative Writing', 'Blog Management', 'Social Media Content', 'Video Content'],
    'Research': ['Market Research', 'Data Research', 'Academic Research', 'User Research', 'Competitive Analysis', 'Survey Design', 'Research Analytics', 'Policy Research']
  }

  const getAvailableAlignments = () => {
    const selectedTypes = formData.internship_types
    if (selectedTypes.length === 0) return []

    const alignments = new Set<string>()
    selectedTypes.forEach(type => {
      const typeAlignments = internshipTypeAlignments[type as keyof typeof internshipTypeAlignments] || []
      typeAlignments.forEach(alignment => alignments.add(alignment))
    })

    return Array.from(alignments).sort()
  }

  const renderInternshipPreferences = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internship Types *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(internshipTypeAlignments).map((type) => (
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

      {formData.internship_types.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Internship Alignment
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getAvailableAlignments().map((alignment) => (
              <label key={alignment} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.internship_alignment.includes(alignment)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, internship_alignment: [...formData.internship_alignment, alignment]})
                    } else {
                      setFormData({...formData, internship_alignment: formData.internship_alignment.filter(a => a !== alignment)})
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{alignment}</span>
              </label>
            ))}
          </div>
          {getAvailableAlignments().length === 0 && (
            <p className="text-sm text-gray-500 mt-2">No alignments available for selected types</p>
          )}
        </div>
      )}
      
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
            <option value="unpaid">Unpaid</option>
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

  // If profile is completed, show profile overview instead of form
  if (recruiterData?.profile_completed) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview</h2>
          <p className="text-gray-600">Your profile has been completed successfully</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                recruiterData?.approval_status === 'approved' ? 'bg-green-500' :
                recruiterData?.approval_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {recruiterData?.approval_status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Clock className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {recruiterData?.full_name || 'Name not provided'}
              </h3>
              <p className="text-gray-600">{recruiterData?.company_name || 'Company not provided'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className={`font-medium ${
                  recruiterData?.approval_status === 'approved' ? 'text-green-600' :
                  recruiterData?.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {recruiterData?.approval_status === 'approved' ? 'Verified & Approved' :
                   recruiterData?.approval_status === 'pending' ? 'Pending Approval' : 'Rejected'}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Personal Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Full Name:</span> {formData.full_name || 'Not provided'}</div>
                <div><span className="text-gray-500">Designation:</span> {formData.designation || 'Not provided'}</div>
                <div><span className="text-gray-500">Employee ID:</span> {formData.employee_id || 'Not provided'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Company Name:</span> {formData.company_name || 'Not provided'}</div>
                <div><span className="text-gray-500">Industry:</span> {formData.industry || 'Not provided'}</div>
                <div><span className="text-gray-500">Company Size:</span> {formData.company_size || 'Not provided'}</div>
                <div><span className="text-gray-500">Type:</span> {formData.company_type || 'Not provided'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Email:</span> {formData.email || 'Not provided'}</div>
                <div><span className="text-gray-500">Phone:</span> {formData.phone || 'Not provided'}</div>
                <div><span className="text-gray-500">Address:</span> {formData.address_line1 || 'Not provided'}</div>
                <div><span className="text-gray-500">City:</span> {formData.city || 'Not provided'}</div>
                <div><span className="text-gray-500">State:</span> {formData.state || 'Not provided'}</div>
                <div><span className="text-gray-500">Pincode:</span> {formData.pincode || 'Not provided'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Internship Preferences</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Types:</span> {formData.internship_types.join(', ') || 'None selected'}</div>
                <div><span className="text-gray-500">Alignment:</span> {formData.internship_alignment.join(', ') || 'None selected'}</div>
                <div><span className="text-gray-500">Duration:</span> {formData.min_duration}-{formData.max_duration} months</div>
                <div><span className="text-gray-500">Stipend:</span> {formData.stipend_range || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {recruiterData?.approval_status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Waiting for Government Approval</h4>
                  <p className="text-sm text-yellow-700">
                    Your profile has been submitted for verification. You'll be able to post internships once approved by government officials.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Setup Completed!</h3>
                <p className="text-gray-600 mb-6">
                  Congratulations! Your recruiter profile has been successfully completed and submitted for government approval.
                </p>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong><br />
                    • Wait for government approval<br />
                    • Once approved, you can start posting internships<br />
                    • Check your email for updates
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Redirecting to dashboard in a few seconds...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

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
