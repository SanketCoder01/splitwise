'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, CheckCircle, FileText, Award, Users, Star, 
  ArrowRight, ChevronDown, ChevronUp, Brain, Zap,
  Clock, TrendingUp, Lock, Unlock, AlertCircle,
  Phone, Mail, MapPin, ExternalLink, Download,
  User, Building, Globe, BookOpen, Target
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ResumeVerifierInfoPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your resume with 94.2% accuracy",
      details: "Our machine learning models scan through education, experience, skills, and achievements to provide comprehensive verification.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Document Verification",
      description: "Verify certificates, degrees, and experience letters",
      details: "Integration with NAD (National Academic Depository) and DigiLocker for authentic document verification.",
      color: "blue"
    },
    {
      icon: Users,
      title: "GitHub & LinkedIn Verification",
      description: "Validate your professional profiles and repositories",
      details: "Automatic verification of GitHub contributions, LinkedIn profile authenticity, and professional network validation.",
      color: "green"
    },
    {
      icon: Target,
      title: "Skills Assessment",
      description: "Take skill-based assessments to validate your expertise",
      details: "Interactive quizzes and practical assessments to verify technical and soft skills mentioned in your resume.",
      color: "orange"
    },
    {
      icon: Award,
      title: "Government Certificate",
      description: "Get official government-verified resume certificate",
      details: "Receive a blockchain-secured digital certificate that employers can trust and verify instantly.",
      color: "red"
    },
    {
      icon: TrendingUp,
      title: "Fraud Detection",
      description: "97.2% accuracy in detecting resume fraud and inconsistencies",
      details: "Advanced algorithms detect fake experiences, inflated skills, and inconsistent information patterns.",
      color: "indigo"
    }
  ]

  const stats = [
    { number: "50,000+", label: "Resumes Verified", icon: FileText },
    { number: "94.2%", label: "Accuracy Rate", icon: Target },
    { number: "97.2%", label: "Fraud Detection", icon: Shield },
    { number: "15 min", label: "Average Time", icon: Clock }
  ]

  const verificationSteps = [
    {
      step: 1,
      title: "Upload Resume",
      description: "Upload your resume in PDF, DOC, or DOCX format",
      icon: FileText,
      duration: "2 min"
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your resume for accuracy and completeness",
      icon: Brain,
      duration: "3-5 min"
    },
    {
      step: 3,
      title: "Document Verification",
      description: "Verify certificates and educational documents",
      icon: Shield,
      duration: "5-10 min"
    },
    {
      step: 4,
      title: "Profile Validation",
      description: "Validate GitHub, LinkedIn, and professional profiles",
      icon: Users,
      duration: "3-7 min"
    },
    {
      step: 5,
      title: "Skills Assessment",
      description: "Take assessments to validate your technical skills",
      icon: Target,
      duration: "10-15 min"
    },
    {
      step: 6,
      title: "Get Certificate",
      description: "Receive your government-verified resume certificate",
      icon: Award,
      duration: "Instant"
    }
  ]

  const faqs = [
    {
      q: "How accurate is the AI resume verification?",
      a: "Our AI system has a 94.2% accuracy rate in resume analysis and 97.2% accuracy in fraud detection, backed by machine learning models trained on millions of verified resumes."
    },
    {
      q: "What documents can be verified?",
      a: "We can verify educational certificates, degree certificates, experience letters, skill certifications, and government-issued documents through NAD and DigiLocker integration."
    },
    {
      q: "How long does the verification process take?",
      a: "The complete verification process typically takes 15-30 minutes, depending on the complexity of your resume and the number of documents to verify."
    },
    {
      q: "Is the verification certificate recognized by employers?",
      a: "Yes, our government-issued digital certificates are blockchain-secured and recognized by government departments, PSUs, and major private companies across India."
    },
    {
      q: "What happens if discrepancies are found?",
      a: "If our system detects inconsistencies, you'll receive a detailed report highlighting the issues. You can then provide additional documentation or corrections."
    },
    {
      q: "Can I verify multiple versions of my resume?",
      a: "Yes, you can verify multiple resume versions. Each verification generates a unique certificate linked to that specific resume version."
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
                <h1 className="text-xl font-bold text-gray-900">Government Internship Portal</h1>
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
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-12 h-12 text-purple-200" />
                <h1 className="text-4xl lg:text-5xl font-bold">
                  Resume Verifier
                </h1>
              </div>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Get your resume verified by AI-powered government system. Ensure authenticity, 
                detect fraud, and receive official certification trusted by employers nationwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Start Verification
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Login to Continue
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
                      <stat.icon className="w-8 h-8 text-purple-200 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white">{stat.number}</div>
                      <div className="text-purple-200 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Advanced Verification Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive verification system uses cutting-edge technology to ensure 
              your resume is authentic, accurate, and trusted by employers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white bg-opacity-20 rounded-xl">
                  {React.createElement(features[activeFeature].icon, {
                    className: "w-8 h-8 text-white"
                  })}
                </div>
                <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
              </div>
              <p className="text-purple-100 text-lg leading-relaxed">
                {features[activeFeature].details}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Verification Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined 6-step process ensures comprehensive verification 
              while maintaining speed and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {verificationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <step.icon className="w-5 h-5 text-purple-600" />
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our resume verification process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Verify Your Resume?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have verified their resumes and gained 
              employer trust. Start your verification journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Shield className="mr-2 w-5 h-5" />
                Start Verification Now
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
              >
                <Phone className="mr-2 w-5 h-5" />
                Get Support
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
                  <h3 className="text-lg font-semibold">Government Internship Portal</h3>
                  <p className="text-sm text-gray-400">Ministry of Education</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Official government portal for internship opportunities and resume verification.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/schemes" className="hover:text-white transition-colors">Internship Schemes</Link></li>
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
