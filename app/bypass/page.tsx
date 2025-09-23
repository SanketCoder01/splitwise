'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function BypassPage() {
  const router = useRouter()

  useEffect(() => {
    toast.success('🚀 Bypassing authentication - Going to dashboard!')
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Development Bypass</h2>
        <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
          <p className="text-sm text-yellow-800">
            🔧 This bypass is for development purposes only
          </p>
        </div>
      </div>
    </div>
  )
}
