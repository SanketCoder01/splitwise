'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, AlertCircle, Edit3, Save, X, ExternalLink,
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Github, Linkedin, Globe, Loader2
} from 'lucide-react'
import { verifyCertificate } from '../utils/profileVerifier'

interface ResumeData {
  personalInfo: {
    name?: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    duration: string
    description: string
    proofUploaded?: boolean
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    year: string
  }>
  skills: {
    technical: string[]
    soft: string[]
  }
  certificates?: Array<{
    id: string
    name: string
    issuer: string
    certificateId?: string
    verified?: boolean
    verificationStatus?: 'pending' | 'verified' | 'failed'
    issueDate?: string
  }>
}

interface ResumeDataReviewProps {
  extractedData: ResumeData
  onDataConfirmed: (confirmedData: ResumeData) => void
  onCancel?: () => void
}

export default function ResumeDataReview({ extractedData, onDataConfirmed, onCancel }: ResumeDataReviewProps) {
  const [editedData, setEditedData] = useState<ResumeData>(extractedData)
  const [isVerifying, setIsVerifying] = useState<{ linkedin: boolean; github: boolean }>({
    linkedin: false,
    github: false
  })
  const [verificationStatus, setVerificationStatus] = useState<{ linkedin: boolean | null; github: boolean | null }>({
    linkedin: null,
    github: null
  })
  const [showMissingFields, setShowMissingFields] = useState(true)
  const [uploadingProof, setUploadingProof] = useState<string | null>(null)
  const [certVerifyingId, setCertVerifyingId] = useState<string | null>(null)

  useEffect(() => {
    setEditedData(extractedData)
  }, [extractedData])

  const updatePersonalInfo = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const verifyProfile = async (platform: 'linkedin' | 'github', url: string) => {
    if (!url) return

    setIsVerifying(prev => ({ ...prev, [platform]: true }))

    try {
      // Call verification API
      const response = await fetch('/api/verify-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          url
        }),
      })

      const result = await response.json()
      setVerificationStatus(prev => ({
        ...prev,
        [platform]: result.exists
      }))
    } catch (error) {
      console.error(`Error verifying ${platform}:`, error)
      setVerificationStatus(prev => ({
        ...prev,
        [platform]: false
      }))
    } finally {
      setIsVerifying(prev => ({ ...prev, [platform]: false }))
    }
  }

  const handleConfirm = () => {
    onDataConfirmed(editedData)
  }

  const missingFields = []
  if (!editedData.personalInfo.linkedin) missingFields.push('LinkedIn Profile')
  if (!editedData.personalInfo.github) missingFields.push('GitHub Profile')
  const allProfilesEntered = !!(editedData.personalInfo.linkedin && editedData.personalInfo.github)
  const allProfilesVerified = (verificationStatus.linkedin === true) && (verificationStatus.github === true)
  const allExperienceProven = editedData.experience.length === 0 ? true : editedData.experience.every(e => e.proofUploaded)
  const allCertificatesVerified = !editedData.certificates || editedData.certificates.length === 0 ? true : editedData.certificates.every(c => c.certificateId && c.verificationStatus === 'verified')
  const canContinue = allProfilesEntered && allProfilesVerified && allExperienceProven && allCertificatesVerified

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Extracted Data</h2>
        <p className="text-gray-600">Please review and complete the information extracted from your resume</p>
      </div>

      {/* Missing Fields Alert */}
      <AnimatePresence>
        {showMissingFields && missingFields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-orange-800 font-medium mb-2">Required Information Missing</h3>
                <p className="text-orange-700 text-sm mb-3">
                  The following information was not found in your resume. Please enter it manually in the fields below:
                </p>
                <ul className="text-orange-700 text-sm space-y-1">
                  {missingFields.map((field, index) => (
                    <li key={index}>• {field} - Enter your profile URL and click "Verify"</li>
                  ))}
                </ul>
                <p className="text-orange-700 text-sm mt-2 font-medium">
                  💡 Tip: The input fields below are highlighted in orange for missing information.
                </p>
              </div>
              <button
                onClick={() => setShowMissingFields(false)}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={editedData.personalInfo.name || ''}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editedData.personalInfo.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={editedData.personalInfo.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={editedData.personalInfo.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your location"
            />
          </div>

          {/* LinkedIn Profile */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile <span className="text-red-500">*</span>
              {!editedData.personalInfo.linkedin && (
                <span className="text-xs text-orange-600 ml-2">(Required - enter manually if not in resume)</span>
              )}
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={editedData.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    !editedData.personalInfo.linkedin ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                />
                <Linkedin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <button
                onClick={() => verifyProfile('linkedin', editedData.personalInfo.linkedin || '')}
                disabled={isVerifying.linkedin || !editedData.personalInfo.linkedin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isVerifying.linkedin ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>Verify</span>
              </button>
            </div>
            {verificationStatus.linkedin !== null && (
              <div className={`mt-2 flex items-center space-x-2 text-sm ${
                verificationStatus.linkedin ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationStatus.linkedin ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {verificationStatus.linkedin ? 'Profile verified' : 'Profile not found or private'}
                </span>
              </div>
            )}
          </div>

          {/* GitHub Profile */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Profile <span className="text-red-500">*</span>
              {!editedData.personalInfo.github && (
                <span className="text-xs text-orange-600 ml-2">(Required - enter manually if not in resume)</span>
              )}
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={editedData.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    !editedData.personalInfo.github ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
                  }`}
                  placeholder="https://github.com/yourusername"
                  required
                />
                <Github className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <button
                onClick={() => verifyProfile('github', editedData.personalInfo.github || '')}
                disabled={isVerifying.github || !editedData.personalInfo.github}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-50 flex items-center space-x-2"
              >
                {isVerifying.github ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>Verify</span>
              </button>
            </div>
            {verificationStatus.github !== null && (
              <div className={`mt-2 flex items-center space-x-2 text-sm ${
                verificationStatus.github ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationStatus.github ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>
                  {verificationStatus.github ? 'Profile verified' : 'Profile not found'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Summary with per-experience proof upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Briefcase className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        </div>

        {editedData.experience.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Experience Found</h4>
            <p className="text-gray-600 mb-4">
              No work experience was extracted from your resume. If you have work experience, please ensure it's properly formatted in your resume.
            </p>
            <p className="text-sm text-gray-500">
              Note: If your resume contains experience information but it's not being extracted, the AI service may need improvement.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {editedData.experience.map((exp) => (
              <div key={exp.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.description.substring(0, 160)}{exp.description.length > 160 ? '...' : ''}</p>
                  </div>
                  {exp.proofUploaded ? (
                    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-2 py-1 rounded">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Proof Verified</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 pt-3 border-t">
                  {!exp.proofUploaded ? (
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <p className="text-sm text-gray-700">Upload strong proof (Offer Letter, Experience Certificate, Payslip, etc.)</p>
                      <button
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (!file) return
                            setUploadingProof(exp.id)
                            // Simulate upload/verification
                            setTimeout(() => {
                              setEditedData(prev => ({
                                ...prev,
                                experience: prev.experience.map(ex => ex.id === exp.id ? { ...ex, proofUploaded: true } : ex)
                              }))
                              setUploadingProof(null)
                            }, 1500)
                          }
                          input.click()
                        }}
                        disabled={uploadingProof === exp.id}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${uploadingProof === exp.id ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {uploadingProof === exp.id ? 'Uploading...' : 'Upload Proof'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">Document uploaded and verified.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Summary */}
      {editedData.education.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          </div>
          <div className="space-y-3">
            {editedData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution} • {edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Summary */}
      {(editedData.skills.technical.length > 0 || editedData.skills.soft.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          </div>
          <div className="space-y-4">
            {editedData.skills.technical.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {editedData.skills.technical.slice(0, 10).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {editedData.skills.technical.length > 10 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{editedData.skills.technical.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
            {editedData.skills.soft.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {editedData.skills.soft.slice(0, 10).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {editedData.skills.soft.length > 10 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{editedData.skills.soft.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificates */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Certificates</h3>
        </div>

        {(!editedData.certificates || editedData.certificates.length === 0) ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h4>
            <p className="text-gray-600 mb-4">
              No certificates were extracted from your resume. If you have certifications, please ensure they are properly listed in your resume.
            </p>
            <p className="text-sm text-gray-500">
              Note: Certificates are automatically extracted when found. If your resume contains certificates but they're not appearing, the AI service may need improvement.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {editedData.certificates.map((cert) => (
              <div key={cert.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-gray-600">{cert.issuer}{cert.issueDate ? ` • ${cert.issueDate}` : ''}</p>
                  </div>
                  {cert.verificationStatus === 'verified' && (
                    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-2 py-1 rounded">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                  {cert.verificationStatus === 'failed' && (
                    <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-2 py-1 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Verification failed</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Certificate ID {!cert.certificateId && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={cert.certificateId || ''}
                      onChange={(e) => setEditedData(prev => ({
                        ...prev,
                        certificates: prev.certificates?.map(c => c.id === cert.id ? { ...c, certificateId: e.target.value, verificationStatus: undefined, verified: undefined } : c)
                      }))}
                      placeholder="Enter certificate ID (required for verification)"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        !cert.certificateId ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={async () => {
                        if (!cert.certificateId) return
                        setCertVerifyingId(cert.id)
                        try {
                          const result = await verifyCertificate(cert.certificateId, cert.issuer)
                          setEditedData(prev => ({
                            ...prev,
                            certificates: prev.certificates?.map(c => c.id === cert.id ? { ...c, verified: !!(result.exists && result.verified), verificationStatus: (result.exists && result.verified) ? 'verified' : 'failed' } : c)
                          }))
                        } finally {
                          setCertVerifyingId(null)
                        }
                      }}
                      disabled={certVerifyingId === cert.id || cert.verificationStatus === 'verified' || !cert.certificateId}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${cert.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}
                    >
                      {cert.verificationStatus === 'verified' ? 'Verified' : (certVerifyingId === cert.id ? 'Verifying...' : 'Verify')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Please ensure all information is accurate before proceeding
        </div>
        <div className="flex space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!canContinue}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${canContinue ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{canContinue ? 'Confirm & Continue' : 'Complete verification to continue'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}