'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, X, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Grievance {
  id: string
  subject: string
  description: string
  category: 'technical' | 'verification' | 'application' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  resolution?: string
  created_at: string
  updated_at: string
}

export default function GrievanceManagement() {
  const { user } = useAuth()
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'technical' as const,
    priority: 'medium' as const
  })

  const categories = [
    { id: 'technical', label: 'Technical Issues', description: 'Website, app, or system problems' },
    { id: 'verification', label: 'Document Verification', description: 'Issues with document verification process' },
    { id: 'application', label: 'Application Process', description: 'Problems with internship applications' },
    { id: 'other', label: 'Other', description: 'Any other concerns or feedback' }
  ]

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    if (user) {
      fetchGrievances()
    }
  }, [user])

  const fetchGrievances = async () => {
    const { data, error } = await supabase
      .from('grievances')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) {
      setGrievances(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase
      .from('grievances')
      .insert({
        user_id: user.id,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open'
      })

    if (!error) {
      setFormData({
        subject: '',
        description: '',
        category: 'technical',
        priority: 'medium'
      })
      setShowForm(false)
      fetchGrievances()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'closed': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.id === priority)?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Grievance Management</h1>
          <p className="text-gray-600">Submit and track your concerns and feedback</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Grievance</span>
        </button>
      </div>

      {/* Submit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Submit New Grievance</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Brief description of your concern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{category.label}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Please provide detailed information about your concern..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Grievance</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grievances List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {grievances.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grievances submitted</h3>
            <p className="text-gray-500 mb-4">Submit your first grievance to get help with any concerns.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Grievance</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {grievances.map((grievance) => (
              <motion.div
                key={grievance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedGrievance(grievance)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{grievance.subject}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(grievance.status)}`}>
                        {getStatusIcon(grievance.status)}
                        <span className="capitalize">{grievance.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(grievance.priority)}`}>
                        {grievance.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{grievance.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{grievance.category.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Created {new Date(grievance.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated {new Date(grievance.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Grievance Detail Modal */}
      <AnimatePresence>
        {selectedGrievance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Grievance Details</h2>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedGrievance.subject}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(selectedGrievance.status)}`}>
                      {getStatusIcon(selectedGrievance.status)}
                      <span className="capitalize">{selectedGrievance.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 capitalize">{selectedGrievance.category.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedGrievance.priority)}`}>
                        {selectedGrievance.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2">{new Date(selectedGrievance.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2">{new Date(selectedGrievance.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedGrievance.description}</p>
                </div>

                {selectedGrievance.resolution && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Resolution</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">{selectedGrievance.resolution}</p>
                    </div>
                  </div>
                )}

                {selectedGrievance.status === 'open' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Your grievance has been submitted and assigned a tracking ID</li>
                      <li>• A government official will review your concern within 2-3 business days</li>
                      <li>• You will receive updates via email and in your dashboard</li>
                      <li>• Average resolution time is 5-7 business days</li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Before submitting a grievance:</h4>
            <ul className="space-y-1">
              <li>• Check our FAQ section for common issues</li>
              <li>• Try refreshing the page or clearing browser cache</li>
              <li>• Ensure all required documents are properly uploaded</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Emergency contacts:</h4>
            <ul className="space-y-1">
              <li>• Technical Support: support@gov.in</li>
              <li>• Helpline: 1800-XXX-XXXX</li>
              <li>• Office Hours: Mon-Fri, 9 AM - 6 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
