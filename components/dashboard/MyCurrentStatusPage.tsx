'use client'

import { motion } from 'framer-motion'
import { User, CheckCircle, Clock, AlertCircle, CreditCard, Folder, FileText, Award } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function MyCurrentStatusPage() {
  const handleAadhaarKYC = () => {
    toast.success('Aadhaar e-KYC process initiated!')
  }

  const handleDigilocker = () => {
    toast.success('DigiLocker integration started!')
  }

  const statusItems = [
    {
      title: 'Profile Completion',
      status: 'completed',
      progress: 100,
      icon: User,
      description: 'Your profile is complete'
    },
    {
      title: 'Document Verification',
      status: 'in-progress',
      progress: 75,
      icon: FileText,
      description: 'Some documents pending verification'
    },
    {
      title: 'Skill Assessment',
      status: 'pending',
      progress: 0,
      icon: Award,
      description: 'Complete your skill assessment'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <User className="w-8 h-8 mr-3 text-orange-600" />
          My Current Status
        </h2>
        <p className="text-gray-600 mb-8">Track your progress and complete pending tasks</p>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statusItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-green-100' :
                  item.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.status === 'completed' ? 'text-green-600' :
                    item.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                {item.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                {item.status === 'in-progress' && <Clock className="w-6 h-6 text-yellow-500" />}
                {item.status === 'pending' && <AlertCircle className="w-6 h-6 text-gray-400" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{item.progress}% Complete</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Aadhaar e-KYC Section */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Aadhaar based e-KYC</h3>
        
        <div className="flex justify-center space-x-6 mb-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAadhaarKYC}
            className="flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
          >
            <CreditCard className="w-6 h-6" />
            <span>Aadhaar e-KYC</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDigilocker}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg"
          >
            <Folder className="w-6 h-6" />
            <span>Digilocker</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Note:</strong> If you are facing issues in completing your e-KYC with Digilocker or if you need to update your profile information, please refer to
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  Digilocker FAQ at <a href="#" className="text-blue-600 underline">https://www.digilocker.gov.in/about/faq</a>
                </p>
                <p className="text-sm text-blue-800">
                  or you can raise a ticket with Digilocker at <a href="#" className="text-blue-600 underline">https://support.digilocker.gov.in/open</a>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> If your profile information such as name, date of birth, gender, address etc. does not match, please update your profile first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Next Steps</h3>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-800">Profile Completed</h4>
              <p className="text-sm text-green-600">Your profile setup is complete</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Clock className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Complete Document Verification</h4>
              <p className="text-sm text-yellow-600">Upload and verify your remaining documents</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-blue-800">Take Skill Assessment</h4>
              <p className="text-sm text-blue-600">Complete your skill assessment to improve your profile</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
