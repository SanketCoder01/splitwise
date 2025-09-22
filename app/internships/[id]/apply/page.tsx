'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, FileText, CheckCircle, AlertCircle,
  User, Mail, Phone, MapPin, Calendar, Building, 
  GraduationCap, Award, Briefcase, Target
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ApplicationData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
  }
  academicInfo: {
    currentInstitution: string
    course: string
    year: string
    cgpa: string
    expectedGraduation: string
  }
  experience: {
    hasExperience: boolean
    previousInternships: string
    projects: string
    achievements: string
  }
  motivation: {
    whyThisInternship: string
    careerGoals: string
    contribution: string
  }
  documents: {
    resume: File | null
    coverLetter: File | null
    transcript: File | null
    additionalDocs: File[]
  }
  availability: {
    startDate: string
    duration: string
    hoursPerWeek: string
  }
}

const mockInternship = {
  id: '1',
  title: 'Digital India Web Development Intern',
  company: 'National Informatics Centre',
  ministry: 'Ministry of Electronics & IT',
  location: 'New Delhi',
  duration: '6 months',
  stipend: '₹25,000/month'
}

export default function InternshipApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: ''
    },
    academicInfo: {
      currentInstitution: '',
      course: '',
      year: '',
      cgpa: '',
      expectedGraduation: ''
    },
    experience: {
      hasExperience: false,
      previousInternships: '',
      projects: '',
      achievements: ''
    },
    motivation: {
      whyThisInternship: '',
      careerGoals: '',
      contribution: ''
    },
    documents: {
      resume: null,
      coverLetter: null,
      transcript: null,
      additionalDocs: []
    },
    availability: {
      startDate: '',
      duration: '',
      hoursPerWeek: ''
    }
  })

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Academic Details', icon: GraduationCap },
    { id: 3, title: 'Experience', icon: Briefcase },
    { id: 4, title: 'Motivation', icon: Target },
    { id: 5, title: 'Documents', icon: FileText },
    { id: 6, title: 'Availability', icon: Calendar }
  ]

  const updateApplicationData = (section: keyof ApplicationData, data: any) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const handleFileUpload = (field: string, file: File) => {
    setApplicationData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { fullName, email, phone, address, dateOfBirth } = applicationData.personalInfo
        return !!(fullName && email && phone && address && dateOfBirth)
      case 2:
        const { currentInstitution, course, year, cgpa, expectedGraduation } = applicationData.academicInfo
        return !!(currentInstitution && course && year && cgpa && expectedGraduation)
      case 3:
        return true // Experience is optional
      case 4:
        const { whyThisInternship, careerGoals, contribution } = applicationData.motivation
        return !!(whyThisInternship && careerGoals && contribution)
      case 5:
        return !!applicationData.documents.resume
      case 6:
        const { startDate, duration, hoursPerWeek } = applicationData.availability
        return !!(startDate && duration && hoursPerWeek)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      toast.error('Please complete all required fields')
      return
    }

    setIsSubmitting(true)
    toast.loading('Submitting your application...', { duration: 2000 })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Application submitted successfully!')
      
      // Redirect to confirmation page
      setTimeout(() => {
        router.push('/internships/application-success')
      }, 1000)
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={applicationData.personalInfo.fullName}
                  onChange={(e) => updateApplicationData('personalInfo', { fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={applicationData.personalInfo.email}
                  onChange={(e) => updateApplicationData('personalInfo', { email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={applicationData.personalInfo.phone}
                  onChange={(e) => updateApplicationData('personalInfo', { phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={applicationData.personalInfo.dateOfBirth}
                  onChange={(e) => updateApplicationData('personalInfo', { dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={applicationData.personalInfo.address}
                  onChange={(e) => updateApplicationData('personalInfo', { address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Institution *</label>
                <input
                  type="text"
                  value={applicationData.academicInfo.currentInstitution}
                  onChange={(e) => updateApplicationData('academicInfo', { currentInstitution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your college/university name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course/Degree *</label>
                <input
                  type="text"
                  value={applicationData.academicInfo.course}
                  onChange={(e) => updateApplicationData('academicInfo', { course: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., B.Tech Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Year *</label>
                <select
                  value={applicationData.academicInfo.year}
                  onChange={(e) => updateApplicationData('academicInfo', { year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Final">Final Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CGPA/Percentage *</label>
                <input
                  type="text"
                  value={applicationData.academicInfo.cgpa}
                  onChange={(e) => updateApplicationData('academicInfo', { cgpa: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 8.5 CGPA or 85%"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Date *</label>
                <input
                  type="month"
                  value={applicationData.academicInfo.expectedGraduation}
                  onChange={(e) => updateApplicationData('academicInfo', { expectedGraduation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Projects</h3>
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={applicationData.experience.hasExperience}
                    onChange={(e) => updateApplicationData('experience', { hasExperience: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">I have previous internship experience</span>
                </label>
              </div>
              
              {applicationData.experience.hasExperience && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Internships</label>
                  <textarea
                    value={applicationData.experience.previousInternships}
                    onChange={(e) => updateApplicationData('experience', { previousInternships: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your previous internship experiences..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
                <textarea
                  value={applicationData.experience.projects}
                  onChange={(e) => updateApplicationData('experience', { projects: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your relevant projects..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements & Awards</label>
                <textarea
                  value={applicationData.experience.achievements}
                  onChange={(e) => updateApplicationData('experience', { achievements: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List your achievements, awards, certifications..."
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation & Goals</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want this internship? *</label>
                <textarea
                  value={applicationData.motivation.whyThisInternship}
                  onChange={(e) => updateApplicationData('motivation', { whyThisInternship: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain your interest in this specific internship..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals *</label>
                <textarea
                  value={applicationData.motivation.careerGoals}
                  onChange={(e) => updateApplicationData('motivation', { careerGoals: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your career aspirations and how this internship fits..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How can you contribute? *</label>
                <textarea
                  value={applicationData.motivation.contribution}
                  onChange={(e) => updateApplicationData('motivation', { contribution: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain what you can bring to this role..."
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Upload</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload your resume</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('resume', e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File
                  </label>
                  {applicationData.documents.resume && (
                    <p className="text-sm text-green-600 mt-2">✓ {applicationData.documents.resume.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your cover letter</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('coverLetter', e.target.files[0])}
                    className="hidden"
                    id="cover-letter-upload"
                  />
                  <label htmlFor="cover-letter-upload" className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Choose File
                  </label>
                  {applicationData.documents.coverLetter && (
                    <p className="text-sm text-green-600 mt-2">✓ {applicationData.documents.coverLetter.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Transcript (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload your transcript</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('transcript', e.target.files[0])}
                    className="hidden"
                    id="transcript-upload"
                  />
                  <label htmlFor="transcript-upload" className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Choose File
                  </label>
                  {applicationData.documents.transcript && (
                    <p className="text-sm text-green-600 mt-2">✓ {applicationData.documents.transcript.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date *</label>
                <input
                  type="date"
                  value={applicationData.availability.startDate}
                  onChange={(e) => updateApplicationData('availability', { startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Duration *</label>
                <select
                  value={applicationData.availability.duration}
                  onChange={(e) => updateApplicationData('availability', { duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours per week *</label>
                <select
                  value={applicationData.availability.hoursPerWeek}
                  onChange={(e) => updateApplicationData('availability', { hoursPerWeek: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select hours per week</option>
                  <option value="20-30 hours">20-30 hours</option>
                  <option value="30-40 hours">30-40 hours</option>
                  <option value="40+ hours">40+ hours (Full-time)</option>
                </select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Apply for Internship</h1>
              <p className="text-gray-600">{mockInternship.title} at {mockInternship.company}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    isActive ? 'bg-blue-600 border-blue-600 text-white' :
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-4">
              {currentStep < steps.length ? (
                <motion.button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Internship Summary */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Internship Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{mockInternship.company}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{mockInternship.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{mockInternship.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{mockInternship.stipend}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
