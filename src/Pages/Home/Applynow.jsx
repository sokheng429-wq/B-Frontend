import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Applynow.css'

const POSITIONS = [
  { en: 'Frontend Developer', kh: 'អ្នកអភិវឌ្ឍ Frontend' },
  { en: 'Backend Developer', kh: 'អ្នកអភិវឌ្ឍ Backend' },
  { en: 'UI/UX Designer', kh: 'អ្នករចនា UI/UX' },
  { en: 'Marketing Specialist', kh: 'អ្នកជំនាញទីផ្សារ' },
  { en: 'Customer Support', kh: 'ភ្នាក់ងារគាំទ្រអតិថិជន' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

const PERKS = [
  { icon: '💰', title: { en: 'Competitive Pay', kh: 'ប្រាក់ខែប្រកួតប្រជែង' } },
  { icon: '🏥', title: { en: 'Health Coverage', kh: 'ធានារ៉ាប់រងសុខភាព' } },
  { icon: '📈', title: { en: 'Career Growth', kh: 'រីកចម្រើនអាជីព' } },
  { icon: '⏰', title: { en: 'Flexible Hours', kh: 'ម៉ោងបត់បែន' } },
  { icon: '🎓', title: { en: 'Learning Fund', kh: 'ថវិកាសិក្សា' } },
  { icon: '🎉', title: { en: 'Team Events', kh: 'ព្រឹត្តិការណ៍ក្រុម' } },
]

const TEXTS = {
  heroTitle: { en: 'Apply to B\'Groceries', kh: 'ដាក់ពាក្យនៅ B\'Groceries' },
  heroSub: { en: 'Take the next step in your career — join a team that moves fast and delivers fresh.', kh: 'ឈានជំហានបន្ទាប់ក្នុងអាជីពរបស់អ្នក — ចូលរួមក្រុមដែលធ្វើការលឿន និងផ្តល់ភាពស្រស់ស្រាយ។' },
  formTitle: { en: 'Your Details', kh: 'ព័ត៌មានរបស់អ្នក' },
  formSub: { en: 'Fill in the form below and we will get back to you within 48 hours.', kh: 'បំពេញទម្រង់ខាងក្រោម ហើយយើងនឹងឆ្លើយតបក្នុងរយៈពេល ៤៨ ម៉ោង។' },
  fullName: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
  email: { en: 'Email Address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'you@example.com', kh: 'you@example.com' },
  phone: { en: 'Phone Number', kh: 'លេខទូរស័ព្ទ' },
  phonePlaceholder: { en: '012 345 678', kh: '០១២ ៣៤៥ ៦៧៨' },
  position: { en: 'Position', kh: 'មុខតំណែង' },
  positionPlaceholder: { en: 'Select a position', kh: 'ជ្រើសរើសមុខតំណែង' },
  linkedin: { en: 'LinkedIn / Portfolio URL', kh: 'LinkedIn / Portfolio URL' },
  linkedinPlaceholder: { en: 'https://', kh: 'https://' },
  coverLetter: { en: 'Cover Letter', kh: 'សំបុត្រណែនាំខ្លួន' },
  coverLetterPlaceholder: { en: 'Tell us why you would be a great fit...', kh: 'ប្រាប់យើងថាហេតុអ្វីអ្នកសាកសម...' },
  resumeLabel: { en: 'Resume / CV (PDF, DOC)', kh: 'Resume / CV (PDF, DOC)' },
  resumeHint: { en: 'Drag and drop your file here, or click to browse', kh: 'អូសនិងទម្លាក់ឯកសារនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  resumeSelected: { en: 'Selected:', kh: 'បានជ្រើសរើស:' },
  submit: { en: 'Submit Application', kh: 'ដាក់ស្នើពាក្យ' },
  telegramApply: { en: 'Apply With Telegram', kh: 'ដាក់ពាក្យតាម Telegram' },
  telegramHint: { en: 'Fast-track your application — send your resume directly to our HR team on Telegram.', kh: 'ពន្លឿនពាក្យរបស់អ្នក — ផ្ញើ Resume ដោយផ្ទាល់ទៅក្រុម HR របស់យើងតាម Telegram ។' },
  or: { en: 'or', kh: 'ឬ' },
  perryTitle: { en: 'Why Join Us', kh: 'ហេតុអ្វីចូលរួម' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  // Errors
  errName: { en: 'Full name is required', kh: 'ត្រូវការឈ្មោះពេញ' },
  errEmail: { en: 'Enter a valid email', kh: 'បញ្ចូលអ៊ីមែលត្រឹមត្រូវ' },
  errPhone: { en: 'Phone number is required', kh: 'ត្រូវការលេខទូរស័ព្ទ' },
  errPosition: { en: 'Please select a position', kh: 'សូមជ្រើសរើសមុខតំណែង' },
  errResume: { en: 'Resume is required', kh: 'ត្រូវការ Resume' },
  // Success
  successTitle: { en: 'Application Submitted! 🎉', kh: 'បានដាក់ស្នើពាក្យ! 🎉' },
  successText1: { en: 'Thank you for applying, ', kh: 'សូមអរគុណសម្រាប់ការដាក់ពាក្យ ' },
  successText2: { en: 'We have received your application and our team will review it within 48 hours.', kh: 'យើងបានទទួលពាក្យរបស់អ្នក ហើយក្រុមការងារនឹងពិនិត្យក្នុងរយៈពេល ៤៨ ម៉ោង។' },
  backToCareer: { en: 'Back to Career Page', kh: 'ត្រលប់ទៅទំព័រការងារ' },
}

export const ApplyNow = () => {
  const { lang } = useLanguage()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', position: '', linkedin: '', coverLetter: '' })
  const [resume, setResume] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFile = (file) => {
    setResume(file || null)
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = TEXTS.errName[lang]
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = TEXTS.errEmail[lang]
    if (!form.phone.trim()) e.phone = TEXTS.errPhone[lang]
    if (!form.position) e.position = TEXTS.errPosition[lang]
    if (!resume) e.resume = TEXTS.errResume[lang]
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      console.log('Application submitted:', { ...form, resume })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="apply-page">
        <div className="apply-success">
          <div className="apply-success-icon">✅</div>
          <h1 className="apply-success-title">{TEXTS.successTitle[lang]}</h1>
          <p className="apply-success-text">
            {TEXTS.successText1[lang]}<strong>{form.fullName.split(' ')[0]}</strong>. {TEXTS.successText2[lang]}
          </p>
          <Link to="/career" className="apply-success-link">
            <ArrowLeft /> {TEXTS.backToCareer[lang]}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="apply-page">
      {/* Hero */}
      <section className="apply-hero">
        <div className="apply-hero-bg" />
        <div className="apply-inner">
          <span className="apply-hero-icon">📋</span>
          <h1 className="apply-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="apply-hero-sub">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Form body */}
      <section className="apply-body">
        <div className="apply-inner apply-layout">
          {/* Main form */}
          <div className="apply-main">
            <div className="apply-form-card">
              <div className="apply-form-header">
                <h2 className="apply-form-title">{TEXTS.formTitle[lang]}</h2>
                <p className="apply-form-sub">{TEXTS.formSub[lang]}</p>
              </div>

              <form className="apply-form" onSubmit={handleSubmit} noValidate>
                <div className="apply-row">
                  <div className="apply-field">
                    <label htmlFor="fullName">{TEXTS.fullName[lang]} <span className="apply-required">{TEXTS.required[lang]}</span></label>
                    <input id="fullName" name="fullName" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.fullName} onChange={handleChange} className={errors.fullName ? 'apply-input--err' : ''} />
                    {errors.fullName && <span className="apply-err">{errors.fullName}</span>}
                  </div>
                  <div className="apply-field">
                    <label htmlFor="email">{TEXTS.email[lang]} <span className="apply-required">{TEXTS.required[lang]}</span></label>
                    <input id="email" name="email" type="email" placeholder={TEXTS.emailPlaceholder[lang]} value={form.email} onChange={handleChange} className={errors.email ? 'apply-input--err' : ''} />
                    {errors.email && <span className="apply-err">{errors.email}</span>}
                  </div>
                </div>

                <div className="apply-row">
                  <div className="apply-field">
                    <label htmlFor="phone">{TEXTS.phone[lang]} <span className="apply-required">{TEXTS.required[lang]}</span></label>
                    <input id="phone" name="phone" type="tel" placeholder={TEXTS.phonePlaceholder[lang]} value={form.phone} onChange={handleChange} className={errors.phone ? 'apply-input--err' : ''} />
                    {errors.phone && <span className="apply-err">{errors.phone}</span>}
                  </div>
                  <div className="apply-field">
                    <label htmlFor="position">{TEXTS.position[lang]} <span className="apply-required">{TEXTS.required[lang]}</span></label>
                    <select id="position" name="position" value={form.position} onChange={handleChange} className={errors.position ? 'apply-input--err' : ''}>
                      <option value="">{TEXTS.positionPlaceholder[lang]}</option>
                      {POSITIONS.map((p) => (
                        <option key={p.en} value={p.en}>{p[lang]}</option>
                      ))}
                    </select>
                    {errors.position && <span className="apply-err">{errors.position}</span>}
                  </div>
                </div>

                <div className="apply-field">
                  <label htmlFor="linkedin">{TEXTS.linkedin[lang]} <span className="apply-optional">{lang === 'en' ? 'Optional' : 'មិនចាំបាច់'}</span></label>
                  <input id="linkedin" name="linkedin" type="url" placeholder={TEXTS.linkedinPlaceholder[lang]} value={form.linkedin} onChange={handleChange} />
                </div>

                <div className="apply-field">
                  <label>{TEXTS.resumeLabel[lang]} <span className="apply-required">{TEXTS.required[lang]}</span></label>
                  <div
                    className={`apply-dropzone ${dragOver ? 'apply-dropzone--over' : ''} ${errors.resume ? 'apply-dropzone--err' : ''} ${resume ? 'apply-dropzone--has' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFile(e.target.files[0])} className="apply-file-hidden" />
                    {resume ? (
                      <span className="apply-file-name"><FileIcon /> {TEXTS.resumeSelected[lang]} <strong>{resume.name}</strong></span>
                    ) : (
                      <span className="apply-dropzone-hint"><UploadIcon /> {TEXTS.resumeHint[lang]}</span>
                    )}
                  </div>
                  {errors.resume && <span className="apply-err">{errors.resume}</span>}
                </div>

                <div className="apply-field">
                  <label htmlFor="coverLetter">{TEXTS.coverLetter[lang]} <span className="apply-optional">{lang === 'en' ? 'Optional' : 'មិនចាំបាច់'}</span></label>
                  <textarea id="coverLetter" name="coverLetter" rows="5" placeholder={TEXTS.coverLetterPlaceholder[lang]} value={form.coverLetter} onChange={handleChange} />
                </div>

                <button type="submit" className="apply-submit-btn">
                  <SendIcon /> {TEXTS.submit[lang]}
                </button>

                <div className="apply-divider">
                  <span>{TEXTS.or[lang]}</span>
                </div>

                <a
                  href="https://t.me/sey7777777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-telegram-btn"
                >
                  <TelegramIcon /> {TEXTS.telegramApply[lang]}
                </a>
                <p className="apply-telegram-hint">{TEXTS.telegramHint[lang]}</p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="apply-sidebar">
            <div className="apply-perks-card">
              <h3 className="apply-perks-title">{TEXTS.perryTitle[lang]}</h3>
              <div className="apply-perks-list">
                {PERKS.map((p) => (
                  <div key={p.title.en} className="apply-perk-item">
                    <span className="apply-perk-icon">{p.icon}</span>
                    <span className="apply-perk-label">{p.title[lang]}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.5 3.5 2.7 10.9c-1 .4-1 1.6.1 1.9l4.6 1.5 1.8 5.7c.2.7 1.1.9 1.6.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7l3-16.4c.2-.9-.7-1.6-1.6-1.3ZM8.6 13.6l8.5-6.8c.2-.2.5.1.3.3l-7 7.4-.3 3.6-1.5-4.5Z" />
  </svg>
)

export default ApplyNow
