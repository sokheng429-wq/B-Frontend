import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './AddProducts.css'

const CATEGORIES = [
  { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' },
  { en: 'Meat & Seafood', kh: 'សាច់ និងគ្រឿងសមុទ្រ' },
  { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ និងស៊ុត' },
  { en: 'Bakery & Bread', kh: 'នំប៉័ង និងនំ' },
  { en: 'Drinks', kh: 'ភេសជ្ជៈ' },
  { en: 'Snacks', kh: 'អាហារសម្រន់' },
  { en: 'Other', kh: 'ផ្សេងទៀត' },
]

const UNITS = [
  { en: 'box', kh: 'ប្រអប់' },
  { en: 'bag', kh: 'កាបូប' },
  { en: 'kg', kh: 'គក' },
  { en: 'bottle', kh: 'ដប' },
  { en: 'pack', kh: 'កញ្ចប់' },
  { en: 'loaf', kh: 'ដុំ' },
  { en: 'tub', kh: 'ពែង' },
  { en: 'piece', kh: 'ដុំ' },
]

const TEXTS = {
  heroTitle: { en: 'Add a Product', kh: 'បន្ថែមផលិតផល' },
  heroSub: { en: 'Add new grocery items — they will appear in the shop for customers to browse and order.', kh: 'បន្ថែមផលិតផលថ្មី — ពួកគេនឹងបង្ហាញនៅក្នុងហាងសម្រាប់អតិថិជនជ្រើសរើសនិងបញ្ជាទិញ។' },
  formTitle: { en: 'Product Details', kh: 'ព័ត៌មានផលិតផល' },
  formSub: { en: 'Fill in the details below to add a new product listing.', kh: 'បំពេញព័ត៌មានខាងក្រោមដើម្បីបន្ថែមផលិតផលថ្មី។' },
  name: { en: 'Product Name', kh: 'ឈ្មោះផលិតផល' },
  namePlaceholder: { en: 'e.g. Fresh Strawberries', kh: 'ឧ. ផ្លែស្ត្របឺរីស្រស់' },
  category: { en: 'Category', kh: 'ប្រភេទ' },
  categoryPlaceholder: { en: 'Select category', kh: 'ជ្រើសរើសប្រភេទ' },
  price: { en: 'Price ($)', kh: 'តម្លៃ ($)' },
  pricePlaceholder: { en: 'e.g. 3.50', kh: 'ឧ. 3.50' },
  oldPrice: { en: 'Old Price ($)', kh: 'តម្លៃដើម ($)' },
  oldPricePlaceholder: { en: 'e.g. 4.90', kh: 'ឧ. 4.90' },
  unit: { en: 'Unit', kh: 'ឯកតា' },
  unitPlaceholder: { en: 'Select unit', kh: 'ជ្រើសរើសឯកតា' },
  stock: { en: 'Stock Qty', kh: 'ចំនួនស្តុក' },
  stockPlaceholder: { en: 'e.g. 100', kh: 'ឧ. 100' },
  image: { en: 'Product Image', kh: 'រូបថតផលិតផល' },
  imageHint: { en: 'Drop an image here, or click to browse', kh: 'ទម្លាក់រូបថតនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  imageSelected: { en: 'Image selected', kh: 'បានជ្រើសរើសរូបថត' },
  description: { en: 'Description', kh: 'ការពិពណ៌នា' },
  descriptionPlaceholder: { en: 'Describe the product, its benefits, and any key details...', kh: 'ពិពណ៌នាអំពីផលិតផល អត្ថប្រយោជន៍ និងព័ត៌មានសំខាន់ៗ...' },
  addBtn: { en: 'Add Product', kh: 'បន្ថែមផលិតផល' },
  updateBtn: { en: 'Update Product', kh: 'ធ្វើបច្ចុប្បន្នភាពផលិតផល' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  // Errors
  errName: { en: 'Product name is required', kh: 'ត្រូវការឈ្មោះផលិតផល' },
  errCategory: { en: 'Please select a category', kh: 'សូមជ្រើសរើសប្រភេទ' },
  errPrice: { en: 'Enter a valid price', kh: 'បញ្ចូលតម្លៃត្រឹមត្រូវ' },
  errStock: { en: 'Enter a valid quantity', kh: 'បញ្ចូលចំនួនត្រឹមត្រូវ' },
  // List
  listTitle: { en: 'Products', kh: 'ផលិតផល' },
  empty: { en: 'No products added yet — fill the form to add your first item.', kh: 'មិនទាន់មានផលិតផលនៅឡើយ — បំពេញទម្រង់ដើម្បីបន្ថែម។' },
  viewShop: { en: 'View Shop Page', kh: 'មើលទំព័រហាង' },
  inStock: { en: 'in stock', kh: 'ក្នុងស្តុក' },
  outOfStock: { en: 'Out of stock', kh: 'អស់ស្តុក' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  delete: { en: 'Delete', kh: 'លុប' },
  update: { en: 'Update', kh: 'ធ្វើបច្ចុប្បន្នភាព' },
  back: { en: '← Back to Dashboard', kh: '← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង' },
}

export const AddProducts = () => {
  const { lang } = useLanguage()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ name: '', category: '', price: '', oldPrice: '', unit: '', stock: '', description: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImage = (file) => {
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
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
    if (!form.name.trim()) e.name = TEXTS.errName[lang]
    if (!form.category) e.category = TEXTS.errCategory[lang]
    if (!form.price.trim() || isNaN(form.price) || Number(form.price) <= 0) e.price = TEXTS.errPrice[lang]
    if (form.oldPrice.trim() && (isNaN(form.oldPrice) || Number(form.oldPrice) <= 0)) e.oldPrice = TEXTS.errPrice[lang]
    if (form.stock.trim() && (isNaN(form.stock) || Number(form.stock) < 0)) e.stock = TEXTS.errStock[lang]
    return e
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name, category: product.category, price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '', unit: product.unit || '',
      stock: product.stock !== null && product.stock !== '' ? String(product.stock) : '', description: product.description || ''
    })
    setImagePreview(product.image)
    setImage(null)
    setErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', category: '', price: '', oldPrice: '', unit: '', stock: '', description: '' })
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      if (editingId) {
        setProducts((prev) => prev.map((p) =>
          p.id === editingId ? { ...p, ...form, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : null, stock: form.stock ? Number(form.stock) : null, image: imagePreview || p.image } : p
        ))
        cancelEdit()
      } else {
        setProducts((prev) => [...prev, {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          stock: form.stock ? Number(form.stock) : null,
          image: imagePreview,
        }])
        setForm({ name: '', category: '', price: '', oldPrice: '', unit: '', stock: '', description: '' })
        setImage(null)
        setImagePreview(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    }
  }

  const removeProduct = (id) => {
    if (editingId === id) cancelEdit()
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const getCatLabel = (catEn) => CATEGORIES.find((c) => c.en === catEn)?.[lang] || catEn
  const getUnitLabel = (unitEn) => UNITS.find((u) => u.en === unitEn)?.[lang] || unitEn

  return (
    <div className="adp-page">
      {/* Hero */}
      <section className="adp-hero">
        <div className="adp-hero-bg" />
        <div className="adp-inner">
          <Link to="/admin" className="adp-back-link"><ChevronLeftIcon /> {TEXTS.back[lang]}</Link>
          <span className="adp-hero-icon">📦</span>
          <h1 className="adp-hero-title">{TEXTS.heroTitle[lang]}</h1>
          <p className="adp-hero-sub">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Content */}
      <section className="adp-body">
        <div className="adp-inner adp-layout">
          {/* Form */}
          <div className="adp-main">
            <div className="adp-form-card">
              <div className="adp-form-header">
                <h2 className="adp-form-title">{TEXTS.formTitle[lang]}</h2>
                <p className="adp-form-sub">{TEXTS.formSub[lang]}</p>
              </div>

              <form className="adp-form" onSubmit={handleSubmit} noValidate>
                <div className="adp-field">
                  <label htmlFor="name">{TEXTS.name[lang]} <span className="adp-req">{TEXTS.required[lang]}</span></label>
                  <input id="name" name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} className={errors.name ? 'adp-input--err' : ''} />
                  {errors.name && <span className="adp-err">{errors.name}</span>}
                </div>

                <div className="adp-row">
                  <div className="adp-field">
                    <label htmlFor="category">{TEXTS.category[lang]} <span className="adp-req">{TEXTS.required[lang]}</span></label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} className={errors.category ? 'adp-input--err' : ''}>
                      <option value="">{TEXTS.categoryPlaceholder[lang]}</option>
                      {CATEGORIES.map((c) => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                    </select>
                    {errors.category && <span className="adp-err">{errors.category}</span>}
                  </div>
                  <div className="adp-field">
                    <label htmlFor="unit">{TEXTS.unit[lang]} <span className="adp-opt">{TEXTS.optional[lang]}</span></label>
                    <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
                      <option value="">{TEXTS.unitPlaceholder[lang]}</option>
                      {UNITS.map((u) => <option key={u.en} value={u.en}>{u[lang]}</option>)}
                    </select>
                  </div>
                </div>

                <div className="adp-row">
                  <div className="adp-field">
                    <label htmlFor="price">{TEXTS.price[lang]} <span className="adp-req">{TEXTS.required[lang]}</span></label>
                    <input id="price" name="price" type="text" placeholder={TEXTS.pricePlaceholder[lang]} value={form.price} onChange={handleChange} className={errors.price ? 'adp-input--err' : ''} />
                    {errors.price && <span className="adp-err">{errors.price}</span>}
                  </div>
                  <div className="adp-field">
                    <label htmlFor="oldPrice">{TEXTS.oldPrice[lang]} <span className="adp-opt">{TEXTS.optional[lang]}</span></label>
                    <input id="oldPrice" name="oldPrice" type="text" placeholder={TEXTS.oldPricePlaceholder[lang]} value={form.oldPrice} onChange={handleChange} className={errors.oldPrice ? 'adp-input--err' : ''} />
                    {errors.oldPrice && <span className="adp-err">{errors.oldPrice}</span>}
                  </div>
                </div>

                <div className="adp-field">
                  <label htmlFor="stock">{TEXTS.stock[lang]} <span className="adp-opt">{TEXTS.optional[lang]}</span></label>
                  <input id="stock" name="stock" type="text" placeholder={TEXTS.stockPlaceholder[lang]} value={form.stock} onChange={handleChange} className={errors.stock ? 'adp-input--err' : ''} />
                  {errors.stock && <span className="adp-err">{errors.stock}</span>}
                </div>

                <div className="adp-field">
                  <label>{TEXTS.image[lang]} <span className="adp-opt">{TEXTS.optional[lang]}</span></label>
                  {imagePreview ? (
                    <div className="adp-photo-preview">
                      <img src={imagePreview} alt="Preview" className="adp-photo-img" />
                      <button type="button" className="adp-photo-change" onClick={() => { setImage(null); setImagePreview(null) }}>
                        {lang === 'en' ? 'Change' : 'ផ្លាស់ប្តូរ'}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`adp-dropzone ${dragOver ? 'adp-dropzone--over' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} className="adp-file-hidden" />
                      <span className="adp-dropzone-hint"><PhotoIcon /> {TEXTS.imageHint[lang]}</span>
                    </div>
                  )}
                </div>

                <div className="adp-field">
                  <label htmlFor="description">{TEXTS.description[lang]} <span className="adp-opt">{TEXTS.optional[lang]}</span></label>
                  <textarea id="description" name="description" rows="3" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.description} onChange={handleChange} />
                </div>

                <button type="submit" className="adp-submit-btn">
                  {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <button type="button" className="adp-cancel-btn" onClick={cancelEdit}>
                    <XIcon /> {TEXTS.cancelBtn[lang]}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar list */}
          <aside className="adp-sidebar">
            <div className="adp-list-card">
              <div className="adp-list-header">
                <h3 className="adp-list-title">{TEXTS.listTitle[lang]}</h3>
                <span className="adp-list-count">{products.length}</span>
              </div>

              {/* Action Shortcuts */}
              <div className="adp-shortcuts">
                <span className="adp-shortcuts-label">{lang === 'en' ? 'Shortcuts:' : 'ផ្លូវកាត់:'}</span>
                <button type="button" className="adp-shortcut-btn" onClick={cancelEdit} title="Add New Product">
                  ➕ {TEXTS.addBtn[lang]}
                </button>
                {editingId && (
                  <>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-edit" onClick={() => {}} title="Editing mode active">
                      ✏️ {TEXTS.updateBtn[lang]}
                    </button>
                    <button type="button" className="adp-shortcut-btn admind-shortcut-delete" onClick={() => removeProduct(editingId)} title="Delete editing item">
                      🗑️ {TEXTS.delete[lang]}
                    </button>
                  </>
                )}
              </div>

              {products.length === 0 ? (
                <div className="adp-empty">
                  <span className="adp-empty-icon">🛍️</span>
                  <p>{TEXTS.empty[lang]}</p>
                </div>
              ) : (
                <div className="adp-list">
                  {products.map((p) => (
                    <div key={p.id} className="adp-card">
                      <div className="adp-card-img-wrap">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="adp-card-img" />
                        ) : (
                          <span className="adp-card-initial">📷</span>
                        )}
                      </div>
                      <div className="adp-card-info">
                        <h4 className="adp-card-name">{p.name}</h4>
                        <div className="adp-card-badges">
                          <span className="adp-badge adp-badge--cat">{getCatLabel(p.category)}</span>
                          {p.unit && <span className="adp-badge adp-badge--unit">{getUnitLabel(p.unit)}</span>}
                        </div>
                        <div className="adp-card-prices">
                          <span className="adp-card-price">${p.price.toFixed(2)}</span>
                          {p.oldPrice && <span className="adp-card-old-price">${p.oldPrice.toFixed(2)}</span>}
                          {p.stock !== null && p.stock !== '' && (
                            <span className={`adp-card-stock ${p.stock === 0 ? 'adp-card-stock--zero' : ''}`}>
                              {p.stock === 0 ? TEXTS.outOfStock[lang] : `${p.stock} ${TEXTS.inStock[lang]}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="adp-card-actions">
                        <button className="adp-edit-btn" onClick={() => startEdit(p)} aria-label={TEXTS.edit[lang]}>
                          <EditIcon />
                        </button>
                        <button className="adp-remove-btn" onClick={() => removeProduct(p.id)} aria-label={TEXTS.remove[lang]}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/products" className="adp-view-link">
                <EyeIcon /> {TEXTS.viewShop[lang]}
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

export default AddProducts
