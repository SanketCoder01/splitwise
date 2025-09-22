'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, CheckCircle, XCircle, Clock, Eye, Download, 
  Brain, Shield, AlertTriangle, User, Calendar, MapPin,
  Search, Filter, RefreshCw, MessageSquare
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface StudentDocument {
  id: string
  student_id: string
  student_name: string
  student_email: string
  document_name: string
  document_type: string
  file_url: string
  ai_extracted_data: any
  verification_status: 'pending' | 'verified' | 'rejected'
  ai_confidence_score: number
  ai_flags: string[]
  submitted_at: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
}

interface AIAnalysis {
  authenticity_score: number
  tampering_detected: boolean
  data_consistency: boolean
  quality_score: number
  recommendations: string[]
  risk_factors: string[]
}

export default function StudentVerification() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  const filterOptions = [
    { id: 'pending', label: 'Pending Review', count: 15, color: 'yellow' },
    { id: 'verified', label: 'Verified', count: 45, color: 'green' },
    { id: 'rejected', label: 'Rejected', count: 8, color: 'red' },
    { id: 'flagged', label: 'AI Flagged', count: 3, color: 'orange' }
  ]

  useEffect(() => {
    fetchDocuments()
  }, [filter])

  const fetchDocuments = async () => {
    setLoading(true)
    
    // Mock data with AI analysis
    const mockDocuments: StudentDocument[] = [
      {
        id: '1',
        student_id: 'STU001',
        student_name: 'Rahul Sharma',
        student_email: 'rahul.sharma@student.ac.in',
        document_name: 'Aadhaar_Card.pdf',
        document_type: 'id_proof',
        file_url: '/documents/aadhaar_1.pdf',
        ai_extracted_data: {
          name: 'Rahul Sharma',
          aadhaar_number: '1234-5678-9012',
          dob: '1998-05-15',
          address: 'New Delhi, India'
        },
        verification_status: 'pending',
        ai_confidence_score: 92,
        ai_flags: [],
        submitted_at: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        student_id: 'STU002',
        student_name: 'Priya Patel',
        student_email: 'priya.patel@college.edu',
        document_name: 'Bonafide_Certificate.pdf',
        document_type: 'bonafide',
        file_url: '/documents/bonafide_2.pdf',
        ai_extracted_data: {
          student_name: 'Priya Patel',
          college: 'Delhi University',
          course: 'B.Tech Computer Science',
          year: '2024'
        },
        verification_status: 'pending',
        ai_confidence_score: 88,
        ai_flags: ['Date format inconsistency'],
        submitted_at: '2024-01-19T14:20:00Z'
      },
      {
        id: '3',
        student_id: 'STU003',
        student_name: 'Amit Kumar',
        student_email: 'amit.kumar@university.ac.in',
        document_name: 'Mark_Sheet_Semester_6.pdf',
        document_type: 'marksheet',
        file_url: '/documents/marksheet_3.pdf',
        ai_extracted_data: {
          student_name: 'Amit Kumar',
          percentage: '85.5%',
          grade: 'A',
          semester: '6th'
        },
        verification_status: 'pending',
        ai_confidence_score: 65,
        ai_flags: ['Low image quality', 'Potential tampering detected'],
        submitted_at: '2024-01-18T09:15:00Z'
      }
    ]

    // Filter based on selected filter
    let filtered = mockDocuments
    if (filter === 'flagged') {
      filtered = mockDocuments.filter(doc => doc.ai_flags.length > 0)
    } else {
      filtered = mockDocuments.filter(doc => doc.verification_status === filter)
    }

    setDocuments(filtered)
    setLoading(false)
  }

  const runAIAnalysis = async (documentId: string) => {
    setAnalyzing(documentId)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAnalysis: AIAnalysis = {
        authenticity_score: 87,
        tampering_detected: false,
        data_consistency: true,
        quality_score: 92,
        recommendations: [
          'Document appears authentic with high confidence',
          'All extracted data is consistent',
          'No signs of digital manipulation detected',
          'Image quality is excellent for verification'
        ],
        risk_factors: [
          'Minor date format variation (acceptable)',
          'Slight compression artifacts (normal)'
        ]
      }
      
      setAiAnalysis(mockAnalysis)
    } catch (error) {
      console.error('AI analysis error:', error)
    } finally {
      setAnalyzing(null)
    }
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
        // Update local state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
        setSelectedDocument(null)
        setAiAnalysis(null)
      }
    } catch (error) {
      console.error('Verification error:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Student Document Verification</h2>
            <p className="text-gray-600">AI-powered document verification system</p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">AI Enhanced</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === option.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{option.label}</span>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                option.color === 'green' ? 'bg-green-100 text-green-800' :
                option.color === 'red' ? 'bg-red-100 text-red-800' :
                option.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or document type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Documents */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDocument?.id === doc.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <h3 className="font-medium text-gray-900">{doc.document_name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.verification_status)}`}>
                          {doc.verification_status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{doc.student_name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(doc.submitted_at).toLocaleDateString()}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="capitalize">{doc.document_type.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">AI Confidence:</span>
                            <span className={`text-xs font-medium ${getConfidenceColor(doc.ai_confidence_score)}`}>
                              {doc.ai_confidence_score}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Flags */}
                      {doc.ai_flags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.ai_flags.map((flag, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              ⚠️ {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Document Details Panel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {selectedDocument ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
                <button
                  onClick={() => runAIAnalysis(selectedDocument.id)}
                  disabled={analyzing === selectedDocument.id}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {analyzing === selectedDocument.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Brain className="w-3 h-3" />
                  )}
                  <span>AI Analysis</span>
                </button>
              </div>

              {/* Student Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Student Information</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-gray-600">Name:</span> {selectedDocument.student_name}</p>
                  <p><span className="text-gray-600">Email:</span> {selectedDocument.student_email}</p>
                  <p><span className="text-gray-600">Student ID:</span> {selectedDocument.student_id}</p>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">AI Extracted Data</h4>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                  {Object.entries(selectedDocument.ai_extracted_data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-medium text-gray-900">AI Analysis Results</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Authenticity:</span>
                        <span className={getConfidenceColor(aiAnalysis.authenticity_score)}>
                          {aiAnalysis.authenticity_score}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quality:</span>
                        <span className={getConfidenceColor(aiAnalysis.quality_score)}>
                          {aiAnalysis.quality_score}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tampering:</span>
                        <span className={aiAnalysis.tampering_detected ? 'text-red-600' : 'text-green-600'}>
                          {aiAnalysis.tampering_detected ? 'Detected' : 'None'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consistency:</span>
                        <span className={aiAnalysis.data_consistency ? 'text-green-600' : 'text-red-600'}>
                          {aiAnalysis.data_consistency ? 'Valid' : 'Issues'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Recommendations:</h5>
                    <ul className="text-sm space-y-1">
                      {aiAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => verifyDocument(selectedDocument.id, 'verified')}
                    className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify</span>
                  </button>
                  <button
                    onClick={() => verifyDocument(selectedDocument.id, 'rejected', 'Document needs revision')}
                    className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
              <p className="text-gray-600">Choose a document from the list to view details and perform verification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
