import { useState, useRef, useEffect } from 'react'
import { PriorityBadge, StatusBadge } from './Badge'
import { PRIORITIES, STATUSES } from '../constants'

export function InlineSelect({ type, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options = type === 'priority' ? PRIORITIES : STATUSES

  return (
    <div className="relative inline-block" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="cursor-pointer hover:opacity-80 transition-opacity">
        {type === 'priority' ? <PriorityBadge value={value} /> : <StatusBadge value={value} />}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[130px]">
          {options.map(opt => (
            <button key={opt} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center"
              onClick={() => { onChange(opt); setOpen(false) }}>
              {type === 'priority' ? <PriorityBadge value={opt} /> : <StatusBadge value={opt} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
