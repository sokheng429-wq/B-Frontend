import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'

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
  heroTitle: { en: 'Product shelf', kh: 'ធ្នើផលិតផល' },
  heroSub: { en: 'Add, preview, and clean up grocery listings before they reach the shop.', kh: 'បន្ថែម មើលជាមុន និងរៀបចំបញ្ជីផលិតផលមុនពេលបង្ហាញក្នុងហាង។' },
  formTitle: { en: 'Product details', kh: 'ព័ត៌មានផលិតផល' },
  formSub: { en: 'Keep the required fields tight. Add stock and promo pricing when you have it.', kh: 'បំពេញព័ត៌មានចាំបាច់ឱ្យច្បាស់។ បន្ថែមស្តុក និងតម្លៃប្រូម៉ូសិនបើមាន។' },
  name: { en: 'Product name', kh: 'ឈ្មោះផលិតផល' },
  namePlaceholder: { en: 'e.g. Fresh strawberries', kh: 'ឧ. ផ្លែស្ត្របឺរីស្រស់' },
  category: { en: 'Category', kh: 'ប្រភេទ' },
  categoryPlaceholder: { en: 'Select category', kh: 'ជ្រើសរើសប្រភេទ' },
  price: { en: 'Price ($)', kh: 'តម្លៃ ($)' },
  pricePlaceholder: { en: '3.50', kh: '3.50' },
  oldPrice: { en: 'Old price ($)', kh: 'តម្លៃដើម ($)' },
  oldPricePlaceholder: { en: '4.90', kh: '4.90' },
  unit: { en: 'Unit', kh: 'ឯកតា' },
  unitPlaceholder: { en: 'Select unit', kh: 'ជ្រើសរើសឯកតា' },
  stock: { en: 'Stock qty', kh: 'ចំនួនស្តុក' },
  stockPlaceholder: { en: '100', kh: '100' },
  image: { en: 'Product image', kh: 'រូបថតផលិតផល' },
  imageHint: { en: 'Drop an image here, or click to browse', kh: 'ទម្លាក់រូបថតនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  description: { en: 'Description', kh: 'ការពិពណ៌នា' },
  descriptionPlaceholder: { en: 'Describe freshness, origin, packaging, or customer notes...', kh: 'ពិពណ៌នាអំពីភាពស្រស់ ប្រភព ការវេចខ្ចប់ ឬកំណត់ចំណាំសម្រាប់អតិថិជន...' },
  addBtn: { en: 'Add product', kh: 'បន្ថែមផលិតផល' },
  updateBtn: { en: 'Save product', kh: 'រក្សាទុកផលិតផល' },
  cancelBtn: { en: 'Cancel edit', kh: 'បោះបង់ការកែប្រែ' },
  required: { en: 'Required', kh: 'ត្រូវការ' },
  optional: { en: 'Optional', kh: 'មិនចាំបាច់' },
  errName: { en: 'Product name is required', kh: 'ត្រូវការឈ្មោះផលិតផល' },
  errCategory: { en: 'Please select a category', kh: 'សូមជ្រើសរើសប្រភេទ' },
  errPrice: { en: 'Enter a valid price', kh: 'បញ្ចូលតម្លៃត្រឹមត្រូវ' },
  errStock: { en: 'Enter a valid quantity', kh: 'បញ្ចូលចំនួនត្រឹមត្រូវ' },
  listTitle: { en: 'Shelf queue', kh: 'បញ្ជីផលិតផល' },
  empty: { en: 'No products yet. Add the first item and it will appear here for quick edits.', kh: 'មិនទាន់មានផលិតផលនៅឡើយ។ បន្ថែមផលិតផលដំបូង ហើយវានឹងបង្ហាញនៅទីនេះសម្រាប់កែប្រែរហ័ស។' },
  viewShop: { en: 'View shop page', kh: 'មើលទំព័រហាង' },
  inStock: { en: 'in stock', kh: 'ក្នុងស្តុក' },
  outOfStock: { en: 'Out of stock', kh: 'អស់ស្តុក' },
  remove: { en: 'Remove', kh: 'លុប' },
  edit: { en: 'Edit', kh: 'កែប្រែ' },
  delete: { en: 'Delete', kh: 'លុប' },
  back: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  items: { en: 'Items', kh: 'ទំនិញ' },
  ready: { en: 'Ready to sell', kh: 'រួចរាល់លក់' },
  categories: { en: 'Categories used', kh: 'ប្រភេទបានប្រើ' },
  livePreview: { en: 'Live preview', kh: 'មើលជាមុន' },
  unnamed: { en: 'Unnamed product', kh: 'ផលិតផលគ្មានឈ្មោះ' },
}

