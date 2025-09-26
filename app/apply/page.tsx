'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Building2, FileText, CheckCircle, ArrowRight, 
  Clock, Shield, Award, Target, User, Mail, Phone,
  MapPin, Calendar, Upload, Download, Eye, AlertCircle,
  Home, ChevronRight, Briefcase, GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ApplyPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter'>('student')

  const downloadRecruiterForm = () => {
    // Create a simple PDF-like content for the registration form
    const formContent = `
PM INTERNSHIP PORTAL - RECRUITER REGISTRATION FORM
Ministry of Education, Government of India

ORGANIZATION DETAILS:
1. Organization Name: _________________________________
2. Organization Type: [ ] Government Department [ ] PSU [ ] Private Company [ ] Educational Institution
3. Registration Number: _______________________________
4. GST Number: ______________________________________
5. PAN Number: ______________________________________

CONTACT INFORMATION:
6. Registered Address: _______________________________
   City: _____________ State: _____________ PIN: _______
7. Office Address (if different): _______________________
   City: _____________ State: _____________ PIN: _______
8. Phone Number: ____________________________________
9. Email Address: ___________________________________
10. Website: _______________________________________

AUTHORIZED REPRESENTATIVE:
11. Name: _________________________________________
12. Designation: ___________________________________
13. Employee ID/Government ID: ______________________
14. Phone: _______________________________________
15. Email: _______________________________________

INTERNSHIP PROGRAM DETAILS:
16. Number of Interns Required: ______________________
17. Department/Division: ____________________________
18. Internship Duration: ____________________________
19. Stipend Amount (per month): ₹ ___________________
20. Preferred Skills: _______________________________

DOCUMENTS CHECKLIST (Attach copies):
[ ] Organization Registration Certificate
[ ] GST Registration Certificate  
[ ] PAN Card Copy
[ ] Authorized Representative ID Proof
[ ] Office Address Proof
[ ] Previous Internship Records (if any)
[ ] Letter of Authorization

DECLARATION:
I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to rejection of the application.

Signature: _________________    Date: _______________
Name: ____________________
Designation: ______________

INSTRUCTIONS:
1. Fill this form completely in BLOCK LETTERS
2. Attach all required documents
3. Send completed form and documents to: sanketg367@gmail.com
4. Subject Line: "PM Internship Portal - Recruiter Registration - [Organization Name]"
5. You will receive login credentials within 3-7 business days after verification
6. For queries, contact: sanketg367@gmail.com

Note: This is an official government form. Providing false information is a punishable offense.
    `
    
    const blob = new Blob([formContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'PM_Internship_Recruiter_Registration_Form.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const studentSteps = [
    {
      step: 1,
      title: "Profile Registration",
      description: "Create your account and complete your basic profile information",
      requirements: ["Valid Aadhaar Card", "Educational Certificates", "Recent Photograph"],
      duration: "5-10 minutes",
      icon: User
    },
    {
      step: 2,
      title: "Document Verification",
      description: "Upload and verify your educational documents through DigiLocker",
      requirements: ["DigiLocker Account", "Academic Transcripts", "Identity Proof"],
      duration: "2-3 days",
      icon: Shield
    },
    {
      step: 3,
      title: "Skills Assessment",
      description: "Complete online skills assessment and aptitude tests",
      requirements: ["Stable Internet Connection", "2-3 hours time", "Basic Computer Skills"],
      duration: "2-3 hours",
      icon: Target
    },
    {
      step: 4,
      title: "Resume Upload & AI Verification",
      description: "Upload your resume for AI-powered verification and matching",
      requirements: ["Updated Resume (PDF)", "Work Experience Details", "Skills Portfolio"],
      duration: "15-30 minutes",
      icon: FileText
    },
    {
      step: 5,
      title: "Internship Application",
      description: "Browse and apply for internships matching your profile",
      requirements: ["Completed Profile", "Verified Documents", "Cover Letter"],
      duration: "30-60 minutes",
      icon: Briefcase
    },
    {
      step: 6,
      title: "Selection Process",
      description: "Participate in interviews and selection rounds",
      requirements: ["Interview Preparation", "Professional Attire", "Communication Skills"],
      duration: "1-2 weeks",
      icon: Award
    }
  ]

  const recruiterSteps = [
    {
      step: 1,
      title: "Download Registration Form",
      description: "Download the official recruiter registration form and fill all required details",
      requirements: ["Download PDF Form", "Fill Organization Details", "Attach Required Documents"],
      duration: "30-45 minutes",
      icon: Download
    },
    {
      step: 2,
      title: "Submit Form via Email",
      description: "Send completed form and documents to government email for verification",
      requirements: ["Completed PDF Form", "All Required Documents", "Valid Email Address"],
      duration: "5-10 minutes",
      icon: Mail
    },
    {
      step: 3,
      title: "Government Verification",
      description: "Wait for government officials to verify your organization and documents",
      requirements: ["Valid Documents", "Government Approval", "Compliance Check"],
      duration: "3-7 business days",
      icon: Shield
    },
    {
      step: 4,
      title: "Receive Login Credentials",
      description: "Government will send login ID and password via email after verification",
      requirements: ["Email Verification", "Account Activation", "Password Setup"],
      duration: "1-2 business days",
      icon: CheckCircle
    },
    {
      step: 5,
      title: "Access Recruiter Portal",
      description: "Login to recruiter dashboard and start posting internship opportunities",
      requirements: ["Valid Login Credentials", "Portal Access", "Dashboard Training"],
      duration: "15-30 minutes",
      icon: Briefcase
    },
    {
      step: 6,
      title: "Student Selection",
      description: "Review applications and conduct selection process",
      requirements: ["Interview Process", "Selection Criteria", "Feedback System"],
      duration: "Ongoing",
      icon: Users
    }
  ]

  const studentDocuments = [
    "Aadhaar Card (Original & Copy)",
    "Educational Certificates (10th, 12th, Graduation)",
    "Academic Transcripts/Mark sheets",
    "Recent Passport Size Photographs",
    "Caste Certificate (if applicable)",
    "Income Certificate (if applicable)",
    "Bank Account Details",
    "Updated Resume/CV"
  ]

  const recruiterDocuments = [
    "Government Employee ID/Authorization",
    "Company Registration Certificate",
    "GST Registration Certificate",
    "Office Address Proof",
    "Authorized Signatory Details",
    "Organization Structure Document",
    "Previous Internship Program Records (if any)",
    "Compliance Certificates"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto">
          {/* Top Government Bar */}
          <div className="bg-gray-100 px-4 py-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🇮🇳 भारत सरकार | Government of India</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🌐 English</span>
                <span>|</span>
                <span>हिंदी</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div className="text-center">
                  <h1 className="text-xl font-bold text-gray-900">PM Internship Portal</h1>
                  <p className="text-xs text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500">Government of India</p>
                </div>
              </div>
              <Link 
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Apply</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Process</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guide for students and recruiters to participate in the PM Internship Program
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md border">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>For Students</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'recruiter'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>For Recruiters</span>
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'student' ? (
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Student Application Process */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Steps */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Application Steps</h2>
                  <div className="space-y-6">
                    {studentSteps.map((step, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <step.icon className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Step {step.step}: {step.title}
                              </h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {step.duration}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.requirements.map((req, reqIndex) => (
                                  <li key={reqIndex} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 text-center">
                    <Link
                      href="/register"
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <span>Start Student Application</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Required Documents */}
                  <div className="bg-white rounded-lg p-6 shadow-md border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Required Documents</span>
                    </h3>
                    <ul className="space-y-2">
                      {studentDocuments.map((doc, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span>Important Notes</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• All documents must be original and verified</li>
                      <li>• DigiLocker integration is mandatory</li>
                      <li>• Profile completion is required before applying</li>
                      <li>• Skills assessment is one-time only</li>
                      <li>• Multiple internship applications allowed</li>
                    </ul>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
                    <div className="space-y-3 text-sm text-blue-800">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>1800-XXX-XXXX (Toll Free)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>support@pminternship.gov.in</span>
                      </div>
                      <Link href="/support" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                        <span>Visit Support Center</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recruiter Application Process */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Steps */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Recruiter Registration Steps</h2>
                  <div className="space-y-6">
                    {recruiterSteps.map((step, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-md border hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <step.icon className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Step {step.step}: {step.title}
                              </h3>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {step.duration}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.requirements.map((req, reqIndex) => (
                                  <li key={reqIndex} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-8 text-center space-y-4">
                    <button
                      onClick={downloadRecruiterForm}
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Registration Form</span>
                    </button>
                    <Link
                      href="/recruiter-login"
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <span>Access Recruiter Portal</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Required Documents */}
                  <div className="bg-white rounded-lg p-6 shadow-md border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Required Documents</span>
                    </h3>
                    <ul className="space-y-2">
                      {recruiterDocuments.map((doc, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Eligibility Criteria</span>
                    </h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Government departments and ministries</li>
                      <li>• Public Sector Undertakings (PSUs)</li>
                      <li>• Government-approved organizations</li>
                      <li>• Private companies with government partnerships</li>
                      <li>• Educational institutions (government-recognized)</li>
                    </ul>
                  </div>

                  {/* Government Support */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Government Support</h3>
                    <div className="space-y-3 text-sm text-blue-800">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>1800-XXX-GOVT (Government Line)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>sanketg367@gmail.com</span>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                        <p className="text-xs text-yellow-800 font-medium">
                          📧 Send completed registration form and documents to: <strong>sanketg367@gmail.com</strong>
                        </p>
                      </div>
                      <Link href="/support" className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                        <span>Government Portal Help</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
