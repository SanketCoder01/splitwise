'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, Star, 
  Briefcase, Award, Heart, ExternalLink, Brain, Zap, Target,
  Upload, FileText, CheckCircle, Eye, Download, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

interface Internship {
  id: string
  title: string
  department: string
  ministry: string
  location: string
  duration: string
  stipend: string
  description: string
  requirements: string[]
  skills_required: string[]
  application_deadline: string
  start_date: string
  slots_available: number
  slots_filled: number
  match_percentage?: number
  is_recommended?: boolean
  created_at: string
}

interface Filters {
  location: string
  duration: string
  ministry: string
  skills: string[]
  stipend_range: string
}

export default function InternshipSearch() {
  const { user } = useAuth()
  const [internships, setInternships] = useState<Internship[]>([])
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    location: '',
    duration: '',
    ministry: '',
    skills: [],
    stipend_range: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [savedInternships, setSavedInternships] = useState<string[]>([])
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [profileData, setProfileData] = useState<any>({})
  const [hasResume, setHasResume] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isAIMatching, setIsAIMatching] = useState(false)

  const locations = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Remote']
  const durations = ['1 month', '2 months', '3 months', '6 months', '1 year']
  const ministries = [
    'Ministry of Electronics & IT',
    'Ministry of Statistics',
    'Ministry of Information',
    'Ministry of Defence',
    'Ministry of Railways',
    'Ministry of Health',
    'ISRO',
    'DRDO'
  ]
  const stipendRanges = ['Unpaid', '₹5,000-₹10,000', '₹10,000-₹20,000', '₹20,000-₹30,000', '₹30,000+']

  useEffect(() => {
    fetchInternships()
    fetchSavedInternships()
    if (user) {
      fetchProfileData()
    }
  }, [user])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [internships, searchQuery, filters])

  const fetchInternships = async () => {
    setLoading(true)
    
    // Mock data with AI matching
    const mockInternships: Internship[] = [
      {
        id: '1',
        title: 'Software Development Intern',
        department: 'Digital India Initiative',
        ministry: 'Ministry of Electronics & IT',
        location: 'New Delhi',
        duration: '3 months',
        stipend: '₹25,000/month',
        description: 'Work on developing digital solutions for government services. You will be involved in creating web applications, mobile apps, and backend systems.',
        requirements: ['B.Tech/M.Tech in Computer Science', 'Good academic record', 'Problem-solving skills'],
        skills_required: ['JavaScript', 'React', 'Node.js', 'Python', 'Database Management'],
        application_deadline: '2024-02-15',
        start_date: '2024-03-01',
        slots_available: 10,
        slots_filled: 3,
        match_percentage: 95,
        is_recommended: true,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        title: 'Data Analytics Intern',
        department: 'Statistical Analysis Division',
        ministry: 'Ministry of Statistics',
        location: 'Mumbai',
        duration: '6 months',
        stipend: '₹20,000/month',
        description: 'Analyze government data to derive insights for policy making. Work with large datasets and create visualizations.',
        requirements: ['B.Tech/M.Tech in relevant field', 'Knowledge of statistics', 'Analytical mindset'],
        skills_required: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
        application_deadline: '2024-02-20',
        start_date: '2024-03-15',
        slots_available: 8,
        slots_filled: 2,
        match_percentage: 88,
        is_recommended: true,
        created_at: '2024-01-18'
      },
      {
        id: '3',
        title: 'Digital Marketing Intern',
        department: 'Public Communications',
        ministry: 'Ministry of Information',
        location: 'Bangalore',
        duration: '2 months',
        stipend: '₹15,000/month',
        description: 'Help create digital campaigns for government initiatives. Manage social media and create content.',
        requirements: ['Graduate in any field', 'Creative thinking', 'Communication skills'],
        skills_required: ['Digital Marketing', 'Content Creation', 'Social Media', 'Adobe Creative Suite'],
        application_deadline: '2024-02-10',
        start_date: '2024-02-25',
        slots_available: 5,
        slots_filled: 1,
        match_percentage: 72,
        is_recommended: false,
        created_at: '2024-01-20'
      },
      {
        id: '4',
        title: 'Cybersecurity Research Intern',
        department: 'Cyber Security Division',
        ministry: 'Ministry of Electronics & IT',
        location: 'Hyderabad',
        duration: '6 months',
        stipend: '₹30,000/month',
        description: 'Research and develop cybersecurity solutions for government infrastructure. Work on threat analysis and security protocols.',
        requirements: ['M.Tech in Cybersecurity/Computer Science', 'Security certifications preferred', 'Research experience'],
        skills_required: ['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Python', 'Linux'],
        application_deadline: '2024-02-25',
        start_date: '2024-03-10',
        slots_available: 6,
        slots_filled: 0,
        match_percentage: 65,
        is_recommended: false,
        created_at: '2024-01-22'
      },
      {
        id: '5',
        title: 'Space Technology Intern',
        department: 'Satellite Applications',
        ministry: 'ISRO',
        location: 'Bangalore',
        duration: '1 year',
        stipend: '₹35,000/month',
        description: 'Work on satellite technology and space applications. Contribute to ongoing space missions and research projects.',
        requirements: ['B.Tech/M.Tech in Aerospace/Electronics', 'Excellent academic record', 'Passion for space technology'],
        skills_required: ['Satellite Technology', 'Electronics', 'MATLAB', 'C++', 'Signal Processing'],
        application_deadline: '2024-03-01',
        start_date: '2024-04-01',
        slots_available: 12,
        slots_filled: 5,
        match_percentage: 58,
        is_recommended: false,
        created_at: '2024-01-25'
      }
    ]
    
    setInternships(mockInternships)
    setLoading(false)
  }

  const fetchSavedInternships = async () => {
    // Mock saved internships
    setSavedInternships(['1', '2'])
  }

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
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...internships]

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.skills_required.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(internship => internship.location === filters.location)
    }

    // Duration filter
    if (filters.duration) {
      filtered = filtered.filter(internship => internship.duration === filters.duration)
    }

    // Ministry filter
    if (filters.ministry) {
      filtered = filtered.filter(internship => internship.ministry === filters.ministry)
    }

    // Sort by AI recommendations and match percentage
    filtered.sort((a, b) => {
      if (a.is_recommended && !b.is_recommended) return -1
      if (!a.is_recommended && b.is_recommended) return 1
      return (b.match_percentage || 0) - (a.match_percentage || 0)
    })

    setFilteredInternships(filtered)
  }

  const toggleSaveInternship = async (internshipId: string) => {
    if (savedInternships.includes(internshipId)) {
      setSavedInternships(prev => prev.filter(id => id !== internshipId))
    } else {
      setSavedInternships(prev => [...prev, internshipId])
    }
  }

  const applyToInternship = async (internship: Internship) => {
    setSelectedInternship(internship)
    setShowApplicationModal(true)
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
      setProfileData((prev: any) => ({ ...prev, resume_url: urlData.publicUrl }))
      toast.success('Resume uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload resume')
    }
  }

  const handleSubmitApplication = async () => {
    if (!hasResume) {
      toast.error('Please upload your resume first')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowApplicationModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIMatching = async () => {
    setIsAIMatching(true)
    
    try {
      // Simulate AI matching process with 4-5 second delay
      await new Promise(resolve => setTimeout(resolve, 4500))
      
      // Re-fetch internships with updated AI recommendations
      await fetchInternships()
      
      toast.success('AI matching completed! Found personalized recommendations for you.')
    } catch (error) {
      toast.error('AI matching failed. Please try again.')
    } finally {
      setIsAIMatching(false)
    }
  }

  const InternshipCard = ({ internship }: { internship: Internship }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
        internship.is_recommended ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
            {internship.is_recommended && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                <Brain className="w-3 h-3" />
                <span>AI Recommended</span>
              </div>
            )}
            {internship.match_percentage && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                <Target className="w-3 h-3" />
                <span>{internship.match_percentage}% Match</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-1">{internship.department}</p>
          <p className="text-sm text-blue-600 font-medium">{internship.ministry}</p>
        </div>
        
        <button
          onClick={() => toggleSaveInternship(internship.id)}
          className={`p-2 rounded-full transition-colors ${
            savedInternships.includes(internship.id)
              ? 'text-red-500 bg-red-50'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${savedInternships.includes(internship.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{internship.duration}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Award className="w-4 h-4" />
          <span>{internship.stipend}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{internship.slots_available - internship.slots_filled} slots left</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2">{internship.description}</p>

      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
        <div className="flex flex-wrap gap-1">
          {internship.skills_required.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span>Deadline: {new Date(internship.application_deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            <ExternalLink className="w-3 h-3" />
            <span>Details</span>
          </button>
          <button
            onClick={() => applyToInternship(internship)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search internships by title, skills, or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* AI Insights */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-blue-600">
              <Brain className="w-4 h-4" />
              <span>AI found {filteredInternships.filter(i => i.is_recommended).length} perfect matches for you</span>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Zap className="w-4 h-4" />
              <span>Based on your profile and skills</span>
            </div>
          </div>
          
          <button
            onClick={handleAIMatching}
            disabled={isAIMatching}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isAIMatching
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isAIMatching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>AI Matching...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>AI Internship Matcher</span>
              </>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Durations</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministry</label>
                  <select
                    value={filters.ministry}
                    onChange={(e) => setFilters({ ...filters, ministry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Ministries</option>
                    {ministries.map(ministry => (
                      <option key={ministry} value={ministry}>{ministry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                  <select
                    value={filters.stipend_range}
                    onChange={(e) => setFilters({ ...filters, stipend_range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Ranges</option>
                    {stipendRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredInternships.length} Internships Found
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>Sorted by AI recommendations</span>
        </div>
      </div>

      {/* AI Matching Loading Overlay */}
      <AnimatePresence>
        {isAIMatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-purple-600 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Internship Matcher</h3>
              <p className="text-gray-600 mb-4">
                Analyzing your profile and matching with the best internships for your skills...
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span>Finding perfect matches</span>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Matching Progress</span>
                  <span className="text-sm font-medium text-purple-600">Analyzing...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internship Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInternships.map(internship => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      )}

      {filteredInternships.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedInternship && (
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
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Apply for Internship</h2>
                  <p className="text-gray-600 mt-1">{selectedInternship.title} at {selectedInternship.ministry}</p>
                </div>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Profile Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Your Profile Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Name:</span> {profileData.full_name || 'Not provided'}</p>
                      <p><span className="font-medium">Email:</span> {user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Phone:</span> {profileData.phone || 'Not provided'}</p>
                      <p><span className="font-medium">Education:</span> {profileData.education_level || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Resume</h3>
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
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-green-700 border border-green-300 rounded hover:bg-green-100 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {profileData.resume_url && (
                          <a
                            href={profileData.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1 text-green-700 border border-green-300 rounded hover:bg-green-100 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">Upload Your Resume</h4>
                      <p className="text-gray-600 mb-4 text-sm">Please upload your resume to proceed with the application</p>
                      
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
                        id="resume-upload-modal"
                      />
                      <label
                        htmlFor="resume-upload-modal"
                        className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Resume File</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  )}
                </div>

                {/* Internship Details */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">Internship Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{selectedInternship.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{selectedInternship.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{selectedInternship.stipend}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800">{selectedInternship.slots_available - selectedInternship.slots_filled} slots left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  {hasResume 
                    ? 'Your profile is complete. Ready to apply!' 
                    : 'Please upload your resume to proceed.'
                  }
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    disabled={!hasResume || isSubmitting}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      hasResume && !isSubmitting
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Apply Now</span>
                      </>
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
                Your application for {selectedInternship?.title} has been submitted successfully. 
                You will receive a confirmation email shortly.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
