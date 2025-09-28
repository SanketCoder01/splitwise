import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Use CommonJS requires to avoid ESM interop issues in the server runtime
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mammoth = require('mammoth')

// Local text extraction for PDF/DOCX
async function extractTextLocally(fileBuffer: Buffer, fileName: string): Promise<string> {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) {
    const parsed = await pdfParse(fileBuffer)
    return parsed.text || ''
  }
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer })
    return value || ''
  }
  throw new Error('Unsupported file format')
}

// Parsers
function extractPersonalInfo(text: string) {
  const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)
  const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,5}/)
  const linkedinMatch = text.match(/linkedin\.com\/[A-Za-z0-9_\-\/]+/i)
  const githubMatch = text.match(/github\.com\/[A-Za-z0-9_\-]+/i)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let name = ''
  for (const line of lines.slice(0, 10)) {
    if (!/@|\d/.test(line) && /[A-Za-z]/.test(line) && line.split(' ').length <= 5) {
      name = line
      break
    }
  }
  const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)|([A-Z][a-z]+\s*,\s*[A-Z]{2})/)
  return {
    name,
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    location: locationMatch ? (locationMatch[0]) : '',
    linkedin: linkedinMatch?.[0] || '',
    github: githubMatch?.[0] || ''
  }
}

function extractExperience(text: string) {
  const expSection = /(?:experience|work history|employment)([\s\S]*?)(?=education|skills|projects|certificates|$)/i.exec(text)
  const experience: any[] = []
  if (expSection) {
    const entries = expSection[1].split(/\n\s*\n/)
    for (const entry of entries) {
      const lines = entry.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) continue
      const position = lines.find(l => /developer|engineer|manager|analyst|designer|lead/i.test(l)) || lines[0]
      const company = lines.find(l => /^[A-Za-z&.,\-\s]{2,}$/.test(l) && !/@|\d/.test(l)) || ''
      const dateMatch = entry.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i)
      const duration = dateMatch ? `${dateMatch[1]} - ${dateMatch[2]}` : ''
      const description = entry.substring(0, 400)
      if (position || company) {
        experience.push({
          id: uuidv4(),
          company,
          position,
          location: '',
          startDate: duration ? duration.split(' - ')[0] : '',
          endDate: duration ? duration.split(' - ')[1] : '',
          current: /present|current/i.test(duration),
          description,
          proofUploaded: false
        })
      }
    }
  }
  return experience
}

function extractEducation(text: string) {
  const eduSection = /(?:education|academic|qualification)([\s\S]*?)(?=experience|skills|projects|certificates|$)/i.exec(text)
  const education: any[] = []
  if (eduSection) {
    const entries = eduSection[1].split(/\n\s*\n/)
    for (const entry of entries) {
      const degreeMatch = entry.match(/(bachelor|master|phd|b\.?tech|m\.?tech|b\.?sc|m\.?sc|mba|b\.e\.|m\.e\.)/i)
      if (!degreeMatch) continue
      const degree = degreeMatch[0]
      const institution = (entry.split('\n').find(l => /university|college|institute|school/i.test(l)) || '').trim()
      const yearMatch = entry.match(/(20\d{2}|19\d{2})/g)
      const year = yearMatch ? yearMatch[yearMatch.length - 1] : ''
      education.push({
        id: uuidv4(),
        institution,
        degree,
        field: '',
        startDate: '',
        endDate: year,
        grade: '',
        location: ''
      })
    }
  }
  return education
}

function extractSkills(text: string) {
  const lower = text.toLowerCase()
  const tech: string[] = []
  const possible = [
    'javascript','typescript','react','node','python','java','c++','c#','php','ruby','go','rust','sql','html','css','docker','kubernetes','aws','azure','gcp','mongodb','mysql','postgresql','git','github','jira','postman'
  ]
  for (const s of possible) {
    if (lower.includes(s)) tech.push(s.charAt(0).toUpperCase() + s.slice(1))
  }
  return { technical: Array.from(new Set(tech)), soft: [] as string[] }
}

function extractCertificates(text: string) {
  const certs: any[] = []
  const patterns = [
    /(aws|azure|google cloud|gcp)\s+(certified|associate|professional)/ig,
    /(microsoft certified|microsoft azure|microsoft office)/ig,
    /(cisco certified|ccna|ccnp|ccie)/ig,
    /(pmp|scrum master|six sigma|csm|cspo)/ig,
    /(google cloud professional|associate cloud engineer)/ig
  ]

  for (const pattern of patterns) {
    const matches = text.match(pattern) || []
    for (const m of matches) {
      // Extract certificate ID from context
      const certId = extractCertificateId(text, m)
      const issuer = extractCertificateIssuer(m)
      const date = extractCertificateDate(text, m)

      certs.push({
        id: uuidv4(),
        name: m,
        issuer,
        certificateId: certId,
        issueDate: date,
        verificationStatus: 'pending',
        verified: false
      })
    }
  }
  return certs
}

