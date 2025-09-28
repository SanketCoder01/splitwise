'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Bot, User, X, Minimize2, Maximize2, 
  Brain, Zap, HelpCircle, FileText, Briefcase
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { id: 'application-status', label: 'Check Application Status', icon: FileText },
    { id: 'internship-help', label: 'Find Internships', icon: Briefcase },
    { id: 'document-help', label: 'Document Upload Help', icon: HelpCircle },
    { id: 'general-help', label: 'General Help', icon: Brain }
  ]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your AI assistant for the Government Internship Portal. I can help you with applications, document uploads, finding internships, and answering questions. How can I assist you today?",
        timestamp: new Date(),
        suggestions: [
          "How do I apply for internships?",
          "What documents do I need?",
          "Check my application status",
          "Help with resume building"
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content.trim())
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    let response = ""
    let suggestions: string[] = []

    if (input.includes('application') || input.includes('status')) {
      response = "I can help you check your application status! Based on your profile, you have 3 applications submitted:\n\n1. Software Development Intern - Under Review\n2. Data Analytics Intern - Shortlisted ✅\n3. Digital Marketing Intern - Pending\n\nWould you like more details about any specific application?"
      suggestions = [
        "Tell me about the shortlisted application",
        "When will I hear back?",
        "How to prepare for interview?"
      ]
    } else if (input.includes('document') || input.includes('upload')) {
      response = "For document uploads, you'll need:\n\n📄 ID Proof (Aadhaar/PAN/Passport)\n🎓 Bonafide Certificate from your college\n📊 Latest mark sheets/transcripts\n📝 Resume/CV\n\nOur AI system will automatically extract information from your documents. Make sure they're clear and readable!"
      suggestions = [
        "What file formats are supported?",
        "My document was rejected, why?",
        "How long does verification take?"
      ]
    } else if (input.includes('internship') || input.includes('find') || input.includes('search')) {
      response = "Great! I can help you find the perfect internships. Based on your profile, I've found 12 highly matching opportunities:\n\n🎯 95% Match: Software Development Intern at Ministry of Electronics & IT\n🎯 88% Match: Data Analytics Intern at Ministry of Statistics\n\nWould you like me to show you more details or help you apply?"
      suggestions = [
        "Show me all recommended internships",
        "Filter by location",
        "What skills do I need to improve?"
      ]
    } else if (input.includes('resume') || input.includes('cv')) {
      response = "I can help you build an amazing resume! Our AI-powered resume builder offers:\n\n✨ Grammar and spell checking\n🎯 Keyword optimization for your target roles\n📊 ATS-friendly formatting\n💡 Content suggestions based on your profile\n\nYour current resume score is 85%. Want to improve it?"
      suggestions = [
        "How to improve my resume score?",
        "What keywords should I add?",
        "Show me resume templates"
      ]
    } else if (input.includes('help') || input.includes('how')) {
      response = "I'm here to help! Here are the main things I can assist you with:\n\n🎯 Finding and applying to internships\n📄 Document upload and verification\n📝 Resume building and optimization\n📊 Application status tracking\n💬 General questions about the portal\n\nWhat would you like to know more about?"
      suggestions = [
        "How does the matching algorithm work?",
        "What are the eligibility criteria?",
        "How to contact support?"
      ]
    } else {
      response = "I understand you're asking about that. Let me help you with the most relevant information based on your query. Could you please be more specific about what you'd like to know?\n\nI can help with internship applications, document uploads, resume building, and general portal questions."
      suggestions = [
        "Find internships for me",
        "Help with documents",
        "Check application status",
        "Resume building tips"
      ]
    }

    return {
      id: `bot_${Date.now()}`,
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    }
  }

  const handleQuickAction = (actionId: string) => {
    const actionMap: { [key: string]: string } = {
      'application-status': 'Check my application status',
      'internship-help': 'Help me find internships',
      'document-help': 'I need help with document upload',
      'general-help': 'I need general help with the portal'
    }
    
    handleSendMessage(actionMap[actionId])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      } transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Start a conversation with your AI assistant!</p>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Suggested questions:</p>
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center space-x-2 px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
