'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle, User, FileText, Shield, Clock } from 'lucide-react'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'application' | 'eligibility' | 'technical' | 'documents'
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What is the PM Internship Portal?',
    answer: 'The PM Internship Portal is a government initiative by the Ministry of Education to provide internship opportunities to students across various government departments and PSUs. It aims to bridge the gap between academic learning and practical industry experience.',
    category: 'general'
  },
  {
    id: '2',
    question: 'Who is eligible to apply for internships?',
    answer: 'Students pursuing undergraduate, postgraduate, or diploma courses from recognized institutions are eligible. Age limit is 18-28 years. Indian citizenship is mandatory. Minimum 60% marks in the latest qualifying examination.',
    category: 'eligibility'
  },
  {
    id: '3',
    question: 'How do I register on the portal?',
    answer: 'Click on "Student Registration" from the homepage. Fill in your personal details, educational information, and create a secure password. Verify your email address and complete your profile to start applying.',
    category: 'application'
  },
  {
    id: '4',
    question: 'What documents are required for registration?',
    answer: 'You need: Aadhaar card, educational certificates, passport-size photograph, bank account details, and a valid email address. All documents should be in PDF format, not exceeding 2MB each.',
    category: 'documents'
  },
  {
    id: '5',
    question: 'Is there any application fee?',
    answer: 'No, the PM Internship Portal is completely free. There are no registration fees, application fees, or any other charges. Beware of fraudulent websites asking for money.',
    category: 'general'
  },
  {
    id: '6',
    question: 'How long is the internship duration?',
    answer: 'Internship duration varies from 2-6 months depending on the department and role. Most internships are for 3-4 months. Duration details are mentioned in each internship posting.',
    category: 'general'
  },
  {
    id: '7',
    question: 'Will I receive a stipend during the internship?',
    answer: 'Yes, all internships under the PM Internship Portal provide a monthly stipend ranging from ₹15,000 to ₹50,000 depending on the role, department, and location.',
    category: 'general'
  },
  {
    id: '8',
    question: 'Can I apply for multiple internships?',
    answer: 'Yes, you can apply for multiple internships, but you can accept only one offer at a time. We recommend applying for internships that match your skills and career goals.',
    category: 'application'
  },
  {
    id: '9',
    question: 'What if I forget my password?',
    answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and you will receive a password reset link. Follow the instructions to create a new password.',
    category: 'technical'
  },
  {
    id: '10',
    question: 'How will I know if my application is selected?',
    answer: 'You will receive email notifications and SMS alerts for all application updates. You can also check your application status in the "My Applications" section of your dashboard.',
    category: 'application'
  },
  {
    id: '11',
    question: 'Can I edit my profile after registration?',
    answer: 'Yes, you can edit most of your profile information anytime from your dashboard. However, some critical information like Aadhaar number cannot be changed once verified.',
    category: 'technical'
  },
  {
    id: '12',
    question: 'What is the selection process?',
    answer: 'The selection process includes: 1) Profile screening, 2) Document verification, 3) Online assessment (if applicable), 4) Interview (virtual/in-person), 5) Final selection and offer letter.',
    category: 'application'
  }
]

const categories = [
  { id: 'all', label: 'All FAQs', icon: HelpCircle },
  { id: 'general', label: 'General', icon: User },
  { id: 'application', label: 'Application', icon: FileText },
  { id: 'eligibility', label: 'Eligibility', icon: Shield },
  { id: 'technical', label: 'Technical', icon: Clock },
  { id: 'documents', label: 'Documents', icon: FileText }
]

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about the PM Internship Portal. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
              <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="border-t pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            faq.category === 'general' ? 'bg-blue-100 text-blue-800' :
                            faq.category === 'application' ? 'bg-green-100 text-green-800' :
                            faq.category === 'eligibility' ? 'bg-purple-100 text-purple-800' :
                            faq.category === 'technical' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-8 text-white text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-orange-100 mb-6">
              Our support team is here to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@pminternship.gov.in"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:1800-111-222"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-colors"
              >
                Call: 1800-111-222
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
