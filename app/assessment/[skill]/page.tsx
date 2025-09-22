'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  Award,
  AlertCircle,
  Timer,
  Code,
  Brain,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'code' | 'scenario'
  options?: string[]
  correctAnswer?: string | number
  code?: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

interface AssessmentData {
  skill: string
  duration: number // in minutes
  totalQuestions: number
  passingScore: number
  questions: Question[]
}

export default function SkillAssessment() {
  const params = useParams()
  const skillParam = params?.skill as string
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock assessment data
  const assessmentData: AssessmentData = {
    skill: skillParam?.replace('-', '.') || 'React.js',
    duration: 30,
    totalQuestions: 10,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is the purpose of React hooks?',
        type: 'multiple-choice',
        options: [
          'To add state and lifecycle methods to functional components',
          'To create class components',
          'To handle routing in React applications',
          'To manage CSS styles'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which hook is used to manage state in functional components?',
        type: 'multiple-choice',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        points: 10
      },
      {
        id: '3',
        question: 'What will be the output of this React component?',
        type: 'code',
        code: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, []);
  
  return <div>{count}</div>;
}`,
        options: ['0', '1', 'undefined', 'Error'],
        correctAnswer: 1,
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'How do you prevent unnecessary re-renders in React?',
        type: 'multiple-choice',
        options: [
          'Use React.memo() and useMemo()',
          'Use only class components',
          'Avoid using state',
          'Use inline functions'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'You need to fetch data when a component mounts and clean up when it unmounts. Which approach is correct?',
        type: 'scenario',
        options: [
          'Use useEffect with empty dependency array and return cleanup function',
          'Use useState to fetch data',
          'Use useContext for data fetching',
          'Fetch data in render method'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        points: 20
      }
    ]
  }

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitAssessment()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStarted, timeLeft])

  const startAssessment = () => {
    setIsStarted(true)
    setTimeLeft(assessmentData.duration * 60) // Convert to seconds
  }

  const handleAnswerSelect = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0
    
    assessmentData.questions.forEach(question => {
      maxScore += question.points
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        totalScore += question.points
      }
    })
    
    return Math.round((totalScore / maxScore) * 100)
  }

  const handleSubmitAssessment = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const finalScore = calculateScore()
    setScore(finalScore)
    setIsCompleted(true)
    setIsLoading(false)
    
    if (finalScore >= assessmentData.passingScore) {
      toast.success(`Congratulations! You scored ${finalScore}%`)
    } else {
      toast.error(`You scored ${finalScore}%. Minimum passing score is ${assessmentData.passingScore}%`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentQ = assessmentData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentData.questions.length) * 100

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="government-header">
          <div className="container mx-auto px-4 py-4">
            <Link href="/dashboard/student" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-government-blue" />
              </div>
              <div>
                <h1 className="text-lg font-bold">RESUCHAIN</h1>
                <p className="text-xs opacity-75">SKILLS ASSESSMENT</p>
              </div>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                score >= assessmentData.passingScore ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {score >= assessmentData.passingScore ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assessment Completed!
              </h2>
              
              <div className="mb-6">
                <div className={`text-4xl font-bold mb-2 ${
                  score >= assessmentData.passingScore ? 'text-green-600' : 'text-red-600'
                }`}>
                  {score}%
                </div>
                <p className="text-gray-600">
                  {score >= assessmentData.passingScore 
                    ? `Congratulations! You passed the ${assessmentData.skill} assessment.`
                    : `You need ${assessmentData.passingScore}% to pass. Keep practicing!`
                  }
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-government-blue">{assessmentData.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-government-blue">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-government-blue">
                    {assessmentData.questions.filter(q => answers[q.id] === q.correctAnswer).length}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/student" className="btn-primary">
                  Back to Dashboard
                </Link>
                {score < assessmentData.passingScore && (
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Retake Assessment
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="government-header">
          <div className="container mx-auto px-4 py-4">
            <Link href="/dashboard/student" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-government-blue" />
              </div>
              <div>
                <h1 className="text-lg font-bold">RESUCHAIN</h1>
                <p className="text-xs opacity-75">SKILLS ASSESSMENT</p>
              </div>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-government-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {assessmentData.skill} Assessment
                </h2>
                <p className="text-gray-600">
                  Test your knowledge and skills in {assessmentData.skill}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Timer className="w-6 h-6 text-government-blue" />
                  <div>
                    <div className="font-semibold">Duration</div>
                    <div className="text-sm text-gray-600">{assessmentData.duration} minutes</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-government-blue" />
                  <div>
                    <div className="font-semibold">Questions</div>
                    <div className="text-sm text-gray-600">{assessmentData.totalQuestions} questions</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-government-blue" />
                  <div>
                    <div className="font-semibold">Passing Score</div>
                    <div className="text-sm text-gray-600">{assessmentData.passingScore}%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-government-blue" />
                  <div>
                    <div className="font-semibold">Question Types</div>
                    <div className="text-sm text-gray-600">Multiple choice, Code, Scenarios</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-8">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Assessment Guidelines:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• You have {assessmentData.duration} minutes to complete the assessment</li>
                      <li>• You can navigate between questions but cannot pause the timer</li>
                      <li>• Make sure you have a stable internet connection</li>
                      <li>• The assessment will auto-submit when time expires</li>
                      <li>• You need {assessmentData.passingScore}% to pass this assessment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startAssessment}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Assessment
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <header className="government-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-government-blue" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{assessmentData.skill} Assessment</h1>
                <p className="text-xs opacity-75">Question {currentQuestion + 1} of {assessmentData.questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-government-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="card p-8"
          >
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">{currentQ.points} points</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQ.question}
              </h3>

              {currentQ.code && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
                  <pre>{currentQ.code}</pre>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQ.id] === index
                      ? 'border-government-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswerSelect(currentQ.id, index)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === index
                        ? 'border-government-blue bg-government-blue'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestion === assessmentData.questions.length - 1 ? (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner w-4 h-4 border-2"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Assessment</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Question Navigation */}
          <div className="mt-8 card p-6">
            <h4 className="font-medium text-gray-800 mb-4">Question Navigation</h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {assessmentData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-government-blue text-white'
                      : answers[assessmentData.questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-government-blue rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Not Answered</span>
                </div>
              </div>
              <span>
                {Object.keys(answers).length} of {assessmentData.questions.length} answered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
