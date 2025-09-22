# Email Templates for PM Internship & Resume Verifier

## 1. Email Confirmation Template

**Subject:** Verify Your Email - PM Internship & Resume Verifier

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - PM Internship Portal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b35, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .logo { width: 60px; height: 60px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India" class="logo">
            <h1>PM Internship & Resume Verifier</h1>
            <p>Government of India | Ministry of Corporate Affairs</p>
        </div>
        
        <div class="content">
            <h2>🎉 Welcome to PM Internship Portal!</h2>
            
            <p>Dear Student,</p>
            
            <p>Thank you for registering with <strong>PM Internship & Resume Verifier</strong> - India's premier government internship platform.</p>
            
            <p>To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">✅ Verify My Email</a>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>✅ Complete your student profile</li>
                <li>🔐 Verify your documents</li>
                <li>🎯 Apply for government internships</li>
                <li>📄 Build verified resumes</li>
                <li>🏆 Access skill assessments</li>
            </ul>
            
            <p><strong>Security Note:</strong> This link will expire in 24 hours for your security.</p>
            
            <p>If you didn't create this account, please ignore this email.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p><strong>Need Help?</strong></p>
            <p>📧 Email: support@pminternship.gov.in<br>
            📞 Helpline: 1800-XXX-XXXX (Toll Free)<br>
            🌐 Website: {{ .SiteURL }}</p>
        </div>
        
        <div class="footer">
            <p>🇮🇳 <strong>विकसित भारत @2047</strong></p>
            <p>PM Internship & Resume Verifier<br>
            Ministry of Corporate Affairs, Government of India</p>
            <p>This is an automated email. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

## 2. Magic Link Template

**Subject:** Your Secure Login Link - PM Internship Portal

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Login - PM Internship Portal</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b35, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .logo { width: 60px; height: 60px; margin-bottom: 15px; }
        .security-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India" class="logo">
            <h1>PM Internship & Resume Verifier</h1>
            <p>Secure Login Request</p>
        </div>
        
        <div class="content">
            <h2>🔐 Your Secure Login Link</h2>
            
            <p>Hello,</p>
            
            <p>You requested to sign in to your <strong>PM Internship Portal</strong> account. Click the button below to securely log in:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">🚀 Sign In Securely</a>
            </div>
            
            <div class="security-box">
                <h4>🛡️ Security Information:</h4>
                <ul>
                    <li>This link expires in 1 hour</li>
                    <li>Can only be used once</li>
                    <li>Only works from the device that requested it</li>
                </ul>
            </div>
            
            <p><strong>Didn't request this?</strong> If you didn't try to sign in, you can safely ignore this email. Your account remains secure.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p><strong>Need Help?</strong></p>
            <p>📧 Email: support@pminternship.gov.in<br>
            📞 Helpline: 1800-XXX-XXXX (Toll Free)</p>
        </div>
        
        <div class="footer">
            <p>🇮🇳 <strong>विकसित भारत @2047</strong></p>
            <p>PM Internship & Resume Verifier<br>
            Ministry of Corporate Affairs, Government of India</p>
        </div>
    </div>
</body>
</html>
```

## How to Set Up in Supabase:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Select "Confirm signup" template
3. Replace the subject and body with the above content
4. Do the same for "Magic Link" template
5. Save the templates

---

## Variables Available in Supabase Email Templates:
- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Verification/login link
- `{{ .SiteURL }}` - Your site URL
- `{{ .RedirectTo }}` - Redirect URL after confirmation
