'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, GraduationCap, Award, FileText, Download, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import GovernmentHeader from '../../../components/shared/GovernmentHeader'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  father_name: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  pincode: string
  education_level: string
  institution_name: string
  course_name: string
  year_of_passing: string
  percentage_cgpa: string
  bank_name: string
  account_number: string
  ifsc_code: string
  account_holder_name: string
  skills: string[]
  languages: string[]
  profile_image: string
  resume_url: string
  profile_completion: number
}

export default function ViewProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeSection, setActiveSection] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setProfile({ ...profile, email: user.email })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const sections = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'contact', label: 'Contact Information', icon: Mail },
    { id: 'education', label: 'Education Details', icon: GraduationCap },
    { id: 'bank', label: 'Bank Details', icon: FileText },
    { id: 'skills', label: 'Skills & Languages', icon: Award }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GovernmentHeader showNavigation={false} showUserActions={true} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GovernmentHeader showNavigation={false} showUserActions={true} />
        <div className="text-center py-20">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader showNavigation={false} showUserActions={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/student" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-orange-600" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.full_name || 'Name Not Provided'}
                </h1>
                <p className="text-lg text-gray-600 mb-1">
                  ID: PMI-{profile.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dashboard/student"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                  
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </a>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {profile.profile_completion}%
                </div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">Profile Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-3" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {/* Personal Details */}
              {activeSection === 'personal' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-orange-600" />
                    Personal Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.full_name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.date_of_birth || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.gender || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.father_name || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Mail className="w-6 h-6 mr-3 text-orange-600" />
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {[profile.address_line1, profile.address_line2, profile.city, profile.state, profile.pincode]
                          .filter(Boolean)
                          .join(', ') || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Details */}
              {activeSection === 'education' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <GraduationCap className="w-6 h-6 mr-3 text-orange-600" />
                    Education Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.education_level || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.institution_name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.course_name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Passing</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.year_of_passing || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.percentage_cgpa || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {activeSection === 'bank' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-orange-600" />
                    Bank Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.bank_name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.account_holder_name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {profile.account_number ? `****${profile.account_number.slice(-4)}` : 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile.ifsc_code || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Languages */}
              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-3 text-orange-600" />
                    Skills & Languages
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills added</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages && profile.languages.length > 0 ? (
                          profile.languages.map((language, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {language}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No languages added</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
