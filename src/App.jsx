import { useState, useMemo } from 'react'
import { useTasks } from './store'
import { FilterBar } from './components/FilterBar'
import { TaskTable } from './components/TaskTable'
import { AddTaskModal } from './components/AddTaskModal'

const PRIORITY_ORDER = { 'Высокий': 1, 'Средний': 2, 'Низкий': 3 }
const STATUS_ORDER   = { 'В работе': 1, 'Ревью': 2, 'Бэклог': 3, 'Готово': 4 }

export default function App() {
  const { tasks, loading, addTask, updateTask, archiveTask, reorderTasks } = useTasks()
  const [activeTeam, setActiveTeam] = useState('')
  const [showArchive, setShowArchive] = useState(false)
  const [modalTask, setModalTask] = useState(null)   // null = closed, false = new, task obj = edit
  const [sortKey, setSortKey] = useState('sort_order')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const visibleTasks = useMemo(() => {
    let list = tasks.filter(t => showArchive ? t.archived : !t.archived)
    if (activeTeam) list = list.filter(t => t.team === activeTeam)
    if (sortKey !== 'sort_order') {
      list = [...list].sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey]
        if (sortKey === 'priority') { av = PRIORITY_ORDER[av] ?? 9; bv = PRIORITY_ORDER[bv] ?? 9 }
        else if (sortKey === 'status') { av = STATUS_ORDER[av] ?? 9; bv = STATUS_ORDER[bv] ?? 9 }
        else { av = av ?? ''; bv = bv ?? '' }
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
      })
    }
    return list
  }, [tasks, activeTeam, showArchive, sortKey, sortDir])

  const totalActive = tasks.filter(t => !t.archived && t.status !== 'Готово').length
  const totalDone   = tasks.filter(t => !t.archived && t.status === 'Готово').length

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFDB4D] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2.5" width="10" height="1.8" rx="0.9" fill="#1A1A1A"/>
                <rect x="2" y="6.1" width="7.5" height="1.8" rx="0.9" fill="#1A1A1A"/>
                <rect x="2" y="9.7" width="5" height="1.8" rx="0.9" fill="#1A1A1A"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-none">Бэклог</div>
              <div className="text-xs text-gray-400 mt-0.5">Яндекс Музыка · Маркетинг</div>
            </div>
          </div>
          <button onClick={() => setModalTask(false)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFDB4D] hover:bg-[#F5CC00] text-gray-900 text-sm font-semibold rounded-xl transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Добавить задачу
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Командный бэклог</h1>
          <p className="text-sm text-gray-400 mt-1">{totalActive} активных · {totalDone} готово</p>
        </div>

        <div className="mb-4">
          <FilterBar activeTeam={activeTeam} onChange={setActiveTeam} showArchive={showArchive} onToggleArchive={setShowArchive} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Загрузка...</div>
          ) : (
            <TaskTable
              tasks={visibleTasks}
              onUpdate={updateTask}
              onArchive={archiveTask}
              onReorder={reorderTasks}
              onEdit={setModalTask}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}
        </div>
      </main>

      {modalTask !== null && (
        <AddTaskModal
          task={modalTask || null}
          onClose={() => setModalTask(null)}
          onAdd={addTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  )
}
