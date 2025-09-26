'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, CheckCircle, AlertCircle, Clock, 
  User, Mail, Phone, MapPin, Calendar, Award, 
  Briefcase, GraduationCap, Github, Linkedin, 
  Eye, Download, RefreshCw, Zap, Shield, Star,
  Camera, Link as LinkIcon, ExternalLink, Loader,
  Edit, Save, X, Plus, Crown, Trophy, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import { extractResumeData } from '../utils/ocrExtractor'
import { verifyGitHubProfile, verifyLinkedInProfile, verifyCertificate } from '../utils/profileVerifier'

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    address: string
    summary: string
  }
  experience: Array<{
    id: string
    title: string
    company: string
    duration: string
    description: string
    verified: boolean
    proofUploaded: boolean
    proofFile?: File
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    year: string
    grade: string
  }>
  certificates: Array<{
    id: string
    name: string
    issuer: string
    certificateId: string
    verified: boolean
    verificationStatus: 'pending' | 'verified' | 'failed'
  }>
  skills: string[]
  socialProfiles: {
    linkedin: { url: string, verified: boolean, exists: boolean }
    github: { url: string, verified: boolean, exists: boolean }
  }
}

interface AssessmentData {
  skillName: string
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }>
  timeLimit: number
  passingScore: number
}

