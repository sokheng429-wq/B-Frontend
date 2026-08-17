import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api/api'
import { Logo } from '../../components/Logo'
import './Login.css'

const TEXTS = {
  eyebrow: { en: 'Welcome back', kh: 'សូមស្វាគមន៍' },
  title1: { en: 'Fresh groceries are just ', kh: 'គ្រឿងទេសស្រស់ៗត្រឹមតែ ' },
  titleHighlight: { en: 'one login away', kh: 'ចូលគណនីម្តង' },
  subtitle: { en: 'Pick up where you left off — your cart, addresses, and order history are all here.', kh: 'បន្តពីកន្លែងដែលអ្នកបានចាកចេញ — កន្ត្រក អាសយដ្ឋាន និងប្រវត្តិការបញ្ជាទិញទាំងអស់នៅទីនេះ។' },
  testimonial: { en: '"Delivery is always on time and the produce is genuinely fresh. My go-to for weekly shopping."', kh: '"ការដឹកជញ្ជូនតែងតែទាន់ពេល ហើយទំនិញពិតជាស្រស់។ ជាកន្លែងដែលខ្ញុំទិញរាល់សប្តាហ៍។"' },
  author: { en: 'Sophea, member since 2024', kh: 'សុភា សមាជិកតាំងពីឆ្នាំ ២០២៤' },
  heading: { en: 'Log in to your account', kh: 'ចូលគណនីរបស់អ្នក' },
  newHere: { en: 'New here?', kh: 'ថ្មីនៅទីនេះ?' },
  createAccount: { en: 'Create an account', kh: 'បង្កើតគណនី' },
  phoneLabel: { en: 'Phone number', kh: 'លេខទូរស័ព្ទ' },
  phonePlaceholder: { en: '012 345 678', kh: '០១២ ៣៤៥ ៦៧៨' },
  passwordLabel: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  passwordPlaceholder: { en: 'Enter your password', kh: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក' },
  rememberMe: { en: 'Remember me', kh: 'ចងចាំខ្ញុំ' },
  forgotPassword: { en: 'Forgot password?', kh: 'ភ្លេចពាក្យសម្ងាត់?' },
  loginBtn: { en: 'Log in', kh: 'ចូលគណនី' },
  footerNote: { en: "By continuing, you agree to B'Groceries' Terms of Service and Privacy Policy.", kh: 'ដោយបន្ត អ្នកយល់ព្រមនឹងលក្ខខណ្ឌសេវាកម្ម និងគោលការណ៍ឯកជនភាពរបស់ B\'Groceries។' },
  // Login fields
  nameLabel: { en: 'Username or full name', kh: 'ឈ្មោះអ្នកប្រើ ឬឈ្មោះពេញ' },
  namePlaceholder: { en: 'e.g. YourName', kh: 'ឧ. YourName' },
  socialNote: { en: 'You\'ll be logged in instantly (a B\'Groceries account is created the first time).', kh: 'អ្នកនឹងចូលគណនីភ្លាមៗ (គណនី B\'Groceries នឹងត្រូវបានបង្កើតនៅពេលដំបូង)។' },
}

export const Login = () => {
  const { lang } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [socialBusy, setSocialBusy] = useState('') // provider being logged in

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await authAPI.login(form.identifier, form.password)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  // One-click social login: straight to the backend, no identifier prompt.
  const handleSocial = async (provider) => {
    setError('')
    setSocialBusy(provider)
    try {
      const res = await authAPI.socialLogin(provider)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSocialBusy('')
    }
  }

  return (
    <div className="auth">
      <div className="auth-panel">
        <div className="auth-panel-top">
          <Logo />
        </div>
        <div className="auth-panel-body">
          <span className="auth-panel-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h2 className="auth-panel-title">
            {TEXTS.title1[lang]}<span>{TEXTS.titleHighlight[lang]}</span>
          </h2>
          <p className="auth-panel-subtitle">{TEXTS.subtitle[lang]}</p>
          <div className="auth-panel-card">
            <p>{TEXTS.testimonial[lang]}</p>
            <span className="auth-panel-card-author">— {TEXTS.author[lang]}</span>
          </div>
        </div>
        <div className="auth-panel-blob" />
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo">
            <Logo />
          </div>

          <h1 className="auth-title">{TEXTS.heading[lang]}</h1>
          <p className="auth-subtitle">
            {TEXTS.newHere[lang]} <Link to="/register">{TEXTS.createAccount[lang]}</Link>
          </p>

          {/* Name: username / full name + password */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="identifier">{TEXTS.nameLabel[lang]}</label>
              <input id="identifier" name="identifier" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.identifier} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="password">{TEXTS.passwordLabel[lang]}</label>
              <input id="password" name="password" type="password" placeholder={TEXTS.passwordPlaceholder[lang]} value={form.password} onChange={handleChange} required />
            </div>
            <div className="field-inline">
              <label className="checkbox-label">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                {TEXTS.rememberMe[lang]}
              </label>
              <Link to="/forgot-password" className="link-muted">{TEXTS.forgotPassword[lang]}</Link>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-submit">{TEXTS.loginBtn[lang]}</button>
          </form>

          {/* One-click social login — below the Login button */}
          <div className="auth-divider"><span>{lang === 'en' ? 'or continue with' : 'ឬបន្តជាមួយ'}</span></div>

          <div className="social-auth">
            <button type="button" className="social-btn social-btn--gmail" onClick={() => handleSocial('gmail')} disabled={!!socialBusy}>
              {socialBusy === 'gmail' ? <SpinnerIcon /> : <GmailIcon />} <span>Continue with <strong>Google</strong></span>
            </button>
            <button type="button" className="social-btn social-btn--telegram" onClick={() => handleSocial('telegram')} disabled={!!socialBusy}>
              {socialBusy === 'telegram' ? <SpinnerIcon /> : <TelegramIcon />} <span>Continue with <strong>Telegram</strong></span>
            </button>
            <button type="button" className="social-btn social-btn--facebook" onClick={() => handleSocial('facebook')} disabled={!!socialBusy}>
              {socialBusy === 'facebook' ? <SpinnerIcon /> : <FacebookIcon />} <span>Continue with <strong>Facebook</strong></span>
            </button>
          </div>
          <p className="auth-social-note">{TEXTS.socialNote[lang]}</p>

          <p className="auth-footer-note">{TEXTS.footerNote[lang]}</p>
        </div>
      </div>
    </div>
  )
}

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

/* Brand logos for the social buttons (filled, full color) */
const GmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.691 2.28 24 3.434 24 5.457z" fill="#EA4335" />
  </svg>
)

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#229ED9" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2" />
  </svg>
)

const SpinnerIcon = () => (
  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" strokeLinecap="round" />
  </svg>
)

export default Login
