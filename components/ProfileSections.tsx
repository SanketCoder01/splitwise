'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Upload, Save, Edit } from 'lucide-react'

interface ProfileSectionProps {
  sectionId: string
  title: string
  completed: boolean
  onComplete: (sectionId: string) => void
}

export const EKYCSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [verified, setVerified] = useState(completed)

  const handleVerify = () => {
    if (aadhaarNumber && panNumber) {
      setVerified(true)
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {verified && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={12}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter PAN number"
            maxLength={10}
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={!aadhaarNumber || !panNumber || verified}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verified ? 'Verified ✓' : 'Verify e-KYC'}
        </button>
      </div>
    </div>
  )
}

export const PersonalDetailsSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    category: '',
    fatherName: '',
    motherName: ''
  })

  const handleSave = () => {
    const isComplete = Object.values(formData).every(value => value.trim() !== '')
    if (isComplete) {
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
          <input
            type="text"
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter father's name"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Details</span>
        </button>
      </div>
    </div>
  )
}

export const ContactDetailsSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const handleSave = () => {
    const requiredFields = ['email', 'phone', 'address', 'city', 'state', 'pincode']
    const isComplete = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '')
    if (isComplete) {
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter complete address"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            <option value="delhi">Delhi</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="tamil-nadu">Tamil Nadu</option>
            <option value="gujarat">Gujarat</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="uttar-pradesh">Uttar Pradesh</option>
            <option value="west-bengal">West Bengal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter PIN code"
            maxLength={6}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact Details</span>
        </button>
      </div>
    </div>
  )
}

export const EducationDetailsSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [educationData, setEducationData] = useState({
    qualification: '',
    institution: '',
    board: '',
    passingYear: '',
    percentage: '',
    specialization: ''
  })

  const handleSave = () => {
    const requiredFields = ['qualification', 'institution', 'board', 'passingYear', 'percentage']
    const isComplete = requiredFields.every(field => educationData[field as keyof typeof educationData].trim() !== '')
    if (isComplete) {
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification *</label>
          <select
            value={educationData.qualification}
            onChange={(e) => setEducationData({ ...educationData, qualification: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Qualification</option>
            <option value="10th">10th Standard</option>
            <option value="12th">12th Standard</option>
            <option value="diploma">Diploma</option>
            <option value="graduation">Graduation</option>
            <option value="post-graduation">Post Graduation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
          <input
            type="text"
            value={educationData.institution}
            onChange={(e) => setEducationData({ ...educationData, institution: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter institution name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Board/University *</label>
          <input
            type="text"
            value={educationData.board}
            onChange={(e) => setEducationData({ ...educationData, board: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter board/university name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year *</label>
          <select
            value={educationData.passingYear}
            onChange={(e) => setEducationData({ ...educationData, passingYear: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i
              return <option key={year} value={year}>{year}</option>
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Percentage/CGPA *</label>
          <input
            type="text"
            value={educationData.percentage}
            onChange={(e) => setEducationData({ ...educationData, percentage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter percentage or CGPA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          <input
            type="text"
            value={educationData.specialization}
            onChange={(e) => setEducationData({ ...educationData, specialization: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter specialization (if any)"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Education Details</span>
        </button>
      </div>
    </div>
  )
}

export const BankDetailsSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [bankData, setBankData] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: ''
  })

  const handleSave = () => {
    const isComplete = Object.values(bankData).every(value => value.trim() !== '') && 
                      bankData.accountNumber === bankData.confirmAccountNumber
    if (isComplete) {
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
          <input
            type="text"
            value={bankData.accountNumber}
            onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter account number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Account Number *</label>
          <input
            type="text"
            value={bankData.confirmAccountNumber}
            onChange={(e) => setBankData({ ...bankData, confirmAccountNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Re-enter account number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
          <input
            type="text"
            value={bankData.ifscCode}
            onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter IFSC code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
          <input
            type="text"
            value={bankData.bankName}
            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
          <input
            type="text"
            value={bankData.branchName}
            onChange={(e) => setBankData({ ...bankData, branchName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter branch name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
          <select
            value={bankData.accountType}
            onChange={(e) => setBankData({ ...bankData, accountType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Account Type</option>
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
        </div>
      </div>

      {bankData.accountNumber !== bankData.confirmAccountNumber && bankData.confirmAccountNumber && (
        <div className="mt-2 text-sm text-red-600">
          Account numbers do not match
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Bank Details</span>
        </button>
      </div>
    </div>
  )
}

export const SkillsLanguagesSection = ({ sectionId, title, completed, onComplete }: ProfileSectionProps) => {
  const [skillsData, setSkillsData] = useState({
    technicalSkills: [] as string[],
    softSkills: [] as string[],
    languages: [] as string[],
    certifications: [] as string[]
  })

  const [newSkill, setNewSkill] = useState('')
  const [skillType, setSkillType] = useState('technicalSkills')

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkillsData({
        ...skillsData,
        [skillType]: [...skillsData[skillType as keyof typeof skillsData], newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (type: string, index: number) => {
    setSkillsData({
      ...skillsData,
      [type]: skillsData[type as keyof typeof skillsData].filter((_, i) => i !== index)
    })
  }

  const handleSave = () => {
    const hasSkills = Object.values(skillsData).some(arr => arr.length > 0)
    if (hasSkills) {
      onComplete(sectionId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
      </div>

      <div className="space-y-6">
        {/* Add Skills */}
        <div className="flex space-x-2">
          <select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="technicalSkills">Technical Skills</option>
            <option value="softSkills">Soft Skills</option>
            <option value="languages">Languages</option>
            <option value="certifications">Certifications</option>
          </select>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter skill and press Enter"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Display Skills */}
        {Object.entries(skillsData).map(([type, skills]) => (
          <div key={type}>
            <h4 className="font-medium text-gray-900 mb-2 capitalize">
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(type, index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Skills & Languages</span>
        </button>
      </div>
    </div>
  )
}
