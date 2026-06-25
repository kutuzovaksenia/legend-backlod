import { GOAL_PALETTE, COMPLEXITY_META } from '../constants'

export function PriorityBadge({ value }) {
  const meta = {
    'Высокий': { num: 1, bg: '#FF385C', text: '#fff' },
    'Средний':  { num: 2, bg: '#FFDB4D', text: '#1A1A1A' },
    'Низкий':   { num: 3, bg: '#E8E8E8', text: '#717171' },
  }
  const m = meta[value] || meta['Низкий']
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0" style={{ background: m.bg, color: m.text }}>
      {m.num}
    </span>
  )
}

export function StatusBadge({ value }) {
  const meta = {
    'Бэклог':   { color: '#B0B0B0', bg: '#F5F5F5' },
    'В работе': { color: '#0070F3', bg: '#EBF4FF' },
    'Готово':   { color: '#00A651', bg: '#E6F9EE' },
  }
  const m = meta[value] || meta['Бэклог']
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: m.bg, color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
      {value}
    </span>
  )
}

export function GoalBadge({ value, goals = [] }) {
  const idx = goals.indexOf(value)
  const c = idx >= 0 ? GOAL_PALETTE[idx % GOAL_PALETTE.length] : '#717171'
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border" style={{ color: c, borderColor: c + '44', background: c + '12' }}>
      {value}
    </span>
  )
}

export function ComplexityBadge({ value }) {
  const m = COMPLEXITY_META[value]
  if (!m) return null
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: m.bg, color: m.color }}>
      <span>{m.icon}</span>
      {value}
    </span>
  )
}

export function AssigneeBadge({ value }) {
  const colors = {
    'Ксюша': '#FF385C', 'Лиза': '#0070F3', 'Оля': '#7C3AED',
    'Диана': '#00A651', 'Вася': '#E6A800', 'Женя': '#059669', 'Руслан': '#DC6F00',
  }
  if (!value) return <span className="text-sm text-gray-400">—</span>
  const c = colors[value] || '#717171'
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: c }}>
        {value[0]}
      </span>
      <span className="text-sm text-gray-800">{value}</span>
    </span>
  )
}
