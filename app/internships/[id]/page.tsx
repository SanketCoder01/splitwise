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

interface Internship {
  id: string
  title: string
  company: string
  ministry: string
  location: string
  type: string
  duration: string
  stipend: string
  description: string
  requirements: string[]
  skills: string[]
  applications: number
  maxApplications: number
  deadline: string
  posted_by: string
  images: string[]
}

export default function InternshipDetailPage() {
  const params = useParams()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationStep, setApplicationStep] = useState(1)
  const [selectedResume, setSelectedResume] = useState<File | null>(null)
  const [availability, setAvailability] = useState('')
  const [internshipMonths, setInternshipMonths] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setInternship({
        id: params.id as string,
        title: 'Software Developer Intern',
        company: 'National Informatics Centre (NIC)',
        ministry: 'Ministry of Electronics & IT',
        location: 'New Delhi',
        type: 'Full-time',
        duration: '6 months',
        stipend: '₹35,000/month',
        description: 'Join our dynamic team at NIC and contribute to building digital infrastructure for India. You will work on cutting-edge government projects, develop web applications, and gain hands-on experience with modern technologies including React, Node.js, and cloud platforms.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          'Strong programming skills in JavaScript, Python, or Java',
          'Knowledge of web development frameworks',
          'Understanding of database concepts',
          'Good communication skills',
          'Indian citizenship required'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
        applications: 245,
        maxApplications: 500,
        deadline: '2024-02-15',
        posted_by: 'NIC Recruitment Team',
        images: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
        ]
      })
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
          <p className="text-gray-600">Loading internship details...</p>
        </div>
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h1>
          <Link href="/internships" className="text-blue-600 hover:text-blue-700">
            Back to Internships
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
              href="/internships"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Internships</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Internship Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{internship.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{internship.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {internship.ministry}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {internship.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">{internship.stipend}</div>
                  <div className="text-sm text-gray-500">Monthly Stipend</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{internship.duration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{internship.applications}/{internship.maxApplications}</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{internship.deadline}</div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Internship</h2>
              <p className="text-gray-600 leading-relaxed">{internship.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {internship.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Office & Work Environment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {internship.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Office environment ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for this Internship</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
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
                    <User className="w-4 h-4" />
                    <span>{internship.posted_by}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>recruitment@nic.in</span>
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
                  <span className="text-sm text-gray-600">Applications Received</span>
                  <span className="text-sm font-medium">{internship.applications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(internship.applications / internship.maxApplications) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{internship.maxApplications} max</span>
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
                  <h3 className="text-xl font-bold text-gray-900">Apply for Internship</h3>
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
                        applicationStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          applicationStep > step ? 'bg-blue-600' : 'bg-gray-200'
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
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
