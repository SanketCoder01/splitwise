'use client'

import { motion } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MessageSquare,
  Globe,
  Clock,
  MapPin,
  HelpCircle,
  FileText,
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  Search,
  BookOpen,
  Headphones
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('contact')
  const [searchQuery, setSearchQuery] = useState('')

  const contactMethods = [
    {
      title: "24/7 Helpline",
      description: "Toll-free support for urgent queries",
      icon: Phone,
      contact: "1800-11-4444",
      availability: "Available 24/7",
      color: "blue",
      response: "Immediate"
    },
    {
      title: "Email Support",
      description: "Detailed assistance via email",
      icon: Mail,
      contact: "support@pminternship.gov.in",
      availability: "Mon-Fri, 9 AM - 6 PM",
      color: "green",
      response: "Within 24 hours"
    },
    {
      title: "Live Chat",
      description: "Real-time chat with support agents",
      icon: MessageSquare,
      contact: "Available on website",
      availability: "Mon-Fri, 9 AM - 6 PM",
      color: "purple",
      response: "Within 5 minutes"
    },
    {
      title: "Regional Offices",
      description: "Visit nearest government office",
      icon: MapPin,
      contact: "Find nearest office",
      availability: "Mon-Fri, 10 AM - 5 PM",
      color: "orange",
      response: "Same day"
    }
  ]

  const faqs = [
    {
      category: "Application Process",
      questions: [
        {
          q: "How do I apply for PM Internship Program?",
          a: "Visit our portal, create an account, complete your profile, verify documents, and apply for available positions."
        },
        {
          q: "What documents are required for application?",
          a: "Aadhaar card, educational certificates, character certificate, medical fitness certificate, and recent photograph."
        },
        {
          q: "Can I apply for multiple internships?",
          a: "Yes, you can apply for multiple positions, but ensure you meet the eligibility criteria for each."
        }
      ]
    },
    {
      category: "Eligibility & Selection",
      questions: [
        {
          q: "What is the age limit for PM Internship Program?",
          a: "Age limit is 18-28 years with relaxation for SC/ST (+5 years) and OBC (+3 years) candidates."
        },
        {
          q: "What is the minimum educational qualification?",
          a: "Minimum 12th pass or equivalent. Graduate/Post-graduate preferred for technical positions."
        },
        {
          q: "How is the selection process conducted?",
          a: "Selection involves document verification, online assessment, interview, and final merit list preparation."
        }
      ]
    },
    {
      category: "Internship Details",
      questions: [
        {
          q: "What is the duration of internships?",
          a: "Internship duration varies from 3-12 months depending on the program and ministry requirements."
        },
        {
          q: "What stipend will I receive?",
          a: "Stipend ranges from ₹25,000 to ₹50,000 per month based on qualification and role complexity."
        },
        {
          q: "Will I get a certificate after completion?",
          a: "Yes, you will receive an official government certificate upon successful completion of the internship."
        }
      ]
    }
  ]

  const supportCategories = [
    {
      title: "Technical Support",
      description: "Website issues, login problems, application errors",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Application Help",
      description: "Guidance on filling forms, document upload, status tracking",
      icon: FileText,
      color: "green"
    },
    {
      title: "Eligibility Queries",
      description: "Age limits, educational requirements, category-wise criteria",
      icon: Users,
      color: "purple"
    },
    {
      title: "Document Verification",
      description: "Certificate validation, Aadhaar linking, DigiLocker integration",
      icon: Shield,
      color: "orange"
    }
  ]

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

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
              Support & Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive support for your PM Internship Program journey. 
              Our dedicated team is here to assist you 24/7 with any questions or concerns.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'contact', label: 'Contact Support', icon: Headphones },
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
                { id: 'resources', label: 'Resources', icon: BookOpen }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-8">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white border-2 rounded-lg p-6 text-center hover:shadow-lg transition-all ${
                        method.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
                        method.color === 'green' ? 'border-green-200 hover:border-green-400' :
                        method.color === 'purple' ? 'border-purple-200 hover:border-purple-400' :
                        'border-orange-200 hover:border-orange-400'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        method.color === 'blue' ? 'bg-blue-100' :
                        method.color === 'green' ? 'bg-green-100' :
                        method.color === 'purple' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <method.icon className={`w-8 h-8 ${
                          method.color === 'blue' ? 'text-blue-600' :
                          method.color === 'green' ? 'text-green-600' :
                          method.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{method.contact}</p>
                        <p className="text-xs text-gray-500">{method.availability}</p>
                        <p className={`text-xs font-medium ${
                          method.color === 'blue' ? 'text-blue-600' :
                          method.color === 'green' ? 'text-green-600' :
                          method.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`}>
                          Response: {method.response}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Support Categories */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What can we help you with?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supportCategories.map((category, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          category.color === 'blue' ? 'bg-blue-100' :
                          category.color === 'green' ? 'bg-green-100' :
                          category.color === 'purple' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          <category.icon className={`w-5 h-5 ${
                            category.color === 'blue' ? 'text-blue-600' :
                            category.color === 'green' ? 'text-green-600' :
                            category.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.title}</h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {(searchQuery ? filteredFaqs : faqs).map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {category.questions.map((faq, faqIndex) => (
                          <div key={faqIndex} className="p-6">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-start">
                              <HelpCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                              {faq.q}
                            </h4>
                            <p className="text-gray-700 ml-7">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "User Manual",
                      description: "Complete guide to using the PM Internship Portal",
                      icon: BookOpen,
                      link: "/manual.pdf",
                      color: "blue"
                    },
                    {
                      title: "Video Tutorials",
                      description: "Step-by-step video guides for common tasks",
                      icon: Users,
                      link: "/tutorials",
                      color: "green"
                    },
                    {
                      title: "Application Guidelines",
                      description: "Detailed instructions for application process",
                      icon: FileText,
                      link: "/guidelines.pdf",
                      color: "purple"
                    },
                    {
                      title: "Technical Requirements",
                      description: "System requirements and browser compatibility",
                      icon: Globe,
                      link: "/tech-requirements",
                      color: "orange"
                    },
                    {
                      title: "Troubleshooting Guide",
                      description: "Solutions to common technical issues",
                      icon: AlertCircle,
                      link: "/troubleshooting",
                      color: "red"
                    },
                    {
                      title: "Success Stories",
                      description: "Read about successful internship experiences",
                      icon: CheckCircle,
                      link: "/success-stories",
                      color: "teal"
                    }
                  ].map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                        resource.color === 'blue' ? 'bg-blue-100' :
                        resource.color === 'green' ? 'bg-green-100' :
                        resource.color === 'purple' ? 'bg-purple-100' :
                        resource.color === 'orange' ? 'bg-orange-100' :
                        resource.color === 'red' ? 'bg-red-100' :
                        'bg-teal-100'
                      }`}>
                        <resource.icon className={`w-6 h-6 ${
                          resource.color === 'blue' ? 'text-blue-600' :
                          resource.color === 'green' ? 'text-green-600' :
                          resource.color === 'purple' ? 'text-purple-600' :
                          resource.color === 'orange' ? 'text-orange-600' :
                          resource.color === 'red' ? 'text-red-600' :
                          'text-teal-600'
                        }`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      <Link 
                        href={resource.link}
                        className={`text-sm font-medium hover:underline ${
                          resource.color === 'blue' ? 'text-blue-600' :
                          resource.color === 'green' ? 'text-green-600' :
                          resource.color === 'purple' ? 'text-purple-600' :
                          resource.color === 'orange' ? 'text-orange-600' :
                          resource.color === 'red' ? 'text-red-600' :
                          'text-teal-600'
                        }`}
                      >
                        Access Resource →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Emergency Support</h3>
              <p className="text-red-800 mb-3">
                For urgent technical issues or critical application problems, contact our emergency helpline:
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">1800-11-HELP (4357)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">emergency@pminternship.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
