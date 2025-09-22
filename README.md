# ResuChain - AI Resume Verifier

ResuChain is a comprehensive AI-powered resume verification system built for the Government of India. It provides secure, blockchain-backed verification of resumes, skills assessment, and experience validation.

## 🚀 Features

### Core Features
- **AI-Powered Resume Parsing** - Automatically extract information from PDF/DOCX resumes
- **Skills Assessment** - Interactive skill testing with real-time scoring
- **Experience Verification** - Document-based verification of work experience
- **Certificate Validation** - Verify educational and professional certificates
- **Interactive Dashboard** - Real-time progress tracking and analytics
- **Government Portal Design** - Authentic MCA-style government interface

### Technical Features
- **JWT Authentication** - Secure user authentication and authorization
- **File Upload & Processing** - Support for PDF and DOCX resume formats
- **Real-time Notifications** - Toast notifications for user feedback
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **API Integration** - RESTful APIs with Spring Boot backend
- **Database Integration** - MySQL database with JPA/Hibernate

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  AI Service     │
│   (Next.js)     │◄──►│  (Spring Boot)  │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │     MySQL       │
                       │   Database      │
                       │   Port: 3306    │
                       └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Java** (JDK 17 or higher)
- **Python** (3.8 or higher)
- **MySQL** (8.0 or higher)
- **Maven** (3.6 or higher)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd splitwise
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE resuchain_db;

-- Create user (optional)
CREATE USER 'resuchain'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON resuchain_db.* TO 'resuchain'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup (Spring Boot)
```bash
cd backend

# Install dependencies
mvn clean install

# Update application.yml with your database credentials
# src/main/resources/application.yml

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. AI Service Setup (FastAPI)
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run the service
python main.py
```

The AI service will start on `http://localhost:8001`

### 5. Frontend Setup (Next.js)
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (.env or application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/resuchain_db
    username: root
    password: your_password

jwt:
  secret: your_jwt_secret_key
  expiration: 86400000

ai:
  service:
    url: http://localhost:8001

file:
  upload:
    dir: ./uploads
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
```

## 📱 Usage

### For Students/Individuals

1. **Register Account**
   - Visit `http://localhost:3000/register`
   - Choose "Student/Individual" account type
   - Complete the 3-step registration process

2. **Upload Resume**
   - Login to your dashboard
   - Navigate to "Upload Resume" tab
   - Drag & drop or select your PDF/DOCX resume
   - Wait for AI processing to complete

3. **Verify Information**
   - Review auto-extracted personal information
   - Upload supporting documents for work experience
   - Verify certificates with certificate IDs

4. **Take Skills Assessment**
   - Navigate to "Skills" tab
   - Click "Take Assessment" for each skill
   - Complete timed assessments with multiple choice and coding questions

### For Organizations

1. **Register Organization Account**
   - Choose "Organization" account type during registration
   - Provide organization details

2. **Post Job Requirements**
   - Create job postings with required skills
   - Set minimum experience requirements

3. **View Matching Candidates**
   - See candidates that match your requirements
   - Download verified resumes
   - View skill assessment scores

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt password hashing
- **File Validation** - Secure file upload with type checking
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - JPA/Hibernate ORM protection

## 🎨 UI/UX Features

- **Government Portal Design** - Authentic MCA-style interface
- **Responsive Design** - Works on all device sizes
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Progress Tracking** - Visual progress indicators
- **Floating Animations** - Engaging UI animations

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/validate-token` - Token validation

### Resume Management
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/list` - Get user resumes
- `GET /api/resume/{id}` - Get specific resume
- `PUT /api/resume/{id}/progress` - Update verification progress
- `DELETE /api/resume/{id}` - Delete resume

### AI Service
- `POST /parse-resume-file` - Parse resume from file
- `POST /parse-resume-text` - Parse resume from text
- `POST /match-skills` - Calculate skill matching
- `GET /skills-database` - Get available skills

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
npm test
```

### AI Service Testing
```bash
cd ai-service
pytest
```

## 📈 Performance Optimization

- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Next.js automatic image optimization
- **Database Indexing** - Optimized database queries
- **Caching** - Redis caching for frequently accessed data
- **CDN Integration** - Static asset delivery optimization

## 🚀 Deployment

### Production Build

#### Frontend
```bash
npm run build
npm start
```

#### Backend
```bash
mvn clean package
java -jar target/resuchain-backend-0.0.1-SNAPSHOT.jar
```

#### AI Service
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@resuchain.gov.in
- Documentation: [docs.resuchain.gov.in](https://docs.resuchain.gov.in)
- Issues: [GitHub Issues](https://github.com/resuchain/issues)

## 🙏 Acknowledgments

- Government of India for the project requirements
- MCA Portal for design inspiration
- Open source community for the amazing tools and libraries

---

**ResuChain** - Empowering Careers, Protecting Integrity 🛡️
