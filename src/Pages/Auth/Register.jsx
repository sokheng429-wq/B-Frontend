import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
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
  nameLabel: { en: 'Full name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
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
  passwordMismatch: { en: "Passwords don't match", kh: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា' },
}

export const Register = () => {
  const { lang } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', phone: '', password: '', confirmPassword: '', agree: false,
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
    login({ name: form.name, phone: form.phone })
    navigate('/profile')
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

            <button type="submit" className="btn-submit">{TEXTS.submitBtn[lang]}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Register