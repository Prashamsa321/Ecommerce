import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"MeroGadget" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - MeroGadget Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">Welcome to MeroGadget!</h2>
            <div style="width: 60px; height: 60px; background-color: #1a1a2e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="font-size: 30px;">🛒</span>
            </div>
            <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 20px 0;">Thank you for registering with MeroGadget! Please use the following OTP to verify your email address:</p>
            <div style="background-color: #1a1a2e; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #ffffff; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #777; font-size: 14px;">This OTP is valid for <strong>1 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>© 2024 MeroGadget. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send password reset OTP email
export const sendPasswordResetOTP = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"MeroGadget" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - MeroGadget',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">Password Reset Request</h2>
            <div style="width: 60px; height: 60px; background-color: #FF6200; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="font-size: 30px;">🔒</span>
            </div>
            <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 20px 0;">We received a request to reset your password. Use the following OTP to proceed:</p>
            <div style="background-color: #FF6200; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #ffffff; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #777; font-size: 14px;">This OTP is valid for <strong>1 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>© 2024 MeroGadget. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Password reset email error:', error);
    return false;
  }
};

// Send admin notification for new contact message
export const sendAdminContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const { name, email, subject, message } = contactData;
    
    const mailOptions = {
      from: `"MeroGadget Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
      subject: `📩 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #FF6200; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 30px;">✉️</span>
              </div>
              <h2 style="color: #1a1a2e; margin-bottom: 5px;">New Contact Form Submission</h2>
              <p style="color: #777; font-size: 14px;">A new message has been received from the contact form</p>
            </div>
            
            <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; margin-top: 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; width: 100px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${email}" style="color: #FF6200; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 8px 0; color: #333; background-color: #f8f8f8; padding: 12px; border-radius: 6px;">
                    ${message.replace(/\n/g, '<br>')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
         
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              This is an automated notification from MeroGadget.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Admin notification email error:', error);
    return false;
  }
};

// Send confirmation email to user
export const sendUserContactConfirmation = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const { name, email, subject, message } = contactData;
    
    const mailOptions = {
      from: `"MeroGadget Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We've Received Your Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: #22D3EE; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 30px;">✅</span>
              </div>
              <h2 style="color: #1a1a2e; margin-bottom: 5px;">Thank You for Contacting Us!</h2>
              <p style="color: #777; font-size: 14px;">We have received your message and will get back to you soon.</p>
            </div>
            
            <div style="background-color: #f8f8f8; padding: 16px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #555; font-size: 13px; margin: 0;"><strong>Your Message:</strong></p>
              <p style="color: #777; font-size: 13px; margin: 5px 0 0 0;">${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
            </div>
            
            <p style="color: #333; font-size: 14px; margin: 20px 0;">
              Our team will review your inquiry and respond within <strong>24-48 hours</strong>.
            </p>
            
            <p style="color: #666; font-size: 13px;">
              If you need immediate assistance, please call us at <strong style="color: #FF6200;">+977 9800000000</strong>
            </p>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center;">
              <p style="color: #999; font-size: 12px;">
                © 2024 MeroGadget. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('User confirmation email error:', error);
    return false;
  }
};