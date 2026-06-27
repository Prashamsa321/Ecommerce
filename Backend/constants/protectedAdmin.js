export const PROTECTED_ADMIN_EMAIL = (
  process.env.PROTECTED_ADMIN_EMAIL || 'prashamsalamsal2061@gmail.com'
).toLowerCase().trim()

export const isProtectedAdmin = (email) =>
  email?.toLowerCase().trim() === PROTECTED_ADMIN_EMAIL
