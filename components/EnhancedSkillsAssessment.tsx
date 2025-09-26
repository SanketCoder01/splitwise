'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, CheckCircle, Clock, Award, Target, Camera, Monitor, 
  AlertTriangle, X, Eye, Code, Brain, Database, Palette, 
  BarChart3, Globe, Maximize, Volume2, Wifi, Battery,
  ArrowRight, ArrowLeft, Trophy, RotateCcw, Download
} from 'lucide-react'
import Image from 'next/image'

interface Assessment {
  id: string
  name: string
  category: 'programming' | 'technical' | 'ai' | 'design' | 'analytics'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  questions: number
  description: string
  icon: any
  color: string
  certification: boolean
  officialIcon?: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export default function EnhancedSkillsAssessment() {
  // Assessment flow states
  const [assessmentFlow, setAssessmentFlow] = useState<'selection' | 'instructions' | 'permissions' | 'assessment' | 'results'>('selection')
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [finalResults, setFinalResults] = useState<{correct: number, incorrect: number, score: number} | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Enhanced assessments with proper icons
  const assessments: Assessment[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      category: 'programming',
      difficulty: 'beginner',
      duration: 30,
      questions: 20,
      description: 'Test your JavaScript knowledge including ES6+, DOM manipulation, and async programming',
      icon: Code,
      color: 'bg-yellow-500',
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    {
      id: '2',
      name: 'Artificial Intelligence',
      category: 'ai',
      difficulty: 'intermediate',
      duration: 45,
      questions: 25,
      description: 'Machine Learning, Neural Networks, and AI fundamentals assessment',
      icon: Brain,
      color: 'bg-purple-500',
      certification: true,
      officialIcon: 'https://cdn-icons-png.flaticon.com/512/8637/8637099.png'
    },
    {
      id: '3',
      name: 'Database Systems',
      category: 'technical',
      difficulty: 'intermediate',
      duration: 40,
      questions: 30,
      description: 'SQL, NoSQL, database design, and optimization techniques',
      icon: Database,
      color: 'bg-blue-500',
      certification: true,
      officialIcon: 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png'
    },
    {
      id: '4',
      name: 'UI/UX Design',
      category: 'design',
      difficulty: 'beginner',
      duration: 35,
      questions: 25,
      description: 'Design principles, user experience, and interface design best practices',
      icon: Palette,
      color: 'bg-pink-500',
      certification: true,
      officialIcon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png'
    },
    {
      id: '5',
      name: 'Data Analytics',
      category: 'analytics',
      difficulty: 'advanced',
      duration: 50,
      questions: 35,
      description: 'Statistical analysis, data visualization, and business intelligence',
      icon: BarChart3,
      color: 'bg-green-500',
      certification: true,
      officialIcon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png'
    },
    {
      id: '6',
      name: 'Web Development',
      category: 'programming',
      difficulty: 'intermediate',
      duration: 40,
      questions: 30,
      description: 'HTML5, CSS3, responsive design, and modern web technologies',
      icon: Globe,
      color: 'bg-indigo-500',
      certification: true,
      officialIcon: 'https://cdn-icons-png.flaticon.com/512/1336/1336494.png'
    }
  ]

  // Sample questions for demonstration
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: 'What is the correct way to declare a variable in JavaScript ES6?',
      options: ['var x = 5;', 'let x = 5;', 'variable x = 5;', 'declare x = 5;'],
      correct_answer: 1,
      explanation: 'let is the preferred way to declare variables in ES6 as it has block scope.'
    },
    {
      id: 2,
      question: 'Which of the following is NOT a JavaScript data type?',
      options: ['String', 'Boolean', 'Integer', 'Symbol'],
      correct_answer: 2,
      explanation: 'JavaScript has Number type, not specifically Integer. All numbers are of type Number.'
    },
    {
      id: 3,
      question: 'What does the spread operator (...) do in JavaScript?',
      options: ['Creates a loop', 'Spreads array elements', 'Declares a function', 'Imports modules'],
      correct_answer: 1,
      explanation: 'The spread operator (...) allows an iterable to expand in places where multiple elements are expected.'
    }
  ]

  // Camera and fullscreen functions
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraPermission('granted')
    } catch (error) {
      setCameraPermission('denied')
    }
  }

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
    }
  }

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen()
      setIsFullscreen(false)
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
    }
  }

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && assessmentStarted) {
        setTabSwitchWarnings(prev => prev + 1)
        if (tabSwitchWarnings >= 2) {
          // End assessment after 3 warnings
          handleEndAssessment()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [assessmentStarted, tabSwitchWarnings])

  // Timer functionality
  useEffect(() => {
    if (assessmentStarted && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && assessmentStarted) {
      handleEndAssessment()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeRemaining, assessmentStarted])

  const startAssessment = () => {
    if (selectedAssessment) {
      setTimeRemaining(selectedAssessment.duration * 60) // Convert minutes to seconds
      setAssessmentStarted(true)
      setAssessmentFlow('assessment')
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
    }
  }

  const handleEndAssessment = () => {
    setAssessmentStarted(false)
    calculateResults()
    setAssessmentFlow('results')
    exitFullscreen()
  }

  const calculateResults = () => {
    const correct = Object.values(selectedAnswers).filter((answer, index) => 
      answer === sampleQuestions[index]?.correct_answer
    ).length
    const incorrect = Object.keys(selectedAnswers).length - correct
    const score = Math.round((correct / sampleQuestions.length) * 100)
    
    setFinalResults({ correct, incorrect, score })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {assessmentFlow === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Skills Assessment Center</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Test your skills with our comprehensive assessment platform. Get certified and showcase your expertise.
              </p>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {assessments.map((assessment) => (
                <motion.div
                  key={assessment.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer"
                  onClick={() => {
                    setSelectedAssessment(assessment)
                    setAssessmentFlow('instructions')
                  }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {assessment.officialIcon ? (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                        <Image
                          src={assessment.officialIcon}
                          alt={assessment.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-lg ${assessment.color} flex items-center justify-center`}>
                        <assessment.icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assessment.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="capitalize">{assessment.difficulty}</span>
                        <span>•</span>
                        <span>{assessment.duration} min</span>
                        <span>•</span>
                        <span>{assessment.questions} questions</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{assessment.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {assessment.certification && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Certificate Available
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
