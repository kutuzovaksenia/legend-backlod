import { useState } from 'react'
import { PRIORITIES, STATUSES, COMPLEXITY } from '../constants'
import { GoalBadge } from './Badge'

const defaults = { title: '', description: '', assignee: '', goals: [], priority: 'Средний', status: 'Бэклог', complexity: '', due_date: '', ticket_url: '' }

export function AddTaskModal({ onClose, onAdd, onUpdate, task, goals = [], assignees = [] }) {
  const isEdit = !!task
  const [form, setForm] = useState(isEdit
    ? { ...defaults, ...task, goals: task.goals ?? (task.team ? [task.team] : []), due_date: task.due_date ?? '' }
    : defaults)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleGoal = (g) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g]
    }))
  }

  const submit = () => {
    const e = {}
    if (!form.title.trim()) e.title = true
    if (!form.assignee) e.assignee = true
    if (Object.keys(e).length) { setErrors(e); return }
    const payload = { ...form, title: form.title.trim(), due_date: form.due_date || null, ticket_url: form.ticket_url || null }
    if (isEdit) onUpdate(task.id, payload)
    else onAdd(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">{isEdit ? 'Редактировать задачу' : 'Новая задача'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <input autoFocus placeholder="Название задачи *" value={form.title} onChange={e => set('title', e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100'}`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">Обязательное поле</p>}
          </div>

          <textarea placeholder="Заметка (опционально)" value={form.description} onChange={e => set('description', e.target.value)}
            maxLength={300} rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 resize-none transition-colors" />

          {/* Goals multi-select */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Цели {form.goals.length > 1 && <span className="text-yellow-600 font-semibold">↑ приоритет повышен</span>}</p>
            <div className="flex flex-wrap gap-1.5">
              {goals.map(g => {
                const active = form.goals.includes(g)
                return (
                  <button key={g} onClick={() => toggleGoal(g)} type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${active ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    {g}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <select value={form.assignee} onChange={e => set('assignee', e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-yellow-400 bg-white transition-colors ${errors.assignee ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                <option value="">Лид *</option>
                {assignees.map(a => <option key={a}>{a}</option>)}
              </select>
              {errors.assignee && <p className="text-xs text-red-500 mt-1">Выбери лида</p>}
            </div>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white transition-colors">
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white transition-colors">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.complexity} onChange={e => set('complexity', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 bg-white transition-colors">
              <option value="">Сложность</option>
              {COMPLEXITY.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-colors" />

          <input placeholder="Ссылка на тикет (MUSIC-1042, https://...)" value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-colors" />
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Отмена
          </button>
          <button onClick={submit} className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFDB4D] hover:bg-[#F5CC00] text-gray-900 text-sm font-semibold transition-colors">
            {isEdit ? 'Сохранить' : 'Добавить задачу'}
          </button>
        </div>
      </div>
    </div>
  )
}
