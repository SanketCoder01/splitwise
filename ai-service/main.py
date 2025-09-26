from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import re
import spacy
import PyPDF2
from docx import Document
import io
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ResuChain AI Service",
    description="AI-powered resume parsing and skills matching service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

# Pydantic models
class ResumeParseRequest(BaseModel):
    text: str

class SkillsMatchRequest(BaseModel):
    resume_skills: List[str]
    job_skills: List[str]

class ParsedResume(BaseModel):
    personal_info: Dict[str, Any]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: List[Dict[str, Any]]
    certificates: List[Dict[str, Any]]

class SkillsMatchResponse(BaseModel):
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    skill_scores: Dict[str, float]

# Predefined skills database
SKILLS_DATABASE = {
    "programming": [
        "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby", "go", "rust",
        "swift", "kotlin", "scala", "r", "matlab", "sql", "html", "css", "react", "angular",
        "vue", "node.js", "express", "django", "flask", "spring", "laravel", "rails"
    ],
    "databases": [
        "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "oracle",
        "sqlite", "mariadb", "dynamodb", "firebase", "neo4j"
    ],
    "cloud": [
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible",
        "cloudformation", "helm", "istio", "prometheus", "grafana"
    ],
    "tools": [
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", "trello",
        "postman", "swagger", "figma", "sketch", "photoshop", "illustrator"
    ],
    "soft_skills": [
        "leadership", "communication", "teamwork", "problem solving", "analytical thinking",
        "project management", "time management", "adaptability", "creativity", "critical thinking"
    ]
}

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting PDF text: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error extracting DOCX text: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from DOCX")

def extract_personal_info(text: str) -> Dict[str, Any]:
    """Extract personal information from resume text"""
    personal_info = {}

    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        personal_info["email"] = emails[0]

    # Extract phone number (improved pattern)
    phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,5}'
    phones = re.findall(phone_pattern, text)
    if phones:
        # Clean up phone number
        phone = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]
        phone = re.sub(r'[^\d+\-\s\(\)]', '', phone)  # Remove unwanted characters
        personal_info["phone"] = phone.strip()

    # Extract LinkedIn profile
    linkedin_pattern = r'(?:linkedin\.com/in/|linkedin\.com/profile/view\?id=|linkedin\.com/pub/)([a-zA-Z0-9_-]+)'
    linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
    if linkedin_match:
        personal_info["linkedin"] = f"linkedin.com/in/{linkedin_match.group(1)}"
    else:
        # Look for LinkedIn URL without the specific pattern
        linkedin_url_pattern = r'linkedin\.com/[^\s\n]+'
        linkedin_url_match = re.search(linkedin_url_pattern, text, re.IGNORECASE)
        if linkedin_url_match:
            personal_info["linkedin"] = linkedin_url_match.group(0).strip()

    # Extract GitHub profile
    github_pattern = r'(?:github\.com/)([a-zA-Z0-9_-]+)'
    github_match = re.search(github_pattern, text, re.IGNORECASE)
    if github_match:
        personal_info["github"] = f"github.com/{github_match.group(1)}"
    else:
        # Look for GitHub URL
        github_url_pattern = r'github\.com/[^\s\n]+'
        github_url_match = re.search(github_url_pattern, text, re.IGNORECASE)
        if github_url_match:
            personal_info["github"] = github_url_match.group(0).strip()

    # Extract name (first few words before email or phone)
    lines = text.split('\n')
    for i, line in enumerate(lines[:10]):  # Check first 10 lines
        line = line.strip()
        if line and not any(keyword in line.lower() for keyword in ['resume', 'cv', 'curriculum', 'contact', 'personal']):
            # Skip lines that are clearly not names
            if not re.search(r'[@\d]', line) and len(line.split()) <= 5 and len(line) > 2:
                # Check if it looks like a name (contains letters, possibly with spaces)
                if re.match(r'^[A-Za-z\s\-\.\']+$', line.strip()):
                    personal_info["name"] = line.strip()
                    break

    # Extract location (look for city, state patterns)
    location_pattern = r'([A-Z][a-z]+,\s*[A-Z][a-z]+)|([A-Z][a-z]+\s*,\s*[A-Z]{2})'
    locations = re.findall(location_pattern, text)
    if locations:
        personal_info["location"] = locations[0][0] or locations[0][1]

    return personal_info

