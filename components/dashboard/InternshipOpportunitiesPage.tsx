'use client'

import { motion } from 'framer-motion'
import { Building, MapPin, Clock, Users, Star, Search, Filter } from 'lucide-react'
import { useState } from 'react'

export default function InternshipOpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const internships = [
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'Ministry of Electronics & IT',
      location: 'New Delhi',
      duration: '6 months',
      stipend: '₹25,000/month',
      applicants: 245,
      rating: 4.8,
      tags: ['React', 'Node.js', 'MongoDB'],
      deadline: '2024-02-15',
      description: 'Work on government digital initiatives and e-governance projects.'
    },
    {
      id: 2,
      title: 'Data Analytics Intern',
      company: 'Ministry of Finance',
      location: 'Mumbai',
      duration: '4 months',
      stipend: '₹20,000/month',
      applicants: 189,
      rating: 4.6,
      tags: ['Python', 'SQL', 'Tableau'],
      deadline: '2024-02-20',
      description: 'Analyze financial data and create insights for policy making.'
    },
    {
      id: 3,
      title: 'Digital Marketing Intern',
      company: 'Ministry of Information & Broadcasting',
      location: 'Bangalore',
      duration: '3 months',
      stipend: '₹18,000/month',
      applicants: 156,
      rating: 4.5,
      tags: ['SEO', 'Social Media', 'Content'],
      deadline: '2024-02-25',
      description: 'Promote government schemes and initiatives through digital channels.'
    }
  ]

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Building className="w-8 h-8 mr-3 text-orange-600" />
          Internship Opportunities
        </h2>
        <p className="text-gray-600 mb-6">Discover amazing internship opportunities in government sectors</p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{internships.length}</h3>
            <p className="text-sm text-blue-700">Available Positions</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">15+</h3>
            <p className="text-sm text-green-700">Government Ministries</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <h3 className="text-2xl font-bold text-orange-600">₹25K</h3>
            <p className="text-sm text-orange-700">Average Stipend</p>
          </div>
        </div>
      </div>

      {/* Internship Cards */}
      <div className="space-y-6">
        {filteredInternships.map((internship, index) => (
          <motion.div
            key={internship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Building className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{internship.title}</h3>
                  <p className="text-lg text-gray-600 mb-2">{internship.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {internship.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {internship.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {internship.applicants} applicants
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">{internship.stipend}</div>
                <div className="flex items-center justify-end mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">{internship.rating}</span>
                </div>
                <div className="text-sm text-red-600">Deadline: {internship.deadline}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{internship.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {internship.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Apply Now
              </motion.button>
              <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredInternships.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No internships found</h3>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </motion.div>
  )
}