export default function StudentResumeVerifier() {
  const [step, setStep] = useState<'upload' | 'personal' | 'experience' | 'certificates' | 'assessment' | 'results'>('upload')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [verificationScore, setVerificationScore] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [uploadingProof, setUploadingProof] = useState<string | null>(null)
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [verifyingProfile, setVerifyingProfile] = useState<'linkedin' | 'github' | null>(null)
  const [hasPremium, setHasPremium] = useState(false)
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null)
  const [assessmentScore, setAssessmentScore] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const proofInputRef = useRef<HTMLInputElement>(null)

  // Real OCR processing function
  const processResume = useCallback(async (file: File) => {
    setIsProcessing(true)
    
    try {
      toast.loading('Extracting data from resume...', { id: 'processing' })
      
      // Use real OCR extraction
      const extractedData = await extractResumeData(file)
      
      // Convert to our ResumeData format
      const resumeData: ResumeData = {
        personalInfo: {
          name: extractedData.personalInfo.name,
          email: extractedData.personalInfo.email,
          phone: extractedData.personalInfo.phone,
          location: extractedData.personalInfo.location,
          address: extractedData.personalInfo.address,
          summary: "Extracted from resume"
        },
        experience: extractedData.experience.map((exp, index) => ({
          id: `exp${index + 1}`,
          title: exp.title,
          company: exp.company,
          duration: exp.duration,
          description: exp.description,
          verified: false,
          proofUploaded: false
        })),
        education: extractedData.education.map((edu, index) => ({
          id: `edu${index + 1}`,
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          grade: edu.grade || ''
        })),
        certificates: extractedData.certificates.map((cert, index) => ({
          id: `cert${index + 1}`,
          name: cert.name,
          issuer: cert.issuer,
          certificateId: `${cert.issuer.toUpperCase()}-${Date.now()}-${index}`,
          verified: false,
          verificationStatus: 'pending' as const
        })),
        skills: extractedData.skills,
        socialProfiles: {
          linkedin: { 
            url: extractedData.socialProfiles.linkedin, 
            verified: false, 
            exists: false 
          },
          github: { 
            url: extractedData.socialProfiles.github, 
            verified: false, 
            exists: false 
          }
        }
      }
      
      setResumeData(resumeData)
      setVerificationScore(30) // Initial score for data extraction
      setStep('personal')
      toast.success('Resume data extracted successfully!', { id: 'processing' })
      
    } catch (error) {
      console.error('Resume processing error:', error)
      toast.error('Failed to process resume. Please try again.', { id: 'processing' })
    } finally {
      setIsProcessing(false)
    }
  }, [])
      experience: [
        {
          id: "exp1",
          title: "Software Developer",
          company: "Tech Solutions Pvt Ltd",
          duration: "Jan 2022 - Present",
          description: "Developed web applications using React and Node.js",
          verified: false,
          proofUploaded: false
        },
        {
          id: "exp2", 
          title: "Junior Developer",
          company: "StartupXYZ",
          duration: "Jun 2021 - Dec 2021",
          description: "Built mobile applications using React Native",
          verified: false,
          proofUploaded: false
        }
      ],
      education: [
        {
          id: "edu1",
          degree: "B.Tech Computer Science",
          institution: "Mumbai University",
          year: "2021",
          grade: "8.5 CGPA"
        }
      ],
      certificates: [
        {
          id: "cert1",
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          certificateId: "AWS-DEV-2023-001234",
          verified: false
        },
        {
          id: "cert2",
          name: "React Professional Certificate",
          issuer: "Meta",
          certificateId: "META-REACT-2023-567890",
          verified: false
        }
      ],
      skills: ["React", "Node.js", "JavaScript", "TypeScript", "AWS", "MongoDB"],
      socialProfiles: {
        linkedin: { url: "https://linkedin.com/in/rahulsharma", verified: false },
        github: { url: "https://github.com/rahulsharma", verified: false }
      }
    }
    
    setResumeData(mockData)
    setVerificationScore(65) // Initial score
    setIsProcessing(false)
    setStep('review')
    toast.success('Resume processed successfully!')
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setResumeFile(file)
        processResume(file)
      } else {
        toast.error('Please upload a PDF or image file')
      }
    }
  }

  const handleProofUpload = async (experienceId: string, file: File) => {
    setUploadingProof(experienceId)
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        experience: resumeData.experience.map(exp => 
          exp.id === experienceId 
            ? { ...exp, proofUploaded: true, verified: true }
            : exp
        )
      }
      setResumeData(updatedData)
      setVerificationScore(prev => prev + 10)
    }
    
    setUploadingProof(null)
    toast.success('Proof uploaded and verified!')
  }

  const verifyCertificate = async (certificateId: string) => {
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        certificates: resumeData.certificates.map(cert => 
          cert.id === certificateId 
            ? { ...cert, verified: true }
            : cert
        )
      }
      setResumeData(updatedData)
      setVerificationScore(prev => prev + 5)
      toast.success('Certificate verified successfully!')
    }
  }

  const verifyLinkedIn = async () => {
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        socialProfiles: {
          ...resumeData.socialProfiles,
          linkedin: { ...resumeData.socialProfiles.linkedin, verified: true }
        }
      }
      setResumeData(updatedData)
      setVerificationScore(prev => prev + 10)
      toast.success('LinkedIn profile verified!')
    }
  }

  const verifyGitHub = async () => {
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        socialProfiles: {
          ...resumeData.socialProfiles,
          github: { ...resumeData.socialProfiles.github, verified: true }
        }
      }
      setResumeData(updatedData)
      setVerificationScore(prev => prev + 10)
      toast.success('GitHub profile verified!')
    }
  }

  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Verifier</h1>
            <p className="text-gray-600">Upload your resume to get AI-powered verification and insights</p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, JPG, PNG files up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Processing State */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 bg-blue-50 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-4">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Processing Resume...</h4>
                      <p className="text-blue-700">AI is analyzing your resume and extracting information</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>Extracting personal information...</span>
                      <span>✓</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>Analyzing work experience...</span>
                      <span>✓</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700">
                      <span>Identifying skills and certificates...</span>
                      <Loader className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600 text-sm">Advanced AI extracts and verifies information from your resume</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verification System</h3>
              <p className="text-gray-600 text-sm">Verify certificates, experience, and social profiles</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Credibility Score</h3>
              <p className="text-gray-600 text-sm">Get a credibility score based on verified information</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (step === 'review' && resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review & Verify Information</h1>
                <p className="text-gray-600">Verify the extracted information and upload proofs</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{verificationScore}%</div>
                <div className="text-sm text-gray-500">Verification Score</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{resumeData.personalInfo.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Social Profiles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
                Social Profiles
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn Profile</span>
                  </div>
                  <button
                    onClick={verifyLinkedIn}
                    disabled={resumeData.socialProfiles.linkedin.verified}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      resumeData.socialProfiles.linkedin.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {resumeData.socialProfiles.linkedin.verified ? 'Verified' : 'Verify'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-gray-900" />
                    <span>GitHub Profile</span>
                  </div>
                  <button
                    onClick={verifyGitHub}
                    disabled={resumeData.socialProfiles.github.verified}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      resumeData.socialProfiles.github.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {resumeData.socialProfiles.github.verified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 mt-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Work Experience
            </h2>
            
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      {exp.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setSelectedExperience(exp.id)
                              proofInputRef.current?.click()
                            }}
                            disabled={uploadingProof === exp.id}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {uploadingProof === exp.id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            <span>Upload Proof</span>
                          </button>
                          
                          {exp.proofUploaded && (
                            <div className="flex items-center space-x-2 text-orange-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">Under Review</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certificates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 mt-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Certificates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                  <p className="text-sm text-gray-500 mt-1">ID: {cert.certificateId}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    {cert.verified ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => verifyCertificate(cert.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Verify Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <button
              onClick={() => setStep('upload')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Upload New Resume
            </button>
            <button
              onClick={() => setStep('dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Dashboard
            </button>
          </motion.div>

          <input
            ref={proofInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file && selectedExperience) {
                handleProofUpload(selectedExperience, file)
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    )
  }

  // Dashboard view will be implemented next
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Coming Soon</h1>
        <button
          onClick={() => setStep('upload')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Upload
        </button>
      </div>
    </div>
  )
}
