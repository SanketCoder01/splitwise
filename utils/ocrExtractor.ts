// Real OCR and Data Extraction Utilities
// This uses browser-based OCR and text parsing for real resume data extraction

interface ExtractedData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    address: string
  }
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    grade?: string
  }>
  skills: string[]
  certificates: Array<{
    name: string
    issuer: string
    year?: string
  }>
  socialProfiles: {
    linkedin: string
    github: string
  }
}

// Convert PDF to text using PDF.js (browser-based)
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // NOTE: Real extraction is handled server-side via /api/resume/extract
        // This function is retained for compatibility but no longer used for PDFs
        resolve('')
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

// Extract text from images using Canvas and OCR simulation
export async function extractTextFromImage(file: File): Promise<string> {
  // Use Tesseract.js for client-side OCR on images
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker()
  try {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(file)
    })
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const { data } = await worker.recognize(dataUrl)
    await worker.terminate()
    return data.text || ''
  } catch (err) {
    try { await worker.terminate() } catch {}
    throw err
  }
}

// Map server response to local ExtractedData shape
function mapServerToExtractedData(data: any): ExtractedData {
  return {
    personalInfo: {
      name: data.personalInfo?.name || '',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || '',
      location: data.personalInfo?.location || '',
      address: ''
    },
    experience: (data.experience || []).map((exp: any) => ({
      title: exp.position || exp.title || '',
      company: exp.company || '',
      duration: exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.duration || ''),
      description: exp.description || ''
    })),
    education: (data.education || []).map((edu: any) => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.endDate || edu.year || '',
      grade: edu.grade || ''
    })),
    skills: Array.isArray(data.skills?.technical)
      ? data.skills.technical
      : Array.isArray(data.skills)
        ? data.skills.map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean)
        : [],
    certificates: (data.certifications || data.certificates || []).map((cert: any) => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      year: cert.issueDate || cert.date || ''
    })),
    socialProfiles: {
      linkedin: data.personalInfo?.linkedin || '',
      github: data.personalInfo?.github || ''
    }
  }
}

// Parse extracted text into structured data
export function parseResumeText(text: string): ExtractedData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const result: ExtractedData = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      address: ''
    },
    experience: [],
    education: [],
    skills: [],
    certificates: [],
    socialProfiles: {
      linkedin: '',
      github: ''
    }
  }
  
  // Extract personal information
  result.personalInfo = extractPersonalInfo(text)
  
  // Extract work experience
  result.experience = extractWorkExperience(text)
  
  // Extract education
  result.education = extractEducation(text)
  
  // Extract skills
  result.skills = extractSkills(text)
  
  // Extract certificates
  result.certificates = extractCertificates(text)
  
  // Extract social profiles
  result.socialProfiles = extractSocialProfiles(text)
  
  return result
}

function extractPersonalInfo(text: string): ExtractedData['personalInfo'] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const phoneRegex = /[\+]?[0-9]{10,15}/g
  const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+/m
  
  const email = text.match(emailRegex)?.[0] || ''
  const phone = text.match(phoneRegex)?.[0] || ''
  const name = text.match(nameRegex)?.[0] || ''
  
  // Extract location and address
  const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)/g)
  const location = locationMatch?.[0] || ''
  
  const addressMatch = text.match(/\d+\s+[A-Za-z\s,]+\d{6}/g)
  const address = addressMatch?.[0] || ''
  
  return { name, email, phone, location, address }
}

function extractWorkExperience(text: string): ExtractedData['experience'] {
  const experience: ExtractedData['experience'] = []
  
  // Look for job titles and companies
  const jobPattern = /([A-Z][a-z\s]+)\n([A-Z][a-z\s]+(?:Pvt Ltd|Inc|Corp|Company|Solutions))\n([A-Za-z]+\s+\d{4}\s*-\s*(?:Present|[A-Za-z]+\s+\d{4}))/g
  
  let match
  while ((match = jobPattern.exec(text)) !== null) {
    experience.push({
      title: match[1].trim(),
      company: match[2].trim(),
      duration: match[3].trim(),
      description: 'Extracted from resume'
    })
  }
  
  return experience
}

function extractEducation(text: string): ExtractedData['education'] {
  const education: ExtractedData['education'] = []
  
  // Look for degree patterns
  const degreePattern = /(Bachelor|Master|B\.Tech|M\.Tech|BCA|MCA|MBA)[^\n]*\n([A-Z][a-z\s]+University|Institute|College)[^\n]*\n(\d{4})/g
  
  let match
  while ((match = degreePattern.exec(text)) !== null) {
    education.push({
      degree: match[1],
      institution: match[2].trim(),
      year: match[3],
      grade: extractGrade(text, match.index)
    })
  }
  
  return education
}

function extractGrade(text: string, startIndex: number): string {
  const gradePattern = /(CGPA|GPA):\s*(\d+\.?\d*)/g
  const match = gradePattern.exec(text.substring(startIndex, startIndex + 200))
  return match ? `${match[1]}: ${match[2]}` : ''
}

function extractSkills(text: string): string[] {
  const skillsSection = text.match(/SKILLS[^\n]*\n([^\n]+)/i)
  if (!skillsSection) return []
  
  const skillsText = skillsSection[1]
  return skillsText.split(/[,\s]+/).filter(skill => skill.length > 2)
}

function extractCertificates(text: string): ExtractedData['certificates'] {
  const certificates: ExtractedData['certificates'] = []
  
  // Look for certificate patterns
  const certPattern = /([A-Z][a-z\s]+(?:Certificate|Certified|Certification))[^\n]*\n([A-Z][a-z\s]+(?:Amazon|Google|Microsoft|Meta|IBM))[^\n]*\n(?:Certificate ID: ([A-Z0-9-]+))?/g
  
  let match
  while ((match = certPattern.exec(text)) !== null) {
    certificates.push({
      name: match[1].trim(),
      issuer: match[2].trim(),
      year: new Date().getFullYear().toString()
    })
  }
  
  return certificates
}

function extractSocialProfiles(text: string): ExtractedData['socialProfiles'] {
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i)
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i)
  
  return {
    linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
    github: githubMatch ? `https://github.com/${githubMatch[1]}` : ''
  }
}

// Main extraction function
export async function extractResumeData(file: File): Promise<ExtractedData> {
  // Prefer server-side extraction via existing API route for PDFs/DOCX
  if (
    file.type === 'application/pdf' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await fetch('/api/resume/extract', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to extract resume data')
    }

    const payload = await response.json()
    return mapServerToExtractedData(payload.data)
  }

  // Basic fallback: attempt local parse only if text can be derived (currently returns empty)
  if (file.type.startsWith('image/')) {
    const text = await extractTextFromImage(file)
    return parseResumeText(text)
  }

  throw new Error('Unsupported file type')
}
