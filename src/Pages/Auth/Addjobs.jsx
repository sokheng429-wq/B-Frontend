import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Addjobs.css'

const DEPARTMENTS = [
  { en: 'Engineering', kh: 'វិស្វកម្ម' },
  { en: 'Design', kh: 'រចនា' },
  { en: 'Marketing', kh: 'ទីផ្សារ' },
  { en: 'Sales', kh: 'ផ្នែកលក់' },
  { en: 'Customer Support', kh: 'គាំទ្រអតិថិជន' },
  { en: 'Operations', kh: 'ប្រតិបត្តិការ' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

const JOB_TYPES = [
  { en: 'Full-time', kh: 'ពេញម៉ោង' },
  { en: 'Part-time', kh: 'ក្រៅម៉ោង' },
  { en: 'Contract', kh: 'កិច្ចសន្យា' },
  { en: 'Internship', kh: 'កម្មសិក្សា' },
  { en: 'Remote', kh: 'ពីចម្ងាយ' },
]

const TEXTS = {
  heroTitle: { en: 'Post a Job Opening', kh: 'ប្រកាសការងារ' },
  heroSub: { en: 'Create new job listings — they will appear on the Career page for applicants.', kh: 'បង្កើតការងារថ្មី — ពួកគេនឹងបង្ហាញនៅទំព័រការងារសម្រាប់អ្នកដាក់ពាក្យ។' },
  formTitle: { en: 'Job Details', kh: 'ព័ត៌មានការងារ' },
  formSub: { en: 'Fill in the details below to post a new position.', kh: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីប្រកាសមុខតំណែងថ្មី។' },
  title: { en: 'Job Title', kh: 'ចំណងជើងការងារ' },
  titlePlaceholder: { en: 'e.g. Senior Frontend Developer', kh: 'ឧ. Senior Frontend Developer' },
  department: { en: 'Department', kh: 'ផ្នែក' },
  departmentPlaceholder: { en: 'Select department', kh: 'ជ្រើសរើសផ្នែក' },
  type: { en: 'Job Type', kh: 'ប្រភេទការងារ' },
  typePlaceholder: { en: 'Select type', kh: 'ជ្រើសរើសប្រភេទ' },
  location: { en: 'Location', kh: 'ទីតាំង' },
  locationPlaceholder: { en: 'e.g. Phnom Penh, Remote', kh: 'ឧ. ភ្នំពេញ, ពីចម្ងាយ' },
  salary: { en: 'Salary Range', kh: 'ប្រាក់ខែ' },
  salaryPlaceholder: { en: 'e.g. $500 - $800', kh: 'ឧ. ៥០០ - ៨០០ ដុល្លារ' },
  description: { en: 'Job Description', kh: 'ការពិពណ៌នាការងារ' },
  descriptionPlaceholder: { en: 'Describe the role, responsibilities, and what a day looks like...', kh: 'ពិពណ៌នាអំពីតួនាទី ទំនួលខុសត្រូវ និងថ្ងៃធ្វើការ...' },
  requirements: { en: 'Requirements', kh: 'តម្រូវការ' },
  requirementsPlaceholder: { en: 'List required skills, experience, or qualifications...', kh: 'រាយបញ្ជីជំនាញ បទពិសោធន៍ ឬគុណវុឌ្ឍិ...' },
  postBtn: { en: 'Post Job', kh: 'ប្រកាសការងារ' },
  updateBtn: { en: 'Update Job', kh: 'ធ្វើបច្ចុប្បន្នភាពការងារ' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  // Errors
  errTitle: { en: 'Job title is required', kh: 'ត្រូវការចំណងជើងការងារ' },
  errDepartment: { en: 'Please select a department', kh: 'សូមជ្រើសរើសផ្នែក' },
  errLocation: { en: 'Location is required', kh: 'ត្រូវការទីតាំង' },
  errType: { en: 'Please select a job type', kh: 'សូមជ្រើសរើសប្រភេទការងារ' },
  errDescription: { en: 'Description is required', kh: 'ត្រូវការការពិពណ៌នា' },
  // List
  listTitle: { en: 'Open Positions', kh: 'មុខតំណែងដែលកំពុងទទួល' },
  empty: { en: 'No jobs posted yet — fill the form to add your first listing.', kh: 'មិនទាន់មានការងារនៅឡើយ — បំពេញទម្រង់ដើម្បីបន្ថែម។' },
  viewCareer: { en: 'View Career Page', kh: 'មើលទំព័រការងារ' },
  posted: { en: 'Posted', kh: 'បានប្រកាស' },
  salaryLabel: { en: 'Salary:', kh: 'ប្រាក់ខែ:' },
  requirementsLabel: { en: 'Requirements:', kh: 'តម្រូវការ:' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  back: { en: '← Back to Dashboard', kh: '← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង' },
}

export const Addjobs = () => {
  const { lang } = useLanguage()
  const [form, setForm] = useState({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
  const [errors, setErrors] = useState({})
  const [jobs, setJobs] = useState([])
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = TEXTS.errTitle[lang]
    if (!form.department) e.department = TEXTS.errDepartment[lang]
    if (!form.location.trim()) e.location = TEXTS.errLocation[lang]
    if (!form.type) e.type = TEXTS.errType[lang]
    if (!form.description.trim()) e.description = TEXTS.errDescription[lang]
    return e
  }

  const startEdit = (job) => {
    setEditingId(job.id)
    setForm({ title: job.title, department: job.department, location: job.location, type: job.type, salary: job.salary || '', description: job.description, requirements: job.requirements || '' })
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      if (editingId) {
        setJobs((prev) => prev.map((j) =>
          j.id === editingId ? { ...j, ...form } : j
        ))
        cancelEdit()
      } else {
        setJobs((prev) => [...prev, {
          id: Date.now(),
          ...form,
          postedDate: new Date().toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        }])
        setForm({ title: '', department: '', location: '', type: '', salary: '', description: '', requirements: '' })
      }
    }
  }

  const removeJob = (id) => {
    if (editingId === id) cancelEdit()
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  const getDeptLabel = (deptEn) => DEPARTMENTS.find((d) => d.en === deptEn)?.[lang] || deptEn
  const getTypeLabel = (typeEn) => JOB_TYPES.find((t) => t.en === typeEn)?.[lang] || typeEn

  return (
    <div className="addj-page">
      {/* Hero */}
      <section className="addj-hero">
        <div className="addj-hero-bg" />
        <div className="addj-inner">
          <Link to="/admin" className="addj-back-link"><ChevronLeftIcon /> {TEXTS.back[lang]}</Link>
          <span className="addj-hero-icon">💼</span>
          <h1 className="addj-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="addj-hero-sub">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Content */}
      <section className="addj-body">
        <div className="addj-inner addj-layout">
          {/* Form */}
          <div className="addj-main">
            <div className="addj-form-card">
              <div className="addj-form-header">
                <h2 className="addj-form-title">{TEXTS.formTitle[lang]}</h2>
                <p className="addj-form-sub">{TEXTS.formSub[lang]}</p>
              </div>

              <form className="addj-form" onSubmit={handleSubmit} noValidate>
                <div className="addj-field">
                  <label htmlFor="title">{TEXTS.title[lang]} <span className="addj-req">{TEXTS.required[lang]}</span></label>
                  <input id="title" name="title" type="text" placeholder={TEXTS.titlePlaceholder[lang]} value={form.title} onChange={handleChange} className={errors.title ? 'addj-input--err' : ''} />
                  {errors.title && <span className="addj-err">{errors.title}</span>}
                </div>

                <div className="addj-row">
                  <div className="addj-field">
                    <label htmlFor="department">{TEXTS.department[lang]} <span className="addj-req">{TEXTS.required[lang]}</span></label>
                    <select id="department" name="department" value={form.department} onChange={handleChange} className={errors.department ? 'addj-input--err' : ''}>
                      <option value="">{TEXTS.departmentPlaceholder[lang]}</option>
                      {DEPARTMENTS.map((d) => <option key={d.en} value={d.en}>{d[lang]}</option>)}
                    </select>
                    {errors.department && <span className="addj-err">{errors.department}</span>}
                  </div>
                  <div className="addj-field">
                    <label htmlFor="type">{TEXTS.type[lang]} <span className="addj-req">{TEXTS.required[lang]}</span></label>
                    <select id="type" name="type" value={form.type} onChange={handleChange} className={errors.type ? 'addj-input--err' : ''}>
                      <option value="">{TEXTS.typePlaceholder[lang]}</option>
                      {JOB_TYPES.map((t) => <option key={t.en} value={t.en}>{t[lang]}</option>)}
                    </select>
                    {errors.type && <span className="addj-err">{errors.type}</span>}
                  </div>
                </div>

                <div className="addj-row">
                  <div className="addj-field">
                    <label htmlFor="location">{TEXTS.location[lang]} <span className="addj-req">{TEXTS.required[lang]}</span></label>
                    <input id="location" name="location" type="text" placeholder={TEXTS.locationPlaceholder[lang]} value={form.location} onChange={handleChange} className={errors.location ? 'addj-input--err' : ''} />
                    {errors.location && <span className="addj-err">{errors.location}</span>}
                  </div>
                  <div className="addj-field">
                    <label htmlFor="salary">{TEXTS.salary[lang]} <span className="addj-opt">{TEXTS.optional[lang]}</span></label>
                    <input id="salary" name="salary" type="text" placeholder={TEXTS.salaryPlaceholder[lang]} value={form.salary} onChange={handleChange} />
                  </div>
                </div>

                <div className="addj-field">
                  <label htmlFor="description">{TEXTS.description[lang]} <span className="addj-req">{TEXTS.required[lang]}</span></label>
                  <textarea id="description" name="description" rows="4" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.description} onChange={handleChange} className={errors.description ? 'addj-input--err' : ''} />
                  {errors.description && <span className="addj-err">{errors.description}</span>}
                </div>

                <div className="addj-field">
                  <label htmlFor="requirements">{TEXTS.requirements[lang]} <span className="addj-opt">{TEXTS.optional[lang]}</span></label>
                  <textarea id="requirements" name="requirements" rows="3" placeholder={TEXTS.requirementsPlaceholder[lang]} value={form.requirements} onChange={handleChange} />
                </div>

                <button type="submit" className="addj-submit-btn">
                  {editingId ? <CheckIcon /> : <SendIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.postBtn[lang]}
                </button>
                {editingId && (
                  <button type="button" className="addj-cancel-btn" onClick={cancelEdit}>
                    <XIcon /> {TEXTS.cancelBtn[lang]}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar list */}
          <aside className="addj-sidebar">
            <div className="addj-list-card">
              <div className="addj-list-header">
                <h3 className="addj-list-title">{TEXTS.listTitle[lang]}</h3>
                <span className="addj-list-count">{jobs.length}</span>
              </div>

              {/* Action Shortcuts */}
              <div className="adp-shortcuts">
                <span className="adp-shortcuts-label">{lang === 'en' ? 'Shortcuts:' : 'ផ្លូវកាត់:'}</span>
                <button type="button" className="adp-shortcut-btn" onClick={cancelEdit} title="Add New Job">
                  ➕ {TEXTS.postBtn[lang]}
                </button>
                {editingId && (
                  <>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-edit" onClick={() => {}} title="Editing mode active">
                      ✏️ {TEXTS.updateBtn[lang]}
                    </button>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-delete" onClick={() => removeJob(editingId)} title="Delete editing job">
                      🗑️ {TEXTS.remove[lang]}
                    </button>
                  </>
                )}
              </div>

              {jobs.length === 0 ? (
                <div className="addj-empty">
                  <span className="addj-empty-icon">📋</span>
                  <p>{TEXTS.empty[lang]}</p>
                </div>
              ) : (
                <div className="addj-list">
                  {jobs.map((job) => (
                    <div key={job.id} className="addj-card">
                      <div className="addj-card-top">
                        <h4 className="addj-card-title">{job.title}</h4>
                        <div className="addj-card-actions">
                          <button className="addj-edit-btn" onClick={() => startEdit(job)} aria-label={TEXTS.edit[lang]}>
                            <EditIcon />
                          </button>
                          <button className="addj-remove-btn" onClick={() => removeJob(job.id)} aria-label={TEXTS.remove[lang]}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                      <div className="addj-card-meta">
                        <span className="addj-badge addj-badge--dept">{getDeptLabel(job.department)}</span>
                        <span className="addj-badge addj-badge--type">{getTypeLabel(job.type)}</span>
                        <span className="addj-badge addj-badge--loc"><PinIcon /> {job.location}</span>
                      </div>
                      {job.salary && <p className="addj-card-salary"><strong>{TEXTS.salaryLabel[lang]}</strong> {job.salary}</p>}
                      <p className="addj-card-desc">{job.description}</p>
                      {job.requirements && (
                        <details className="addj-card-req-details">
                          <summary>{TEXTS.requirementsLabel[lang]}</summary>
                          <p>{job.requirements}</p>
                        </details>
                      )}
                      <p className="addj-card-posted">🕐 {TEXTS.posted[lang]} {job.postedDate}</p>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/career" className="addj-view-link">
                <EyeIcon /> {TEXTS.viewCareer[lang]}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

export default Addjobs