export const AddProducts = () => {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
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
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      unit: product.unit || '',
      stock: product.stock !== null && product.stock !== '' ? String(product.stock) : '',
      description: product.description || '',
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
        const newProduct = {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          stock: form.stock ? Number(form.stock) : null,
          image: imagePreview,
        }
        setProducts((prev) => [...prev, newProduct])
        addNotification({
          type: 'product',
          action: 'add',
          title: lang === 'en' ? 'New product added' : 'បានបន្ថែមផលិតផលថ្មី',
          detail: form.name,
        })
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
  const readyCount = products.filter((p) => Number(p.stock) > 0 || p.stock === null).length
  const usedCategories = new Set(products.map((p) => p.category).filter(Boolean)).size
  const inputBase = 'w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-400 focus:bg-slate-950 focus:ring-4 focus:ring-green-500/10'
  const errorInput = 'border-red-500/80 bg-red-500/10 focus:border-red-400 focus:ring-red-500/10'

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-green-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/admin" className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-green-300 transition hover:border-green-400 hover:text-green-200">
              <ChevronLeftIcon /> {TEXTS.back[lang]}
            </Link>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-3xl ring-1 ring-green-400/30">🥬</span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-green-300">B'Groceries stockroom</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">{TEXTS.heroTitle[lang]}</h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{TEXTS.heroSub[lang]}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/40 p-3 backdrop-blur">
            <Stat value={products.length} label={TEXTS.items[lang]} />
            <Stat value={readyCount} label={TEXTS.ready[lang]} />
            <Stat value={usedCategories} label={TEXTS.categories[lang]} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-700/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">{TEXTS.formTitle[lang]}</h2>
              <p className="mt-1 text-sm text-slate-400">{TEXTS.formSub[lang]}</p>
            </div>
            {editingId && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                ✏️ {TEXTS.updateBtn[lang]}
              </span>
            )}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Field label={TEXTS.name[lang]} badge={TEXTS.required[lang]} error={errors.name}>
                <input id="name" name="name" type="text" placeholder={TEXTS.namePlaceholder[lang]} value={form.name} onChange={handleChange} className={`${inputBase} ${errors.name ? errorInput : ''}`} />
              </Field>

              <Field label={TEXTS.category[lang]} badge={TEXTS.required[lang]} error={errors.category}>
                <select id="category" name="category" value={form.category} onChange={handleChange} className={`${inputBase} ${errors.category ? errorInput : ''}`}>
                  <option value="">{TEXTS.categoryPlaceholder[lang]}</option>
                  {CATEGORIES.map((c) => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
              <Field label={TEXTS.price[lang]} badge={TEXTS.required[lang]} error={errors.price}>
                <input id="price" name="price" type="number" min="0" step="0.01" placeholder={TEXTS.pricePlaceholder[lang]} value={form.price} onChange={handleChange} className={`${inputBase} ${errors.price ? errorInput : ''}`} />
              </Field>
              <Field label={TEXTS.oldPrice[lang]} badge={TEXTS.optional[lang]} error={errors.oldPrice} muted>
                <input id="oldPrice" name="oldPrice" type="number" min="0" step="0.01" placeholder={TEXTS.oldPricePlaceholder[lang]} value={form.oldPrice} onChange={handleChange} className={`${inputBase} ${errors.oldPrice ? errorInput : ''}`} />
              </Field>
              <Field label={TEXTS.unit[lang]} badge={TEXTS.optional[lang]} muted>
                <select id="unit" name="unit" value={form.unit} onChange={handleChange} className={inputBase}>
                  <option value="">{TEXTS.unitPlaceholder[lang]}</option>
                  {UNITS.map((u) => <option key={u.en} value={u.en}>{u[lang]}</option>)}
                </select>
              </Field>
              <Field label={TEXTS.stock[lang]} badge={TEXTS.optional[lang]} error={errors.stock} muted>
                <input id="stock" name="stock" type="number" min="0" step="1" placeholder={TEXTS.stockPlaceholder[lang]} value={form.stock} onChange={handleChange} className={`${inputBase} ${errors.stock ? errorInput : ''}`} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
              <Field label={TEXTS.image[lang]} badge={TEXTS.optional[lang]} muted>
                {imagePreview ? (
                  <div className="group relative h-48 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" className="absolute inset-x-4 bottom-4 rounded-xl bg-slate-950/85 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-green-500" onClick={() => { setImage(null); setImagePreview(null) }}>
                      {lang === 'en' ? 'Change image' : 'ផ្លាស់ប្តូររូបថត'}
                    </button>
                  </div>
                ) : (
                  <div
                    className={`flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-slate-950/50 p-5 text-center transition ${dragOver ? 'border-green-300 bg-green-500/10' : 'border-slate-700 hover:border-green-400 hover:bg-green-500/5'}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} className="hidden" />
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-300"><PhotoIcon /></span>
                    <span className="text-sm font-semibold text-slate-300">{TEXTS.imageHint[lang]}</span>
                  </div>
                )}
              </Field>

              <Field label={TEXTS.description[lang]} badge={TEXTS.optional[lang]} muted>
                <textarea id="description" name="description" rows="8" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.description} onChange={handleChange} className={`${inputBase} min-h-48 resize-y`} />
              </Field>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-700/60 pt-5 sm:flex-row">
              <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">
                {editingId ? <CheckIcon /> : <PlusIcon />} {editingId ? TEXTS.updateBtn[lang] : TEXTS.addBtn[lang]}
              </button>
              {editingId && (
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white" onClick={cancelEdit}>
                  <XIcon /> {TEXTS.cancelBtn[lang]}
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-green-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-green-300">{TEXTS.livePreview[lang]}</p>
                <h3 className="mt-1 text-lg font-black text-white">{form.name || TEXTS.unnamed[lang]}</h3>
              </div>
              <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-black text-green-300">${Number(form.price || 0).toFixed(2)}</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/60">
              {imagePreview ? <img src={imagePreview} alt="Preview" className="h-44 w-full object-cover" /> : <div className="flex h-44 items-center justify-center text-5xl">🥦</div>}
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2">
                  {form.category && <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">{getCatLabel(form.category)}</span>}
                  {form.unit && <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">/{getUnitLabel(form.unit)}</span>}
                  {form.stock && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{form.stock} {TEXTS.inStock[lang]}</span>}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-slate-400">{form.description || TEXTS.descriptionPlaceholder[lang]}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{TEXTS.listTitle[lang]}</h3>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-green-500 px-2 text-sm font-black text-slate-950">{products.length}</span>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
                <span className="text-4xl">🛍️</span>
                <p className="mt-3 text-sm leading-6 text-slate-400">{TEXTS.empty[lang]}</p>
              </div>
            ) : (
              <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-900">
                {products.map((p) => (
                  <article key={p.id} className="group rounded-2xl border border-slate-700/70 bg-slate-950/50 p-3 transition hover:border-green-500/50 hover:bg-slate-950">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-2xl">📷</div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-black text-white">{p.name}</h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-bold text-green-300">{getCatLabel(p.category)}</span>
                          {p.unit && <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-300">/{getUnitLabel(p.unit)}</span>}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-white">${p.price.toFixed(2)}</span>
                          {p.oldPrice && <span className="text-xs font-semibold text-slate-500 line-through">${p.oldPrice.toFixed(2)}</span>}
                          {p.stock !== null && p.stock !== '' && (
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${p.stock === 0 ? 'bg-red-500/10 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
                              {p.stock === 0 ? TEXTS.outOfStock[lang] : `${p.stock} ${TEXTS.inStock[lang]}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-100 sm:opacity-70 sm:transition sm:group-hover:opacity-100">
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300" onClick={() => startEdit(p)} aria-label={TEXTS.edit[lang]}>
                          <EditIcon />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => removeProduct(p.id)} aria-label={TEXTS.remove[lang]}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link to="/products" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-green-300 transition hover:border-green-400 hover:bg-green-500/10">
              <EyeIcon /> {TEXTS.viewShop[lang]}
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}

const Stat = ({ value, label }) => (
  <div className="min-w-[86px] rounded-xl bg-slate-900/70 px-4 py-3 text-center ring-1 ring-slate-700/60">
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
  </div>
)

const Field = ({ label, badge, error, muted = false, children }) => (
  <label className="block space-y-2">
    <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-200">
      <span>{label}</span>
      {badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${muted ? 'bg-slate-800 text-slate-500' : 'bg-green-500/10 text-green-300'}`}>{badge}</span>}
    </span>
    {children}
    {error && <span className="block text-xs font-semibold text-red-300">{error}</span>}
  </label>
)

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
