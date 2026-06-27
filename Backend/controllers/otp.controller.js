import OTP from '../models/OTP.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { sendOTPEmail } from '../services/emailService.js';

const isDev = process.env.NODE_ENV !== 'production';

const buildOtpResponse = (message, email, otp, emailResult) => ({
  success: true,
  message,
  email,
  emailSent: Boolean(emailResult?.sent),
  ...(isDev ? { devOTP: otp } : {}),
  ...(emailResult?.previewUrl ? { emailPreviewUrl: emailResult.previewUrl } : {}),
  ...(emailResult?.usedDevFallback ? { usedDevFallback: true } : {}),
});

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for registration
export const sendRegistrationOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Received registration request:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP for ${email}: ${otp}`);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP with user data
    await OTP.create({
      email,
      otp,
      userData: {
        name,
        email,
        password: hashedPassword
      },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const emailResult = await sendOTPEmail(email, otp, name);

    res.status(200).json(
      buildOtpResponse(
        emailResult.sent
          ? 'OTP sent successfully to your email'
          : emailResult.previewUrl
            ? 'Email preview ready — open the link below to view your OTP'
            : isDev
              ? 'OTP generated — use the code shown on screen'
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
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verifying OTP:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // OTP is valid, return user data for registration
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      userData: otpRecord.userData
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find existing OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No registration found for this email'
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();
    console.log(`Resending OTP for ${email}: ${newOTP}`);

    // Update OTP
    otpRecord.otp = newOTP;
    otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await otpRecord.save();

    const emailResult = await sendOTPEmail(email, newOTP, otpRecord.userData.name);

    res.status(200).json(
      buildOtpResponse(
        emailResult.sent
          ? 'OTP resent successfully to your email'
          : emailResult.previewUrl
            ? 'Email preview ready — open the link below to view your OTP'
            : isDev
              ? 'New OTP generated — use the code shown on screen'
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
      message: 'Error resending OTP',
      error: error.message
    });
  }
};