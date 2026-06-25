import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { TaskRow } from './TaskRow'

const COLUMNS = [
  { key: 'title',      label: 'Задача' },
  { key: 'goals',      label: 'Цель' },
  { key: 'assignee',   label: 'Лид' },
  { key: 'status',     label: 'Статус' },
  { key: 'complexity', label: 'Сложность' },
  { key: 'due_date',   label: 'Готовность' },
  { key: 'ticket_url', label: 'Тикет' },
]

function SortIcon({ active, dir }) {
  if (!active) return <span className="ml-1 text-gray-300 text-xs">↕</span>
  return <span className="ml-1 text-xs">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function TaskTable({ tasks, onUpdate, onArchive, onReorder, onEdit, sortKey, sortDir, onSort, goals }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIdx = tasks.findIndex(t => t.id === active.id)
    const newIdx = tasks.findIndex(t => t.id === over.id)
    onReorder(arrayMove(tasks, oldIdx, newIdx))
  }

  if (!tasks.length) return (
    <div className="text-center py-16 text-gray-400 text-sm">Задач нет</div>
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <div>
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-8" />
              <th className="px-2 py-2.5 w-10">
                <button onClick={() => onSort('priority')} className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors">
                  № <SortIcon active={sortKey === 'priority'} dir={sortDir} />
                </button>
              </th>
              {COLUMNS.map(col => (
                <th key={col.key} className="px-3 py-2.5 text-left">
                  <button onClick={() => onSort(col.key)} className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors whitespace-nowrap">
                    {col.label} <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </button>
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map(task => (
                <TaskRow key={task.id} task={task} onUpdate={onUpdate} onArchive={onArchive} onEdit={onEdit} goals={goals} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  )
}
