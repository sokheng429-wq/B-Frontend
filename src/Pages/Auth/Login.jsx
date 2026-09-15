import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { authAPI } from '../../api/api'
import { Logo } from '../../components/Logo'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import ThemeToggle from '../../components/ThemeToggle'
import { isStaffOrAdminRole } from '../../utils/roleUtils'

import cubeIcon from '../../assets/icon/3dicons-cube-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import shieldIcon from '../../assets/icon/3dicons-shield-dynamic-color.png'
import mapPinIcon from '../../assets/icon/3dicons-map-pin-dynamic-color.png'

import './Login.css'

export const OUTLET_OPTIONS = [
  { value: 'Main Store Warehouse', label: 'Main Store & Central Warehouse', location: 'St. 271, Phnom Penh', code: 'HQ-WH1' },
  { value: 'Central Cold Storage', label: 'Central Cold Storage & Logistics', location: 'Sen Sok, Phnom Penh', code: 'COLD-02' },
  { value: 'Express Mart BKK1', label: 'Express Mart — BKK1 Branch', location: 'St. 57, BKK1', code: 'RET-BKK' },
  { value: 'Toul Kork Branch', label: 'Toul Kork Retail Branch', location: 'St. 315, Toul Kork', code: 'RET-TK1' },
  { value: 'Chbar Ampov Depot', label: 'Chbar Ampov Distribution Depot', location: 'National Road 1', code: 'DEP-CA1' },
  { value: 'Siem Reap Hub', label: 'Siem Reap Regional Hub', location: 'Airport Road, Siem Reap', code: 'HUB-SR1' },
]

const TEXTS = {
  portalBadge: {
    en: "B'GROCERIES • INVENTORY OPS",
    kh: "B'GROCERIES • ប្រតិបត្តិការស្តុក",
  },
  welcomeGreeting: {
    en: 'INVENTORY MANAGEMENT SYSTEM',
    kh: 'ប្រព័ន្ធគ្រប់គ្រងស្តុកទំនិញ',
  },
  welcomeHeadline: {
    en: 'INVENTORY MANAGEMENT SYSTEM',
    kh: 'ការគ្រប់គ្រងស្តុក និងប្រតិបត្តិការហាងតាមពេលវេលាជាក់ស្តែង។',
  },
  welcomeSub: {
    en: 'WELCOME BACK ADMIN',
    kh: 'ការទទួលទំនិញចូលឃ្លាំងកណ្តាល ការសមកាលកម្មទិន្នន័យស្តុកភ្លាមៗ និងការគ្រប់គ្រងសាខាហាងទំនើបនៅកម្ពុជា។',
  },
  cardTitle: {
    en: 'Sign In',
    kh: 'ចូលប្រព័ន្ធ',
  },
  cardSubtitle: {
    en: 'Select your store outlet and sign in with your staff account.',
    kh: 'សូមជ្រើសរើសសាខាហាង និងបញ្ចូលគណនីរបស់អ្នកដើម្បីចាប់ផ្តើម។',
  },
  outletLabel: {
    en: 'STORE OUTLET',
    kh: 'សាខាហាង / ឃ្លាំង',
  },
  loginLabel: {
    en: 'USERNAME / LOGIN',
    kh: 'ឈ្មោះអ្នកប្រើ ឬ អ៊ីមែល',
  },
  loginPlaceholder: {
    en: 'Enter username or work email',
    kh: 'បញ្ចូលឈ្មោះអ្នកប្រើ ឬ អ៊ីមែល',
  },
  passwordLabel: {
    en: 'PASSWORD',
    kh: 'ពាក្យសម្ងាត់',
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    kh: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក',
  },
  rememberMe: {
    en: 'Remember this device',
    kh: 'ចងចាំឧបករណ៍នេះ',
  },
  forgotPassword: {
    en: 'Need password help?',
    kh: 'ត្រូវការជំនួយពាក្យសម្ងាត់?',
  },
  signInBtn: {
    en: 'Sign In to Portal',
    kh: 'ចូលប្រព័ន្ធគ្រប់គ្រង',
  },
  signingIn: {
    en: 'Signing in…',
    kh: 'កំពុងចូលគណនី…',
  },
  systemActive: {
    en: 'Store Network Online',
    kh: 'ប្រព័ន្ធហាងកំពុងដំណើរការ',
  },
  securityNote: {
    en: 'Enterprise Encrypted • Authorized Staff Only',
    kh: 'ប្រព័ន្ធការពារសុវត្ថិភាពខ្ពស់ • សម្រាប់តែបុគ្គលិកមានសិទ្ធិ',
  },
  modalTitle: {
    en: 'Need Help with Your Password?',
    kh: 'ត្រូវការជំនួយជាមួយពាក្យសម្ងាត់?',
  },
  modalHeadline: {
    en: 'Contact Your Store Manager or IT Admin',
    kh: 'សូមទាក់ទងអ្នកគ្រប់គ្រងហាង ឬ IT Admin',
  },
  modalDesc: {
    en: 'For store data security and financial compliance, staff passwords are reset by your Store Manager or Head Office IT. Reach out via Telegram or direct hotline.',
    kh: 'ដើម្បីសុវត្ថិភាពទិន្នន័យ និងហិរញ្ញវត្ថុហាង ពាក្យសម្ងាត់ត្រូវបានកំណត់ឡើងវិញដោយផ្ទាល់ដោយអ្នកគ្រប់គ្រង ឬ IT។ សូមទាក់ទងតាមតេឡេក្រាម ឬលេខទូរស័ព្ទខាងក្រោម។',
  },
  adminManagerLabel: {
    en: 'Store Operations Desk',
    kh: 'ផ្នែកប្រតិបត្តិការហាង',
  },
  adminHotlineLabel: {
    en: 'Support Hotline',
    kh: 'លេខទូរស័ព្ទជំនួយ',
  },
  adminTelegramLabel: {
    en: 'Direct Telegram',
    kh: 'តេឡេក្រាមជំនួយ',
  },
  modalCloseBtn: {
    en: 'Understood, Back to Sign In',
    kh: 'យល់ព្រម, ត្រឡប់ទៅចូលគណនីវិញ',
  },
}

