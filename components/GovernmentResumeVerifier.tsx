'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Eye, 
  FileText, User, Building, Award, Search, Filter,
  TrendingUp, Users, BarChart3, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CandidateProfile {
  id: string
  name: string
  email: string
  phone: string
  position: string
  verificationScore: number
  riskLevel: 'low' | 'medium' | 'high'
  status: 'pending' | 'verified' | 'flagged'
  submittedAt: string
  flags: string[]
}

export default function GovernmentResumeVerifier() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates' | 'analytics'>('dashboard')
  const [candidates] = useState<CandidateProfile[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@email.com',
      phone: '+91 9876543210',
      position: 'Software Developer',
      verificationScore: 85,
      riskLevel: 'low',
      status: 'verified',
      submittedAt: '2024-01-15',
      flags: []
    },
    {
      id: '2',
      name: 'Priya Singh',
      email: 'priya@email.com',
      phone: '+91 9876543211',
      position: 'Data Analyst',
      verificationScore: 45,
      riskLevel: 'high',
      status: 'flagged',
      submittedAt: '2024-01-14',
      flags: ['Suspicious experience dates', 'Unverified certificates']
    }
  ])

  const stats = {
    totalApplications: 1247,
    verifiedProfiles: 1089,
    flaggedProfiles: 158,
    averageScore: 78
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Verification System</h1>
              <p className="text-gray-600">Government Portal - Verify candidate profiles and detect fraud</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-gray-500">Secure Verification</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'candidates', label: 'Candidates', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified Profiles</p>
                    <p className="text-2xl font-bold text-green-600">{stats.verifiedProfiles}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Flagged Profiles</p>
                    <p className="text-2xl font-bold text-red-600">{stats.flaggedProfiles}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.averageScore}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Verifications</h2>
              <div className="space-y-4">
                {candidates.slice(0, 5).map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        candidate.riskLevel === 'low' ? 'bg-green-500' :
                        candidate.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{candidate.verificationScore}%</p>
                      <p className="text-xs text-gray-500">{candidate.submittedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Candidate Profiles</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{candidate.position}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                candidate.verificationScore >= 70 ? 'bg-green-500' :
                                candidate.verificationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${candidate.verificationScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{candidate.verificationScore}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          candidate.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          candidate.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {candidate.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          candidate.status === 'verified' ? 'bg-green-100 text-green-800' :
                          candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {candidate.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Analytics</h2>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Analytics dashboard coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
