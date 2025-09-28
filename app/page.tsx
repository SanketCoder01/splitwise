'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileCheck, Award, Users, Target, Newspaper, MessageSquare, BookOpen, BarChart3, Home, FileText, CheckCircle,
  Zap, Sparkles, LogOut, ArrowRight, AlertCircle, ExternalLink, Eye, Palette, PlayCircle, Phone, Mail, Lock, Globe, Cpu,
  Code, Database, ChevronLeft, ChevronRight, Menu, X, Bell, Search
} from 'lucide-react';
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const SimpleSlideGallery = dynamic(() => import('../components/SimpleSlideGallery'), { ssr: false })

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroSlides = [
    {
      title: "Empowering India's Future",
      subtitle: "Connecting talented students with premier government internships",
      description: "Gain invaluable experience and contribute to nation-building with the Government Internship Portal.",
      image: "https://images.unsplash.com/photo-1593113646773-9b2f14a0b7a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Explore Internships"
    },
    {
      title: "Gateway to Public Service",
      subtitle: "Launch your career in governance and public administration",
      description: "Discover opportunities across various ministries and government departments.",
      image: "https://images.unsplash.com/photo-1561347313-10c180fe463a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "View Schemes"
    },
    {
      title: "Building a Skilled Nation",
      subtitle: "Aligning academic knowledge with practical government experience",
      description: "Our programs are designed to bridge the gap between education and employment in the public sector.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: "Register Now"
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
      content: "Government Internship Portal has revolutionized our hiring process. The AI-powered verification saves us hours of manual work.",
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
      content: "As a startup, Government Internship Portal helps us make confident hiring decisions with verified candidate information.",
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
      question: "Is my data secure with Government Internship Portal?",
      answer: "Yes, we use enterprise-grade security with blockchain technology to ensure your data is encrypted, secure, and tamper-proof. We comply with all government data protection regulations."
    },
    {
      question: "What file formats are supported?",
      answer: "Government Internship Portal supports PDF, DOC, and DOCX formats. Our AI can process resumes in multiple languages and various layouts with high accuracy."
    },
    {
      question: "How long does verification take?",
      answer: "Basic resume parsing takes 2-3 minutes. Complete verification including skills assessment and document validation typically takes 15-30 minutes depending on the complexity."
    },
    {
      question: "Can organizations integrate Government Internship Portal with their existing systems?",
      answer: "Yes, we provide comprehensive APIs and integration support for ATS systems, HRMS platforms, and custom applications. Our technical team assists with seamless integration."
    },
    {
      question: "What is the pricing model?",
      answer: "We offer flexible pricing based on usage volume. Individual users can verify resumes for free, while organizations have subscription plans starting from ₹999/month."
    }
  ]

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  //   }, 5000)
  //   return () => clearInterval(timer)
  // }, [heroSlides.length])

  const carouselImages = [
    {
      src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Team collaborating in a modern office',
      title: 'Shape the Future of the Nation',
      subtitle: 'Explore prestigious government internships and launch your career in public service.',
    },
    {
      src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Young professionals working on laptops',
      title: 'Gain Real-World Experience',
      subtitle: 'Contribute to meaningful projects that impact millions of lives across India.',
    },
    {
      src: 'https://images.unsplash.com/photo-1600880292210-8522b988318a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'A person receiving a certificate',
      title: 'Build a Foundation for Success',
      subtitle: 'Our internships provide the skills and connections you need for a successful career.',
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(featureTimer)
  }, [features.length])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

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
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
          z-index: 10;
        }
        .hero-arrow:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .hero-arrow.left {
          left: 1rem;
        }
        .hero-arrow.right {
          right: 1rem;
        }
        
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
            transform: translateX(100vw);
            opacity: 0;
          }
          5% { 
            opacity: 1;
          }
          95% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(-100vw);
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
        
        @keyframes slideUpNotifications {
          0% { 
            transform: translateY(100%);
          }
          100% { 
            transform: translateY(-100%);
          }
        }
        
        .animate-slide-up-notifications {
          animation: slideUpNotifications 30s linear infinite;
        }
        
        .animate-slide-up-notifications:hover {
          animation-play-state: paused;
        }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="w-full max-w-full">
          {/* Top Government Bar */}
          <div className="bg-gray-100 px-2 sm:px-4 py-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 sm:space-x-4 text-gray-600">
                <span className="truncate">🇮🇳 भारत सरकार | Government of India</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-gray-600">
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
          <div className="px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 sm:space-x-6 flex-1">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Government of India"
                  width={40}
                  height={40}
                  className="sm:w-[60px] sm:h-[60px] object-contain"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-sm sm:text-2xl font-bold text-gray-900 truncate">Government Internship & Resume Verifier</h1>
                  <p className="text-xs sm:text-sm text-gray-600">MINISTRY OF EDUCATION</p>
                  <p className="text-xs text-gray-500 hidden sm:block">Government of India</p>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                
                {/* Desktop Login Buttons */}
                <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
                  <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-3 xl:px-6 py-2 rounded font-semibold transition-colors text-sm xl:text-base">
                    Student Login
                  </Link>
                  <Link href="/gov-login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 xl:px-6 py-2 rounded font-semibold transition-colors text-sm xl:text-base">
                    Government Login
                  </Link>
                  <div className="text-right hidden xl:block">
                    <div className="text-sm font-semibold text-orange-600">विकसित भारत</div>
                    <div className="text-xs text-gray-500">@2047</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="bg-blue-900 text-white hidden lg:block">
            <div className="px-4">
              <div className="flex justify-center space-x-8 xl:space-x-16 py-4 w-full">
                <Link href="/" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <Home className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">HOME</span>
                </Link>
                <Link href="/internship-schemes-info" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <Users className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">SCHEMES</span>
                </Link>
                <Link href="/resume-verifier-info" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <FileCheck className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">VERIFIER</span>
                </Link>
                <Link href="/roadmap" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <Target className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">ROADMAP</span>
                </Link>
                <Link href="/eligibility" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <CheckCircle className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">ELIGIBILITY</span>
                </Link>
                <Link href="/support" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <Award className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">SUPPORT</span>
                </Link>
                <Link href="/apply" className="flex items-center space-x-2 xl:space-x-3 hover:text-orange-300 transition-colors px-2 xl:px-4 py-2 rounded text-sm xl:text-base">
                  <FileText className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-medium">APPLY</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-blue-900 text-white"
              >
                <div className="px-4 py-4 space-y-2">
                  <Link href="/" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <Home className="w-5 h-5" />
                    <span className="font-medium">HOME</span>
                  </Link>
                  <Link href="/internship-schemes-info" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">INTERNSHIP SCHEMES</span>
                  </Link>
                  <Link href="/resume-verifier-info" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-medium">RESUME VERIFIER</span>
                  </Link>
                  <Link href="/roadmap" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">ROADMAP</span>
                  </Link>
                  <Link href="/eligibility" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">ELIGIBILITY</span>
                  </Link>
                  <Link href="/support" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <Award className="w-5 h-5" />
                    <span className="font-medium">SUPPORT</span>
                  </Link>
                  <Link href="/apply" className="flex items-center space-x-3 hover:text-orange-300 transition-colors px-4 py-3 rounded-lg hover:bg-blue-800">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">APPLY</span>
                  </Link>
                  
                  {/* Mobile Login Buttons */}
                  <div className="pt-4 space-y-2 border-t border-blue-800">
                    <Link href="/login" className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
                      Student Login
                    </Link>
                    <Link href="/gov-login" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors">
                      Government Login
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <section className="relative w-full h-96 md:h-[500px]" id="main-content">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={carouselImages[currentImageIndex].src}
              alt={carouselImages[currentImageIndex].alt}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority={currentImageIndex === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <motion.h1 
            key={currentImageIndex + '-title'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            {carouselImages[currentImageIndex].title}
          </motion.h1>
          <motion.p 
            key={currentImageIndex + '-subtitle'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl max-w-3xl mx-auto"
          >
            {carouselImages[currentImageIndex].subtitle}
          </motion.p>
          <motion.div
            key={currentImageIndex + '-cta'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Link href="/internships" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
              Find Your Internship
            </Link>
          </motion.div>
        </div>

        <button 
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
            />
          ))}
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

          {/* Simple Slide Gallery */}
          <div className="h-96 w-full mb-16">
            <SimpleSlideGallery 
              items={[
                {
                  image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&crop=center",
                  text: "IIT Delhi Campus"
                },
                {
                  image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=600&fit=crop&crop=center",
                  text: "Indian Institute of Science"
                },
                {
                  image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center",
                  text: "University Library"
                },
                {
                  image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop&crop=center",
                  text: "Research Laboratory"
                },
                {
                  image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
                  text: "Student Innovation Hub"
                },
                {
                  image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&crop=center",
                  text: "Digital Learning Center"
                },
                {
                  image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=600&fit=crop&crop=center",
                  text: "Indian Parliament"
                },
                {
                  image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&crop=center",
                  text: "Engineering Excellence"
                }
              ]}
              autoSlide={true}
              slideInterval={4000}
              showText={true}
              textColor="#ffffff"
            />
          </div>

          {/* Notifications and Placements Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Side - Live Notifications */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-bold text-gray-900">Live Updates</h3>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">LIVE</span>
              </div>
              
              <div className="space-y-3 h-80 overflow-hidden relative">
                <div className="animate-slide-up-notifications space-y-3">
                  {[
                    { message: 'New internship posted: Software Developer at NIC Delhi', time: '2 min ago' },
                    { message: 'Resume verified successfully for Arjun Kumar', time: '5 min ago' },
                    { message: 'Application deadline extended for Digital India Program', time: '8 min ago' },
                    { message: 'Interview scheduled: Data Analyst at ISRO Bangalore', time: '12 min ago' },
                    { message: 'New placement: Software Engineer at Ministry of IT', time: '15 min ago' },
                    { message: 'Skills assessment completed for 50+ candidates', time: '18 min ago' },
                    { message: 'AI matching improved: 98% accuracy achieved', time: '22 min ago' },
                    { message: 'Document verification completed for Tech Mahindra', time: '25 min ago' },
                    { message: 'New government scheme launched for engineering students', time: '28 min ago' },
                    { message: 'Resume template downloaded 1000+ times today', time: '32 min ago' }
                  ].map((notification, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border-l-4 border-blue-500">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Top Placements */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🏆</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Top Placements</h3>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">HIGH PACKAGE</span>
              </div>
              
              <div className="space-y-4 h-80 overflow-y-auto">
                {[
                  {
                    name: 'Arjun Mehta',
                    company: 'DRDO',
                    package: '₹8.5 LPA',
                    position: 'Research Scientist',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                    location: 'New Delhi'
                  },
                  {
                    name: 'Priya Sharma',
                    company: 'ISRO',
                    package: '₹7.8 LPA',
                    position: 'Aerospace Engineer',
                    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
                    location: 'Bangalore'
                  },
                  {
                    name: 'Rahul Kumar',
                    company: 'NIC',
                    package: '₹7.2 LPA',
                    position: 'Software Developer',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    location: 'Mumbai'
                  },
                  {
                    name: 'Sneha Patel',
                    company: 'Ministry of Finance',
                    package: '₹6.8 LPA',
                    position: 'Financial Analyst',
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                    location: 'New Delhi'
                  },
                  {
                    name: 'Vikash Yadav',
                    company: 'Digital India Corp',
                    package: '₹6.5 LPA',
                    position: 'Digital Marketing Lead',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                    location: 'Pune'
                  },
                  {
                    name: 'Anita Singh',
                    company: 'Ministry of Health',
                    package: '₹6.2 LPA',
                    position: 'Health Policy Analyst',
                    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
                    location: 'Chennai'
                  }
                ].map((student, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                    <img 
                      src={student.image} 
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.position}</p>
                      <p className="text-xs text-gray-500">{student.company} • {student.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{student.package}</div>
                      <div className="text-xs text-gray-500">Annual Package</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced artificial intelligence to enhance your internship and career journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🤖',
                  title: 'AI Resume Analyzer',
                  description: 'Smart resume parsing and skill extraction with 98% accuracy'
                },
                {
                  icon: '🎯',
                  title: 'Intelligent Matching',
                  description: 'AI-powered job matching based on skills and preferences'
                },
                {
                  icon: '📊',
                  title: 'Performance Analytics',
                  description: 'Real-time insights and career progression tracking'
                },
                {
                  icon: '🔍',
                  title: 'Smart Search',
                  description: 'Natural language search for internships and opportunities'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{feature.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Flexible pricing options to suit your career development needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Trial */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">₹0</div>
                  <div className="text-lg font-semibold text-gray-600 mb-6">Free Trial</div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">3 Free AI Internship Finder Attempts</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">1 Free Complete Assessment</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Basic Resume Analysis</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Standard Support</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Basic Plan */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Popular</span>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">₹99</div>
                  <div className="text-lg font-semibold text-gray-600 mb-6">Per Month</div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Unlimited AI Internship Finder</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">5 Complete Assessments</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Advanced Resume Analysis</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Priority Support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Interview Preparation</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                    Choose Plan
                  </button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-white rounded-lg shadow-lg border-2 border-purple-500 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">Best Value</span>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-600 mb-2">₹299</div>
                  <div className="text-lg font-semibold text-gray-600 mb-6">Per Month</div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Everything in Basic Plan</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Unlimited Assessments</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">AI Career Counseling</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Premium Support (24/7)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Personalized Learning Path</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">Direct Recruiter Connect</span>
                    </li>
                  </ul>
                  
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>




      {/* Simple CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who trust Government Internship Portal for career opportunities
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
                    <h3 className="text-xl font-bold text-white">Government Internship Portal</h3>
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
                <p>&copy; 2025 Government Internship Portal - Ministry of Education, Government of India. All rights reserved.</p>
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