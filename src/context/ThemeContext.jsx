import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    localStorage.setItem('app-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme')
      document.documentElement.classList.remove('dark')
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark')
    } else {
      document.documentElement.classList.remove('light-theme')
      document.documentElement.classList.add('dark')
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const setThemeMode = (mode) => setTheme(mode)

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
