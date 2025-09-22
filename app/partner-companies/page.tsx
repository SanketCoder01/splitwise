'use client'

import { useState } from 'react'
import { Building, MapPin, Users, Briefcase, Search, Filter, ExternalLink, Star } from 'lucide-react'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface Company {
  id: string
  name: string
  logo: string
  sector: string
  location: string
  employees: string
  internships: number
  rating: number
  description: string
  website: string
  established: string
  type: 'government' | 'psu' | 'private'
}

const companies: Company[] = [
  {
    id: '1',
    name: 'National Informatics Centre (NIC)',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    sector: 'Information Technology',
    location: 'New Delhi',
    employees: '5000+',
    internships: 150,
    rating: 4.8,
    description: 'Premier IT organization of the Government of India providing e-governance solutions.',
    website: 'https://www.nic.in',
    established: '1976',
    type: 'government'
  },
  {
    id: '2',
    name: 'Indian Space Research Organisation (ISRO)',
    logo: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=100&h=100&fit=crop',
    sector: 'Aerospace & Defense',
    location: 'Bangalore',
    employees: '17000+',
    internships: 200,
    rating: 4.9,
    description: 'Space agency of India, known for cost-effective space missions and satellite technology.',
    website: 'https://www.isro.gov.in',
    established: '1969',
    type: 'government'
  },
  {
    id: '3',
    name: 'Bharat Heavy Electricals Limited (BHEL)',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop',
    sector: 'Power & Energy',
    location: 'New Delhi',
    employees: '40000+',
    internships: 300,
    rating: 4.6,
    description: 'Leading engineering and manufacturing company in energy-related/infrastructure sector.',
    website: 'https://www.bhel.com',
    established: '1964',
    type: 'psu'
  },
  {
    id: '4',
    name: 'Oil and Natural Gas Corporation (ONGC)',
    logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=100&h=100&fit=crop',
    sector: 'Oil & Gas',
    location: 'Mumbai',
    employees: '32000+',
    internships: 250,
    rating: 4.7,
    description: 'Largest crude oil and natural gas company in India.',
    website: 'https://www.ongcindia.com',
    established: '1956',
    type: 'psu'
  },
  {
    id: '5',
    name: 'Defence Research and Development Organisation (DRDO)',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop',
    sector: 'Defense Research',
    location: 'New Delhi',
    employees: '30000+',
    internships: 180,
    rating: 4.8,
    description: 'Premier agency under Department of Defence Research and Development.',
    website: 'https://www.drdo.gov.in',
    established: '1958',
    type: 'government'
  },
  {
    id: '6',
    name: 'Indian Railways',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop',
    sector: 'Transportation',
    location: 'New Delhi',
    employees: '1300000+',
    internships: 500,
    rating: 4.5,
    description: 'One of the largest railway networks in the world.',
    website: 'https://www.indianrailways.gov.in',
    established: '1853',
    type: 'government'
  },
  {
    id: '7',
    name: 'Steel Authority of India Limited (SAIL)',
    logo: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=100&h=100&fit=crop',
    sector: 'Steel & Mining',
    location: 'New Delhi',
    employees: '65000+',
    internships: 220,
    rating: 4.4,
    description: 'Leading steel-making company in India.',
    website: 'https://www.sail.co.in',
    established: '1973',
    type: 'psu'
  },
  {
    id: '8',
    name: 'Hindustan Aeronautics Limited (HAL)',
    logo: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=100&h=100&fit=crop',
    sector: 'Aerospace',
    location: 'Bangalore',
    employees: '27000+',
    internships: 160,
    rating: 4.6,
    description: 'State-owned aerospace and defence company.',
    website: 'https://www.hal-india.co.in',
    established: '1940',
    type: 'psu'
  }
]

const sectors = ['All Sectors', 'Information Technology', 'Aerospace & Defense', 'Power & Energy', 'Oil & Gas', 'Defense Research', 'Transportation', 'Steel & Mining', 'Aerospace']
const companyTypes = ['All Types', 'Government', 'PSU', 'Private']

export default function PartnerCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('All Sectors')
  const [selectedType, setSelectedType] = useState('All Types')

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === 'All Sectors' || company.sector === selectedSector
    const matchesType = selectedType === 'All Types' || 
                       (selectedType === 'Government' && company.type === 'government') ||
                       (selectedType === 'PSU' && company.type === 'psu') ||
                       (selectedType === 'Private' && company.type === 'private')
    
    return matchesSearch && matchesSector && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-green-100 text-green-800'
      case 'psu': return 'bg-blue-100 text-blue-800'
      case 'private': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'government': return 'Government'
      case 'psu': return 'PSU'
      case 'private': return 'Private'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Partner Companies
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our network of prestigious partner organizations offering internship opportunities. 
            From government departments to leading PSUs, find the perfect match for your career goals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{companies.length}+</div>
            <div className="text-sm text-gray-600">Partner Organizations</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {companies.reduce((sum, company) => sum + company.internships, 0)}+
            </div>
            <div className="text-sm text-gray-600">Active Internships</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">50,000+</div>
            <div className="text-sm text-gray-600">Students Placed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">4.7</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Sector Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
              >
                {companyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                        {company.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(company.type)}`}>
                    {getTypeLabel(company.type)}
                  </span>
                </div>

                {/* Company Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {company.sector}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {company.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {company.employees} employees
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {company.internships} active internships
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {company.description}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                    View Internships
                  </button>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Partnership Info */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white text-center">
          <Building className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Want to Partner with Us?</h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Join our network of partner organizations and help shape the future workforce. 
            Offer internships to talented students and contribute to nation-building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Become a Partner
            </button>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors">
              Contact Partnership Team
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
