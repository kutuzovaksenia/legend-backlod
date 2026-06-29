const DIMENSIONS = [
  { key: 'goals',      label: 'Цель' },
  { key: 'assignee',   label: 'Лид' },
  { key: 'status',     label: 'Статус' },
  { key: 'complexity', label: 'Сложность' },
]

export function FilterBar({ dimension, onDimensionChange, options, activeFilter, onFilterChange, showArchive, onToggleArchive }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {DIMENSIONS.map(d => (
          <button key={d.key} onClick={() => onDimensionChange(d.key)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${dimension === d.key ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
            {d.label}
          </button>
        ))}
        <div className="ml-auto">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 whitespace-nowrap select-none">
            <input type="checkbox" checked={showArchive} onChange={e => onToggleArchive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-gray-900" />
            Показать архивные
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {['', ...options].map(val => {
          const label = val || `Все`
          const active = activeFilter === val
          return (
            <button key={val || '__all'} onClick={() => onFilterChange(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
