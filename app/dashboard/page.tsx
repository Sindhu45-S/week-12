'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import styles from './dashboard.module.css'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Task = {
  id: string
  title: string
  is_completed: boolean
  user_id: string
  priority?: 'Low' | 'Medium' | 'High'
  due_date: string | null
  created_at: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [dueDate, setDueDate] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    fetchUser()
  }, [])

  // Fetch tasks for current user
  useEffect(() => {
    if (!userId) return
    fetchTasks()
  }, [userId])

  async function fetchTasks() {
    if (!userId) return
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }

    setTasks(data || [])
  }

  async function addOrUpdateTask() {
    if (!newTask.trim() || !userId) return

    if (editingTask) {
      // Update existing task
      const updateData: any = { title: newTask }
      if (priority) updateData.priority = priority
      if (dueDate) updateData.due_date = dueDate
      
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', editingTask.id)
        .eq('user_id', userId)

      if (error) console.error('Error updating task:', error?.message || JSON.stringify(error))
      setEditingTask(null)
    } else {
      // Add new task
      const { error } = await supabase.from('tasks').insert({
        title: newTask,
        is_completed: false,
        user_id: userId,
        priority: priority || 'Low',
        due_date: dueDate || null
      })
      if (error) console.error('Error adding task:', error?.message || JSON.stringify(error))
    }

    setNewTask('')
    setDueDate('')
    setPriority('Low')
    fetchTasks()
  }

  async function toggleTask(id: string, status: boolean) {
    if (!userId) return
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !status })
      .eq('id', id)
      .eq('user_id', userId)
    if (error) console.error('Error toggling task:', error)
    fetchTasks()
  }

  async function deleteTask(id: string) {
    if (!userId) return
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) console.error('Error deleting task:', error)
    fetchTasks()
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
    else window.location.href = '/'
  }

  function startEditing(task: Task) {
    setEditingTask(task)
    setNewTask(task.title)
    setPriority(task.priority || 'Low')
    setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'High':
        return '#ef4444'
      case 'Medium':
        return '#f59e0b'
      case 'Low':
        return '#10b981'
      default:
        return '#ccc'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📋 Flow Desk</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sign Out
        </button>
      </div>

      {/* Add / Edit Task */}
      <div className={styles.inputGroup}>
        <input
          id="new-task"
          name="new-task"
          type="text"
          placeholder="Task title..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className={styles.taskInput}
        />
        <select
          title="Select task priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
          className={styles.select}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          title="Select task due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.dateInput}
        />
        <button
          onClick={addOrUpdateTask}
          className={styles.addButton}
        >
          {editingTask ? 'Update' : 'Add'}
        </button>
      </div>

      {/* Task List */}
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`${styles.taskItem} ${task.is_completed ? styles.completed : ''}`}
          >
            <div className={styles.taskHeader}>
              <span
                onClick={() => toggleTask(task.id, task.is_completed)}
                className={`${styles.taskTitle} ${task.is_completed ? styles.strikethrough : ''}`}
              >
                {task.title}
              </span>
              <span
                className={`${styles.priorityBadge} ${styles[`priority-${(task.priority || 'Low').toLowerCase()}`]}`}
              >
                {task.priority || 'Low'}
              </span>
            </div>

            <div className={styles.taskFooter}>
              <small className={styles.dueDate}>
                Due: {task.due_date ? task.due_date.split('T')[0] : 'No due date'}
              </small>

              <div className={styles.actionButtons}>
                <button
                  onClick={() => startEditing(task)}
                  className={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={styles.deleteButton}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className={styles.emptyState}>
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  )
}
