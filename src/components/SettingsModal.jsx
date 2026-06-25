import { useState } from 'react'
import { TEAM_COLORS } from '../constants'

export function SettingsModal({ teams, onSave, onClose }) {
  const [list, setList] = useState(teams)
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (!v || list.includes(v)) return
    setList(l => [...l, v])
    setInput('')
  }

  const remove = (t) => setList(l => l.filter(x => x !== t))

  const submit = () => { onSave(list); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Направления</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {list.map((t, i) => (
            <div key={t} className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: TEAM_COLORS[i % TEAM_COLORS.length] }} />
                <span className="text-sm font-medium text-gray-800">{t}</span>
              </div>
              <button onClick={() => remove(t)} className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Новое направление"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
          <button onClick={add} className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
            + Добавить
          </button>
        </div>

        <button onClick={submit} className="w-full px-4 py-2.5 bg-[#FFDB4D] hover:bg-[#F5CC00] text-gray-900 text-sm font-semibold rounded-xl transition-colors">
          Сохранить
        </button>
      </div>
    </div>
  )
}
