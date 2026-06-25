import { useState } from 'react'

const PASSWORD = 'j~}sn4mIJuvr9Zw'
const SESSION_KEY = 'ym_backlog_auth'

export function useAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const login = () => { sessionStorage.setItem(SESSION_KEY, '1'); setAuthed(true) }
  return { authed, login }
}

export function PasswordGate({ onLogin }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (value === PASSWORD) { onLogin() }
    else { setError(true); setValue('') }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FFDB4D] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="#1A1A1A"/>
            <rect x="3" y="8.75" width="10.5" height="2.5" rx="1.25" fill="#1A1A1A"/>
            <rect x="3" y="13.5" width="7" height="2.5" rx="1.25" fill="#1A1A1A"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Командный бэклог</h1>
        <p className="text-sm text-gray-400 mb-6">Яндекс Музыка · Маркетинг</p>

        <input
          type="password"
          placeholder="Пароль"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors mb-3 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100'}`}
        />
        {error && <p className="text-xs text-red-500 mb-3">Неверный пароль</p>}
        <button onClick={submit} className="w-full px-4 py-3 bg-[#FFDB4D] hover:bg-[#F5CC00] text-gray-900 text-sm font-semibold rounded-xl transition-colors">
          Войти
        </button>
      </div>
    </div>
  )
}
