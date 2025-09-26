'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import ResumeDataReview from './ResumeDataReview'
import { extractResumeData as extractFromImageOrPdf } from '../utils/ocrExtractor'

interface ResumeUploadProps {
  onResumeExtracted: (extractedData: any) => void
  hasExistingResume?: boolean
}

export default function ResumeUpload({ onResumeExtracted, hasExistingResume = false }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'extracting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [showReview, setShowReview] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type.startsWith('image/'))) {
      handleFileUpload(file)
    } else {
      setError('Please upload a PDF, DOCX, or image file (JPG/PNG)')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setUploadedFile(file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Branch: images handled client-side OCR; PDFs/DOCX via API
      if (file.type.startsWith('image/')) {
        // Client-side OCR using Tesseract.js via utils
        const extracted = await extractFromImageOrPdf(file)

        // Map to ResumeDataReview format
        const mapped = {
          personalInfo: {
            name: extracted.personalInfo.name,
            email: extracted.personalInfo.email,
            phone: extracted.personalInfo.phone,
            location: extracted.personalInfo.location,
            linkedin: extracted.socialProfiles.linkedin,
            github: extracted.socialProfiles.github,
          },
          experience: (extracted.experience || []).map((exp: any, idx: number) => ({
            id: `exp-${idx + 1}`,
            company: exp.company,
            position: exp.title,
            duration: exp.duration,
            description: exp.description,
          })),
          education: (extracted.education || []).map((edu: any, idx: number) => ({
            id: `edu-${idx + 1}`,
            institution: edu.institution,
            degree: edu.degree,
            year: edu.year,
          })),
          skills: {
            technical: extracted.skills || [],
            soft: [] as string[],
          },
        }

        clearInterval(progressInterval)
        setUploadProgress(100)
        setExtractionStatus('success')
        setIsUploading(false)
        setExtractedData(mapped)
        setShowReview(true)
      } else {
        // Create FormData for file upload (PDF/DOCX)
        const formData = new FormData()
        formData.append('resume', file)

        // Upload and extract resume data via server
        const response = await fetch('/api/resume/extract', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!response.ok) {
          throw new Error('Failed to process resume')
        }

        const extractedData = await response.json()

        setExtractionStatus('success')
        setIsUploading(false)

        // Store extracted data and show review component
        setExtractedData(extractedData.data)
        setShowReview(true)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process resume')
      setExtractionStatus('error')
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setExtractionStatus('idle')
    setError(null)
    setExtractedData(null)
    setShowReview(false)
  }

  const handleDataConfirmed = (confirmedData: any) => {
    // Pass confirmed data to parent component
    onResumeExtracted(confirmedData)
    setShowReview(false)
  }

  const handleReviewCancel = () => {
    setShowReview(false)
    setExtractionStatus('idle')
  }

  if (hasExistingResume && extractionStatus !== 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Resume Already Uploaded</h3>
            <p className="text-sm text-green-700">Your resume has been processed and information extracted.</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Verifier</h2>
        <p className="text-gray-600">Upload your resume to automatically extract and verify your information</p>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports PDF and DOCX files (Max 10MB)
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Choose File
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && extractionStatus === 'idle' && (
                <button
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Extraction Status */}
            <AnimatePresence>
              {extractionStatus === 'extracting' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg"
                >
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-900">Extracting Information</p>
                    <p className="text-sm text-blue-700">
                      AI is analyzing your resume and extracting relevant information...
                    </p>
                  </div>
                </motion.div>
              )}

              {extractionStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Extraction Complete</p>
                    <p className="text-sm text-green-700">
                      Your resume has been processed successfully. Information has been extracted and populated.
                    </p>
                  </div>
                </motion.div>
              )}

              {extractionStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Extraction Failed</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supported Formats */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Supported formats: PDF, DOCX • Maximum file size: 10MB
        </p>
      </div>

      {/* Resume Data Review */}
      <AnimatePresence>
        {showReview && extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <ResumeDataReview
              extractedData={extractedData}
              onDataConfirmed={handleDataConfirmed}
              onCancel={handleReviewCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
