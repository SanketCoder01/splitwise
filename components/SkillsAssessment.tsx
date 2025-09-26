'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Play, CheckCircle, Clock, Award, Target, RotateCcw, 
  Camera, Monitor, AlertTriangle, X, Code, Cpu, Users, 
  BookOpen, Trophy, Search, Filter
} from 'lucide-react'

interface Assessment {
  id: string
  name: string
  category: 'programming' | 'technical' | 'non_technical' | 'ai' | 'design' | 'analytics'
  language?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  questions: number
  description: string
  icon: any
  color: string
  premium: boolean
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

const SkillsAssessment: React.FC = () => {
  // Mock user
  const user = { id: 'bypass-user', email: 'student@bypass.dev' }
  
  // State management
  const [assessmentFlow, setAssessmentFlow] = useState<'selection' | 'instructions' | 'assessment' | 'results'>('selection')
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'duration'>('name')
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(40)
  const [warningCount, setWarningCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [userPlan, setUserPlan] = useState<'free' | 'basic' | 'premium'>('free')
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sample assessments data
  const sampleAssessments: Assessment[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      category: 'programming',
      language: 'JavaScript',
      difficulty: 'beginner',
      duration: 30,
      questions: 20,
      description: 'Test your basic JavaScript knowledge including variables, functions, and DOM manipulation',
      icon: Code,
      color: 'bg-yellow-500',
      premium: false,
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    {
      id: '2',
      name: 'React Development',
      category: 'programming',
      language: 'JavaScript',
      difficulty: 'intermediate',
      duration: 45,
      questions: 25,
      description: 'Advanced React concepts including hooks, context, and state management',
      icon: Code,
      color: 'bg-blue-500',
      premium: true,
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    {
      id: '3',
      name: 'Python Programming',
      category: 'programming',
      language: 'Python',
      difficulty: 'intermediate',
      duration: 40,
      questions: 30,
      description: 'Python programming concepts, data structures, and algorithms',
      icon: Code,
      color: 'bg-green-500',
      premium: true,
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    },
    {
      id: '4',
      name: 'Java Programming',
      category: 'programming',
      language: 'Java',
      difficulty: 'intermediate',
      duration: 50,
      questions: 35,
      description: 'Object-oriented programming with Java, collections, and design patterns',
      icon: Code,
      color: 'bg-red-500',
      premium: true,
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
    },
    {
      id: '5',
      name: 'Node.js Backend',
      category: 'programming',
      language: 'JavaScript',
      difficulty: 'advanced',
      duration: 60,
      questions: 40,
      description: 'Server-side JavaScript with Express, APIs, and database integration',
      icon: Code,
      color: 'bg-green-600',
      premium: true,
      certification: true,
      officialIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    },
    {
      id: '6',
      name: 'Database Management',
      category: 'technical',
      difficulty: 'intermediate',
      duration: 35,
      questions: 25,
      description: 'SQL queries, database design, and optimization techniques',
      icon: Code,
      color: 'bg-purple-500',
      premium: true,
      certification: true
    },
    {
      id: '7',
      name: 'Communication Skills',
      category: 'non_technical',
      difficulty: 'beginner',
      duration: 25,
      questions: 20,
      description: 'Effective communication, presentation skills, and teamwork',
      icon: Users,
      color: 'bg-pink-500',
      premium: false,
      certification: false
    },
    {
      id: '8',
      name: 'Leadership & Management',
      category: 'non_technical',
      difficulty: 'advanced',
      duration: 30,
      questions: 25,
      description: 'Leadership principles, team management, and decision making',
      icon: Users,
      color: 'bg-orange-500',
      premium: true,
      certification: true
    }
  ]

  // Sample questions
  const sampleQuestions: { [key: string]: Question[] } = {
    '1': [
      {
        id: 1,
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correct_answer: 0,
        explanation: 'In JavaScript, variables can be declared using var, let, or const keywords.'
      },
      {
        id: 2,
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'add()', 'append()', 'insert()'],
        correct_answer: 0,
        explanation: 'The push() method adds one or more elements to the end of an array.'
      },
      {
        id: 3,
        question: 'What does the "===" operator do in JavaScript?',
        options: ['Assignment', 'Equality check', 'Strict equality check', 'Not equal'],
        correct_answer: 2,
        explanation: 'The === operator performs strict equality comparison without type coercion.'
      }
    ],
    '7': [
      {
        id: 1,
        question: 'What is the most important aspect of effective communication?',
        options: ['Speaking loudly', 'Active listening', 'Using complex words', 'Talking fast'],
        correct_answer: 1,
        explanation: 'Active listening is crucial for understanding others and building rapport.'
      },
      {
        id: 2,
        question: 'In a team meeting, what should you do when someone is speaking?',
        options: ['Interrupt with your ideas', 'Check your phone', 'Listen actively and take notes', 'Think about your response'],
        correct_answer: 2,
        explanation: 'Active listening and note-taking shows respect and helps retain information.'
      }
    ]
  }

  // Initialize data
  useEffect(() => {
    setCurrentAssessment(sampleAssessments[0])
    setFilteredAssessments(sampleAssessments)
  }, [])

  // Filter and sort assessments
  useEffect(() => {
    let filtered = sampleAssessments

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assessment =>
        assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(assessment => assessment.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(assessment => assessment.difficulty === selectedDifficulty)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'duration':
          return a.duration - b.duration
        default:
          return 0
      }
    })

    setFilteredAssessments(filtered)
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy])

