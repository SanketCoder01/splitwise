'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  FileCheck, 
  Users, 
  Award, 
  ChevronRight, 
  Bell,
  Search,
  Menu,
  X,
  Cpu,
  Target,
  BarChart3,
  Home,
  FileText,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroSlides = [
    {
      title: "AI-Powered Resume Verification",
      subtitle: "Transform hiring with intelligent resume analysis and verification",
      description: "Our advanced AI technology ensures authentic, accurate resume verification for better hiring decisions.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop&crop=center",
      cta: "Start Verification"
    },
    {
      title: "Blockchain Security",
      subtitle: "Tamper-proof verification with blockchain technology",
      description: "Secure your hiring process with immutable blockchain-based verification records.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop&crop=center",
      cta: "Learn More"
    },
    {
      title: "Government Certified",
      subtitle: "Official verification by Government of India",
      description: "Trusted by government agencies and enterprises across India for reliable verification.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop&crop=center",
      cta: "Get Certified"
    }
  ]

  const stats = [
    { number: "50,000+", label: "Resumes Verified", icon: FileCheck, color: "text-blue-600" },
    { number: "1,200+", label: "Organizations", icon: Users, color: "text-green-600" },
    { number: "98.5%", label: "Accuracy Rate", icon: Award, color: "text-purple-600" },
    { number: "24/7", label: "Support Available", icon: Shield, color: "text-orange-600" }
  ]

  const features = [
    {
      title: "AI Resume Parsing",
      description: "Advanced machine learning algorithms extract and analyze resume data with 99% accuracy",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center",
      benefits: ["Instant text extraction", "Smart data categorization", "Multi-format support"]
    },
    {
      title: "Skills Assessment",
      description: "Comprehensive skill evaluation through interactive tests and real-world scenarios",
      icon: Target,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=center",
      benefits: ["Timed assessments", "Code challenges", "Skill certification"]
    },
    {
      title: "Document Verification",
      description: "Verify educational certificates and work experience with blockchain security",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=400&fit=crop&crop=center",
      benefits: ["Blockchain security", "Real-time verification", "Fraud detection"]
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive insights and analytics for better hiring decisions",
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
      benefits: ["Real-time insights", "Custom reports", "Performance metrics"]
    }
  ]

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      position: "HR Director, Tech Mahindra",
      content: "PM Internship Portal has revolutionized our hiring process. The AI-powered verification saves us hours of manual work.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Priya Sharma",
      position: "Recruitment Head, Infosys",
      content: "The accuracy and speed of resume verification is impressive. Highly recommended for enterprise use.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Amit Patel",
      position: "CEO, StartupXYZ",
      content: "As a startup, PM Internship Portal helps us make confident hiring decisions with verified candidate information.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ]

  const faqs = [
    {
      question: "How does AI resume verification work?",
      answer: "Our AI system uses advanced natural language processing to extract and analyze resume data, cross-referencing information with multiple databases to ensure accuracy and authenticity."
    },
    {
      question: "Is my data secure with PM Internship Portal?",
      answer: "Yes, we use enterprise-grade security with blockchain technology to ensure your data is encrypted, secure, and tamper-proof. We comply with all government data protection regulations."
    },
    {
      question: "What file formats are supported?",
      answer: "PM Internship Portal supports PDF, DOC, and DOCX formats. Our AI can process resumes in multiple languages and various layouts with high accuracy."
    },
    {
      question: "How long does verification take?",
      answer: "Basic resume parsing takes 2-3 minutes. Complete verification including skills assessment and document validation typically takes 15-30 minutes depending on the complexity."
    },
    {
      question: "Can organizations integrate PM Internship Portal with their existing systems?",
      answer: "Yes, we provide comprehensive APIs and integration support for ATS systems, HRMS platforms, and custom applications. Our technical team assists with seamless integration."
    },
    {
      question: "What is the pricing model?",
      answer: "We offer flexible pricing based on usage volume. Individual users can verify resumes for free, while organizations have subscription plans starting from ₹999/month."
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(featureTimer)
  }, [features.length])

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-secondary {
          background: white;
          color: #2563eb;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: 2px solid #2563eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: #2563eb;
          color: white;
        }
        .floating-images {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        .floating-image {
          position: absolute;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: floatRightToLeft 15s linear infinite;
        }
        .floating-image:nth-child(1) { top: 10%; animation-delay: 0s; }
        .floating-image:nth-child(2) { top: 30%; animation-delay: 3s; }
        .floating-image:nth-child(3) { top: 50%; animation-delay: 6s; }
        .floating-image:nth-child(4) { top: 70%; animation-delay: 9s; }
        .floating-image:nth-child(5) { top: 85%; animation-delay: 12s; }
        
        @keyframes floatRightToLeft {
          0% { 
            transform: translateX(100vw) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateX(-200px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .sliding-images-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .sliding-image {
          position: absolute;
          width: 100vw;
          height: 100%;
          animation: slideRightToLeft 25s linear infinite;
          opacity: 1;
        }
        
        .sliding-image:nth-child(1) { 
          top: 0; 
          animation-delay: 0s; 
        }
        .sliding-image:nth-child(2) { 
          top: 0; 
          animation-delay: 5s; 
        }
        .sliding-image:nth-child(3) { 
          top: 0; 
          animation-delay: 10s; 
        }
        .sliding-image:nth-child(4) { 
          top: 0; 
          animation-delay: 15s; 
        }
        .sliding-image:nth-child(5) { 
          top: 0; 
          animation-delay: 20s; 
        }
        
        @keyframes slideRightToLeft {
          0% { 
            transform: translateX(100vw) scale(0.8);
            opacity: 0;
          }
          10% { 
            opacity: 0.7;
            transform: scale(1);
          }
          90% { 
            opacity: 0.7;
            transform: scale(1);
          }
          100% { 
            transform: translateX(-400px) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="w-full max-w-full">
          {/* Top Government Bar */}
          <div className="bg-gray-100 px-4 py-2 text-sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🇮🇳 भारत सरकार | Government of India</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>🌐 English</span>
                <span>|</span>
                <span>हिंदी</span>
                <span>|</span>
                <span>Screen Reader</span>
                <span>A-</span>
                <span>A</span>
                <span>A+</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-6 flex-1">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">PM Internship & Resume Verifier</h1>
                  <p className="text-sm text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500">Government of India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition-colors btn-animate hover-scale glow-effect">
                  Student Login
                </Link>
                <Link href="/gov-login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-colors btn-animate hover-scale glow-effect">
                  Government Login
                </Link>
                <div className="text-right">
                  <div className="text-sm font-semibold text-orange-600">विकसित भारत</div>
                  <div className="text-xs text-gray-500">@2047</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-blue-900 text-white">
            <div className="px-4">
              <div className="flex justify-center space-x-16 py-4 w-full">
                <Link href="/" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <Home className="w-5 h-5 animate-float" />
                  <span className="font-medium">HOME</span>
                </Link>
                <Link href="/internship-schemes-info" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <Users className="w-5 h-5 animate-bounce-custom" />
                  <span className="font-medium">INTERNSHIP SCHEMES</span>
                </Link>
                <Link href="/resume-verifier-info" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <FileCheck className="w-5 h-5 animate-pulse-custom" />
                  <span className="font-medium">RESUME VERIFIER</span>
                </Link>
                <Link href="/roadmap" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <Target className="w-5 h-5 animate-float" />
                  <span className="font-medium">ROADMAP</span>
                </Link>
                <Link href="/eligibility" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <CheckCircle className="w-5 h-5 animate-bounce-custom" />
                  <span className="font-medium">ELIGIBILITY</span>
                </Link>
                <Link href="/support" className="flex items-center space-x-3 hover:text-orange-300 transition-colors hover-scale btn-animate px-4 py-2 rounded">
                  <Award className="w-5 h-5 animate-pulse-custom" />
                  <span className="font-medium">SUPPORT</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Live Updates Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
              <span className="font-semibold text-sm">🔴 LIVE UPDATES:</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-sm">
                <span className="mx-8">🎉 50+ New Internships Added from Ministry of Defence</span>
                <span className="mx-8">⚡ 2,347 Resumes Verified in Last 24 Hours</span>
                <span className="mx-8">🏆 95% Students Placed After Verification</span>
                <span className="mx-8">🚀 AI Resume Matching Accuracy Improved to 98%</span>
                <span className="mx-8">📢 Summer Internship Program 2025 Registration Open</span>
                <span className="mx-8">💼 New Government Departments Added: ISRO, DRDO, BARC</span>
                <span className="mx-8">🔥 Real-time Document Verification Now Available</span>
                <span className="mx-8">📋 New Resume Templates Available for Download</span>
                <span className="mx-8">🌟 Achievement: 1 Million Resumes Verified Successfully</span>
                <span className="mx-8">🚀 Mobile App Beta Testing Phase Started</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Full-Size Sliding Images Section */}
      <section className="relative overflow-hidden h-96" id="main-content">
        {/* Full-width Sliding Images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="sliding-images-container">
            <div className="sliding-image">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=600&fit=crop"
                alt="Government office building"
                width={1920}
                height={600}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="sliding-image">
              <Image
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&h=600&fit=crop"
                alt="Resume and documents"
                width={1920}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="sliding-image">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=600&fit=crop"
                alt="Government internship program"
                width={1920}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="sliding-image">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=600&fit=crop"
                alt="Digital government services"
                width={1920}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="sliding-image">
              <Image
                src="https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=1920&h=600&fit=crop"
                alt="Career development and verification"
                width={1920}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scroll-Triggered Info Sections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive government initiative for skill development and career advancement
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Live Updates Section */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Updates & Notifications</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Stay informed with real-time updates on new internship opportunities, application deadlines,
                    verification status, and important announcements from various government ministries.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                      <div className="text-sm text-gray-600">Real-time Monitoring</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">50K+</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                      <div className="text-sm text-gray-600">Uptime Guarantee</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Government Internship Schemes Section */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Government Internship Schemes</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Access exclusive internship opportunities across 25+ government ministries and departments.
                    From technical roles in DRDO/ISRO to administrative positions in various ministries,
                    find the perfect opportunity to serve the nation.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">25+</div>
                      <div className="text-sm text-gray-600">Ministries</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
                      <div className="text-sm text-gray-600">Opportunities</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">₹25K</div>
                      <div className="text-sm text-gray-600">Avg. Stipend</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Roadmap Section */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-8 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Implementation Roadmap</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Our strategic roadmap ensures continuous improvement and expansion of internship opportunities.
                    From AI-powered verification to mobile applications, we're building the future of government internships.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Phase 1: Platform Launch (Completed)</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Phase 2: AI Integration (In Progress)</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Phase 3: Multi-Ministry Expansion (Upcoming)</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Phase 4: Mobile Application (Planned)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resume Verifier Features Section */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-8 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Verifier Features</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Advanced AI-powered resume verification ensures authenticity and accuracy. Our blockchain-secured
                    system provides tamper-proof verification for educational certificates, work experience, and skills assessment.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <FileCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Document Verification</div>
                      <div className="text-sm text-gray-600">Certificate Validation</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Skills Assessment</div>
                      <div className="text-sm text-gray-600">AI Matching</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Experience Validation</div>
                      <div className="text-sm text-gray-600">Work History Check</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <Cpu className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Real-time Processing</div>
                      <div className="text-sm text-gray-600">Instant Results</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Government Internship Schemes Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Government Internship Schemes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore various government internship opportunities across different ministries and departments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "PM Internship Scheme", dept: "Ministry of Education", slots: "10,000+", icon: Users },
              { title: "Digital India Internship", dept: "Ministry of Electronics & IT", slots: "5,000+", icon: Cpu },
              { title: "Skill Development Program", dept: "Ministry of Skill Development", slots: "15,000+", icon: Target },
              { title: "Research Internship", dept: "DRDO & ISRO", slots: "2,000+", icon: Award },
              { title: "Banking Sector Internship", dept: "Ministry of Finance", slots: "8,000+", icon: Shield },
              { title: "Healthcare Internship", dept: "Ministry of Health", slots: "12,000+", icon: FileCheck }
            ].map((scheme, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200 hover:border-blue-200 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                    <scheme.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{scheme.title}</h3>
                    <p className="text-sm text-gray-600">{scheme.dept}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-700">{scheme.slots}</span>
                  <span className="text-sm text-gray-500">Available Slots</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Verifier Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">AI-Powered Resume Verifier</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology to verify and validate resumes for government internship programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Document Verification", desc: "Verify educational certificates and documents", icon: FileCheck },
              { title: "Skills Assessment", desc: "AI-powered skills matching and validation", icon: Target },
              { title: "Experience Validation", desc: "Verify work experience and internships", icon: Award },
              { title: "Real-time Processing", desc: "Instant verification with blockchain security", icon: Cpu }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-200 transform hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-50 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Implementation Roadmap</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our strategic roadmap for expanding government internship opportunities across India
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { phase: "Phase 1", title: "Platform Launch", desc: "Launch of PM Internship portal with basic features", status: "Completed", color: "bg-gray-600" },
                { phase: "Phase 2", title: "AI Integration", desc: "Integration of AI-powered resume verification system", status: "In Progress", color: "bg-gray-600" },
                { phase: "Phase 3", title: "Multi-Ministry Expansion", desc: "Expansion to all government ministries and departments", status: "Upcoming", color: "bg-gray-400" },
                { phase: "Phase 4", title: "Mobile Application", desc: "Launch of mobile app for students and officials", status: "Planned", color: "bg-gray-300" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-6 p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 border border-gray-200 hover:border-orange-200 transform hover:-translate-y-1">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.phase}</h3>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        item.status === 'Completed' ? 'bg-gray-200 text-gray-800' :
                        item.status === 'In Progress' ? 'bg-gray-200 text-gray-800' :
                        item.status === 'Upcoming' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{item.status}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Stats & Updates Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Platform Statistics</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Live data from India's most comprehensive government internship and resume verification platform
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 card-hover hover-scale glow-effect animate-slide-up"
              >
                <div className={`w-16 h-16 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float`}>
                  <stat.icon className={`w-8 h-8 ${stat.color} animate-spin-slow`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2 text-center animate-count-up`}>{stat.number}</div>
                <div className="text-gray-600 text-center font-medium animate-fade-in">{stat.label}</div>
                <div className="text-xs text-green-600 text-center mt-2 font-semibold animate-pulse-custom">
                  📈 Live Updates
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Simple Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600">Simple and effective resume verification solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who trust PM Internship Portal for career opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Now
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Government Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Government Branding */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                    alt="Government of India"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">PM Internship Portal</h3>
                    <p className="text-sm text-gray-400">Ministry of Education</p>
                    <p className="text-xs text-gray-500">Government of India</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Empowering India's youth through skill development and career opportunities. 
                  A flagship initiative to bridge the gap between education and employment.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>🇮🇳</span>
                  <span>भारत सरकार | Government of India</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/schemes" className="hover:text-white transition-colors">Find Internships</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Student Registration</Link></li>
                  <li><Link href="/gov-login" className="hover:text-white transition-colors">Government Login</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                </ul>
              </div>

              {/* Government Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Government Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">India.gov.in</a></li>
                  <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Digital India</a></li>
                  <li><a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MyGov.in</a></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-gray-800 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
              <div className="mb-2 md:mb-0">
                <p>&copy; 2025 PM Internship Portal - Ministry of Education, Government of India. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-4">
                <span>Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
                <span>|</span>
                <span>Version 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}