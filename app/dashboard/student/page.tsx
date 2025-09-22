'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell,
  Settings,
  LogOut,
  Shield,
  FileText,
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
  const [activeTab, setActiveTab] = useState('my-current-status')
  const [showNotifications, setShowNotifications] = useState(true)

  // Mock data
  const grievanceStatus: GrievanceStatus = {
    pending: 0,
    disposed: 0,
    clarificationAsked: 0,
    documentsAsked: 0
  }

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Action Required - How to Join after Accepting Your PM Inter...',
      description: 'How to Join after you have accepted your offer letter. 1...',
      date: 'June 2, 2025',
      time: '14:42',
      type: 'action',
      isNew: true
    },
    {
      id: '2', 
      title: 'Action Required - How to Accept Your PM Internship Offer',
      description: 'Dear Candidates, To accept your internship offer, please fol...',
      date: 'June 2, 2025',
      time: '14:42',
      type: 'action',
      isNew: true
    },
    {
      id: '3',
      title: 'Now check the status of your Aadhaar-seeded bank account dir...',
      description: '',
      date: '',
      time: '',
      type: 'info',
      isNew: false
    }
  ]

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
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4">
          {/* Top Header */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 w-full">
            <div className="flex items-center space-x-6 flex-1">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-gray-800">MINISTRY OF CORPORATE AFFAIRS</h1>
                  <p className="text-xs text-gray-600">INTERNSHIP</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">School</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-8 py-3 overflow-x-auto w-full">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg whitespace-nowrap transition-colors"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Candidate Profile */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">Candidate ID</h3>
                  <p className="text-sm text-gray-600">Yes</p>
                </div>
                
                <div className="space-y-3">
                  <Link href="#" className="flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">View Profile / CV</span>
                  </Link>
                  <Link href="#" className="flex items-center space-x-3 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Change Password</span>
                  </Link>
                  <Link href="#" className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </Link>
                </div>
              </div>

              {/* File a Grievance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  File a Grievance
                </h3>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  New Grievance
                </button>
              </div>

              {/* Grievance Status */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
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

          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Status Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="flex border-b">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors relative ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                    {tab.isNew && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Aadhaar based e-KYC</h2>
                
                <div className="flex justify-center space-x-6 mb-8">
                  <button 
                    onClick={() => toast.success('Aadhaar e-KYC process initiated')}
                    className="flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>Aadhaar e-KYC</span>
                  </button>
                  
                  <button 
                    onClick={() => toast.success('Digilocker integration started')}
                    className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
                  >
                    <Folder className="w-6 h-6" />
                    <span>Digilocker</span>
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Note:</strong> If you are facing issues in completing your e-KYC with Digilocker or if you need to update your profile information, please refer to
                      </p>
                      <p className="text-sm text-blue-800 mb-2">
                        Digilocker FAQ at <Link href="#" className="text-blue-600 underline">https://www.digilocker.gov.in/about/faq</Link>
                      </p>
                      <p className="text-sm text-blue-800">
                        or you can raise a ticket with Digilocker at <Link href="#" className="text-blue-600 underline">https://support.digilocker.gov.in/open</Link>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> If your profile information such as name, date of birth, gender, address etc. does not match,
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Notifications */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-600" />
                  Notifications
                </h3>
              </div>
              
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'action' ? 'bg-red-500' : 
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                          {notification.title}
                        </h4>
                        {notification.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                        )}
                        {notification.date && (
                          <p className="text-xs text-gray-500">
                            {notification.date} at {notification.time}
                          </p>
                        )}
                        {notification.type === 'action' && (
                          <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                            Read More
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
