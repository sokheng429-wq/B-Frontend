import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './LanguageSwitcher.css'
import 'flag-icons/css/flag-icons.min.css'

const LANGUAGES = [
  { code: 'en', flagClass: 'fi fi-gb', label: 'English', short: 'EN' },
  { code: 'kh', flagClass: 'fi fi-kh', label: 'ភាសាខ្មែរ', short: 'KH' },
]

export const LanguageSwitcher = ({ className = '' }) => {
  const { lang, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (code) => {
    setLanguage(code)
    setOpen(false)
  }

  return (
    <div className={`lang-switcher ${className}`} ref={ref}>
      <button
        className="lang-switcher-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className={current.flagClass} />
        <span className="lang-switcher-short">{current.short}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="lang-switcher-dropdown">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-switcher-option ${l.code === lang ? 'lang-switcher-option--active' : ''}`}
              onClick={() => handleSelect(l.code)}
            >
              <span className={l.flagClass} />
              <span className="lang-switcher-label">{l.label}</span>
              {l.code === lang && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ChevronIcon = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={`lang-chevron ${open ? 'lang-chevron--open' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default LanguageSwitcher