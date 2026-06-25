import { useState } from 'react'
import { DEFAULT_GOALS, DEFAULT_ASSIGNEES } from './constants'

const KEY = 'ym_backlog_settings'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)) }

export function useSettings() {
  const [settings, setSettings] = useState(() => ({
    goals: DEFAULT_GOALS,
    assignees: DEFAULT_ASSIGNEES,
    ...load(),
  }))

  const update = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    save(next)
  }

  return {
    goals: settings.goals,
    assignees: settings.assignees,
    updateGoals: (goals) => update({ goals }),
    updateAssignees: (assignees) => update({ assignees }),
  }
}
