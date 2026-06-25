import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { DEFAULT_GOALS, DEFAULT_ASSIGNEES } from './constants'

const LOCAL_KEY = 'ym_backlog_settings'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {} } catch { return {} }
}

export function useSettings() {
  const [goals, setGoals] = useState(() => loadLocal().goals ?? DEFAULT_GOALS)
  const [assignees, setAssignees] = useState(() => loadLocal().assignees ?? DEFAULT_ASSIGNEES)

  useEffect(() => {
    if (!supabase) return
    supabase.from('settings').select('key, value').in('key', ['goals', 'assignees']).then(({ data }) => {
      if (!data) return
      data.forEach(row => {
        if (row.key === 'goals') setGoals(row.value)
        if (row.key === 'assignees') setAssignees(row.value)
      })
    })
  }, [])

  const updateGoals = async (newGoals) => {
    setGoals(newGoals)
    if (supabase) {
      await supabase.from('settings').upsert({ key: 'goals', value: newGoals })
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...loadLocal(), goals: newGoals }))
    }
  }

  const updateAssignees = async (newAssignees) => {
    setAssignees(newAssignees)
    if (supabase) {
      await supabase.from('settings').upsert({ key: 'assignees', value: newAssignees })
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...loadLocal(), assignees: newAssignees }))
    }
  }

  return { goals, assignees, updateGoals, updateAssignees }
}
