'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle, Clock, Award, Target, TrendingUp, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft'
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  verified: boolean
}

interface Assessment {
  id: string
  skill_name: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
  status: 'completed' | 'in_progress' | 'not_started'
  created_at: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
}

export default function SkillsAssessment() {
  const { user } = useAuth()
  const [skills, setSkills] = useState<Skill[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [assessmentStarted, setAssessmentStarted] = useState(false)

  // Sample questions for different skills
  const skillQuestions: { [key: string]: Question[] } = {
    'JavaScript': [
      {
        id: 1,
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correct_answer: 0
      },
      {
        id: 2,
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'add()', 'append()', 'insert()'],
        correct_answer: 0
      },
      {
        id: 3,
        question: 'What does "=== " operator do in JavaScript?',
        options: ['Assignment', 'Equality check', 'Strict equality check', 'Not equal'],
        correct_answer: 2
      }
    ],
    'React': [
      {
        id: 1,
        question: 'What is JSX in React?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extension', 'JavaScript Extension'],
        correct_answer: 0
      },
      {
        id: 2,
        question: 'Which hook is used for state management in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correct_answer: 1
      }
    ],
    'Communication': [
      {
        id: 1,
        question: 'What is the most important aspect of effective communication?',
        options: ['Speaking loudly', 'Active listening', 'Using complex words', 'Talking fast'],
        correct_answer: 1
      },
      {
        id: 2,
        question: 'In a team meeting, what should you do when someone is speaking?',
        options: ['Interrupt with your ideas', 'Check your phone', 'Listen actively and take notes', 'Think about your response'],
        correct_answer: 2
      }
    ]
  }

  const availableSkills = [
    { name: 'JavaScript', category: 'technical' as const },
    { name: 'React', category: 'technical' as const },
    { name: 'Python', category: 'technical' as const },
    { name: 'Communication', category: 'soft' as const },
    { name: 'Leadership', category: 'soft' as const },
    { name: 'Problem Solving', category: 'soft' as const }
  ]

  useEffect(() => {
    if (user) {
      fetchSkills()
      fetchAssessments()
    }
  }, [user])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (assessmentStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && assessmentStarted) {
      handleSubmitAssessment()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, assessmentStarted])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user?.id)

    if (data) {
      setSkills(data)
    }
  }

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (data) {
      setAssessments(data)
    }
  }

  const startAssessment = (skillName: string) => {
    setActiveAssessment(skillName)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(300) // 5 minutes
    setAssessmentStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      setSelectedAnswer(null)

      const questions = skillQuestions[activeAssessment!] || []
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        handleSubmitAssessment(newAnswers)
      }
    }
  }

  const handleSubmitAssessment = async (finalAnswers?: number[]) => {
    if (!activeAssessment || !user) return

    const questions = skillQuestions[activeAssessment] || []
    const userAnswers = finalAnswers || answers
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index]?.correct_answer
    ).length

    const score = Math.round((correctAnswers / questions.length) * 100)
    const timeTaken = 300 - timeLeft

    // Save assessment to database
    const { error } = await supabase
      .from('skill_assessments')
      .insert({
        user_id: user.id,
        skill_name: activeAssessment,
        score,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        time_taken: timeTaken,
        status: 'completed'
      })

    if (!error) {
      // Update or create skill record
      const proficiency = score >= 90 ? 'expert' : score >= 70 ? 'advanced' : score >= 50 ? 'intermediate' : 'beginner'
      
      const { error: skillError } = await supabase
        .from('skills')
        .upsert({
          user_id: user.id,
          name: activeAssessment,
          category: availableSkills.find(s => s.name === activeAssessment)?.category || 'technical',
          proficiency,
          verified: score >= 70
        })

      fetchSkills()
      fetchAssessments()
    }

    setAssessmentStarted(false)
    setActiveAssessment(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert': return 'bg-green-100 text-green-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (activeAssessment && assessmentStarted) {
    const questions = skillQuestions[activeAssessment] || []
    const question = questions[currentQuestion]

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Assessment Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{activeAssessment} Assessment</h2>
              <p className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
              <div className="text-xs text-gray-500">Time Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {question && (
            <div>
              {/* Question */}
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedAnswer !== null
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Available Assessments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Skill Assessments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSkills.map((skill) => {
            const hasAssessment = assessments.find(a => a.skill_name === skill.name)
            const userSkill = skills.find(s => s.name === skill.name)
            
            return (
              <div key={skill.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.category === 'technical' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {skill.category}
                  </span>
                </div>
                
                {hasAssessment ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className={`font-semibold ${getScoreColor(hasAssessment.score)}`}>
                        {hasAssessment.score}%
                      </span>
                    </div>
                    {userSkill && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Level:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getProficiencyColor(userSkill.proficiency)}`}>
                          {userSkill.proficiency}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => startAssessment(skill.name)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startAssessment(skill.name)}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Assessment</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Assessment History */}
      {assessments.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Assessment History</h2>
          
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{assessment.skill_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{assessment.correct_answers}/{assessment.total_questions} correct</span>
                    <span>{Math.floor(assessment.time_taken / 60)}m {assessment.time_taken % 60}s</span>
                    <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(assessment.score)}`}>
                    {assessment.score}%
                  </div>
                  {assessment.score >= 70 && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Overview */}
      {skills.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  {skill.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                    {skill.proficiency}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.category === 'technical' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {skill.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