export const Login = () => {
  const { lang } = useLanguage()
  const { isDark } = useTheme()
  const { user, isLoggedIn, login, sessionExpired, clearSessionExpired } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Contact Admin modal state
  const [showAdminModal, setShowAdminModal] = useState(() => searchParams.get('help') === 'admin')

  // If user is already authenticated, redirect to appropriate destination
  useEffect(() => {
    if (isLoggedIn) {
      if (isStaffOrAdminRole(user)) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isLoggedIn, user, navigate])

  // Form state
  const [form, setForm] = useState({
    outlet: typeof window !== 'undefined' ? localStorage.getItem('selectedOutlet') || 'Main Store Warehouse' : 'Main Store Warehouse',
    identifier: '',
    password: '',
    remember: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Custom Outlet dropdown state
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false)
  const outletDropdownRef = useRef(null)

  // Close custom outlet dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (outletDropdownRef.current && !outletDropdownRef.current.contains(e.target)) {
        setIsOutletDropdownOpen(false)
      }
    }
    if (isOutletDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOutletDropdownOpen])

  // Current selected outlet details
  const selectedOutletObj = OUTLET_OPTIONS.find((o) => o.value === form.outlet) || OUTLET_OPTIONS[0]

  // Only clear session expired when user submits or interacts
  const handleDismissSessionExpired = () => {
    if (sessionExpired) {
      clearSessionExpired()
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedOutlet', form.outlet)
      }

      const res = await authAPI.login(form.identifier, form.password)
      login(res.data)
      const loggedInUser = res.data?.user || res.data
      if (isStaffOrAdminRole(loggedInUser)) {
        const fromPath = location.state?.from?.pathname
        const destination = (fromPath && fromPath !== '/') ? fromPath : '/admin'
        navigate(destination, { replace: true })
      } else {
        const fromPath = location.state?.from?.pathname
        const destination = fromPath || '/'
        navigate(destination, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  // Strictly lock html & body scroll so the Login page is completely fixed
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyHeight = document.body.style.height
    const prevHtmlHeight = document.documentElement.style.height
    const prevBodyOverscroll = document.body.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.height = '100%'
    document.documentElement.style.height = '100%'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.height = prevBodyHeight
      document.documentElement.style.height = prevHtmlHeight
      document.body.style.overscrollBehavior = prevBodyOverscroll
    }
  }, [])

  return (
    <div className={`login-page-root ${isDark ? 'theme-dark' : 'theme-light'}`}>
      {/* Background ambient lighting - strictly contained to avoid scroll */}
      <div className="login-ambient-container" aria-hidden="true">
        <div className="login-ambient-blob blob-1" />
        <div className="login-ambient-blob blob-2" />
      </div>

      <div className="login-split-container">
        {/* =========================================================
            LEFT SHOWCASE SIDE: BRAND & OPERATIONAL CAPABILITIES
           ========================================================= */}
        <div className="login-brand-panel">
          {/* Top Brand Bar */}
          <div className="brand-panel-top">
            <div className="brand-logo-wrap">
              <Logo />
            </div>
            <div className="brand-badge-pill">
              <span className="brand-badge-dot" />
              <span>{TEXTS.portalBadge[lang]}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="brand-panel-hero">
            <div className="brand-hero-tag">
              <span className="hero-tag-text">{TEXTS.welcomeGreeting[lang]}</span>
            </div>

            <h1 className="brand-hero-title">
              {TEXTS.welcomeHeadline[lang]}
            </h1>

            <p className="brand-hero-subtitle">
              {TEXTS.welcomeSub[lang]}
            </p>

            {/* 3 Live Feature Glassmorphic Cards */}
            <div className="brand-feature-cards">
              <div className="brand-feature-card">
                <span className="feature-icon-box">
                  <img src={cubeIcon} alt="" className="feature-3d-img" />
                </span>
                <div className="feature-card-body">
                  <h3 className="feature-card-title">
                    {lang === 'en' ? 'CENTRAL RECEIVING & STOCKS' : 'ការទទួលទំនិញ និងស្តុកកណ្តាល'}
                  </h3>
                  <p className="feature-card-desc">
                    {lang === 'en' ? 'PO tracking, barcode receiving, and inventory valuation' : 'តាមដាន PO ទទួលទំនិញដោយបារកូដ និងគណនាតម្លៃស្តុក'}
                  </p>
                </div>
              </div>

              <div className="brand-feature-card brand-feature-card--orange">
                <span className="feature-icon-box">
                  <img src={chartIcon} alt="" className="feature-3d-img" />
                </span>
                <div className="feature-card-body">
                  <h3 className="feature-card-title">
                    {lang === 'en' ? 'MULTI-BRANCH OPERATIONS' : 'ប្រតិបត្តិការបណ្តាញសាខា'}
                  </h3>
                  <p className="feature-card-desc">
                    {lang === 'en' ? 'Real-time synchronization between retail outlets & central cold storage' : 'សមកាលកម្មទិន្នន័យរវាងសាខាលក់ និងឃ្លាំងត្រជាក់កណ្តាល'}
                  </p>
                </div>
              </div>

              <div className="brand-feature-card">
                <span className="feature-icon-box">
                  <img src={shieldIcon} alt="" className="feature-3d-img" />
                </span>
                <div className="feature-card-body">
                  <h3 className="feature-card-title">
                    {lang === 'en' ? 'ROLE & CASHBOOK CONTROL' : 'ការគ្រប់គ្រងសិទ្ធិ និងសៀវភៅសាច់ប្រាក់'}
                  </h3>
                  <p className="feature-card-desc">
                    {lang === 'en' ? 'Fine-grained staff access, cash in/out registers & audit logs' : 'កំណត់សិទ្ធិបុគ្គលិក កត់ត្រាចំណូលចំណាយ និងកំណត់ហេតុ'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Status */}
          <div className="brand-panel-footer">
            <div className="footer-status-pill">
              <span className="status-live-dot" />
              <span>INVENTORY MANAGEMENT SYSTEM V1.1</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT INTERACTIVE SIDE: MODERN HUMAN FORM
           ========================================================= */}
        <div className="login-form-panel">
          {/* Top Quick Actions Bar (Live status + Theme toggle + Language) */}
          <div className="form-panel-topbar">
            <div className="live-status-indicator">
              <span className="live-pulse-dot" />
              <span className="live-status-text">{TEXTS.systemActive[lang]}</span>
            </div>

            <div className="topbar-controls">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Centered Login Card */}
          <div className="login-form-card">
            {/* Top Glowing Hairline Accent */}
            <div className="form-card-top-accent" aria-hidden="true" />

            {/* Mobile Header Logo */}
            <div className="form-mobile-logo">
              <Logo />
            </div>

            {/* Form Title & Subtitle */}
            <div className="form-card-header">
              <h2 className="form-title">{TEXTS.cardTitle[lang]}</h2>
              <p className="form-subtitle">{TEXTS.cardSubtitle[lang]}</p>
            </div>

            {/* Session Timeout Banner */}
            {sessionExpired && (
              <div
                className="login-error-banner animate-in fade-in duration-200"
                style={{
                  borderColor: 'rgba(245, 158, 11, 0.45)',
                  background: 'rgba(245, 158, 11, 0.14)',
                  color: '#fbbf24',
                }}
              >
                <span className="error-icon text-lg">⏰</span>
                <span className="error-text">
                  {lang === 'en'
                    ? 'Your session has timed out due to inactivity. Please log in again.'
                    : 'សម័យការរបស់អ្នកបានផុតកំណត់ដោយសារគ្មានសកម្មភាព។ សូមចូលប្រើប្រាស់ម្តងទៀត។'}
                </span>
                <button
                  type="button"
                  onClick={handleDismissSessionExpired}
                  className="error-close-btn"
                  aria-label="Dismiss session expired alert"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="login-error-banner animate-shake">
                <span className="error-icon"><AlertCircleIcon /></span>
                <span className="error-text">{error}</span>
                <button type="button" onClick={() => setError('')} className="error-close-btn" aria-label="Dismiss error">✕</button>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="login-interactive-form" noValidate>
              {/* 1. USERNAME / IDENTIFIER */}
              <div className="form-field-group">
                <label htmlFor="identifier" className="form-field-label">
                  <UserIcon />
                  <span>{TEXTS.loginLabel[lang]}</span>
                </label>
                <div className="form-input-container">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder={TEXTS.loginPlaceholder[lang]}
                    value={form.identifier}
                    onChange={handleChange}
                    required
                    autoFocus
                    autoComplete="username"
                    className="form-custom-input"
                  />
                </div>
              </div>

              {/* 2. PASSWORD FIELD */}
              <div className="form-field-group">
                <label htmlFor="password" className="form-field-label">
                  <LockIcon />
                  <span>{TEXTS.passwordLabel[lang]}</span>
                </label>
                <div className="form-input-container input-with-action">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={TEXTS.passwordPlaceholder[lang]}
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="form-custom-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    tabIndex="-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* 3. STORE OUTLET SELECTION (CUSTOM MODERN DROPDOWN) */}
              <div className="form-field-group" ref={outletDropdownRef}>
                <label className="form-field-label">
                  <BuildingIcon />
                  <span>{TEXTS.outletLabel[lang]}</span>
                </label>
                <div className="custom-outlet-dropdown">
                  <button
                    type="button"
                    className={`outlet-trigger-btn ${isOutletDropdownOpen ? 'outlet-trigger-btn--open' : ''}`}
                    onClick={() => setIsOutletDropdownOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isOutletDropdownOpen}
                  >
                    <span className="outlet-trigger-icon-box">
                      <BuildingIcon />
                    </span>
                    <div className="outlet-trigger-info">
                      <div className="outlet-trigger-headline">
                        <span className="outlet-trigger-name">{selectedOutletObj.label}</span>
                        <span className="outlet-trigger-code-chip">{selectedOutletObj.code}</span>
                      </div>
                      <div className="outlet-trigger-sub-row">
                        <span className="outlet-trigger-loc">
                          <PinDotIcon />
                          <span>{selectedOutletObj.location}</span>
                        </span>
                        <span className="outlet-status-pill">
                          <span className="outlet-status-dot" />
                          <span>{lang === 'en' ? 'Active' : 'ដំណើរការ'}</span>
                        </span>
                      </div>
                    </div>
                    <span className={`outlet-trigger-chevron ${isOutletDropdownOpen ? 'rotated' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>

                  {isOutletDropdownOpen && (
                    <div className="outlet-dropdown-menu animate-scaleUp" role="listbox">
                      {/* Top Hairline Gradient Ribbon */}
                      <div className="outlet-dropdown-ribbon" aria-hidden="true" />

                      {/* Header bar */}
                      <div className="outlet-menu-header">
                        <span className="outlet-menu-header-title">
                          {lang === 'en' ? 'Select Store Outlet' : 'ជ្រើសរើសសាខាហាង'}
                        </span>
                        <span className="outlet-menu-header-count">
                          {OUTLET_OPTIONS.length} {lang === 'en' ? 'Branches' : 'សាខា'}
                        </span>
                      </div>

                      {/* Outlet list options */}
                      <div className="outlet-options-scroll">
                        {OUTLET_OPTIONS.map((opt) => {
                          const isSelected = form.outlet === opt.value
                          return (
                            <div
                              key={opt.value}
                              role="option"
                              aria-selected={isSelected}
                              className={`outlet-option-item ${isSelected ? 'outlet-option-item--selected' : ''}`}
                              onClick={() => {
                                setForm((prev) => ({ ...prev, outlet: opt.value }))
                                setIsOutletDropdownOpen(false)
                              }}
                            >
                              <span className="outlet-option-icon-box">
                                <BuildingIcon />
                              </span>
                              <div className="outlet-option-text">
                                <div className="outlet-option-title-row">
                                  <span className="outlet-option-title">{opt.label}</span>
                                  <span className="outlet-option-code-pill">{opt.code}</span>
                                </div>
                                <div className="outlet-option-sub-row">
                                  <span className="outlet-option-loc">
                                    <PinDotIcon />
                                    <span>{opt.location}</span>
                                  </span>
                                </div>
                              </div>
                              {isSelected ? (
                                <span className="outlet-check-badge">
                                  <CheckIcon />
                                </span>
                              ) : (
                                <span className="outlet-hover-arrow">
                                  <ArrowRightMiniIcon />
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Footer note */}
                      <div className="outlet-menu-footer">
                        <span className="outlet-footer-dot" />
                        <span>{lang === 'en' ? 'Multi-Branch Inventory Live Sync' : 'សមកាលកម្មទិន្នន័យស្តុកតាមសាខាជាក់ស្តែង'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Remember Me & Help Links */}
              <div className="form-meta-row">
                <label className="remember-me-toggle">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="remember-checkbox"
                  />
                  <span className="remember-label-text">{TEXTS.rememberMe[lang]}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="contact-admin-link"
                >
                  {TEXTS.forgotPassword[lang]}
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-submit-button"
              >
                {loading ? (
                  <span className="submit-loading-content">
                    <SpinnerIcon />
                    <span>{TEXTS.signingIn[lang]}</span>
                  </span>
                ) : (
                  <span className="submit-normal-content">
                    <span>{TEXTS.signInBtn[lang]}</span>
                    <ArrowRightIcon />
                  </span>
                )}
              </button>
            </form>

            {/* Footer Trust & Security Badge */}
            <div className="form-security-footer">
              <ShieldCheckIcon />
              <span>{TEXTS.securityNote[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTACT STORE MANAGER / IT ADMIN MODAL
         ========================================================= */}
      {showAdminModal && (
        <div className="admin-modal-backdrop animate-fadeIn" onClick={() => setShowAdminModal(false)}>
          <div className="admin-modal-window animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-title-icon">
                  <img src={mapPinIcon} alt="" className="w-5 h-5 object-contain" />
                </span>
                <span className="modal-title-text">{TEXTS.modalTitle[lang]}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="modal-close-icon-btn"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="modal-hero-brief">
                <div className="modal-avatar-badge">
                  <img src={shieldIcon} alt="" className="w-9 h-9 object-contain drop-shadow" />
                </div>
                <div>
                  <h3 className="modal-headline">{TEXTS.modalHeadline[lang]}</h3>
                  <p className="modal-description">{TEXTS.modalDesc[lang]}</p>
                </div>
              </div>

              <div className="modal-contact-details">
                <div className="contact-detail-row">
                  <span className="contact-k">
                    <StorePinIcon />
                    <span>Selected Branch:</span>
                  </span>
                  <span className="contact-v branch-highlight">{form.outlet}</span>
                </div>
                <div className="contact-detail-row">
                  <span className="contact-k">
                    <SupportDeskIcon />
                    <span>{TEXTS.adminManagerLabel[lang]}:</span>
                  </span>
                  <span className="contact-v">Floor Manager & IT Desk</span>
                </div>
                <div className="contact-detail-row">
                  <span className="contact-k">
                    <PhoneIcon />
                    <span>{TEXTS.adminHotlineLabel[lang]}:</span>
                  </span>
                  <a href="tel:+85523999888" className="contact-link font-mono">+855 23 999 888</a>
                </div>
                <div className="contact-detail-row">
                  <span className="contact-k">
                    <TelegramIcon />
                    <span>{TEXTS.adminTelegramLabel[lang]}:</span>
                  </span>
                  <a href="https://t.me/bgroceries_support" target="_blank" rel="noreferrer" className="contact-link telegram-link font-mono">
                    @bgroceries_support
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="modal-dismiss-button"
              >
                {TEXTS.modalCloseBtn[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline SVGs for crisp precision
const BuildingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </svg>
)

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-spin">
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const StorePinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const SupportDeskIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const TelegramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PinDotIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ArrowRightMiniIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default Login
