import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { adminProductAPI } from '../../api/api'

// Categories / units shown in the dropdowns. Values are stored as plain
// strings on the Product entity (master-data pages can upgrade these to
// foreign keys later without changing the API shape).
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
  { en: 'kg', kh: 'គីឡូ' },
  { en: 'g', kh: 'ក្រាម' },
  { en: 'L', kh: 'លីត្រ' },
  { en: 'ml', kh: 'មីលីលីត្រ' },
  { en: 'box', kh: 'ប្រអប់' },
  { en: 'bag', kh: 'កាបូប' },
  { en: 'bottle', kh: 'ដប' },
  { en: 'pack', kh: 'កញ្ចប់' },
  { en: 'piece', kh: 'ដុំ' },
]

const PRODUCT_TYPES = [
  { en: 'Stock item', kh: 'ទំនិញមានស្តុក' },
  { en: 'Non-stock item', kh: 'ទំនិញគ្មានស្តុក' },
  { en: 'Service', kh: 'សេវាកម្ម' },
]

const COUNTRIES = [
  { en: 'Cambodia', kh: 'កម្ពុជា' },
  { en: 'Thailand', kh: 'ថៃ' },
  { en: 'Vietnam', kh: 'វៀតណាម' },
  { en: 'China', kh: 'ចិន' },
  { en: 'Japan', kh: 'ជប៉ុន' },
  { en: 'Korea', kh: 'កូរ៉េ' },
  { en: 'USA', kh: 'អាមេរិក' },
]

// Blank product form. Keys mirror the backend ProductDto exactly — the extra
// ERP-style fields (upc/ean/hsCode/reorderPoint…) stay client-side until the
// backend grows matching columns.
const EMPTY_FORM = {
  code: '',
  barCode: '',
  name: '',
  nameKh: '',
  description: '',
  productGroup: '',
  category: '',
  uom: '',
  basePrice: '',
  averageCost: '',
  standardCost: '',
  country: '',
  brand: '',
  active: true,
  outOfStock: false,
  favorite: false,
  imageUrl: '',
  // Sale Option card — serialize/expired are client-side until the backend
  // grows matching columns; allowDiscount + tax map to the real DTO.
  serialize: false,
  expired: false,
  allowDiscount: true,
  tax: '',
}

// number-or-null helper: '' → null, otherwise Number()
const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v))
const str = (v) => (v == null ? '' : String(v))

