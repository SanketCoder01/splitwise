'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, CheckCircle, XCircle, Eye, Calendar, MapPin, 
  Building2, User, Mail, Phone, FileText, Download,
  ArrowLeft, Filter, Search, RefreshCw, AlertCircle,
  Users, MessageSquare, Plus, Send
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Application {
  id: string
  internship_title: string
  company: string
  location: string
  applied_date: string
  status: 'applied' | 'offer_received' | 'offer_accepted' | 'joined' | 'completed' | 'rejected'
  interview_date?: string
  stipend: string
  duration: string
  application_id: string
  progress_percentage: number
}

interface Grievance {
  id: string
  title: string
  description: string
  category: 'technical' | 'application' | 'payment' | 'other'
  status: 'pending' | 'in_progress' | 'resolved'
  created_at: string
  response?: string
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGrievanceModal, setShowGrievanceModal] = useState(false)
  const [newGrievance, setNewGrievance] = useState({
    title: '',
    description: '',
    category: 'application' as const
  })

  // Mock data for applications with status progression
  useEffect(() => {
    setTimeout(() => {
      setApplications([
        {
          id: '1',
          internship_title: 'Software Developer Intern',
          company: 'National Informatics Centre (NIC)',
          location: 'New Delhi',
          applied_date: '2024-01-15',
          status: 'completed',
          stipend: '₹35,000/month',
          duration: '6 months',
          application_id: 'PMI-2024-001',
          progress_percentage: 100
        },
        {
          id: '2',
          internship_title: 'Data Analyst Intern',
          company: 'Ministry of Education',
          location: 'Mumbai',
          applied_date: '2024-01-20',
          status: 'joined',
          interview_date: '2024-01-28',
          stipend: '₹30,000/month',
          duration: '4 months',
          application_id: 'PMI-2024-002',
          progress_percentage: 80
        },
        {
          id: '3',
          internship_title: 'Research Assistant',
          company: 'DRDO',
          location: 'Bangalore',
          applied_date: '2024-01-22',
          status: 'offer_accepted',
          stipend: '₹40,000/month',
          duration: '8 months',
          application_id: 'PMI-2024-003',
          progress_percentage: 60
        },
        {
          id: '4',
          internship_title: 'Digital Marketing Intern',
          company: 'Digital India Corporation',
          location: 'Pune',
          applied_date: '2024-01-25',
          status: 'offer_received',
          stipend: '₹25,000/month',
          duration: '3 months',
          application_id: 'PMI-2024-004',
          progress_percentage: 40
        },
        {
          id: '5',
          internship_title: 'Cybersecurity Intern',
          company: 'CERT-In',
          location: 'New Delhi',
          applied_date: '2024-01-18',
          status: 'applied',
          stipend: '₹45,000/month',
          duration: '6 months',
          application_id: 'PMI-2024-005',
          progress_percentage: 20
        }
      ])
      
      setGrievances([
        {
          id: '1',
          title: 'Application Status Not Updated',
          description: 'My application status has not been updated for over 2 weeks',
          category: 'application',
          status: 'resolved',
          created_at: '2024-01-10',
          response: 'Your application has been reviewed and status updated. Thank you for your patience.'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'joined': return 'text-blue-600 bg-blue-100'
      case 'offer_accepted': return 'text-purple-600 bg-purple-100'
      case 'offer_received': return 'text-orange-600 bg-orange-100'
      case 'applied': return 'text-gray-600 bg-gray-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'joined': return <Users className="w-4 h-4" />
      case 'offer_accepted': return <CheckCircle className="w-4 h-4" />
      case 'offer_received': return <Mail className="w-4 h-4" />
      case 'applied': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Internship Completed'
      case 'joined': return 'Physically Joined'
      case 'offer_accepted': return 'Offer Accepted'
      case 'offer_received': return 'Offer Received'
      case 'applied': return 'My Applications'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  const getProgressSteps = (status: string) => {
    const steps = [
      { key: 'applied', label: 'My Applications', completed: true },
      { key: 'offer_received', label: 'Offer Received', completed: false },
      { key: 'offer_accepted', label: 'Offer Accepted', completed: false },
      { key: 'joined', label: 'Physically Joined', completed: false },
      { key: 'completed', label: 'Internship Completed', completed: false }
    ]

    const statusOrder = ['applied', 'offer_received', 'offer_accepted', 'joined', 'completed']
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  const handleSubmitGrievance = () => {
    if (!newGrievance.title || !newGrievance.description) return

    const grievance: Grievance = {
      id: Date.now().toString(),
      title: newGrievance.title,
      description: newGrievance.description,
      category: newGrievance.category,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    setGrievances(prev => [grievance, ...prev])
    setNewGrievance({ title: '', description: '', category: 'application' })
    setShowGrievanceModal(false)
  }

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter
    const matchesSearch = app.internship_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
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
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Government Internship Portal</h1>
                  <p className="text-xs text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500">Government of India</p>
                </div>
              </div>
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your internship applications and their real-time status</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Applications</option>
                  <option value="applied">Applied</option>
                  <option value="offer_received">Offer Received</option>
                  <option value="offer_accepted">Offer Accepted</option>
                  <option value="joined">Joined</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => setShowGrievanceModal(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Submit Grievance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">You haven't applied for any internships yet or no applications match your search.</p>
            <Link
              href="/internships"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Browse Internships</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {application.internship_title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{application.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>ID: {application.application_id}</span>
                        <span>Duration: {application.duration}</span>
                        <span>Stipend: {application.stipend}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{getStatusText(application.status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Application Progress</span>
                      <span className="text-sm text-gray-500">{application.progress_percentage}% Complete</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${application.progress_percentage}%` }}
                      ></div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="flex items-center justify-between">
                      {getProgressSteps(application.status).map((step, stepIndex) => (
                        <div key={step.key} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            step.completed 
                              ? 'bg-blue-600 text-white' 
                              : step.active
                              ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {step.completed ? '✓' : stepIndex + 1}
                          </div>
                          <span className={`text-xs mt-1 text-center max-w-20 ${
                            step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    {application.status === 'offer_received' && (
                      <>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept Offer</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download Certificate</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Grievances Section */}
        {grievances.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Grievances</h2>
            <div className="space-y-4">
              {grievances.map((grievance) => (
                <div key={grievance.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{grievance.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{grievance.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Category: {grievance.category}</span>
                        <span>Submitted: {new Date(grievance.created_at).toLocaleDateString()}</span>
                      </div>
                      {grievance.response && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">{grievance.response}</p>
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      grievance.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      grievance.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {grievance.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grievance Modal */}
      <AnimatePresence>
        {showGrievanceModal && (
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
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Submit Grievance</h3>
                <button
                  onClick={() => setShowGrievanceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGrievance.title}
                    onChange={(e) => setNewGrievance(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief title for your grievance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newGrievance.category}
                    onChange={(e) => setNewGrievance(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="application">Application Issue</option>
                    <option value="technical">Technical Problem</option>
                    <option value="payment">Payment Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGrievance.description}
                    onChange={(e) => setNewGrievance(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowGrievanceModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitGrievance}
                    disabled={!newGrievance.title || !newGrievance.description}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
