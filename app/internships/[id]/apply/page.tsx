'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Upload, FileText, CheckCircle, AlertCircle,
  User, Mail, Phone, MapPin, Calendar, Building, 
  GraduationCap, Award, Briefcase, Target, Eye, Download, X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../../../contexts/AuthContext'
import { supabase } from '../../../../lib/supabase'

interface ProfileData {
  id?: string
  full_name?: string
  email?: string
  phone?: string
  resume_url?: string
  [key: string]: any
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
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [hasResume, setHasResume] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [showResumeViewer, setShowResumeViewer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfileData()
    }
  }, [user])

  const fetchProfileData = async () => {
    if (!user?.id) return
    
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
        setHasResume(!!data.resume_url)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUpload = async (file: File) => {
    if (!user?.id) return
    
    try {
      const fileName = `${user.id}/resume-${Date.now()}.${file.name.split('.').pop()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file)

      if (uploadError) {
        toast.error('Failed to upload resume')
        return
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: urlData.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        toast.error('Failed to save resume')
        return
      }

      setHasResume(true)
      setResumeFile(null)
      setProfileData(prev => ({ ...prev, resume_url: urlData.publicUrl }))
      toast.success('Resume uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload resume')
    }
  }

  const handleApply = async () => {
    if (!hasResume) {
      toast.error('Please upload your resume first')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccessModal(true)
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ResumeViewer = () => (
    <AnimatePresence>
      {showResumeViewer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Resume Preview</h3>
              <button
                onClick={() => setShowResumeViewer(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 h-96 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Resume preview would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  {profileData.resume_url ? 'Resume file available' : 'No resume uploaded'}
                </p>
                {profileData.resume_url && (
                  <a
                    href={profileData.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const SuccessModal = () => (
    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg max-w-md w-full p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your application for {mockInternship.title} has been submitted successfully. 
              You will receive a confirmation email shortly.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/dashboard')
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Profile Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Personal Details</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Name:</span> {profileData.full_name || 'Not provided'}</p>
                <p><span className="font-medium">Email:</span> {user?.email || 'Not provided'}</p>
                <p><span className="font-medium">Phone:</span> {profileData.phone || 'Not provided'}</p>
                <p><span className="font-medium">Date of Birth:</span> {profileData.date_of_birth || 'Not provided'}</p>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-green-600" />
                <span>Education</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Level:</span> {profileData.education_level || 'Not provided'}</p>
                <p><span className="font-medium">Institution:</span> {profileData.institution_name || 'Not provided'}</p>
                <p><span className="font-medium">Course:</span> {profileData.course_name || 'Not provided'}</p>
                <p><span className="font-medium">Year:</span> {profileData.year_of_passing || 'Not provided'}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Skills & Languages</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Skills:</span> {profileData.skills || 'Not provided'}</p>
                <p><span className="font-medium">Languages:</span> {profileData.languages || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resume</h2>
          
          {hasResume ? (
            <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Resume uploaded successfully</p>
                  <p className="text-sm text-green-700">Your resume is ready for application</p>
                </div>
              </div>
              <button
                onClick={() => setShowResumeViewer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Eye className="w-4 h-4" />
                <span>View Resume</span>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 mb-4">Please upload your resume to proceed with the application</p>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setResumeFile(file)
                    handleResumeUpload(file)
                  }
                }}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Resume File</span>
              </label>
              <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
            </div>
          )}
        </div>

        {/* Application Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ready to Apply?</h2>
              <p className="text-gray-600 mt-1">
                {hasResume 
                  ? 'Your profile is complete. You can now submit your application.' 
                  : 'Please upload your resume to proceed with the application.'
                }
              </p>
            </div>
            
            <button
              onClick={handleApply}
              disabled={!hasResume || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                hasResume && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Apply Now</span>
                </>
              )}
            </button>
          </div>
        </div>

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

      <ResumeViewer />
      <SuccessModal />
    </div>
  )
}