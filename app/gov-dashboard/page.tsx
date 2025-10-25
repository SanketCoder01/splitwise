'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Award, Settings, LogOut, Bell, Menu, X, 
  Briefcase, MessageSquare, FileCheck, Edit, Save, Plus, Download,
  Users, Shield, BarChart3, CheckCircle, Clock, AlertCircle,
  Building2, Search, Filter, Eye, TrendingUp,
  Database, Zap, Globe, Lock, UserCheck, BookOpen
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import GovernmentResumeVerifier from '../../components/GovernmentResumeVerifier'
import StudentVerification from '../../components/StudentVerification'
import SmartAllocation from '../../components/SmartAllocation'
import ReportsAnalytics from '../../components/ReportsAnalytics'
import InternshipVerification from '../../components/InternshipVerification'

export default function GovernmentDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState<any>({})
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([])
  const [grievances, setGrievances] = useState<any[]>([])
  const [pendingRecruiterProfiles, setPendingRecruiterProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'recruiter-approvals', label: 'Recruiter Approvals', icon: UserCheck },
    { id: 'internship-verification', label: 'Internship Verification', icon: CheckCircle },
    { id: 'internship-management', label: 'Internship Management', icon: Briefcase },
    { id: 'posting-reviews', label: 'Posting Reviews', icon: FileCheck },
    { id: 'student-verification', label: 'Student Verification', icon: FileCheck },
    { id: 'resume-verifier', label: 'Resume Verifier AI', icon: Shield },
    { id: 'document-validation', label: 'Document Validation', icon: Award },
    { id: 'smart-allocation', label: 'Smart Allocation', icon: Users },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: AlertCircle },
    { id: 'employer-portal', label: 'Employer Portal', icon: Building2 },
    { id: 'digital-certificates', label: 'Digital Certificates', icon: Award },
    { id: 'grievance-system', label: 'Grievance System', icon: MessageSquare },
    { id: 'reports-analytics', label: 'Reports & Analytics', icon: FileText },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
  ]

  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchStats()
      fetchPendingDocuments()
      fetchGrievances()
      fetchPendingRecruiterProfiles()

      // Set up real-time subscriptions
      setupRealtimeSubscriptions()
    } else if (user === null) {
      // User is explicitly null (not authenticated)
      setLoading(false)
    }

    // Cleanup function
    return () => {
      // Cleanup subscriptions will be handled by Supabase
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (data) setUserData(data)
      if (error) console.error('Error fetching user data:', error)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      // Get pending documents
      const { count: pendingDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending')

      // Get open grievances
      const { count: openGrievances } = await supabase
        .from('grievances')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      // Get verified documents
      const { count: verifiedDocs } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'verified')

      // Get pending recruiter profiles
      let pendingRecruiters = 0
      try {
        const { count } = await supabase
          .from('recruiter_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'pending')
        pendingRecruiters = count || 0
      } catch (err) {
        console.warn('Could not fetch recruiter stats:', err)
      }

      setStats({
        totalUsers: totalUsers || 0,
        pendingDocs: pendingDocs || 0,
        openGrievances: openGrievances || 0,
        verifiedDocs: verifiedDocs || 0,
        pendingRecruiters: pendingRecruiters
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPendingDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profiles!documents_user_id_fkey (full_name, email)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setPendingDocuments(data)
    } catch (error) {
      console.error('Error fetching pending documents:', error)
    }
  }

  const fetchGrievances = async () => {
    try {
      const { data, error } = await supabase
        .from('grievances')
        .select(`
          *,
          profiles!grievances_user_id_fkey (full_name, email)
        `)
        .in('status', ['open', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setGrievances(data)
    } catch (error) {
      console.error('Error fetching grievances:', error)
    }
  }

  const fetchPendingRecruiterProfiles = async () => {
    try {
      // Try recruiter_profiles table with fallback
      let fetchError = null
      let data = null

      try {
        const result = await supabase
          .from('recruiter_profiles')
          .select('*')
          .eq('approval_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(20)

        data = result.data
        fetchError = result.error
      } catch (err) {
        console.warn('recruiter_profiles table not found, continuing in dev mode:', err)
        fetchError = null
        data = [] // Empty array for dev mode
      }

      if (data && !fetchError) {
        setPendingRecruiterProfiles(data)
      } else if (!fetchError) {
        // Dev mode - show empty list
        setPendingRecruiterProfiles([])
      }
    } catch (error) {
      console.error('Error fetching pending recruiter profiles:', error)
    }
  }

  const setupRealtimeSubscriptions = () => {
    try {
      // Subscribe to recruiter profile changes
      const recruiterProfilesSubscription = supabase
        .channel('recruiter_profiles_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'recruiter_profiles',
            filter: 'approval_status=eq.pending'
          },
          (payload) => {
            console.log('Recruiter profile change detected:', payload)
            fetchPendingRecruiterProfiles()
            fetchStats() // Update stats as well
          }
        )
        .subscribe()

      // Subscribe to internship posting changes
      const postingsSubscription = supabase
        .channel('internship_postings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'internship_postings',
            filter: 'status=eq.submitted'
          },
          (payload) => {
            console.log('Internship posting change detected:', payload)
            // The posting reviews component will handle its own updates
          }
        )
        .subscribe()

      // Subscribe to document changes
      const documentsSubscription = supabase
        .channel('documents_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'documents',
            filter: 'verification_status=eq.pending'
          },
          (payload) => {
            console.log('Document change detected:', payload)
            fetchPendingDocuments()
            fetchStats()
          }
        )
        .subscribe()

      // Subscribe to grievance changes
      const grievancesSubscription = supabase
        .channel('grievances_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'grievances'
          },
          (payload) => {
            console.log('Grievance change detected:', payload)
            fetchGrievances()
            fetchStats()
          }
        )
        .subscribe()

      console.log('Real-time subscriptions set up successfully')
    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error)
    }
  }

  const handleMenuClick = (itemId: string) => {
    setActiveTab(itemId)
    setSidebarOpen(false)
  }

  const verifyDocument = async (documentId: string, status: 'verified' | 'rejected', reason?: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          verification_status: status,
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', documentId)

      if (!error) {
        fetchPendingDocuments()
        fetchStats()
      }
    } catch (error) {
      console.error('Error verifying document:', error)
    }
  }

  const updateGrievanceStatus = async (grievanceId: string, status: string, resolution?: string) => {
    try {
      const { error } = await supabase
        .from('grievances')
        .update({
          status,
          resolution,
          assigned_to: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', grievanceId)

      if (!error) {
        fetchGrievances()
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating grievance:', error)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Recruiters</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRecruiters || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingDocs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.verifiedDocs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Grievances</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.openGrievances}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Documents */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Document Submissions</h3>
          <div className="space-y-4">
            {pendingDocuments.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.profiles?.full_name}</p>
                  <p className="text-xs text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => verifyDocument(doc.id, 'verified')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => verifyDocument(doc.id, 'rejected', 'Document unclear')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grievances */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grievances</h3>
          <div className="space-y-4">
            {grievances.slice(0, 5).map((grievance) => (
              <div key={grievance.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">{grievance.subject}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    grievance.priority === 'high' ? 'bg-red-100 text-red-800' :
                    grievance.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {grievance.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{grievance.profiles?.full_name}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateGrievanceStatus(grievance.id, 'in_progress')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => updateGrievanceStatus(grievance.id, 'resolved', 'Issue resolved')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // 1. Internship Management Module
  const renderInternshipManagement = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Internship Management</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Post New Internship</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Active Internships</h3>
            <p className="text-2xl font-bold text-blue-600">156</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Applications Received</h3>
            <p className="text-2xl font-bold text-green-600">2,847</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">Placements Made</h3>
            <p className="text-2xl font-bold text-orange-600">1,234</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Internship Postings</h3>
          {[1,2,3].map((i) => (
            <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">Software Development Intern - Ministry of IT</h4>
                <p className="text-sm text-gray-600">Duration: 6 months | Stipend: ₹25,000/month</p>
                <p className="text-xs text-gray-500">Posted: 2 days ago | Applications: 89</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">View Applications</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 2. Student Verification Module
  const renderStudentVerification = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Profile Verification</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">Pending Verification</p>
            <p className="text-xl font-bold text-yellow-600">47</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">Verified Students</p>
            <p className="text-xl font-bold text-green-600">1,892</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-800">Flagged Profiles</p>
            <p className="text-xl font-bold text-red-600">12</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Total Students</p>
            <p className="text-xl font-bold text-blue-600">1,951</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Verification Requests</h3>
          {[1,2,3,4].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">Rahul Kumar Singh</h4>
                  <p className="text-sm text-gray-600">Email: rahul.singh@student.edu</p>
                  <p className="text-sm text-gray-600">Institution: IIT Delhi</p>
                  <p className="text-sm text-gray-600">Documents: Aadhaar, Academic Records, Resume</p>
                  <p className="text-xs text-gray-500">Submitted: 1 hour ago</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Review
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Verify
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Flag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 3. Resume Verifier AI Module
  const renderResumeVerifier = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Resume Verifier</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Resumes Processed</h3>
            <p className="text-2xl font-bold text-blue-600">3,247</p>
            <p className="text-sm text-blue-700">+12% this week</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Verification Rate</h3>
            <p className="text-2xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-green-700">AI Accuracy</p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900">Fraud Detected</h3>
            <p className="text-2xl font-bold text-red-600">187</p>
            <p className="text-sm text-red-700">5.8% flagged</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">AI Verification Queue</h3>
          {[1,2,3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">Resume_Priya_Sharma.pdf</h4>
                  <p className="text-sm text-gray-600">Student: Priya Sharma | Submitted: 30 mins ago</p>
                  <div className="flex space-x-4 mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Education: Verified</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Experience: Under Review</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Skills: Verified</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">View Details</button>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Approve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 4. Document Validation Module
  const renderDocumentValidation = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Government Document Validation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">NAD Integration</p>
            <p className="text-xl font-bold text-blue-600">Active</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">DigiLocker Sync</p>
            <p className="text-xl font-bold text-green-600">Connected</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <UserCheck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-800">Aadhaar Verified</p>
            <p className="text-xl font-bold text-orange-600">1,847</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-800">Academic Records</p>
            <p className="text-xl font-bold text-purple-600">2,156</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Document Validation Results</h3>
          {[
            { name: "10th Marksheet", student: "Amit Patel", status: "verified", source: "CBSE Board" },
            { name: "12th Marksheet", student: "Sneha Gupta", status: "pending", source: "State Board" },
            { name: "Degree Certificate", student: "Rohit Kumar", status: "verified", source: "University of Delhi" },
            { name: "Aadhaar Card", student: "Kavya Singh", status: "verified", source: "UIDAI" }
          ].map((doc, i) => (
            <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{doc.name}</h4>
                <p className="text-sm text-gray-600">Student: {doc.student}</p>
                <p className="text-xs text-gray-500">Source: {doc.source}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status === 'verified' ? 'Verified' : 'Pending'}
                </span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 5. Smart Allocation Module
  const renderSmartAllocation = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-8 h-8 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Smart Allocation System</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">AI Matches Made</h3>
            <p className="text-2xl font-bold text-purple-600">1,456</p>
            <p className="text-sm text-purple-700">85% success rate</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Pending Allocations</h3>
            <p className="text-2xl font-bold text-blue-600">234</p>
            <p className="text-sm text-blue-700">Awaiting approval</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Placement Success</h3>
            <p className="text-2xl font-bold text-green-600">92.3%</p>
            <p className="text-sm text-green-700">Above target</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent AI Recommendations</h3>
          {[
            { student: "Arjun Mehta", internship: "Data Analyst - Finance Ministry", match: "96%" },
            { student: "Priya Sharma", internship: "Software Developer - IT Ministry", match: "94%" },
            { student: "Rohit Kumar", internship: "Research Assistant - DRDO", match: "91%" }
          ].map((rec, i) => (
            <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{rec.student}</h4>
                <p className="text-sm text-gray-600">{rec.internship}</p>
                <p className="text-xs text-gray-500">AI Match Score: {rec.match}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Approve</button>
                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 6. Fraud Detection Module
  const renderFraudDetection = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Fraud Detection System</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-800">High Risk Cases</p>
            <p className="text-xl font-bold text-red-600">23</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">Under Investigation</p>
            <p className="text-xl font-bold text-yellow-600">47</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">Cases Resolved</p>
            <p className="text-xl font-bold text-green-600">156</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Detection Rate</p>
            <p className="text-xl font-bold text-blue-600">97.2%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Flagged Cases</h3>
          {[
            { student: "Suspicious Profile #1", issue: "Fake degree certificate detected", risk: "High" },
            { student: "Suspicious Profile #2", issue: "Inconsistent work experience dates", risk: "Medium" },
            { student: "Suspicious Profile #3", issue: "Duplicate Aadhaar number", risk: "High" }
          ].map((case_, i) => (
            <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{case_.student}</h4>
                <p className="text-sm text-gray-600">{case_.issue}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  case_.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {case_.risk} Risk
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Investigate</button>
                <button className="px-3 py-1 bg-red-600 text-white text-sm rounded">Block</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 7. Employer Portal Module
  const renderEmployerPortal = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="w-8 h-8 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Employer Portal Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-900">Registered Employers</h3>
            <p className="text-2xl font-bold text-indigo-600">847</p>
            <p className="text-sm text-indigo-700">+15 this month</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Active Job Postings</h3>
            <p className="text-2xl font-bold text-green-600">234</p>
            <p className="text-sm text-green-700">Across ministries</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">Verified Resumes Accessed</h3>
            <p className="text-2xl font-bold text-orange-600">3,456</p>
            <p className="text-sm text-orange-700">This quarter</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Employer Activities</h3>
          {[
            { employer: "Ministry of External Affairs", activity: "Posted new internship: Foreign Policy Research", time: "2 hours ago" },
            { employer: "DRDO", activity: "Accessed 15 verified resumes", time: "4 hours ago" },
            { employer: "Ministry of Finance", activity: "Updated job requirements", time: "1 day ago" }
          ].map((activity, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{activity.employer}</h4>
                  <p className="text-sm text-gray-600">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 8. Digital Certificates Module
  const renderDigitalCertificates = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-8 h-8 text-gold-600" />
          <h2 className="text-xl font-semibold text-gray-900">Digital Certificate Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Certificates Issued</p>
            <p className="text-xl font-bold text-blue-600">2,847</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">DigiLocker Synced</p>
            <p className="text-xl font-bold text-green-600">2,756</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-800">Blockchain Secured</p>
            <p className="text-xl font-bold text-purple-600">100%</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-800">Verifications</p>
            <p className="text-xl font-bold text-orange-600">5,234</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Certificate Issuances</h3>
          {[
            { student: "Rahul Sharma", certificate: "PM Internship Completion - Ministry of IT", date: "Today" },
            { student: "Priya Gupta", certificate: "Skills Verification - Data Science", date: "Yesterday" },
            { student: "Amit Kumar", certificate: "Government Internship - Finance Ministry", date: "2 days ago" }
          ].map((cert, i) => (
            <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{cert.student}</h4>
                <p className="text-sm text-gray-600">{cert.certificate}</p>
                <p className="text-xs text-gray-500">Issued: {cert.date}</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">View Certificate</button>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Verify</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 9. Grievance System Module
  const renderGrievanceSystem = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Grievance Management System</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-800">Open Grievances</p>
            <p className="text-xl font-bold text-red-600">34</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">In Progress</p>
            <p className="text-xl font-bold text-yellow-600">67</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">Resolved</p>
            <p className="text-xl font-bold text-green-600">456</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Resolution Rate</p>
            <p className="text-xl font-bold text-blue-600">89.2%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Grievances</h3>
          {grievances.slice(0, 5).map((grievance) => (
            <div key={grievance.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{grievance.subject}</h4>
                  <p className="text-sm text-gray-600">From: {grievance.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">Category: {grievance.category}</p>
                  <p className="text-xs text-gray-500">Submitted: {new Date(grievance.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    grievance.priority === 'high' ? 'bg-red-100 text-red-800' :
                    grievance.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {grievance.priority}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Assign</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 10. Reports & Analytics Module
  const renderReportsAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-8 h-8 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics Dashboard</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800">Application Growth</p>
            <p className="text-xl font-bold text-blue-600">+23.5%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">Success Rate</p>
            <p className="text-xl font-bold text-green-600">87.3%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-800">Active Users</p>
            <p className="text-xl font-bold text-purple-600">12,847</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-800">Certificates Issued</p>
            <p className="text-xl font-bold text-orange-600">3,456</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Monthly Application Trends</h3>
            <div className="h-48 bg-white rounded border flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder - Application Trends</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Ministry-wise Distribution</h3>
            <div className="h-48 bg-white rounded border flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder - Ministry Distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 2. Recruiter Approvals Module
  const renderRecruiterApprovals = () => {
    const [selectedProfile, setSelectedProfile] = useState<any>(null)

    const reviewRecruiterProfile = async (profileId: string, status: 'approved' | 'rejected', feedback?: string) => {
      try {
        const updateData: any = {
          approval_status: status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        }

        if (status === 'approved') {
          updateData.approved_at = new Date().toISOString()
        } else {
          updateData.rejection_reason = feedback
        }

        // Try recruiter_profiles table with fallback
        let updateError = null

        try {
          const { error } = await supabase
            .from('recruiter_profiles')
            .update(updateData)
            .eq('id', profileId)

          updateError = error
        } catch (err) {
          console.warn('recruiter_profiles table not found, continuing in dev mode:', err)
          updateError = null // Don't throw error in dev mode
        }

        if (!updateError) {
          fetchPendingRecruiterProfiles()
          fetchStats()
          setSelectedProfile(null)
          toast.success(`Recruiter profile ${status} successfully!`)
        } else {
          console.error('Error reviewing recruiter profile:', updateError)
          toast.error('Failed to update profile status')
        }
      } catch (error) {
        console.error('Error reviewing recruiter profile:', error)
        toast.error('Failed to update profile status')
      }
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <UserCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recruiter Profile Approvals</h2>
              <p className="text-gray-600">Review and approve recruiter applications for internship posting access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">Pending Review</p>
              <p className="text-xl font-bold text-yellow-600">{pendingRecruiterProfiles.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">Approved Today</p>
              <p className="text-xl font-bold text-green-600">5</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-800">Rejected</p>
              <p className="text-xl font-bold text-red-600">2</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">Approval Rate</p>
              <p className="text-xl font-bold text-blue-600">71%</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Pending Approvals</h3>
            {pendingRecruiterProfiles.length > 0 ? (
              pendingRecruiterProfiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{profile.full_name || 'Name not provided'}</h4>
                      <p className="text-sm text-gray-600">
                        {profile.company_name || 'Company not provided'} • {profile.email || 'Email not provided'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Applied: {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Profile completed on: {new Date(profile.updated_at || profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending recruiter approvals at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {selectedProfile && (
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
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Review Recruiter Profile</h3>
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Profile Details</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <p className="text-gray-900">{selectedProfile.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Company Name</label>
                          <p className="text-gray-900">{selectedProfile.company_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{selectedProfile.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-gray-900">{selectedProfile.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Designation</label>
                          <p className="text-gray-900">{selectedProfile.designation || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Internship Preferences</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Internship Types</label>
                          <p className="text-gray-900">{selectedProfile.internship_types?.join(', ') || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Preferred Skills</label>
                          <p className="text-gray-900">{selectedProfile.preferred_skills || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Duration Range</label>
                          <p className="text-gray-900">
                            {selectedProfile.min_duration}-{selectedProfile.max_duration} months
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Stipend Range</label>
                          <p className="text-gray-900">{selectedProfile.stipend_range || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Review Decision</h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => reviewRecruiterProfile(selectedProfile.id, 'approved')}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Recruiter</span>
                      </button>
                      <button
                        onClick={() => reviewRecruiterProfile(selectedProfile.id, 'rejected', 'Profile does not meet government standards')}
                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 4. Posting Reviews Module
  const renderPostingReviews = () => {
    const [pendingPostings, setPendingPostings] = useState<any[]>([])
    const [selectedPosting, setSelectedPosting] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetchPendingPostings()
    }, [])

    const fetchPendingPostings = async () => {
      try {
        // Try internship_postings table with fallback
        let fetchError = null
        let data = null

        try {
          const result = await supabase
            .from('internship_postings')
            .select(`
              *,
              recruiter_profiles!internship_postings_recruiter_id_fkey (
                company_name,
                full_name,
                email
              )
            `)
            .eq('status', 'submitted')
            .order('submitted_at', { ascending: false })

          data = result.data
          fetchError = result.error
        } catch (err) {
          console.warn('internship_postings table not found, continuing in dev mode:', err)
          fetchError = null
          data = [] // Empty array for dev mode
        }

        if (data && !fetchError) {
          setPendingPostings(data)
        } else if (!fetchError) {
          // Dev mode - show empty list
          setPendingPostings([])
        }
      } catch (error) {
        console.error('Error fetching pending postings:', error)
      } finally {
        setLoading(false)
      }
    }

    const reviewPosting = async (postingId: string, status: 'approved' | 'rejected', feedback?: string) => {
      try {
        const updateData: any = {
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        }

        if (status === 'approved') {
          updateData.published_at = new Date().toISOString()
        } else {
          updateData.rejection_reason = feedback
        }

        // Try internship_postings table with fallback
        let updateError = null

        try {
          const { error } = await supabase
            .from('internship_postings')
            .update(updateData)
            .eq('id', postingId)

          updateError = error
        } catch (err) {
          console.warn('internship_postings table not found, continuing in dev mode:', err)
          updateError = null // Don't throw error in dev mode
        }

        if (!updateError) {
          fetchPendingPostings()
          setSelectedPosting(null)
          toast.success(`Posting ${status} successfully!`)
        } else {
          console.error('Error reviewing posting:', updateError)
          toast.error('Failed to update posting status')
        }
      } catch (error) {
        console.error('Error reviewing posting:', error)
        toast.error('Failed to update posting status')
      }
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FileCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Internship Posting Reviews</h2>
              <p className="text-gray-600">Review and approve recruiter internship postings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800">Pending Review</p>
              <p className="text-xl font-bold text-yellow-600">{pendingPostings.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800">Approved Today</p>
              <p className="text-xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-800">Rejected</p>
              <p className="text-xl font-bold text-red-600">3</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">Approval Rate</p>
              <p className="text-xl font-bold text-blue-600">87%</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Pending Reviews</h3>
            {pendingPostings.length > 0 ? (
              pendingPostings.map((posting) => (
                <div key={posting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{posting.title}</h4>
                      <p className="text-sm text-gray-600">
                        {posting.recruiter_profiles?.company_name || 'Unknown Company'} • {posting.department}
                      </p>
                      <p className="text-sm text-gray-600">
                        {posting.location} • {posting.duration} • {posting.stipend}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(posting.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPosting(posting)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending reviews at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {selectedPosting && (
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
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Review Internship Posting</h3>
                    <button
                      onClick={() => setSelectedPosting(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Posting Details</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Title</label>
                          <p className="text-gray-900">{selectedPosting.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Company</label>
                          <p className="text-gray-900">{selectedPosting.recruiter_profiles?.company_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Department</label>
                          <p className="text-gray-900">{selectedPosting.department}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Location</label>
                          <p className="text-gray-900">{selectedPosting.location}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Duration & Stipend</label>
                          <p className="text-gray-900">{selectedPosting.duration} • {selectedPosting.stipend}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedPosting.description}</p>

                      {selectedPosting.required_skills && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700">Required Skills</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedPosting.required_skills.map((skill: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-4">Review Decision</h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => reviewPosting(selectedPosting.id, 'approved')}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Posting</span>
                      </button>
                      <button
                        onClick={() => reviewPosting(selectedPosting.id, 'rejected', 'Posting does not meet government standards')}
                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span>Reject Posting</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 11. System Settings Module
  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-8 h-8 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">System Settings & Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">System Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded">
                <span>AI Verification Threshold</span>
                <span className="text-blue-600">85%</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Auto-approval for High Scores</span>
                <span className="text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Fraud Detection Sensitivity</span>
                <span className="text-orange-600">High</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>DigiLocker Integration</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Database Status</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>API Response Time</span>
                <span className="text-blue-600">245ms</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Storage Usage</span>
                <span className="text-yellow-600">67%</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span>Last Backup</span>
                <span className="text-green-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Export Reports
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              System Backup
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
              Clear Cache
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              View Logs
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

  // For testing purposes, create a mock user if no user is authenticated
  const mockUser = {
    id: 'test-gov-id',
    email: 'test@gov.in',
    user_metadata: {
      full_name: 'Government Official'
    }
  }

  const currentUser = user || mockUser

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">PM Internship & Resume Verifier</h1>
                <p className="text-xs text-gray-600">Ministry of Education - Government Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
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
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-white border-r border-gray-200 min-h-screen fixed lg:relative z-30"
            >
              <div className="p-4 h-full flex flex-col">
                <nav className="space-y-2 flex-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Profile at bottom */}
                <div className="mt-auto">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userData?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email}
                        </p>
                        <p className="text-xs text-gray-500">Government Official</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderOverview()}
              {activeTab === 'recruiter-approvals' && renderRecruiterApprovals()}
              {activeTab === 'internship-management' && renderInternshipManagement()}
              {activeTab === 'posting-reviews' && renderPostingReviews()}
              {activeTab === 'student-verification' && renderStudentVerification()}
              {activeTab === 'resume-verifier' && <GovernmentResumeVerifier />}
              {activeTab === 'document-validation' && renderDocumentValidation()}
              {activeTab === 'smart-allocation' && renderSmartAllocation()}
              {activeTab === 'fraud-detection' && renderFraudDetection()}
              {activeTab === 'employer-portal' && renderEmployerPortal()}
              {activeTab === 'digital-certificates' && renderDigitalCertificates()}
              {activeTab === 'grievance-system' && renderGrievanceSystem()}
              {activeTab === 'reports-analytics' && renderReportsAnalytics()}
              {activeTab === 'system-settings' && renderSystemSettings()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
