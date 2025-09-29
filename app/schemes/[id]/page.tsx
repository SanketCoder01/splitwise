'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar,
  Building2, Award, CheckCircle, X, Upload, FileText,
  Camera, Monitor, AlertTriangle, User, Mail, Phone
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface Scheme {
  id: number
  title: string
  department: string
  slots: string
  duration: string
  stipend: string
  description: string
  eligibility: string
  features: string[]
  benefits: string[]
  locations: string[]
  applicationDeadline: string
  image: string
}

export default function SchemeDetailPage() {
  const params = useParams()
  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationStep, setApplicationStep] = useState(1)
  const [selectedResume, setSelectedResume] = useState<File | null>(null)
  const [availability, setAvailability] = useState('')
  const [internshipMonths, setInternshipMonths] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Mock schemes data - replace with actual API call
  const mockSchemes: Scheme[] = [
    {
      id: 1,
      title: "Government Internship Scheme",
      department: "Ministry of Education",
      slots: "10,000+",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      description: "Flagship internship program providing hands-on experience in government departments and public sector organizations.",
      eligibility: "Graduate/Post-graduate in any discipline",
      features: [
        "Direct mentorship from senior government officials",
        "Exposure to policy-making processes",
        "Certificate from Ministry of Education",
        "Networking opportunities with civil servants",
        "Potential for permanent recruitment"
      ],
      benefits: [
        "Health insurance coverage",
        "Travel allowance for official duties",
        "Access to government libraries and resources",
        "Professional development workshops"
      ],
      locations: ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
      applicationDeadline: "March 31, 2024",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Digital India Tech Internship",
      department: "Ministry of Electronics & IT",
      slots: "5,000+",
      duration: "4-8 months",
      stipend: "₹30,000 - ₹50,000",
      description: "Technology-focused program for developing digital solutions and contributing to India's digital transformation.",
      eligibility: "Engineering/Computer Science graduates",
      features: [
        "Work on cutting-edge government tech projects",
        "Exposure to AI, ML, and blockchain technologies",
        "Collaboration with top tech companies",
        "Open source contribution opportunities",
        "Fast-track recruitment in tech roles"
      ],
      benefits: [
        "Latest technology training",
        "Industry mentorship programs",
        "Patent filing support",
        "Startup incubation opportunities"
      ],
      locations: ["Bangalore", "Hyderabad", "Pune", "New Delhi"],
      applicationDeadline: "April 15, 2024",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Skill Development Internship",
      department: "Ministry of Skill Development",
      slots: "15,000+",
      duration: "3-9 months",
      stipend: "₹20,000 - ₹35,000",
      description: "Comprehensive skill development program with industry training and certification across various sectors.",
      eligibility: "12th pass or equivalent, ITI/Diploma preferred",
      features: [
        "Industry-relevant skill training",
        "Hands-on practical experience",
        "Job placement assistance",
        "International certification programs",
        "Entrepreneurship development support"
      ],
      benefits: [
        "Free training and certification",
        "Tool kit provided",
        "Placement guarantee for top performers",
        "Loan assistance for starting business"
      ],
      locations: ["Pan India - 500+ centers"],
      applicationDeadline: "Rolling admissions",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Research & Development Internship",
      department: "DRDO & ISRO",
      slots: "2,000+",
      duration: "6-12 months",
      stipend: "₹35,000 - ₹60,000",
      description: "Research opportunities in defense technology, space science, and advanced engineering projects.",
      eligibility: "BTech/MTech/PhD in Engineering/Science",
      features: [
        "Work on classified defense projects",
        "Access to advanced research facilities",
        "Publication opportunities in journals",
        "Collaboration with international researchers",
        "Potential for permanent scientist positions"
      ],
      benefits: [
        "Highest stipend category",
        "Research publication support",
        "International conference participation",
        "Patent filing assistance"
      ],
      locations: ["Bangalore", "Hyderabad", "Delhi", "Mumbai", "Thiruvananthapuram"],
      applicationDeadline: "May 30, 2024",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Banking & Finance Internship",
      department: "Ministry of Finance",
      slots: "8,000+",
      duration: "4-8 months",
      stipend: "₹28,000 - ₹45,000",
      description: "Financial sector internships in public sector banks, RBI, and financial regulatory bodies.",
      eligibility: "Commerce/Economics/Finance/MBA graduates",
      features: [
        "Exposure to banking operations",
        "Training in financial regulations",
        "Customer service experience",
        "Digital banking initiatives",
        "Risk management training"
      ],
      benefits: [
        "Banking sector experience",
        "Financial certification courses",
        "Networking with finance professionals",
        "Fast-track recruitment opportunities"
      ],
      locations: ["Mumbai", "New Delhi", "Kolkata", "Chennai", "Bangalore"],
      applicationDeadline: "June 15, 2024",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Healthcare & Medical Internship",
      department: "Ministry of Health",
      slots: "12,000+",
      duration: "6-18 months",
      stipend: "₹25,000 - ₹50,000",
      description: "Medical and healthcare internships in government hospitals, research institutes, and public health programs.",
      eligibility: "MBBS/BDS/Nursing/Pharmacy/Allied Health graduates",
      features: [
        "Clinical experience in government hospitals",
        "Public health program participation",
        "Medical research opportunities",
        "Rural healthcare exposure",
        "Specialization training programs"
      ],
      benefits: [
        "Medical insurance coverage",
        "Accommodation in hospital hostels",
        "Continuing medical education credits",
        "Rural service incentives"
      ],
      locations: ["AIIMS Centers", "Government Medical Colleges", "District Hospitals"],
      applicationDeadline: "July 31, 2024",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
    }
  ]

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const foundScheme = mockSchemes.find(s => s.id === parseInt(params.id as string))
      setScheme(foundScheme || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleApply = async () => {
    if (!selectedResume || !availability || !internshipMonths) {
      alert('Please fill all required fields')
      return
    }

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setShowApplyModal(false)
      alert('Application submitted successfully! You will receive a confirmation email shortly.')
      // Reset form
      setApplicationStep(1)
      setSelectedResume(null)
      setAvailability('')
      setInternshipMonths('')
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedResume(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scheme details...</p>
        </div>
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scheme Not Found</h1>
          <Link href="/schemes" className="text-blue-600 hover:text-blue-700">
            Back to Schemes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Government Internship Portal</h1>
                <p className="text-xs text-gray-600">Ministry of Education</p>
              </div>
            </div>
            <Link
              href="/schemes"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Schemes</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scheme Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{scheme.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{scheme.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Government Scheme
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">{scheme.stipend}</div>
                  <div className="text-sm text-gray-500">Monthly Stipend</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{scheme.slots}</div>
                  <div className="text-xs text-gray-500">Available Slots</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{scheme.duration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{scheme.applicationDeadline}</div>
                  <div className="text-xs text-gray-500">Deadline</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Certificate</div>
                  <div className="text-xs text-gray-500">Provided</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Scheme</h2>
              <p className="text-gray-600 leading-relaxed">{scheme.description}</p>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{scheme.eligibility}</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <ul className="space-y-2">
                {scheme.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <ul className="space-y-2">
                {scheme.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Award className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Locations</h2>
              <div className="flex flex-wrap gap-2">
                {scheme.locations.map((location, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Scheme Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={scheme.image}
                    alt="Scheme overview"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop"
                    alt="Government office"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
                    alt="Team collaboration"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for this Scheme</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Apply Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Save for Later
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{scheme.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>support@pminternship.gov.in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+91-11-2430-XXXX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Slots</span>
                  <span className="text-sm font-medium">{scheme.slots}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{scheme.slots} total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gray-50 pt-8"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Apply for Scheme</h3>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        applicationStep >= step ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          applicationStep > step ? 'bg-orange-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {applicationStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Choose Resume</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your resume (PDF only)</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700"
                      >
                        Choose File
                      </label>
                      {selectedResume && (
                        <p className="text-sm text-green-600 mt-2">✓ {selectedResume.name}</p>
                      )}
                    </div>
                  </div>
                )}

                {applicationStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Availability</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        When can you start?
                      </label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select availability</option>
                        <option value="immediately">Immediately</option>
                        <option value="1-week">Within 1 week</option>
                        <option value="2-weeks">Within 2 weeks</option>
                        <option value="1-month">Within 1 month</option>
                      </select>
                    </div>
                  </div>
                )}

                {applicationStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Internship Duration</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred duration (months)
                      </label>
                      <select
                        value={internshipMonths}
                        onChange={(e) => setInternshipMonths(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select duration</option>
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="9">9 months</option>
                        <option value="12">12 months</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setApplicationStep(Math.max(1, applicationStep - 1))}
                    disabled={applicationStep === 1}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {applicationStep < 3 ? (
                    <button
                      onClick={() => setApplicationStep(applicationStep + 1)}
                      disabled={
                        (applicationStep === 1 && !selectedResume) ||
                        (applicationStep === 2 && !availability)
                      }
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={submitting || !internshipMonths}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}