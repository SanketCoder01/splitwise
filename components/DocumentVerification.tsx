'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, Clock, X, AlertCircle, Eye, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Document {
  id: string
  name: string
  type: string
  file_path: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  file_size?: number
}

export default function DocumentVerification() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState('resume')

  const documentTypes = [
    { id: 'resume', label: 'Resume/CV', description: 'Your latest resume or curriculum vitae' },
    { id: 'certificate', label: 'Certificates', description: 'Educational or professional certificates' },
    { id: 'id_proof', label: 'ID Proof', description: 'Aadhar, PAN, or other government ID' },
    { id: 'education', label: 'Education Documents', description: 'Transcripts, degree certificates' },
    { id: 'experience', label: 'Experience Letters', description: 'Work experience certificates' }
  ]

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) {
      setDocuments(data)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${selectedType}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Save document record to database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: file.name,
          type: selectedType,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'pending'
        })
        .select()
        .single()

      if (docError) throw docError

      // Refresh documents list
      fetchDocuments()
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const downloadDocument = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (error) {
      console.error('Download error:', error)
      return
    }

    // Create download link
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Documents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Document Type
            </label>
            <div className="space-y-2">
              {documentTypes.map((type) => (
                <label key={type.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="documentType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-gray-500 mb-4">
                PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Documents</h2>
        
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
            <p className="text-gray-500">Upload your first document to get started with verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      {doc.file_size && (
                        <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      )}
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(doc.verification_status)}`}>
                    {getStatusIcon(doc.verification_status)}
                    <span className="capitalize">{doc.verification_status}</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadDocument(doc.file_path, doc.name)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Status Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Verification Process</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Documents are reviewed by government officials within 2-3 business days</p>
          <p>• You will receive notifications about verification status updates</p>
          <p>• Verified documents cannot be modified and are permanently stored</p>
          <p>• Rejected documents can be re-uploaded with corrections</p>
        </div>
      </div>
    </div>
  )
}
