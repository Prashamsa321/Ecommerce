import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const AdminModalOverlay = ({ open, onClose, children, className = '' }) => {
  useEffect(() => {
    if (!open) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm ${className}`}
      onClick={onClose}
      role="presentation"
    >
      {children}
    </div>,
    document.body
  )
}

export default AdminModalOverlay
