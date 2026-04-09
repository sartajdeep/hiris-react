import { useState, useCallback } from 'react'
import { initialTasks } from '../data/tasksData'
const COLORS = { High:'bg-[#EF4444]', Medium:'bg-[#F59E0B]', Low:'bg-[#3B82F6]' }
export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const addTask = useCallback(({ text, priority, due }) => {
    if (!text.trim()) return
    const dueDisplay = due ? new Date(due).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : null
    setTasks(prev => [{ id:Date.now(), text, priority, due:dueDisplay, priorityColor:COLORS[priority], completed:false, completing:false }, ...prev])
    closeModal()
  }, [closeModal])
  const completeTask = useCallback((id) => {
    // Step 1: strikethrough (800ms)
    setTasks(prev => prev.map(t => t.id===id ? {...t, completing:true} : t))
    // Step 2: fade+slide out (500ms), then remove
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id===id ? {...t, completed:true} : t))
      setTimeout(() => setTasks(prev => prev.filter(t => t.id!==id)), 500)
    }, 800)
  }, [])
  return { tasks, modalOpen, openModal, closeModal, addTask, completeTask }
}
