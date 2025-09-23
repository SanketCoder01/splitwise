'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Building, Globe, BookOpen, Cpu, Shield, 
  Heart, TrendingUp, Award, Clock, MapPin, DollarSign,
  ArrowRight, ChevronDown, ChevronUp, Star, Target,
  Phone, Mail, ExternalLink, Download, FileText,
  GraduationCap, Briefcase, Calendar, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function InternshipSchemesInfoPage() {
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const schemes = [
    {
      id: 1,
      title: "PM Internship Scheme",
      department: "Ministry of Education",
      ministry: "Ministry of Education",
      icon: Users,
      color: "blue",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      description: "Flagship internship program providing hands-on experience in government departments and public sector organizations.",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      eligibility: "Graduate/Post-graduate in any discipline",
      features: ["Direct mentorship from senior officials", "Policy exposure and training", "Government certificate", "Networking opportunities"],
      locations: ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
      deadline: "31st March 2024",
      slots: 10000,
      benefits: [
        "Monthly stipend of ₹25,000 - ₹40,000",
        "Official government certificate",
        "Direct exposure to policy making",
        "Mentorship from senior bureaucrats",
        "Networking with government officials",
        "Career guidance and counseling"
      ]
    },
    {
      id: 2,
      title: "Digital India Internship",
      department: "Ministry of Electronics and IT",
      ministry: "Ministry of Electronics and IT",
      icon: Cpu,
      color: "green",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      description: "Technology-focused internships in AI, Machine Learning, Cybersecurity, and Digital Governance initiatives.",
      duration: "3-6 months",
      stipend: "₹30,000 - ₹50,000",
      eligibility: "Engineering/MCA/MSc in Computer Science/IT",
      features: ["Tech project assignments", "Innovation lab access", "Startup ecosystem exposure", "Industry mentorship"],
      locations: ["Hyderabad", "Pune", "Chennai", "Bangalore", "Gurugram"],
      deadline: "15th April 2024",
      slots: 5000,
      benefits: [
        "Higher stipend for tech roles",
        "Access to government tech labs",
        "Exposure to cutting-edge projects",
        "Industry expert mentorship",
        "Startup incubation opportunities",
        "Technical certification"
      ]
    },
    {
      id: 3,
      title: "Skill Development Internship",
      department: "Ministry of Skill Development",
      ministry: "Ministry of Skill Development and Entrepreneurship",
      icon: TrendingUp,
      color: "purple",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      description: "Comprehensive skill development programs focusing on employability and entrepreneurship training.",
      duration: "4-8 months",
      stipend: "₹20,000 - ₹35,000",
      eligibility: "12th pass to Post-graduate, all streams",
      features: ["Skill certification", "Entrepreneurship training", "Industry partnerships", "Job placement assistance"],
      locations: ["Pan India - 200+ centers"],
      deadline: "30th April 2024",
      slots: 15000,
      benefits: [
        "Industry-recognized skill certificates",
        "Entrepreneurship development training",
        "Job placement assistance",
        "Access to skill development centers",
        "Industry partnership programs",
        "Mentorship from successful entrepreneurs"
      ]
    },
    {
      id: 4,
      title: "Research & Innovation Internship",
      department: "Department of Science & Technology",
      ministry: "Ministry of Science and Technology",
      icon: BookOpen,
      color: "indigo",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
      description: "Research-oriented internships in scientific institutions, labs, and innovation centers across India.",
      duration: "6-12 months",
      stipend: "₹28,000 - ₹45,000",
      eligibility: "BTech/MSc/PhD in Science/Engineering",
      features: ["Research project participation", "Lab facility access", "Publication opportunities", "Conference participation"],
      locations: ["ISRO Centers", "DRDO Labs", "IITs", "IISc", "National Labs"],
      deadline: "20th March 2024",
      slots: 3000,
      benefits: [
        "Access to premier research facilities",
        "Research publication opportunities",
        "Conference presentation chances",
        "Collaboration with top scientists",
        "Advanced equipment training",
        "Research methodology certification"
      ]
    },
    {
      id: 5,
      title: "Banking & Finance Internship",
      department: "Department of Financial Services",
      ministry: "Ministry of Finance",
      icon: Shield,
      color: "yellow",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      description: "Financial sector internships in public sector banks, RBI, and financial regulatory bodies.",
      duration: "4-8 months",
      stipend: "₹28,000 - ₹45,000",
      eligibility: "Commerce/Economics/Finance/MBA graduates",
      features: ["Banking operations training", "Financial analysis projects", "Regulatory exposure", "Fintech initiatives"],
      locations: ["Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata"],
      deadline: "25th March 2024",
      slots: 4000,
      benefits: [
        "Banking sector exposure",
        "Financial analysis training",
        "Regulatory framework understanding",
        "Fintech project participation",
        "Industry networking opportunities",
        "Professional certification"
      ]
    },
    {
      id: 6,
      title: "Healthcare Internship",
      department: "Ministry of Health",
      ministry: "Ministry of Health and Family Welfare",
      icon: Heart,
      color: "red",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      description: "Healthcare sector internships in hospitals, research institutes, and public health programs.",
      duration: "6-12 months",
      stipend: "₹25,000 - ₹40,000",
      eligibility: "MBBS/BDS/Nursing/Pharmacy/Allied Health graduates",
      features: ["Clinical exposure", "Public health programs", "Research participation", "Community health initiatives"],
      locations: ["AIIMS Centers", "Government Hospitals", "Medical Colleges", "Health Centers"],
      deadline: "10th April 2024",
      slots: 8000,
      benefits: [
        "Clinical practice exposure",
        "Public health program participation",
        "Medical research opportunities",
        "Community health initiatives",
        "Healthcare policy understanding",
        "Professional development"
      ]
    }
  ]

  const stats = [
    { number: "50,000+", label: "Total Slots", icon: Users },
    { number: "25+", label: "Departments", icon: Building },
    { number: "87%", label: "Success Rate", icon: Target },
    { number: "200+", label: "Locations", icon: MapPin }
  ]

  const applicationProcess = [
    {
      step: 1,
      title: "Registration",
      description: "Create account and complete profile",
      icon: Users,
      duration: "10 min"
    },
    {
      step: 2,
      title: "Document Verification",
      description: "Upload and verify required documents",
      icon: FileText,
      duration: "1-2 days"
    },
    {
      step: 3,
      title: "Scheme Selection",
      description: "Choose preferred internship schemes",
      icon: Target,
      duration: "5 min"
    },
    {
      step: 4,
      title: "Application Submission",
      description: "Submit application with required details",
      icon: CheckCircle,
      duration: "15 min"
    },
    {
      step: 5,
      title: "Selection Process",
      description: "Evaluation and interview process",
      icon: Award,
      duration: "2-4 weeks"
    },
    {
      step: 6,
      title: "Internship Begins",
      description: "Start your government internship",
      icon: Briefcase,
      duration: "As per scheme"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">PM Internship Portal</h1>
                <p className="text-sm text-gray-600">भारत सरकार | Government of India</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Building className="w-12 h-12 text-blue-200" />
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Internship Schemes
                </h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Explore comprehensive internship opportunities across government departments. 
                Gain valuable experience, earn stipends, and build your career with official government programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/eligibility"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Check Eligibility
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white">{stat.number}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schemes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Available Internship Schemes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from diverse internship opportunities across government departments 
              and ministries. Each scheme offers unique learning experiences and career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {schemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={scheme.image}
                    alt={scheme.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 bg-${scheme.color}-100 rounded-lg`}>
                        <scheme.icon className={`w-6 h-6 text-${scheme.color}-600`} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{scheme.title}</h3>
                    </div>
                    <p className="text-sm text-gray-200">{scheme.department}</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{scheme.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{scheme.stipend}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{scheme.slots.toLocaleString()} slots</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{scheme.deadline}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">View Details</span>
                    {expandedScheme === scheme.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {expandedScheme === scheme.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Eligibility</h4>
                        <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {scheme.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {scheme.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Locations</h4>
                        <div className="flex flex-wrap gap-2">
                          {scheme.locations.map((location, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Link
                          href="/register"
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Apply for this Scheme
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our streamlined 6-step process to apply for government internship schemes. 
              Simple, transparent, and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applicationProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <step.icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {step.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Start Your Government Internship?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have kickstarted their careers through 
              government internship schemes. Apply now and secure your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Users className="mr-2 w-5 h-5" />
                Apply Now
              </Link>
              <Link
                href="/eligibility"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                <CheckCircle className="mr-2 w-5 h-5" />
                Check Eligibility
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <div>
                  <h3 className="text-lg font-semibold">PM Internship Portal</h3>
                  <p className="text-sm text-gray-400">Ministry of Education</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Official government portal for internship opportunities across India.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/resume-verifier-info" className="hover:text-white transition-colors">Resume Verifier</Link></li>
                <li><Link href="/eligibility" className="hover:text-white transition-colors">Eligibility</Link></li>
                <li><Link href="/roadmap" className="hover:text-white transition-colors">Application Roadmap</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>1800-XXX-XXXX (Toll Free)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@pminternship.gov.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Government of India. All rights reserved. | Ministry of Education</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
