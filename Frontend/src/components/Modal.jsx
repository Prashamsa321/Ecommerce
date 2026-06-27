import React, { useEffect } from 'react'

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const colors = {
    warning: { bg: 'bg-amber-50', border: 'border-status-warning', icon: 'text-status-warning', confirm: 'bg-status-warning hover:bg-amber-600' },
    danger: { bg: 'bg-red-50', border: 'border-status-error', icon: 'text-status-error', confirm: 'bg-status-error hover:bg-red-600' },
    info: { bg: 'bg-brand-light', border: 'border-brand-orange/30', icon: 'text-brand-orange-dark', confirm: 'bg-brand-orange hover:bg-brand-orange-dark' },
  }

  const colorStyle = colors[type] || colors.warning

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="card-premium max-w-md w-full mx-4 shadow-card-hover animate-fade-up">
        <div className={`${colorStyle.bg} rounded-t-3xl p-4 border-b ${colorStyle.border}`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${colorStyle.icon}`}>⚠️</div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-text-secondary">{message}</p>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-divider">
          <button onClick={onClose} className="btn-ghost px-4 py-2">{cancelText}</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-xl transition-colors ${colorStyle.confirm}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
