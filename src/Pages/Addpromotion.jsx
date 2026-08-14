import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Addpromotion.css'

const TEXTS = {
  heroTitle: { en: 'Manage Promotions', kh: 'គ្រប់គ្រងការផ្សព្វផ្សាយ' },
  heroSub: { en: 'Create and manage promotional deals — they will appear on the Promotions page for customers.', kh: 'បង្កើត និងគ្រប់គ្រងការផ្សព្វផ្សាយ — ពួកគេនឹងបង្ហាញនៅទំព័រផ្សព្វផ្សាយសម្រាប់អតិថិជន។' },
  formTitle: { en: 'Promotion Details', kh: 'ព័ត៌មានផ្សព្វផ្សាយ' },
  formSub: { en: 'Fill in the details below to create or edit a promotion.', kh: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើត ឬកែសម្រួលការផ្សព្វផ្សាយ។' },
  title: { en: 'Promotion Title', kh: 'ចំណងជើងផ្សព្វផ្សាយ' },
  titlePlaceholder: { en: 'e.g. Buy 2 Get 1 Free', kh: 'ឧ. ទិញ២ថែម១' },
  description: { en: 'Description', kh: 'ការពិពណ៌នា' },
  descriptionPlaceholder: { en: 'Describe the promotion details...', kh: 'ពិពណ៌នាអំពីការផ្សព្វផ្សាយ...' },
  tag: { en: 'Discount Tag', kh: 'ស្លាកបញ្ចុះតម្លៃ' },
  tagPlaceholder: { en: 'e.g. 20% OFF', kh: 'ឧ. បញ្ចុះតម្លៃ ២០%' },
  code: { en: 'Promo Code', kh: 'កូដផ្សព្វផ្សាយ' },
  codePlaceholder: { en: 'e.g. SAVE20', kh: 'ឧ. SAVE20' },
  badge: { en: 'Badge Text', kh: 'អត្ថបទផ្លាក' },
  badgePlaceholder: { en: 'e.g. Ends in 2 days', kh: 'ឧ. នៅសល់ ២ថ្ងៃ' },
  color: { en: 'Tag Color', kh: 'ពណ៌ស្លាក' },
  image: { en: 'Promotion Image', kh: 'រូបភាពផ្សព្វផ្សាយ' },
  imageHint: { en: 'Drop an image here, or click to browse', kh: 'ទម្លាក់រូបភាពនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  imageSelected: { en: 'Image selected', kh: 'បានជ្រើសរើសរូបភាព' },
  addBtn: { en: 'Add Promotion', kh: 'បន្ថែមការផ្សព្វផ្សាយ' },
  updateBtn: { en: 'Update Promotion', kh: 'ធ្វើបច្ចុប្បន្នភាពការផ្សព្វផ្សាយ' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  // Errors
  errTitle: { en: 'Promotion title is required', kh: 'ត្រូវការចំណងជើងផ្សព្វផ្សាយ' },
  errTag: { en: 'Discount tag is required', kh: 'ត្រូវការស្លាកបញ្ចុះតម្លៃ' },
  errCode: { en: 'Promo code is required', kh: 'ត្រូវការកូដផ្សព្វផ្សាយ' },
  errBadge: { en: 'Badge text is required', kh: 'ត្រូវការអត្ថបទផ្លាក' },
  // List
  listTitle: { en: 'Promotions', kh: 'ការផ្សព្វផ្សាយ' },
  empty: { en: 'No promotions yet — fill the form to add your first deal.', kh: 'មិនទាន់មានការផ្សព្វផ្សាយនៅឡើយ — បំពេញទម្រង់ដើម្បីបន្ថែម។' },
  viewPage: { en: 'View Promotions Page', kh: 'មើលទំព័រផ្សព្វផ្សាយ' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  back: { en: '← Back to Dashboard', kh: '← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង' },
}

const PRESET_COLORS = [
  '#e63946', '#f4a261', '#2a9d8f', '#FF9900', '#e76f51',
  '#6a994e', '#bc6c25', '#264653', '#9c89b8', '#f72585',
]

export const Addpromotion = () => {
  const { lang } = useLanguage()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', tag: '', code: '', badge: '', color: '#e63946', image: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [promotions, setPromotions] = useState([])
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImage = (file) => {
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImage(file)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = TEXTS.errTitle[lang]
    if (!form.tag.trim()) e.tag = TEXTS.errTag[lang]
    if (!form.code.trim()) e.code = TEXTS.errCode[lang]
    if (!form.badge.trim()) e.badge = TEXTS.errBadge[lang]
    return e
  }

  const startEdit = (promo) => {
    setEditingId(promo.id)
    setForm({
      title: promo.title, description: promo.description || '', tag: promo.tag,
      code: promo.code, badge: promo.badge, color: promo.color || '#e63946',
      image: promo.image || '',
    })
    setImagePreview(promo.image || null)
    setImageFile(null)
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', description: '', tag: '', code: '', badge: '', color: '#e63946', image: '' })
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      const promoData = {
        ...form,
        image: imagePreview || form.image,
      }

      if (editingId) {
        setPromotions((prev) => prev.map((p) =>
          p.id === editingId ? { ...p, ...promoData } : p
        ))
        cancelEdit()
      } else {
        setPromotions((prev) => [...prev, { id: Date.now(), ...promoData }])
        setForm({ title: '', description: '', tag: '', code: '', badge: '', color: '#e63946', image: '' })
        setImageFile(null)
        setImagePreview(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    }
  }

  const removePromotion = (id) => {
    if (editingId === id) cancelEdit()
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="adpro-page">
      {/* Hero */}
      <section className="adpro-hero">
        <div className="adpro-hero-bg" />
        <div className="adpro-inner">
          <Link to="/admin" className="adpro-back-link"><ChevronLeftIcon /> {TEXTS.back[lang]}</Link>
          <span className="adpro-hero-icon">🏷️</span>
          <h1 className="adpro-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="adpro-hero-sub">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Content */}
      <section className="adpro-body">
        <div className="adpro-inner adpro-layout">
          {/* Form */}
          <div className="adpro-main">
            <div className="adpro-form-card">
              <div className="adpro-form-header">
                <h2 className="adpro-form-title">{TEXTS.formTitle[lang]}</h2>
                <p className="adpro-form-sub">{TEXTS.formSub[lang]}</p>
              </div>

              <form className="adpro-form" onSubmit={handleSubmit} noValidate>
                <div className="adpro-field">
                  <label htmlFor="title">{TEXTS.title[lang]} <span className="adpro-req">{TEXTS.required[lang]}</span></label>
                  <input id="title" name="title" type="text" placeholder={TEXTS.titlePlaceholder[lang]} value={form.title} onChange={handleChange} className={errors.title ? 'adpro-input--err' : ''} />
                  {errors.title && <span className="adpro-err">{errors.title}</span>}
                </div>

                <div className="adpro-field">
                  <label htmlFor="description">{TEXTS.description[lang]} <span className="adpro-req">{TEXTS.required[lang]}</span></label>
                  <textarea id="description" name="description" rows="3" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.description} onChange={handleChange} className={errors.description ? 'adpro-input--err' : ''} />
                  {errors.description && <span className="adpro-err">{errors.description}</span>}
                </div>

                <div className="adpro-row">
                  <div className="adpro-field">
                    <label htmlFor="tag">{TEXTS.tag[lang]} <span className="adpro-req">{TEXTS.required[lang]}</span></label>
                    <input id="tag" name="tag" type="text" placeholder={TEXTS.tagPlaceholder[lang]} value={form.tag} onChange={handleChange} className={errors.tag ? 'adpro-input--err' : ''} />
                    {errors.tag && <span className="adpro-err">{errors.tag}</span>}
                  </div>
                  <div className="adpro-field">
                    <label htmlFor="code">{TEXTS.code[lang]} <span className="adpro-req">{TEXTS.required[lang]}</span></label>
                    <input id="code" name="code" type="text" placeholder={TEXTS.codePlaceholder[lang]} value={form.code} onChange={handleChange} className={errors.code ? 'adpro-input--err' : ''} />
                    {errors.code && <span className="adpro-err">{errors.code}</span>}
                  </div>
                </div>

                <div className="adpro-row">
                  <div className="adpro-field">
                    <label htmlFor="badge">{TEXTS.badge[lang]} <span className="adpro-req">{TEXTS.required[lang]}</span></label>
                    <input id="badge" name="badge" type="text" placeholder={TEXTS.badgePlaceholder[lang]} value={form.badge} onChange={handleChange} className={errors.badge ? 'adpro-input--err' : ''} />
                    {errors.badge && <span className="adpro-err">{errors.badge}</span>}
                  </div>
                  <div className="adpro-field">
                    <label>{TEXTS.color[lang]} <span className="adpro-opt">{TEXTS.optional[lang]}</span></label>
                    <div className="adpro-color-row">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`adpro-color-swatch ${form.color === c ? 'adpro-color-swatch--active' : ''}`}
                          style={{ background: c }}
                          onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                          aria-label={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                        className="adpro-color-picker"
                        title="Custom color"
                      />
                    </div>
                  </div>
                </div>

                <div className="adpro-field">
                  <label>{TEXTS.image[lang]} <span className="adpro-opt">{TEXTS.optional[lang]}</span></label>
                  {imagePreview ? (
                    <div className="adpro-photo-preview">
                      <img src={imagePreview} alt="Preview" className="adpro-photo-img" />
                      <button type="button" className="adpro-photo-change" onClick={() => { setImageFile(null); setImagePreview(null); setForm((prev) => ({ ...prev, image: '' })) }}>
                        {lang === 'en' ? 'Change' : 'ផ្លាស់ប្តូរ'}
                      </button>
                    </div>
                  ) : form.image ? (
                    <div className="adpro-photo-preview">
                      <img src={form.image} alt="Preview" className="adpro-photo-img" />
                      <button type="button" className="adpro-photo-change" onClick={() => setForm((prev) => ({ ...prev, image: '' }))}>
                        {lang === 'en' ? 'Change' : 'ផ្លាស់ប្តូរ'}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`adpro-dropzone ${dragOver ? 'adpro-dropzone--over' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} className="adpro-file-hidden" />
                      <span className="adpro-dropzone-hint"><PhotoIcon /> {TEXTS.imageHint[lang]}</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="adpro-submit-btn">
                  {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <button type="button" className="adpro-cancel-btn" onClick={cancelEdit}>
                    <XIcon /> {TEXTS.cancelBtn[lang]}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar list */}
          <aside className="adpro-sidebar">
            <div className="adpro-list-card">
              <div className="adpro-list-header">
                <h3 className="adpro-list-title">{TEXTS.listTitle[lang]}</h3>
                <span className="adpro-list-count">{promotions.length}</span>
              </div>

              {/* Action Shortcuts */}
              <div className="adp-shortcuts">
                <span className="adp-shortcuts-label">{lang === 'en' ? 'Shortcuts:' : 'ផ្លូវកាត់:'}</span>
                <button type="button" className="adp-shortcut-btn" onClick={cancelEdit} title="Add New Promotion">
                  ➕ {TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-edit" onClick={() => {}} title="Editing mode active">
                      ✏️ {TEXTS.updateBtn[lang]}
                    </button>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-delete" onClick={() => removePromotion(editingId)} title="Delete editing promotion">
                      🗑️ {TEXTS.remove[lang]}
                    </button>
                  </>
                )}
              </div>

              {promotions.length === 0 ? (
                <div className="adpro-empty">
                  <span className="adpro-empty-icon">🏷️</span>
                  <p>{TEXTS.empty[lang]}</p>
                </div>
              ) : (
                <div className="adpro-list">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="adpro-card">
                      <div className="adpro-card-img-wrap">
                        {promo.image ? (
                          <img src={promo.image} alt={promo.title} className="adpro-card-img" />
                        ) : (
                          <span className="adpro-card-placeholder">🏷️</span>
                        )}
                      </div>
                      <div className="adpro-card-info">
                        <h4 className="adpro-card-title">{promo.title}</h4>
                        <div className="adpro-card-meta">
                          <span className="adpro-card-tag" style={{ background: promo.color || '#e63946' }}>{promo.tag}</span>
                          <span className="adpro-card-code">{promo.code}</span>
                        </div>
                        <p className="adpro-card-badge">{promo.badge}</p>
                      </div>
                      <div className="adpro-card-actions">
                        <button className="adpro-edit-btn" onClick={() => startEdit(promo)} aria-label={TEXTS.edit[lang]}>
                          <EditIcon />
                        </button>
                        <button className="adpro-remove-btn" onClick={() => removePromotion(promo.id)} aria-label={TEXTS.remove[lang]}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/promotion" className="adpro-view-link">
                <EyeIcon /> {TEXTS.viewPage[lang]}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

/* ---- Icons ---- */
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

export default Addpromotion
