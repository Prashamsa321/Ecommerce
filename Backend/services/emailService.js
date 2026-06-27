import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const isDev = process.env.NODE_ENV !== 'production'

let devTransporterPromise = null

const getCredentials = () => ({
  user: process.env.EMAIL_USER?.trim() || '',
  // Gmail app passwords are often copied with spaces — remove them
  pass: process.env.EMAIL_PASS?.replace(/\s/g, '') || '',
})

export const isEmailConfigured = () => {
  const { user, pass } = getCredentials()
  return Boolean(user && pass)
}

const createPrimaryTransporter = () => {
  if (!isEmailConfigured()) return null

  const { user, pass } = getCredentials()

  if (user.includes('@gmail.com') || user.includes('googlemail.com')) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    })
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })
}

const getDevTransporter = async () => {
  if (!devTransporterPromise) {
    devTransporterPromise = (async () => {
      const account = await nodemailer.createTestAccount()
      console.log('[DEV EMAIL] Ethereal test account ready:', account.user)
      return nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: { user: account.user, pass: account.pass },
      })
    })()
  }
  return devTransporterPromise
}

const logDevOTP = (context, email, otp, name) => {
  if (!isDev) return
  console.log(`\n[DEV OTP - ${context}]`)
  console.log(`  Email: ${email}`)
  console.log(`  Name:  ${name}`)
  console.log(`  OTP:   ${otp}\n`)
}

const sendWithTransporter = async (transporter, mailOptions) => {
  const info = await transporter.sendMail(mailOptions)
  const previewUrl = nodemailer.getTestMessageUrl(info)
  return { messageId: info.messageId, previewUrl: previewUrl || null }
}

export const verifyEmailConfig = async () => {
  if (!isEmailConfigured()) {
    console.warn('[EMAIL] EMAIL_USER / EMAIL_PASS not set — OTP emails will use dev fallback in development.')
    return { ok: false, reason: 'not_configured' }
  }

  const transporter = createPrimaryTransporter()
  if (!transporter) return { ok: false, reason: 'not_configured' }

  try {
    await transporter.verify()
    console.log('[EMAIL] SMTP connection verified for', getCredentials().user)
    return { ok: true }
  } catch (error) {
    console.error('[EMAIL] SMTP verification failed:', error.message)
    if (error.message.includes('BadCredentials') || error.message.includes('535')) {
      console.error(
        '[EMAIL] Fix: use a Gmail App Password (not your normal password).\n' +
        '       1. Enable 2-Step Verification on Google\n' +
        '       2. Create App Password: https://myaccount.google.com/apppasswords\n' +
        '       3. Set EMAIL_PASS in Backend/.env (spaces are OK — they are stripped automatically)'
      )
    }
    return { ok: false, reason: 'auth_failed', error: error.message }
  }
}

const deliverEmail = async ({ to, subject, html, context, otp, name }) => {
  const { user } = getCredentials()
  const mailOptions = {
    from: `"MeroGadget" <${user || 'noreply@merogadget.com'}>`,
    to,
    subject,
    html,
  }

  if (isEmailConfigured()) {
    try {
      const transporter = createPrimaryTransporter()
      const result = await sendWithTransporter(transporter, mailOptions)
      console.log(`[EMAIL] ${context} sent via SMTP:`, result.messageId)
      return { sent: true, previewUrl: null }
    } catch (error) {
      console.error(`[EMAIL] ${context} SMTP error:`, error.message)
      logDevOTP(`${context} (SMTP failed)`, to, otp, name)
    }
  } else {
    logDevOTP(`${context} (not configured)`, to, otp, name)
  }

  if (!isDev) {
    return { sent: false, previewUrl: null }
  }

  try {
    const devTransporter = await getDevTransporter()
    const result = await sendWithTransporter(devTransporter, mailOptions)
    console.log(`[EMAIL] ${context} sent via Ethereal preview:`, result.previewUrl)
    return { sent: false, previewUrl: result.previewUrl, usedDevFallback: true }
  } catch (error) {
    console.error(`[EMAIL] ${context} dev fallback error:`, error.message)
    return { sent: false, previewUrl: null }
  }
}

const registrationHtml = (name, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
      <h2 style="color: #1a1a2e; margin-bottom: 20px;">Welcome to MeroGadget!</h2>
      <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #555; margin: 20px 0;">Use this code to verify your email and complete registration:</p>
      <div style="background-color: #ff6200; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #ffffff; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #777; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
    </div>
  </div>
`

const resetHtml = (name, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
      <h2 style="color: #1a1a2e; margin-bottom: 20px;">Password Reset</h2>
      <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #555; margin: 20px 0;">Use this code to reset your password:</p>
      <div style="background-color: #ff6200; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #ffffff; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      <p style="color: #777; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
    </div>
  </div>
`

export const sendOTPEmail = async (email, otp, name) => {
  const result = await deliverEmail({
    to: email,
    subject: 'Verify Your Email - MeroGadget Registration',
    html: registrationHtml(name, otp),
    context: 'Registration OTP',
    otp,
    name,
  })
  return result
}

export const sendPasswordResetOTP = async (email, otp, name) => {
  const result = await deliverEmail({
    to: email,
    subject: 'Password Reset - MeroGadget',
    html: resetHtml(name, otp),
    context: 'Password reset OTP',
    otp,
    name,
  })
  return result
}
