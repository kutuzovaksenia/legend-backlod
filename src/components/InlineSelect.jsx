import { useState, useRef, useEffect } from 'react'
import { PriorityBadge, StatusBadge, ComplexityBadge } from './Badge'
import { PRIORITIES, STATUSES, COMPLEXITY } from '../constants'

export function InlineSelect({ type, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options = type === 'priority' ? PRIORITIES : type === 'complexity' ? COMPLEXITY : STATUSES

  const renderBadge = (v) => {
    if (type === 'priority') return <PriorityBadge value={v} />
    if (type === 'complexity') return <ComplexityBadge value={v} />
    return <StatusBadge value={v} />
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="cursor-pointer hover:opacity-80 transition-opacity">
        {value ? renderBadge(value) : <span className="text-xs text-gray-300">—</span>}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px]">
          {options.map(opt => (
            <button key={opt} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center"
              onClick={() => { onChange(opt); setOpen(false) }}>
              {renderBadge(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
