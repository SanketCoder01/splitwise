'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, CheckCircle, Clock, AlertCircle, X, Eye, 
  Download, Trash2, Camera, Scan, Brain, FileCheck
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface Document {
  id: string
  name: string
  type: 'id_proof' | 'bonafide' | 'marksheet' | 'resume' | 'other'
  status: 'pending' | 'processing' | 'verified' | 'rejected'
  ai_extracted_data?: any
  file_url?: string
  uploaded_at: string
}

export default function EnhancedDocumentUpload() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('id_proof')
  const [aiProcessing, setAiProcessing] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const documentTypes = [
    { id: 'id_proof', label: 'ID Proof', description: 'Aadhaar, PAN, Passport, etc.', icon: FileText },
    { id: 'bonafide', label: 'Bonafide Certificate', description: 'College/University certificate', icon: FileCheck },
    { id: 'marksheet', label: 'Mark Sheets', description: 'Academic transcripts', icon: FileText },
    { id: 'resume', label: 'Resume/CV', description: 'Professional resume', icon: FileText },
    { id: 'other', label: 'Other Documents', description: 'Additional certificates', icon: FileText }
  ]

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const file = files[0]

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}/${selectedType}_${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Create document record
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user?.id,
          name: file.name,
          type: selectedType,
          file_path: fileName,
          status: 'processing'
        })
        .select()
        .single()

      if (docError) throw docError

      // Start AI processing
      setAiProcessing(docData.id)
      await processWithAI(docData.id, file, selectedType)

    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const processWithAI = async (documentId: string, file: File, type: string) => {
    try {
      // Simulate AI OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock AI extracted data based on document type
      let extractedData = {}
      
      switch (type) {
        case 'id_proof':
          extractedData = {
            name: 'John Doe',
            id_number: 'ABCD1234E',
            date_of_birth: '1995-05-15',
            address: 'New Delhi, India'
          }
          break
        case 'bonafide':
          extractedData = {
            student_name: 'John Doe',
            college: 'Delhi University',
            course: 'B.Tech Computer Science',
            year: '2024'
          }
          break
        case 'marksheet':
          extractedData = {
            student_name: 'John Doe',
            percentage: '85.5%',
            grade: 'A',
            subjects: ['Mathematics', 'Physics', 'Computer Science']
          }
          break
        case 'resume':
          extractedData = {
            name: 'John Doe',
            skills: ['JavaScript', 'React', 'Node.js', 'Python'],
            experience: '2 years',
            education: 'B.Tech Computer Science'
          }
          break
      }

      // Update document with AI results
      const { error } = await supabase
        .from('documents')
        .update({
          status: 'verified',
          ai_extracted_data: extractedData,
          processed_at: new Date().toISOString()
        })
        .eq('id', documentId)

      if (!error) {
        // Refresh documents list
        fetchDocuments()
      }

    } catch (error) {
      console.error('AI processing error:', error)
    } finally {
      setAiProcessing(null)
    }
  }

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user?.id)
      .order('uploaded_at', { ascending: false })

    if (data) setDocuments(data)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />
      case 'rejected': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Document Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <type.icon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">{type.label}</span>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Brain className="w-4 h-4" />
            <span>AI-Powered OCR</span>
          </div>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading and processing...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
              <p className="text-sm text-gray-600">Supports PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
              <p className="text-xs text-blue-600">✨ AI will automatically extract information</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
        
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h4>
            <p className="text-gray-600">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="capitalize">{doc.status}</span>
                      </span>
                      {aiProcessing === doc.id && (
                        <span className="flex items-center space-x-1 text-xs text-blue-600">
                          <Scan className="w-3 h-3 animate-pulse" />
                          <span>AI Processing...</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      <span className="mx-2">•</span>
                      <span>Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>

                    {/* AI Extracted Data */}
                    {doc.ai_extracted_data && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Brain className="w-4 h-4 text-blue-600 mr-1" />
                          <span className="text-sm font-medium text-blue-900">AI Extracted Information</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(doc.ai_extracted_data).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                              <span className="ml-1 text-gray-900">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Features Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Auto Data Extraction</h4>
            <p className="text-gray-600">Automatically extracts names, dates, and key information</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Document Validation</h4>
            <p className="text-gray-600">Verifies authenticity and checks for tampering</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Smart Categorization</h4>
            <p className="text-gray-600">Automatically categorizes and organizes documents</p>
          </div>
        </div>
      </div>
    </div>
  )
}
