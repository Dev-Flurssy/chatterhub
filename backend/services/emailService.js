import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Check if we're in dev mode
const isDev = process.env.NODE_ENV === 'development' || process.env.DEV_MODE === 'true';

// Create transporter (lazy initialization)
let transporter = null;

const getTransporter = () => {
  if (isDev) {
    // In dev mode, return mock transporter
    return {
      sendMail: async (mailOptions) => {
        console.log('\n📧 [DEV MODE] Email would be sent:');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Content:', mailOptions.html || mailOptions.text);
        console.log('---\n');
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }

  // Create real transporter only in production
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return transporter;
};

// Generate verification code (6 digits)
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (email, code, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ChatterHub <noreply@chatterhub.com>',
    to: email,
    subject: 'Verify Your Email - ChatterHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f4771;">Welcome to ChatterHub!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please verify your email address using the code below:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #3f4771; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">ChatterHub - Connect & Share</p>
      </div>
    `,
  };

  try {
    const mailer = getTransporter();
    await mailer.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return { devMode: isDev, code: isDev ? code : undefined };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw new Error('Failed to send verification email');
  }
};

// Send phone verification SMS (simulated in dev mode)
const sendPhoneVerification = async (phone, code) => {
  if (isDev) {
    console.log('\n📱 [DEV MODE] SMS would be sent:');
    console.log('To:', phone);
    console.log('Message:', `Your ChatterHub verification code is: ${code}`);
    console.log('---\n');
    return { devMode: true, code };
  }

  // In production, integrate with SMS service like Twilio
  console.log(`SMS verification not configured. Code: ${code} for ${phone}`);
  return { devMode: false };
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ChatterHub <noreply@chatterhub.com>',
    to: email,
    subject: 'Reset Your Password - ChatterHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f4771;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #3f4771 0%, #ff4081 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="background: #f5f5f5; padding: 10px; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">ChatterHub - Connect & Share</p>
      </div>
    `,
  };

  try {
    const mailer = getTransporter();
    await mailer.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return { devMode: isDev, resetUrl: isDev ? resetUrl : undefined };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ChatterHub <noreply@chatterhub.com>',
    to: user.email,
    subject: 'Welcome to ChatterHub! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3f4771;">Welcome to ChatterHub! 🎉</h2>
        <p>Hi ${user.name},</p>
        <p>Your email has been verified successfully! You're all set to start connecting and sharing with the ChatterHub community.</p>
        <div style="background: linear-gradient(135deg, #3f4771 0%, #ff4081 100%); padding: 20px; border-radius: 8px; color: white; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Get Started:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Complete your profile</li>
            <li>Find and follow interesting people</li>
            <li>Share your first post</li>
            <li>Join conversations</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">ChatterHub - Connect & Share</p>
      </div>
    `,
  };

  try {
    const mailer = getTransporter();
    await mailer.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};

export default {
  generateVerificationCode,
  generateToken,
  sendVerificationEmail,
  sendPhoneVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  isDev,
};
