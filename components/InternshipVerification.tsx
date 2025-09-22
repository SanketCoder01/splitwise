'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, XCircle, Clock, Eye, FileText, Building2, 
  MapPin, Calendar, DollarSign, Users, AlertTriangle,
  MessageSquare, Download, Filter, Search, RefreshCw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'

interface InternshipPosting {
  id: string
  title: string
  department: string
  ministry: string
  location: string
  duration: string
  stipend: string
  description: string
  requirements: string
  skills: string
  positions: number
  deadline: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  recruiter_id: string
  organization_name: string
  created_at: string
  documents: any[]
}

export default function InternshipVerification() {
  const [postings, setPostings] = useState<InternshipPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosting, setSelectedPosting] = useState<InternshipPosting | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchPendingPostings()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('internship_postings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'internship_postings' },
        () => {
          fetchPendingPostings()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchPendingPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('internship_postings')
        .select(`
          *,
          recruiters!inner(organization_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = data?.map(posting => ({
        ...posting,
        organization_name: posting.recruiters.organization_name
      })) || []

      setPostings(formattedData)
    } catch (error) {
      console.error('Error fetching postings:', error)
      toast.error('Failed to fetch internship postings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (postingId: string) => {
    setIsProcessing(true)
    try {
      const { error } = await supabase
        .from('internship_postings')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_gov_official_id' // Replace with actual official ID
        })
        .eq('id', postingId)

      if (error) throw error

      toast.success('Internship approved successfully!')
      setShowModal(false)
      fetchPendingPostings()
    } catch (error) {
      console.error('Error approving posting:', error)
      toast.error('Failed to approve internship')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (postingId: string) => {
    if (!reviewComment.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setIsProcessing(true)
    try {
      const { error } = await supabase
        .from('internship_postings')
        .update({ 
          status: 'rejected',
          rejection_reason: reviewComment,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_gov_official_id' // Replace with actual official ID
        })
        .eq('id', postingId)

      if (error) throw error

      toast.success('Internship rejected')
      setShowModal(false)
      setReviewComment('')
      fetchPendingPostings()
    } catch (error) {
      console.error('Error rejecting posting:', error)
      toast.error('Failed to reject internship')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />
      case 'under_review': return <Eye className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredPostings = postings.filter(posting => {
    const matchesStatus = filterStatus === 'all' || posting.status === filterStatus
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.department.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: postings.length,
    pending: postings.filter(p => p.status === 'submitted').length,
    approved: postings.filter(p => p.status === 'approved').length,
    rejected: postings.filter(p => p.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Internship Verification</h2>
          <p className="text-gray-600">Review and approve internship postings from recruiters</p>
        </div>
        <button
          onClick={fetchPendingPostings}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Postings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, organization, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Postings List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internship Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPostings.map((posting) => (
                <tr key={posting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{posting.title}</div>
                      <div className="text-sm text-gray-500">{posting.department}</div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {posting.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {posting.duration}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {posting.stipend}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{posting.organization_name}</div>
                    <div className="text-sm text-gray-500">{posting.ministry}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(posting.status)}`}>
                      {getStatusIcon(posting.status)}
                      <span className="capitalize">{posting.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(posting.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedPosting(posting)
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedPosting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Review Internship Posting</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Department:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.department}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ministry:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.ministry}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Organization:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.organization_name}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Duration:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Stipend:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.stipend}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Positions:</span>
                      <p className="text-sm text-gray-900">{selectedPosting.positions}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Deadline:</span>
                      <p className="text-sm text-gray-900">{new Date(selectedPosting.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPosting.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPosting.requirements}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                <p className="text-sm text-gray-700">{selectedPosting.skills}</p>
              </div>

              {/* Review Comments */}
              {selectedPosting.status === 'submitted' && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Review Comments</h4>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add comments for approval/rejection..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedPosting.status === 'submitted' && (
                <>
                  <button
                    onClick={() => handleReject(selectedPosting.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPosting.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
