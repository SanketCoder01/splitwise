'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Target, Brain, BarChart3, MapPin, Award, 
  Settings, Play, Pause, RefreshCw, CheckCircle, 
  AlertCircle, TrendingUp, PieChart, Filter
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface AllocationRule {
  id: string
  name: string
  type: 'diversity' | 'geographic' | 'merit' | 'capacity'
  weight: number
  enabled: boolean
  description: string
}

interface AllocationResult {
  internship_id: string
  internship_title: string
  total_slots: number
  allocated_slots: number
  students: StudentAllocation[]
  diversity_score: number
  geographic_distribution: any
  merit_distribution: any
}

interface StudentAllocation {
  student_id: string
  student_name: string
  match_score: number
  diversity_category: string
  location: string
  merit_score: number
  allocated: boolean
  reason?: string
}

interface AllocationMetrics {
  total_students: number
  total_internships: number
  allocation_rate: number
  diversity_index: number
  geographic_coverage: number
  fairness_score: number
}

export default function SmartAllocation() {
  const { user } = useAuth()
  const [allocationRules, setAllocationRules] = useState<AllocationRule[]>([])
  const [allocationResults, setAllocationResults] = useState<AllocationResult[]>([])
  const [metrics, setMetrics] = useState<AllocationMetrics | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('rules')

  const tabs = [
    { id: 'rules', label: 'Allocation Rules', icon: Settings },
    { id: 'results', label: 'Allocation Results', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  useEffect(() => {
    initializeRules()
    fetchAllocationData()
  }, [])

  const initializeRules = () => {
    const defaultRules: AllocationRule[] = [
      {
        id: 'diversity',
        name: 'Diversity Quota',
        type: 'diversity',
        weight: 30,
        enabled: true,
        description: 'Ensure representation from different social categories (SC/ST/OBC/General)'
      },
      {
        id: 'geographic',
        name: 'Geographic Distribution',
        type: 'geographic',
        weight: 25,
        enabled: true,
        description: 'Maintain balanced representation across different states and regions'
      },
      {
        id: 'merit',
        name: 'Merit-based Selection',
        type: 'merit',
        weight: 35,
        enabled: true,
        description: 'Prioritize students based on academic performance and skills match'
      },
      {
        id: 'capacity',
        name: 'Capacity Management',
        type: 'capacity',
        weight: 10,
        enabled: true,
        description: 'Optimize allocation based on internship capacity and student preferences'
      }
    ]
    setAllocationRules(defaultRules)
  }

  const fetchAllocationData = () => {
    // Mock allocation results
    const mockResults: AllocationResult[] = [
      {
        internship_id: '1',
        internship_title: 'Software Development Intern - Ministry of Electronics & IT',
        total_slots: 10,
        allocated_slots: 8,
        diversity_score: 85,
        geographic_distribution: {
          'North': 3,
          'South': 2,
          'East': 1,
          'West': 2
        },
        merit_distribution: {
          'Excellent (90-100%)': 3,
          'Very Good (80-89%)': 4,
          'Good (70-79%)': 1
        },
        students: [
          {
            student_id: 'STU001',
            student_name: 'Rahul Sharma',
            match_score: 95,
            diversity_category: 'General',
            location: 'Delhi',
            merit_score: 88,
            allocated: true
          },
          {
            student_id: 'STU002',
            student_name: 'Priya Patel',
            match_score: 92,
            diversity_category: 'OBC',
            location: 'Gujarat',
            merit_score: 85,
            allocated: true
          }
        ]
      },
      {
        internship_id: '2',
        internship_title: 'Data Analytics Intern - Ministry of Statistics',
        total_slots: 8,
        allocated_slots: 6,
        diversity_score: 78,
        geographic_distribution: {
          'North': 2,
          'South': 3,
          'East': 1,
          'West': 0
        },
        merit_distribution: {
          'Excellent (90-100%)': 2,
          'Very Good (80-89%)': 3,
          'Good (70-79%)': 1
        },
        students: []
      }
    ]

    const mockMetrics: AllocationMetrics = {
      total_students: 150,
      total_internships: 25,
      allocation_rate: 68,
      diversity_index: 82,
      geographic_coverage: 75,
      fairness_score: 88
    }

    setAllocationResults(mockResults)
    setMetrics(mockMetrics)
  }

  const runAllocation = async () => {
    setIsRunning(true)
    
    try {
      // Simulate AI allocation process
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Refresh results
      fetchAllocationData()
    } catch (error) {
      console.error('Allocation error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const updateRule = (ruleId: string, updates: Partial<AllocationRule>) => {
    setAllocationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ))
  }

  const renderRules = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Allocation Rules Configuration</h3>
            <p className="text-gray-600">Configure AI-powered fairness rules for internship allocation</p>
          </div>
          <button
            onClick={runAllocation}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Allocation</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {allocationRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rule.type === 'diversity' ? 'bg-purple-100 text-purple-800' :
                    rule.type === 'geographic' ? 'bg-green-100 text-green-800' :
                    rule.type === 'merit' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Weight:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rule.weight}
                    onChange={(e) => updateRule(rule.id, { weight: parseInt(e.target.value) })}
                    className="w-20"
                  />
                  <span className="text-sm font-medium text-gray-900 w-8">{rule.weight}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rule.description}</p>
            </div>
          ))}
        </div>

        {/* Fairness Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Fairness Indicators</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">82%</div>
              <div className="text-sm text-gray-600">Diversity Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">75%</div>
              <div className="text-sm text-gray-600">Geographic Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">88%</div>
              <div className="text-sm text-gray-600">Fairness Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">68%</div>
              <div className="text-sm text-gray-600">Allocation Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Allocation Results</h3>
        
        <div className="space-y-4">
          {allocationResults.map((result) => (
            <motion.div
              key={result.internship_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedInternship === result.internship_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedInternship(
                selectedInternship === result.internship_id ? null : result.internship_id
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{result.internship_title}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">
                    {result.allocated_slots}/{result.total_slots} allocated
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    result.diversity_score >= 80 ? 'bg-green-100 text-green-800' :
                    result.diversity_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Diversity: {result.diversity_score}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(result.allocated_slots / result.total_slots) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Geographic Spread:</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(result.geographic_distribution).map(([region, count]) => (
                      <span key={region} className="mr-2">{region}: {String(count)}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Merit Distribution:</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(result.merit_distribution).map(([level, count]) => (
                      <div key={level}>{level}: {String(count)}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedInternship === result.internship_id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h5 className="font-medium text-gray-900 mb-3">Allocated Students</h5>
                    <div className="space-y-2">
                      {result.students.map((student) => (
                        <div key={student.student_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium text-gray-900">{student.student_name}</span>
                            <span className="ml-2 text-sm text-gray-600">({student.location})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">Match: {student.match_score}%</span>
                            <span className="text-gray-600">Merit: {student.merit_score}%</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              student.allocated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {student.allocated ? 'Allocated' : 'Not Allocated'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics && (
          <>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metrics.total_students}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metrics.total_internships}</div>
              <div className="text-sm text-gray-600">Total Internships</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metrics.allocation_rate}%</div>
              <div className="text-sm text-gray-600">Allocation Rate</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{metrics.fairness_score}%</div>
              <div className="text-sm text-gray-600">Fairness Score</div>
            </div>
          </>
        )}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Diversity Distribution</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <PieChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Diversity Chart</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Geographic Chart</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Optimization Opportunities</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Increase diversity quota by 5% for better representation</li>
              <li>• Focus on Eastern region recruitment</li>
              <li>• Consider skill-based micro-matching</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Fairness Metrics</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Diversity index above target (82% vs 75%)</li>
              <li>• Geographic coverage needs improvement</li>
              <li>• Merit distribution is well-balanced</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Predicted Outcomes</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• 95% student satisfaction expected</li>
              <li>• 88% completion rate projected</li>
              <li>• High employer satisfaction likely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Smart Allocation Engine</h2>
            <p className="text-gray-600">AI-powered fair allocation system with diversity and geographic balance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-600">Fairness-Aware AI</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'rules' && renderRules()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'analytics' && renderAnalytics()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
