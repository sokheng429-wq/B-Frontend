import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api/api'
import { Logo } from '../../components/Logo'
import './Register.css'

const TEXTS = {
  eyebrow: { en: "Join B'Groceries", kh: 'ចូលរួមជាមួយ B\'Groceries' },
  title1: { en: 'Create an account, ', kh: 'បង្កើតគណនី ' },
  titleHighlight: { en: 'shop smarter', kh: 'ទិញទំនិញឆ្លាតជាងមុន' },
  subtitle: { en: 'Free delivery, member-only prices, and faster checkout every time you shop.', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ តម្លៃសម្រាប់សមាជិក និងការទូទាត់លឿនជាងមុនរាល់ពេលដែលអ្នកទិញទំនិញ។' },
  testimonial: { en: '"Signing up took two minutes and I\'ve saved way more than that on member pricing already."', kh: '"ការចុះឈ្មោះចំណាយពេលតែពីរនាទី ហើយខ្ញុំបានសន្សំច្រើនជាងនោះលើតម្លៃសមាជិករួចទៅហើយ។"' },
  author: { en: 'Dara, member since 2025', kh: 'តារា សមាជិកតាំងពីឆ្នាំ ២០២៥' },
  heading: { en: 'Create your account', kh: 'បង្កើតគណនីរបស់អ្នក' },
  alreadyHave: { en: 'Already have one?', kh: 'មានគណនីហើយ?' },
  logIn: { en: 'Log in', kh: 'ចូលគណនី' },
  usernameLabel: { en: 'Username', kh: 'ឈ្មោះអ្នកប្រើ' },
  usernamePlaceholder: { en: 'e.g. Username', kh: 'ឧ. Username' },
  nameLabel: { en: 'Full name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
  emailLabel: { en: 'Email (Gmail)', kh: 'អ៊ីមែល (Gmail)' },
  emailPlaceholder: { en: 'e.g. Your@gmail.com', kh: 'ឧ. Your@gmail.com' },
  telegramLabel: { en: 'Telegram handle', kh: 'ឈ្មោះតេឡេក្រាម' },
  telegramPlaceholder: { en: 'e.g. @sokheng', kh: 'ឧ. @sokheng' },
  facebookLabel: { en: 'Facebook', kh: 'ហ្វេសប៊ុក' },
  facebookPlaceholder: { en: 'e.g. sokheng.fb', kh: 'ឧ. sokheng.fb' },
  phoneLabel: { en: 'Phone number (required)', kh: 'លេខទូរស័ព្ទ (ចាំបាច់)' },
  phonePlaceholder: { en: '012 345 678', kh: '០១២ ៣៤៥ ៦៧៨' },
  passwordLabel: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  passwordPlaceholder: { en: 'Create a password', kh: 'បង្កើតពាក្យសម្ងាត់' },
  confirmLabel: { en: 'Confirm password', kh: 'បញ្ជាក់ពាក្យសម្ងាត់' },
  confirmPlaceholder: { en: 'Re-enter your password', kh: 'បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត' },
  agree1: { en: 'I agree to the ', kh: 'ខ្ញុំយល់ព្រមនឹង ' },
  terms: { en: 'Terms of Service', kh: 'លក្ខខណ្ឌសេវាកម្ម' },
  agree2: { en: ' and ', kh: ' និង ' },
  privacy: { en: 'Privacy Policy', kh: 'គោលការណ៍ឯកជនភាព' },
  submitBtn: { en: 'Create account', kh: 'បង្កើតគណនី' },
  passwordMismatch: { en: "Passwords don't match", kh: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា' },
  // Social signup
  socialOr: { en: 'or register with', kh: 'ឬចុះឈ្មោះជាមួយ' },
  socialGmail: { en: 'Sign up with Gmail', kh: 'ចុះឈ្មោះជាមួយ Gmail' },
  socialTelegram: { en: 'Sign up with Telegram', kh: 'ចុះឈ្មោះជាមួយ Telegram' },
  socialFacebook: { en: 'Sign up with Facebook', kh: 'ចុះឈ្មោះជាមួយ Facebook' },
  socialNote: { en: 'You\'ll be signed up instantly (an account is created the first time).', kh: 'អ្នកនឹងត្រូវបានចុះឈ្មោះភ្លាមៗ (គណនីនឹងត្រូវបានបង្កើតនៅពេលដំបូង)។' },
}

export const Register = () => {
  const { lang } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', name: '', email: '',
    phone: '', password: '', confirmPassword: '', agree: false,
  })
  const [error, setError] = useState('')
  const [socialBusy, setSocialBusy] = useState('') // provider being signed up

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert(TEXTS.passwordMismatch[lang])
      return
    }
    setError('')
    try {
      const res = await authAPI.register({
        username: form.username,
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  // One-click social signup: straight to the backend, no identifier prompt.
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
            {TEXTS.alreadyHave[lang]} <Link to="/login">{TEXTS.logIn[lang]}</Link>
          </p>

          {/* Manual registration form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">{TEXTS.usernameLabel[lang]}</label>
              <input id="username" name="username" type="text" placeholder={TEXTS.usernamePlaceholder[lang]} value={form.username} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="name">{TEXTS.nameLabel[lang]}</label>
              <input id="name" name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="email">{TEXTS.emailLabel[lang]} <span className="req">*</span></label>
              <input id="email" name="email" type="email" placeholder={TEXTS.emailPlaceholder[lang]} value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="phone">{TEXTS.phoneLabel[lang]}</label>
              <input id="phone" name="phone" type="tel" placeholder={TEXTS.phonePlaceholder[lang]} value={form.phone} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="password">{TEXTS.passwordLabel[lang]}</label>
              <input id="password" name="password" type="password" placeholder={TEXTS.passwordPlaceholder[lang]} value={form.password} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">{TEXTS.confirmLabel[lang]}</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder={TEXTS.confirmPlaceholder[lang]} value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} required />
              <span className="terms-text">
                {TEXTS.agree1[lang]}
                <Link to="/terms-privacy">{TEXTS.terms[lang]}</Link>
                {TEXTS.agree2[lang]}
                <Link to="/terms-privacy">{TEXTS.privacy[lang]}</Link>
              </span>
            </label>

            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-submit">{TEXTS.submitBtn[lang]}</button>
          </form>

          <div className="auth-divider"><span>{TEXTS.socialOr[lang]}</span></div>

          {/* One-click social signup — below the Create Account button */}
          <div className="social-auth">
            <button type="button" className="social-btn social-btn--gmail" onClick={() => handleSocial('gmail')} disabled={!!socialBusy}>
              {socialBusy === 'gmail' ? <SpinnerIcon /> : <GmailIcon />} <span>Sign up with <strong>Google</strong></span>
            </button>
            <button type="button" className="social-btn social-btn--telegram" onClick={() => handleSocial('telegram')} disabled={!!socialBusy}>
              {socialBusy === 'telegram' ? <SpinnerIcon /> : <TelegramIcon />} <span>Sign up with <strong>Telegram</strong></span>
            </button>
            <button type="button" className="social-btn social-btn--facebook" onClick={() => handleSocial('facebook')} disabled={!!socialBusy}>
              {socialBusy === 'facebook' ? <SpinnerIcon /> : <FacebookIcon />} <span>Sign up with <strong>Facebook</strong></span>
            </button>
          </div>
          <p className="auth-social-note">{TEXTS.socialNote[lang]}</p>
        </div>
      </div>
    </div>
  )
}

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

export default Register