def extract_experience(text: str) -> List[Dict[str, Any]]:
    """Extract work experience from resume text"""
    experience = []

    # Look for experience section with multiple patterns
    experience_patterns = [
        r'(experience|work history|employment|professional experience)(.*?)(?=education|skills|projects|certifications|$)',
        r'(work experience|career history)(.*?)(?=education|skills|projects|$)',
        r'(professional background|work background)(.*?)(?=education|skills|$)',
    ]

    exp_text = ""
    for pattern in experience_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            exp_text = match.group(2)
            break

    if not exp_text:
        # Fallback: look for job titles and companies throughout the document
        job_title_pattern = r'(software engineer|developer|manager|analyst|consultant|architect|specialist|lead|senior|junior|intern)'
        if re.search(job_title_pattern, text, re.IGNORECASE):
            exp_text = text

    if exp_text:
        # Split by common delimiters and date patterns
        entries = re.split(r'\n\s*\n|\n(?=\d{1,2}/\d{4}|\d{4}\s*[-–]\s*\d{4}|\d{4}\s*[-–]\s*present|\d{4}\s*[-–]\s*current)', exp_text)

        for entry in entries:
            entry = entry.strip()
            if len(entry) > 30:  # Filter out very short entries
                exp_dict = {}

                # Extract position/title (look for common job titles)
                position_pattern = r'(software engineer|senior developer|full stack developer|frontend developer|backend developer|devops engineer|data scientist|product manager|project manager|team lead|technical lead|engineering manager|software architect|system analyst|business analyst|qa engineer|automation engineer|database administrator|cloud engineer|security engineer)'
                position_match = re.search(position_pattern, entry, re.IGNORECASE)
                if position_match:
                    exp_dict["position"] = position_match.group(0).title()
                else:
                    # Look for capitalized words that might be job titles
                    lines = entry.split('\n')
                    for line in lines[:2]:
                        line = line.strip()
                        if len(line) > 3 and len(line) < 50 and not re.search(r'[@\d]', line):
                            # Check if it looks like a job title
                            words = line.split()
                            if len(words) <= 6 and any(word[0].isupper() for word in words):
                                exp_dict["position"] = line
                                break

                # Extract company (look for company patterns)
                company_pattern = r'(pvt\.?\s*ltd\.?|ltd\.?|inc\.?|corp\.?|corporation|llc|technologies|systems|solutions|software|services|consulting|labs)'
                company_match = re.search(r'(.{2,30}?)\s*(?:' + company_pattern + r'|•|\|)', entry, re.IGNORECASE)
                if company_match:
                    company = company_match.group(1).strip()
                    if len(company) > 2 and len(company) < 30:
                        exp_dict["company"] = company.title()
                else:
                    # Look for company names in parentheses or after "at"
                    company_patterns = [
                        r'at\s+([A-Za-z\s&]+?)(?:\s*\(|\s*\d|\s*$)',
                        r'\(([A-Za-z\s&]+?)\)',
                        r'for\s+([A-Za-z\s&]+?)(?:\s*\(|\s*\d|\s*$)',
                    ]
                    for pattern in company_patterns:
                        match = re.search(pattern, entry, re.IGNORECASE)
                        if match:
                            company = match.group(1).strip()
                            if len(company) > 2 and len(company) < 30:
                                exp_dict["company"] = company.title()
                                break

                # Extract duration with multiple patterns
                duration_patterns = [
                    r'(\d{1,2}/\d{4})\s*[-–]\s*(\d{1,2}/\d{4}|present|current)',
                    r'(\d{4})\s*[-–]\s*(\d{4}|present|current)',
                    r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})\s*[-–]\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present|current)',
                ]

                for pattern in duration_patterns:
                    dates = re.findall(pattern, entry, re.IGNORECASE)
                    if dates:
                        if len(dates[0]) == 2:  # Month/Year format
                            start, end = dates[0]
                            exp_dict["duration"] = f"{start} - {end}"
                        else:  # Year format
                            start, end = dates[0]
                            exp_dict["duration"] = f"{start} - {end}"
                        break

                # Extract description (everything after position and company)
                if exp_dict.get("position") or exp_dict.get("company"):
                    # Remove position and company from description
                    description = entry
                    if exp_dict.get("position"):
                        description = re.sub(re.escape(exp_dict["position"]), '', description, flags=re.IGNORECASE)
                    if exp_dict.get("company"):
                        description = re.sub(re.escape(exp_dict["company"]), '', description, flags=re.IGNORECASE)

                    # Remove duration
                    if exp_dict.get("duration"):
                        description = re.sub(re.escape(exp_dict["duration"]), '', description, flags=re.IGNORECASE)

                    # Clean up description
                    description = re.sub(r'\s+', ' ', description).strip()
                    if description and len(description) > 10:
                        exp_dict["description"] = description[:300] + "..." if len(description) > 300 else description

                # Only add if we have at least position or company
                if exp_dict.get("position") or exp_dict.get("company"):
                    experience.append(exp_dict)

    # Remove duplicates and limit to reasonable number
    unique_experience = []
    seen = set()
    for exp in experience[:10]:  # Limit to 10 experiences
        key = (exp.get("position", ""), exp.get("company", ""))
        if key not in seen:
            unique_experience.append(exp)
            seen.add(key)

    return unique_experience

