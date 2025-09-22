'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, XCircle, Upload, FileText, CreditCard, Folder } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function DocumentVerificationPage() {
  const documents = [
    {
      id: 1,
      name: 'Aadhaar Card',
      status: 'verified',
      uploadDate: '2024-01-15',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      name: 'Educational Certificate',
      status: 'pending',
      uploadDate: '2024-01-16',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 3,
      name: 'Bank Account Details',
      status: 'rejected',
      uploadDate: '2024-01-14',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const handleAadhaarKYC = () => {
    toast.success('Aadhaar e-KYC process initiated!')
  }

  const handleDigilocker = () => {
    toast.success('DigiLocker integration started!')
  }

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
          <Shield className="w-8 h-8 mr-3 text-orange-600" />
          Document Verification
        </h2>
        <p className="text-gray-600 mb-8">Verify your documents to complete your profile</p>

        {/* Quick Actions */}
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
            <span>DigiLocker</span>
          </motion.button>
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Document Status</h3>
        
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${doc.bgColor} rounded-xl p-6 border`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${doc.bgColor} rounded-full flex items-center justify-center mr-4`}>
                    <doc.icon className={`w-6 h-6 ${doc.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{doc.name}</h4>
                    <p className="text-sm text-gray-600">Uploaded on: {doc.uploadDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {doc.status === 'verified' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Verified</span>
                    </div>
                  )}
                  {doc.status === 'pending' && (
                    <div className="flex items-center text-yellow-600">
                      <Upload className="w-5 h-5 mr-2" />
                      <span className="font-medium">Pending</span>
                    </div>
                  )}
                  {doc.status === 'rejected' && (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Rejected</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload New Document */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Upload New Document</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">Upload Document</h4>
          <p className="text-gray-500 mb-4">Drag and drop your document here, or click to browse</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Choose File
          </button>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-3">Important Notes</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• All documents must be clear and readable</li>
          <li>• Supported formats: PDF, JPG, PNG (Max 5MB)</li>
          <li>• Verification process takes 24-48 hours</li>
          <li>• Ensure all information matches your profile details</li>
        </ul>
      </div>
    </motion.div>
  )
}
