import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
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
  // OTP mode
  tabPassword: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  tabOtp: { en: 'Login with OTP', kh: 'ចូលដោយលេខកូដ' },
  otpSentTo: { en: 'We sent a 6‑digit code to ', kh: 'យើងបានផ្ញើលេខកូដ ៦ខ្ទង់ទៅកាន់ ' },
  sendOtp: { en: 'Send OTP', kh: 'ផ្ញើលេខកូដ' },
  verifyOtp: { en: 'Verify & Login', kh: 'ផ្ទៀងផ្ទាត់ និងចូល' },
  resendOtp: { en: 'Resend code', kh: 'ផ្ញើលេខកូដម្តងទៀត' },
  changePhone: { en: 'Change number', kh: 'ផ្លាស់ប្តូរលេខ' },
  backToPassword: { en: 'Back to password login', kh: 'ត្រលប់ទៅចូលដោយពាក្យសម្ងាត់' },
}

export const Login = () => {
  const { lang } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('password') // 'password' | 'otp'
  const [form, setForm] = useState({ phone: '', password: '', remember: false })
  const [otpPhone, setOtpPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login submit', form)
    login({ phone: form.phone })
    navigate('/profile')
  }

  const handleSendOtp = (e) => {
    e.preventDefault()
    console.log('OTP sent to', otpPhone)
    setOtpSent(true)
  }

  const handleOtpLogin = (e) => {
    e.preventDefault()
    console.log('OTP login', otpPhone, otp)
    login({ phone: otpPhone })
    navigate('/profile')
  }

  const switchMode = (m) => {
    setMode(m)
    setOtpSent(false)
    setOtp('')
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

          {/* Mode tabs */}
          <div className="login-tabs">
            <button className={`login-tab ${mode === 'password' ? 'login-tab--active' : ''}`} onClick={() => switchMode('password')}>
              <LockIcon /> {TEXTS.tabPassword[lang]}
            </button>
            <button className={`login-tab ${mode === 'otp' ? 'login-tab--active' : ''}`} onClick={() => switchMode('otp')}>
              <MessageIcon /> {TEXTS.tabOtp[lang]}
            </button>
          </div>

          {mode === 'password' && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="phone">{TEXTS.phoneLabel[lang]}</label>
                <input id="phone" name="phone" type="tel" placeholder={TEXTS.phonePlaceholder[lang]} value={form.phone} onChange={handleChange} required />
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
              <button type="submit" className="btn-submit">{TEXTS.loginBtn[lang]}</button>
            </form>
          )}

          {mode === 'otp' && !otpSent && (
            <form className="auth-form" onSubmit={handleSendOtp}>
              <div className="field">
                <label htmlFor="otpPhone">{TEXTS.phoneLabel[lang]}</label>
                <input id="otpPhone" name="otpPhone" type="tel" placeholder={TEXTS.phonePlaceholder[lang]} value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} required autoFocus />
              </div>
              <button type="submit" className="btn-submit">{TEXTS.sendOtp[lang]}</button>
              <button type="button" className="login-back-link" onClick={() => switchMode('password')}>
                {TEXTS.backToPassword[lang]}
              </button>
            </form>
          )}

          {mode === 'otp' && otpSent && (
            <form className="auth-form" onSubmit={handleOtpLogin}>
              <div className="field">
                <label htmlFor="otp">{lang === 'en' ? 'Enter OTP Code' : 'បញ្ចូលលេខកូដ OTP'}</label>
                <input id="otp" name="otp" type="text" inputMode="numeric" maxLength={6} placeholder="000000" className="login-otp-input" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required autoFocus />
                <span className="login-otp-sent-text">{TEXTS.otpSentTo[lang]}<strong>{otpPhone}</strong></span>
              </div>
              <button type="submit" className="btn-submit">{TEXTS.verifyOtp[lang]}</button>

              <div className="login-otp-links">
                <button type="button" className="login-link-btn" onClick={() => { setOtpSent(false); setOtp('') }}>{TEXTS.changePhone[lang]}</button>
                <button type="button" className="login-link-btn" onClick={() => console.log('Resend OTP')}>{TEXTS.resendOtp[lang]}</button>
              </div>
            </form>
          )}

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

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export default Login
