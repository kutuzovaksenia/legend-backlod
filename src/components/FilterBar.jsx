export function FilterBar({ goals, activeGoal, onChange, showArchive, onToggleArchive }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {['', ...goals].map(g => {
          const label = g || 'Все цели'
          const active = activeGoal === g
          return (
            <button key={label} onClick={() => onChange(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {label}
            </button>
          )
        })}
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 whitespace-nowrap select-none flex-shrink-0 pt-1">
        <input type="checkbox" checked={showArchive} onChange={e => onToggleArchive(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
        Показать архивные
      </label>
    </div>
  )
}
