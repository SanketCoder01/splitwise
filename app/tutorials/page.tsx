'use client'

import { useState } from 'react'
import { Play, Clock, Users, Star, Search, Filter, BookOpen, Video, Download, Eye } from 'lucide-react'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface Tutorial {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  rating: number
  category: 'getting-started' | 'application' | 'profile' | 'documents' | 'advanced'
  level: 'beginner' | 'intermediate' | 'advanced'
  language: 'english' | 'hindi' | 'both'
  type: 'video' | 'interactive'
  instructor: string
  lastUpdated: string
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with PM Internship Portal',
    description: 'Complete introduction to the portal, registration process, and first steps for new students.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    duration: '12:30',
    views: 45230,
    rating: 4.8,
    category: 'getting-started',
    level: 'beginner',
    language: 'both',
    type: 'video',
    instructor: 'Dr. Priya Sharma',
    lastUpdated: '2024-01-20'
  },
  {
    id: '2',
    title: 'How to Create a Winning Profile',
    description: 'Step-by-step guide to complete your profile effectively and increase your selection chances.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    duration: '18:45',
    views: 32150,
    rating: 4.9,
    category: 'profile',
    level: 'beginner',
    language: 'both',
    type: 'video',
    instructor: 'Prof. Rajesh Kumar',
    lastUpdated: '2024-01-18'
  },
  {
    id: '3',
    title: 'Document Verification Made Easy',
    description: 'Learn how to verify your documents using Aadhaar and DigiLocker integration seamlessly.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    duration: '15:20',
    views: 28940,
    rating: 4.7,
    category: 'documents',
    level: 'beginner',
    language: 'both',
    type: 'video',
    instructor: 'Ms. Anita Verma',
    lastUpdated: '2024-01-15'
  },
  {
    id: '4',
    title: 'Mastering the Application Process',
    description: 'Advanced techniques for finding, applying, and tracking internship applications effectively.',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop',
    duration: '22:10',
    views: 19780,
    rating: 4.6,
    category: 'application',
    level: 'intermediate',
    language: 'english',
    type: 'video',
    instructor: 'Dr. Amit Patel',
    lastUpdated: '2024-01-12'
  },
  {
    id: '5',
    title: 'Interactive Profile Builder',
    description: 'Hands-on interactive tutorial to build your profile step-by-step with real-time feedback.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop',
    duration: '30:00',
    views: 15620,
    rating: 4.9,
    category: 'profile',
    level: 'beginner',
    language: 'both',
    type: 'interactive',
    instructor: 'Interactive Guide',
    lastUpdated: '2024-01-22'
  },
  {
    id: '6',
    title: 'Advanced Search and Filtering',
    description: 'Learn advanced search techniques to find internships that perfectly match your skills.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    duration: '16:35',
    views: 12340,
    rating: 4.5,
    category: 'advanced',
    level: 'advanced',
    language: 'english',
    type: 'video',
    instructor: 'Mr. Suresh Gupta',
    lastUpdated: '2024-01-10'
  },
  {
    id: '7',
    title: 'Resume Writing for Government Internships',
    description: 'Expert tips on creating resumes that stand out for government and PSU internships.',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=225&fit=crop',
    duration: '20:15',
    views: 25670,
    rating: 4.8,
    category: 'profile',
    level: 'intermediate',
    language: 'both',
    type: 'video',
    instructor: 'Dr. Meera Singh',
    lastUpdated: '2024-01-08'
  },
  {
    id: '8',
    title: 'Common Mistakes to Avoid',
    description: 'Learn about common pitfalls in applications and how to avoid them for better success rates.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
    duration: '14:50',
    views: 18920,
    rating: 4.7,
    category: 'application',
    level: 'beginner',
    language: 'hindi',
    type: 'video',
    instructor: 'Prof. Kavita Joshi',
    lastUpdated: '2024-01-05'
  }
]

const categories = [
  { id: 'all', label: 'All Tutorials', icon: BookOpen },
  { id: 'getting-started', label: 'Getting Started', icon: Play },
  { id: 'application', label: 'Applications', icon: Users },
  { id: 'profile', label: 'Profile Building', icon: Users },
  { id: 'documents', label: 'Documents', icon: BookOpen },
  { id: 'advanced', label: 'Advanced Tips', icon: Star }
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const languages = ['All Languages', 'English', 'Hindi', 'Both']

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    const matchesLevel = selectedLevel === 'All Levels' || tutorial.level === selectedLevel.toLowerCase()
    const matchesLanguage = selectedLanguage === 'All Languages' || 
                           tutorial.language === selectedLanguage.toLowerCase() ||
                           (selectedLanguage === 'Both' && tutorial.language === 'both')
    
    return matchesSearch && matchesCategory && matchesLevel && matchesLanguage
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tutorials & Guidance Videos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master the PM Internship Portal with our comprehensive video tutorials and interactive guides. 
            Learn from experts and boost your internship application success rate.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{tutorials.length}</div>
            <div className="text-sm text-gray-600">Total Tutorials</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {tutorials.reduce((sum, tutorial) => sum + tutorial.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">5.2h</div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">4.7</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>

            {/* Quick Action */}
            <button className="bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Download All
            </button>
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

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
                    <Play className="w-8 h-8 text-orange-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {tutorial.duration}
                </div>
                {tutorial.type === 'interactive' && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Interactive
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">
                    {tutorial.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {tutorial.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {tutorial.rating}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  <div>By {tutorial.instructor}</div>
                  <div>Updated: {new Date(tutorial.lastUpdated).toLocaleDateString()}</div>
                  <div>Language: {tutorial.language === 'both' ? 'English & Hindi' : tutorial.language}</div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    {tutorial.type === 'interactive' ? 'Start Guide' : 'Watch Now'}
                  </button>
                  {tutorial.type === 'video' && (
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutorials found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Learning Path */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Recommended Learning Path</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Follow our structured learning path to master the PM Internship Portal step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Getting Started', duration: '15 min' },
              { step: 2, title: 'Profile Building', duration: '30 min' },
              { step: 3, title: 'Document Verification', duration: '20 min' },
              { step: 4, title: 'Application Mastery', duration: '25 min' }
            ].map((item) => (
              <div key={item.step} className="bg-blue-500 bg-opacity-50 rounded-lg p-4 text-center">
                <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-blue-100">{item.duration}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Start Learning Path
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
