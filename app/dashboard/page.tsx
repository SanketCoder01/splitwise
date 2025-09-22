'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Award, Settings, LogOut, Bell, Menu, X, 
  Briefcase, MessageSquare, FileCheck, Edit, Save, Plus, Download,
  Home, Upload, CheckCircle, Clock, Star, HelpCircle, Shield,
  Phone, Mail, MapPin, Calendar, BookOpen, Zap, Target, TrendingUp,
  Lock, Unlock
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import DocumentVerification from '../../components/DocumentVerification'
import DocumentVerificationNew from '../../components/DocumentVerificationNew'
import MultiStepProfile from '../../components/MultiStepProfile'
import SkillsAssessment from '../../components/SkillsAssessment'
import GrievanceManagement from '../../components/GrievanceManagement'
import EnhancedDocumentUpload from '../../components/EnhancedDocumentUpload'
import ResumeBuilder from '../../components/ResumeBuilder'
import InternshipSearch from '../../components/InternshipSearch'
import AIChatbot from '../../components/AIChatbot'

export default function StudentDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfileSteps, setShowProfileSteps] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  const getMenuItems = () => {
    const isProfileComplete = userData?.profile_completed || false
    const isDocumentVerified = (userData?.document_verifications?.[0]?.aadhaar_verified && userData?.document_verifications?.[0]?.digilocker_verified) || 
                              (userData?.aadhaar_verified && userData?.digilocker_verified)
    
    const menuItems = []

    // Always show "Complete Profile" if profile is not completed
    if (!isProfileComplete) {
      menuItems.push({ id: 'profile-steps', label: 'Complete Profile', icon: User, color: 'text-green-600', locked: false })
    }

    // Lock everything except profile completion until profile is complete
    if (isProfileComplete) {
      menuItems.push(
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home, color: 'text-blue-600', locked: false },
        { id: 'documents', label: 'Document Verification', icon: FileCheck, color: 'text-purple-600', locked: false },
        { id: 'settings', label: 'Settings & Help', icon: Settings, color: 'text-gray-600', locked: false }
      )

      // Additional features unlock after document verification
      menuItems.push(
        { id: 'resume', label: 'Resume Builder', icon: FileText, color: 'text-orange-600', locked: !isDocumentVerified },
        { id: 'skills', label: 'Skills Assessment', icon: Award, color: 'text-yellow-600', locked: !isDocumentVerified },
        { id: 'internships', label: 'Find Internships', icon: Briefcase, color: 'text-indigo-600', locked: !isDocumentVerified },
        { id: 'applications', label: 'My Applications', icon: Target, color: 'text-red-600', locked: !isDocumentVerified },
        { id: 'grievance', label: 'Support & Grievance', icon: MessageSquare, color: 'text-pink-600', locked: false },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-teal-600', locked: false }
      )
    } else {
      // Show locked items when profile is not complete
      menuItems.push(
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home, color: 'text-gray-400', locked: true },
        { id: 'documents', label: 'Document Verification', icon: FileCheck, color: 'text-gray-400', locked: true },
        { id: 'settings', label: 'Settings & Help', icon: Settings, color: 'text-gray-400', locked: true },
        { id: 'resume', label: 'Resume Builder', icon: FileText, color: 'text-gray-400', locked: true },
        { id: 'skills', label: 'Skills Assessment', icon: Award, color: 'text-gray-400', locked: true },
        { id: 'internships', label: 'Find Internships', icon: Briefcase, color: 'text-gray-400', locked: true },
        { id: 'applications', label: 'My Applications', icon: Target, color: 'text-gray-400', locked: true },
        { id: 'grievance', label: 'Support & Grievance', icon: MessageSquare, color: 'text-gray-400', locked: true },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-gray-400', locked: true }
      )
    }

    return menuItems
  }

  useEffect(() => {
    if (user) {
      fetchAllData()
      
      // Check URL parameters for tab
      const urlParams = new URLSearchParams(window.location.search)
      const tab = urlParams.get('tab')
      const firstTime = urlParams.get('first-time')
      
      if (tab === 'profile-steps') {
        setActiveTab('profile-steps')
        setShowProfileSteps(true)
        
        // Show welcome message for first-time users
        if (firstTime === 'true') {
          setTimeout(() => {
            toast.success('Complete your profile to unlock all features!', {
              duration: 4000,
              position: 'top-center'
            })
          }, 1000)
        }
      }
    } else if (user === null) {
      setLoading(false)
    }
  }, [user])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchUserData(),
        fetchDocuments(),
        fetchSkills(),
        fetchApplications(),
        fetchNotifications()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          document_verifications (
            aadhaar_verified,
            digilocker_verified,
            overall_verification_status
          )
        `)
        .eq('id', user?.id)
        .single()
      
      if (data) {
        setUserData(data)
        
        // Check if this is a first-time user (profile not completed)
        if (!data.profile_completed && (data.profile_step === 1 || !data.profile_step)) {
          setActiveTab('profile-steps')
          setShowProfileSteps(true)
        }
      }
      if (error) console.error('Error fetching user data:', error)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (data) setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user?.id)
      
      if (data) setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (data) setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
      
      if (data) setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleMenuClick = (itemId: string) => {
    const menuItems = getMenuItems()
    const item = menuItems.find(m => m.id === itemId)
    
    if (item?.locked) {
      const isProfileComplete = userData?.profile_completed || false
      if (!isProfileComplete) {
        toast.error('🔒 Please complete your profile first to unlock this feature!')
      } else {
        toast.error('🔒 Please complete document verification to unlock this feature!')
      }
      return
    }
    
    // Redirect to internships page for better experience
    if (itemId === 'internships') {
      window.location.href = '/internships'
      return
    }
    
    setActiveTab(itemId)
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const updateProfile = async (field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user?.id)
      
      if (!error) {
        setUserData({ ...userData, [field]: value })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const getProfileCompletion = () => {
    if (!userData) return 0
    
    // Use profile_step from multi-step profile if available
    if (userData.profile_step) {
      return Math.round((userData.profile_step / 6) * 100)
    }
    
    // Fallback to old method if profile_step is not available
    const fields = ['full_name', 'phone', 'location', 'linkedin', 'github']
    const completed = fields.filter(field => userData[field]).length
    return Math.round((completed / fields.length) * 100)
  }

  const getVerificationStatus = () => {
    const verified = documents.filter(doc => doc.verification_status === 'verified').length
    const pending = documents.filter(doc => doc.verification_status === 'pending').length
    const rejected = documents.filter(doc => doc.verification_status === 'rejected').length
    return { verified, pending, rejected, total: documents.length }
  }

  const renderDashboard = () => {
    const profileCompletion = getProfileCompletion()
    const verificationStatus = getVerificationStatus()
    
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {userData?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
              </h1>
              <p className="text-blue-100">
                Ready to take the next step in your career journey?
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{profileCompletion}%</div>
              <div className="text-sm text-blue-100">Profile Complete</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{verificationStatus.verified}/{verificationStatus.total}</p>
                <p className="text-xs text-green-600">Verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-semibold text-gray-900">{skills.length}</p>
                <p className="text-xs text-yellow-600">Assessed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
                <p className="text-xs text-green-600">Submitted</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
                <p className="text-xs text-red-600">Unread</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Progress */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium text-gray-900">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              
              <div className="space-y-2 mt-4">
                {[
                  { label: 'Basic Information', completed: !!userData?.full_name },
                  { label: 'Contact Details', completed: !!userData?.phone },
                  { label: 'Professional Links', completed: !!userData?.linkedin },
                  { label: 'Documents', completed: verificationStatus.verified > 0 },
                  { label: 'Skills Assessment', completed: skills.length > 0 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {documents.slice(0, 3).map((doc, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    doc.verification_status === 'verified' 
                      ? 'bg-green-100 text-green-800'
                      : doc.verification_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.verification_status}
                  </span>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="text-center py-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Upload your first document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveTab('resume')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Build Resume</p>
                <p className="text-xs text-gray-500">Create professional resume</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('internships')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Briefcase className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Find Internships</p>
                <p className="text-xs text-gray-500">Browse opportunities</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('skills')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Award className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Take Assessment</p>
                <p className="text-xs text-gray-500">Test your skills</p>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('documents')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Upload Documents</p>
                <p className="text-xs text-gray-500">Verify credentials</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Complete Profile</h1>
            <p className="text-green-100">View all your submitted information</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                Profile {userData?.profile_completed ? 'Completed' : 'In Progress'}
              </span>
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                Step {userData?.profile_step || 1} of 6
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{getProfileCompletion()}%</div>
            <div className="text-sm text-gray-500">Profile Complete</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{userData?.profile_step || 1}</div>
            <div className="text-sm text-gray-500">Current Step</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {userData?.profile_completed ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-500">Status</div>
          </div>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Step 1: Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <p className="text-gray-900 font-medium">{userData?.full_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Date of Birth</label>
            <p className="text-gray-900 font-medium">{userData?.date_of_birth || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <p className="text-gray-900 font-medium capitalize">{userData?.gender || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Father's Name</label>
            <p className="text-gray-900 font-medium">{userData?.father_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Mother's Name</label>
            <p className="text-gray-900 font-medium">{userData?.mother_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Category</label>
            <p className="text-gray-900 font-medium uppercase">{userData?.category || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Step 2: Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Step 2: Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900 font-medium">{user?.email || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="text-gray-900 font-medium">{userData?.phone || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Alternate Phone</label>
            <p className="text-gray-900 font-medium">{userData?.alternate_phone || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-gray-900 font-medium">
              {[userData?.address_line1, userData?.address_line2, userData?.city, userData?.state, userData?.pincode]
                .filter(Boolean).join(', ') || 'Not provided'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">District</label>
            <p className="text-gray-900 font-medium">{userData?.district || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Step 3: Education Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Step 3: Education Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Education Level</label>
            <p className="text-gray-900 font-medium capitalize">{userData?.education_level || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Institution</label>
            <p className="text-gray-900 font-medium">{userData?.institution_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Course</label>
            <p className="text-gray-900 font-medium">{userData?.course_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Specialization</label>
            <p className="text-gray-900 font-medium">{userData?.specialization || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Year of Passing</label>
            <p className="text-gray-900 font-medium">{userData?.year_of_passing || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Percentage/CGPA</label>
            <p className="text-gray-900 font-medium">
              {userData?.percentage ? `${userData.percentage}%` : userData?.cgpa ? `${userData.cgpa} CGPA` : 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Step 4: Bank Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Step 4: Bank Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Bank Name</label>
            <p className="text-gray-900 font-medium">{userData?.bank_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
            <p className="text-gray-900 font-medium">{userData?.account_holder_name || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Account Number</label>
            <p className="text-gray-900 font-medium">
              {userData?.account_number ? `****${userData.account_number.slice(-4)}` : 'Not provided'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">IFSC Code</label>
            <p className="text-gray-900 font-medium">{userData?.ifsc_code || 'Not provided'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Branch Name</label>
            <p className="text-gray-900 font-medium">{userData?.branch_name || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Step 5: Skills & Languages */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Step 5: Skills & Languages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
            <div className="space-y-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-500 capitalize">{skill.proficiency}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
            <div className="space-y-2">
              {userData?.languages && Array.isArray(userData.languages) && userData.languages.length > 0 ? (
                userData.languages.map((lang: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-900">{lang.name}</span>
                    <span className="text-sm text-gray-500 capitalize">{lang.proficiency}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No languages added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Links */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">LinkedIn Profile</label>
            <p className="text-gray-900 font-medium break-all">
              {userData?.linkedin ? (
                <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {userData.linkedin}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">GitHub Profile</label>
            <p className="text-gray-900 font-medium break-all">
              {userData?.github ? (
                <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {userData.github}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-600">Portfolio Website</label>
            <p className="text-gray-900 font-medium break-all">
              {userData?.portfolio ? (
                <a href={userData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {userData.portfolio}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Document Verification Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Verification Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-orange-600" />
              <div>
                <h4 className="font-medium text-gray-900">Aadhaar e-KYC</h4>
                <p className={`text-sm ${userData?.aadhaar_verified ? 'text-green-600' : 'text-gray-500'}`}>
                  {userData?.aadhaar_verified ? 'Verified' : 'Not verified'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">DigiLocker</h4>
                <p className={`text-sm ${userData?.digilocker_verified ? 'text-green-600' : 'text-gray-500'}`}>
                  {userData?.digilocker_verified ? 'Connected & Verified' : 'Not connected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!userData?.profile_completed && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Complete Your Profile</h3>
            <p className="text-orange-700 mb-4">
              You're currently on step {userData?.profile_step || 1} of 6. Complete all steps to unlock all features.
            </p>
            <button
              onClick={() => setActiveTab('profile-steps')}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Profile Setup
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="text-red-100">Track your internship applications and their status</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status</h2>
        
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.company_name}</h3>
                    <p className="text-sm text-gray-600">{app.position}</p>
                    <p className="text-xs text-gray-500">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-4">Start applying for internships to see your applications here.</p>
            <button 
              onClick={() => setActiveTab('internships')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Internships
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-teal-100">Stay updated with important announcements</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Notifications</h2>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No New Notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings & Help</h1>
            <p className="text-gray-100">Manage your account preferences and get support</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Profile Visibility</p>
                <p className="text-sm text-gray-500">Make profile visible to recruiters</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-sm text-gray-500">Frequently asked questions</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-500">Get help from our team</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Download Data</p>
                  <p className="text-sm text-gray-500">Export your information</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5" />
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-red-500">Permanently delete your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )


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

  // Redirect to login if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const currentUser = user

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
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India"
                width={60}
                height={60}
                className="object-contain"
              />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900">PM Internship & Resume Verifier</h1>
                <p className="text-sm text-gray-600">MINISTRY OF CORPORATE AFFAIRS</p>
                <p className="text-xs text-gray-500">Government of India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => user ? signOut() : console.log('Mock user - no sign out')}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Full Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 bg-white border-r border-gray-200 min-h-screen fixed lg:relative z-40 shadow-xl"
            >
              <div className="h-full flex flex-col">
                {/* Student Profile Card */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {userData?.full_name || currentUser?.user_metadata?.full_name || 'Student Name'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Student ID: STU-{currentUser?.id?.slice(-6) || '123456'}</p>
                    <p className="text-xs text-gray-500 mb-3">{currentUser?.email}</p>
                    
                    {/* Profile Completion */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                        <span className="text-sm font-bold text-blue-600">{getProfileCompletion()}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProfileCompletion()}%` }}
                        ></div>
                      </div>
                      {userData?.profile_step && (
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          Step {userData.profile_step} of 6 completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* View My Profile Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setActiveTab('profile-view')}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                  >
                     View My Profile
                  </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {getMenuItems().map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      disabled={item.locked}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                          : item.locked
                          ? 'text-gray-400 cursor-not-allowed opacity-60'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeTab === item.id 
                          ? 'bg-white bg-opacity-20' 
                          : item.locked
                          ? 'bg-gray-50'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          activeTab === item.id 
                            ? 'text-white' 
                            : item.locked
                            ? 'text-gray-400'
                            : item.color || 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && !item.locked && (
                          <div className="text-xs text-white text-opacity-80">Active</div>
                        )}
                        {item.locked && (
                          <div className="text-xs text-gray-400">Locked</div>
                        )}
                      </div>
                      {item.locked && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  ))}
                </nav>
                
                {/* Quick Stats in Sidebar */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-blue-600">{documents.length}</div>
                      <div className="text-xs text-gray-500">Documents</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-green-600">{skills.length}</div>
                      <div className="text-xs text-gray-500">Skills</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'profile-view' && renderProfile()}
                {activeTab === 'profile-steps' && <MultiStepProfile />}
                {activeTab === 'documents' && <DocumentVerificationNew />}
                {activeTab === 'resume' && <ResumeBuilder />}
                {activeTab === 'skills' && <SkillsAssessment />}
                {activeTab === 'internships' && <InternshipSearch />}
                {activeTab === 'applications' && renderApplications()}
                {activeTab === 'grievance' && <GrievanceManagement />}
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
