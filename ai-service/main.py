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
    
    # Extract phone number
    phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    if phones:
        personal_info["phone"] = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]
    
    # Extract name (first few words before email or phone)
    lines = text.split('\n')
    for i, line in enumerate(lines[:5]):  # Check first 5 lines
        line = line.strip()
        if line and not any(keyword in line.lower() for keyword in ['resume', 'cv', 'curriculum']):
            if len(line.split()) <= 4 and not re.search(r'[@\d]', line):
                personal_info["name"] = line
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
    
    # Look for experience section
    experience_section = re.search(r'(experience|work history|employment)(.*?)(?=education|skills|projects|$)', 
                                 text, re.IGNORECASE | re.DOTALL)
    
    if experience_section:
        exp_text = experience_section.group(2)
        
        # Split by common delimiters
        entries = re.split(r'\n\s*\n|\n(?=[A-Z][a-z]+ \d{4})', exp_text)
        
        for entry in entries:
            entry = entry.strip()
            if len(entry) > 50:  # Filter out short entries
                exp_dict = {}
                
                # Extract company and position
                lines = entry.split('\n')
                for line in lines[:3]:  # Check first 3 lines
                    if any(keyword in line.lower() for keyword in ['software', 'engineer', 'developer', 'manager', 'analyst']):
                        exp_dict["position"] = line.strip()
                    elif not exp_dict.get("company") and len(line.split()) <= 5:
                        exp_dict["company"] = line.strip()
                
                # Extract duration
                date_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|present|current)'
                dates = re.findall(date_pattern, entry, re.IGNORECASE)
                if dates:
                    start_year, end_year = dates[0]
                    exp_dict["duration"] = f"{start_year} - {end_year}"
                
                # Extract description
                exp_dict["description"] = entry[:200] + "..." if len(entry) > 200 else entry
                
                if exp_dict:
                    experience.append(exp_dict)
    
    return experience

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
    
    # Look for certificates section
    cert_section = re.search(r'(certificate|certification|credential)(.*?)(?=experience|education|skills|$)', 
                           text, re.IGNORECASE | re.DOTALL)
    
    if cert_section:
        cert_text = cert_section.group(2)
        
        # Common certification patterns
        cert_patterns = [
            r'(aws|azure|google cloud|gcp)\s+(certified|associate|professional)',
            r'(cisco|microsoft|oracle|ibm)\s+certified',
            r'(pmp|scrum master|agile|six sigma)',
            r'certified\s+(.+?)(?=\n|$)'
        ]
        
        for pattern in cert_patterns:
            matches = re.finditer(pattern, cert_text, re.IGNORECASE)
            for match in matches:
                cert_dict = {
                    "name": match.group(0).strip(),
                    "issuer": "Unknown",
                    "date": "Unknown"
                }
                
                # Try to extract issuer and date from context
                context_start = max(0, match.start() - 50)
                context_end = min(len(cert_text), match.end() + 50)
                context = cert_text[context_start:context_end]
                
                # Extract year
                year_pattern = r'20\d{2}'
                years = re.findall(year_pattern, context)
                if years:
                    cert_dict["date"] = years[0]
                
                certificates.append(cert_dict)
    
    return certificates

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
