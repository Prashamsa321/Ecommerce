// src/utils/helpers.js
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  
  export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  export const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  export const formatSystemTime = (date = new Date()) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })

  export const formatSystemDate = (date = new Date()) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  export const formatRelativeLogin = (dateInput, now = new Date()) => {
    if (!dateInput) return 'just now'

    const date = new Date(dateInput)
    const diffMs = now - date
    if (diffMs < 0) return 'just now'

    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffSec < 60) return 'just now'
    if (diffMin < 60) return `${diffMin}m`
    if (diffHr < 24) return `${diffHr}hr`
    return `${diffDay}d`
  }

  export const formatNpr = (price) =>
    `Rs. ${Number(price || 0).toLocaleString('en-IN')}`