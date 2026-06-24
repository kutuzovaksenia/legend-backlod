import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PriorityBadge, StatusBadge, TeamBadge, AssigneeBadge } from './Badge'
import { InlineSelect } from './InlineSelect'

function formatDate(d) {
  if (!d) return null
  const date = new Date(d + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.floor((date - today) / 86400000)
  const text = date.toLocaleDateString('ru', { day: 'numeric', month: 'short' })
  return { text, overdue: diff < 0 }
}

function TicketLink({ value }) {
  if (!value) return <span className="text-gray-300 text-sm">—</span>
  const isUrl = value.startsWith('http')
  const label = isUrl ? value.replace(/^https?:\/\//, '').split('/').slice(-1)[0] : value
  return (
    <a href={isUrl ? value : `#`} target={isUrl ? '_blank' : undefined} rel="noreferrer"
      onClick={e => { if (!isUrl) e.preventDefault() }}
      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium whitespace-nowrap">
      {label} ↗
    </a>
  )
}

export function TaskRow({ task, onUpdate, onArchive, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  const dateInfo = formatDate(task.due_date)

  return (
    <tr ref={setNodeRef} style={style} className="group border-b border-gray-100 hover:bg-gray-50/70 transition-colors cursor-default">
      {/* Drag handle */}
      <td className="pl-3 pr-1 py-3 w-8">
        <button {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity touch-none">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5" cy="3.5" r="1.1" fill="currentColor"/><circle cx="9" cy="3.5" r="1.1" fill="currentColor"/>
            <circle cx="5" cy="7" r="1.1" fill="currentColor"/><circle cx="9" cy="7" r="1.1" fill="currentColor"/>
            <circle cx="5" cy="10.5" r="1.1" fill="currentColor"/><circle cx="9" cy="10.5" r="1.1" fill="currentColor"/>
          </svg>
        </button>
      </td>

      {/* Priority */}
      <td className="px-2 py-3 w-10">
        <PriorityBadge value={task.priority} />
      </td>

      {/* Title — click opens edit */}
      <td className="px-3 py-3 min-w-0 max-w-xs" onClick={() => onEdit(task)}>
        <div className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer transition-colors">{task.title}</div>
        {task.description && (
          <div className="text-xs text-gray-400 truncate mt-0.5">{task.description}</div>
        )}
      </td>

      {/* Team */}
      <td className="px-3 py-3 w-32">
        {task.team ? <TeamBadge value={task.team} /> : <span className="text-gray-300">—</span>}
      </td>

      {/* Assignee */}
      <td className="px-3 py-3 w-36">
        <AssigneeBadge value={task.assignee} />
      </td>

      {/* Status */}
      <td className="px-3 py-3 w-36">
        <InlineSelect type="status" value={task.status} onChange={v => onUpdate(task.id, { status: v })} />
      </td>

      {/* Due date */}
      <td className="px-3 py-3 w-24">
        {dateInfo
          ? <span className={`text-sm ${dateInfo.overdue ? 'text-red-500 font-medium' : 'text-gray-600'}`}>{dateInfo.text}</span>
          : <span className="text-gray-300 text-sm">—</span>}
      </td>

      {/* Ticket */}
      <td className="px-3 py-3 w-32">
        <TicketLink value={task.ticket_url} />
      </td>

      {/* Archive */}
      <td className="px-3 py-3 w-10">
        <button onClick={() => onArchive(task.id)} title="В архив"
          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.5 3.5h11M2.5 3.5l.7 7A1 1 0 004.2 11.5h5.6a1 1 0 001-.9l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </td>
    </tr>
  )
}
