import React, { useEffect } from 'react'

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-[#22D3EE] to-[#14B8A6]',
      icon: '✓',
      border: 'border-[#22D3EE]/30',
      shadow: 'shadow-cyan-500/20'
    },
    error: {
      bg: 'bg-gradient-to-r from-[#FF3B30] to-[#EF4444]',
      icon: '✗',
      border: 'border-[#FF3B30]/30',
      shadow: 'shadow-red-500/20'
    },
    info: {
      bg: 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]',
      icon: 'ℹ',
      border: 'border-[#22D3EE]/30',
      shadow: 'shadow-blue-500/20'
    },
    warning: {
      bg: 'bg-gradient-to-r from-[#FF6200] to-[#F59E0B]',
      icon: '⚠',
      border: 'border-[#FF6200]/30',
      shadow: 'shadow-orange-500/20'
    }
  }[type] || {
    bg: 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]',
    icon: 'ℹ',
    border: 'border-[#22D3EE]/30',
    shadow: 'shadow-blue-500/20'
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${styles.bg} bg-opacity-95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl ${styles.shadow} border ${styles.border} flex items-center gap-3 min-w-[320px] max-w-md`}>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-sm font-bold">{styles.icon}</span>
        </div>
        <span className="flex-1 font-medium text-white">{message}</span>
        <button 
          onClick={onClose} 
          className="hover:opacity-70 transition-opacity ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast