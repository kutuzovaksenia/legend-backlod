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
  const dots = {
    'Бэклог':       '#B0B0B0',
    'В работе':     '#0070F3',
    'В разработке': '#7C3AED',
    'Ревью':        '#E6A800',
    'Готово':       '#00A651',
  }
  const dot = dots[value] || dots['Бэклог']
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
      {value}
    </span>
  )
}

export function GoalBadge({ value }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs text-gray-500 bg-gray-100">
      {value}
    </span>
  )
}

export function ComplexityBadge({ value }) {
  const icons = { 'Быстро': '⚡', 'Средне': '◑', 'Сложно': '◆' }
  if (!value) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span>{icons[value]}</span>
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
