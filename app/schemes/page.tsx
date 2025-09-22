'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Cpu, 
  Target,
  Award,
  Shield,
  FileCheck,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  GraduationCap,
  Heart,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function SchemesPage() {
  const [selectedScheme, setSelectedScheme] = useState<number | null>(null)

  const schemes = [
    {
      id: 1,
      title: "PM Internship Scheme",
      department: "Ministry of Education",
      slots: "10,000+",
      icon: Users,
      color: "blue",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
      description: "Flagship internship program providing hands-on experience in government departments and public sector organizations.",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      eligibility: "Graduate/Post-graduate in any discipline",
      features: [
        "Direct mentorship from senior government officials",
        "Exposure to policy-making processes",
        "Certificate from Ministry of Education",
        "Networking opportunities with civil servants",
        "Potential for permanent recruitment"
      ],
      locations: ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
      applicationDeadline: "March 31, 2024",
      benefits: [
        "Monthly stipend with performance incentives",
        "Health insurance coverage",
        "Professional development workshops",
        "Access to government libraries and resources"
      ]
    },
    {
      id: 2,
      title: "Digital India Internship",
      department: "Ministry of Electronics & IT",
      slots: "5,000+",
      icon: Cpu,
      color: "green",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      description: "Technology-focused internships in AI, Machine Learning, Cybersecurity, and Digital Governance initiatives.",
      duration: "3-6 months",
      stipend: "₹30,000 - ₹50,000",
      eligibility: "Engineering/MCA/MSc in Computer Science/IT",
      features: [
        "Work on cutting-edge government tech projects",
        "Training in emerging technologies",
        "Collaboration with top tech companies",
        "Contribution to Digital India mission",
        "Industry-recognized certifications"
      ],
      locations: ["Bangalore", "Hyderabad", "Pune", "Chennai", "New Delhi"],
      applicationDeadline: "April 15, 2024",
      benefits: [
        "Higher stipend for technical roles",
        "Access to advanced computing resources",
        "Mentorship from industry experts",
        "Patent filing opportunities"
      ]
    },
    {
      id: 3,
      title: "Skill Development Program",
      department: "Ministry of Skill Development",
      slots: "15,000+",
      icon: Target,
      color: "purple",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      description: "Comprehensive skill development program with industry training and certification across various sectors.",
      duration: "3-9 months",
      stipend: "₹20,000 - ₹35,000",
      eligibility: "12th pass or equivalent, ITI/Diploma preferred",
      features: [
        "Industry-relevant skill training",
        "Hands-on practical experience",
        "Job placement assistance",
        "International certification programs",
        "Entrepreneurship development support"
      ],
      locations: ["Pan India - 500+ centers"],
      applicationDeadline: "Rolling admissions",
      benefits: [
        "Free training and certification",
        "Tool kit provided",
        "Placement guarantee for top performers",
        "Loan assistance for starting business"
      ]
    },
    {
      id: 4,
      title: "Research Internship",
      department: "DRDO & ISRO",
      slots: "2,000+",
      icon: Award,
      color: "orange",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
      description: "Research opportunities in defense technology, space science, and advanced engineering projects.",
      duration: "6-12 months",
      stipend: "₹35,000 - ₹60,000",
      eligibility: "BTech/MTech/PhD in Engineering/Science",
      features: [
        "Work on classified defense projects",
        "Access to advanced research facilities",
        "Publication opportunities in journals",
        "Collaboration with international researchers",
        "Potential for permanent scientist positions"
      ],
      locations: ["Bangalore", "Hyderabad", "Delhi", "Mumbai", "Thiruvananthapuram"],
      applicationDeadline: "May 30, 2024",
      benefits: [
        "Highest stipend category",
        "Research publication support",
        "International conference participation",
        "Patent filing assistance"
      ]
    },
    {
      id: 5,
      title: "Banking Sector Internship",
      department: "Ministry of Finance",
      slots: "8,000+",
      icon: Shield,
      color: "indigo",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      description: "Financial sector internships in public sector banks, RBI, and financial regulatory bodies.",
      duration: "4-8 months",
      stipend: "₹28,000 - ₹45,000",
      eligibility: "Commerce/Economics/Finance/MBA graduates",
      features: [
        "Exposure to banking operations",
        "Training in financial regulations",
        "Customer service experience",
        "Digital banking initiatives",
        "Risk management training"
      ],
      locations: ["Mumbai", "New Delhi", "Kolkata", "Chennai", "Bangalore"],
      applicationDeadline: "June 15, 2024",
      benefits: [
        "Banking sector certification",
        "Loan processing training",
        "Financial planning workshops",
        "Career guidance sessions"
      ]
    },
    {
      id: 6,
      title: "Healthcare Internship",
      department: "Ministry of Health",
      slots: "12,000+",
      icon: Heart,
      color: "red",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      description: "Healthcare sector internships in hospitals, research institutes, and public health programs.",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      eligibility: "MBBS/BDS/Nursing/Pharmacy/Allied Health graduates",
      features: [
        "Clinical experience in government hospitals",
        "Public health program participation",
        "Medical research opportunities",
        "Rural healthcare exposure",
        "Telemedicine training"
      ],
      locations: ["AIIMS centers", "Government Medical Colleges", "District Hospitals"],
      applicationDeadline: "July 31, 2024",
      benefits: [
        "Medical insurance coverage",
        "Accommodation in hospital hostels",
        "Continuing medical education credits",
        "Rural service incentives"
      ]
    }
  ]

  const stats = [
    { label: "Total Internship Slots", value: "50,000+", icon: Users },
    { label: "Government Departments", value: "25+", icon: Building },
    { label: "Success Rate", value: "87%", icon: Target },
    { label: "Average Stipend", value: "₹32,000", icon: DollarSign }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government Header */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">🇮🇳 भारत सरकार | Government of India</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <button className="hover:text-gray-800">हिंदी</button>
              <span>|</span>
              <button className="hover:text-gray-800">English</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">PM Internship & Resume Verifier</h1>
                <p className="text-sm text-gray-600">MINISTRY OF EDUCATION</p>
                <p className="text-xs text-gray-500">Government of India</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 via-white to-green-600 rounded-lg p-1 mb-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Government Internship Schemes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore diverse internship opportunities across various government ministries and departments. 
              Each scheme is designed to provide valuable experience and contribute to nation-building.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-200"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Scheme Header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={scheme.image}
                  alt={scheme.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-6 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        scheme.color === 'blue' ? 'bg-blue-600' :
                        scheme.color === 'green' ? 'bg-green-600' :
                        scheme.color === 'purple' ? 'bg-purple-600' :
                        scheme.color === 'orange' ? 'bg-orange-600' :
                        scheme.color === 'indigo' ? 'bg-indigo-600' :
                        'bg-red-600'
                      }`}>
                        <scheme.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{scheme.title}</h3>
                        <p className="text-sm opacity-90">{scheme.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="bg-white/20 px-2 py-1 rounded">{scheme.slots} slots</span>
                      <span className="bg-white/20 px-2 py-1 rounded">{scheme.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheme Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{scheme.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Stipend</span>
                    </div>
                    <p className="font-semibold text-gray-900">{scheme.stipend}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline</span>
                    </div>
                    <p className="font-semibold text-gray-900">{scheme.applicationDeadline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Eligibility</span>
                  </div>
                  <p className="text-sm text-gray-700">{scheme.eligibility}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                  <ul className="space-y-1">
                    {scheme.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {scheme.features.length > 3 && (
                    <button
                      onClick={() => setSelectedScheme(selectedScheme === scheme.id ? null : scheme.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                    >
                      {selectedScheme === scheme.id ? 'Show less' : `+${scheme.features.length - 3} more features`}
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedScheme === scheme.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 pt-4 mb-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">All Features</h4>
                        <ul className="space-y-1">
                          {scheme.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Additional Benefits</h4>
                        <ul className="space-y-1">
                          {scheme.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                              <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Locations</h4>
                        <div className="flex flex-wrap gap-2">
                          {scheme.locations.map((location, locationIndex) => (
                            <span key={locationIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex space-x-3">
                  <Link
                    href="/register"
                    className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                      scheme.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      scheme.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                      scheme.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                      scheme.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                      scheme.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' :
                      'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    Apply Now
                  </Link>
                  <Link
                    href="/eligibility"
                    className="flex-1 text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Check Eligibility
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Government Career?</h2>
            <p className="text-xl mb-6 opacity-90">
              Choose from our diverse range of internship schemes and take the first step towards serving the nation!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Application
              </Link>
              <Link 
                href="/roadmap" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors"
              >
                View Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
