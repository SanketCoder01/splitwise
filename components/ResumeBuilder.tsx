'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Eye, Save, Plus, Trash2, CheckCircle, 
  AlertCircle, Brain, Zap, Target, Award, Edit3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ResumeSection {
  id: string
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'achievements'
  data: any
}

interface AIFeedback {
  score: number
  suggestions: string[]
  keywords: string[]
  grammar_issues: string[]
}

export default function ResumeBuilder() {
  const { user } = useAuth()
  const [sections, setSections] = useState<ResumeSection[]>([])
  const [activeSection, setActiveSection] = useState('personal')
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  const sectionTypes = [
    { id: 'personal', label: 'Personal Info', icon: FileText, required: true },
    { id: 'education', label: 'Education', icon: Award, required: true },
    { id: 'experience', label: 'Experience', icon: Target, required: false },
    { id: 'skills', label: 'Skills', icon: Zap, required: true },
    { id: 'projects', label: 'Projects', icon: Plus, required: false },
    { id: 'achievements', label: 'Achievements', icon: Award, required: false }
  ]

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional professional format' },
    { id: 'creative', name: 'Creative', description: 'Unique layout for creative roles' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant design' }
  ]

  useEffect(() => {
    initializeResume()
  }, [])

  const initializeResume = () => {
    const defaultSections: ResumeSection[] = [
      {
        id: 'personal',
        type: 'personal',
        data: {
          name: '',
          email: user?.email || '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          summary: ''
        }
      },
      {
        id: 'education',
        type: 'education',
        data: []
      },
      {
        id: 'skills',
        type: 'skills',
        data: {
          technical: [],
          soft: [],
          languages: []
        }
      }
    ]
    setSections(defaultSections)
  }

  const updateSection = (sectionId: string, newData: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, data: newData } : section
    ))
  }

  const addSection = (type: string) => {
    const newSection: ResumeSection = {
      id: `${type}_${Date.now()}`,
      type: type as any,
      data: type === 'experience' ? [] : type === 'projects' ? [] : {}
    }
    setSections(prev => [...prev, newSection])
  }

  const analyzeWithAI = async () => {
    setAnalyzing(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock AI feedback
      const mockFeedback: AIFeedback = {
        score: 85,
        suggestions: [
          'Add more quantifiable achievements in your experience section',
          'Include relevant keywords for your target industry',
          'Expand your skills section with specific technologies',
          'Add a professional summary to highlight your value proposition'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'API Development'],
        grammar_issues: [
          'Consider using active voice in experience descriptions',
          'Ensure consistent tense throughout the document'
        ]
      }
      
      setAiFeedback(mockFeedback)
    } catch (error) {
      console.error('AI analysis error:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const renderPersonalInfo = () => {
    const personalData = sections.find(s => s.type === 'personal')?.data || {}
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={personalData.name || ''}
              onChange={(e) => updateSection('personal', { ...personalData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={personalData.email || ''}
              onChange={(e) => updateSection('personal', { ...personalData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={personalData.phone || ''}
              onChange={(e) => updateSection('personal', { ...personalData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={personalData.location || ''}
              onChange={(e) => updateSection('personal', { ...personalData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="New Delhi, India"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
          <textarea
            rows={4}
            value={personalData.summary || ''}
            onChange={(e) => updateSection('personal', { ...personalData, summary: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Brief overview of your professional background and career objectives..."
          />
        </div>
      </div>
    )
  }

  const renderSkills = () => {
    const skillsData = sections.find(s => s.type === 'skills')?.data || { technical: [], soft: [], languages: [] }
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
          <input
            type="text"
            value={skillsData.technical?.join(', ') || ''}
            onChange={(e) => updateSection('skills', { 
              ...skillsData, 
              technical: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="JavaScript, React, Node.js, Python, etc."
          />
          <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
          <input
            type="text"
            value={skillsData.soft?.join(', ') || ''}
            onChange={(e) => updateSection('skills', { 
              ...skillsData, 
              soft: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Leadership, Communication, Problem Solving, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
          <input
            type="text"
            value={skillsData.languages?.join(', ') || ''}
            onChange={(e) => updateSection('skills', { 
              ...skillsData, 
              languages: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="English, Hindi, Spanish, etc."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border rounded-lg text-center transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-xs text-gray-600">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Sections</h3>
          <div className="space-y-2">
            {sectionTypes.map((sectionType) => {
              const hasSection = sections.some(s => s.type === sectionType.id)
              return (
                <div key={sectionType.id} className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveSection(sectionType.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-left flex-1 transition-colors ${
                      activeSection === sectionType.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <sectionType.icon className="w-4 h-4" />
                    <span className="font-medium">{sectionType.label}</span>
                    {sectionType.required && <span className="text-red-500">*</span>}
                  </button>
                  {!hasSection && !sectionType.required && (
                    <button
                      onClick={() => addSection(sectionType.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* AI Analysis */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={analyzeWithAI}
              disabled={analyzing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-colors"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>AI Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {activeSection.replace('_', ' ')} Section
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          {activeSection === 'personal' && renderPersonalInfo()}
          {activeSection === 'skills' && renderSkills()}
          {activeSection === 'education' && (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Education Section</h4>
              <p className="text-gray-600">Add your educational background</p>
            </div>
          )}
          {activeSection === 'experience' && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Experience Section</h4>
              <p className="text-gray-600">Add your work experience</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Feedback */}
      {aiFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Resume Score:</span>
              <span className={`text-lg font-bold ${
                aiFeedback.score >= 80 ? 'text-green-600' : 
                aiFeedback.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {aiFeedback.score}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {aiFeedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommended Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {aiFeedback.keywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Grammar & Style</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {aiFeedback.grammar_issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Edit3 className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
        
        <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="w-4 h-4" />
          <span>Save Resume</span>
        </button>
      </div>
    </div>
  )
}
