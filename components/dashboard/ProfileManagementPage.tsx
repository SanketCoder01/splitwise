'use client'

import { motion } from 'framer-motion'
import { User, Edit, Save, Camera, Mail, Phone, MapPin, GraduationCap, Award, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface ProfileManagementPageProps {
  onProfileComplete?: () => void
}

export default function ProfileManagementPage({ onProfileComplete }: ProfileManagementPageProps = {}) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'Sanket Gupta',
    email: 'sanketg367@gmail.com',
    phone: '+91 9876543210',
    address: 'New Delhi, India',
    education: 'B.Tech Computer Science',
    institution: 'Delhi Technological University',
    year: '2024',
    skills: ['React', 'Node.js', 'Python', 'MongoDB'],
    experience: '2 years',
    bio: 'Passionate software developer with experience in full-stack development and government technology initiatives.'
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const profileCompletion = 85

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <User className="w-8 h-8 mr-3 text-orange-600" />
              Profile Management
            </h2>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isEditing 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isEditing ? <Save className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </motion.button>
        </div>

        {/* Profile Completion */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
            <span className="text-2xl font-bold text-orange-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profileCompletion}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Complete your profile to increase your chances of getting selected</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{profileData.fullName}</h3>
            <p className="text-gray-600">Student</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-3" />
              <span className="text-sm">{profileData.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-5 h-5 mr-3" />
              <span className="text-sm">{profileData.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <span className="text-sm">{profileData.address}</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.address}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-orange-600" />
            Education
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.education}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.institution}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Graduation</label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.year}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-orange-600" />
            Skills & Experience
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                {profileData.experience}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
