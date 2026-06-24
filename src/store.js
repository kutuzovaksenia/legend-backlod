import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const STORAGE_KEY = 'ym_backlog_tasks'

const SAMPLE_TASKS = [
  { id: '1', title: 'Онбординг карточки Моя волна', assignee: 'Лиза', team: 'Маркетинг', priority: 'Высокий', status: 'В работе', due_date: null, description: '', archived: false, source: 'manual', created_at: new Date().toISOString(), sort_order: 0 },
  { id: '2', title: 'Бриф для AI-плейлистов', assignee: 'Ксюша', team: 'Продукт', priority: 'Средний', status: 'Бэклог', due_date: '2026-07-01', description: 'Нужно описать требования для генерации плейлистов через Claude', archived: false, source: 'manual', created_at: new Date().toISOString(), sort_order: 1 },
  { id: '3', title: 'Сводка по B2A Q2', assignee: 'Оля', team: 'Маркетинг', priority: 'Низкий', status: 'Ревью', due_date: null, description: '', archived: false, source: 'manual', created_at: new Date().toISOString(), sort_order: 2 },
  { id: '4', title: 'Настройка CRM-сегментов под Summer Sale', assignee: 'Женя', team: 'CRM', priority: 'Высокий', status: 'Бэклог', due_date: '2026-06-30', description: '', archived: false, source: 'manual', created_at: new Date().toISOString(), sort_order: 3 },
  { id: '5', title: 'A/B тест пуш-уведомлений', assignee: 'Диана', team: 'Гроус', priority: 'Средний', status: 'В работе', due_date: null, description: 'Вариант А — эмодзи в заголовке, вариант Б — без', archived: false, source: 'manual', created_at: new Date().toISOString(), sort_order: 4 },
]

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveLocal(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasksRaw] = useState(() => loadLocal() ?? SAMPLE_TASKS)
  const [loading, setLoading] = useState(false)
  const useSupabase = !!supabase

  const setTasks = useCallback((updater) => {
    setTasksRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (!useSupabase) saveLocal(next)
      return next
    })
  }, [useSupabase])

  useEffect(() => {
    if (!useSupabase) return
    setLoading(true)
    supabase.from('tasks').select('*').order('sort_order').then(({ data }) => {
      if (data) setTasksRaw(data)
      setLoading(false)
    })
    const sub = supabase.channel('tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
      supabase.from('tasks').select('*').order('sort_order').then(({ data }) => { if (data) setTasksRaw(data) })
    }).subscribe()
    return () => supabase.removeChannel(sub)
  }, [useSupabase])

  const addTask = async (task) => {
    const newTask = { ...task, id: crypto.randomUUID(), source: 'manual', archived: false, created_at: new Date().toISOString(), sort_order: tasks.filter(t => !t.archived).length }
    if (useSupabase) {
      const { data } = await supabase.from('tasks').insert(newTask).select().single()
      if (data) setTasks(prev => [...prev, data])
    } else {
      setTasks(prev => [...prev, newTask])
    }
  }

  const updateTask = async (id, patch) => {
    if (useSupabase) {
      await supabase.from('tasks').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }

  const archiveTask = (id) => updateTask(id, { archived: true })

  const reorderTasks = async (newVisibleOrder) => {
    // Merge reordered visible subset back into the full sorted list,
    // then reassign consecutive sort_order to all tasks so there are no conflicts.
    const newVisibleIds = new Set(newVisibleOrder.map(t => t.id))
    const allSorted = [...tasks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    let vi = 0
    const merged = allSorted.map(t => newVisibleIds.has(t.id) ? newVisibleOrder[vi++] : t)
    const final = merged.map((t, i) => ({ ...t, sort_order: i }))
    setTasks(final)
    if (useSupabase) {
      await Promise.all(final.map(t => supabase.from('tasks').update({ sort_order: t.sort_order }).eq('id', t.id)))
    }
  }

  return { tasks, loading, addTask, updateTask, archiveTask, reorderTasks }
}
