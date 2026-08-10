import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from '../components/Logo'
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
  emailLabel: { en: 'Email address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'you@example.com', kh: 'you@example.com' },
  passwordLabel: { en: 'Password', kh: 'ពាក្យសម្ងាត់' },
  passwordPlaceholder: { en: 'Enter your password', kh: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក' },
  rememberMe: { en: 'Remember me', kh: 'ចងចាំខ្ញុំ' },
  forgotPassword: { en: 'Forgot password?', kh: 'ភ្លេចពាក្យសម្ងាត់?' },
  loginBtn: { en: 'Log in', kh: 'ចូលគណនី' },
  divider: { en: 'or continue with', kh: 'ឬបន្តជាមួយ' },
  footerNote: { en: "By continuing, you agree to B'Groceries' Terms of Service and Privacy Policy.", kh: 'ដោយបន្ត អ្នកយល់ព្រមនឹងលក្ខខណ្ឌសេវាកម្ម និងគោលការណ៍ឯកជនភាពរបស់ B\'Groceries។' },
}

export const Login = () => {
  const { lang } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '', remember: false })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login submit', form)
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

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">{TEXTS.emailLabel[lang]}</label>
              <input
                id="email" name="email" type="email"
                placeholder={TEXTS.emailPlaceholder[lang]}
                value={form.email} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label htmlFor="password">{TEXTS.passwordLabel[lang]}</label>
              <input
                id="password" name="password" type="password"
                placeholder={TEXTS.passwordPlaceholder[lang]}
                value={form.password} onChange={handleChange} required
              />
            </div>

            <div className="field-inline">
              <label className="checkbox-label">
                <input
                  type="checkbox" name="remember"
                  checked={form.remember} onChange={handleChange}
                />
                {TEXTS.rememberMe[lang]}
              </label>
              <Link to="/forgot-password" className="link-muted">{TEXTS.forgotPassword[lang]}</Link>
            </div>

            <button type="submit" className="btn-submit">{TEXTS.loginBtn[lang]}</button>
          </form>

          <div className="auth-divider">{TEXTS.divider[lang]}</div>

          <div className="social-auth-row">
            <button type="button" className="btn-social"><GoogleIcon /> Google</button>
            <button type="button" className="btn-social"><FacebookIcon /> Facebook</button>
          </div>

          <p className="auth-footer-note">{TEXTS.footerNote[lang]}</p>
        </div>
      </div>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4A11.7 11.7 0 0 0 23.5 12.3Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1 8-2.9l-4-3c-1.1.8-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4.1v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8Z" />
    <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.6 1.7l3.4-3.4A11.9 11.9 0 0 0 1.3 6.6l4.1 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.47 1.47-3.84 3.72-3.84 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.22 0-1.6.76-1.6 1.53V12h2.72l-.44 2.89h-2.28v6.98A10 10 0 0 0 22 12z" />
  </svg>
)

export default Login