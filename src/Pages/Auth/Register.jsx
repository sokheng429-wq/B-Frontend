import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../api/api'
import { useTelegramLogin } from '../../hooks/useTelegramLogin'
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
  dateOfBirthLabel: { en: 'Date of Birth', kh: 'ថ្ងៃខែឆ្នាំកំណើត' },
  genderLabel: { en: 'Gender', kh: 'ភេទ' },
  genderPlaceholder: { en: 'Select gender', kh: 'ជ្រើសរើសភេទ' },
  genderMale: { en: 'Male', kh: 'ប្រុស' },
  genderFemale: { en: 'Female', kh: 'ស្រី' },
  genderOther: { en: 'Other', kh: 'ផ្សេងទៀត' },
  genderPreferNot: { en: 'Prefer not to say', kh: 'មិនចង់បញ្ជាក់' },
  nationalityLabel: { en: 'Nationality', kh: 'សញ្ជាតិ' },
  nationalityPlaceholder: { en: 'Select nationality', kh: 'ជ្រើសរើសសញ្ជាតិ' },
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
  socialOr: { en: 'or register with', kh: 'ឬចុះឈ្មោះជាមួយ' },
  socialGmail: { en: 'Sign up with Gmail', kh: 'ចុះឈ្មោះជាមួយ Gmail' },
  socialTelegram: { en: 'Sign up with Telegram', kh: 'ចុះឈ្មោះជាមួយ Telegram' },
  socialFacebook: { en: 'Sign up with Facebook', kh: 'ចុះឈ្មោះជាមួយ Facebook' },
  socialNote: { en: 'You\'ll be signed up instantly (an account is created the first time).', kh: 'អ្នកនឹងត្រូវបានចុះឈ្មោះភ្លាមៗ (គណនីនឹងត្រូវបានបង្កើតនៅពេលដំបូង)។' },
}

// List of countries
const COUNTRIES = [
  'Cambodia', 'Thailand', 'Vietnam', 'Laos', 'Myanmar',
  'Singapore', 'Malaysia', 'Indonesia', 'Philippines',
  'United States', 'United Kingdom', 'China', 'Japan',
  'South Korea', 'India', 'Australia', 'Canada', 'France',
  'Germany', 'Spain', 'Italy', 'Netherlands', 'Other'
]

export const Register = () => {
  const { lang } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', name: '', email: '',
    phone: '', password: '', confirmPassword: '', agree: false,
    dateOfBirth: '', gender: '', nationality: ''
  })
  const [error, setError] = useState('')
  const [socialBusy, setSocialBusy] = useState('')

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
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        nationality: form.nationality || undefined
      })
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  // Telegram signup (keeps existing implementation)
  const handleTelegramAuth = async (telegramUser) => {
    setError('')
    setSocialBusy('telegram')
    try {
      const res = await authAPI.socialLogin('telegram', JSON.stringify(telegramUser))
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSocialBusy('')
    }
  }

  const { telegramButtonRef } = useTelegramLogin({
    onAuth: handleTelegramAuth,
    onError: (err) => setError(err.message),
  })

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
              <label htmlFor="dateOfBirth">{TEXTS.dateOfBirthLabel[lang]}</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="field">
              <label htmlFor="gender">{TEXTS.genderLabel[lang]}</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="">{TEXTS.genderPlaceholder[lang]}</option>
                <option value="Male">{TEXTS.genderMale[lang]}</option>
                <option value="Female">{TEXTS.genderFemale[lang]}</option>
                <option value="Other">{TEXTS.genderOther[lang]}</option>
                <option value="Prefer not to say">{TEXTS.genderPreferNot[lang]}</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="nationality">{TEXTS.nationalityLabel[lang]}</label>
              <select
                id="nationality"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="">{TEXTS.nationalityPlaceholder[lang]}</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
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

          {/* Social signup — simple anchor tag redirects */}
          <div className="social-auth">
            {/* Google Signup - Simple redirect to backend OAuth2 */}
            <a
              href="http://localhost:8081/oauth2/authorization/google"
              className="social-btn social-btn--gmail"
            >
              <GmailIcon />
              <span>Sign up with <strong>Google</strong></span>
            </a>

            {/* Facebook Signup - Simple redirect to backend OAuth2 */}
            <a
              href="http://localhost:8081/oauth2/authorization/facebook"
              className="social-btn social-btn--facebook"
            >
              <FacebookIcon />
              <span>Sign up with <strong>Facebook</strong></span>
            </a>

            {/* Telegram - Keep existing implementation */}
            <div className="social-btn social-btn--telegram social-btn--gis-wrap">
              {socialBusy === 'telegram' ? <SpinnerIcon /> : <TelegramIcon />}
              <span>Sign up with <strong>Telegram</strong></span>
              <div ref={telegramButtonRef} className="social-btn--gis-overlay" />
            </div>
          </div>
          <p className="auth-social-note">{TEXTS.socialNote[lang]}</p>
        </div>
      </div>
    </div>
  )
}

/* Brand logos for the social buttons (filled, full color) */
const GmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
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
