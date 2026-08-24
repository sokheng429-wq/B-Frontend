import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'admin-notifications'
const MAX_ITEMS = 40

const TYPE_META = {
  product: { icon: '📦', color: '#22c55e', href: '/admin/products/add' },
  job: { icon: '💼', color: '#f59e0b', href: '/admin/jobs/add' },
  member: { icon: '👤', color: '#3b82f6', href: '/admin/members/add' },
  user: { icon: '🛡️', color: '#a855f7', href: '/admin/users/add' },
  promotion: { icon: '🏷️', color: '#ec4899', href: '/admin/promotions/add' },
  partner: { icon: '🤝', color: '#06b6d4', href: '/admin/partners/add' },
  driver: { icon: '🚚', color: '#f59e0b', href: '/admin/drivers/add' },
}

const NotificationContext = createContext(null)

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(loadSaved)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_ITEMS)))
  }, [notifications])

  const addNotification = useCallback((payload) => {
    const meta = TYPE_META[payload.type] || TYPE_META.product
    const item = {
      id: Date.now() + Math.random(),
      type: payload.type,
      action: payload.action || 'add',
      title: payload.title,
      detail: payload.detail || '',
      href: payload.href || meta.href,
      icon: payload.icon || meta.icon,
      color: payload.color || meta.color,
      read: false,
      createdAt: Date.now(),
    }
    setNotifications((prev) => [item, ...prev].slice(0, MAX_ITEMS))
    return item
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext
