'use client'

import { 
  Users, 
  Cpu, 
  Target,
  Award,
  Shield,
  FileCheck,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  ArrowLeft,
  Brain,
  Upload,
  FileText,
  Loader,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function SchemesPage() {
  const [selectedScheme, setSelectedScheme] = useState<number | null>(null)
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedSchemeForApplication, setSelectedSchemeForApplication] = useState<any>(null)
  const [userResume, setUserResume] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isMatchingInProgress, setIsMatchingInProgress] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [aiMatchedSchemes, setAiMatchedSchemes] = useState<any[]>([])
  const [showAIMatching, setShowAIMatching] = useState(false)

  // Mock user resume for bypass mode
  useEffect(() => {
    console.log('🚀 BYPASS MODE: Using mock resume data')
    setTimeout(() => {
      setUserResume('https://example.com/mock-resume.pdf')
    }, 2000)
  }, [])

  const schemes = [
    {
      id: 1,
      title: "PM Internship Scheme",
      department: "Ministry of Education",
      slots: "10,000+",
      icon: Users,
      color: "blue",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
      description: "Flagship internship program providing hands-on experience in government departments and public sector organizations.",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      eligibility: "Graduate/Post-graduate in any discipline",
      features: [
        "Direct mentorship from senior government officials",
        "Exposure to policy-making processes", 
        "Certificate from Ministry of Education",
        "Networking opportunities with civil servants",
        "Potential for permanent recruitment"
      ],
      locations: ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
      applicationDeadline: "March 31, 2024",
      benefits: [
        "Health insurance coverage",
        "Travel allowance for official duties",
        "Access to government libraries and resources",
        "Professional development workshops"
      ]
    },
    {
      id: 2,
      title: "Digital India Tech Internship",
      department: "Ministry of Electronics & IT",
      slots: "5,000+",
      icon: Cpu,
      color: "purple",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
      description: "Technology-focused program for developing digital solutions and contributing to India's digital transformation.",
      duration: "4-8 months",
      stipend: "₹30,000 - ₹50,000",
      eligibility: "Engineering/Computer Science graduates",
      features: [
        "Work on cutting-edge government tech projects",
        "Exposure to AI, ML, and blockchain technologies",
        "Collaboration with top tech companies",
        "Open source contribution opportunities",
        "Fast-track recruitment in tech roles"
      ],
      locations: ["Bangalore", "Hyderabad", "Pune", "New Delhi"],
      applicationDeadline: "April 15, 2024",
      benefits: [
        "Latest technology training",
        "Industry mentorship programs",
        "Patent filing support",
        "Startup incubation opportunities"
      ]
    }
  ]

  // AI Matching Handler
  const handleAIMatching = async () => {
    if (!userResume) {
      toast.error('Please upload your resume first to use AI matching!')
      setShowApplicationModal(true)
      return
    }
    
    setShowAIModal(true)
    setIsMatchingInProgress(true)
    
    // Simulate AI matching process
    await new Promise(resolve => setTimeout(resolve, 4500))
    
    // Add match scores to schemes
    const matchedSchemes = schemes.map(scheme => ({
      ...scheme,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
      isMatched: true
    })).sort((a, b) => b.matchScore - a.matchScore)
    
    setAiMatchedSchemes(matchedSchemes)
    setShowAIMatching(true)
    setIsMatchingInProgress(false)
    setShowAIModal(false)
    toast.success('AI matching completed! Schemes are now sorted by compatibility.')
  }

  // Application Handler
  const handleApply = (scheme: any) => {
    setSelectedSchemeForApplication(scheme)
    setShowApplicationModal(true)
  }

  // Resume Upload Handler
  const handleResumeUpload = async () => {
    if (!resumeFile) return
    
    setIsUploading(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      setUserResume('https://example.com/uploaded-resume.pdf')
      setResumeFile(null)
      toast.success('Resume uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Application Submission Handler
  const handleSubmitApplication = async () => {
    if (!userResume) {
      toast.error('Please upload your resume before applying.')
      return
    }

    setIsApplying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowApplicationModal(false)
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 5000)
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const displaySchemes = showAIMatching ? aiMatchedSchemes : schemes

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government Header */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">🇮🇳 भारत सरकार | Government of India</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <button className="hover:text-gray-800">हिंदी</button>
              <span>|</span>
              <button className="hover:text-gray-800">English</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="w-px h-8 bg-gray-300"></div>
            
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">PM Internship Schemes</h1>
              <p className="text-xs text-gray-600">Ministry of Education, Government of India</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 rounded-lg p-1 mb-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Government Internship Schemes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Explore diverse internship opportunities across various government ministries and departments. 
              Each scheme is designed to provide valuable experience and contribute to nation-building.
            </p>
            
            {/* AI Matcher Button */}
            <motion.button
              onClick={handleAIMatching}
              disabled={isMatchingInProgress}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-5 h-5" />
              <span>{isMatchingInProgress ? 'Matching...' : 'AI Internship Matcher'}</span>
              <Zap className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* AI Matching Results */}
        {showAIMatching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8 border border-purple-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Matching Results</h3>
                <p className="text-gray-600">Schemes sorted by compatibility with your profile</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{displaySchemes.filter(s => s.isMatched).length}</div>
                <div className="text-sm text-gray-600">High Matches</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(displaySchemes.reduce((acc, s) => acc + (s.matchScore || 0), 0) / displaySchemes.length)}%</div>
                <div className="text-sm text-gray-600">Avg. Match Score</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{displaySchemes.length}</div>
                <div className="text-sm text-gray-600">Total Schemes</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displaySchemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow ${
                showAIMatching && scheme.isMatched ? 'ring-2 ring-purple-200 bg-purple-50/30' : ''
              }`}
            >
              {/* Scheme Image */}
              <div className="relative h-48">
                <img
                  src={scheme.image}
                  alt={scheme.title}
                  className="w-full h-full object-cover"
                />
                {showAIMatching && scheme.matchScore && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(scheme.matchScore)}`}>
                      {scheme.matchScore}% Match
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-3">{scheme.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{scheme.department}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{scheme.slots} slots</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{scheme.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{scheme.stipend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Check Eligibility</span>
                    {expandedScheme === scheme.id ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  <motion.button
                    onClick={() => handleApply(scheme)}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedScheme === scheme.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Eligibility</h4>
                          <p className="text-gray-600 mb-4">{scheme.eligibility}</p>
                          
                          <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                          <ul className="space-y-2">
                            {scheme.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-gray-600 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {scheme.locations.map((location, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {location}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                          <ul className="space-y-2">
                            {scheme.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-orange-600" />
                                <span className="text-gray-600 text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-900">Application Deadline</span>
                            </div>
                            <p className="text-orange-800 font-semibold">{scheme.applicationDeadline}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Matching Modal */}
      <AnimatePresence>
        {showAIModal && (
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-10 h-10 text-purple-600" />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Internship Matcher</h3>
              <p className="text-gray-600 mb-6">
                Looking for best internships based on your skills and analyzing your resume...
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-purple-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-purple-600 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-purple-600 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
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
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Apply for Internship</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Resume Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Resume</h4>
                  
                  {userResume ? (
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Resume uploaded</p>
                          <p className="text-sm text-green-700">Your resume is ready for application</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No resume found. Please upload your resume to apply.</p>
                        
                        <div className="space-y-4">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Choose Resume File</span>
                          </label>
                          
                          {resumeFile && (
                            <div className="text-sm text-gray-600">
                              Selected: {resumeFile.name}
                            </div>
                          )}
                          
                          {resumeFile && (
                            <button
                              onClick={handleResumeUpload}
                              disabled={isUploading}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                              {isUploading ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>Upload Resume</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    disabled={!userResume || isApplying}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isApplying ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : (
                      <span>Apply Now</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your application has been successfully submitted to the PM Internship Portal. 
                You will receive updates via email about your application status.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Application ID:</strong> PMI-{Date.now().toString().slice(-6)}
                </p>
              </div>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
