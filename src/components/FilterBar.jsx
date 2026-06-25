export function FilterBar({ teams, activeTeam, onChange, showArchive, onToggleArchive }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {['', ...teams].map(t => {
          const label = t || 'Все направления'
          const active = activeTeam === t
          return (
            <button key={label} onClick={() => onChange(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {label}
            </button>
          )
        })}
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 whitespace-nowrap select-none">
        <input type="checkbox" checked={showArchive} onChange={e => onToggleArchive(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
        Показать архивные
      </label>
    </div>
  )
}
