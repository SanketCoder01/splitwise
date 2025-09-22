'use client'

import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react'

export default function ApplicationsPage() {
  const applications = [
    {
      id: 1,
      internshipTitle: 'Software Development Intern',
      company: 'Ministry of Electronics & IT',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      statusColor: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    {
      id: 2,
      internshipTitle: 'Data Analytics Intern',
      company: 'Ministry of Finance',
      appliedDate: '2024-01-10',
      status: 'Accepted',
      statusColor: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    {
      id: 3,
      internshipTitle: 'Digital Marketing Intern',
      company: 'Ministry of Information & Broadcasting',
      appliedDate: '2024-01-08',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
      icon: XCircle
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border p-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-orange-600" />
          My Applications
        </h2>
        <p className="text-gray-600">Track your internship applications and their status</p>
      </div>

      <div className="space-y-6">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{app.internshipTitle}</h3>
                  <p className="text-sm text-gray-600">{app.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                  {app.status}
                </span>
                <app.icon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Applied on: {app.appliedDate}</p>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                <button className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Applications Yet</h3>
          <p className="text-gray-400">Start applying for internships to see them here</p>
        </div>
      )}
    </motion.div>
  )
}