def extract_education(text: str) -> List[Dict[str, Any]]:
    """Extract education information from resume text"""
    education = []
    
    # Look for education section
    education_section = re.search(r'(education|academic|qualification)(.*?)(?=experience|skills|projects|$)', 
                                text, re.IGNORECASE | re.DOTALL)
    
    if education_section:
        edu_text = education_section.group(2)
        
        # Common degree patterns
        degree_patterns = [
            r'(bachelor|master|phd|doctorate|b\.?tech|m\.?tech|b\.?sc|m\.?sc|mba|bba)',
            r'(b\.?e\.?|m\.?e\.?|b\.?com|m\.?com)'
        ]
        
        for pattern in degree_patterns:
            matches = re.finditer(pattern, edu_text, re.IGNORECASE)
            for match in matches:
                edu_dict = {}
                
                # Get surrounding context
                start = max(0, match.start() - 100)
                end = min(len(edu_text), match.end() + 100)
                context = edu_text[start:end]
                
                edu_dict["degree"] = match.group(0)
                
                # Extract institution
                lines = context.split('\n')
                for line in lines:
                    if any(keyword in line.lower() for keyword in ['university', 'college', 'institute', 'school']):
                        edu_dict["institution"] = line.strip()
                        break
                
                # Extract year
                year_pattern = r'20\d{2}|19\d{2}'
                years = re.findall(year_pattern, context)
                if years:
                    edu_dict["year"] = years[-1]  # Take the latest year
                
                if edu_dict:
                    education.append(edu_dict)
    
    return education

def extract_skills(text: str) -> List[Dict[str, Any]]:
    """Extract skills from resume text"""
    skills = []
    text_lower = text.lower()
    
    # Check each skill category
    for category, skill_list in SKILLS_DATABASE.items():
        for skill in skill_list:
            if skill.lower() in text_lower:
                # Calculate skill level based on context
                skill_context = re.search(rf'.{{0,50}}{re.escape(skill.lower())}.{{0,50}}', text_lower)
                level = 3  # Default level
                
                if skill_context:
                    context = skill_context.group(0)
                    if any(word in context for word in ['expert', 'advanced', 'senior', 'lead']):
                        level = 5
                    elif any(word in context for word in ['intermediate', 'experienced']):
                        level = 4
                    elif any(word in context for word in ['beginner', 'basic', 'junior']):
                        level = 2
                
                skills.append({
                    "name": skill.title(),
                    "category": category.replace('_', ' ').title(),
                    "level": level
                })
    
    # Remove duplicates
    unique_skills = []
    seen_skills = set()
    for skill in skills:
        if skill["name"].lower() not in seen_skills:
            unique_skills.append(skill)
            seen_skills.add(skill["name"].lower())
    
    return unique_skills

