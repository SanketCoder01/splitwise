'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  Github, 
  Linkedin, 
  BookOpen, 
  Briefcase, 
  Star,
  Shield,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Target,
  Zap,
  Brain
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

interface VerificationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  icon: any
  color: string
}

export default function ResumeVerifierPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    resume: null,
    certificate: null,
    experience: null
  })
  const [verificationData, setVerificationData] = useState({
    certificateNumber: '',
    githubUsername: '',
    linkedinProfile: '',
    skills: [] as string[],
    newSkill: ''
  })
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'resume',
      title: 'Resume Upload & Analysis',
      description: 'Upload your resume for AI-powered analysis and verification',
      status: 'pending',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'certificates',
      title: 'Certificate Verification',
      description: 'Verify your educational certificates with certificate numbers',
      status: 'pending',
      icon: Award,
      color: 'green'
    },
    {
      id: 'experience',
      title: 'Experience Proof',
      description: 'Upload strong proof of experience (certificates, letters, etc.)',
      status: 'pending',
      icon: Briefcase,
      color: 'purple'
    },
    {
      id: 'github',
      title: 'GitHub Verification',
      description: 'Verify your GitHub profile and repositories',
      status: 'pending',
      icon: Github,
      color: 'gray'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Verification',
      description: 'Verify your LinkedIn professional profile',
      status: 'pending',
      icon: Linkedin,
      color: 'blue'
    },
    {
      id: 'skills',
      title: 'Skills Assessment',
      description: 'Take assessments to verify your technical and soft skills',
      status: 'pending',
      icon: Brain,
      color: 'orange'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (type: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }))
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`)
    
    // Update verification step status
    setVerificationSteps(prev => prev.map(step => 
      step.id === type ? { ...step, status: 'completed' } : step
    ))
  }

  const handleCertificateVerification = async () => {
    if (!verificationData.certificateNumber) {
      toast.error('Please enter certificate number')
      return
    }

    setIsLoading(true)
    
    // Simulate certificate verification
    setTimeout(() => {
      setVerificationSteps(prev => prev.map(step => 
        step.id === 'certificates' ? { ...step, status: 'completed' } : step
      ))
      toast.success('Certificate verified successfully!')
      setIsLoading(false)
    }, 2000)
  }

  const handleGithubVerification = async () => {
    if (!verificationData.githubUsername) {
      toast.error('Please enter GitHub username')
      return
    }

    setIsLoading(true)
    
    // Simulate GitHub verification
    setTimeout(() => {
      setVerificationSteps(prev => prev.map(step => 
        step.id === 'github' ? { ...step, status: 'completed' } : step
      ))
      toast.success('GitHub profile verified successfully!')
      setIsLoading(false)
    }, 2000)
  }

  const handleLinkedinVerification = async () => {
    if (!verificationData.linkedinProfile) {
      toast.error('Please enter LinkedIn profile URL')
      return
    }

    setIsLoading(true)
    
    // Simulate LinkedIn verification
    setTimeout(() => {
      setVerificationSteps(prev => prev.map(step => 
        step.id === 'linkedin' ? { ...step, status: 'completed' } : step
      ))
      toast.success('LinkedIn profile verified successfully!')
      setIsLoading(false)
    }, 2000)
  }

  const addSkill = () => {
    if (verificationData.newSkill.trim()) {
      setVerificationData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }))
    }
  }

  const removeSkill = (index: number) => {
    setVerificationData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const startSkillAssessment = (skill: string) => {
    toast.success(`Starting assessment for ${skill}...`)
    // Simulate assessment completion
    setTimeout(() => {
      toast.success(`${skill} assessment completed with 85% score!`)
    }, 3000)
  }

  const completedSteps = verificationSteps.filter(step => step.status === 'completed').length
  const progressPercentage = (completedSteps / verificationSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto">
          {/* Top Government Bar */}
          <div className="bg-gray-100 px-4 py-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🇮🇳 भारत सरकार | Government of India</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🌐 English</span>
                <span>|</span>
                <span>हिंदी</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Government Internship & Resume Verifier</h1>
                  <p className="text-xs text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500">Government of India</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <User className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Resume Verification Progress</h2>
              <p className="text-gray-600">Complete all verification steps to unlock full portal features</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{Math.round(progressPercentage)}%</div>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.id} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' :
                    step.status === 'in_progress' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-700">{step.title.split(' ')[0]}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Verification Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Resume Upload & Analysis</h3>
                <p className="text-sm text-gray-600">Upload your resume for AI-powered verification</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('resume', e.target.files[0])}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploadedFiles.resume ? uploadedFiles.resume.name : 'Upload Resume'}
                </p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
              </label>
            </div>

            {uploadedFiles.resume && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Resume uploaded successfully!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">AI analysis completed with 94% accuracy score</p>
              </div>
            )}
          </motion.div>

          {/* Certificate Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Certificate Verification</h3>
                <p className="text-sm text-gray-600">Verify educational certificates</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Number
                </label>
                <input
                  type="text"
                  value={verificationData.certificateNumber}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, certificateNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter certificate number"
                />
              </div>
              
              <button
                onClick={handleCertificateVerification}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify Certificate'
                )}
              </button>
            </div>
          </motion.div>

          {/* Experience Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Experience Proof</h3>
                <p className="text-sm text-gray-600">Upload certificates, letters, or selection documents</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('experience', e.target.files[0])}
                className="hidden"
                id="experience-upload"
              />
              <label htmlFor="experience-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploadedFiles.experience ? uploadedFiles.experience.name : 'Upload Experience Proof'}
                </p>
                <p className="text-sm text-gray-500">Certificates, Letters, Selection Documents</p>
              </label>
            </div>
          </motion.div>

          {/* GitHub Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Github className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GitHub Verification</h3>
                <p className="text-sm text-gray-600">Verify your GitHub profile and repositories</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={verificationData.githubUsername}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, githubUsername: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter GitHub username"
                />
              </div>
              
              <button
                onClick={handleGithubVerification}
                disabled={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify GitHub Profile'
                )}
              </button>
            </div>
          </motion.div>

          {/* LinkedIn Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">LinkedIn Verification</h3>
                <p className="text-sm text-gray-600">Verify your professional LinkedIn profile</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={verificationData.linkedinProfile}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <button
                onClick={handleLinkedinVerification}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify LinkedIn Profile'
                )}
              </button>
            </div>
          </motion.div>

          {/* Skills Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Skills Assessment</h3>
                <p className="text-sm text-gray-600">Take assessments to verify your skills</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={verificationData.newSkill}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, newSkill: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {verificationData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{skill}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startSkillAssessment(skill)}
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                      >
                        Take Test
                      </button>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {verificationData.skills.length === 0 && (
                <p className="text-gray-500 text-center py-4">No skills added yet. Add skills to take assessments.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Verification Summary */}
        {completedSteps > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mt-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verification Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verificationSteps.filter(step => step.status === 'completed').map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{step.title}</p>
                      <p className="text-sm text-green-600">Verified ✓</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {completedSteps === verificationSteps.length && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-2xl font-bold mb-2">🎉 Verification Complete!</h4>
                <p className="text-lg mb-4">All verification steps completed successfully. You now have full access to all portal features!</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <span>Go to Dashboard</span>
                  <Target className="w-5 h-5" />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
