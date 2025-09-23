'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Award, Settings, LogOut, Bell, Menu, X, 
  Briefcase, MessageSquare, FileCheck, Edit, Save, Plus, Download,
  Home, Upload, CheckCircle, Clock, Star, HelpCircle, Shield,
  Phone, Mail, MapPin, Calendar, BookOpen, Zap, Target, TrendingUp,
  Lock, Unlock, ChevronRight, ExternalLink, AlertCircle, Info,
  Users, Building, Globe, Newspaper, PlayCircle, ArrowRight,
  CheckSquare, DollarSign, GraduationCap, Heart, Search, Filter
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
// import { useAuth } from '../../contexts/AuthContext' // COMMENTED OUT FOR BYPASS
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
  created_at: string
  posted_by?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  created_at: string
  read: boolean
}

interface Update {
  id: string
  title: string
  content: string
  image?: string
  date: string
  category: string
}

export default function StudentDashboard() {
  // const { user, signOut } = useAuth() // COMMENTED OUT FOR BYPASS
  const user = { id: 'bypass-user', email: 'student@bypass.dev' } // MOCK USER FOR BYPASS
  const signOut = () => console.log('Sign out bypassed')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showProfileSteps, setShowProfileSteps] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // New state for enhanced dashboard
  const [internships, setInternships] = useState<Internship[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [realtimeSubscription, setRealtimeSubscription] = useState<any>(null)

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
    // BYPASS: Always load data without authentication check
    fetchAllData()
    // setupRealtimeSubscriptions() // COMMENTED OUT TO AVOID SUPABASE ERRORS
    
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

    // Cleanup subscriptions on unmount
    return () => {
      if (realtimeSubscription) {
        realtimeSubscription.unsubscribe()
      }
    }
  }, []) // REMOVED USER DEPENDENCY

  // Auto-slide updates every 5 seconds
  useEffect(() => {
    if (updates.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % updates.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [updates.length])

  const fetchAllData = async () => {
    try {
      // BYPASS: Use mock data instead of Supabase
      console.log('🚀 BYPASS MODE: Using mock data instead of Supabase')
      
      // Set mock user data
      setUserData({
        id: 'bypass-user',
        email: 'student@bypass.dev',
        full_name: 'Development Student',
        phone: '+91 9876543210',
        location: 'New Delhi, India',
        linkedin: 'https://linkedin.com/in/dev-student',
        github: 'https://github.com/dev-student',
        profile_completed: true,
        profile_step: 6,
        aadhaar_verified: true,
        digilocker_verified: true,
        document_verifications: [{
          aadhaar_verified: true,
          digilocker_verified: true,
          overall_verification_status: 'verified'
        }]
      })
      
      // Set mock documents
      setDocuments([
        {
          id: '1',
          name: 'Aadhaar Card',
          verification_status: 'verified',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Educational Certificate',
          verification_status: 'verified',
          created_at: new Date().toISOString()
        }
      ])
      
      // Set mock skills
      setSkills([
        { id: '1', name: 'JavaScript', category: 'technical', proficiency: 'advanced' },
        { id: '2', name: 'React', category: 'technical', proficiency: 'intermediate' },
        { id: '3', name: 'Communication', category: 'soft', proficiency: 'expert' }
      ])
      
      // Set mock applications
      setApplications([
        {
          id: '1',
          internship_title: 'Software Development Intern',
          company: 'Tech Corp',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      
      // Set mock notifications
      setNotifications([
        {
          id: '1',
          title: 'Welcome to PM Internship Portal',
          message: 'Your profile has been successfully created!',
          type: 'success',
          created_at: new Date().toISOString(),
          read: false
        }
      ])
      
      // Set mock internships
      setInternships([
        {
          id: '1',
          title: 'Software Development Intern',
          company: 'National Informatics Centre',
          ministry: 'Ministry of Electronics & IT',
          location: 'New Delhi',
          type: 'hybrid',
          duration: '6 months',
          stipend: '₹35,000/month',
          description: 'Work on government digital initiatives',
          requirements: ['Computer Science background', 'Programming skills'],
          skills: ['JavaScript', 'React', 'Node.js'],
          applications: 45,
          maxApplications: 100,
          deadline: '2024-12-31',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Data Analyst Intern',
          company: 'Ministry of Education',
          ministry: 'Ministry of Education',
          location: 'Mumbai',
          type: 'remote',
          duration: '4 months',
          stipend: '₹30,000/month',
          description: 'Analyze educational data and trends',
          requirements: ['Statistics background', 'Data analysis skills'],
          skills: ['Python', 'SQL', 'Excel'],
          applications: 32,
          maxApplications: 50,
          deadline: '2024-11-30',
          created_at: new Date().toISOString()
        }
      ])
      
      // Set mock updates (already handled in fetchUpdates)
      fetchUpdates()
      
    } catch (error) {
      console.error('Error in bypass mode:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new internships
    const internshipSubscription = supabase
      .channel('internships')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'internships' },
        (payload) => {
          console.log('New internship posted:', payload.new)
          setInternships(prev => [payload.new as Internship, ...prev])
          
          // Show notification popup for new internship
          toast.success('🎉 New internship opportunity posted!', {
            duration: 5000,
            position: 'top-right'
          })
          
          // Add to notifications
          const newNotification: Notification = {
            id: `internship-${payload.new.id}`,
            title: 'New Internship Posted',
            message: `${payload.new.title} at ${payload.new.company}`,
            type: 'info',
            created_at: new Date().toISOString(),
            read: false
          }
          setNotifications(prev => [newNotification, ...prev])
          setUnreadNotifications(prev => prev + 1)
        }
      )
      .subscribe()

    // Subscribe to notifications
    const notificationSubscription = supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          console.log('New notification:', payload.new)
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadNotifications(prev => prev + 1)
          setShowNotificationPopup(true)
        }
      )
      .subscribe()

    setRealtimeSubscription({ internshipSubscription, notificationSubscription })
  }

  const fetchInternships = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchInternships - using mock data')
  }

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('date', { ascending: false })
        .limit(5)

      if (error) {
        // If table doesn't exist, use mock data
        const mockUpdates: Update[] = [
          {
            id: '1',
            title: 'PM Internship Program 2024 Launch',
            content: 'The Prime Minister has launched the new internship program with enhanced benefits and opportunities.',
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
            date: new Date().toISOString(),
            category: 'Announcement'
          },
          {
            id: '2',
            title: 'Digital India Initiative Expansion',
            content: 'New internship opportunities in AI, Machine Learning, and Digital Governance.',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
            date: new Date(Date.now() - 86400000).toISOString(),
            category: 'Technology'
          },
          {
            id: '3',
            title: 'Skill Development Programs',
            content: 'Enhanced skill development programs for students across various domains.',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
            date: new Date(Date.now() - 172800000).toISOString(),
            category: 'Education'
          }
        ]
        setUpdates(mockUpdates)
      } else {
        setUpdates(data || [])
      }
    } catch (error) {
      console.error('Error fetching updates:', error)
    }
  }

  const fetchUserData = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchUserData - using mock data')
  }

  const fetchDocuments = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchDocuments - using mock data')
  }

  const fetchSkills = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchSkills - using mock data')
  }

  const fetchApplications = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchApplications - using mock data')
  }

  const fetchNotifications = async () => {
    // BYPASS: Skip Supabase call, mock data is set in fetchAllData
    console.log('🚀 BYPASS: Skipping fetchNotifications - using mock data')
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
    
    // Redirect to schemes page for better experience
    if (itemId === 'internships') {
      window.location.href = '/schemes'
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
      <div className="space-y-8">
        {/* Government Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 rounded-lg p-1">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    PM Internship Portal
                  </h1>
                  <p className="text-lg text-gray-700 mb-1">
                    Welcome, {userData?.full_name || user?.email?.split('@')[0] || 'Student'}
                  </p>
                  <p className="text-sm text-gray-600">
                    🇮🇳 Empowering India's Youth Through Skill Development
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">{profileCompletion}%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
                <div className="text-xs text-green-600 mt-1">
                  {profileCompletion === 100 ? '✅ Ready for Internships' : '⏳ Complete to unlock features'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Updates Banner */}
        {updates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 flex items-center space-x-2">
              <Newspaper className="w-5 h-5" />
              <span className="font-semibold">Latest Updates</span>
            </div>
            <div className="relative h-32 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-4 flex items-center space-x-4"
                >
                  {updates[currentSlide]?.image && (
                    <Image
                      src={updates[currentSlide].image}
                      alt={updates[currentSlide].title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {updates[currentSlide]?.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {updates[currentSlide]?.content}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {updates[currentSlide]?.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(updates[currentSlide]?.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Slide indicators */}
              <div className="absolute bottom-2 right-4 flex space-x-1">
                {updates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Government Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Status</p>
                <p className="text-3xl font-bold text-blue-600">{profileCompletion}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {profileCompletion === 100 ? 'Complete' : 'In Progress'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-3xl font-bold text-green-600">{verificationStatus.verified}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {verificationStatus.verified}/{verificationStatus.total} Verified
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 border-l-4 border-orange-500 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Internships</p>
                <p className="text-3xl font-bold text-orange-600">{internships.length}</p>
                <p className="text-xs text-gray-500 mt-1">Available Now</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 border-l-4 border-red-500 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-3xl font-bold text-red-600">{unreadNotifications}</p>
                <p className="text-xs text-gray-500 mt-1">Unread Messages</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Bell className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-time Internships Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-6 h-6" />
                <h2 className="text-xl font-bold">Latest Internship Opportunities</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Updates</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {internships.length > 0 ? (
              <div className="space-y-4">
                {internships.slice(0, 3).map((internship) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{internship.title}</h3>
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
                            <DollarSign className="w-4 h-4" />
                            <span>{internship.stipend}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {internship.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          Posted {new Date(internship.created_at).toLocaleDateString()}
                        </span>
                        <Link 
                          href="/internships"
                          className="block mt-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="text-center pt-4">
                  <Link 
                    href="/internships"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span>View All Internships</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Internships Available</h3>
                <p className="text-gray-600 mb-4">New opportunities will appear here in real-time</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>Waiting for new postings...</span>
                </div>
              </div>
            )}
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

        {/* Removed: Government Information Sections (Internship Schemes, Roadmap, Eligibility, Support) */}

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
              onClick={() => window.location.href = '/schemes'}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {userData?.profile_image ? (
                <img 
                  src={userData.profile_image} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white border-opacity-30"
                />
              ) : (
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-30">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                {userData?.profile_completed ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Clock className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {userData?.full_name || 'Complete Your Profile'}
              </h1>
              <p className="text-green-100 text-lg">
                Student ID: PMI-{userData?.id?.slice(-6)?.toUpperCase() || 'XXXXXX'}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {userData?.profile_completed ? '✅ Profile Complete' : '⏳ In Progress'}
                </span>
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Step {userData?.profile_step || 1} of 6
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-white mb-1">
              {getProfileCompletion()}%
            </div>
            <p className="text-green-100 text-sm">Complete</p>
            {userData?.profile_completed && (
              <div className="mt-2">
                <Link
                  href="/resume-verifier"
                  className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Verify Resume</span>
                </Link>
              </div>
            )}
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
                <p className="text-sm text-gray-600">MINISTRY OF EDUCATION</p>
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
                      {userData?.full_name || 'Development Student'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Student ID: STU-{user?.id?.slice(-6) || '123456'}</p>
                    <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
                    
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
      
      {/* Notification Popup */}
      <AnimatePresence>
        {showNotificationPopup && (
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
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">New Notification</h3>
                </div>
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      {notifications[0]?.title}
                    </h4>
                    <p className="text-sm text-blue-800">
                      {notifications[0]?.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-blue-600">
                        {new Date(notifications[0]?.created_at).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notifications[0]?.type === 'success' ? 'bg-green-100 text-green-800' :
                        notifications[0]?.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        notifications[0]?.type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notifications[0]?.type}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowNotificationPopup(false)
                    setActiveTab('notifications')
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
