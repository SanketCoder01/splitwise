'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Eye, Save, Plus, Trash2, CheckCircle, 
  AlertCircle, Brain, Zap, Target, Award, Edit3, ArrowRight, ArrowLeft,
  User, Mail, Phone, MapPin, Briefcase, GraduationCap
} from 'lucide-react'
import Image from 'next/image'

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'achievements';
  data: any;
}

interface AIFeedback {
  score: number;
  suggestions: string[];
  keywords: string[];
  grammar_issues: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  education: any[];
  experience: Experience[];
  skills: string[];
  projects: any[];
  achievements: any[];
}

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState<'template' | 'form' | 'preview'>('template');
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [activeSection, setActiveSection] = useState('personal');
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    achievements: [],
  });
  const [isGenerating, setIsGenerating] = useState(false)

  const sectionTypes = [
    { id: 'personal', label: 'Personal Info', icon: FileText, required: true },
    { id: 'education', label: 'Education', icon: Award, required: true },
    { id: 'experience', label: 'Experience', icon: Target, required: false },
    { id: 'skills', label: 'Skills', icon: Zap, required: true },
    { id: 'projects', label: 'Projects', icon: Plus, required: false },
    { id: 'achievements', label: 'Achievements', icon: Award, required: false }
  ]

  const templates = [
    // Professional Templates
    { 
      id: 'modern', 
      name: 'Modern Professional', 
      description: 'Clean contemporary design with blue accents', 
      category: 'professional', 
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/modern-preview.jpg'
    },
    { 
      id: 'classic', 
      name: 'Classic Executive', 
      description: 'Traditional professional format', 
      category: 'professional', 
      color: 'gray',
      image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/classic-preview.jpg'
    },
    { 
      id: 'corporate', 
      name: 'Corporate Elite', 
      description: 'Business-focused layout with navy theme', 
      category: 'professional', 
      color: 'navy',
      image: 'https://images.unsplash.com/photo-1586281380614-67ca8b3f8f25?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/corporate-preview.jpg'
    },
    { 
      id: 'executive', 
      name: 'Executive Summary', 
      description: 'Senior-level professional template', 
      category: 'professional', 
      color: 'black',
      image: 'https://images.unsplash.com/photo-1586281380923-93d9b4a79094?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/executive-preview.jpg'
    },
    
    // Creative Templates
    { 
      id: 'creative', 
      name: 'Creative Designer', 
      description: 'Unique layout for creative roles', 
      category: 'creative', 
      color: 'purple',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/creative-preview.jpg'
    },
    { 
      id: 'artistic', 
      name: 'Artistic Vision', 
      description: 'Bold and expressive design', 
      category: 'creative', 
      color: 'pink',
      image: 'https://images.unsplash.com/photo-1611224923642-308cefccbf6a?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/artistic-preview.jpg'
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio Showcase', 
      description: 'Project-focused layout', 
      category: 'creative', 
      color: 'orange',
      image: 'https://images.unsplash.com/photo-1611224923716-c7ad5ac9d5c5?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/portfolio-preview.jpg'
    },
    
    // Technical Templates
    { 
      id: 'developer', 
      name: 'Software Developer', 
      description: 'Code-focused layout with syntax highlighting', 
      category: 'technical', 
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/developer-preview.jpg'
    },
    { 
      id: 'engineer', 
      name: 'Engineering Pro', 
      description: 'Technical skills emphasis', 
      category: 'technical', 
      color: 'gray',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/engineer-preview.jpg'
    },
    { 
      id: 'data-scientist', 
      name: 'Data Scientist', 
      description: 'Analytics-focused design with charts', 
      category: 'technical', 
      color: 'green',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/data-scientist-preview.jpg'
    },
    
    // Academic Templates
    { 
      id: 'academic', 
      name: 'Academic Scholar', 
      description: 'Research-focused layout', 
      category: 'academic', 
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/academic-preview.jpg'
    },
    { 
      id: 'researcher', 
      name: 'Research Scientist', 
      description: 'Publication emphasis', 
      category: 'academic', 
      color: 'teal',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/researcher-preview.jpg'
    },
    
    // Minimal Templates
    { 
      id: 'minimal', 
      name: 'Minimal Clean', 
      description: 'Simple and elegant design', 
      category: 'minimal', 
      color: 'gray',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/minimal-preview.jpg'
    },
    { 
      id: 'simple', 
      name: 'Simple Professional', 
      description: 'Clean and straightforward', 
      category: 'minimal', 
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop&crop=top',
      preview: '/templates/simple-preview.jpg'
    }
  ]

  const templateCategories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'professional', label: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { id: 'creative', label: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'technical', label: 'Technical', count: templates.filter(t => t.category === 'technical').length },
    { id: 'academic', label: 'Academic', count: templates.filter(t => t.category === 'academic').length },
    { id: 'minimal', label: 'Minimal', count: templates.filter(t => t.category === 'minimal').length }
  ]

  const filteredTemplates = templateCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === templateCategory)

  const generateResumeWithAI = async () => {
    setIsGenerating(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock AI feedback
      setAiFeedback({
        score: 85,
        suggestions: [
          'Add more quantifiable achievements in your experience section',
          'Include relevant keywords for your target industry',
          'Optimize your skills section for ATS compatibility'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        grammar_issues: ['Check capitalization in job titles', 'Use consistent tense throughout']
      })
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadResume = (format: 'pdf' | 'image') => {
    // Mock download functionality
    const link = document.createElement('a')
    link.href = '#'
    link.download = `resume-${selectedTemplate}.${format}`
    link.click()
  }

  const updateResumeData = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Resume Template</h1>
        <p className="text-lg text-gray-600">Select from our collection of professional resume templates</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {templateCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setTemplateCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              templateCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="aspect-[3/4] relative">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${template.color}-100 text-${template.color}-800`}>
                {template.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      {selectedTemplate && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep('form')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue with {templates.find(t => t.id === selectedTemplate)?.name}
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      )}
    </div>
  )

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
          email: '',
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

  // Live Preview Component
  const renderLivePreview = () => {
    const selectedTemplateData = templates.find(t => t.id === selectedTemplate)
    
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
        <div className="p-4 text-xs">
          {/* Header */}
          <div className={`text-center pb-3 mb-3 border-b-2 ${
            selectedTemplateData?.color === 'blue' ? 'border-blue-500' :
            selectedTemplateData?.color === 'gray' ? 'border-gray-500' :
            'border-blue-500'
          }`}>
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              {resumeData.personal.fullName || 'Your Name'}
            </h1>
            <div className="flex justify-center items-center space-x-2 text-gray-600 text-xs">
              {resumeData.personal.email && (
                <span className="flex items-center">
                  <Mail className="w-2 h-2 mr-1" />
                  {resumeData.personal.email}
                </span>
              )}
              {resumeData.personal.phone && (
                <span className="flex items-center">
                  <Phone className="w-2 h-2 mr-1" />
                  {resumeData.personal.phone}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {resumeData.personal.summary && (
            <div className="mb-3">
              <h2 className="text-sm font-semibold mb-1 text-blue-600">Summary</h2>
              <p className="text-gray-700 text-xs leading-tight">{resumeData.personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="mb-3">
              <h2 className="text-sm font-semibold mb-1 text-blue-600">Experience</h2>
              {resumeData.experience.slice(0, 2).map((exp, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">{exp.title}</h3>
                      <p className="text-gray-700 text-xs">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 text-xs">{exp.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div className="mb-3">
              <h2 className="text-sm font-semibold mb-1 text-blue-600">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {resumeData.skills.slice(0, 8).map((skill, index) => (
                  <span key={index} className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main Render Function with Step Flow
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {currentStep === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {renderTemplateSelection()}
          </motion.div>
        )}

        {currentStep === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen"
          >
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6 overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Build Your Resume</h1>
                  <p className="text-gray-600">Fill in your information</p>
                </div>
                <button
                  onClick={() => setCurrentStep('template')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Change Template
                </button>
              </div>

              {/* Section Navigation */}
              <div className="flex flex-wrap gap-2">
                {sectionTypes.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {activeSection === 'personal' && renderPersonalInfo()}
                {activeSection === 'education' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Education</h3>
                    <p className="text-gray-600">Add your educational background</p>
                  </div>
                )}
                {activeSection === 'experience' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Experience</h3>
                    <p className="text-gray-600">Add your work experience</p>
                  </div>
                )}
                {activeSection === 'skills' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    <p className="text-gray-600">List your technical and soft skills</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('template')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back to Templates
                </button>
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Preview Resume
                  <Eye className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="bg-gray-50 p-6 overflow-y-auto">
              <div className="sticky top-0 bg-gray-50 pb-4 mb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-600">See your resume update in real-time</p>
              </div>
              {renderLivePreview()}
            </div>
          </motion.div>
        )}

        {currentStep === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Resume is Ready!</h1>
              <p className="text-lg text-gray-600">Review and download your professional resume</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="max-w-2xl">
                {renderLivePreview()}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep('form')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Edit Resume
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = '#'
                  link.download = `resume-${selectedTemplate}.pdf`
                  link.click()
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
