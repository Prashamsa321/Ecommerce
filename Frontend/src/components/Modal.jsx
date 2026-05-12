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
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const colors = {
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      icon: 'text-yellow-600',
      confirm: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      bg: 'bg-red-100',
      border: 'border-red-500',
      icon: 'text-red-600',
      confirm: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      icon: 'text-blue-600',
      confirm: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const colorStyle = colors[type] || colors.warning

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-up">
        <div className={`${colorStyle.bg} rounded-t-lg p-4 border-b ${colorStyle.border}`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${colorStyle.icon}`}>
              {type === 'danger' && '⚠️'}
              {type === 'warning' && '⚠️'}
              {type === 'info' && 'ℹ️'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${colorStyle.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal