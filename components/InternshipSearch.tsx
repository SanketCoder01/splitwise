'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, Star, 
  Briefcase, Award, Heart, ExternalLink, Brain, Zap, Target
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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
  }, [])

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

  const applyToInternship = async (internshipId: string) => {
    // Handle application logic
    console.log('Applying to internship:', internshipId)
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
            onClick={() => applyToInternship(internship.id)}
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
    </div>
  )
}
