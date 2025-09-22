'use client'

import { motion } from 'framer-motion'
import { Award, Calendar, MapPin, Building, Clock, CheckCircle, Star, Download } from 'lucide-react'

export default function MyInternshipPage() {
  const currentInternship = {
    id: 1,
    title: 'Software Development Intern',
    company: 'Ministry of Electronics & IT',
    location: 'New Delhi',
    duration: '6 months',
    startDate: '2024-02-01',
    endDate: '2024-07-31',
    stipend: '₹25,000/month',
    supervisor: 'Dr. Rajesh Kumar',
    status: 'Active',
    progress: 65,
    tasks: [
      { id: 1, title: 'Complete React Training Module', status: 'completed', dueDate: '2024-02-15' },
      { id: 2, title: 'Develop User Dashboard', status: 'in-progress', dueDate: '2024-03-01' },
      { id: 3, title: 'API Integration Project', status: 'pending', dueDate: '2024-03-15' },
      { id: 4, title: 'Final Project Presentation', status: 'pending', dueDate: '2024-07-20' }
    ]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Award className="w-8 h-8 mr-3 text-orange-600" />
          My Internship
        </h2>
        <p className="text-gray-600">Track your current internship progress and tasks</p>
      </div>

      {/* Current Internship Overview */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
              <Building className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{currentInternship.title}</h3>
              <p className="text-lg text-gray-600">{currentInternship.company}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {currentInternship.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentInternship.duration}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {currentInternship.startDate} - {currentInternship.endDate}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 mb-1">{currentInternship.stipend}</div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {currentInternship.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-800">Overall Progress</h4>
            <span className="text-lg font-bold text-orange-600">{currentInternship.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${currentInternship.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Supervisor</h4>
          <p className="text-gray-600">{currentInternship.supervisor}</p>
        </div>
      </div>

      {/* Tasks & Assignments */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Tasks & Assignments</h3>
        
        <div className="space-y-4">
          {currentInternship.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {task.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600 mr-3" />}
                  {task.status === 'in-progress' && <Clock className="w-5 h-5 text-yellow-600 mr-3" />}
                  {task.status === 'pending' && <div className="w-5 h-5 border-2 border-gray-400 rounded-full mr-3" />}
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Rating</h3>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-orange-600 mb-2">4.5</div>
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 ${star <= 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-gray-600">Excellent Performance</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Technical Skills</span>
              <span className="font-medium">4.5/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Communication</span>
              <span className="font-medium">4.0/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teamwork</span>
              <span className="font-medium">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Documents & Certificates</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Internship Certificate</span>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Performance Report</span>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Project Submission</span>
              <button className="flex items-center text-orange-600 hover:text-orange-800">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