const TEXTS = {
  pageTitle: { en: 'Add Product', kh: 'បន្ថែមផលិតផល' },
  back: { en: 'Products hub', kh: 'ផ្ទាំងផលិតផល' },
  // section headers
  primaryInfo: { en: 'Primary Information', kh: 'ព័ត៌មានចម្បង' },
  idsInfo: { en: 'IDs Information', kh: 'ព័ត៌មានអត្តសញ្ញាណ' },
  saleOption: { en: 'Sale Option', kh: 'ជម្រើសលក់' },
  serialize: { en: 'Serialize', kh: 'លេខសៀរៀល' },
  expired: { en: 'Expired', kh: 'មានថ្ងៃផុតកំណត់' },
  allowDiscount: { en: 'Allow Discount', kh: 'អនុញ្ញាតបញ្ចុះតម្លៃ' },
  taxLabel: { en: 'Tax', kh: 'ពន្ធ' },
  taxPlaceholder: { en: 'Select tax', kh: 'ជ្រើសរើសពន្ធ' },
  uomInfo: { en: 'Unit of measure information', kh: 'ព័ត៌មានឯកតាវាស់' },
  priceInfo: { en: 'Product price information', kh: 'ព័ត៌មានតម្លៃផលិតផល' },
  orderCost: { en: 'Order Point and Cost Option', kh: 'ចំណុចបញ្ជាទិញ និងចំណាយ' },
  images: { en: 'Images', kh: 'រូបភាព' },
  productOption: { en: 'Product Option', kh: 'ជម្រើសផលិតផល' },
  sellOOS: { en: 'Sell on out of stock', kh: 'លក់ពេលអស់ស្តុក' },
  favoriteCard: { en: 'Favorite Product', kh: 'ផលិតផលដែលចូលចិត្ត' },
  // fields
  code: { en: 'Code', kh: 'កូដ' },
  codePlaceholder: { en: 'Type your own or click Auto', kh: 'បញ្ចូលខ្លួនឯង ឬចុច ស្វ័យប្រវត្តិ' },
  autoGen: { en: 'Auto', kh: 'ស្វ័យប្រវត្តិ' },
  autoGenTitle: {
    en: 'Generate the next free product code automatically — or clear this field and type your own',
    kh: 'បង្កើតកូដផលិតផលបន្ទាប់ដោយស្វ័យប្រវត្តិ — ឬសម្អាតចំណុចនេះហើយបញ្ចូលដោយខ្លួនឯង',
  },
  genFailed: { en: 'Could not reach the server — generated from time instead.', kh: 'មិនអាចទាក់ទងម៉ាស៊ីនមេបានទេ — បង្កើតពីពេលវេលាជំនួស។' },
  active: { en: 'Active', kh: 'ដំណើរការ' },
  description: { en: 'Description', kh: 'ការពិពណ៌នា' },
  descriptionPlaceholder: { en: 'e.g. Fresh strawberries', kh: 'ឧ. ផ្លែស្ត្របឺរីស្រស់' },
  secondLang: { en: 'Second Language', kh: 'ភាសាទី២' },
  secondLangPlaceholder: { en: 'ឧ. ផ្លែស្ត្របឺរីស្រស់', kh: 'ឧ. ផ្លែស្ត្របឺរីស្រស់' },
  longDescription: { en: 'Long Description', kh: 'ការពិពណ៌នាវែង' },
  longDescriptionPlaceholder: { en: 'Describe freshness, origin, packaging, or customer notes...', kh: 'ពិពណ៌នាអំពីភាពស្រស់ ប្រភព ការវេចខ្ចប់ ឬកំណត់ចំណាំ...' },
  upc: { en: 'UPC', kh: 'UPC' },
  ean: { en: 'EAN', kh: 'EAN' },
  hsCode: { en: 'HS-Code', kh: 'កូដ HS' },
  uom: { en: 'UOM', kh: 'ឯកតាវាស់' },
  unitPlaceholder: { en: 'Select unit', kh: 'ជ្រើសរើសឯកតា' },
  barcode: { en: 'Barcode', kh: 'បារកូដ' },
  defaultCol: { en: 'Default', kh: 'លំនាំដើម' },
  factor: { en: 'Factor', kh: 'កត្តា' },
  addRow: { en: 'Add +', kh: 'បន្ថែម +' },
  currency: { en: 'Currency', kh: 'រូបិយប័ណ្ណ' },
  price: { en: 'Price', kh: 'តម្លៃ' },
  standardCost: { en: 'Standard Cost', kh: 'ចំណាយស្តង់ដារ' },
  reorderPoint: { en: 'Re-Order Point', kh: 'ចំណុចបញ្ជាទិញឡើងវិញ' },
  maxOverPo: { en: 'Max Received Over PO', kh: 'អតិបរមាលើ PO' },
  orderQty: { en: 'Order QTY', kh: 'បរិមាណបញ្ជាទិញ' },
  uploadHint: { en: 'Drop an image here, or click to browse', kh: 'ទម្លាក់រូបថតនៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' },
  productType: { en: 'Product Type', kh: 'ប្រភេទផលិតផល' },
  productTypePlaceholder: { en: 'Select product type', kh: 'ជ្រើសរើសប្រភេទផលិតផល' },
  productGroup: { en: 'Product Group', kh: 'ក្រុមផលិតផល' },
  groupPlaceholder: { en: 'Select product group', kh: 'ជ្រើសរើសក្រុមផលិតផល' },
  category: { en: 'Category', kh: 'ប្រភេទ' },
  categoryPlaceholder: { en: 'Select category', kh: 'ជ្រើសរើសប្រភេទ' },
  brand: { en: 'Brand', kh: 'ម៉ាក' },
  brandPlaceholder: { en: 'Select brand', kh: 'ជ្រើសរើសម៉ាក' },
  country: { en: 'Country', kh: 'ប្រទេស' },
  countryPlaceholder: { en: 'Select country', kh: 'ជ្រើសរើសប្រទេស' },
  tags: { en: 'Tags', kh: 'ស្លាក' },
  tagsPlaceholder: { en: 'Select tags', kh: 'ជ្រើសរើសស្លាក' },
  enableOOS: { en: 'Enable out of stock product', kh: 'បើកផលិតផលអស់ស្តុក' },
  favoriteLabel: { en: 'Favorite Product', kh: 'ផលិតផលដែលចូលចិត្ត' },
  saveBtn: { en: 'Save product', kh: 'រក្សាទុកផលិតផល' },
  updateBtn: { en: 'Update product', kh: 'ធ្វើបច្ចុប្បន្នភាពផលិតផល' },
  cancelBtn: { en: 'Cancel', kh: 'បោះបង់' },
  errName: { en: 'Description is required', kh: 'ត្រូវការការពិពណ៌នា' },
  errPrice: { en: 'Enter a valid non-negative number', kh: 'បញ្ចូលលេខត្រឹមត្រូវ (មិនអវិជ្ជមាន)' },
  loadFailed: { en: 'Could not load products from the server. Please refresh or check your login.', kh: 'មិនអាចផ្ទុកផលិតផលពីម៉ាស៊ីនមេបានទេ។ សូមព្យាយាមម្តងទៀត។' },
}

