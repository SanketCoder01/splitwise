# PM Internship Portal - Login Credentials

## 🎓 Student Login
**URL**: `/login`

- **Email**: Any valid email format (e.g., `student@example.com`)
- **Password**: Any password (6+ characters)
- **Captcha**: Enter the displayed code
- **Dev Access**: Small "Dev Access" link below contact section for quick bypass

## 🏛️ Government Official Login
**URL**: `/gov-login`

### Valid Credentials:
| Employee ID | Password | Name | Department | Role |
|-------------|----------|------|------------|------|
| `GOV001` | `password123` | Dr. Rajesh Kumar | Ministry of Education | Director |
| `GOV002` | `password123` | Ms. Priya Sharma | Ministry of Education | Joint Secretary |
| `GOV003` | `password123` | Mr. Amit Singh | Ministry of Education | Under Secretary |
| `ADMIN` | `admin123` | System Administrator | IT Department | Admin |

### Login Process:
1. Enter Employee ID (e.g., `GOV001`)
2. Enter Password (e.g., `password123`)
3. Enter Security Code (displayed captcha)
4. Click "Secure Login"
5. Enter any 6-digit OTP (e.g., `123456`)
6. Access Government Dashboard

## 🏢 Recruiter/Organization Login
**URL**: `/recruiter-login`

### Valid Credentials:
| Organization ID | Password | Organization Name | Type | Sector |
|----------------|----------|-------------------|------|--------|
| `ORG001` | `recruiter123` | Tata Consultancy Services | Private Company | IT Services |
| `ORG002` | `recruiter123` | Infosys Limited | Private Company | Technology |
| `ORG003` | `recruiter123` | BHEL | PSU | Engineering |
| `PSU001` | `psu123` | Indian Oil Corporation | PSU | Oil & Gas |
| `STARTUP001` | `startup123` | Digital India Startup | Startup | Technology |

### Login Process:
1. Enter Organization ID (e.g., `ORG001`)
2. Enter Password (e.g., `recruiter123`)
3. Enter Security Code (displayed captcha)
4. Click "Secure Login"
5. Enter any 6-digit OTP (e.g., `123456`)
6. Access Recruiter Dashboard

## 🔧 Development Notes

### Student Login:
- Uses Supabase authentication (if configured)
- Falls back to mock authentication
- "Dev Access" bypass available for quick testing

### Government & Recruiter Login:
- Uses mock authentication with predefined credentials
- No database dependency
- Session storage for user data
- Two-factor authentication simulation

### Common Issues:
1. **Invalid Organization/Employee ID**: Use exact IDs from tables above
2. **Invalid Password**: Use exact passwords from tables above
3. **Captcha Error**: Enter the exact code displayed (case-sensitive)
4. **OTP Error**: Enter any 6-digit number

### Quick Test Flow:
1. **Student**: Use "Dev Access" link for instant access
2. **Government**: Use `GOV001` / `password123`
3. **Recruiter**: Use `ORG001` / `recruiter123`

All logins include proper error messages with hints for valid credentials.
