'use client'

import { FileText, Download, AlertCircle, CheckCircle, Clock, Users, Shield, Award } from 'lucide-react'
import GovernmentHeader from '../../components/shared/GovernmentHeader'

const guidelines = [
  {
    id: 'eligibility',
    title: 'Eligibility Guidelines',
    icon: Shield,
    color: 'blue',
    sections: [
      {
        title: 'Academic Requirements',
        items: [
          'Must be enrolled in a recognized educational institution',
          'Minimum 60% marks in the latest qualifying examination',
          'Should be pursuing UG, PG, or Diploma courses',
          'Final year students and recent graduates are preferred'
        ]
      },
      {
        title: 'Age Criteria',
        items: [
          'Minimum age: 18 years',
          'Maximum age: 28 years (as on the date of application)',
          'Age relaxation as per government norms for reserved categories'
        ]
      },
      {
        title: 'Citizenship',
        items: [
          'Must be an Indian citizen',
          'Valid Aadhaar card is mandatory',
          'Permanent address in India required'
        ]
      }
    ]
  },
  {
    id: 'application',
    title: 'Application Guidelines',
    icon: FileText,
    color: 'green',
    sections: [
      {
        title: 'Registration Process',
        items: [
          'Complete profile registration with accurate information',
          'Upload all required documents in PDF format (max 2MB each)',
          'Verify email address and mobile number',
          'Complete profile verification through Aadhaar/DigiLocker'
        ]
      },
      {
        title: 'Document Requirements',
        items: [
          'Latest passport-size photograph',
          'Educational certificates and mark sheets',
          'Aadhaar card copy',
          'Bank account details and cancelled cheque',
          'Resume/CV in prescribed format'
        ]
      },
      {
        title: 'Application Submission',
        items: [
          'Review all information before final submission',
          'Applications can be edited until the deadline',
          'Submit applications well before the deadline',
          'Keep application reference number for future correspondence'
        ]
      }
    ]
  },
  {
    id: 'conduct',
    title: 'Code of Conduct',
    icon: Users,
    color: 'purple',
    sections: [
      {
        title: 'Professional Behavior',
        items: [
          'Maintain professional conduct at all times',
          'Respect workplace policies and culture',
          'Follow dress code and office timings',
          'Maintain confidentiality of sensitive information'
        ]
      },
      {
        title: 'Learning Attitude',
        items: [
          'Be proactive in learning and asking questions',
          'Complete assigned tasks within deadlines',
          'Seek feedback and implement suggestions',
          'Maintain a learning journal/log'
        ]
      },
      {
        title: 'Communication',
        items: [
          'Communicate effectively with supervisors and colleagues',
          'Report progress regularly',
          'Raise concerns or issues promptly',
          'Use official communication channels only'
        ]
      }
    ]
  },
  {
    id: 'assessment',
    title: 'Assessment & Evaluation',
    icon: Award,
    color: 'orange',
    sections: [
      {
        title: 'Performance Evaluation',
        items: [
          'Regular assessment by assigned mentors',
          'Mid-term and final evaluation reports',
          'Peer feedback and self-assessment',
          'Project presentation and documentation'
        ]
      },
      {
        title: 'Completion Requirements',
        items: [
          'Minimum 90% attendance required',
          'Complete all assigned projects and tasks',
          'Submit final internship report',
          'Participate in exit interview'
        ]
      },
      {
        title: 'Certification',
        items: [
          'Certificate issued upon successful completion',
          'Digital certificate available on DigiLocker',
          'Performance rating included in certificate',
          'Letter of recommendation (based on performance)'
        ]
      }
    ]
  }
]

const importantNotes = [
  {
    type: 'warning',
    title: 'Important Deadlines',
    content: 'Applications must be submitted before the deadline. Late applications will not be considered under any circumstances.'
  },
  {
    type: 'info',
    title: 'Document Verification',
    content: 'All documents will be verified through government databases. Providing false information may lead to disqualification.'
  },
  {
    type: 'success',
    title: 'Selection Process',
    content: 'Selection is based on merit, relevance of course, and availability of positions. All eligible candidates will be considered fairly.'
  }
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={true} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Internship Guidelines
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these guidelines carefully before applying for internships. 
            Following these guidelines will ensure a smooth application process and successful internship experience.
          </p>
        </div>

        {/* Important Notes */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {importantNotes.map((note, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  note.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  note.type === 'info' ? 'bg-blue-50 border-blue-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-center mb-2">
                  {note.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  ) : note.type === 'info' ? (
                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  )}
                  <h3 className={`font-semibold ${
                    note.type === 'warning' ? 'text-yellow-800' :
                    note.type === 'info' ? 'text-blue-800' :
                    'text-green-800'
                  }`}>
                    {note.title}
                  </h3>
                </div>
                <p className={`text-sm ${
                  note.type === 'warning' ? 'text-yellow-700' :
                  note.type === 'info' ? 'text-blue-700' :
                  'text-green-700'
                }`}>
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Sections */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guidelines.map((guideline) => (
              <div key={guideline.id} className="bg-white rounded-lg shadow-sm border">
                <div className={`p-6 border-b bg-gradient-to-r ${
                  guideline.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  guideline.color === 'green' ? 'from-green-500 to-green-600' :
                  guideline.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                } text-white`}>
                  <div className="flex items-center">
                    <guideline.icon className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">{guideline.title}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {guideline.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Download Complete Guidelines
            </h3>
            <p className="text-gray-600 mb-6">
              Get the complete PDF version of all guidelines for offline reference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Download PDF (English)
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Download PDF (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Need Clarification?</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these guidelines, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:guidelines@pminternship.gov.in"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Email: guidelines@pminternship.gov.in
              </a>
              <a
                href="tel:1800-111-333"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Helpline: 1800-111-333
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
