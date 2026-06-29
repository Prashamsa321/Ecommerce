import { useState, useRef, useEffect } from 'react'
import FaIcon from './FaIcon'
import { getCategoryIcon } from '../../utils/categoryIcons'

const CategorySelect = ({ categories, value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = categories.find((category) => category.name === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-surface-primary border border-divider rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:border-transparent cursor-pointer flex items-center justify-between gap-2 text-left disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              <FaIcon icon={getCategoryIcon(selected)} size={16} className="text-brand-orange shrink-0" />
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-text-muted">Select a category</span>
          )}
        </span>
        <FaIcon
          icon="chevron-down"
          size={14}
          className={`text-text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-divider rounded-lg shadow-lg">
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => {
                onChange(category.name)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-brand-light/50 ${
                value === category.name
                  ? 'bg-brand-light text-brand-orange font-medium'
                  : 'text-text-primary'
              }`}
            >
              <FaIcon icon={getCategoryIcon(category)} size={16} className="text-brand-orange shrink-0" />
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategorySelect
