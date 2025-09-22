'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthDebugger() {
  const [authState, setAuthState] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setAuthState({
        session: session,
        user: session?.user || null,
        timestamp: new Date().toISOString()
      })
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setAuthState({
        event,
        session,
        user: session?.user || null,
        timestamp: new Date().toISOString()
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded text-xs z-50"
      >
        Debug Auth
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 max-w-sm text-xs z-50 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Auth Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        <div>
          <strong>Status:</strong> {authState?.session ? 'Logged In' : 'Not Logged In'}
        </div>
        {authState?.user && (
          <>
            <div>
              <strong>Email:</strong> {authState.user.email}
            </div>
            <div>
              <strong>Confirmed:</strong> {authState.user.email_confirmed_at ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User ID:</strong> {authState.user.id?.substring(0, 8)}...
            </div>
          </>
        )}
        <div>
          <strong>Last Event:</strong> {authState?.event || 'None'}
        </div>
        <div>
          <strong>Updated:</strong> {authState?.timestamp?.substring(11, 19)}
        </div>
      </div>
    </div>
  )
}
