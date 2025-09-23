'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, MapPin, Calendar, Building, Users, 
  Star, Zap, Brain, ChevronDown, ChevronUp, ExternalLink,
  Clock, DollarSign, Award, BookOpen, Target, X, Upload,
  FileText, CheckCircle, Loader
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
// import { useAuth } from '../../contexts/AuthContext' // COMMENTED OUT FOR BYPASS

interface Internship {
  id: string
  title: string
  company: string
  ministry: string
  location: string
  type: 'remote' | 'onsite' | 'hybrid'
  duration: string
  stipend: string
  description: string
  requirements: string[]
  skills: string[]
  applications: number
  maxApplications: number
  deadline: string
  matchScore?: number
  isMatched?: boolean
  image?: string
}

const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Digital India Web Development Intern',
    company: 'National Informatics Centre',
    ministry: 'Ministry of Electronics & IT',
    location: 'New Delhi',
    type: 'hybrid',
    duration: '6 months',
    stipend: '₹25,000/month',
    description: 'Work on government web portals and digital services to enhance citizen experience.',
    requirements: ['React.js', 'Node.js', 'MongoDB', 'Government sector interest'],
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
    applications: 245,
    maxApplications: 500,
    deadline: '2024-02-15',
    matchScore: 95,
    isMatched: true,
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    title: 'AI/ML Research Intern - Smart Cities',
    company: 'Indian Space Research Organisation',
    ministry: 'Department of Space',
    location: 'Bangalore',
    type: 'onsite',
    duration: '8 months',
    stipend: '₹30,000/month',
    description: 'Develop AI solutions for smart city infrastructure and satellite data analysis.',
    requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    applications: 156,
    maxApplications: 300,
    deadline: '2024-02-20',
    matchScore: 88,
    isMatched: true,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    title: 'Cybersecurity Analyst Intern',
    company: 'Computer Emergency Response Team',
    ministry: 'Ministry of Electronics & IT',
    location: 'Mumbai',
    type: 'onsite',
    duration: '6 months',
    stipend: '₹28,000/month',
    description: 'Assist in cybersecurity threat analysis and incident response for government systems.',
    requirements: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Risk Assessment'],
    skills: ['Cybersecurity', 'Network Security', 'Penetration Testing'],
    applications: 89,
    maxApplications: 200,
    deadline: '2024-02-25',
    matchScore: 72,
    isMatched: true,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop'
  },
  {
    id: '4',
    title: 'Data Analytics Intern - Census',
    company: 'Office of Registrar General',
    ministry: 'Ministry of Home Affairs',
    location: 'Remote',
    type: 'remote',
    duration: '4 months',
    stipend: '₹20,000/month',
    description: 'Analyze census data and create insights for policy making.',
    requirements: ['Data Analysis', 'SQL', 'Python', 'Statistics'],
    skills: ['Data Analysis', 'SQL', 'Python', 'Statistics'],
    applications: 312,
    maxApplications: 400,
    deadline: '2024-03-01',
    matchScore: 65,
    isMatched: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
  },
  {
    id: '5',
    title: 'Mobile App Development Intern',
    company: 'Digital India Corporation',
    ministry: 'Ministry of Electronics & IT',
    location: 'Hyderabad',
    type: 'hybrid',
    duration: '5 months',
    stipend: '₹22,000/month',
    description: 'Develop mobile applications for government services and citizen engagement.',
    requirements: ['React Native', 'Flutter', 'Mobile Development', 'API Integration'],
    skills: ['React Native', 'Flutter', 'Mobile Development'],
    applications: 178,
    maxApplications: 350,
    deadline: '2024-03-05',
    matchScore: 58,
    isMatched: false,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop'
  }
]