  // Camera setup
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraPermission('granted')
      toast.success('Camera access granted')
    } catch (error) {
      setCameraPermission('denied')
      toast.error('Camera access denied')
    }
  }

  // Fullscreen handling
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        toast.success('Entered fullscreen mode')
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
    }
  }

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (assessmentFlow === 'assessment' && document.hidden) {
        setTabSwitchCount(prev => prev + 1)
        setWarningMessage('Tab Switch Detected: You switched tabs during the assessment. This is not allowed.')
        setShowWarning(true)
        setWarningCount(prev => prev + 1)

        if (warningCount >= 2) {
          handleExitAssessment()
          toast.error('Assessment terminated due to multiple violations')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [assessmentFlow, warningCount])

  // Timer for questions
  useEffect(() => {
    if (assessmentFlow === 'assessment' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && assessmentFlow === 'assessment') {
      handleNextQuestion()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft, assessmentFlow])

  // Start assessment
  const startAssessment = async (assessment: Assessment) => {
    if (assessment.premium && userPlan === 'free') {
      toast.error('This assessment requires a premium plan. Please upgrade to continue.')
      return
    }

    setCurrentAssessment(assessment)
    setAssessmentFlow('instructions')
  }

  const handleStartAssessment = async () => {
    await setupCamera()
    await enterFullscreen()
    setAssessmentFlow('assessment')
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(40)
    setWarningCount(0)
    setTabSwitchCount(0)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers(prev => [...prev, selectedAnswer])
    }

    if (currentAssessment && currentQuestion < sampleQuestions[currentAssessment.id]?.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(40)
    } else {
      handleSubmitAssessment()
    }
  }

  const handleSubmitAssessment = () => {
    if (!currentAssessment) return

    const questions = sampleQuestions[currentAssessment.id] || []
    const correctAnswers = answers.filter((answer, index) => answer === questions[index]?.correct_answer).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    setFinalScore(score)
    setAssessmentCompleted(true)
    setAssessmentFlow('results')
    exitFullscreen()

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleExitAssessment = () => {
    setAssessmentFlow('selection')
    setCurrentAssessment(null)
    setAssessmentCompleted(false)
    exitFullscreen()

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleRetakeAssessment = () => {
    if (userPlan === 'free') {
      toast.error('Free users can only retake assessments once. Please upgrade for unlimited attempts.')
      return
    }
    
    setAssessmentCompleted(false)
    setAssessmentFlow('instructions')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Main render
  if (assessmentFlow === 'selection') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Skills Assessment</h1>
              <p className="text-blue-100">Test your skills and earn certifications</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming</option>
              <option value="technical">Technical</option>
              <option value="non_technical">Non-Technical</option>
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'duration')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {assessment.officialIcon ? (
                      <img src={assessment.officialIcon} alt={assessment.name} className="w-8 h-8" />
                    ) : (
                      <div className={`w-12 h-12 ${assessment.color} rounded-lg flex items-center justify-center`}>
                        <assessment.icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{assessment.name}</h3>
                      <p className="text-sm text-gray-600">{assessment.language}</p>
                    </div>
                  </div>
                  {assessment.premium && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                    {assessment.difficulty}
                  </span>
                  {assessment.certification && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Award className="w-4 h-4" />
                      <span className="text-xs">Certificate</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{assessment.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{assessment.questions} questions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => startAssessment(assessment)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Assessment</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Instructions Modal
  if (assessmentFlow === 'instructions' && currentAssessment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assessment Instructions</h2>
              <button
                onClick={() => setAssessmentFlow('selection')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Assessment: {currentAssessment.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Duration: {currentAssessment.duration} minutes</div>
                  <div>Questions: {currentAssessment.questions}</div>
                  <div>Difficulty: {currentAssessment.difficulty}</div>
                  <div>Category: {currentAssessment.category}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Instructions:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">1.</span>
                    <span>This is a timed test. Please make sure you are not interrupted during the test.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">2.</span>
                    <span>Please ensure you have a stable internet connection.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">3.</span>
                    <span>We recommend you to use the latest version of Chrome or Firefox.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">4.</span>
                    <span>Before taking the test, please go through the FAQ to resolve any queries.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Integrity Guidelines</h4>
                <div className="space-y-2 text-sm text-yellow-800">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Camera access will be required to monitor the test</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Test will be taken in fullscreen mode</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tab switching will result in warnings (3 warnings = auto exit)</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setAssessmentFlow('selection')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartAssessment}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Assessment Interface
  if (assessmentFlow === 'assessment' && currentAssessment) {
    const questions = sampleQuestions[currentAssessment.id] || []
    const currentQuestionData = questions[currentQuestion]

    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentAssessment.name}</h2>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{timeLeft}s</span>
              </div>
              <button
                onClick={handleExitAssessment}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Question Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {currentQuestionData && (
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestionData.question}
                </h3>
                
                <div className="space-y-4">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Results Page
  if (assessmentFlow === 'results' && currentAssessment) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Completed!</h2>
          <p className="text-gray-600 mb-6">{currentAssessment.name}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{finalScore}%</div>
              <div className="text-sm text-gray-500">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{answers.length}</div>
              <div className="text-sm text-gray-500">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{currentAssessment.duration}</div>
              <div className="text-sm text-gray-500">Time Allocated (min)</div>
            </div>
          </div>

          {finalScore >= 70 && currentAssessment.certification && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Congratulations! You've earned a certificate!</span>
              </div>
            </div>
          )}

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setAssessmentFlow('selection')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back to Assessments
            </button>
            <button
              onClick={handleRetakeAssessment}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">No Assessments Available</h1>
      <p className="text-lg text-gray-600">Please contact the administrator to assign assessments.</p>
    </div>
  )
}

export default SkillsAssessment