def extract_certificates(text: str) -> List[Dict[str, Any]]:
    """Extract certificates from resume text"""
    certificates = []

    # Look for certificates section with multiple patterns
    cert_patterns = [
        r'(certificate|certification|credential|certifications)(.*?)(?=experience|education|skills|projects|$)',
        r'(professional certifications|technical certifications)(.*?)(?=experience|education|$)',
        r'(licenses|qualifications)(.*?)(?=experience|education|skills|$)',
    ]

    cert_text = ""
    for pattern in cert_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            cert_text = match.group(2)
            break

    if not cert_text:
        # Fallback: search entire document for certification keywords
        cert_keywords = ['aws certified', 'microsoft certified', 'google cloud', 'cisco', 'oracle', 'pmp', 'scrum master']
        if any(keyword in text.lower() for keyword in cert_keywords):
            cert_text = text

    if cert_text:
        # Common certification patterns with certificate IDs
        cert_patterns = [
            # AWS certifications
            r'(aws certified (cloud architect|developer|sysops administrator|solutions architect|devops engineer|data analytics|machine learning|security))',
            r'(aws-[a-zA-Z0-9-]+)',

            # Microsoft certifications
            r'(microsoft certified:? (azure|office|windows|sql|visual studio|dynamics))',
            r'(mcsa|mcsd|mcse|mcp|mos)-?[a-zA-Z0-9-]*',

            # Google Cloud certifications
            r'(google cloud (professional cloud architect|professional data engineer|professional cloud developer|associate cloud engineer))',
            r'(gcp-[a-zA-Z0-9-]+)',

            # Cisco certifications
            r'(cisco certified (network associate|network professional|design associate|security professional))',
            r'(ccna|ccnp|ccie|ccda|ccdp)-?[a-zA-Z0-9-]*',

            # Other common certifications
            r'(pmp|scrum master|csm|cspo|safe|itil|cissp|cisa|cism|ceh|comp tia|oracle certified)',
            r'(certified (kubernetes administrator|docker|jenkins|terraform|ansible))',

            # Generic certificate with ID pattern
            r'([A-Z]{2,}-[A-Z0-9-]+|[A-Z]{3,}\d+|[A-Z]{2,}\s*\d{4,})',
        ]

        processed_certs = set()

        for pattern in cert_patterns:
            matches = re.finditer(pattern, cert_text, re.IGNORECASE)
            for match in matches:
                cert_name = match.group(0).strip()

                # Skip if already processed
                if cert_name.lower() in processed_certs:
                    continue
                processed_certs.add(cert_name.lower())

                cert_dict = {
                    "name": cert_name.title(),
                    "issuer": extract_certificate_issuer(cert_name),
                    "certificateId": extract_certificate_id(cert_text, match.start(), match.end()),
                    "date": extract_certificate_date(cert_text, match.start(), match.end())
                }

                certificates.append(cert_dict)

        # Also look for certificate entries in list format
        lines = cert_text.split('\n')
        for line in lines:
            line = line.strip()
            if len(line) > 10 and len(line) < 100:
                # Check if line contains certificate-like keywords
                if any(keyword in line.lower() for keyword in ['certified', 'certificate', 'certification', 'license', 'diploma']):
                    # Skip if already extracted
                    if not any(cert['name'].lower() in line.lower() for cert in certificates):
                        cert_dict = {
                            "name": line,
                            "issuer": extract_certificate_issuer(line),
                            "certificateId": extract_certificate_id_from_line(line),
                            "date": extract_certificate_date_from_line(line)
                        }
                        certificates.append(cert_dict)

    # Remove duplicates and limit
    unique_certificates = []
    seen = set()
    for cert in certificates[:15]:  # Limit to 15 certificates
        key = cert['name'].lower()
        if key not in seen:
            unique_certificates.append(cert)
            seen.add(key)

    return unique_certificates

def extract_certificate_issuer(cert_name: str) -> str:
    """Extract issuer from certificate name"""
    cert_lower = cert_name.lower()

    issuer_map = {
        'aws': 'Amazon Web Services',
        'microsoft': 'Microsoft',
        'google': 'Google',
        'cisco': 'Cisco',
        'oracle': 'Oracle',
        'pmp': 'Project Management Institute',
        'scrum': 'Scrum Alliance',
        'itil': 'AXELOS',
        'cissp': 'ISC²',
        'cisa': 'ISACA',
        'cism': 'ISACA',
        'ceh': 'EC-Council',
        'comp tia': 'CompTIA',
    }

    for keyword, issuer in issuer_map.items():
        if keyword in cert_lower:
            return issuer

    # Try to extract from common patterns
    if 'certified' in cert_lower:
        words = cert_name.split()
        for i, word in enumerate(words):
            if word.lower() == 'certified' and i > 0:
                return words[i-1].title()

    return 'Unknown'

def extract_certificate_id(text: str, start: int, end: int) -> str:
    """Extract certificate ID from context around match"""
    context_start = max(0, start - 100)
    context_end = min(len(text), end + 100)
    context = text[context_start:context_end]

    # Look for ID patterns in context
    id_patterns = [
        r'([A-Z]{2,}-[A-Z0-9-]+)',
        r'([A-Z]{3,}\d+)',
        r'(ID|Certificate|Cert|License):\s*([A-Z0-9-]+)',
        r'#([A-Z0-9-]+)',
    ]

    for pattern in id_patterns:
        matches = re.findall(pattern, context, re.IGNORECASE)
        if matches:
            # Return the first match (clean it up)
            match = matches[0]
            if isinstance(match, tuple):
                return match[-1]  # Take the captured group
            return match

    return ""

