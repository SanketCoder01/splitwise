'use client'

import { motion } from 'framer-motion'
import { Users, Share2, Gift, Copy, Mail, MessageCircle, Facebook, Twitter, Linkedin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ReferFriendPage() {
  const [referralCode] = useState('PMINT2024SANKET')
  const [referralLink] = useState('https://pminternship.gov.in/register?ref=PMINT2024SANKET')
  
  const referralStats = {
    totalReferred: 12,
    successful: 8,
    pending: 4,
    rewards: 2400
  }

  const referredFriends = [
    { name: 'Rahul Sharma', status: 'completed', date: '2024-01-15', reward: 300 },
    { name: 'Priya Patel', status: 'completed', date: '2024-01-12', reward: 300 },
    { name: 'Amit Kumar', status: 'pending', date: '2024-01-18', reward: 0 },
    { name: 'Sneha Gupta', status: 'completed', date: '2024-01-10', reward: 300 }
  ]

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const shareViaEmail = () => {
    const subject = 'Join PM Internship Portal - Amazing Government Opportunities!'
    const body = `Hi there!\n\nI wanted to share this amazing opportunity with you. The PM Internship Portal offers incredible internship opportunities with government organizations.\n\nUse my referral link to register: ${referralLink}\n\nBest regards!`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const shareViaSMS = () => {
    const message = `Check out PM Internship Portal for amazing government internships! Register using my link: ${referralLink}`
    window.open(`sms:?body=${encodeURIComponent(message)}`)
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
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Refer A Friend</h2>
          <p className="text-gray-600">Share the opportunity and earn rewards together!</p>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-blue-50 rounded-xl"
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">{referralStats.totalReferred}</div>
            <div className="text-sm text-blue-700">Total Referred</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-green-50 rounded-xl"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">{referralStats.successful}</div>
            <div className="text-sm text-green-700">Successfully Joined</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-yellow-50 rounded-xl"
          >
            <div className="text-2xl font-bold text-yellow-600 mb-1">{referralStats.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-4 bg-purple-50 rounded-xl"
          >
            <div className="text-2xl font-bold text-purple-600 mb-1">₹{referralStats.rewards}</div>
            <div className="text-sm text-purple-700">Rewards Earned</div>
          </motion.div>
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Referral Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono"
              />
              <button
                onClick={() => copyToClipboard(referralCode, 'Referral code')}
                className="flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => copyToClipboard(referralLink, 'Referral link')}
                className="flex items-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Share with Friends</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareViaEmail}
            className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Mail className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Email</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareViaSMS}
            className="flex flex-col items-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
          >
            <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">SMS</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Facebook className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Facebook</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Linkedin className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">LinkedIn</span>
          </motion.button>
        </div>
      </div>

      {/* Referred Friends */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Referred Friends</h3>
        
        <div className="space-y-4">
          {referredFriends.map((friend, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{friend.name}</h4>
                  <p className="text-sm text-gray-600">Joined on {friend.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  friend.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {friend.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
                {friend.reward > 0 && (
                  <p className="text-sm text-green-600 mt-1">+₹{friend.reward}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
        <div className="text-center">
          <Gift className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Earn ₹300 per Referral!</h3>
          <p className="mb-4">Get ₹300 for every friend who successfully completes their profile and gets verified.</p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-sm">
            <p><strong>How it works:</strong></p>
            <p>1. Share your referral link with friends</p>
            <p>2. They register and complete their profile</p>
            <p>3. You both earn ₹300 reward!</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
