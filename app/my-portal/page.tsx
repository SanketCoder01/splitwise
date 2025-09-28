'use client'

import { useState, useEffect } from 'react'
import { User, FileText, Bell, Settings, Share2, Download, Eye, Calendar, MapPin, Building, Clock, Star, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface Application {
  id: string
  internshipTitle: string
  company: string
  location: string
  appliedDate: string
  status: 'pending' | 'under-review' | 'shortlisted' | 'selected' | 'rejected'
  stipend: string
  duration: string
}

interface Certificate {
  id: string
  title: string
  issueDate: string
  validUntil: string
  certificateId: string
  status: 'active' | 'expired'
}

interface SharedDocument {
  id: string
  name: string
  type: string
  sharedWith: string
  sharedDate: string
  accessLevel: 'view' | 'download'
}

export default function MyPortalPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Mock data - in real app, fetch from Supabase
  const applications: Application[] = [
    {
      id: '1',
      internshipTitle: 'Software Developer Intern',
      company: 'National Informatics Centre',
      location: 'New Delhi',
      appliedDate: '2024-01-15',
      status: 'under-review',
      stipend: '₹35,000/month',
      duration: '6 months'
    },
    {
      id: '2',
      internshipTitle: 'Data Analyst Intern',
      company: 'Ministry of Education',
      location: 'Mumbai',
      appliedDate: '2024-01-10',
      status: 'shortlisted',
      stipend: '₹30,000/month',
      duration: '4 months'
    },
    {
      id: '3',
      internshipTitle: 'Digital Marketing Intern',
      company: 'Digital India Corp',
      location: 'Bangalore',
      appliedDate: '2024-01-08',
      status: 'selected',
      stipend: '₹25,000/month',
      duration: '3 months'
    }
  ]

  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'Government Internship Program Completion Certificate',
      issueDate: '2023-12-15',
      validUntil: '2028-12-15',
      certificateId: 'PMI-CERT-2023-001234',
      status: 'active'
    },
    {
      id: '2',
      title: 'Digital Skills Training Certificate',
      issueDate: '2023-11-20',
      validUntil: '2026-11-20',
      certificateId: 'DST-CERT-2023-005678',
      status: 'active'
    }
  ]

  const sharedDocuments: SharedDocument[] = [
    {
      id: '1',
      name: 'Resume_Updated.pdf',
      type: 'PDF',
      sharedWith: 'NIC Recruitment Team',
      sharedDate: '2024-01-15',
      accessLevel: 'download'
    },
    {
      id: '2',
      name: 'Academic_Transcript.pdf',
      type: 'PDF',
      sharedWith: 'Ministry of Education',
      sharedDate: '2024-01-10',
      accessLevel: 'view'
    }
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserProfile({ ...profile, email: user.email })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under-review': return 'bg-blue-100 text-blue-800'
      case 'shortlisted': return 'bg-purple-100 text-purple-800'
      case 'selected': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected': return <CheckCircle className="w-4 h-4" />
      case 'shortlisted': return <Star className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GovernmentHeader showNavigation={true} showUserActions={true} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Shared Portal</h1>
          <p className="text-lg text-gray-600">
            Manage your applications, certificates, and shared documents in one place.
          </p>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                {userProfile?.profile_image ? (
                  <img 
                    src={userProfile.profile_image} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {userProfile?.full_name || 'Complete Profile'}
                </h2>
                <p className="text-gray-600">
                  ID: PMI-{userProfile?.id?.slice(-6)?.toUpperCase() || 'XXXXXX'}
                </p>
                <p className="text-sm text-gray-500">{userProfile?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                {userProfile?.profile_completion || 0}%
              </div>
              <div className="text-sm text-gray-600">Profile Complete</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'applications', label: 'My Applications', icon: FileText },
              { id: 'certificates', label: 'Certificates', icon: Star },
              { id: 'shared-docs', label: 'Shared Documents', icon: Share2 },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Applications</h3>
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Selected:</span>
                    <span className="font-medium text-green-600">
                      {applications.filter(app => app.status === 'selected').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Under Review:</span>
                    <span className="font-medium text-blue-600">
                      {applications.filter(app => app.status === 'under-review').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Certificates</h3>
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">{certificates.length}</div>
                <div className="text-sm text-gray-600">Active Certificates</div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Valid Until:</span>
                    <span className="font-medium">2028</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Shared Documents</h3>
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{sharedDocuments.length}</div>
                <div className="text-sm text-gray-600">Documents Shared</div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Last Shared:</span>
                    <span className="font-medium">Today</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {application.internshipTitle}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm space-x-4">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {application.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {application.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 capitalize">{application.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Stipend:</span>
                      <div className="font-medium">{application.stipend}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Duration:</span>
                      <div className="font-medium">{application.duration}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Application ID:</span>
                      <div className="font-medium">PMI-APP-{application.id.padStart(6, '0')}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Download Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {certificate.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Certificate ID: {certificate.certificateId}</div>
                        <div>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</div>
                        <div>Valid Until: {new Date(certificate.validUntil).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      certificate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {certificate.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Certificate
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shared Documents Tab */}
          {activeTab === 'shared-docs' && (
            <div className="space-y-4">
              {sharedDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                        <div className="text-sm text-gray-600">
                          Shared with {doc.sharedWith} on {new Date(doc.sharedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.accessLevel === 'download' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {doc.accessLevel}
                      </span>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                        Manage Access
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No New Notifications</h3>
              <p className="text-gray-500 mb-6">
                You're all caught up! We'll notify you when there are updates on your applications.
              </p>
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Notification Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