def extract_certificate_id_from_line(line: str) -> str:
    """Extract certificate ID from a single line"""
    id_patterns = [
        r'([A-Z]{2,}-[A-Z0-9-]+)',
        r'([A-Z]{3,}\d+)',
        r'#([A-Z0-9-]+)',
        r'(ID|Certificate|Cert):\s*([A-Z0-9-]+)',
    ]

    for pattern in id_patterns:
        match = re.search(pattern, line, re.IGNORECASE)
        if match:
            groups = match.groups()
            return groups[-1] if groups[-1] else groups[0]

    return ""

def extract_certificate_date(text: str, start: int, end: int) -> str:
    """Extract certificate date from context"""
    context_start = max(0, start - 50)
    context_end = min(len(text), end + 50)
    context = text[context_start:context_end]

    # Look for date patterns
    date_patterns = [
        r'20\d{2}',
        r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+20\d{2}',
        r'\d{1,2}/\d{4}',
    ]

    for pattern in date_patterns:
        match = re.search(pattern, context, re.IGNORECASE)
        if match:
            return match.group(0)

    return ""

def extract_certificate_date_from_line(line: str) -> str:
    """Extract certificate date from a single line"""
    date_patterns = [
        r'20\d{2}',
        r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+20\d{2}',
        r'\d{1,2}/\d{4}',
    ]

    for pattern in date_patterns:
        match = re.search(pattern, line, re.IGNORECASE)
        if match:
            return match.group(0)

    return ""

@app.get("/")
async def root():
    return {"message": "ResuChain AI Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/parse-resume-file", response_model=ParsedResume)
async def parse_resume_file(file: UploadFile = File(...)):
    """Parse resume from uploaded file"""
    try:
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(content)
        elif file.filename.lower().endswith(('.docx', '.doc')):
            text = extract_text_from_docx(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Parse resume
        parsed_resume = ParsedResume(
            personal_info=extract_personal_info(text),
            experience=extract_experience(text),
            education=extract_education(text),
            skills=extract_skills(text),
            certificates=extract_certificates(text)
        )
        
        return parsed_resume
        
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

@app.post("/parse-resume-text", response_model=ParsedResume)
async def parse_resume_text(request: ResumeParseRequest):
    """Parse resume from text"""
    try:
        parsed_resume = ParsedResume(
            personal_info=extract_personal_info(request.text),
            experience=extract_experience(request.text),
            education=extract_education(request.text),
            skills=extract_skills(request.text),
            certificates=extract_certificates(request.text)
        )
        
        return parsed_resume
        
    except Exception as e:
        logger.error(f"Error parsing resume text: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

@app.post("/match-skills", response_model=SkillsMatchResponse)
async def match_skills(request: SkillsMatchRequest):
    """Calculate skill match percentage between resume and job requirements"""
    try:
        resume_skills_lower = [skill.lower() for skill in request.resume_skills]
        job_skills_lower = [skill.lower() for skill in request.job_skills]
        
        # Find matched skills
        matched_skills = []
        missing_skills = []
        skill_scores = {}
        
        for job_skill in request.job_skills:
            job_skill_lower = job_skill.lower()
            
            # Exact match
            if job_skill_lower in resume_skills_lower:
                matched_skills.append(job_skill)
                skill_scores[job_skill] = 1.0
            else:
                # Partial match (simple similarity)
                best_match_score = 0
                for resume_skill in request.resume_skills:
                    # Simple similarity based on common words
                    job_words = set(job_skill_lower.split())
                    resume_words = set(resume_skill.lower().split())
                    
                    if job_words and resume_words:
                        similarity = len(job_words.intersection(resume_words)) / len(job_words.union(resume_words))
                        best_match_score = max(best_match_score, similarity)
                
                if best_match_score > 0.5:  # Threshold for partial match
                    matched_skills.append(job_skill)
                    skill_scores[job_skill] = best_match_score
                else:
                    missing_skills.append(job_skill)
                    skill_scores[job_skill] = 0.0
        
        # Calculate overall match percentage
        if request.job_skills:
            match_percentage = (len(matched_skills) / len(request.job_skills)) * 100
        else:
            match_percentage = 0.0
        
        return SkillsMatchResponse(
            match_percentage=round(match_percentage, 2),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            skill_scores=skill_scores
        )
        
    except Exception as e:
        logger.error(f"Error matching skills: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to match skills: {str(e)}")

@app.get("/skills-database")
async def get_skills_database():
    """Get the skills database"""
    return SKILLS_DATABASE

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
