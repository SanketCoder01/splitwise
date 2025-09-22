'use client'

import { useState } from 'react'
import { FileText, Download, Eye, Search, BookOpen, Video, HelpCircle, Users, Shield, Briefcase } from 'lucide-react'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface Manual {
  id: string
  title: string
  description: string
  category: 'student' | 'employer' | 'admin' | 'technical'
  type: 'pdf' | 'video' | 'interactive'
  size: string
  downloads: number
  lastUpdated: string
  language: 'english' | 'hindi' | 'both'
  icon: any
  color: string
}

const manuals: Manual[] = [
  {
    id: '1',
    title: 'Student Registration Guide',
    description: 'Complete step-by-step guide for student registration, profile creation, and document verification.',
    category: 'student',
    type: 'pdf',
    size: '2.5 MB',
    downloads: 15420,
    lastUpdated: '2024-01-15',
    language: 'both',
    icon: Users,
    color: 'blue'
  },
  {
    id: '2',
    title: 'Application Process Manual',
    description: 'Detailed instructions on how to search, apply, and track internship applications.',
    category: 'student',
    type: 'pdf',
    size: '3.2 MB',
    downloads: 12890,
    lastUpdated: '2024-01-10',
    language: 'both',
    icon: Briefcase,
    color: 'green'
  },
  {
    id: '3',
    title: 'Document Verification Tutorial',
    description: 'Learn how to verify your documents using Aadhaar and DigiLocker integration.',
    category: 'student',
    type: 'video',
    size: '45 min',
    downloads: 8750,
    lastUpdated: '2024-01-20',
    language: 'both',
    icon: Shield,
    color: 'purple'
  },
  {
    id: '4',
    title: 'Profile Completion Handbook',
    description: 'Comprehensive guide to complete your profile and increase selection chances.',
    category: 'student',
    type: 'interactive',
    size: 'Online',
    downloads: 9340,
    lastUpdated: '2024-01-18',
    language: 'english',
    icon: Users,
    color: 'orange'
  },
  {
    id: '5',
    title: 'Employer Partnership Manual',
    description: 'Guide for organizations wanting to partner and offer internship opportunities.',
    category: 'employer',
    type: 'pdf',
    size: '4.1 MB',
    downloads: 2150,
    lastUpdated: '2024-01-12',
    language: 'english',
    icon: Briefcase,
    color: 'indigo'
  },
  {
    id: '6',
    title: 'Internship Posting Guidelines',
    description: 'Instructions for employers on how to post and manage internship opportunities.',
    category: 'employer',
    type: 'pdf',
    size: '2.8 MB',
    downloads: 1890,
    lastUpdated: '2024-01-08',
    language: 'both',
    icon: FileText,
    color: 'red'
  },
  {
    id: '7',
    title: 'System Administration Guide',
    description: 'Technical manual for system administrators and government officials.',
    category: 'admin',
    type: 'pdf',
    size: '5.7 MB',
    downloads: 450,
    lastUpdated: '2024-01-22',
    language: 'english',
    icon: Shield,
    color: 'gray'
  },
  {
    id: '8',
    title: 'API Documentation',
    description: 'Technical documentation for developers integrating with the PM Internship Portal.',
    category: 'technical',
    type: 'interactive',
    size: 'Online',
    downloads: 680,
    lastUpdated: '2024-01-25',
    language: 'english',
    icon: FileText,
    color: 'cyan'
  },
  {
    id: '9',
    title: 'Troubleshooting Guide',
    description: 'Common issues and their solutions for students and employers.',
    category: 'technical',
    type: 'pdf',
    size: '1.9 MB',
    downloads: 3420,
    lastUpdated: '2024-01-14',
    language: 'both',
    icon: HelpCircle,
    color: 'yellow'
  },
  {
    id: '10',
    title: 'Mobile App User Guide',
    description: 'Complete guide for using the PM Internship Portal mobile application.',
    category: 'student',
    type: 'video',
    size: '30 min',
    downloads: 5670,
    lastUpdated: '2024-01-16',
    language: 'hindi',
    icon: Users,
    color: 'pink'
  }
]

const categories = [
  { id: 'all', label: 'All Manuals', icon: BookOpen },
  { id: 'student', label: 'Student Guides', icon: Users },
  { id: 'employer', label: 'Employer Guides', icon: Briefcase },
  { id: 'admin', label: 'Admin Guides', icon: Shield },
  { id: 'technical', label: 'Technical Docs', icon: FileText }
]

const typeFilters = [
  { id: 'all', label: 'All Types' },
  { id: 'pdf', label: 'PDF Documents' },
  { id: 'video', label: 'Video Tutorials' },
  { id: 'interactive', label: 'Interactive Guides' }
]

export default function ManualsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory
    const matchesType = selectedType === 'all' || manual.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'video': return Video
      case 'interactive': return BookOpen
      default: return FileText
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600',
      gray: 'from-gray-500 to-gray-600',
      cyan: 'from-cyan-500 to-cyan-600',
      yellow: 'from-yellow-500 to-yellow-600',
      pink: 'from-pink-500 to-pink-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            User Manuals & Documentation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access comprehensive guides, tutorials, and documentation to help you navigate 
            the PM Internship Portal effectively. Available in multiple formats and languages.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{manuals.length}</div>
            <div className="text-sm text-gray-600">Total Manuals</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {manuals.reduce((sum, manual) => sum + manual.downloads, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Video className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {manuals.filter(m => m.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600">Video Tutorials</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {manuals.filter(m => m.language === 'both').length}
            </div>
            <div className="text-sm text-gray-600">Bilingual Guides</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search manuals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {typeFilters.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                Download All PDFs
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manuals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuals.map((manual) => {
            const TypeIcon = getTypeIcon(manual.type)
            return (
              <div key={manual.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${getColorClasses(manual.color)} rounded-t-lg`}></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <manual.icon className="w-8 h-8 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                          {manual.title}
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <TypeIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500 uppercase font-medium">
                            {manual.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {manual.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{manual.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span className="font-medium">{manual.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="font-medium">{new Date(manual.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium capitalize">
                        {manual.language === 'both' ? 'English & Hindi' : manual.language}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {manual.type === 'interactive' ? (
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Open Guide
                      </button>
                    ) : (
                      <>
                        <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredManuals.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No manuals found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Need Additional Help?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find the manual you're looking for? Our support team is ready to assist you 
            with personalized guidance and additional resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors">
              Request New Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
