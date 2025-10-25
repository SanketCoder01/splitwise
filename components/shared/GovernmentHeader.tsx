import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface GovernmentHeaderProps {
  showNavigation?: boolean
  showUserActions?: boolean
}

export default function GovernmentHeader({ 
  showNavigation = false, 
  showUserActions = false 
}: GovernmentHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Error logging out')
      console.error('Logout error:', error)
    }
  }
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full">
        {/* Top Government Bar */}
        <div className="bg-gray-100 px-4 py-2 text-sm">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 text-gray-600">
              <span>🇮🇳 भारत सरकार | Government of India</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>🌐 English</span>
              <span>|</span>
              <span>हिंदी</span>
              <span>|</span>
              <span>Screen Reader</span>
              <span>A-</span>
              <span>A</span>
              <span>A+</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PM Internship & Resume Verifier</h1>
                <p className="text-sm text-gray-600">MINISTRY OF EDUCATION</p>
                <p className="text-xs text-gray-500">Government of India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm font-semibold text-orange-600">विकसित भारत</div>
                <div className="text-xs text-gray-500">@2047</div>
              </div>
              
              {showUserActions && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Only show if requested */}
        {showNavigation && (
          <div className="px-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-12 py-4 overflow-x-auto w-full">
              {[
                { id: 'dashboard', label: 'Dashboard', href: '/dashboard/student' },
                { id: 'faqs', label: 'FAQs', href: '/faqs' },
                { id: 'guidelines', label: 'Guidelines', href: '/guidelines' },
                { id: 'partner-companies', label: 'Partner Companies', href: '/partner-companies' },
                { id: 'manuals', label: 'Manuals', href: '/manuals' },
                { id: 'tutorials', label: 'Tutorials/Guidance Videos', href: '/tutorials' },
                { id: 'apply-internship', label: 'Apply Internship', href: '/internships' },
                { id: 'my-shared-portal', label: 'My Shared Portal', href: '/my-portal' }
              ].map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg whitespace-nowrap transition-all duration-200 hover:scale-105"
                >
                  <span>{tab.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
