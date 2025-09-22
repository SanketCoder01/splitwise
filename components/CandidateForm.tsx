'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Calendar, Building, 
  GraduationCap, Award, Briefcase, Code, Globe,
  Plus, Trash2, Edit3, Save, X, CheckCircle
} from 'lucide-react'

interface CandidateFormProps {
  extractedData?: any
  onSave: (section: string, data: any) => void
}

export default function CandidateForm({ extractedData, onSave }: CandidateFormProps) {
  const [activeSection, setActiveSection] = useState('personal')
  const [formData, setFormData] = useState<any>({})
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())

  // Auto-populate form when extracted data is available
  useEffect(() => {
    if (extractedData) {
      setFormData({
        personal: extractedData.personalInfo || {},
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || { technical: [], soft: [] },
        certifications: extractedData.certifications || [],
        projects: extractedData.projects || [],
        awards: extractedData.awards || [],
        languages: extractedData.languages || []
      })
    }
  }, [extractedData])

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Languages', icon: Code },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projects', icon: Building },
    { id: 'awards', label: 'Awards & Achievements', icon: Award }
  ]

  const handleSave = (section: string) => {
    onSave(section, formData[section])
    setSavedSections(prev => new Set([...Array.from(prev), section]))
    setEditingSection(null)
  }

  const updateFormData = (section: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: data
    }))
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.personal?.name || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.personal?.email || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.personal?.phone || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.personal?.location || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, State, Country"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.personal?.linkedin || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, linkedin: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="LinkedIn profile URL"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.personal?.github || ''}
            onChange={(e) => updateFormData('personal', { ...formData.personal, github: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GitHub profile URL"
          />
        </div>
      </div>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-6">
      {formData.experience?.map((exp: any, index: number) => (
        <div key={exp.id || index} className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => {
                  const updated = [...formData.experience]
                  updated[index] = { ...updated[index], company: e.target.value }
                  updateFormData('experience', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => {
                  const updated = [...formData.experience]
                  updated[index] = { ...updated[index], position: e.target.value }
                  updateFormData('experience', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Job title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="month"
                value={exp.startDate || ''}
                onChange={(e) => {
                  const updated = [...formData.experience]
                  updated[index] = { ...updated[index], startDate: e.target.value }
                  updateFormData('experience', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="month"
                value={exp.current ? '' : exp.endDate || ''}
                onChange={(e) => {
                  const updated = [...formData.experience]
                  updated[index] = { ...updated[index], endDate: e.target.value, current: false }
                  updateFormData('experience', updated)
                }}
                disabled={exp.current}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => {
                    const updated = [...formData.experience]
                    updated[index] = { ...updated[index], current: e.target.checked, endDate: e.target.checked ? '' : updated[index].endDate }
                    updateFormData('experience', updated)
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Currently working here</span>
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={exp.description || ''}
                onChange={(e) => {
                  const updated = [...formData.experience]
                  updated[index] = { ...updated[index], description: e.target.value }
                  updateFormData('experience', updated)
                }}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6">
      {formData.education?.map((edu: any, index: number) => (
        <div key={edu.id || index} className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => {
                  const updated = [...formData.education]
                  updated[index] = { ...updated[index], institution: e.target.value }
                  updateFormData('education', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University/College name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => {
                  const updated = [...formData.education]
                  updated[index] = { ...updated[index], degree: e.target.value }
                  updateFormData('education', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study
              </label>
              <input
                type="text"
                value={edu.field || ''}
                onChange={(e) => {
                  const updated = [...formData.education]
                  updated[index] = { ...updated[index], field: e.target.value }
                  updateFormData('education', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Computer Science, Engineering, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade/CGPA
              </label>
              <input
                type="text"
                value={edu.grade || ''}
                onChange={(e) => {
                  const updated = [...formData.education]
                  updated[index] = { ...updated[index], grade: e.target.value }
                  updateFormData('education', updated)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8.5 CGPA, 85%, etc."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
              {savedSections.has(section.id) && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
          
          <div className="flex items-center space-x-3">
            {extractedData && (
              <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                Auto-populated from resume
              </span>
            )}
            <button
              onClick={() => handleSave(activeSection)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Section</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'personal' && renderPersonalInfo()}
            {activeSection === 'experience' && renderExperience()}
            {activeSection === 'education' && renderEducation()}
            {/* Add other sections as needed */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
