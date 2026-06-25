import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PriorityBadge, GoalBadge, ComplexityBadge, AssigneeBadge } from './Badge'
import { InlineSelect } from './InlineSelect'
import { STATUS_META } from '../constants'

function formatDate(d) {
  if (!d) return null
  const date = new Date(d + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.floor((date - today) / 86400000)
  return { text: date.toLocaleDateString('ru', { day: 'numeric', month: 'short' }), overdue: diff < 0 }
}

function TicketLink({ value }) {
  if (!value) return <span className="text-gray-300 text-sm">—</span>
  const isUrl = value.startsWith('http')
  const label = isUrl ? value.replace(/^https?:\/\/[^/]+\//, '').split('/').pop() || value : value
  return (
    <a href={isUrl ? value : '#'} target={isUrl ? '_blank' : undefined} rel="noreferrer"
      onClick={e => { if (!isUrl) e.preventDefault() }}
      className="text-sm text-blue-500 hover:underline font-medium whitespace-nowrap">
      {label} ↗
    </a>
  )
}

export function TaskRow({ task, onUpdate, onArchive, onEdit, goals }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  const dateInfo = formatDate(task.due_date)
  const taskGoals = task.goals ?? (task.team ? [task.team] : [])
  const statusMeta = STATUS_META[task.status] || STATUS_META['Бэклог']

  return (
    <tr ref={setNodeRef} style={style} className="group border-b border-gray-100 last:border-0 hover:bg-[#FAFAFA] transition-colors">
      {/* Drag */}
      <td className="pl-3 pr-1 py-2.5 w-8">
        <button {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity touch-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="4" cy="3" r="1" fill="currentColor"/><circle cx="8" cy="3" r="1" fill="currentColor"/>
            <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="8" cy="6" r="1" fill="currentColor"/>
            <circle cx="4" cy="9" r="1" fill="currentColor"/><circle cx="8" cy="9" r="1" fill="currentColor"/>
          </svg>
        </button>
      </td>

      {/* Priority */}
      <td className="px-2 py-2.5 w-9">
        <PriorityBadge value={task.priority} />
      </td>

      {/* Title */}
      <td className="px-3 py-2.5 w-64" onClick={() => onEdit(task)}>
        <div className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2">{task.title}</div>
        {task.description && <div className="text-xs text-gray-400 truncate mt-0.5 max-w-[240px]">{task.description}</div>}
      </td>

      {/* Goals */}
      <td className="px-3 py-2.5 w-36">
        <div className="flex flex-wrap gap-1">
          {taskGoals.length > 0
            ? taskGoals.map(g => <GoalBadge key={g} value={g} goals={goals} />)
            : <span className="text-gray-300 text-xs">—</span>}
        </div>
      </td>

      {/* Assignee */}
      <td className="px-3 py-2.5 w-32">
        <AssigneeBadge value={task.assignee} />
      </td>

      {/* Status inline */}
      <td className="px-3 py-2.5 w-36">
        <InlineSelect type="status" value={task.status} onChange={v => onUpdate(task.id, { status: v })} />
      </td>

      {/* Complexity */}
      <td className="px-3 py-2.5 w-24">
        <InlineSelect type="complexity" value={task.complexity} onChange={v => onUpdate(task.id, { complexity: v })} />
      </td>

      {/* Due date */}
      <td className="px-3 py-2.5 w-20">
        {dateInfo
          ? <span className={`text-sm ${dateInfo.overdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{dateInfo.text}</span>
          : <span className="text-gray-300 text-sm">—</span>}
      </td>

      {/* Ticket */}
      <td className="px-3 py-2.5 w-24">
        <TicketLink value={task.ticket_url} />
      </td>

      {/* Archive */}
      <td className="px-2 py-2.5 w-8">
        <button onClick={() => onArchive(task.id)}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1.5 3h10M2.5 3l.6 6.5A1 1 0 004.1 10.5h4.8a1 1 0 001-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 3V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </td>
    </tr>
  )
}
