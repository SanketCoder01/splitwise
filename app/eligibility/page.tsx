'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  User, 
  GraduationCap, 
  MapPin, 
  Calendar,
  FileText,
  Award,
  Info,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function EligibilityPage() {
  const eligibilityCriteria = [
    {
      category: "Age Requirements",
      icon: User,
      color: "blue",
      requirements: [
        { text: "Minimum age: 18 years", eligible: true },
        { text: "Maximum age: 28 years", eligible: true },
        { text: "Age relaxation for SC/ST: +5 years", eligible: true },
        { text: "Age relaxation for OBC: +3 years", eligible: true }
      ]
    },
    {
      category: "Educational Qualifications",
      icon: GraduationCap,
      color: "green",
      requirements: [
        { text: "Minimum 12th pass or equivalent", eligible: true },
        { text: "Graduate/Post-graduate preferred", eligible: true },
        { text: "Technical/Professional courses accepted", eligible: true },
        { text: "Minimum 60% marks in qualifying exam", eligible: true }
      ]
    },
    {
      category: "Citizenship & Documentation",
      icon: FileText,
      color: "orange",
      requirements: [
        { text: "Indian citizen with valid Aadhaar", eligible: true },
        { text: "Valid educational certificates", eligible: true },
        { text: "Character certificate required", eligible: true },
        { text: "Medical fitness certificate", eligible: true }
      ]
    },
    {
      category: "Skills & Language",
      icon: Award,
      color: "purple",
      requirements: [
        { text: "Basic English proficiency", eligible: true },
        { text: "Hindi knowledge preferred", eligible: true },
        { text: "Computer literacy required", eligible: true },
        { text: "Domain-specific skills advantage", eligible: true }
      ]
    }
  ]

  const benefits = [
    {
      title: "Monthly Stipend",
      description: "₹25,000 - ₹50,000 per month based on qualification and role",
      icon: "💰"
    },
    {
      title: "Government Certificate",
      description: "Official certificate from Ministry of Education upon completion",
      icon: "🏆"
    },
    {
      title: "Skill Development",
      description: "Professional training and mentorship from industry experts",
      icon: "📚"
    },
    {
      title: "Career Opportunities",
      description: "Direct recruitment opportunities in government and PSUs",
      icon: "🚀"
    },
    {
      title: "Insurance Coverage",
      description: "Health and accident insurance during internship period",
      icon: "🛡️"
    },
    {
      title: "Networking",
      description: "Connect with government officials and industry professionals",
      icon: "🤝"
    }
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
              Eligibility Criteria
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check if you meet the requirements for PM Internship Program. 
              This flagship initiative aims to provide quality internship opportunities to India's youth.
            </p>
          </div>
        </div>

        {/* Eligibility Criteria Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {eligibilityCriteria.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className={`bg-gradient-to-r ${
                category.color === 'blue' ? 'from-blue-600 to-blue-700' :
                category.color === 'green' ? 'from-green-600 to-green-700' :
                category.color === 'orange' ? 'from-orange-600 to-orange-700' :
                'from-purple-600 to-purple-700'
              } text-white px-6 py-4 rounded-t-lg`}>
                <div className="flex items-center space-x-3">
                  <category.icon className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{category.category}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {category.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Program Benefits</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-3">{benefit.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• All documents must be original and verified</li>
                <li>• False information may lead to disqualification</li>
                <li>• Selection is based on merit and availability</li>
                <li>• Internship duration varies from 3-12 months</li>
                <li>• Regular attendance and performance evaluation required</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Need Help?</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Helpline</h3>
                <p className="text-gray-600">1800-XXX-XXXX</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
              </div>
              
              <div className="text-center">
                <Mail className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600">eligibility@pminternship.gov.in</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
              
              <div className="text-center">
                <Globe className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Online Resources</h3>
                <p className="text-gray-600">FAQ & Guidelines</p>
                <Link href="/help" className="text-sm text-teal-600 hover:text-teal-800">
                  Visit Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-xl mb-6 opacity-90">
              If you meet the eligibility criteria, start your application today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Application
              </Link>
              <Link 
                href="/internships" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors"
              >
                Browse Internships
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
