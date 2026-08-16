import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Addmember.css'

const ROLES = [
  { en: 'Founder', kh: 'ស្ថាបនិក' },
  { en: 'Manager', kh: 'អ្នកគ្រប់គ្រង' },
  { en: 'Developer', kh: 'អ្នកអភិវឌ្ឍ' },
  { en: 'Designer', kh: 'អ្នករចនា' },
  { en: 'Marketing', kh: 'ទីផ្សារ' },
  { en: 'Support', kh: 'គាំទ្រ' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

const TEXTS = {
  heroTitle: { en: 'Add Team Member', kh: 'បន្ថែមសមាជិកក្រុម' },
  heroSub: { en: 'Build your dream team — add members and they will appear on the Member page.', kh: 'កសាងក្រុមការងារដ៏អស្ចារ្យ — បន្ថែមសមាជិក ហើយពួកគេនឹងបង្ហាញនៅទំព័រសមាជិក។' },
  formTitle: { en: 'Member Details', kh: 'ព័ត៌មានសមាជិក' },
  formSub: { en: 'Fill in the information below to add a new team member.', kh: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីបន្ថែមសមាជិកថ្មី។' },
  name: { en: 'Full Name', kh: 'ឈ្មោះពេញ' },
  namePlaceholder: { en: 'Your Name', kh: 'ឈ្មោះរបស់អ្នក' },
  role: { en: 'Role', kh: 'តួនាទី' },
  rolePlaceholder: { en: 'Select a role', kh: 'ជ្រើសរើសតួនាទី' },
  email: { en: 'Email Address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
  emailPlaceholder: { en: 'you@example.com', kh: 'you@example.com' },
  photo: { en: 'Photo', kh: 'រូបថត' },
  photoHint: { en: 'Drop an image here, or click to browse', kh: 'ទម្លាក់រូបថតនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  photoSelected: { en: 'Photo selected', kh: 'បានជ្រើសរើសរូបថត' },
  bio: { en: 'Short Bio', kh: 'ប្រវត្តិខ្លី' },
  bioPlaceholder: { en: 'A short description about this member...', kh: 'ការពិពណ៌នាខ្លីអំពីសមាជិកនេះ...' },
  addBtn: { en: 'Add Member', kh: 'បន្ថែមសមាជិក' },
  updateBtn: { en: 'Update Member', kh: 'ធ្វើបច្ចុប្បន្នភាពសមាជិក' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  // Errors
  errName: { en: 'Name is required', kh: 'ត្រូវការឈ្មោះ' },
  errRole: { en: 'Please select a role', kh: 'សូមជ្រើសរើសតួនាទី' },
  errEmail: { en: 'Enter a valid email', kh: 'បញ្ចូលអ៊ីមែលត្រឹមត្រូវ' },
  // List
  teamTitle: { en: 'Team Members', kh: 'សមាជិកក្រុម' },
  empty: { en: 'No members added yet — fill out the form to add your first team member.', kh: 'មិនទាន់មានសមាជិកនៅឡើយ — បំពេញទម្រង់ដើម្បីបន្ថែមសមាជិកដំបូង។' },
  viewTeam: { en: 'View Team Page', kh: 'មើលទំព័រក្រុម' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  back: { en: '← Back to Dashboard', kh: '← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង' },
}

export const AddMember = () => {
  const { lang } = useLanguage()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ name: '', role: '', email: '', bio: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [members, setMembers] = useState([])
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePhoto = (file) => {
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: '' }))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handlePhoto(file)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = TEXTS.errName[lang]
    if (!form.role) e.role = TEXTS.errRole[lang]
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = TEXTS.errEmail[lang]
    return e
  }

  const startEdit = (member) => {
    setEditingId(member.id)
    setForm({ name: member.name, role: member.role, email: member.email, bio: member.bio || '' })
    setPhotoPreview(member.photo)
    setPhoto(null)
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', role: '', email: '', bio: '' })
    setPhoto(null)
    setPhotoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      if (editingId) {
        setMembers((prev) => prev.map((m) =>
          m.id === editingId ? { ...m, ...form, photo: photoPreview || m.photo } : m
        ))
        cancelEdit()
      } else {
        setMembers((prev) => [...prev, { id: Date.now(), ...form, photo: photoPreview }])
        setForm({ name: '', role: '', email: '', bio: '' })
        setPhoto(null)
        setPhotoPreview(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    }
  }

  const removeMember = (id) => {
    if (editingId === id) cancelEdit()
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="addm-page">
      {/* Hero */}
      <section className="addm-hero">
        <div className="addm-hero-bg" />
        <div className="addm-inner">
          <Link to="/admin" className="addm-back-link"><ChevronLeftIcon /> {TEXTS.back[lang]}</Link>
          <span className="addm-hero-icon">👤</span>
          <h1 className="addm-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="addm-hero-sub">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Content */}
      <section className="addm-body">
        <div className="addm-inner addm-layout">
          {/* Form */}
          <div className="addm-main">
            <div className="addm-form-card">
              <div className="addm-form-header">
                <h2 className="addm-form-title">{TEXTS.formTitle[lang]}</h2>
                <p className="addm-form-sub">{TEXTS.formSub[lang]}</p>
              </div>

              <form className="addm-form" onSubmit={handleSubmit} noValidate>
                <div className="addm-row">
                  <div className="addm-field">
                    <label htmlFor="name">{TEXTS.name[lang]} <span className="addm-req">{TEXTS.required[lang]}</span></label>
                    <input id="name" name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} className={errors.name ? 'addm-input--err' : ''} />
                    {errors.name && <span className="addm-err">{errors.name}</span>}
                  </div>
                  <div className="addm-field">
                    <label htmlFor="email">{TEXTS.email[lang]} <span className="addm-req">{TEXTS.required[lang]}</span></label>
                    <input id="email" name="email" type="email" placeholder={TEXTS.emailPlaceholder[lang]} value={form.email} onChange={handleChange} className={errors.email ? 'addm-input--err' : ''} />
                    {errors.email && <span className="addm-err">{errors.email}</span>}
                  </div>
                </div>

                <div className="addm-field">
                  <label htmlFor="role">{TEXTS.role[lang]} <span className="addm-req">{TEXTS.required[lang]}</span></label>
                  <select id="role" name="role" value={form.role} onChange={handleChange} className={errors.role ? 'addm-input--err' : ''}>
                    <option value="">{TEXTS.rolePlaceholder[lang]}</option>
                    {ROLES.map((r) => <option key={r.en} value={r.en}>{r[lang]}</option>)}
                  </select>
                  {errors.role && <span className="addm-err">{errors.role}</span>}
                </div>

                <div className="addm-field">
                  <label>{TEXTS.photo[lang]} <span className="addm-opt">{TEXTS.optional[lang]}</span></label>
                  {photoPreview ? (
                    <div className="addm-photo-preview">
                      <img src={photoPreview} alt="Preview" className="addm-photo-img" />
                      <button type="button" className="addm-photo-change" onClick={() => { setPhoto(null); setPhotoPreview(null) }}>
                        {lang === 'en' ? 'Change' : 'ផ្លាស់ប្តូរ'}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`addm-dropzone ${dragOver ? 'addm-dropzone--over' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handlePhoto(e.target.files[0])} className="addm-file-hidden" />
                      <span className="addm-dropzone-hint"><PhotoIcon /> {TEXTS.photoHint[lang]}</span>
                    </div>
                  )}
                </div>

                <div className="addm-field">
                  <label htmlFor="bio">{TEXTS.bio[lang]} <span className="addm-opt">{TEXTS.optional[lang]}</span></label>
                  <textarea id="bio" name="bio" rows="3" placeholder={TEXTS.bioPlaceholder[lang]} value={form.bio} onChange={handleChange} />
                </div>

                <button type="submit" className="addm-submit-btn">
                  {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <button type="button" className="addm-cancel-btn" onClick={cancelEdit}>
                    <XIcon /> {TEXTS.cancelBtn[lang]}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar list */}
          <aside className="addm-sidebar">
            <div className="addm-list-card">
              <div className="addm-list-header">
                <h3 className="addm-list-title">{TEXTS.teamTitle[lang]}</h3>
                <span className="addm-list-count">{members.length}</span>
              </div>

              {/* Action Shortcuts */}
              <div className="adp-shortcuts">
                <span className="adp-shortcuts-label">{lang === 'en' ? 'Shortcuts:' : 'ផ្លូវកាត់:'}</span>
                <button type="button" className="adp-shortcut-btn" onClick={cancelEdit} title="Add New Member">
                  ➕ {TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-edit" onClick={() => {}} title="Editing mode active">
                      ✏️ {TEXTS.updateBtn[lang]}
                    </button>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-delete" onClick={() => removeMember(editingId)} title="Delete editing member">
                      🗑️ {TEXTS.remove[lang]}
                    </button>
                  </>
                )}
              </div>

              {members.length === 0 ? (
                <div className="addm-empty">
                  <span className="addm-empty-icon">🧑‍🤝‍🧑</span>
                  <p>{TEXTS.empty[lang]}</p>
                </div>
              ) : (
                <div className="addm-list">
                  {members.map((m) => (
                    <div key={m.id} className="addm-card">
                      <div className="addm-card-img-wrap">
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="addm-card-img" />
                        ) : (
                          <span className="addm-card-initial">{m.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="addm-card-info">
                        <h4 className="addm-card-name">{m.name}</h4>
                        <p className="addm-card-role">{m.role}</p>
                        {m.bio && <p className="addm-card-bio">{m.bio}</p>}
                      </div>
                      <div className="addm-card-actions">
                        <button className="addm-edit-btn" onClick={() => startEdit(m)} aria-label={TEXTS.edit[lang]}>
                          <EditIcon />
                        </button>
                        <button className="addm-remove-btn" onClick={() => removeMember(m.id)} aria-label={TEXTS.remove[lang]}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/member" className="addm-view-link">
                <EyeIcon /> {TEXTS.viewTeam[lang]}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

const PhotoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
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

export default AddMember
