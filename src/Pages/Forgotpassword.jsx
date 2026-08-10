import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from '../components/Logo'
import './Forgotpassword.css'

const TEXTS = {
  eyebrow: { en: 'Account recovery', kh: 'ការស្តារគណនីឡើងវិញ' },
  title1: { en: 'Locked out? ', kh: 'ជាប់គាំង? ' },
  titleHighlight: { en: "We'll get you back in", kh: 'យើងនឹងជួយអ្នកចូលវិញ' },
  subtitle: { en: "Enter the email on your account and we'll send you a link to reset your password.", kh: 'បញ្ចូលអ៊ីមែលនៅលើគណនីរបស់អ្នក ហើយយើងនឹងផ្ញើតំណដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ។' },
  heading: { en: 'Forgot your password?', kh: 'ភ្លេចពាក្យសម្ងាត់?' },
  backToLogin: { en: 'back to login', kh: 'ត្រលប់ទៅចូលគណនី' },
  noWorries: { en: 'No worries — ', kh: 'កុំបារម្ភ — ' },
  emailLabel: { en: 'Email address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'you@example.com', kh: 'you@example.com' },
  sendBtn: { en: 'Send reset link', kh: 'ផ្ញើតំណកំណត់ឡើងវិញ' },
  checkEmail: { en: 'Check your email', kh: 'ពិនិត្យអ៊ីមែលរបស់អ្នក' },
  sentText1: { en: "We've sent a password reset link to ", kh: 'យើងបានផ្ញើតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញទៅកាន់ ' },
  sentText2: { en: ". It may take a minute to arrive — don't forget to check spam.", kh: '។ វាអាចចំណាយពេលបន្តិច — កុំភ្លេចពិនិត្យសារឥតបានការ។' },
  differentEmail: { en: 'Use a different email', kh: 'ប្រើអ៊ីមែលផ្សេង' },
  backToLoginBottom: { en: 'Back to login', kh: 'ត្រលប់ទៅចូលគណនី' },
}

export const ForgotPassword = () => {
  const { lang } = useLanguage()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Reset requested for', email)
    setSent(true)
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
        </div>

        <div className="auth-panel-blob" />
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo">
            <Logo />
          </div>

          {!sent ? (
            <>
              <h1 className="auth-title">{TEXTS.heading[lang]}</h1>
              <p className="auth-subtitle">
                {TEXTS.noWorries[lang]}<Link to="/login">{TEXTS.backToLogin[lang]}</Link>
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="email">{TEXTS.emailLabel[lang]}</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder={TEXTS.emailPlaceholder[lang]}
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                  />
                </div>
                <button type="submit" className="btn-submit">{TEXTS.sendBtn[lang]}</button>
              </form>
            </>
          ) : (
            <div className="reset-sent">
              <div className="reset-sent-icon">
                <MailCheckIcon />
              </div>
              <h1 className="auth-title">{TEXTS.checkEmail[lang]}</h1>
              <p className="auth-subtitle reset-sent-text">
                {TEXTS.sentText1[lang]}<strong>{email}</strong>{TEXTS.sentText2[lang]}
              </p>

              <button type="button" className="btn-submit" onClick={() => setSent(false)}>
                {TEXTS.differentEmail[lang]}
              </button>

              <p className="auth-footer-note">
                <Link to="/login" className="link-muted">{TEXTS.backToLoginBottom[lang]}</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MailCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
    <path d="m16 16 2 2 4-4" />
  </svg>
)

export default ForgotPassword