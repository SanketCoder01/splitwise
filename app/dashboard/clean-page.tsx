'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Upload, CheckCircle, Clock, Award, Settings, LogOut, Bell, 
  Menu, X, Briefcase, MessageSquare, FileCheck, Shield, ChevronRight,
  Calendar, MapPin, Mail, Phone, Edit, Save, Plus, Trash2
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import DocumentVerification from '../../components/DocumentVerification'
import SkillsAssessment from '../../components/SkillsAssessment'
import GrievanceManagement from '../../components/GrievanceManagement'

export default function CleanDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [grievances, setGrievances] = useState<any[]>([])

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume-verifier', label: 'Resume Verifier', icon: FileCheck },
    { id: 'documents', label: 'Document Verification', icon: FileText },
    { id: 'skills', label: 'Skills Assessment', icon: Award },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'grievance', label: 'Grievance', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Fetch user data on component mount
  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchDocuments()
      fetchSkills()
      fetchGrievances()
    }
  }, [user])

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()
    
    if (data) setUserData(data)
  }

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) setDocuments(data)
  }

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user?.id)
    
    if (data) setSkills(data)
  }

  const fetchGrievances = async () => {
    const { data, error } = await supabase
      .from('grievances')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) setGrievances(data)
  }

  const handleMenuClick = (itemId: string) => {
    setActiveTab(itemId)
    setSidebarOpen(false)
  }

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <Edit className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={userData?.full_name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={userData?.phone || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={userData?.location || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="City, State, Country"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  const renderDocumentVerification = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Document Verification</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.verification_status === 'verified' 
                    ? 'bg-green-100 text-green-800'
                    : doc.verification_status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.verification_status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSkillsAssessment = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Skills Assessment</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Take New Assessment
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{skill.name}</h3>
                {skill.verified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{skill.category}</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: skill.proficiency === 'expert' ? '100%' 
                           : skill.proficiency === 'advanced' ? '75%'
                           : skill.proficiency === 'intermediate' ? '50%' : '25%'
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">{skill.proficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGrievance = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Grievance Management</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Submit Grievance</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {grievances.map((grievance) => (
            <div key={grievance.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{grievance.subject}</h3>
                  <p className="text-sm text-gray-600 mb-2">{grievance.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Category: {grievance.category}</span>
                    <span>Priority: {grievance.priority}</span>
                    <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  grievance.status === 'resolved' 
                    ? 'bg-green-100 text-green-800'
                    : grievance.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {grievance.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Make profile public</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">Allow data sharing</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Download My Data
              </button>
              <button className="w-full text-left px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInternships = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Internships</h2>
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No internships available</h3>
          <p className="text-gray-500">Check back later for new internship opportunities.</p>
        </div>
      </div>
    </div>
  )

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
                <p className="text-xs text-gray-600">Ministry of Education</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-600"
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
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-white border-r border-gray-200 min-h-screen fixed lg:relative z-30"
            >
              <div className="p-4">
                <nav className="space-y-2">
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
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userData?.full_name || user?.email}
                        </p>
                        <p className="text-xs text-gray-500">Student</p>
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
              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'resume-verifier' && <div>Resume Verifier Coming Soon</div>}
              {activeTab === 'documents' && <DocumentVerification />}
              {activeTab === 'skills' && <SkillsAssessment />}
              {activeTab === 'internships' && renderInternships()}
              {activeTab === 'grievance' && <GrievanceManagement />}
              {activeTab === 'settings' && renderSettings()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
