import { verifyEmailConfig } from './services/emailService.js'

const result = await verifyEmailConfig()

if (result.ok) {
  console.log('Email is configured correctly.')
  process.exit(0)
}

console.error('Email is NOT working:', result.reason || 'unknown')
if (result.error) console.error(result.error)
process.exit(1)