export default function InternshipsPage() {
  // const { user } = useAuth() // COMMENTED OUT FOR BYPASS
  const user = { id: 'bypass-user', email: 'student@bypass.dev' } // MOCK USER FOR BYPASS
  const [internships, setInternships] = useState<Internship[]>(mockInternships)
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(mockInternships)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    ministry: 'all',
    location: 'all'
  })
  const [showAIMatching, setShowAIMatching] = useState(false)
  const [isMatchingInProgress, setIsMatchingInProgress] = useState(false)
  const [expandedInternship, setExpandedInternship] = useState<string | null>(null)
  
  // New state for modals and application flow
  const [showAIModal, setShowAIModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null)
  const [userResume, setUserResume] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // BYPASS: Skip Supabase resume fetching, use mock data
  useEffect(() => {
    console.log('🚀 BYPASS MODE: Using mock resume data')
    // For demo purposes, set a mock resume after 2 seconds
    setTimeout(() => {
      setUserResume('https://example.com/mock-resume.pdf')
    }, 2000)
  }, [user])

  // Filter internships based on search and filters
  useEffect(() => {
    let filtered = internships.filter(internship => {
      const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = selectedFilters.type === 'all' || internship.type === selectedFilters.type
      const matchesMinistry = selectedFilters.ministry === 'all' || internship.ministry === selectedFilters.ministry
      const matchesLocation = selectedFilters.location === 'all' || internship.location.includes(selectedFilters.location)
      
      return matchesSearch && matchesType && matchesMinistry && matchesLocation
    })

    // Sort by match score if AI matching is enabled
    if (showAIMatching) {
      filtered = filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    }

    setFilteredInternships(filtered)
  }, [searchTerm, selectedFilters, internships, showAIMatching])

  const handleAIMatching = async () => {
    // Check if user has resume first
    if (!userResume) {
      toast.error('Please upload your resume first to use AI matching!')
      setShowApplicationModal(true) // Show modal to upload resume
      return
    }
    
    setShowAIModal(true)
    setIsMatchingInProgress(true)
    
    // Simulate AI matching process with 4-5 seconds delay
    await new Promise(resolve => setTimeout(resolve, 4500))
    
    setShowAIMatching(true)
    setIsMatchingInProgress(false)
    setShowAIModal(false)
    toast.success('AI matching completed! Internships are now sorted by compatibility.')
  }

  const handleApply = (internshipId: string) => {
    setSelectedInternshipId(internshipId)
    setShowApplicationModal(true)
  }

  const handleResumeUpload = async () => {
    if (!resumeFile || !user?.id) return

    setIsUploading(true)
    try {
      const fileName = `${user.id}/resume-${Date.now()}.${resumeFile.name.split('.').pop()}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      // Update user profile with new resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: urlData.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        // If column doesn't exist, still continue with the upload
        if (updateError.code !== 'PGRST204') {
          throw updateError
        } else {
          console.warn('resume_url column not found in profiles table. Please add it using: ALTER TABLE profiles ADD COLUMN resume_url TEXT;')
        }
      }

      setUserResume(urlData.publicUrl)
      setResumeFile(null)
      toast.success('Resume uploaded successfully!')
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Failed to upload resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmitApplication = async () => {
    if (!userResume || !selectedInternshipId) {
      toast.error('Please upload your resume before applying.')
      return
    }

    setIsApplying(true)
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowApplicationModal(false)
      setShowSuccessModal(true)
      
      // Auto-close success modal after 5 seconds
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PM Internship Program</h1>
              <p className="text-gray-600 mt-1">Discover government internship opportunities</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <motion.button
                onClick={handleAIMatching}
                disabled={isMatchingInProgress}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5" />
                <span>{isMatchingInProgress ? 'Matching...' : 'AI Internship Matcher'}</span>
                <Zap className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {/* Ministry Filter */}
            <select
              value={selectedFilters.ministry}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, ministry: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ministries</option>
              <option value="Ministry of Electronics & IT">Electronics & IT</option>
              <option value="Department of Space">Space</option>
              <option value="Ministry of Home Affairs">Home Affairs</option>
            </select>

            {/* Location Filter */}
            <select
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Remote">Remote</option>
            </select>
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
                <p className="text-gray-600">Internships sorted by compatibility with your profile</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{filteredInternships.filter(i => i.isMatched).length}</div>
                <div className="text-sm text-gray-600">High Matches</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(filteredInternships.reduce((acc, i) => acc + (i.matchScore || 0), 0) / filteredInternships.length)}%</div>
                <div className="text-sm text-gray-600">Avg. Match Score</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{filteredInternships.length}</div>
                <div className="text-sm text-gray-600">Total Opportunities</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Internship Cards */}
        <div className="space-y-6">
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 ${
                showAIMatching && internship.isMatched ? 'ring-2 ring-purple-200 bg-purple-50/30' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Internship Image */}
                  {internship.image && (
                    <div className="lg:w-48 lg:mr-6 mb-4 lg:mb-0">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-32 lg:h-24 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                          {showAIMatching && internship.matchScore && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(internship.matchScore)}`}>
                              {internship.matchScore}% Match
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{internship.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{internship.duration}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{internship.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {internship.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{internship.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{internship.stipend}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{internship.applications}/{internship.maxApplications} applied</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-3">
                    <motion.button
                      onClick={() => handleApply(internship.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply Now
                    </motion.button>
                    <button
                      onClick={() => setExpandedInternship(expandedInternship === internship.id ? null : internship.id)}
                      className="flex items-center justify-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <span>View Details</span>
                      {expandedInternship === internship.id ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedInternship === internship.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {internship.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-gray-600">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Ministry Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{internship.ministry}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 capitalize">{internship.type} position</span>
                            </div>
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

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
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
