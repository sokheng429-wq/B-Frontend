import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import clockIcon from '../assets/icon/3dicons-clock-dynamic-color.png'

export default function SessionTimeoutModal() {
  const { sessionExpired, clearSessionExpired } = useAuth()
  const { lang } = useLanguage()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // 1. When session expires, immediately redirect to /login if not already there
  useEffect(() => {
    if (sessionExpired && location.pathname !== '/login') {
      navigate('/login', { replace: true, state: { sessionTimedOut: true } })
    }
  }, [sessionExpired, location.pathname, navigate])

  // Acknowledge timeout and auto-focus login credentials field
  const handleAcknowledge = useCallback(() => {
    clearSessionExpired()
    setTimeout(() => {
      const input = document.getElementById('identifier')
      if (input) {
        input.focus()
      }
    }, 100)
  }, [clearSessionExpired])

  // Handle keyboard shortcuts: Enter or Escape to acknowledge and go to login
  useEffect(() => {
    if (!sessionExpired || location.pathname !== '/login') return

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        handleAcknowledge()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sessionExpired, location.pathname, handleAcknowledge])

  // Flow rule: Only pop up the modal once redirected to /login!
  if (!sessionExpired || location.pathname !== '/login') return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />

      <div className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl text-center transition-all animate-in zoom-in-95 duration-200 font-['Montserrat'] ${
        isDark
          ? 'border-amber-500/30 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#0b0f17] text-white shadow-amber-500/10'
          : 'border-amber-300/80 bg-gradient-to-b from-white via-amber-50/40 to-orange-50/60 text-slate-900 shadow-xl shadow-amber-900/10'
      }`}>
        {/* Top Decorative Amber Hairline */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Close Button (✕) */}
        <button
          type="button"
          onClick={handleAcknowledge}
          className={`absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
          }`}
          title={lang === 'en' ? 'Close' : 'បិទ'}
          aria-label="Close session timeout modal"
        >
          ✕
        </button>

        {/* 3D Clock Icon with Pulsing Halo */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-amber-500/25 blur-xl animate-pulse" />
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border shadow-xl ${
            isDark
              ? 'border-amber-400/40 bg-slate-900/90 shadow-amber-500/20'
              : 'border-amber-300 bg-white shadow-amber-500/15'
          }`}>
            <img
              src={clockIcon}
              alt=""
              className="h-12 w-12 object-contain drop-shadow-md animate-bounce duration-1000"
            />
          </div>
        </div>

        {/* Security Tag */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-500 ring-1 ring-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>{lang === 'en' ? 'Security Timeout' : 'អស់ពេលកំណត់សុវត្ថិភាព'}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          id="session-timeout-title"
          className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}
        >
          {lang === 'en' ? 'Session Timed Out' : 'សម័យការបានផុតកំណត់'}
        </h3>

        {/* Detailed Message */}
        <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
          {lang === 'en'
            ? 'Your session has expired due to inactivity to protect your account. Please log in again to resume your work.'
            : 'សម័យការរបស់អ្នកបានផុតកំណត់ដោយសារគ្មានសកម្មភាព ដើម្បីការពារសុវត្ថិភាពគណនី។ សូមចូលប្រើប្រាស់ម្តងទៀតដើម្បីបន្ត។'}
        </p>

        {/* System Reassurance Box */}
        <div className={`mt-4 rounded-2xl border p-3 text-left flex items-center gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white/80 shadow-xs'
        }`}>
          <span className="text-xl shrink-0">🛡️</span>
          <div className="text-[11px] leading-tight">
            <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {lang === 'en' ? "B'Groceries Security Gateway" : 'ប្រព័ន្ធសុវត្ថិភាព B’Groceries'}
            </p>
            <p className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Your inventory data and records remain safe.'
                : 'ទិន្នន័យស្តុក និងកំណត់ត្រារបស់អ្នកត្រូវបានរក្សាសុវត្ថិភាព។'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAcknowledge}
            autoFocus
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>{lang === 'en' ? 'Log In Again' : 'ចូលប្រើប្រាស់ម្តងទៀត'}</span>
            <span className="text-base font-bold">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
