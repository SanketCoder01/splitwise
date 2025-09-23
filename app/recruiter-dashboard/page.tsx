'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, Plus, FileText, Users, Clock, CheckCircle, 
  AlertTriangle, Eye, Edit, Trash2, Bell, Settings, 
  LogOut, Upload, Calendar, MapPin, DollarSign, User,
  Send, Filter, Search, BarChart3, TrendingUp, Home,
  Lock, Unlock, ChevronRight, Menu, X, Shield,
  Award, Target, Briefcase, Globe, Phone, Mail
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import RecruiterProfileCompletion from '../../components/RecruiterProfileCompletion'

interface InternshipPosting {
  id: string
  title: string
  department: string
  location: string
  duration: string
  stipend: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'live'
  applications: number
  created_at: string
  deadline: string
}

interface RecruiterProfile {
  id: string
  full_name?: string
  company_name?: string
  profile_image?: string
  profile_completed: boolean
  profile_step: number
  approval_status: 'pending' | 'approved' | 'rejected'
  email?: string
  phone?: string
}

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showPostModal, setShowPostModal] = useState(false)
  const [internships, setInternships] = useState<InternshipPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [recruiterData, setRecruiterData] = useState<RecruiterProfile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfileSteps, setShowProfileSteps] = useState(false)

  useEffect(() => {
    fetchRecruiterData()
    fetchInternships()
  }, [])

  const fetchRecruiterData = async () => {
    try {
      // Get recruiter data from session storage (set during login)
      const recruiterSessionData = sessionStorage.getItem('recruiter_data')
      
      if (recruiterSessionData) {
        const sessionData = JSON.parse(recruiterSessionData)
        
        // Try to fetch from Supabase first
        const { data: profileData, error } = await supabase
          .from('recruiter_profiles')
          .select('*')
          .eq('email', sessionData.email || `hr@${sessionData.organization_id.toLowerCase()}.com`)
          .single()
        
        if (profileData) {
          // Use Supabase data if available
          const recruiterData: RecruiterProfile = {
            id: profileData.id,
            full_name: profileData.full_name,
            company_name: profileData.company_name,
            profile_image: undefined,
            profile_completed: profileData.profile_completed || false,
            profile_step: profileData.profile_step || 1,
            approval_status: profileData.approval_status || 'pending',
            email: profileData.email,
            phone: profileData.phone
          }
          setRecruiterData(recruiterData)
        } else {
          // Use session data as fallback and create initial profile
          const initialData: RecruiterProfile = {
            id: 'temp-' + sessionData.organization_id,
            full_name: '',
            company_name: sessionData.organization_name || '',
            profile_image: undefined,
            profile_completed: false,
            profile_step: 1,
            approval_status: 'pending',
            email: sessionData.email || `hr@${sessionData.organization_id.toLowerCase()}.com`,
            phone: ''
          }
          setRecruiterData(initialData)
        }
        
        // If profile not completed, show profile steps
        const currentData = profileData || { profile_completed: false }
        if (!currentData.profile_completed) {
          setActiveTab('profile-steps')
          setShowProfileSteps(true)
        }
      } else {
        // No session data, redirect to login
        window.location.href = '/recruiter-login'
      }
    } catch (error) {
      console.error('Error fetching recruiter data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internship_postings')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setInternships(data)
      }
    } catch (error) {
      console.error('Error fetching internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMenuItems = () => {
    const isProfileComplete = recruiterData?.profile_completed || false
    const isApproved = recruiterData?.approval_status === 'approved'
    
    const menuItems = []

    // Always show "Complete Profile" if profile is not completed
    if (!isProfileComplete) {
      menuItems.push({ 
        id: 'profile-steps', 
        label: 'Complete Profile', 
        icon: User, 
        color: 'text-green-600', 
        locked: false 
      })
    }

    // Lock everything except profile completion until profile is complete and approved
    if (isProfileComplete && isApproved) {
      menuItems.push(
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home, color: 'text-blue-600', locked: false },
        { id: 'post-internship', label: 'Post Internship', icon: Plus, color: 'text-green-600', locked: false },
        { id: 'my-postings', label: 'My Postings', icon: FileText, color: 'text-purple-600', locked: false },
        { id: 'applications', label: 'Applications', icon: Users, color: 'text-orange-600', locked: false },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-600', locked: false },
        { id: 'profile-view', label: 'View Profile', icon: User, color: 'text-gray-600', locked: false }
      )
    } else if (isProfileComplete && !isApproved) {
      // Profile complete but waiting for approval
      menuItems.push(
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home, color: 'text-yellow-600', locked: false },
        { id: 'profile-view', label: 'View Profile', icon: User, color: 'text-gray-600', locked: false },
        { id: 'post-internship', label: 'Post Internship', icon: Plus, color: 'text-gray-400', locked: true },
        { id: 'my-postings', label: 'My Postings', icon: FileText, color: 'text-gray-400', locked: true },
        { id: 'applications', label: 'Applications', icon: Users, color: 'text-gray-400', locked: true },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-gray-400', locked: true }
      )
    } else {
      // Show locked items when profile is not complete
      menuItems.push(
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home, color: 'text-gray-400', locked: true },
        { id: 'post-internship', label: 'Post Internship', icon: Plus, color: 'text-gray-400', locked: true },
        { id: 'my-postings', label: 'My Postings', icon: FileText, color: 'text-gray-400', locked: true },
        { id: 'applications', label: 'Applications', icon: Users, color: 'text-gray-400', locked: true },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-gray-400', locked: true }
      )
    }

    return menuItems
  }

  const handleMenuClick = (itemId: string) => {
    const menuItems = getMenuItems()
    const item = menuItems.find(m => m.id === itemId)
    
    if (item?.locked) {
      const isProfileComplete = recruiterData?.profile_completed || false
      if (!isProfileComplete) {
        toast.error('🔒 Please complete your profile first to unlock this feature!')
      } else {
        toast.error('🔒 Please wait for government approval to unlock this feature!')
      }
      return
    }

    setActiveTab(itemId)
  }

  const stats = {
    totalPostings: internships.length,
    livePostings: internships.filter(i => i.status === 'live').length,
    pendingApproval: internships.filter(i => i.status === 'submitted').length,
    totalApplications: internships.reduce((sum, i) => sum + i.applications, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'live': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">PM Internship Portal</h1>
                <p className="text-sm text-gray-600">Recruiter Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Profile Section */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="relative">
                  {recruiterData?.profile_image ? (
                    <img 
                      src={recruiterData.profile_image} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                    recruiterData?.approval_status === 'approved' ? 'bg-green-500' : 
                    recruiterData?.approval_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {recruiterData?.full_name || 'Complete Profile'}
                  </p>
                  <p className="text-gray-500">
                    {recruiterData?.company_name || 'Add Company Details'}
                  </p>
                </div>
              </div>
              
              <Link 
                href="/recruiter-login"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Full Size Sidebar */}
        <div className="w-80 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Navigation</h2>
              <p className="text-sm text-gray-600">
                {recruiterData?.profile_completed 
                  ? recruiterData?.approval_status === 'approved' 
                    ? 'All features unlocked' 
                    : 'Waiting for government approval'
                  : `Complete profile to unlock features (Step ${recruiterData?.profile_step || 1}/6)`
                }
              </p>
            </div>
            
            <nav className="space-y-2">
              {getMenuItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : item.locked
                      ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  disabled={item.locked}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.locked && <Lock className="w-4 h-4 text-gray-400" />}
                  {!item.locked && activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </nav>

            {/* Profile Status Card */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  recruiterData?.approval_status === 'approved' ? 'bg-green-100' :
                  recruiterData?.approval_status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    recruiterData?.approval_status === 'approved' ? 'text-green-600' :
                    recruiterData?.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Status</h3>
                  <p className={`text-sm ${
                    recruiterData?.approval_status === 'approved' ? 'text-green-600' :
                    recruiterData?.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {recruiterData?.approval_status === 'approved' ? 'Verified & Approved' :
                     recruiterData?.approval_status === 'pending' ? 'Pending Approval' : 'Rejected'}
                  </p>
                </div>
              </div>
              
              {!recruiterData?.profile_completed && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Profile Progress</span>
                    <span>{Math.round(((recruiterData?.profile_step || 1) / 6) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(((recruiterData?.profile_step || 1) / 6) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile-steps' && renderProfileSteps()}
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'profile-view' && renderProfile()}
              {activeTab === 'post-internship' && renderPostInternship()}
              {activeTab === 'my-postings' && renderMyPostings()}
              {activeTab === 'applications' && renderApplications()}
              {activeTab === 'analytics' && renderAnalytics()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  function renderDashboard() {
    if (recruiterData?.approval_status === 'pending') {
      return (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Waiting for Government Approval</h3>
                <p className="text-yellow-700 mt-1">
                  Your profile has been submitted for verification. You'll be able to post internships once approved by government officials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Manage your internship postings and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Postings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPostings}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Live Postings</p>
                <p className="text-3xl font-bold text-green-600">{stats.livePostings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('post-internship')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Post New Internship</span>
              </button>
              <button
                onClick={() => setActiveTab('my-postings')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Manage Postings</span>
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">View Applications</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {internships.slice(0, 3).map((internship) => (
                <div key={internship.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{internship.title}</p>
                    <p className="text-xs text-gray-500">
                      {internship.applications} applications • {new Date(internship.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(internship.status)}`}>
                    {internship.status}
                  </span>
                </div>
              ))}
              {internships.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No internships posted yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderProfileSteps() {
    return <RecruiterProfileCompletion recruiterData={recruiterData} onProfileUpdate={fetchRecruiterData} />
  }

  function renderProfile() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview</h2>
          <p className="text-gray-600">View and manage your recruiter profile information</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              {recruiterData?.profile_image ? (
                <img 
                  src={recruiterData.profile_image} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                recruiterData?.approval_status === 'approved' ? 'bg-green-500' : 
                recruiterData?.approval_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {recruiterData?.approval_status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Clock className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {recruiterData?.full_name || 'Complete Profile'}
              </h3>
              <p className="text-gray-600">{recruiterData?.company_name || 'Add Company Details'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className={`font-medium ${
                  recruiterData?.approval_status === 'approved' ? 'text-green-600' :
                  recruiterData?.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {recruiterData?.approval_status === 'approved' ? 'Verified & Approved' :
                   recruiterData?.approval_status === 'pending' ? 'Pending Approval' : 'Rejected'}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{recruiterData?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{recruiterData?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Profile Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{Math.round(((recruiterData?.profile_step || 1) / 6) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(((recruiterData?.profile_step || 1) / 6) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Step {recruiterData?.profile_step || 1} of 6 completed
                </p>
              </div>
            </div>
          </div>

          {!recruiterData?.profile_completed && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-900">Complete Your Profile</h4>
                  <p className="text-sm text-orange-700">
                    Complete all profile steps to unlock internship posting features.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('profile-steps')}
                className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Continue Profile Setup
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderPostInternship() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post New Internship</h2>
          <p className="text-gray-600">Create a new internship posting for government approval</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Internship Posting Form</h3>
            <p className="text-gray-600 mb-6">
              This will include comprehensive internship posting form with all required fields.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Features:</strong> Internship details, requirements, benefits, poster upload, contact information, etc.
              </p>
            </div>
            <button
              onClick={() => toast('Internship posting form will be implemented')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Posting Form
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderMyPostings() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Postings</h2>
            <p className="text-gray-600">Manage your internship postings and track applications</p>
          </div>
          <button
            onClick={() => setActiveTab('post-internship')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Posting</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {internships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Internship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {internships.map((internship) => (
                    <tr key={internship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{internship.title}</div>
                          <div className="text-sm text-gray-500">{internship.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                          {internship.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {internship.applications}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(internship.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No postings yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first internship posting</p>
              <button
                onClick={() => setActiveTab('post-internship')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Posting
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderApplications() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Applications</h2>
          <p className="text-gray-600">Review and manage internship applications</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Management</h3>
            <p className="text-gray-600 mb-6">
              View, filter, and manage applications from students for your internship postings.
            </p>
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>Features:</strong> Application filtering, student profiles, resume viewing, status updates, etc.
              </p>
            </div>
            <button
              onClick={() => toast('Application management will be implemented')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Build Application System
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderAnalytics() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-600">Track performance and insights for your internship postings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics including application trends, posting performance, and recruitment insights.
            </p>
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-indigo-800">
                <strong>Features:</strong> Charts, graphs, application statistics, performance metrics, etc.
              </p>
            </div>
            <button
              onClick={() => toast('Analytics dashboard will be implemented')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Analytics
            </button>
          </div>
        </div>
      </div>
    )
  }
}
