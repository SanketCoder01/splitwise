'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Home, FileText, Bell, Calendar, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApplicationSuccessPage() {
  const router = useRouter()

  const nextSteps = [
    {
      icon: FileText,
      title: 'Application Review',
      description: 'Your application will be reviewed by the government panel within 5-7 business days.',
      timeline: '5-7 days'
    },
    {
      icon: Bell,
      title: 'Status Updates',
      description: 'You will receive email notifications about your application status.',
      timeline: 'Ongoing'
    },
    {
      icon: Calendar,
      title: 'Interview Process',
      description: 'If shortlisted, you will be contacted for an interview within 2 weeks.',
      timeline: '2 weeks'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Application Submitted Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Thank you for applying to the PM Internship Program. Your application has been received and will be reviewed by our government panel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Application Reference</h3>
            <p className="text-2xl font-mono text-blue-600 font-bold">PMI-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            <p className="text-sm text-blue-700 mt-2">Please save this reference number for future correspondence</p>
          </motion.div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <span className="text-xs text-blue-600 font-medium">{step.timeline}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/internships')}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <span>Browse More Internships</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@pminternship.gov.in" className="text-blue-600 hover:underline">
              support@pminternship.gov.in
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
