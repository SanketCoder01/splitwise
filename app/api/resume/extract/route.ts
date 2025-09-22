import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Mock resume extraction function - In production, you'd use actual PDF/DOCX parsing libraries
async function extractResumeData(filePath: string, fileName: string): Promise<any> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock extracted data based on common resume patterns
  // In production, you'd use libraries like pdf-parse, mammoth, or AI services
  const mockExtractedData = {
    personalInfo: {
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 9876543210",
      location: "Mumbai, Maharashtra, India",
      linkedin: "linkedin.com/in/rahulsharma",
      github: "github.com/rahulsharma"
    },
    professionalSummary: "Experienced Software Developer with 3+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams.",
    experience: [
      {
        id: uuidv4(),
        company: "Tech Solutions Pvt Ltd",
        position: "Senior Software Developer",
        location: "Mumbai, India",
        startDate: "2022-01",
        endDate: "Present",
        current: true,
        description: "• Led development of 3 major web applications using React and Node.js\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews\n• Collaborated with cross-functional teams to deliver projects on time"
      },
      {
        id: uuidv4(),
        company: "StartupXYZ",
        position: "Full Stack Developer",
        location: "Pune, India",
        startDate: "2021-06",
        endDate: "2021-12",
        current: false,
        description: "• Developed responsive web applications using React and Express.js\n• Integrated third-party APIs and payment gateways\n• Optimized database queries improving performance by 40%\n• Participated in agile development processes"
      }
    ],
    education: [
      {
        id: uuidv4(),
        institution: "Indian Institute of Technology, Mumbai",
        degree: "Bachelor of Technology",
        field: "Computer Science and Engineering",
        startDate: "2017-07",
        endDate: "2021-05",
        grade: "8.5 CGPA",
        location: "Mumbai, India"
      }
    ],
    skills: {
      technical: [
        "JavaScript", "TypeScript", "React", "Node.js", "Express.js", 
        "MongoDB", "PostgreSQL", "AWS", "Docker", "Git", "Python", "Java"
      ],
      soft: [
        "Leadership", "Team Management", "Problem Solving", 
        "Communication", "Project Management", "Agile Methodologies"
      ]
    },
    certifications: [
      {
        id: uuidv4(),
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023-03",
        expiryDate: "2026-03",
        credentialId: "AWS-SA-2023-001234"
      },
      {
        id: uuidv4(),
        name: "React Developer Certification",
        issuer: "Meta",
        issueDate: "2022-08",
        expiryDate: null,
        credentialId: "META-REACT-2022-5678"
      }
    ],
    projects: [
      {
        id: uuidv4(),
        name: "E-commerce Platform",
        description: "Full-stack e-commerce application with React frontend and Node.js backend",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
        startDate: "2023-01",
        endDate: "2023-06",
        url: "https://github.com/rahulsharma/ecommerce-platform",
        highlights: [
          "Implemented secure payment processing",
          "Built responsive design for mobile and desktop",
          "Integrated inventory management system"
        ]
      },
      {
        id: uuidv4(),
        name: "Task Management App",
        description: "Collaborative task management application with real-time updates",
        technologies: ["React", "Socket.io", "Express.js", "PostgreSQL"],
        startDate: "2022-09",
        endDate: "2022-12",
        url: "https://github.com/rahulsharma/task-manager",
        highlights: [
          "Real-time collaboration features",
          "Role-based access control",
          "Advanced filtering and search"
        ]
      }
    ],
    awards: [
      {
        id: uuidv4(),
        title: "Best Innovation Award",
        issuer: "Tech Solutions Pvt Ltd",
        date: "2023-12",
        description: "Recognized for developing an innovative solution that improved system efficiency by 45%"
      },
      {
        id: uuidv4(),
        title: "Hackathon Winner",
        issuer: "Mumbai Tech Fest 2022",
        date: "2022-10",
        description: "First place in 48-hour hackathon for developing a sustainable tech solution"
      }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Hindi", proficiency: "Native" },
      { name: "Marathi", proficiency: "Fluent" }
    ]
  }

  return mockExtractedData
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
      // Extract data from resume
      const extractedData = await extractResumeData(filePath, file.name)

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
