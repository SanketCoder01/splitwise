'use client'

import { Home, FileText, Calendar, User, CheckCircle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { label: 'Applications Submitted', value: '3', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Interviews Scheduled', value: '1', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Profile Completion', value: '85%', icon: User, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Tasks Completed', value: '2', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Home className="w-6 h-6 mr-3 text-orange-600" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-600">Welcome to your PM Internship Portal</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-lg p-4 border border-gray-200`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors">
              Complete Profile
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Browse Internships
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
