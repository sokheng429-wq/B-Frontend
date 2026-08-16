import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Contact.css'

const INFO = [
  { icon: '📍', label: { en: 'Our Address', kh: 'អាសយដ្ឋាន' }, value: { en: 'Street 271, Sangkat Toul Tompoung, Phnom Penh', kh: 'ផ្លូវ២៧១, សង្កាត់ទួលទំពូង, ភ្នំពេញ' }, bg: '#f0f7e8' },
  { icon: '📞', label: { en: 'Phone', kh: 'ទូរស័ព្ទ' }, value: { en: '+855 11 628 818', kh: '+855 11 628 818' }, bg: '#fff8ed' },
  { icon: '✉️', label: { en: 'Email', kh: 'អ៊ីមែល' }, value: { en: 'bgroceriescompany@gmail.com', kh: 'bgroceriescompany@gmail.com' }, bg: '#f0f2f4' },
  { icon: '🕐', label: { en: 'Business Hours', kh: 'ម៉ោងធ្វើការ' }, value: { en: 'Mon–Sat 8AM–9PM · Sun 9AM–6PM', kh: 'ច័ន្ទ-សៅរ៍ ៨ព្រឹក-៩យប់ · អាទិត្យ ៩ព្រឹក-៦ល្ងាច' }, bg: '#eef6ff' },
]

const SOCIALS = [
  { icon: '📘', label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61587630909215' },
  { icon: '📷', label: 'Instagram', href: 'https://instagram.com' },
  { icon: '💬', label: 'Telegram', href: 'https://t.me' },
]

const FAQ_QUICK = [
  { en: 'How does delivery work?', kh: 'តើការដឹកជញ្ជូនដំណើរការដូចម្តេច?' },
  { en: 'How do I return an item?', kh: 'តើខ្ញុំអាចប្រគល់ទំនិញវិញដោយរបៀបណា?' },
  { en: 'Where do you deliver?', kh: 'តើអ្នកដឹកជញ្ជូនទៅកន្លែងណាខ្លះ?' },
  { en: 'What payment methods do you accept?', kh: 'តើអ្នកទទួលយកវិធីបង់ប្រាក់អ្វីខ្លះ?' },
  { en: 'How do I become a member?', kh: 'តើខ្ញុំអាចក្លាយជាសមាជិកដោយរបៀបណា?' },
]

const TEXTS = {
  heroTitle: { en: 'Get in Touch', kh: 'ទំនាក់ទំនងយើង' },
  heroSub: { en: "We're here to help — reach out anytime and we'll get back to you within 24 hours.", kh: 'យើងនៅទីនេះដើម្បីជួយ — ទំនាក់ទំនងមកយើងគ្រប់ពេល ហើយយើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។' },
  formTitle: { en: 'Send us a message', kh: 'ផ្ញើសារមកយើង' },
  name: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  email: { en: 'Email Address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  phone: { en: 'Phone Number', kh: 'លេខទូរស័ព្ទ' },
  subject: { en: 'Subject', kh: 'ប្រធានបទ' },
  message: { en: 'Your Message', kh: 'សាររបស់អ្នក' },
  send: { en: 'Send Message', kh: 'ផ្ញើសារ' },
  sending: { en: 'Sending...', kh: 'កំពុងផ្ញើ...' },
  sent: { en: ' Sent! We\'ll reply within 24hrs.', kh: ' បានផ្ញើ! យើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ម៉ោង។' },
  quickLinks: { en: 'Quick Answers', kh: 'ចម្លើយរហ័ស' },
  findUs: { en: 'Find Us on the Map', kh: 'ស្វែងរកយើងនៅលើផែនទី' },
  connectWithUs: { en: 'Connect With Us', kh: 'តាមដានយើង' },
}

const SUBJECTS = [
  { en: 'General Inquiry', kh: 'សំណួរទូទៅ' },
  { en: 'Order Issue', kh: 'បញ្ហាការបញ្ជាទិញ' },
  { en: 'Delivery Question', kh: 'សំណួរអំពីការដឹកជញ្ជូន' },
  { en: 'Partnership', kh: 'ភាពជាដៃគូ' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

export const Contact = () => {
  const { lang } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    }, 1200)
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-hero-inner">
          <span className="contact-hero-emoji">💬</span>
          <h1 className="contact-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="contact-hero-sub">{TEXTS.heroSub[lang]}</p>

          <div className="contact-hero-cards">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} className="contact-social-chip" target="_blank" rel="noopener noreferrer">
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="contact-main">
        <div className="contact-main-inner">
          {/* Left column */}
          <div className="contact-left-col">
            {INFO.map((item) => (
              <div key={item.label.en} className="contact-info-card" style={{ '--card-bg': item.bg }}>
                <span className="contact-info-icon">{item.icon}</span>
                <div>
                  <p className="contact-info-label">{item.label[lang]}</p>
                  <p className="contact-info-value">{item.value[lang]}</p>
                </div>
              </div>
            ))}

            <div className="contact-faq">
              <h3 className="contact-faq-title">{TEXTS.quickLinks[lang]}</h3>
              <div className="contact-faq-list">
                {FAQ_QUICK.map((q) => (
                  <Link key={q.en} to="/faq" className="contact-faq-link">
                    {q[lang]}
                    <ArrowIcon />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h2 className="contact-form-title">{TEXTS.formTitle[lang]}</h2>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="cf-row">
                  <div className="cf-field">
                    <label htmlFor="name">{TEXTS.name[lang]}</label>
                    <input id="name" name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="cf-field">
                    <label htmlFor="email">{TEXTS.email[lang]}</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="cf-row">
                  <div className="cf-field">
                    <label htmlFor="phone">{TEXTS.phone[lang]}</label>
                    <input id="phone" name="phone" type="tel" placeholder="012 345 678" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="cf-field">
                    <label htmlFor="subject">{TEXTS.subject[lang]}</label>
                    <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">--</option>
                      {SUBJECTS.map((s) => (
                        <option key={s.en} value={s.en}>{s[lang]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="cf-field">
                  <label htmlFor="message">{TEXTS.message[lang]}</label>
                  <textarea id="message" name="message" rows="5" placeholder={lang === 'en' ? 'Tell us how we can help...' : 'ប្រាប់យើងពីរបៀបដែលយើងអាចជួយ...'} value={form.message} onChange={handleChange} required />
                </div>

                <button type="submit" className={`cf-submit ${status === 'sent' ? 'cf-submit--success' : ''}`} disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><SpinnerIcon /> {TEXTS.sending[lang]}</>
                  ) : status === 'sent' ? (
                    <><CheckCircleIcon /> {TEXTS.sent[lang]}</>
                  ) : (
                    <><SendIcon /> {TEXTS.send[lang]}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="contact-map-section">
        <div className="contact-map-inner">
          <div className="contact-map-header">
            <h2 className="contact-map-title">{TEXTS.findUs[lang]}</h2>
          </div>
          <div className="contact-map-wrap">
            <iframe
              title="B'Groceries location"
              className="contact-map"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3909.070179208294!2d104.9529718!3d11.5468235!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310957fce50292d5%3A0x536c4e59191c151e!2sB'%20Groceries%20Hyperstore!5e0!3m2!1sen!2skh!4v1786349941372!5m2!1sen!2skh"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spinner">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default Contact