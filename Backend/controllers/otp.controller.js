import OTP from '../models/OTP.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../services/emailService.js';

const isDev = process.env.NODE_ENV !== 'production';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastLogin: user.lastLogin || null,
});

const buildOtpResponse = (message, email, otp, emailResult) => ({
  success: true,
  message,
  email,
  emailSent: Boolean(emailResult?.sent),
  ...(isDev && !emailResult?.sent ? { devOTP: otp } : {}),
  ...(emailResult?.previewUrl ? { emailPreviewUrl: emailResult.previewUrl } : {}),
  ...(emailResult?.usedDevFallback ? { usedDevFallback: true } : {}),
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendRegistrationOTP = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      userData: {
        name,
        email,
        password: hashedPassword,
      },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const emailResult = await sendOTPEmail(email, otp, name);

    if (!emailResult.sent && !isDev && !emailResult.previewUrl) {
      await OTP.deleteMany({ email });
      return res.status(503).json({
        success: false,
        message: 'Could not send verification email. Please check email settings and try again.',
      });
    }

    res.status(200).json(
      buildOtpResponse(
        emailResult.sent
          ? `Verification code sent to ${email}`
          : emailResult.previewUrl
            ? 'Email preview ready — open the link below to view your verification code'
            : isDev
              ? 'Verification code generated — check your email or use the code shown on screen'
              : 'Could not send email. Check server email settings and try again.',
        email,
        otp,
        emailResult
      )
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification code',
      error: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required',
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const { name, password } = otpRecord.userData;

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      lastLogin: new Date(),
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying code',
      error: error.message,
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No registration found for this email. Please start again.',
      });
    }

    const newOTP = generateOTP();
    otpRecord.otp = newOTP;
    otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await otpRecord.save();

    const emailResult = await sendOTPEmail(email, newOTP, otpRecord.userData.name);

    if (!emailResult.sent && !isDev && !emailResult.previewUrl) {
      return res.status(503).json({
        success: false,
        message: 'Could not resend verification email. Please try again later.',
      });
    }

    res.status(200).json(
      buildOtpResponse(
        emailResult.sent
          ? `New verification code sent to ${email}`
          : emailResult.previewUrl
            ? 'Email preview ready — open the link below to view your verification code'
            : isDev
              ? 'New verification code generated'
              : 'Could not send email. Check server email settings and try again.',
        email,
        newOTP,
        emailResult
      )
    );
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification code',
      error: error.message,
    });
  }
};
