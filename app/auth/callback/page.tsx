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
          
          // Check if user has a profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('profile_completed, profile_step, full_name')
            .eq('id', data.session.user.id)
            .single()

          // If no profile exists, create one (new user)
          if (profileError && profileError.code === 'PGRST116') {
            console.log('🆕 Creating profile for new user:', data.session.user.id)
            
            // Get user metadata from auth
            const userMetadata = data.session.user.user_metadata || {}
            
            const { error: createProfileError } = await supabase
              .from('profiles')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: userMetadata.full_name || '',
                phone: userMetadata.phone || '',
                role: 'student',
                profile_step: 1,
                profile_completed: false,
                document_verified: false,
                aadhaar_verified: false,
                digilocker_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (createProfileError) {
              console.error('❌ Error creating profile:', createProfileError)
              toast.error('Error setting up your profile. Please contact support.')
              router.push('/login')
              return
            }
            
            console.log('✅ Profile created successfully')
            toast.success('Account setup complete! Please complete your profile.')
            router.push('/dashboard/student')
            return
          }

          // Redirect based on profile completion status
          if (profileData?.profile_completed) {
            router.push('/dashboard')
          } else {
            router.push('/dashboard/student')
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
