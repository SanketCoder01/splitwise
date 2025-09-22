'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Download, Calendar, Filter, 
  Users, Target, Award, MapPin, Brain, FileText, 
  PieChart, Activity, Zap, Eye, RefreshCw
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ReportMetrics {
  total_applications: number
  total_students: number
  total_internships: number
  completion_rate: number
  satisfaction_score: number
  placement_rate: number
}

interface RegionalData {
  region: string
  students: number
  internships: number
  completion_rate: number
}

interface SkillsData {
  skill: string
  demand: number
  supply: number
  gap: number
}

interface TrendData {
  month: string
  applications: number
  placements: number
  completions: number
}

interface AIInsight {
  type: 'trend' | 'recommendation' | 'prediction' | 'alert'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

export default function ReportsAnalytics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null)
  const [regionalData, setRegionalData] = useState<RegionalData[]>([])
  const [skillsData, setSkillsData] = useState<SkillsData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const timeRanges = [
    { id: '1month', label: 'Last Month' },
    { id: '3months', label: 'Last 3 Months' },
    { id: '6months', label: 'Last 6 Months' },
    { id: '1year', label: 'Last Year' }
  ]

  const reportTypes = [
    { id: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
    { id: 'regional', label: 'Regional Analysis', icon: MapPin },
    { id: 'skills', label: 'Skills Gap Analysis', icon: Target },
    { id: 'trends', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain }
  ]

  useEffect(() => {
    fetchReportData()
  }, [selectedTimeRange])

  const fetchReportData = async () => {
    setLoading(true)
    
    try {
      // Mock data
      const mockMetrics: ReportMetrics = {
        total_applications: 1250,
        total_students: 890,
        total_internships: 45,
        completion_rate: 87,
        satisfaction_score: 4.6,
        placement_rate: 73
      }

      const mockRegionalData: RegionalData[] = [
        { region: 'North India', students: 320, internships: 15, completion_rate: 89 },
        { region: 'South India', students: 280, internships: 12, completion_rate: 92 },
        { region: 'West India', students: 180, internships: 10, completion_rate: 85 },
        { region: 'East India', students: 110, internships: 8, completion_rate: 78 }
      ]

      const mockSkillsData: SkillsData[] = [
        { skill: 'JavaScript', demand: 85, supply: 65, gap: -20 },
        { skill: 'Python', demand: 90, supply: 70, gap: -20 },
        { skill: 'Data Analysis', demand: 75, supply: 45, gap: -30 },
        { skill: 'Digital Marketing', demand: 60, supply: 80, gap: 20 },
        { skill: 'UI/UX Design', demand: 70, supply: 40, gap: -30 }
      ]

      const mockTrendData: TrendData[] = [
        { month: 'Jan', applications: 180, placements: 120, completions: 95 },
        { month: 'Feb', applications: 220, placements: 150, completions: 110 },
        { month: 'Mar', applications: 280, placements: 190, completions: 140 },
        { month: 'Apr', applications: 320, placements: 220, completions: 165 },
        { month: 'May', applications: 250, placements: 180, completions: 155 }
      ]

      const mockAIInsights: AIInsight[] = [
        {
          type: 'trend',
          title: 'Rising Demand for Data Science Skills',
          description: 'AI analysis shows 40% increase in data science internship applications over the last quarter.',
          impact: 'high',
          confidence: 92
        },
        {
          type: 'recommendation',
          title: 'Expand Eastern Region Programs',
          description: 'Low participation from Eastern states suggests need for targeted outreach and more regional internships.',
          impact: 'medium',
          confidence: 85
        },
        {
          type: 'prediction',
          title: 'Expected 25% Growth in Applications',
          description: 'Based on current trends, we predict a 25% increase in applications for the next quarter.',
          impact: 'high',
          confidence: 88
        },
        {
          type: 'alert',
          title: 'Skills Gap in Cybersecurity',
          description: 'Critical shortage of cybersecurity skills among applicants while demand remains high.',
          impact: 'high',
          confidence: 95
        }
      ]

      setMetrics(mockMetrics)
      setRegionalData(mockRegionalData)
      setSkillsData(mockSkillsData)
      setTrendData(mockTrendData)
      setAiInsights(mockAIInsights)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (type: string) => {
    setGenerating(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // In real implementation, this would generate and download a PDF/Excel report
      console.log(`Generated ${type} report`)
    } catch (error) {
      console.error('Report generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.total_applications}</div>
          <div className="text-sm text-gray-600">Applications</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.total_students}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.total_internships}</div>
          <div className="text-sm text-gray-600">Internships</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.completion_rate}%</div>
          <div className="text-sm text-gray-600">Completion</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Activity className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.satisfaction_score}</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{metrics?.placement_rate}%</div>
          <div className="text-sm text-gray-600">Placement</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Trend Chart</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <PieChart className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Regional Chart</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Performing Regions</h4>
            <div className="space-y-2">
              {regionalData.slice(0, 3).map((region, index) => (
                <div key={region.region} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-900">
                    #{index + 1} {region.region}
                  </span>
                  <span className="text-sm text-gray-600">{region.completion_rate}% completion</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Skills in High Demand</h4>
            <div className="space-y-2">
              {skillsData.filter(skill => skill.gap < 0).slice(0, 3).map((skill, index) => (
                <div key={skill.skill} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                  <span className="text-sm text-red-600">{Math.abs(skill.gap)}% gap</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegionalAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Performance Analysis</h3>
        
        <div className="space-y-4">
          {regionalData.map((region) => (
            <div key={region.region} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{region.region}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  region.completion_rate >= 90 ? 'bg-green-100 text-green-800' :
                  region.completion_rate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {region.completion_rate}% completion
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Students:</span>
                  <div className="text-lg font-semibold text-gray-900">{region.students}</div>
                </div>
                <div>
                  <span className="text-gray-600">Internships:</span>
                  <div className="text-lg font-semibold text-gray-900">{region.internships}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ratio:</span>
                  <div className="text-lg font-semibold text-gray-900">
                    {(region.students / region.internships).toFixed(1)}:1
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${region.completion_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSkillsAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Gap Analysis</h3>
        
        <div className="space-y-4">
          {skillsData.map((skill) => (
            <div key={skill.skill} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  skill.gap > 0 ? 'bg-green-100 text-green-800' :
                  skill.gap < -20 ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {skill.gap > 0 ? 'Surplus' : 'Gap'}: {Math.abs(skill.gap)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Demand</span>
                    <span className="text-gray-900">{skill.demand}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${skill.demand}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Supply</span>
                    <span className="text-gray-900">{skill.supply}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${skill.supply}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
        </div>
        
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    insight.type === 'trend' ? 'bg-blue-500' :
                    insight.type === 'recommendation' ? 'bg-green-500' :
                    insight.type === 'prediction' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`}></div>
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.impact} impact
                  </span>
                  <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
            <p className="text-gray-600">Comprehensive insights with AI-generated trends and predictions</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
            <button
              onClick={() => generateReport(selectedReport)}
              disabled={generating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{generating ? 'Generating...' : 'Export Report'}</span>
            </button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`flex items-center space-x-2 flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedReport === type.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedReport}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedReport === 'overview' && renderOverview()}
            {selectedReport === 'regional' && renderRegionalAnalysis()}
            {selectedReport === 'skills' && renderSkillsAnalysis()}
            {selectedReport === 'trends' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis - Coming Soon</h3>
                <p className="text-gray-600">Detailed trend analysis with predictive modeling.</p>
              </div>
            )}
            {selectedReport === 'ai-insights' && renderAIInsights()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
