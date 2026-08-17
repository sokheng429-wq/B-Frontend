import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './AddPartner.css'

const CATEGORY_OPTIONS = [
  { key: 'fresh', icon: '🥬', en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' },
  { key: 'dairy', icon: '🥛', en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ' },
  { key: 'bakery', icon: '🥖', en: 'Bakery', kh: 'នំបុ័ង' },
  { key: 'meat', icon: '🥩', en: 'Meat & Seafood', kh: 'សាច់ ត្រី' },
  { key: 'drinks', icon: '🧃', en: 'Drinks', kh: 'ភេសជ្ជៈ' },
  { key: 'pantry', icon: '🍚', en: 'Grains & Pantry', kh: 'គ្រឿងទេស' },
  { key: 'snacks', icon: '🍿', en: 'Pantry & Snacks', kh: 'អាហារសម្រន់' },
]

const COLOR_PRESETS = [
  '#77BC1F', '#FF9900', '#8fd13a', '#4fc3f7', '#1976d2',
  '#ff7043', '#66bb6a', '#ffd54f', '#a1887f', '#26a69a', '#9ccc65', '#039be5',
]

const EMPTY_FORM = {
  name: '',
  catKey: 'fresh',
  categoryEn: '',
  categoryKh: '',
  since: new Date().getFullYear(),
  color: COLOR_PRESETS[0],
  regionEn: '',
  regionKh: '',
  suppliesEn: '',
  suppliesKh: '',
}

const TEXTS = {
  eyebrow: { en: 'Admin', kh: 'អ្នកគ្រប់គ្រង' },
  title: { en: 'Add a New Partner', kh: 'បន្ថែមដៃគូថ្មី' },
  subtitle: {
    en: 'Add a local producer or supplier to the public partner directory.',
    kh: 'បន្ថែមអ្នកផលិត ឬអ្នកផ្គត់ផ្គង់ក្នុងស្រុកទៅក្នុងបញ្ជីដៃគូសាធារណៈ។',
  },
  sectionBasic: { en: 'Basic Information', kh: 'ព័ត៌មានមូលដ្ឋាន' },
  labelName: { en: 'Partner name', kh: 'ឈ្មោះដៃគូ' },
  placeholderName: { en: 'e.g. Mekong Farms', kh: 'ឧ. Mekong Farms' },
  labelCatKey: { en: 'Category', kh: 'ប្រភេទ' },
  labelCategoryEn: { en: 'Category label (English)', kh: 'ឈ្មោះប្រភេទ (អង់គ្លេស)' },
  labelCategoryKh: { en: 'Category label (Khmer)', kh: 'ឈ្មោះប្រភេទ (ខ្មែរ)' },
  labelSince: { en: 'Partner since (year)', kh: 'ជាដៃគូតាំងពីឆ្នាំ' },
  labelColor: { en: 'Badge color', kh: 'ពណ៌ស្លាកសញ្ញា' },
  sectionLocation: { en: 'Location', kh: 'ទីតាំង' },
  labelRegionEn: { en: 'Region (English)', kh: 'តំបន់ (អង់គ្លេស)' },
  labelRegionKh: { en: 'Region (Khmer)', kh: 'តំបន់ (ខ្មែរ)' },
  placeholderRegionEn: { en: 'e.g. Kampot', kh: 'ឧ. Kampot' },
  placeholderRegionKh: { en: 'e.g. កំពត', kh: 'ឧ. កំពត' },
  sectionSupplies: { en: 'Supplies', kh: 'ទំនិញផ្គត់ផ្គង់' },
  hintSupplies: {
    en: 'Separate items with a comma.',
    kh: 'បំបែកទំនិញនីមួយៗដោយសញ្ញាក្បៀស (,)។',
  },
  labelSuppliesEn: { en: 'Supplies (English)', kh: 'ទំនិញ (អង់គ្លេស)' },
  labelSuppliesKh: { en: 'Supplies (Khmer)', kh: 'ទំនិញ (ខ្មែរ)' },
  placeholderSuppliesEn: { en: 'Leafy greens, Seasonal fruit, Herbs', kh: 'Leafy greens, Seasonal fruit, Herbs' },
  placeholderSuppliesKh: { en: 'បន្លែស្លឹក, ផ្លែឈើតាមរដូវ, បន្លែផ្សេងៗ', kh: 'បន្លែស្លឹក, ផ្លែឈើតាមរដូវ, បន្លែផ្សេងៗ' },
  previewLabel: { en: 'Live Preview', kh: 'មើលជាមុន' },
  previewEmptyName: { en: 'Partner name', kh: 'ឈ្មោះដៃគូ' },
  previewSince: { en: 'Partner since', kh: 'ដៃគូតាំងពី' },
  submitButton: { en: 'Add Partner', kh: 'បន្ថែមដៃគូ' },
  resetButton: { en: 'Clear form', kh: 'សម្អាតទម្រង់' },
  requiredError: {
    en: 'Please fill in the partner name, category, and region in both languages.',
    kh: 'សូមបំពេញឈ្មោះដៃគូ ប្រភេទ និងតំបន់ជាភាសាទាំងពីរ។',
  },
  successMsg: {
    en: 'Partner added! (Not yet connected to a live directory — check the console for the record.)',
    kh: 'បានបន្ថែមដៃគូ! (មិនទាន់ភ្ជាប់ទៅបញ្ជីផ្ទាល់ទេ — សូមពិនិត្យ console សម្រាប់ទិន្នន័យ។)',
  },
}

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const initials = (name) =>
  name.trim() ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() : '??'

export const AddPartner = () => {
  const { lang } = useLanguage()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setSuccess(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.categoryEn.trim() || !form.categoryKh.trim() || !form.regionEn.trim() || !form.regionKh.trim()) {
      setError(true)
      setSuccess(false)
      return
    }

    const toList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean)

    const newPartner = {
      name: form.name.trim(),
      category: { en: form.categoryEn.trim(), kh: form.categoryKh.trim() },
      catKey: form.catKey,
      since: Number(form.since) || new Date().getFullYear(),
      color: form.color,
      supplies: {
        en: toList(form.suppliesEn),
        kh: toList(form.suppliesKh),
      },
      region: { en: form.regionEn.trim(), kh: form.regionKh.trim() },
    }

    // TODO: replace with a real API call / shared data source once the backend exists
    console.log('New partner record:', newPartner)

    setError(false)
    setSuccess(true)
    setForm(EMPTY_FORM)
  }

  const handleReset = () => {
    setForm(EMPTY_FORM)
    setError(false)
    setSuccess(false)
  }

  const previewCategory = form.categoryEn || CATEGORY_OPTIONS.find((c) => c.key === form.catKey)?.[lang] || ''
  const previewSupplies = (lang === 'kh' ? form.suppliesKh : form.suppliesEn)
    .split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="ap-page">
      <section className="ap-hero">
        <div className="ap-hero-inner">
          <span className="ap-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h1 className="ap-title">{TEXTS.title[lang]}</h1>
          <p className="ap-subtitle">{TEXTS.subtitle[lang]}</p>
        </div>
      </section>

      <section className="ap-body">
        <div className="ap-body-inner">
          <form className="ap-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="ap-alert ap-alert--error">{TEXTS.requiredError[lang]}</div>
            )}
            {success && (
              <div className="ap-alert ap-alert--success">{TEXTS.successMsg[lang]}</div>
            )}

            <fieldset className="ap-fieldset">
              <legend>{TEXTS.sectionBasic[lang]}</legend>

              <label className="ap-field">
                <span>{TEXTS.labelName[lang]}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder={TEXTS.placeholderName[lang]}
                />
              </label>

              <label className="ap-field">
                <span>{TEXTS.labelCatKey[lang]}</span>
                <select value={form.catKey} onChange={update('catKey')}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.icon} {c[lang]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="ap-row">
                <label className="ap-field">
                  <span>{TEXTS.labelCategoryEn[lang]}</span>
                  <input type="text" value={form.categoryEn} onChange={update('categoryEn')} placeholder="Fruits & Vegetables" />
                </label>
                <label className="ap-field">
                  <span>{TEXTS.labelCategoryKh[lang]}</span>
                  <input type="text" value={form.categoryKh} onChange={update('categoryKh')} placeholder="ផ្លែឈើ និងបន្លែ" />
                </label>
              </div>

              <div className="ap-row">
                <label className="ap-field">
                  <span>{TEXTS.labelSince[lang]}</span>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={form.since}
                    onChange={update('since')}
                  />
                </label>
                <label className="ap-field">
                  <span>{TEXTS.labelColor[lang]}</span>
                  <div className="ap-color-row">
                    <input type="color" value={form.color} onChange={update('color')} className="ap-color-input" />
                    <div className="ap-swatches">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className={`ap-swatch ${form.color === c ? 'ap-swatch--on' : ''}`}
                          style={{ background: c }}
                          onClick={() => setForm((f) => ({ ...f, color: c }))}
                          aria-label={c}
                        />
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            </fieldset>

            <fieldset className="ap-fieldset">
              <legend>{TEXTS.sectionLocation[lang]}</legend>
              <div className="ap-row">
                <label className="ap-field">
                  <span>{TEXTS.labelRegionEn[lang]}</span>
                  <input type="text" value={form.regionEn} onChange={update('regionEn')} placeholder={TEXTS.placeholderRegionEn.en} />
                </label>
                <label className="ap-field">
                  <span>{TEXTS.labelRegionKh[lang]}</span>
                  <input type="text" value={form.regionKh} onChange={update('regionKh')} placeholder={TEXTS.placeholderRegionKh.en} />
                </label>
              </div>
            </fieldset>

            <fieldset className="ap-fieldset">
              <legend>{TEXTS.sectionSupplies[lang]}</legend>
              <p className="ap-hint">{TEXTS.hintSupplies[lang]}</p>
              <label className="ap-field">
                <span>{TEXTS.labelSuppliesEn[lang]}</span>
                <input type="text" value={form.suppliesEn} onChange={update('suppliesEn')} placeholder={TEXTS.placeholderSuppliesEn.en} />
              </label>
              <label className="ap-field">
                <span>{TEXTS.labelSuppliesKh[lang]}</span>
                <input type="text" value={form.suppliesKh} onChange={update('suppliesKh')} placeholder={TEXTS.placeholderSuppliesKh.en} />
              </label>
            </fieldset>

            <div className="ap-actions">
              <button type="button" className="btn-ghost" onClick={handleReset}>
                {TEXTS.resetButton[lang]}
              </button>
              <button type="submit" className="btn-brand">
                {TEXTS.submitButton[lang]}
              </button>
            </div>
          </form>

          <aside className="ap-preview">
            <span className="ap-preview-label">{TEXTS.previewLabel[lang]}</span>
            <article className="ap-preview-card">
              <div className="ap-preview-top">
                <div className="ap-preview-badge" style={{ background: form.color }}>
                  {initials(form.name)}
                </div>
                <span className="ap-preview-since">
                  {TEXTS.previewSince[lang]} {form.since}
                </span>
              </div>
              <h3 className="ap-preview-name">{form.name || TEXTS.previewEmptyName[lang]}</h3>
              <p className="ap-preview-category">{previewCategory}</p>
              <div className="ap-preview-supplies">
                {previewSupplies.length > 0 ? (
                  previewSupplies.map((s) => (
                    <span className="ap-chip" key={s}>{s}</span>
                  ))
                ) : (
                  <span className="ap-chip ap-chip--muted">—</span>
                )}
              </div>
              <p className="ap-preview-region">
                <PinIcon /> {(lang === 'kh' ? form.regionKh : form.regionEn) || '—'}
              </p>
            </article>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default AddPartner