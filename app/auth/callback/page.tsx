'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import toast from 'react-hot-toast'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed. Please try again.')
          router.push('/login')
          return
        }

        if (data.session) {
          toast.success('Email verified successfully!')
          
          // Check if user has completed profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('profile_completed, profile_step')
            .eq('id', data.session.user.id)
            .single()

          // Redirect based on profile completion status
          if (profileData?.profile_completed) {
            router.push('/dashboard')
          } else {
            router.push('/dashboard?tab=profile-steps')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        toast.error('An error occurred. Please try logging in again.')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your account...</p>
      </div>
    </div>
  )
}