// blank UOM table row — the first row starts as the default
const EMPTY_UOM_ROW = () => ({ id: Date.now() + Math.random(), uom: '', barcode: '', isDefault: false, factor: '1', active: true })

export const AddProducts = () => {
  const { lang } = useLanguage()
  const { addNotification } = useNotifications()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [form, setForm] = useState(EMPTY_FORM)
  // product-code generator: null = nothing generated yet
  const [codeHint, setCodeHint] = useState(null)
  // client-side ERP extras (not yet columns on the backend ProductDto)
  const [upc, setUpc] = useState('')
  const [ean, setEan] = useState('')
  const [hsCode, setHsCode] = useState('')
  const [productType, setProductType] = useState('')
  const [tags, setTags] = useState('')
  const [reorderPoint, setReorderPoint] = useState('')
  const [maxOverPo, setMaxOverPo] = useState('')
  const [orderQty, setOrderQty] = useState('')
  const [uomRows, setUomRows] = useState([{ ...EMPTY_UOM_ROW(), isDefault: true }])
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [loadError, setLoadError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // DTO → form state for editing (deep link ?id=<n> from All Products).
  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      ...EMPTY_FORM,
      code: str(p.code),
      barCode: str(p.barCode),
      name: str(p.name),
      nameKh: str(p.nameKh),
      description: str(p.description),
      productGroup: str(p.productGroup),
      category: CATEGORIES.some((c) => c.en === p.category) ? p.category : str(p.category),
      uom: UNITS.some((u) => u.en === p.uom) ? p.uom : str(p.uom),
      basePrice: p.basePrice == null ? '' : String(p.basePrice),
      averageCost: p.averageCost == null ? '' : String(p.averageCost),
      standardCost: p.standardCost == null ? '' : String(p.standardCost),
      country: str(p.country),
      brand: str(p.brand),
      active: p.active !== false,
      outOfStock: !!p.outOfStock,
      favorite: !!p.favorite,
      imageUrl: str(p.imageUrl),
      serialize: !!p.serial,
      expired: !!p.expiryDate,
      allowDiscount: p.allowDiscount !== false,
      tax: str(p.tax ?? ''),
    })
    setUpc(str(p.barCode))
    setUomRows([{ ...EMPTY_UOM_ROW(), uom: UNITS.some((u) => u.en === p.uom) ? p.uom : str(p.uom), barcode: str(p.barCode), isDefault: true }])
    setImageFile(null)
    setImagePreview(p.imageUrl || null)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- Product code: two options — Auto-generate or type your own. -------
  // "Auto" scans existing codes on the backend, picks the next free number
  // after the highest one (PRD-0001 → PRD-0002), and guarantees uniqueness.
  // The field stays fully editable either way: clear it and type any code.
  const generateCode = () => {
    setCodeHint(null)
    adminProductAPI
      .getAll()
      .then((res) => {
        const codes = (Array.isArray(res?.data) ? res.data : [])
          .map((p) => str(p.code).trim())
          .filter(Boolean)
        // find the highest trailing number across all existing codes
        let max = 0
        codes.forEach((c) => {
          const m = c.match(/(\d+)\s*$/)
          if (m) max = Math.max(max, parseInt(m[1], 10))
        })
        let candidate = `PRD-${String(max + 1).padStart(4, '0')}`
        // skip collisions just in case (e.g. someone already used PRD-0042 manually)
        while (codes.includes(candidate)) {
          max += 1
          candidate = `PRD-${String(max + 1).padStart(4, '0')}`
        }
        setForm((prev) => ({ ...prev, code: candidate }))
      })
      .catch(() => {
        // offline fallback — timestamp-based so it's still unique-ish
        setForm((prev) => ({ ...prev, code: `PRD-${Date.now().toString().slice(-6)}` }))
        setCodeHint(TEXTS.genFailed[lang])
      })
  }

  const clearCode = () => setForm((prev) => ({ ...prev, code: '' }))

  // Load live products so the ?id= deep link can open a product in edit mode.
  useEffect(() => {
    let cancelled = false
    adminProductAPI
      .getAll()
      .then((res) => {
        if (cancelled || !Array.isArray(res?.data)) return
        const editId = Number(searchParams.get('id'))
        if (editId) {
          const target = res.data.find((p) => p.id === editId)
          if (target) startEdit(target)
          setSearchParams({}, { replace: true })
        }
      })
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleToggle = (name) =>
    setForm((prev) => ({ ...prev, [name]: !prev[name] }))

  // Convert the picked file into a compressed base64 data URL so it is saved
  // WITH the product (in imageUrl) instead of a temporary browser-only
  // blob: URL that disappears after the page is left — that was why images
  // vanished after saving. Downscale to max 640px / ~80% JPEG to keep the
  // payload small enough for the database column.
  const handleImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const MAX = 640
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        setImagePreview(canvas.toDataURL('image/jpeg', 0.8))
        setImageFile(file)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImage(file)
  }

  const setUomRow = (id, patch) =>
    setUomRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const setDefaultUomRow = (id) =>
    setUomRows((prev) => prev.map((r) => ({ ...r, isDefault: r.id === id })))

  const addUomRow = () => setUomRows((prev) => [...prev, EMPTY_UOM_ROW()])

  const removeUomRow = (id) =>
    setUomRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = TEXTS.errName[lang]
    if (form.basePrice !== '' && (isNaN(form.basePrice) || Number(form.basePrice) < 0)) e.basePrice = TEXTS.errPrice[lang]
    if (form.standardCost !== '' && (isNaN(form.standardCost) || Number(form.standardCost) < 0)) e.standardCost = TEXTS.errPrice[lang]
    return e
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setUpc('')
    setEan('')
    setHsCode('')
    setProductType('')
    setTags('')
    setReorderPoint('')
    setMaxOverPo('')
    setOrderQty('')
    setUomRows([{ ...EMPTY_UOM_ROW(), isDefault: true }])
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0 || saving) return

    const defaultRow = uomRows.find((r) => r.isDefault) || uomRows[0]

    // Image is kept as a URL field; a picked local file is previewed and its
    // object URL stored until an upload endpoint exists.
    const payload = {
      ...form,
      barCode: upc || defaultRow?.barcode || form.barCode || null,
      imageUrl: imageFile ? imagePreview : (form.imageUrl?.trim() || imagePreview || null),
      basePrice: num(form.basePrice),
      averageCost: num(form.averageCost),
      standardCost: num(form.standardCost),
      tax: form.tax === '' ? null : Number(form.tax),
      expiryDate: null,
    }

    try {
      setSaving(true)
      let saved
      if (editingId) {
        saved = await adminProductAPI.update(editingId, payload)
        addNotification({
          type: 'product',
          action: 'edit',
          title: lang === 'en' ? 'Product updated' : 'បានធ្វើបច្ចុប្បន្នភាពផលិតផល',
          detail: form.name,
        })
      } else {
        saved = await adminProductAPI.create(payload)
        addNotification({
          type: 'product',
          action: 'add',
          title: lang === 'en' ? 'New product added' : 'បានបន្ថែមផលិតផលថ្មី',
          detail: form.name,
        })
      }
      cancelEdit()
      // jump straight to All Products so the saved product is visible there
      navigate('/admin/products/all')
      return saved
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  const inputBase = 'w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-400 focus:bg-slate-950 focus:ring-4 focus:ring-green-500/10'
  const errorInput = 'border-red-500/80 bg-red-500/10 focus:border-red-400 focus:ring-red-500/10'

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/products" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900 text-slate-400 transition hover:border-green-400 hover:text-green-300" aria-label={TEXTS.back[lang]}>
              <ChevronLeftIcon />
            </Link>
            <h1 className="text-xl font-black tracking-tight text-white">{editingId ? TEXTS.updateBtn[lang] : TEXTS.pageTitle[lang]}</h1>
          </div>
          {editingId && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
              ID #{editingId}
            </span>
          )}
        </div>

        {(loadError || errors.submit) && (
          <p className={`rounded-xl border px-4 py-3 text-sm font-semibold ${errors.submit ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-amber-500/40 bg-amber-500/10 text-amber-200'}`}>
            {errors.submit || TEXTS.loadFailed[lang]}
          </p>
        )}

        {/* 70 / 30 two-column grid */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            {/* ===================== LEFT COLUMN ===================== */}
            <div className="space-y-5">
              {/* --- Primary Information --- */}
              <Card title={TEXTS.primaryInfo[lang]}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Code + Active checkbox */}
                    <Field label={TEXTS.code[lang]} error={errors.code}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <input
                          id="code"
                          name="code"
                          type="text"
                          placeholder={TEXTS.codePlaceholder?.[lang] || ''}
                          value={form.code}
                          onChange={handleChange}
                          className={`${inputBase} max-w-[220px]`}
                        />
                        <button
                          type="button"
                          onClick={generateCode}
                          title={TEXTS.autoGenTitle[lang]}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                            form.code
                              ? 'border-slate-700 text-slate-300 hover:border-green-400 hover:text-green-300'
                              : 'border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500 hover:text-slate-950'
                          }`}
                        >
                          <SparkIcon /> {TEXTS.autoGen[lang]}
                        </button>
                        {form.code && (
                          <button
                            type="button"
                            onClick={clearCode}
                            aria-label={TEXTS.cancelBtn[lang]}
                            title={TEXTS.autoGenTitle[lang]}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
                          >
                            <XSmallIcon />
                          </button>
                        )}
                      </div>
                      {codeHint && <p className="mt-1.5 text-xs font-semibold text-orange-400">{codeHint}</p>}
                      <label className="mt-2.5 flex cursor-pointer select-none items-center gap-2 text-sm font-semibold text-slate-300">
                        <input type="checkbox" checked={form.active} onChange={() => handleToggle('active')} className="h-4 w-4 cursor-pointer accent-green-500" />
                        {TEXTS.active[lang]}
                      </label>
                    </Field>

                    <Field label={TEXTS.secondLang[lang]}>
                      <input id="nameKh" name="nameKh" type="text" placeholder={TEXTS.secondLangPlaceholder[lang]} value={form.nameKh} onChange={handleChange} className={`${inputBase} ${errors.nameKh ? errorInput : ''}`} />
                    </Field>
                  </div>

                  <Field label={TEXTS.description[lang]} badge required error={errors.name}>
                    <input id="name" name="name" type="text" placeholder={TEXTS.descriptionPlaceholder[lang]} value={form.name} onChange={handleChange} className={`${inputBase} ${errors.name ? errorInput : ''}`} />
                  </Field>

                  {/* Long Description — rich-text-editor style */}
                  <Field label={TEXTS.longDescription[lang]}>
                    <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/60 transition focus-within:border-green-400 focus-within:bg-slate-950 focus-within:ring-4 focus-within:ring-green-500/10">
                      <div className="flex items-center gap-1 border-b border-slate-700/60 bg-slate-900/60 px-2 py-1.5">
                        <ToolbarButton title="Bold"><BoldIcon /></ToolbarButton>
                        <ToolbarButton title="Italic"><ItalicIcon /></ToolbarButton>
                        <ToolbarButton title="Underline"><UnderlineIcon /></ToolbarButton>
                        <span className="mx-1 h-4 w-px bg-slate-700" />
                        <ToolbarButton title="Bullet list"><ListIcon /></ToolbarButton>
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        rows="6"
                        placeholder={TEXTS.longDescriptionPlaceholder[lang]}
                        value={form.description}
                        onChange={handleChange}
                        className="block w-full resize-y border-0 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                      />
                    </div>
                  </Field>
                </div>
              </Card>

              {/* --- Sale Option --- */}
              <Card title={TEXTS.saleOption[lang]}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <CheckTile label={TEXTS.serialize[lang]} checked={form.serialize} onChange={() => handleToggle('serialize')} />
                  <CheckTile label={TEXTS.expired[lang]} checked={form.expired} onChange={() => handleToggle('expired')} />
                  <CheckTile label={TEXTS.allowDiscount[lang]} checked={form.allowDiscount} onChange={() => handleToggle('allowDiscount')} />
                  <Field label={TEXTS.taxLabel[lang]}>
                    <select name="tax" value={form.tax} onChange={handleChange} className={inputBase}>
                      <option value="">{TEXTS.taxPlaceholder[lang]}</option>
                      <option value="0">0% (None)</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                    </select>
                  </Field>
                </div>
              </Card>

              {/* --- IDs Information --- */}
              <Card title={TEXTS.idsInfo[lang]}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label={TEXTS.upc[lang]}>
                    <input id="upc" type="text" value={upc} onChange={(e) => setUpc(e.target.value)} className={inputBase} />
                  </Field>
                  <Field label={TEXTS.ean[lang]}>
                    <input id="ean" type="text" value={ean} onChange={(e) => setEan(e.target.value)} className={inputBase} />
                  </Field>
                  <Field label={TEXTS.hsCode[lang]}>
                    <input id="hsCode" type="text" value={hsCode} onChange={(e) => setHsCode(e.target.value)} className={inputBase} />
                  </Field>
                </div>
              </Card>

              {/* --- Unit of measure information --- */}
              <Card
                title={TEXTS.uomInfo[lang]}
                action={
                  <button type="button" onClick={addUomRow} className="inline-flex items-center gap-1 rounded-lg border border-green-500/50 px-3 py-1 text-xs font-bold text-green-300 transition hover:bg-green-500 hover:text-slate-950">
                    <PlusIcon /> {TEXTS.addRow[lang]}
                  </button>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/60 text-xs font-bold uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2">{TEXTS.uom[lang]}</th>
                        <th className="px-3 py-2">{TEXTS.barcode[lang]}</th>
                        <th className="px-3 py-2 text-center">{TEXTS.defaultCol[lang]}</th>
                        <th className="px-3 py-2">{TEXTS.factor[lang]}</th>
                        <th className="px-3 py-2 text-center">{TEXTS.active[lang]}</th>
                        <th className="w-10 px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {uomRows.map((row, i) => (
                        <tr key={row.id} className="border-b border-slate-800/60 last:border-0">
                          <td className="px-3 py-2">
                            <select value={row.uom} onChange={(e) => setUomRow(row.id, { uom: e.target.value })} className={inputBase}>
                              <option value="">{TEXTS.unitPlaceholder[lang]}</option>
                              {UNITS.map((u) => <option key={u.en} value={u.en}>{u[lang]}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={row.barcode} onChange={(e) => setUomRow(row.id, { barcode: e.target.value })} className={inputBase} />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input type="radio" name="uom-default" checked={row.isDefault} onChange={() => setDefaultUomRow(row.id)} className="h-4 w-4 cursor-pointer accent-green-500" aria-label={`${TEXTS.defaultCol[lang]} ${i + 1}`} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" min="0" step="any" value={row.factor} onChange={(e) => setUomRow(row.id, { factor: e.target.value })} className={inputBase} />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input type="checkbox" checked={row.active} onChange={() => setUomRow(row.id, { active: !row.active })} className="h-4 w-4 cursor-pointer accent-green-500" aria-label={`${TEXTS.active[lang]} ${i + 1}`} />
                          </td>
                          <td className="px-3 py-2 text-center">
                            {uomRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeUomRow(row.id)}
                                className="transition hover:scale-110"
                                style={{ color: '#FF9900' }}
                                aria-label="Remove row"
                                title="Remove row"
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* --- Product price information --- */}
              <Card title={TEXTS.priceInfo[lang]}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/60 text-xs font-bold uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2">{TEXTS.description[lang]}</th>
                        <th className="px-3 py-2">{TEXTS.uom[lang]}</th>
                        <th className="px-3 py-2">{TEXTS.currency[lang]}</th>
                        <th className="px-3 py-2">{TEXTS.price[lang]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/60 last:border-0">
                        <td className="px-3 py-2 text-slate-200">{form.name || '—'}</td>
                        <td className="px-3 py-2 text-slate-200">{uomRows.find((r) => r.isDefault)?.uom || '—'}</td>
                        <td className="px-3 py-2 text-slate-200">USD</td>
                        <td className="px-3 py-2">
                          <input id="basePrice" name="basePrice" type="number" min="0" step="0.01" placeholder="0.00" value={form.basePrice} onChange={handleChange} className={`${inputBase} max-w-[140px] ${errors.basePrice ? errorInput : ''}`} />
                          {errors.basePrice && <span className="mt-1 block text-xs font-semibold text-red-300">{errors.basePrice}</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* --- Order Point and Cost Option --- */}
              <Card title={TEXTS.orderCost[lang]}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label={TEXTS.standardCost[lang]} error={errors.standardCost}>
                    <div className={`flex items-center overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/60 transition focus-within:border-green-400 focus-within:bg-slate-950 focus-within:ring-4 focus-within:ring-green-500/10 ${errors.standardCost ? 'border-red-500/80' : ''}`}>
                      <span className="border-r border-slate-700/70 bg-slate-900/60 px-3 py-2.5 text-sm font-bold text-slate-400">$</span>
                      <input id="standardCost" name="standardCost" type="number" min="0" step="0.01" placeholder="0.00" value={form.standardCost} onChange={handleChange} className="w-full px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500" />
                    </div>
                  </Field>
                  <Field label={TEXTS.reorderPoint[lang]}>
                    <input id="reorderPoint" type="number" min="0" step="any" value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} className={inputBase} />
                  </Field>
                  <Field label={TEXTS.maxOverPo[lang]}>
                    <input id="maxOverPo" type="number" min="0" step="any" value={maxOverPo} onChange={(e) => setMaxOverPo(e.target.value)} className={inputBase} />
                  </Field>
                  <Field label={TEXTS.orderQty[lang]}>
                    <input id="orderQty" type="number" min="0" step="any" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} className={inputBase} />
                  </Field>
                </div>
              </Card>
            </div>

            {/* ===================== RIGHT COLUMN ===================== */}
            <div className="space-y-5">
              {/* --- Images --- */}
              <Card title={TEXTS.images[lang]}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* saved image thumbnail (grayed placeholder when empty) */}
                    <div className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border ${imagePreview ? 'border-slate-700/70 bg-slate-950' : 'border-slate-800 bg-slate-900/60'}`}>
                      {imagePreview
                        ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" onError={() => setImagePreview(null)} />
                        : <span className="text-slate-700"><PhotoIcon /></span>}
                    </div>
                    {/* upload slot */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-slate-950/50 transition ${dragOver ? 'border-green-300 bg-green-500/10' : 'border-slate-700 hover:border-green-400 hover:bg-green-500/5'}`}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} className="hidden" />
                      <span className="text-green-300/70"><UploadIcon /></span>
                      <span className="px-2 text-center text-[11px] leading-4 text-slate-500">{TEXTS.uploadHint[lang]}</span>
                    </button>
                  </div>
                  {(imageFile || imagePreview) && (
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(form.imageUrl || null); if (fileRef.current) fileRef.current.value = '' }} className="w-full rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-400 transition hover:border-red-400 hover:text-red-300">
                      Remove image
                    </button>
                  )}
                </div>
              </Card>

              {/* --- Product Option --- */}
              <Card title={TEXTS.productOption[lang]}>
                <div className="space-y-4">
                  <Field label={TEXTS.productType[lang]}>
                    <select value={productType} onChange={(e) => setProductType(e.target.value)} className={inputBase}>
                      <option value="">{TEXTS.productTypePlaceholder[lang]}</option>
                      {PRODUCT_TYPES.map((t) => <option key={t.en} value={t.en}>{t[lang]}</option>)}
                    </select>
                  </Field>
                  <Field label={TEXTS.productGroup[lang]}>
                    <select name="productGroup" value={form.productGroup} onChange={handleChange} className={inputBase}>
                      <option value="">{TEXTS.groupPlaceholder[lang]}</option>
                      {['Grocery', 'Beverage', 'Household'].map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label={TEXTS.category[lang]}>
                    <select name="category" value={form.category} onChange={handleChange} className={inputBase}>
                      <option value="">{TEXTS.categoryPlaceholder[lang]}</option>
                      {CATEGORIES.map((c) => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                    </select>
                  </Field>
                  <Field label={TEXTS.brand[lang]}>
                    <select name="brand" value={form.brand} onChange={handleChange} className={inputBase}>
                      <option value="">{TEXTS.brandPlaceholder[lang]}</option>
                      {['B\'Groceries', 'Generic', 'Imported'].map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label={TEXTS.country[lang]}>
                    <select name="country" value={form.country} onChange={handleChange} className={inputBase}>
                      <option value="">{TEXTS.countryPlaceholder[lang]}</option>
                      {COUNTRIES.map((c) => <option key={c.en} value={c.en}>{c[lang]}</option>)}
                    </select>
                  </Field>
                  <Field label={TEXTS.tags[lang]}>
                    <select value={tags} onChange={(e) => setTags(e.target.value)} className={inputBase}>
                      <option value="">{TEXTS.tagsPlaceholder[lang]}</option>
                      {['New', 'Organic', 'Promo', 'Best seller'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
              </Card>

              {/* --- Sell on out of stock --- */}
              <Card title={TEXTS.sellOOS[lang]}>
                <label className="flex cursor-pointer select-none items-center gap-3 text-sm font-semibold text-slate-300">
                  <input type="checkbox" checked={form.outOfStock} onChange={() => handleToggle('outOfStock')} className="h-4 w-4 cursor-pointer accent-green-500" />
                  {TEXTS.enableOOS[lang]}
                </label>
              </Card>

              {/* --- Favorite Product --- */}
              <Card title={TEXTS.favoriteCard[lang]}>
                <label className="flex cursor-pointer select-none items-center gap-3 text-sm font-semibold text-slate-300">
                  <input type="checkbox" checked={form.favorite} onChange={() => handleToggle('favorite')} className="h-4 w-4 cursor-pointer accent-green-500" />
                  {TEXTS.favoriteLabel[lang]}
                </label>
              </Card>
            </div>

            {/* --- Action bar --- */}
            <div className="xl:col-span-2">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-4 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">{errors.submit || (editingId ? `${TEXTS.updateBtn[lang]} #${editingId}` : '')}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-2.5 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">
                      {TEXTS.cancelBtn[lang]}
                    </button>
                  )}
                  <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-green-500 px-6 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                    {saving ? '…' : editingId ? TEXTS.updateBtn[lang] : TEXTS.saveBtn[lang]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------- shared building blocks ---------- */

const Card = ({ title, action, children }) => (
  <section className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl shadow-black/20">
    <header className="flex items-center justify-between gap-3 border-l-4 border-green-500 bg-slate-800/50 px-4 py-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">{title}</h2>
      {action}
    </header>
    <div className="p-4 md:p-5">{children}</div>
  </section>
)

const Field = ({ label, badge = false, required = false, error, children }) => (
  <label className="block space-y-1.5">
    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
      {label}
      {badge && required && <span style={{ color: '#FF9900' }}>*</span>}
    </span>
    {children}
    {error && <span className="block text-xs font-semibold text-red-300">{error}</span>}
  </label>
)

const ToolbarButton = ({ title, children }) => (
  <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} className="flex h-7 w-7 items-center justify-center rounded text-slate-400 transition hover:bg-slate-700 hover:text-white">
    {children}
  </button>
)

// checkbox tile for the Sale Option card — green checked state with a white
// checkmark, per the enterprise form design
const CheckTile = ({ label, checked, onChange }) => (
  <label
    className={`flex cursor-pointer select-none items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
      checked
        ? 'border-green-500/60 bg-green-500/10 text-green-200'
        : 'border-slate-700/70 bg-slate-950/60 text-slate-300 hover:border-slate-600'
    }`}
  >
    <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border-2 transition ${
        checked ? 'border-green-500 bg-green-500' : 'border-slate-600 bg-transparent'
      }`}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
    {label}
  </label>
)

/* ---------- icons ---------- */

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const XSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SparkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const PhotoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const BoldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
    <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
  </svg>
)

const ItalicIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
)

const UnderlineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 3v7a6 6 0 0 0 12 0V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
)

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

export default AddProducts
