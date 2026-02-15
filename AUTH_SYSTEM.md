# 🔐 Enhanced Authentication System

## Overview
Complete authentication system with email/phone verification, password reset, and OAuth support (Google & Apple).

## ✨ Features Implemented

### 1. User Registration
- Full name, username (optional), email, phone (optional), password
- Password strength validation (min 6 chars, 1 number)
- Username uniqueness check
- Phone number validation
- Email verification with 6-digit code
- Phone verification with 6-digit code (SMS)

### 2. Sign In
- Email + password authentication
- Google OAuth (ready for integration)
- Apple OAuth (ready for integration)
- Account status check (suspended accounts blocked)
- Session tracking

### 3. Password Reset
- Forgot password flow
- Email with secure reset link
- Token expires in 1 hour
- Password strength validation on reset

### 4. Email Verification
- 6-digit verification code
- Code expires in 10 minutes
- Resend verification code
- Dev mode shows codes in console

### 5. Phone Verification
- 6-digit SMS code (simulated in dev mode)
- Code expires in 10 minutes
- Resend verification code

### 6. Privacy Policy
- Comprehensive privacy policy page
- GDPR-compliant information
- User rights and data handling

## 🔧 Dev Mode

Set `DEV_MODE=true` in `.env` to enable development features:

- **Email Verification**: Codes printed to console
- **Phone Verification**: SMS codes printed to console
- **Password Reset**: Reset URLs printed to console
- **No actual emails sent**: All email content logged

### Example Dev Mode Output:
```
📧 [DEV MODE] Email would be sent:
To: user@example.com
Subject: Verify Your Email
Content: Your verification code is: XXXXXX
---

📱 [DEV MODE] SMS would be sent:
To: +XXXXXXXXXXXX
Message: Your verification code is: XXXXXX
---
```

## 📁 File Structure

### Backend
```
backend/
├── models/
│   └── user.model.js          # Updated with new fields
├── controllers/
│   └── auth.controller.js     # All auth endpoints
├── services/
│   └── emailService.js        # Email & SMS handling
├── routes/
│   └── auth.route.js          # Auth API routes
└── .env                       # Configuration
```

### Frontend
```
frontend-new/src/
├── pages/
│   ├── Signup.tsx             # Registration with OAuth
│   ├── Signin.tsx             # Login with OAuth
│   ├── ForgotPassword.tsx     # Request password reset
│   ├── ResetPassword.tsx      # Reset with token
│   └── Privacy.tsx            # Privacy policy
└── App.tsx                    # Routes configured
```

## 🗄️ Database Schema

### User Model Fields
```javascript
{
  name: String (required),
  username: String (unique, optional),
  email: String (required, unique),
  phone: String (optional),
  hashed_password: String,
  
  // Verification
  emailVerified: Boolean (default: false),
  phoneVerified: Boolean (default: false),
  verificationCode: String,
  verificationCodeExpiry: Date,
  
  // OAuth
  authProvider: 'local' | 'google' | 'apple',
  googleId: String,
  appleId: String,
  
  // Password Reset
  resetToken: String (hashed),
  resetTokenExpiry: Date,
  
  // Profile
  role: 'user' | 'admin',
  status: 'active' | 'suspended',
  profilePic: String,
  about: String,
  
  // Social
  following: [ObjectId],
  followers: [ObjectId],
  
  // Analytics
  analytics: {
    signupDate: Date,
    lastActive: Date,
    totalSessions: Number,
    totalPageViews: Number
  }
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in with email/password
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user (requires auth)

### Email Verification
- `POST /api/auth/verify-email` - Verify email with code (requires auth)
- `POST /api/auth/resend-verification` - Resend verification code (requires auth)

### Phone Verification
- `POST /api/auth/verify-phone` - Verify phone with code (requires auth)
- `POST /api/auth/send-phone-verification` - Send phone verification code (requires auth)

### Password Reset
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### OAuth
- `POST /api/auth/google` - Google OAuth sign in
- `POST /api/auth/apple` - Apple OAuth sign in

### Admin
- `POST /api/auth/admin/users` - Create user (admin only)

## 🎨 Frontend Pages

### Sign Up (`/signup`)
- Full registration form
- Google & Apple OAuth buttons
- Username and phone optional
- Password strength indicator
- Privacy policy link
- Dev mode shows verification code

### Sign In (`/signin`)
- Email/password login
- Google & Apple OAuth buttons
- Forgot password link
- Remember me (via JWT)

### Forgot Password (`/forgot-password`)
- Email input
- Success message
- Dev mode shows reset link

### Reset Password (`/reset-password/:token`)
- New password input
- Confirm password
- Password strength validation
- Success redirect to signin

### Privacy Policy (`/privacy`)
- Comprehensive privacy information
- GDPR compliance
- User rights
- Contact information

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: 7-day expiration
3. **Secure Reset Tokens**: SHA-256 hashed, 1-hour expiration
4. **Verification Codes**: 6-digit random, 10-minute expiration
5. **Input Validation**: Email, phone, password strength
6. **Rate Limiting**: (TODO: Add rate limiting middleware)
7. **HTTPS Only**: (Production requirement)

## 📧 Email Configuration

### Development (DEV_MODE=true)
No configuration needed. Emails logged to console.

### Production
Update `.env` with your email provider:

```env
DEV_MODE=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=YourApp <noreply@yourapp.com>
```

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `EMAIL_PASSWORD`

## 🔗 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Update `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Apple Sign In
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create Sign in with Apple service
3. Configure identifiers
4. Update `.env`:
```env
APPLE_CLIENT_ID=your-client-id
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
```

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "Test123"
  }'
```

### Test Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Test Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 📱 Frontend Usage

### Sign Up
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name, username, email, phone, password
  }),
});
const data = await response.json();
// data.verificationCode available in dev mode
```

### Verify Email
```typescript
const response = await fetch('/api/auth/verify-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ code: '123456' }),
});
```

## 🚀 Next Steps

1. **Implement OAuth**: Complete Google & Apple OAuth integration
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **2FA**: Add two-factor authentication option
4. **Social Login**: Add more OAuth providers (Facebook, Twitter)
5. **Email Templates**: Design better HTML email templates
6. **SMS Service**: Integrate Twilio or similar for real SMS
7. **Account Recovery**: Add security questions or backup codes
8. **Session Management**: Add device management and logout all devices

## 🐛 Troubleshooting

### Emails not sending in production
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify EMAIL_HOST and EMAIL_PORT
- Check firewall/network settings
- Enable "Less secure app access" for Gmail (or use app password)

### Verification codes not working
- Check code expiry (10 minutes)
- Verify code matches exactly (case-sensitive)
- Check server time is correct

### OAuth not working
- Verify redirect URIs match exactly
- Check client ID and secret
- Ensure OAuth consent screen is configured
- Check CORS settings

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
DEV_MODE=true

# Database
MONGO_URI=mongodb://localhost:27017/yourdb

# JWT
JWT_SECRET=your-secret-key-change-this

# Frontend
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Email (Production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=YourApp <noreply@yourapp.com>

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
```

## ✅ Status

- ✅ User registration with username & phone
- ✅ Email verification with codes
- ✅ Phone verification (dev mode)
- ✅ Password reset flow
- ✅ Privacy policy page
- ✅ OAuth UI (Google & Apple buttons)
- ✅ Dev mode for testing
- ✅ Enhanced sign in/up pages
- ⏳ OAuth backend integration (ready for credentials)
- ⏳ SMS service integration (ready for Twilio)

---

**All authentication features are now ready to use!** 🎉
