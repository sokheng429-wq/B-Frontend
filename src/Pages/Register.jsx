import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { Logo } from '../components/Logo'
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
  nameLabel: { en: 'Full name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
  emailLabel: { en: 'Email address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'you@example.com', kh: 'you@example.com' },
  phoneLabel: { en: 'Phone number', kh: 'លេខទូរស័ព្ទ' },
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
  divider: { en: 'or sign up with', kh: 'ឬចុះឈ្មោះជាមួយ' },
  passwordMismatch: { en: "Passwords don't match", kh: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា' },
}

export const Register = () => {
  const { lang } = useLanguage()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', agree: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert(TEXTS.passwordMismatch[lang])
      return
    }
    console.log('Register submit', form)
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

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">{TEXTS.nameLabel[lang]}</label>
              <input id="name" name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="email">{TEXTS.emailLabel[lang]}</label>
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
                <a href="/terms">{TEXTS.terms[lang]}</a>
                {TEXTS.agree2[lang]}
                <a href="/privacy">{TEXTS.privacy[lang]}</a>
              </span>
            </label>

            <button type="submit" className="btn-submit">{TEXTS.submitBtn[lang]}</button>
          </form>

          <div className="auth-divider">{TEXTS.divider[lang]}</div>

          <div className="social-auth-row">
            <button type="button" className="btn-social"><GoogleIcon /> Google</button>
            <button type="button" className="btn-social"><FacebookIcon /> Facebook</button>
          </div>
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

export default Register