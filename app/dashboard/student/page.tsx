'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell,
  Settings,
  LogOut,
  Shield,
  FileText,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Download,
  ExternalLink,
  HelpCircle,
  BookOpen,
  Users,
  Video,
  Send,
  Home,
  CreditCard,
  Folder
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import GovernmentHeader from '../../../components/shared/GovernmentHeader'
import ApplicationsPage from '../../../components/dashboard/ApplicationsPage'
import ChangePasswordPage from '../../../components/dashboard/ChangePasswordPage'
import DashboardPage from '../../../components/dashboard/DashboardPage'
import DocumentVerificationPage from '../../../components/dashboard/DocumentVerificationPage'
import InternshipOpportunitiesPage from '../../../components/dashboard/InternshipOpportunitiesPage'
import MyCurrentStatusPage from '../../../components/dashboard/MyCurrentStatusPage'
import MyInternshipPage from '../../../components/dashboard/MyInternshipPage'
import NewsEventsPage from '../../../components/dashboard/NewsEventsPage'
import ProfileManagementPage from '../../../components/dashboard/ProfileManagementPage'
import ReferFriendPage from '../../../components/dashboard/ReferFriendPage'
import SettingsPage from '../../../components/dashboard/SettingsPage'

interface NotificationItem {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: 'action' | 'info' | 'warning'
  isNew: boolean
}

interface GrievanceStatus {
  pending: number
  disposed: number
  clarificationAsked: number
  documentsAsked: number
}

export default function PMInternshipPortal() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()

  // Mock data
  const grievanceStatus: GrievanceStatus = {
    pending: 0,
    disposed: 0,
    clarificationAsked: 0,
    documentsAsked: 0
  }

  const navigationTabs = [
    { id: 'internship', label: 'Internship', icon: Building },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
    { id: 'partner-companies', label: 'Partner Companies', icon: Users },
    { id: 'manuals', label: 'Manuals', icon: FileText },
    { id: 'tutorials', label: 'Tutorials/Guidance Videos', icon: Video },
    { id: 'apply-internship', label: 'Apply Internship', icon: Send },
    { id: 'my-shared-portal', label: 'My Shared Portal', icon: ExternalLink }
  ]

  // Check profile completion status
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profile) {
            setUserProfile(profile)
            // Check if profile is complete (all required fields filled)
            const isComplete = profile.full_name && 
                             profile.phone && 
                             profile.education_level && 
                             profile.skills && 
                             profile.profile_completion >= 85
            setProfileCompleted(isComplete)
            
            if (isComplete) {
              setActiveTab('dashboard')
            }
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }
    
    checkProfileCompletion()
  }, [])

  const handleTabClick = (tabId: string) => {
    if (!profileCompleted && tabId !== 'profile') {
      toast.error('Please complete your profile first to access other features')
      return
    }
    setActiveTab(tabId)
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const statusTabs = [
    { id: 'my-current-status', label: 'My Current Status', active: true },
    { id: 'internship-opportunities', label: 'Internship Opportunities', active: false },
    { id: 'my-internship', label: 'My Internship', active: false },
    { id: 'news-events', label: 'News & Events', active: false },
    { id: 'refer-friend', label: 'Refer A Friend', active: false, isNew: true }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GovernmentHeader showNavigation={true} showUserActions={true} />

      <div className="w-full px-0 py-6">
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Left Sidebar - Navigation Menu */}
          <div className="lg:col-span-3 bg-gray-50 min-h-screen">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white h-full shadow-lg border-r border-gray-200"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-orange-600" />
                  Student Portal
                </h3>
                <p className="text-sm text-gray-600 mt-1">Navigate through your dashboard</p>
              </div>
              
              <div className="p-4">
                <nav className="space-y-2">
                  {/* A-Z Organized Menu Items */}
                  
                  {/* A */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabClick('applications')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'applications'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : !profileCompleted 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Applications
                    {!profileCompleted && <Lock className="w-4 h-4 ml-auto" />}
                  </motion.button>

                  {/* D */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTabClick('dashboard')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'dashboard'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : !profileCompleted 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                    {!profileCompleted && <Lock className="w-4 h-4 ml-auto" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('document-verification')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'document-verification'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Document Verification
                  </motion.button>

                  {/* I */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/schemes'}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
                  >
                    <Building className="w-5 h-5 mr-3" />
                    Find Internships
                  </motion.button>

                  {/* M */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('my-current-status')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'my-current-status'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    My Current Status
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('my-internship')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'my-internship'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Award className="w-5 h-5 mr-3" />
                    My Internship
                  </motion.button>

                  {/* N */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('news-events')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'news-events'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    News & Events
                  </motion.button>

                  {/* P */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile Management
                  </motion.button>

                  {/* R */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('refer-friend')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${
                      activeTab === 'refer-friend'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Refer A Friend
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                    >
                      NEW
                    </motion.span>
                  </motion.button>

                  {/* S */}
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === 'settings'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md'
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </motion.button>
                </nav>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 bg-gray-50 px-4">
            {/* Render content based on active tab */}
            {activeTab === 'applications' && <ApplicationsPage />}
            {activeTab === 'change-password' && <ChangePasswordPage />}
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'document-verification' && <DocumentVerificationPage />}
            {activeTab === 'internship-opportunities' && <InternshipOpportunitiesPage />}
            {activeTab === 'my-current-status' && <MyCurrentStatusPage />}
            {activeTab === 'my-internship' && <MyInternshipPage />}
            {activeTab === 'news-events' && <NewsEventsPage />}
            {activeTab === 'profile' && (
              <ProfileManagementPage 
                onProfileComplete={() => {
                  setProfileCompleted(true)
                  setActiveTab('dashboard')
                  toast.success('Profile completed successfully! All features are now unlocked.')
                }}
              />
            )}
            {activeTab === 'refer-friend' && <ReferFriendPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </div>

          {/* Right Sidebar - Profile Section */}
          <div className="lg:col-span-3 bg-gray-50 min-h-screen px-4">
            <div className="space-y-6 py-6">
              {/* Candidate Profile */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {userProfile?.profile_image ? (
                      <img 
                        src={userProfile.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {userProfile?.full_name || 'Complete Profile'}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    ID: PMI-{userProfile?.id?.slice(-6)?.toUpperCase() || 'XXXXXX'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {userProfile?.email || 'No email'}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Link 
                    href="/profile/view" 
                    className="flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">View Profile / CV</span>
                  </Link>
                  <button 
                    onClick={() => setActiveTab('change-password')}
                    className="w-full flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Change Password</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* File a Grievance */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  File a Grievance
                </h3>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  New Grievance
                </button>
              </div>

              {/* Grievance Status */}
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Grievance Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {grievanceStatus.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disposed</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {grievanceStatus.disposed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Clarification Asked</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      {grievanceStatus.clarificationAsked}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Document(s) Asked</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {grievanceStatus.documentsAsked}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
