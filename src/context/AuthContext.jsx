import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const AuthContext = createContext(null)

// Parse timeout string like "1 min", "1 Min", "2 min", "5 min", "15 min", "20 min" or number into ms
export function parseTimeoutMs(timeoutVal) {
  if (!timeoutVal) return 5 * 60 * 1000 // default fallback: 5 mins
  const match = String(timeoutVal).match(/(\d+)/)
  if (match) {
    const mins = parseInt(match[1], 10)
    if (!isNaN(mins) && mins > 0) {
      return mins * 60 * 1000
    }
  }
  return 5 * 60 * 1000
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true'
    }
    return false
  })

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  })

  // Track whether the session expired due to inactivity (so UI can show a message)
  const [sessionExpired, setSessionExpired] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionExpired') === 'true'
    }
    return false
  })

  // Ref for the inactivity timer so we can clear/reset it
  const inactivityTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      if (user.sessionTimeout) {
        localStorage.setItem('sessionTimeout', user.sessionTimeout)
      }
    } else {
      localStorage.removeItem('user')
    }
  }, [isLoggedIn, user])

  // Get current active inactivity timeout duration in ms
  const getActiveTimeoutMs = useCallback(() => {
    if (user?.sessionTimeout) {
      return parseTimeoutMs(user.sessionTimeout)
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sessionTimeout')
      if (stored) return parseTimeoutMs(stored)
    }
    return 5 * 60 * 1000
  }, [user?.sessionTimeout])

  // ---- Logout (clears state + notifies backend) ----
  const logout = useCallback(() => {
    const token = localStorage.getItem('token')
    // Tell the backend to evict the token from the activity store
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.setItem('isLoggedIn', 'false')
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
      inactivityTimer.current = null
    }
  }, [])

  // Listen to custom session_timeout events (e.g. from API 401s or manual test)
  useEffect(() => {
    const handleTimeoutEvent = () => {
      setSessionExpired(true)
      localStorage.setItem('sessionExpired', 'true')
      logout()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
    window.addEventListener('session_timeout', handleTimeoutEvent)
    return () => window.removeEventListener('session_timeout', handleTimeoutEvent)
  }, [logout])

  // ---- Inactivity auto-logout ----
  const resetInactivityTimer = useCallback(() => {
    if (!localStorage.getItem('token')) return // not logged in

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }

    const timeoutMs = getActiveTimeoutMs()

    inactivityTimer.current = setTimeout(() => {
      // Session expired due to inactivity
      setSessionExpired(true)
      localStorage.setItem('sessionExpired', 'true')
      logout()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('session_timeout'))
        if (window.location.pathname !== '/login') {
          window.location.replace('/login')
        }
      }
    }, timeoutMs)
  }, [logout, getActiveTimeoutMs])

  // Direct method to dynamically update session timeout and restart the timer
  const updateSessionTimeout = useCallback((newTimeout) => {
    if (!newTimeout) return
    localStorage.setItem('sessionTimeout', newTimeout)
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, sessionTimeout: newTimeout }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('session_timeout_changed', { detail: newTimeout }))
    }
    resetInactivityTimer()
  }, [resetInactivityTimer])

  // Listen to session_timeout_changed events from settings or user management
  useEffect(() => {
    const handleTimeoutChanged = () => {
      resetInactivityTimer()
    }
    window.addEventListener('session_timeout_changed', handleTimeoutChanged)
    return () => window.removeEventListener('session_timeout_changed', handleTimeoutChanged)
  }, [resetInactivityTimer])

  // Expose convenient test triggers for developers / testing in browser console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__triggerSessionTimeout = () => {
        setSessionExpired(true)
        localStorage.setItem('sessionExpired', 'true')
        logout()
        window.dispatchEvent(new CustomEvent('session_timeout'))
        if (window.location.pathname !== '/login') {
          window.location.replace('/login')
        }
      }
      window.__setSessionTimeout = (timeoutStr) => {
        updateSessionTimeout(timeoutStr)
      }
      window.__getActiveTimeoutMs = () => getActiveTimeoutMs()
    }
  }, [logout, updateSessionTimeout, getActiveTimeoutMs])

  // Set up activity listeners when logged in
  useEffect(() => {
    if (!isLoggedIn) {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current)
        inactivityTimer.current = null
      }
      return
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    // Adaptive throttle: For 1 min (60,000ms), throttle is 5,000ms (5s) so activity is promptly registered.
    const currentTimeoutMs = getActiveTimeoutMs()
    const THROTTLE_MS = Math.min(15000, Math.max(3000, Math.floor(currentTimeoutMs / 6)))

    let lastActivity = Date.now()

    const handleActivity = () => {
      const now = Date.now()
      if (now - lastActivity > THROTTLE_MS) {
        lastActivity = now
        resetInactivityTimer()
      }
    }

    // Start the initial timer
    resetInactivityTimer()

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current)
        inactivityTimer.current = null
      }
    }
  }, [isLoggedIn, resetInactivityTimer, getActiveTimeoutMs])

  // login(data) accepts the backend AuthResponse: { token, tokenType, user }
  const login = (data) => {
    setSessionExpired(false)
    localStorage.removeItem('sessionExpired')
    if (data?.token) {
      localStorage.setItem('token', data.token)
    }

    let rawUser = data?.user || (typeof data === 'object' ? data : { name: 'Admin' })
    let rawRole = rawUser?.role || data?.role || 'ADMIN'
    if (Array.isArray(rawUser?.roles) && rawUser.roles.length > 0) {
      const f = rawUser.roles[0]
      rawRole = typeof f === 'string' ? f : f.name || f.role || 'ADMIN'
    }
    const cleanRole = String(rawRole).replace(/^ROLE_/, '').toUpperCase()

    const timeout = rawUser?.sessionTimeout || data?.sessionTimeout || localStorage.getItem('sessionTimeout') || '15 min'
    localStorage.setItem('sessionTimeout', timeout)

    const preparedUser = {
      ...rawUser,
      role: cleanRole,
      name: rawUser.fullName || rawUser.name || rawUser.username || 'Administrator',
      sessionTimeout: timeout,
    }

    setUser(preparedUser)
    localStorage.setItem('user', JSON.stringify(preparedUser))
    setIsLoggedIn(true)
  }

  const clearSessionExpired = () => {
    setSessionExpired(false)
    localStorage.removeItem('sessionExpired')
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      sessionExpired,
      clearSessionExpired,
      updateSessionTimeout,
      getActiveTimeoutMs
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