function extractCertificateId(text: string, certName: string): string {
  // Look for ID patterns near the certificate name
  const start = text.indexOf(certName)
  if (start === -1) return ''

  const context = text.substring(Math.max(0, start - 50), Math.min(text.length, start + certName.length + 50))

  // Common ID patterns
  const idPatterns = [
    /([A-Z]{2,}-[A-Z0-9-]+)/g,
    /(ID|Certificate|Cert):\s*([A-Z0-9-]+)/gi,
    /#([A-Z0-9-]+)/g
  ]

  for (const pattern of idPatterns) {
    const matches = context.match(pattern)
    if (matches) {
      return matches[0].replace(/^(ID|Certificate|Cert):\s*/i, '').replace(/^#/, '')
    }
  }

  return ''
}

function extractCertificateIssuer(certName: string): string {
  const lower = certName.toLowerCase()
  if (lower.includes('aws')) return 'Amazon Web Services'
  if (lower.includes('azure') || lower.includes('microsoft')) return 'Microsoft'
  if (lower.includes('google')) return 'Google'
  if (lower.includes('cisco')) return 'Cisco'
  if (lower.includes('pmp')) return 'Project Management Institute'
  if (lower.includes('scrum')) return 'Scrum Alliance'
  return 'Unknown'
}

function extractCertificateDate(text: string, certName: string): string {
  const start = text.indexOf(certName)
  if (start === -1) return ''

  const context = text.substring(Math.max(0, start - 30), Math.min(text.length, start + certName.length + 30))

  const dateMatch = context.match(/(20\d{2}|19\d{2})/)
  return dateMatch ? dateMatch[0] : ''
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    try {
      await fs.access(uploadsDir)
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    // Save file temporarily
    const fileName = `${uuidv4()}-${file.name}`
    const filePath = path.join(uploadsDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    try {
      // Read file content
      const fileBuffer = await fs.readFile(filePath)

      let extractedData: any

      try {
        // Try to call AI service for extraction
        const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001'
        const formData = new FormData()
        const blob = new Blob([new Uint8Array(fileBuffer)], {
          type: file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        formData.append('file', blob, file.name)

        const aiResponse = await fetch(`${aiServiceUrl}/parse-resume-file`, {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json()

          // Transform AI service response to expected format
          extractedData = {
            personalInfo: {
              name: aiResult.personal_info?.name || '',
              email: aiResult.personal_info?.email || '',
              phone: aiResult.personal_info?.phone || '',
              location: aiResult.personal_info?.location || '',
              linkedin: aiResult.personal_info?.linkedin || '',
              github: aiResult.personal_info?.github || ''
            },
            professionalSummary: '',
            experience: (aiResult.experience || []).map((exp: any) => ({
              id: uuidv4(),
              company: exp.company || '',
              position: exp.position || '',
              location: '',
              startDate: exp.duration ? exp.duration.split(' - ')[0] : '',
              endDate: exp.duration ? exp.duration.split(' - ')[1] : '',
              current: exp.duration?.toLowerCase().includes('present') || exp.duration?.toLowerCase().includes('current'),
              description: exp.description || '',
              proofUploaded: false
            })),
            education: (aiResult.education || []).map((edu: any) => ({
              id: uuidv4(),
              institution: edu.institution || '',
              degree: edu.degree || '',
              field: '',
              startDate: '',
              endDate: edu.year || '',
              grade: '',
              location: ''
            })),
            skills: {
              technical: (aiResult.skills || [])
                .filter((skill: any) => skill.category === 'programming' || skill.category === 'databases' || skill.category === 'cloud' || skill.category === 'tools')
                .map((skill: any) => skill.name) || [],
              soft: (aiResult.skills || [])
                .filter((skill: any) => skill.category === 'soft_skills')
                .map((skill: any) => skill.name) || []
            },
            certificates: (aiResult.certificates || []).map((cert: any) => ({
              id: uuidv4(),
              name: cert.name || '',
              issuer: cert.issuer || '',
              certificateId: cert.certificateId || '',
              issueDate: cert.date || '',
              verificationStatus: cert.certificateId ? 'pending' : 'pending',
              verified: false
            })),
            projects: [],
            awards: [],
            languages: []
          }
        } else {
          throw new Error('AI service not available')
        }
      } catch (aiError) {
        if (aiError instanceof Error) {
          console.log('AI service not available, falling back to local extraction:', aiError.message)
        } else {
          console.log('AI service not available, falling back to local extraction:', String(aiError))
        }

        // Fallback to local extraction when AI service is not available
        const text = await extractTextLocally(fileBuffer, file.name)

        // Build extracted data using local parsers
        const personal = extractPersonalInfo(text)
        const experience = extractExperience(text)
        const education = extractEducation(text)
        const skills = extractSkills(text)
        const certifications = extractCertificates(text)

        extractedData = {
          personalInfo: {
            name: personal.name || '',
            email: personal.email || '',
            phone: personal.phone || '',
            location: personal.location || '',
            linkedin: personal.linkedin || '',
            github: personal.github || ''
          },
          professionalSummary: '',
          experience,
          education,
          skills,
          certificates: certifications,
          projects: [],
          awards: [],
          languages: []
        }
      }

      // Clean up temporary file
      await fs.unlink(filePath)

      return NextResponse.json({
        success: true,
        data: extractedData,
        message: 'Resume processed successfully'
      })

    } catch (extractionError) {
      // Clean up temporary file on error
      try {
        await fs.unlink(filePath)
      } catch {}

      console.error('Resume extraction error:', extractionError)
      return NextResponse.json(
        { error: 'Failed to extract data from resume' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
