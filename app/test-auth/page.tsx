'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function TestAuth() {
  const { user, loading } = useAuth()
  const [testResult, setTestResult] = useState<any>(null)

  const testLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      setTestResult({ data, error, type: 'login' })
    } catch (err) {
      setTestResult({ error: err, type: 'login' })
    }
  }

  const testSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      setTestResult({ data, error, type: 'session' })
    } catch (err) {
      setTestResult({ error: err, type: 'session' })
    }
  }

  const testUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      setTestResult({ data, error, type: 'user' })
    } catch (err) {
      setTestResult({ error: err, type: 'user' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Context Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
              {user && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testLogin}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Test Login
              </button>
              <button
                onClick={testSession}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Test Session
              </button>
              <button
                onClick={testUser}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
              >
                Test Get User
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Result ({testResult.type})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
