import { NextRequest, NextResponse } from 'next/server'

interface VerifyProfileRequest {
  platform: 'linkedin' | 'github'
  url: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyProfileRequest = await request.json()
    const { platform, url } = body

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Platform and URL are required' },
        { status: 400 }
      )
    }

    if (!['linkedin', 'github'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be linkedin or github' },
        { status: 400 }
      )
    }

    let exists = false

    try {
      if (platform === 'linkedin') {
        exists = await verifyLinkedInProfile(url)
      } else if (platform === 'github') {
        exists = await verifyGitHubProfile(url)
      }
    } catch (error) {
      console.error(`Error verifying ${platform} profile:`, error)
      // If verification fails due to network issues, we'll assume it exists
      // to not block the user unnecessarily
      exists = true
    }

    return NextResponse.json({
      platform,
      url,
      exists,
      verifiedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Profile verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function verifyLinkedInProfile(url: string): Promise<boolean> {
  try {
    // Extract username from LinkedIn URL
    const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)([a-zA-Z0-9_-]+)/i
    const match = url.match(linkedinRegex)

    if (!match) {
      return false
    }

    const username = match[1]

    // For LinkedIn, we'll do a basic check by trying to access the profile
    // Note: LinkedIn has anti-scraping measures, so this is a basic check
    const profileUrl = `https://www.linkedin.com/in/${username}`

    const response = await fetch(profileUrl, {
      method: 'HEAD', // Use HEAD to avoid downloading the full page
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000)
    })

    // LinkedIn returns 200 for existing profiles, 404 for non-existent ones
    // However, LinkedIn may return 999 for rate limiting or other blocks
    return response.status === 200

  } catch (error) {
    console.error('LinkedIn verification error:', error)
    // If we can't verify due to network issues, assume it exists
    return true
  }
}

async function verifyGitHubProfile(url: string): Promise<boolean> {
  try {
    // Extract username from GitHub URL
    const githubRegex = /github\.com\/([a-zA-Z0-9_-]+)/i
    const match = url.match(githubRegex)

    if (!match) {
      return false
    }

    const username = match[1]

    // GitHub API is more reliable for verification
    const apiUrl = `https://api.github.com/users/${username}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ResumeChain-Verification/1.0'
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000)
    })

    // GitHub returns 200 for existing users, 404 for non-existent ones
    return response.status === 200

  } catch (error) {
    console.error('GitHub verification error:', error)
    // If we can't verify due to network issues, assume it exists
    return true
  }
}