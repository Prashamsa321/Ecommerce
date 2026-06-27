export const PROTECTED_ADMIN_EMAIL = 'prashamsalamsal2061@gmail.com'

export const isProtectedAdmin = (email) =>
  email?.toLowerCase().trim() === PROTECTED_ADMIN_EMAIL.toLowerCase()
