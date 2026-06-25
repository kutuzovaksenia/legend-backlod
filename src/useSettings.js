import { useState } from 'react'
import { DEFAULT_TEAMS } from './constants'

const KEY = 'ym_backlog_settings'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)) }

export function useSettings() {
  const [settings, setSettings] = useState(() => ({ teams: DEFAULT_TEAMS, ...load() }))

  const updateTeams = (teams) => {
    const next = { ...settings, teams }
    setSettings(next)
    save(next)
  }

  return { teams: settings.teams, updateTeams }
}
