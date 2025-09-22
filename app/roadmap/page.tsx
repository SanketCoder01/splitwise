'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  User, 
  FileCheck, 
  Award,
  Briefcase,
  Calendar,
  Clock,
  ArrowRight,
  Target,
  Star,
  Trophy,
  BookOpen
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function RoadmapPage() {
  const roadmapSteps = [
    {
      step: 1,
      title: "Registration & Profile Setup",
      duration: "15-30 minutes",
      description: "Create your account and complete your comprehensive profile with personal, educational, and professional details.",
      icon: User,
      color: "blue",
      tasks: [
        "Create account with email/mobile verification",
        "Fill personal information (Name, DOB, Address)",
        "Add educational qualifications and certificates",
        "Upload profile photo and resume",
        "Complete skills and interests section"
      ],
      tips: [
        "Use a professional email address",
        "Ensure all information is accurate",
        "Upload high-quality documents"
      ]
    },
    {
      step: 2,
      title: "Document Verification",
      duration: "2-5 business days",
      description: "Submit and verify your educational certificates, identity documents, and other required paperwork through our secure system.",
      icon: FileCheck,
      color: "green",
      tasks: [
        "Upload Aadhaar card for identity verification",
        "Submit educational certificates (10th, 12th, Graduation)",
        "Provide character certificate from institution",
        "Upload caste certificate (if applicable)",
        "Submit medical fitness certificate"
      ],
      tips: [
        "Scan documents in high resolution",
        "Ensure all documents are clearly visible",
        "Keep original documents ready for verification"
      ]
    },
    {
      step: 3,
      title: "Skills Assessment & Testing",
      duration: "1-2 hours",
      description: "Take comprehensive online assessments to evaluate your technical skills, aptitude, and domain knowledge.",
      icon: Award,
      color: "yellow",
      tasks: [
        "Complete general aptitude test (Quantitative, Logical, Verbal)",
        "Take domain-specific technical assessment",
        "Participate in personality and behavioral evaluation",
        "Submit portfolio or project work (if applicable)",
        "Complete English proficiency test"
      ],
      tips: [
        "Practice sample questions beforehand",
        "Ensure stable internet connection",
        "Take tests in a quiet environment"
      ]
    },
    {
      step: 4,
      title: "Internship Application",
      duration: "Ongoing",
      description: "Browse available internship opportunities, apply to positions that match your profile, and track your applications.",
      icon: Briefcase,
      color: "purple",
      tasks: [
        "Browse internship opportunities by ministry/department",
        "Filter positions by location, duration, and stipend",
        "Submit applications with customized cover letters",
        "Track application status and responses",
        "Prepare for interviews and selection rounds"
      ],
      tips: [
        "Apply to multiple relevant positions",
        "Customize applications for each role",
        "Follow up on pending applications"
      ]
    },
    {
      step: 5,
      title: "Selection & Onboarding",
      duration: "1-3 weeks",
      description: "Complete the selection process, receive offer letters, and begin your internship journey with proper orientation.",
      icon: Target,
      color: "indigo",
      tasks: [
        "Participate in interviews and group discussions",
        "Complete final background verification",
        "Receive and accept offer letter",
        "Complete pre-joining formalities",
        "Attend orientation and induction program"
      ],
      tips: [
        "Prepare thoroughly for interviews",
        "Be punctual for all interactions",
        "Ask relevant questions about the role"
      ]
    },
    {
      step: 6,
      title: "Internship Completion & Certification",
      duration: "3-12 months",
      description: "Successfully complete your internship, gain valuable experience, and receive official government certification.",
      icon: Trophy,
      color: "orange",
      tasks: [
        "Complete assigned projects and tasks",
        "Maintain regular attendance and performance",
        "Participate in training and development programs",
        "Submit final project report and presentation",
        "Receive official government certificate"
      ],
      tips: [
        "Maintain professional conduct",
        "Seek feedback and continuous improvement",
        "Network with colleagues and mentors"
      ]
    }
  ]

  const timeline = [
    { phase: "Application Phase", duration: "1-2 weeks", color: "blue" },
    { phase: "Verification Phase", duration: "1-2 weeks", color: "green" },
    { phase: "Assessment Phase", duration: "1 week", color: "yellow" },
    { phase: "Selection Phase", duration: "2-4 weeks", color: "purple" },
    { phase: "Internship Phase", duration: "3-12 months", color: "orange" }
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
              Application Roadmap
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your step-by-step guide to successfully applying and completing the PM Internship Program. 
              Follow this comprehensive roadmap to maximize your chances of success.
            </p>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Program Timeline</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timeline.map((phase, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold ${
                    phase.color === 'blue' ? 'bg-blue-600' :
                    phase.color === 'green' ? 'bg-green-600' :
                    phase.color === 'yellow' ? 'bg-yellow-600' :
                    phase.color === 'purple' ? 'bg-purple-600' :
                    'bg-orange-600'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{phase.phase}</h3>
                  <p className="text-sm text-gray-600">{phase.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Roadmap Steps */}
        <div className="space-y-8">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className={`bg-gradient-to-r ${
                step.color === 'blue' ? 'from-blue-600 to-blue-700' :
                step.color === 'green' ? 'from-green-600 to-green-700' :
                step.color === 'yellow' ? 'from-yellow-600 to-yellow-700' :
                step.color === 'purple' ? 'from-purple-600 to-purple-700' :
                step.color === 'indigo' ? 'from-indigo-600 to-indigo-700' :
                'from-orange-600 to-orange-700'
              } text-white px-6 py-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Step {step.step}: {step.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm opacity-90">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold opacity-50">
                    {step.step}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-6 text-lg">{step.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tasks */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Required Tasks
                    </h4>
                    <ul className="space-y-2">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="w-5 h-5 text-yellow-600 mr-2" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-8">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-2xl font-bold">Success Statistics</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <p className="text-gray-700">Application Success Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
                <p className="text-gray-700">Completion Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                <p className="text-gray-700">Job Placement Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <p className="text-gray-700">Satisfaction Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-6 opacity-90">
              Follow this roadmap and take the first step towards your government internship!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Application
              </Link>
              <Link 
                href="/eligibility" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
