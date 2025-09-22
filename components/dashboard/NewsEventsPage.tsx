'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, ExternalLink, Bell, Star } from 'lucide-react'

export default function NewsEventsPage() {
  const newsItems = [
    {
      id: 1,
      title: 'New Internship Opportunities in Digital India Initiative',
      content: 'The Ministry of Electronics & IT announces 500+ new internship positions across various digital transformation projects.',
      date: '2024-01-20',
      time: '10:30 AM',
      category: 'Announcement',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      views: 1250
    },
    {
      id: 2,
      title: 'PM Internship Portal Reaches 1 Million Registrations',
      content: 'A milestone achievement as the portal successfully onboards its millionth student, showcasing the program\'s growing popularity.',
      date: '2024-01-18',
      time: '2:15 PM',
      category: 'Achievement',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop',
      views: 890
    },
    {
      id: 3,
      title: 'Skill Development Workshop Series Launched',
      content: 'Free online workshops covering AI, Machine Learning, and Data Science for all registered students.',
      date: '2024-01-15',
      time: '9:00 AM',
      category: 'Workshop',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
      views: 654
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Virtual Career Fair 2024',
      date: '2024-02-15',
      time: '10:00 AM - 6:00 PM',
      location: 'Online Platform',
      participants: 500,
      description: 'Connect with top government organizations and explore internship opportunities.'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Bootcamp',
      date: '2024-02-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Delhi Technology Hub',
      participants: 150,
      description: 'Intensive 3-day bootcamp on AI/ML fundamentals and applications.'
    },
    {
      id: 3,
      title: 'Government Innovation Challenge',
      date: '2024-03-01',
      time: '9:00 AM - 8:00 PM',
      location: 'India Gate Lawns',
      participants: 1000,
      description: 'Showcase innovative solutions for government digitization challenges.'
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
          <Calendar className="w-8 h-8 mr-3 text-orange-600" />
          News & Events
        </h2>
        <p className="text-gray-600">Stay updated with the latest announcements and upcoming events</p>
      </div>

      {/* Latest News */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-orange-600" />
          Latest News
        </h3>
        
        <div className="space-y-6">
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col lg:flex-row bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="lg:w-1/3 mb-4 lg:mb-0 lg:mr-6">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-48 lg:h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    news.priority === 'high' ? 'bg-red-100 text-red-800' :
                    news.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {news.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {news.date} at {news.time}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{news.title}</h4>
                <p className="text-gray-600 mb-3">{news.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {news.views} views
                  </div>
                  <button className="flex items-center text-orange-600 hover:text-orange-800 font-medium">
                    Read More
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-2 text-orange-600" />
          Upcoming Events
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-orange-600" />
                  {event.participants} participants expected
                </div>
              </div>
              
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Register Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="mb-6">Subscribe to our newsletter for the latest updates and announcements</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
