import { createClient } from '@supabase/supabase-js'

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Get the correct site URL for redirects
const getSiteUrl = () => {
  // Priority order: Environment variable > Vercel URL > Window location > Fallback
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // For client-side, use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for server-side rendering
  return 'https://splitwise-jet.vercel.app'
}

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('placeholder') || 
    supabaseAnonKey.includes('placeholder')) {
  console.error('❌ Supabase configuration error: Missing or invalid environment variables')
  console.error('Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: false
    },
    global: {
      headers: {
        'x-client-info': 'pm-internship-portal'
      }
    },
    db: {
      schema: 'public'
    }
  }
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         !supabaseUrl.includes('placeholder') && 
         !supabaseAnonKey.includes('placeholder')
}

// Enhanced authentication helper with timeout and retry logic
export const authenticateWithTimeout = async (
  email: string, 
  password: string, 
  timeoutMs: number = 15000
): Promise<{ data: any; error: any }> => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not properly configured. Please check your environment variables.' }
    }
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Authentication request timeout')), timeoutMs)
  )

  const authPromise = supabase.auth.signInWithPassword({
    email,
    password,
  })

  try {
    const result = await Promise.race([authPromise, timeoutPromise])
    return result as { data: any; error: any }
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return {
        data: null,
        error: { message: 'Authentication request timed out. Please check your internet connection and try again.' }
      }
    }
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Authentication failed' }
    }
  }
}

// Magic link authentication with timeout
export const sendMagicLinkWithTimeout = async (
  email: string, 
  timeoutMs: number = 10000
): Promise<{ data: any; error: any }> => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not properly configured. Please check your environment variables.' }
    }
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Magic link request timeout')), timeoutMs)
  )

  const siteUrl = getSiteUrl()
  console.log('🔗 Sending magic link with redirect to:', `${siteUrl}/auth/callback`)

  const magicLinkPromise = supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  })

  try {
    const result = await Promise.race([magicLinkPromise, timeoutPromise])
    return result as { data: any; error: any }
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      return {
        data: null,
        error: { message: 'Magic link request timed out. Please check your internet connection and try again.' }
      }
    }
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Magic link failed' }
    }
  }
}

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  file_name: string
  file_path: string
  extracted_data: any
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field?: string
  grade?: string
  start_date: string
  end_date: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: 'technical' | 'soft'
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  verified: boolean
  created_at: string
}

export interface Document {
  id: string
  user_id: string
  type: 'resume' | 'certificate' | 'id_proof' | 'education' | 'experience'
  name: string
  file_path: string
  verification_status: 'pending' | 'verified' | 'rejected'
  verified_by?: string
  verified_at?: string
  created_at: string
}

export interface Grievance {
  id: string
  user_id: string
  subject: string
  description: string
  category: 'technical' | 'verification' | 'application' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  resolution?: string
  created_at: string
  updated_at: string
}

export interface SkillAssessment {
  id: string
  user_id: string
  skill_name: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
  status: 'completed' | 'in_progress' | 'not_started'
  created_at: string
}
