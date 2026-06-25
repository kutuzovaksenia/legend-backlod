import { useState, useMemo } from 'react'
import { useTasks } from './store'
import { useSettings } from './useSettings'
import { FilterBar } from './components/FilterBar'
import { TaskTable } from './components/TaskTable'
import { AddTaskModal } from './components/AddTaskModal'
import { SettingsModal } from './components/SettingsModal'
import { PasswordGate, useAuth } from './components/PasswordGate'

const PRIORITY_ORDER  = { 'Высокий': 1, 'Средний': 2, 'Низкий': 3 }
const COMPLEXITY_ORDER = { 'Быстро': 1, 'Средне': 2, 'Сложно': 3 }

export default function App() {
  const { authed, login } = useAuth()
  const { tasks, loading, addTask, updateTask, archiveTask, reorderTasks } = useTasks()
  const { goals, assignees, updateGoals, updateAssignees } = useSettings()

  const [activeGoal, setActiveGoal] = useState('')
  const [showArchive, setShowArchive] = useState(false)
  const [modalTask, setModalTask] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [sortKey, setSortKey] = useState('auto')
  const [sortDir, setSortDir] = useState('asc')

  if (!authed) return <PasswordGate onLogin={login} />

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const visibleTasks = useMemo(() => {
    let list = tasks.filter(t => showArchive ? t.archived : !t.archived)
    if (activeGoal) list = list.filter(t => {
      const tg = t.goals ?? (t.team ? [t.team] : [])
      return tg.includes(activeGoal)
    })

    // Default auto-sort: priority → multi-goal boost → complexity asc
    if (sortKey === 'auto' || sortKey === 'sort_order') {
      list = [...list].sort((a, b) => {
        const pa = PRIORITY_ORDER[a.priority] ?? 9
        const pb = PRIORITY_ORDER[b.priority] ?? 9
        if (pa !== pb) return pa - pb
        // multi-goal tasks rank higher within same priority
        const ga = (a.goals ?? (a.team ? [a.team] : [])).length
        const gb = (b.goals ?? (b.team ? [b.team] : [])).length
        if (gb !== ga) return gb - ga
        // easier tasks first
        const ca = COMPLEXITY_ORDER[a.complexity] ?? 9
        const cb = COMPLEXITY_ORDER[b.complexity] ?? 9
        return ca - cb
      })
    } else {
      list = [...list].sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey]
        if (sortKey === 'priority') { av = PRIORITY_ORDER[av] ?? 9; bv = PRIORITY_ORDER[bv] ?? 9 }
        else if (sortKey === 'complexity') { av = COMPLEXITY_ORDER[av] ?? 9; bv = COMPLEXITY_ORDER[bv] ?? 9 }
        else { av = av ?? ''; bv = bv ?? '' }
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
      })
    }
    return list
  }, [tasks, activeGoal, showArchive, sortKey, sortDir])

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
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" title="Настройки">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.93 2.93l1.06 1.06M12.01 12.01l1.06 1.06M2.93 13.07l1.06-1.06M12.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setModalTask(false)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFDB4D] hover:bg-[#F5CC00] text-gray-900 text-sm font-semibold rounded-xl transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Добавить задачу
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Командный бэклог</h1>
          <p className="text-sm text-gray-400 mt-1">{totalActive} активных · {totalDone} готово</p>
        </div>

        <div className="mb-4">
          <FilterBar goals={goals} activeGoal={activeGoal} onChange={setActiveGoal} showArchive={showArchive} onToggleArchive={setShowArchive} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Загрузка...</div>
          ) : (
            <TaskTable
              tasks={visibleTasks}
              goals={goals}
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
        <AddTaskModal task={modalTask || null} goals={goals} assignees={assignees}
          onClose={() => setModalTask(null)} onAdd={addTask} onUpdate={updateTask} />
      )}
      {showSettings && (
        <SettingsModal goals={goals} assignees={assignees}
          onSaveGoals={updateGoals} onSaveAssignees={updateAssignees}
          onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
