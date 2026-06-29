const PENDING_ORDER_KEY = 'merogadget_pending_order'

export const savePendingOrder = (payload) => {
  localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(payload))
}

export const getPendingOrder = () => {
  try {
    const raw = localStorage.getItem(PENDING_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const clearPendingOrder = () => {
  localStorage.removeItem(PENDING_ORDER_KEY)
}
