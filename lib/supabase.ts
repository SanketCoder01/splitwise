import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'pm-internship-portal'
    }
  }
})

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
