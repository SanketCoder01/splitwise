'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Award, Settings, LogOut, Bell, Menu, X, 
  Briefcase, MessageSquare, FileCheck, Edit, Save, Plus, Download,
  Users, Shield, BarChart3, CheckCircle, Clock, AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function GovernmentDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState<any>({})
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([])
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'document-verification', label: 'Document Verification', icon: FileCheck },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'grievances', label: 'Grievances', icon: MessageSquare },
    { id: 'internships', label: 'Internship Management', icon: Briefcase },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchStats()
      fetchPendingDocuments()
      fetchGrievances()
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

      setStats({
        totalUsers: totalUsers || 0,
        pendingDocs: pendingDocs || 0,
        openGrievances: openGrievances || 0,
        verifiedDocs: verifiedDocs || 0
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  const renderDocumentVerification = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Verification Queue</h2>
        
        <div className="space-y-4">
          {pendingDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-600">Submitted by: {doc.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">Email: {doc.profiles?.email}</p>
                  <p className="text-sm text-gray-500">Type: {doc.type}</p>
                  <p className="text-sm text-gray-500">Submitted: {new Date(doc.created_at).toLocaleString()}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    View
                  </button>
                  <button
                    onClick={() => verifyDocument(doc.id, 'verified')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => verifyDocument(doc.id, 'rejected', 'Document needs revision')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                onClick={signOut}
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
                          {userData?.full_name || user?.email}
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
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'document-verification' && renderDocumentVerification()}
              {activeTab === 'user-management' && <div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-semibold">User Management - Coming Soon</h2></div>}
              {activeTab === 'grievances' && <div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-semibold">Grievance Management - Coming Soon</h2></div>}
              {activeTab === 'internships' && <div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-semibold">Internship Management - Coming Soon</h2></div>}
              {activeTab === 'reports' && <div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-semibold">Reports - Coming Soon</h2></div>}
              {activeTab === 'settings' && <div className="bg-white border border-gray-200 rounded-lg p-6"><h2 className="text-xl font-semibold">Settings - Coming Soon</h2></div>}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
