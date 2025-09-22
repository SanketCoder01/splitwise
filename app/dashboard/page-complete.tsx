'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  User, 
  Award,
  Settings,
  LogOut,
  Bell,
  Home,
  Menu,
  X,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Eye,
  Download,
  Star,
  Building,
  GraduationCap,
  Loader2,
  MessageSquare,
  FileCheck,
  Target,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showInternshipModal, setShowInternshipModal] = useState(false)
  const [showResumeMatch, setShowResumeMatch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasResume, setHasResume] = useState(true)

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home, color: 'text-blue-600' },
    { id: 'internships', label: 'Government Internships', icon: Briefcase, color: 'text-green-600', badge: 'New' },
    { id: 'upload', label: 'Upload Resume', icon: Upload, color: 'text-purple-600' },
    { id: 'verify', label: 'Document Verification', icon: CheckCircle, color: 'text-emerald-600' },
    { id: 'skills', label: 'Skills Assessment', icon: Award, color: 'text-orange-600' },
    { id: 'profile', label: 'My Profile', icon: User, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
  ]

  const stats = [
    { label: 'Resumes Uploaded', value: '3', icon: FileText, color: 'bg-blue-50 text-blue-600', change: '+2 this month' },
    { label: 'Verified Documents', value: '2', icon: CheckCircle, color: 'bg-green-50 text-green-600', change: '+1 this week' },
    { label: 'Skills Assessed', value: '5', icon: Award, color: 'bg-purple-50 text-purple-600', change: '+3 this month' },
    { label: 'Internship Applications', value: '8', icon: Briefcase, color: 'bg-orange-50 text-orange-600', change: '+5 this week' },
  ]

  const internships = [
    {
      id: 1,
      title: 'Data Science Intern',
      department: 'Ministry of Electronics & IT',
      location: 'New Delhi',
      duration: '6 months',
      stipend: '₹25,000/month',
      deadline: '2025-02-15',
      description: 'Work on AI/ML projects for government digital initiatives',
      requirements: ['Python', 'Machine Learning', 'Data Analysis'],
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop',
      matchScore: 92
    },
    {
      id: 2,
      title: 'Web Development Intern',
      department: 'Digital India Corporation',
      location: 'Bangalore',
      duration: '4 months',
      stipend: '₹20,000/month',
      deadline: '2025-02-20',
      description: 'Develop and maintain government web portals',
      requirements: ['React', 'Node.js', 'JavaScript'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      matchScore: 88
    },
    {
      id: 3,
      title: 'Cybersecurity Analyst Intern',
      department: 'National Cyber Security Coordinator',
      location: 'Mumbai',
      duration: '6 months',
      stipend: '₹30,000/month',
      deadline: '2025-02-10',
      description: 'Assist in national cybersecurity initiatives',
      requirements: ['Network Security', 'Ethical Hacking', 'Risk Assessment'],
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop',
      matchScore: 85
    },
    {
      id: 4,
      title: 'Digital Marketing Intern',
      department: 'Ministry of Information & Broadcasting',
      location: 'Chennai',
      duration: '3 months',
      stipend: '₹18,000/month',
      deadline: '2025-02-25',
      description: 'Promote government schemes through digital channels',
      requirements: ['Social Media Marketing', 'Content Creation', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      matchScore: 78
    }
  ]

  useEffect(() => {
    if (activeTab === 'internships') {
      const timer = setTimeout(() => {
        setShowInternshipModal(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [activeTab])

  const handleResumeMatch = async () => {
    setIsLoading(true)
    setShowInternshipModal(false)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsLoading(false)
    setShowResumeMatch(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResuChain</h1>
                <p className="text-sm text-gray-600">Student Portal | Government of India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Rahul Sharma</p>
                  <p className="text-xs text-gray-500">Student ID: ST2025001</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-80 bg-white shadow-xl min-h-screen border-r"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Navigation Menu</h2>
                <nav>
                  <ul className="space-y-3">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                            activeTab === item.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 shadow-md'
                              : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <item.icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'text-gray-600'}`} />
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Rahul!</h2>
                  <p className="text-gray-600">Here's what's happening with your profile today.</p>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-green-600">{stat.change}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('internships')}
                        className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-700">Browse Internships</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700">Upload New Resume</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('skills')}
                        className="w-full flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <Award className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-700">Take Skills Test</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Resume verified successfully</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Applied for Data Science internship</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Skills assessment completed</p>
                          <p className="text-xs text-gray-500">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'internships' && (
              <motion.div
                key="internships"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Government Internships</h2>
                  <p className="text-gray-600">Discover exciting internship opportunities with government organizations</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search internships..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* Internships Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {internships.map((internship, index) => (
                    <motion.div
                      key={internship.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative">
                        <Image
                          src={internship.image}
                          alt={internship.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                          {internship.matchScore}% Match
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h3>
                        <p className="text-gray-600 mb-4">{internship.department}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {internship.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {internship.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {internship.stipend}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{internship.description}</p>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {internship.requirements.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-red-600 font-medium">
                            Deadline: {new Date(internship.deadline).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Internship Matching Modal */}
      <AnimatePresence>
        {showInternshipModal && (
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
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Internship Matching</h3>
                <p className="text-gray-600 mb-6">
                  Would you like us to match these internships with your resume to find the best opportunities for you?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInternshipModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleResumeMatch}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Yes, Match Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Modal */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Resume</h3>
                <p className="text-gray-600">
                  Our AI is matching your skills with available internships...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Match Results Modal */}
      <AnimatePresence>
        {showResumeMatch && (
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
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume Analysis Complete!</h3>
                <p className="text-gray-600">Here are your top internship matches based on your profile</p>
              </div>

              <div className="space-y-4 mb-6">
                {internships.slice(0, 3).map((internship) => (
                  <div key={internship.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{internship.title}</h4>
                      <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                        {internship.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{internship.department}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{internship.location}</span>
                      <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResumeMatch(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View All Matches
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
