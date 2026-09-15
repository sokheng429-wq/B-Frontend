import { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { COUNTRIES } from '../../data/countries'
import { CountryFlag } from '../../components/CountryFlag'
import { TIMEZONES } from '../../utils/companySettings'
import { outletAPI } from '../../api/api'

// Fallback initial outlets if backend is booting or offline
const FALLBACK_OUTLETS = [
  {
    id: 1,
    code: 'OUT-001',
    description: 'Main Mart Toul Kork',
    secondLanguage: 'សាខាទួលគោក',
    taxOption: 'After Discount',
    displayPrice: 'Tax Inclusive',
    showTaxableProduct: true,
    autoCutSmallExpiredDate: true,
    firstName: 'Dara',
    lastName: 'Vorn',
    taxNo: 'K001-902203111',
    phone: '+855 (0) 23 888 901',
    mobile: '+855 (0) 12 888 901',
    email: 'toulkork@bgroceries.com',
    fax: '+855 (0) 23 888 900',
    website: 'https://bgroceries.com/toulkork',
    address: '#128 St. 598 Sangkat Boeung Kak II, Khan Toul Kork',
    city: 'Phnom Penh',
    state: 'Phnom Penh Capital',
    postCode: '120102',
    country: 'Cambodia',
    timeZone: 'Asia/Phnom_Penh',
    expireDate: '2028-12-31',
    active: true,
  },
  {
    id: 2,
    code: 'OUT-002',
    description: 'BKK1 Flagship Store',
    secondLanguage: 'សាខាបឹងកេងកង១',
    taxOption: 'After Discount',
    displayPrice: 'Tax Exclusive',
    showTaxableProduct: true,
    autoCutSmallExpiredDate: false,
    firstName: 'Piseth',
    lastName: 'Chan',
    taxNo: 'K001-902203112',
    phone: '+855 (0) 23 888 902',
    mobile: '+855 (0) 12 888 902',
    email: 'bkk1@bgroceries.com',
    fax: '+855 (0) 23 888 900',
    website: 'https://bgroceries.com/bkk1',
    address: '#45 St. 51 Sangkat Boeung Keng Kang I, Khan Boeung Keng Kang',
    city: 'Phnom Penh',
    state: 'Phnom Penh Capital',
    postCode: '120102',
    country: 'Cambodia',
    timeZone: 'Asia/Phnom_Penh',
    expireDate: '2028-12-31',
    active: true,
  },
  {
    id: 3,
    code: 'OUT-003',
    description: 'Sen Sok Mega Mart',
    secondLanguage: 'សាខាសែនសុខ',
    taxOption: 'Before Discount',
    displayPrice: 'Tax Inclusive',
    showTaxableProduct: false,
    autoCutSmallExpiredDate: true,
    firstName: 'Bunroeun',
    lastName: 'Sok',
    taxNo: 'K001-902203113',
    phone: '+855 (0) 23 888 903',
    mobile: '+855 (0) 12 888 903',
    email: 'sensok@bgroceries.com',
    fax: '+855 (0) 23 888 900',
    website: 'https://bgroceries.com/sensok',
    address: '#88 St. 1003 Sangkat Phnom Penh Thmey, Khan Sen Sok',
    city: 'Phnom Penh',
    state: 'Phnom Penh Capital',
    postCode: '120102',
    country: 'Cambodia',
    timeZone: 'Asia/Phnom_Penh',
    expireDate: '2028-12-31',
    active: true,
  },
  {
    id: 4,
    code: 'OUT-004',
    description: 'Chbar Ampov Express',
    secondLanguage: 'សាខាច្បារអំពៅ',
    taxOption: 'After Discount',
    displayPrice: 'Tax Inclusive',
    showTaxableProduct: true,
    autoCutSmallExpiredDate: false,
    firstName: 'Channa',
    lastName: 'Seng',
    taxNo: 'K001-902203114',
    phone: '+855 (0) 23 888 904',
    mobile: '+855 (0) 12 888 904',
    email: 'chbarampov@bgroceries.com',
    fax: '+855 (0) 23 888 900',
    website: 'https://bgroceries.com/chbarampov',
    address: 'National Road 1, Sangkat Chbar Ampov, Khan Chbar Ampov',
    city: 'Phnom Penh',
    state: 'Phnom Penh Capital',
    postCode: '120102',
    country: 'Cambodia',
    timeZone: 'Asia/Phnom_Penh',
    expireDate: '2028-12-31',
    active: true,
  },
]

const INITIAL_FORM = {
  id: null,
  code: '',
  description: '',
  secondLanguage: '',
  taxOption: 'After Discount',
  displayPrice: 'Tax Exclusive',
  showTaxableProduct: false,
  autoCutSmallExpiredDate: false,
  imageUrl: '',
  firstName: '',
  lastName: '',
  taxNo: '',
  phone: '',
  mobile: '',
  email: '',
  fax: '',
  website: '',
  address: '#128 St. 598 Sangkat Boeung Kak II, Khan Toul Kork',
  city: 'Phnom Penh',
  state: 'Phnom Penh Capital',
  postCode: '120102',
  country: 'Cambodia',
  timeZone: 'Asia/Phnom_Penh',
  expireDate: '2028-12-31',
  active: true,
}

// Searchable Country Select Dropdown
function CountrySelect({ value, onChange, isDark, lang }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const needle = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!needle) return COUNTRIES
    return COUNTRIES.filter((c) =>
      [c.en, c.kh, c.code].some((v) => String(v || '').toLowerCase().includes(needle))
    )
  }, [needle])

  const selectedCountry = COUNTRIES.find((c) => c.en === value) || COUNTRIES.find((c) => c.code === 'KH')

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-left text-xs font-semibold outline-none transition ${
          isDark
            ? 'border-slate-700/80 bg-slate-950 text-white hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
        } ${open ? (isDark ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-emerald-500 ring-2 ring-emerald-500/20') : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedCountry ? (
            <>
              <CountryFlag code={selectedCountry.code} className="h-4 w-6 min-w-[24px] rounded object-cover shadow-xs" />
              <span className="truncate font-semibold">{lang === 'kh' ? selectedCountry.kh : selectedCountry.en}</span>
              <span
                className={`shrink-0 rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                  isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {selectedCountry.code}
              </span>
            </>
          ) : (
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              {lang === 'en' ? 'Select Country...' : 'ជ្រើសរើសប្រទេស...'}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? 'rotate-180 text-emerald-400' : isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col ${
            isDark
              ? 'border-slate-700 bg-slate-900/95 text-white shadow-black/60'
              : 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-300/50'
          }`}
        >
          <div className={`p-2 border-b ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search country name or code...' : 'ស្វែងរកឈ្មោះ ឬកូដប្រទេស...'}
                className={`w-full rounded-xl border py-1.5 pl-8 pr-3 text-xs outline-none transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:border-emerald-400'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                }`}
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-48 p-1 space-y-0.5 scrollbar-thin">
            {filtered.length > 0 ? (
              filtered.map((c) => {
                const isSelected = selectedCountry?.code === c.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.en)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-xs transition ${
                      isSelected
                        ? isDark
                          ? 'bg-emerald-600/30 text-emerald-300 font-bold'
                          : 'bg-emerald-50 text-emerald-700 font-bold'
                        : isDark
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <CountryFlag code={c.code} className="h-4 w-6 shrink-0 rounded object-cover shadow-xs" />
                    <span className="flex-1 truncate">{lang === 'kh' ? c.kh : c.en}</span>
                    <span className={`font-mono text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {c.code}
                    </span>
                  </button>
                )
              })
            ) : (
              <p className={`p-4 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {lang === 'en' ? 'No country matches your search' : 'រកមិនឃើញប្រទេសដែលត្រូវគ្នាទេ'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OutletManagement() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()

  // Search Filter State
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('Any') // Any, Code, Description, Display Price
  const [filterStatus, setFilterStatus] = useState('All') // All, Active, Inactive

  // Outlets List State
  const [outlets, setOutlets] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackMsg, setFeedbackMsg] = useState(null) // { type: 'success'|'error', text: '' }

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [formError, setFormError] = useState('')
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  // Map Modal State for Phnom Penh Pinpoint
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [mapAddressInput, setMapAddressInput] = useState('')

  // Delete Confirmation Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [outletToDelete, setOutletToDelete] = useState(null)

  // Fetch Outlets from Backend API with Fallback
  const fetchOutlets = async () => {
    setLoading(true)
    try {
      const res = await outletAPI.getAll({
        search: searchText,
        searchBy: searchBy === 'Any' ? '' : searchBy,
        status: filterStatus === 'All' ? '' : filterStatus,
      })
      if (res && res.data) {
        setOutlets(res.data)
      } else {
        applyClientFilter()
      }
    } catch (err) {
      console.warn('Backend API request failed, applying local fallback:', err)
      applyClientFilter()
    } finally {
      setLoading(false)
    }
  }

  // Filter fallback for offline/local simulation
  const applyClientFilter = () => {
    let list = [...FALLBACK_OUTLETS]
    if (filterStatus === 'Active') list = list.filter((o) => o.active)
    if (filterStatus === 'Inactive') list = list.filter((o) => !o.active)

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      list = list.filter((o) => {
        const code = (o.code || '').toLowerCase()
        const desc = (o.description || '').toLowerCase()
        const disp = (o.displayPrice || '').toLowerCase()
        const sec = (o.secondLanguage || '').toLowerCase()

        if (searchBy === 'Code') return code.includes(q)
        if (searchBy === 'Description') return desc.includes(q)
        if (searchBy === 'Display Price') return disp.includes(q)
        return code.includes(q) || desc.includes(q) || disp.includes(q) || sec.includes(q)
      })
    }
    setOutlets(list)
  }

  useEffect(() => {
    let active = true
    outletAPI
      .getAll({})
      .then((res) => {
        if (!active) return
        if (res?.data) {
          setOutlets(res.data)
        } else {
          setOutlets(FALLBACK_OUTLETS)
        }
      })
      .catch((err) => {
        if (!active) return
        console.warn('Backend API request failed, applying local fallback:', err)
        setOutlets(FALLBACK_OUTLETS)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ type, text })
    setTimeout(() => setFeedbackMsg(null), 3500)
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    fetchOutlets()
  }

  const handleResetSearch = () => {
    setSearchText('')
    setSearchBy('Any')
    setFilterStatus('All')
    setTimeout(() => {
      outletAPI
        .getAll({})
        .then((res) => {
          if (res?.data) setOutlets(res.data)
          else setOutlets(FALLBACK_OUTLETS)
        })
        .catch(() => setOutlets(FALLBACK_OUTLETS))
    }, 50)
  }

  // Auto Generate Code helper
  const handleAutoGenerateCode = async () => {
    try {
      const res = await outletAPI.getNextCode()
      if (res?.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }))
        return
      }
    } catch (err) {
      console.warn('Could not fetch next code from backend, generating locally:', err)
    }
    // Local fallback generator
    const existing = outlets.map((o) => o.code || '')
    let max = 0
    existing.forEach((c) => {
      const m = c.match(/OUT-(\d+)/i)
      if (m && parseInt(m[1], 10) > max) max = parseInt(m[1], 10)
    })
    const nextCode = `OUT-${String(max + 1).padStart(3, '0')}`
    setFormData((prev) => ({ ...prev, code: nextCode }))
  }

  // Open Create Modal
  const handleOpenCreate = async () => {
    setIsEditing(false)
    setFormError('')
    setImageError('')
    setFormData({
      ...INITIAL_FORM,
      code: '',
    })
    setModalOpen(true)
    // Automatically pre-generate code
    try {
      const res = await outletAPI.getNextCode()
      if (res?.data?.code) {
        setFormData((prev) => ({ ...prev, code: res.data.code }))
      } else {
        const nextCode = `OUT-${String(outlets.length + 1).padStart(3, '0')}`
        setFormData((prev) => ({ ...prev, code: nextCode }))
      }
    } catch (err) {
      console.warn('Could not pre-fetch next code:', err)
      const nextCode = `OUT-${String(outlets.length + 1).padStart(3, '0')}`
      setFormData((prev) => ({ ...prev, code: nextCode }))
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (outlet) => {
    setIsEditing(true)
    setFormError('')
    setImageError('')
    setFormData({
      ...INITIAL_FORM,
      ...outlet,
    })
    setModalOpen(true)
  }

  // Handle Image Upload with 1MB & .jpg, .jpeg, .png validation
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    setImageError('')
    if (!file) return

    // Valid formats: .jpg, .jpeg, .png
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png']
    const hasValidExt = validExtensions.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name)
    if (!hasValidExt) {
      setImageError(
        lang === 'en'
          ? 'Invalid format. Only .jpg, .jpeg, and .png are allowed.'
          : 'ទម្រង់ឯកសារមិនត្រឹមត្រូវ។ អនុញ្ញាតតែ .jpg, .jpeg និង .png ប៉ុណ្ណោះ។'
      )
      return
    }

    // Size limit: 1 MB (1,048,576 bytes)
    const MAX_SIZE = 1 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setImageError(
        lang === 'en'
          ? `Size is over 1 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB). Must not be over 1 MB.`
          : `ទំហំឯកសារលើស 1 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB)។ ត្រូវតែមិនលើសពី 1 MB។`
      )
      return
    }

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({ ...prev, imageUrl: uploadEvent.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Save / Submit Outlet Form
  const handleSaveOutlet = async (e) => {
    if (e) e.preventDefault()
    setFormError('')

    // Required Field Validation: Outlet *
    if (!formData.description?.trim()) {
      setFormError(
        lang === 'en' ? 'Outlet * name is required.' : 'សូមបញ្ចូលឈ្មោះច្រកលក់ (Outlet *)។'
      )
      return
    }

    setSaving(true)
    try {
      if (isEditing && formData.id) {
        const res = await outletAPI.update(formData.id, formData)
        if (res?.data) {
          setOutlets((prev) => prev.map((o) => (o.id === formData.id ? res.data : o)))
        } else {
          setOutlets((prev) => prev.map((o) => (o.id === formData.id ? { ...formData } : o)))
        }
        showFeedback(lang === 'en' ? 'Outlet updated successfully.' : 'ច្រកលក់ត្រូវបានកែប្រែដោយជោគជ័យ។')
      } else {
        const res = await outletAPI.create(formData)
        if (res?.data) {
          setOutlets((prev) => [res.data, ...prev])
        } else {
          const newOutlet = {
            ...formData,
            id: Date.now(),
            code: formData.code || `OUT-${String(outlets.length + 1).padStart(3, '0')}`,
          }
          setOutlets((prev) => [newOutlet, ...prev])
        }
        showFeedback(lang === 'en' ? 'Outlet created successfully.' : 'ច្រកលក់ត្រូវបានបង្កើតដោយជោគជ័យ។')
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err.message || (lang === 'en' ? 'Failed to save outlet.' : 'មិនអាចរក្សាទុកច្រកលក់បានទេ។'))
    } finally {
      setSaving(false)
    }
  }

  // Toggle Outlet Active Status
  const handleToggleActive = async (outlet) => {
    const updatedStatus = !outlet.active
    try {
      await outletAPI.toggleStatus(outlet.id, updatedStatus)
    } catch (err) {
      console.warn('Failed to update status on server:', err)
    }
    setOutlets((prev) =>
      prev.map((o) => (o.id === outlet.id ? { ...o, active: updatedStatus } : o))
    )
    showFeedback(
      lang === 'en'
        ? `Outlet ${outlet.code} marked ${updatedStatus ? 'Active' : 'Inactive'}.`
        : `ច្រកលក់ ${outlet.code} បានប្តូរទៅជា ${updatedStatus ? 'សកម្ម' : 'អសកម្ម'}។`
    )
  }

  // Prompt Delete
  const handlePromptDelete = (outlet) => {
    setOutletToDelete(outlet)
    setDeleteConfirmOpen(true)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!outletToDelete) return
    try {
      await outletAPI.delete(outletToDelete.id)
    } catch (err) {
      console.warn('Failed to delete on server:', err)
    }
    setOutlets((prev) => prev.filter((o) => o.id !== outletToDelete.id))
    showFeedback(
      lang === 'en' ? `Outlet ${outletToDelete.code} deleted successfully.` : `ច្រកលក់ ${outletToDelete.code} ត្រូវបានលុប។`,
      'success'
    )
    setDeleteConfirmOpen(false)
    setOutletToDelete(null)
  }

  // Open Phnom Penh Map Modal
  const handleOpenMapModal = () => {
    setMapAddressInput(formData.address || '#128 St. 598 Toul Kork, Phnom Penh, Cambodia')
    setMapModalOpen(true)
  }

  const handleApplyMapAddress = (addr) => {
    setFormData((prev) => ({ ...prev, address: addr }))
    setMapModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-bold shadow-lg animate-in fade-in duration-200 ${
            feedbackMsg.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/80 text-rose-300'
          }`}
        >
          <span className="text-base">{feedbackMsg.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: SEARCH OUTLET                                 */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white' : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                🔍
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'Search Outlet' : 'ស្វែងរកច្រកលក់ (Search Outlet)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Search outlet by any condition. Ex(Any, Code, Description...)'
                : 'ស្វែងរកច្រកលក់តាមលក្ខខណ្ឌណាមួយ ឧទាហរណ៍ (ទាំងអស់ កូដ ការពិពណ៌នា...)'}
            </p>
          </div>

          {/* "+ Create" Action Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition active:scale-95 cursor-pointer self-start sm:self-center shrink-0"
          >
            <span className="text-base leading-none">+</span>
            <span>{lang === 'en' ? 'Create Outlet' : 'បង្កើតច្រកលក់ថ្មី'}</span>
          </button>
        </div>

        {/* Search Filter Controls */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
          {/* Search - Textbox */}
          <div className="sm:col-span-5 space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en' ? 'Search' : 'ស្វែងរក (Search)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={lang === 'en' ? 'Search by condition...' : 'បញ្ចូលពាក្យគន្លឹះស្វែងរក...'}
                className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
                }`}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search By - Dropdown (Code, Description, Display Price) */}
          <div className="sm:col-span-3 space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en' ? 'Search By' : 'ស្វែងរកតាម (Search By)'}
            </label>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
              }`}
            >
              <option value="Any">{lang === 'en' ? 'Any Condition' : 'គ្រប់លក្ខខណ្ឌ (Any)'}</option>
              <option value="Code">{lang === 'en' ? 'Code' : 'កូដ (Code)'}</option>
              <option value="Description">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា (Description)'}</option>
              <option value="Display Price">{lang === 'en' ? 'Display Price' : 'តម្លៃបង្ហាញ (Display Price)'}</option>
            </select>
          </div>

          {/* Status - Dropdown (Active, All, Inactive) */}
          <div className="sm:col-span-2 space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en' ? 'Status' : 'ស្ថានភាព (Status)'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-950 text-white focus:border-emerald-400'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
              }`}
            >
              <option value="All">{lang === 'en' ? 'All' : 'ទាំងអស់ (All)'}</option>
              <option value="Active">{lang === 'en' ? 'Active' : 'សកម្ម (Active)'}</option>
              <option value="Inactive">{lang === 'en' ? 'Inactive' : 'អសកម្ម (Inactive)'}</option>
            </select>
          </div>

          {/* Search Button & Reset */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
            >
              <span>🔍</span>
              <span>{lang === 'en' ? 'Search' : 'ស្វែងរក'}</span>
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              title={lang === 'en' ? 'Reset search' : 'កំណត់ឡើងវិញ'}
              className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔄
            </button>
          </div>
        </form>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: OUTLET LIST TABLE                             */}
      {/* ======================================================== */}
      <section
        className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 transition-colors ${
          isDark ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/40 text-white' : 'border-slate-200 bg-white shadow-slate-200/50 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 text-sm font-bold">
                🏢
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-['Montserrat']">
                {lang === 'en' ? 'Outlet List' : 'បញ្ជីច្រកលក់ (Outlet List)'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'en'
                ? 'Show information of Outlet. Ex(Code, Description, Second Language...)'
                : 'បង្ហាញព័ត៌មានលម្អិតរបស់ច្រកលក់ ឧទាហរណ៍ (កូដ ការពិពណ៌នា ភាសាទីពីរ...)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                isDark ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-slate-100 text-emerald-700 border border-slate-200'
              }`}
            >
              {outlets.length} {lang === 'en' ? 'Outlets' : 'ច្រកលក់'}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className={`overflow-x-auto rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <th className="py-3.5 px-4">{lang === 'en' ? 'Code' : 'កូដ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Description' : 'ការពិពណ៌នា'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Display Price' : 'តម្លៃបង្ហាញ'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Expire Date' : 'កាលបរិច្ឆេទផុតកំណត់'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'en' ? 'Active' : 'សកម្ម'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Actions' : 'សកម្មភាព'}</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/70' : 'divide-slate-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-xs text-slate-400">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    {lang === 'en' ? 'Loading outlets from database...' : 'កំពុងផ្ទុកទិន្នន័យច្រកលក់...'}
                  </td>
                </tr>
              ) : outlets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center space-y-2">
                    <div className="text-3xl">🏢</div>
                    <p className="text-xs font-bold text-slate-400">
                      {lang === 'en' ? 'No outlet found matching your search condition.' : 'រកមិនឃើញច្រកលក់ដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។'}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Reset search filters' : 'សម្អាតលក្ខខណ្ឌស្វែងរក'}
                    </button>
                  </td>
                </tr>
              ) : (
                outlets.map((outlet) => (
                  <tr
                    key={outlet.id || outlet.code}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}
                  >
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      <div className="flex items-center gap-2">
                        {outlet.imageUrl ? (
                          <img
                            src={outlet.imageUrl}
                            alt=""
                            className="h-7 w-7 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 shrink-0">
                            🏢
                          </span>
                        )}
                        <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {outlet.code}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                      <span className={isDark ? 'text-white' : 'text-slate-950'}>{outlet.description || '—'}</span>
                      {outlet.city && (
                        <span className="block text-[10px] text-slate-400 font-normal truncate">
                          {outlet.address ? `${outlet.address}, ` : ''}{outlet.city}
                        </span>
                      )}
                    </td>

                    {/* Second Language */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {outlet.secondLanguage || '—'}
                    </td>

                    {/* Display Price */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          outlet.displayPrice === 'Tax Inclusive'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {outlet.displayPrice || 'Tax Inclusive'}
                      </span>
                    </td>

                    {/* Expire Date */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {outlet.expireDate || '—'}
                    </td>

                    {/* Active */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(outlet)}
                        title={lang === 'en' ? 'Click to toggle status' : 'ចុចដើម្បីប្តូរស្ថានភាព'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition active:scale-95 ${
                          outlet.active
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            outlet.active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        <span>{outlet.active ? (lang === 'en' ? 'Active' : 'សកម្ម') : (lang === 'en' ? 'Inactive' : 'អសកម្ម')}</span>
                      </button>
                    </td>

                    {/* Actions: edit button and delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(outlet)}
                          title={lang === 'en' ? 'Edit Outlet' : 'កែប្រែច្រកលក់'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition border border-blue-500/20 active:scale-95 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(outlet)}
                          title={lang === 'en' ? 'Delete Outlet' : 'លុបច្រកលក់'}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition border border-rose-500/20 active:scale-95 cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CREATE / EDIT OUTLET MODAL DIALOG            */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl p-5 sm:p-7 space-y-6 scrollbar-thin ${
              isDark ? 'border-slate-800 bg-[#0f172a] text-white shadow-black/80' : 'border-slate-200 bg-white text-slate-900 shadow-slate-400/50'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 border-slate-700/50">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-lg font-bold shadow-md shadow-emerald-500/20">
                  🏢
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight font-['Montserrat']">
                    {isEditing
                      ? lang === 'en' ? 'Edit Outlet Information' : 'កែប្រែព័ត៌មានច្រកលក់'
                      : lang === 'en' ? 'Create New Outlet' : 'បង្កើតច្រកលក់ថ្មី'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Configure general details, picture upload, contact credentials, and location map.'
                      : 'បំពេញព័ត៌មានទូទៅ រូបភាព ទំនាក់ទំនង និងផែនទីទីតាំង។'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error alerts */}
            {formError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs font-bold text-rose-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}
            {imageError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-3 text-xs font-bold text-rose-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{imageError}</span>
              </div>
            )}

            <form onSubmit={handleSaveOutlet} className="space-y-6">
              {/* ---------------------------------------------------- */}
              {/* 3.1 GENERAL INFORMATION                              */}
              {/* ---------------------------------------------------- */}
              <div className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="border-b pb-2 border-slate-700/40">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <span>📌</span>
                    <span>{lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ (General Information)'}</span>
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Input the general outlet information and image with format (.jpg, .jpeg, .png) Size: Must not be over 1 MB'
                      : 'បញ្ចូលព័ត៌មានទូទៅរបស់ច្រកលក់ និងរូបភាពដែលមានទម្រង់ (.jpg, .jpeg, .png) ទំហំ៖ ត្រូវតែមិនលើសពី 1 MB'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Left sub-column for text inputs */}
                  <div className="sm:col-span-8 space-y-3.5">
                    {/* Code & Active */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {lang === 'en' ? 'Code - Auto Generate' : 'កូដច្រកលក់ (Code)'}
                          </label>
                          <button
                            type="button"
                            onClick={handleAutoGenerateCode}
                            className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                          >
                            ⚡ {lang === 'en' ? 'Auto Generate' : 'បង្កើតកូដស្វ័យប្រវត្តិ'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="OUT-001"
                          className={`w-full rounded-xl border px-3.5 py-2 font-mono text-xs font-bold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-emerald-400 focus:border-emerald-400'
                              : 'border-slate-300 bg-white text-emerald-700 focus:border-emerald-500 shadow-xs'
                          }`}
                        />
                      </div>

                      {/* Active - Tickbox */}
                      <div className="flex items-center h-10">
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 cursor-pointer"
                          />
                          <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                            {lang === 'en' ? 'Active' : 'សកម្ម (Active)'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Outlet * & Second Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Outlet *' : 'ឈ្មោះច្រកលក់ * (Outlet *)'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={lang === 'en' ? 'e.g. Main Mart Toul Kork' : 'ឧ. សាខាទួលគោក'}
                          className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-emerald-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ (Second Language)'}
                        </label>
                        <input
                          type="text"
                          value={formData.secondLanguage}
                          onChange={(e) => setFormData({ ...formData, secondLanguage: e.target.value })}
                          placeholder={lang === 'en' ? 'e.g. សាខាទួលគោក' : 'ឧ. Toul Kork Branch'}
                          className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-emerald-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Tax Option & Display Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Tax Option' : 'ជម្រើសពន្ធ (Tax Option)'}
                        </label>
                        <select
                          value={formData.taxOption}
                          onChange={(e) => setFormData({ ...formData, taxOption: e.target.value })}
                          className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-emerald-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                          }`}
                        >
                          <option value="After Discount">{lang === 'en' ? 'After Discount' : 'ក្រោយបញ្ចុះតម្លៃ (After Discount)'}</option>
                          <option value="Before Discount">{lang === 'en' ? 'Before Discount' : 'មុនបញ្ចុះតម្លៃ (Before Discount)'}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Display Price' : 'តម្លៃបង្ហាញ (Display Price)'}
                        </label>
                        <select
                          value={formData.displayPrice}
                          onChange={(e) => setFormData({ ...formData, displayPrice: e.target.value })}
                          className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-emerald-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500 shadow-xs'
                          }`}
                        >
                          <option value="Tax Exclusive">{lang === 'en' ? 'Tax Exclusive' : 'មិនរួមបញ្ចូលពន្ធ (Tax Exclusive)'}</option>
                          <option value="Tax Inclusive">{lang === 'en' ? 'Tax Inclusive' : 'រួមបញ្ចូលពន្ធ (Tax Inclusive)'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Show Taxable product & Auto cut small expired date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.showTaxableProduct}
                          onChange={(e) => setFormData({ ...formData, showTaxableProduct: e.target.checked })}
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 cursor-pointer"
                        />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {lang === 'en' ? 'Show Taxable product' : 'បង្ហាញទំនិញជាប់ពន្ធ'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.autoCutSmallExpiredDate}
                          onChange={(e) => setFormData({ ...formData, autoCutSmallExpiredDate: e.target.checked })}
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 cursor-pointer"
                        />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {lang === 'en' ? 'Auto cut small expired date' : 'កាត់កាលបរិច្ឆេទផុតកំណត់ខ្លីដោយស្វ័យប្រវត្តិ'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Right sub-column for Image Upload Frame & Preview */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {formData.imageUrl ? (
                      <div className="relative group w-full flex flex-col items-center">
                        <div className="h-32 w-full max-w-[200px] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shadow-md">
                          <img
                            src={formData.imageUrl}
                            alt="Outlet"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-bold text-white transition cursor-pointer"
                          >
                            {lang === 'en' ? 'Change' : 'ប្តូររូបភាព'}
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="rounded-lg bg-rose-900/40 hover:bg-rose-800/60 px-2.5 py-1 text-[11px] font-bold text-rose-300 transition cursor-pointer"
                          >
                            {lang === 'en' ? 'Remove' : 'លុប'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-36 flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-slate-800/40 transition p-3 space-y-1.5"
                      >
                        <span className="text-3xl">🖼️</span>
                        <p className="text-xs font-bold text-slate-300">
                          {lang === 'en' ? 'Upload Picture' : 'ផ្ទុកឡើងរូបភាព'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'en' ? '.jpg, .jpeg, .png (Max 1 MB)' : '.jpg, .jpeg, .png (អតិបរមា 1 MB)'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 3.2 CONTACT & LOCATION (2-Column Below General)      */}
              {/* ---------------------------------------------------- */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* LEFT SIDE: Contact Information */}
                <div className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="border-b pb-2 border-slate-700/40">
                    <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                      <span>📞</span>
                      <span>{lang === 'en' ? 'Contact Information' : 'ព័ត៌មានទំនាក់ទំនង (Contact Information)'}</span>
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'en'
                        ? 'Contact information of outlet. Ex(Phone, Mobile, Email...)'
                        : 'ព័ត៌មានទំនាក់ទំនងរបស់ច្រកលក់ ឧទាហរណ៍ (ទូរស័ព្ទ អ៊ីមែល...)'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'First Name' : 'នាមខ្លួន (First Name)'}
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Dara"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Last Name' : 'គោត្តនាម (Last Name)'}
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Vorn"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Tax Nº */}
                    <div className="space-y-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lang === 'en' ? 'Tax Nº' : 'លេខសម្គាល់ពន្ធ (Tax Nº)'}
                      </label>
                      <input
                        type="text"
                        value={formData.taxNo}
                        onChange={(e) => setFormData({ ...formData, taxNo: e.target.value })}
                        placeholder="K001-902203111"
                        className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                          isDark
                            ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                            : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                        }`}
                      />
                    </div>

                    {/* Phone & Mobile */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Phone' : 'ទូរស័ព្ទ (Phone)'}
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+855 (0) 23 888 901"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Mobile' : 'ទូរស័ព្ទដៃ (Mobile)'}
                        </label>
                        <input
                          type="text"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder="+855 (0) 12 888 901"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lang === 'en' ? 'Email' : 'អ៊ីមែល (Email)'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="outlet@bgroceries.com"
                        className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                          isDark
                            ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                            : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                        }`}
                      />
                    </div>

                    {/* Fax & Website */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Fax' : 'ទូរសារ (Fax)'}
                        </label>
                        <input
                          type="text"
                          value={formData.fax}
                          onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                          placeholder="+855 23 888 900"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Website' : 'គេហទំព័រ (Website)'}
                        </label>
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://bgroceries.com"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-blue-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Location Information */}
                <div className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="border-b pb-2 border-slate-700/40">
                    <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <span>📍</span>
                      <span>{lang === 'en' ? 'Location Information' : 'ព័ត៌មានទីតាំង (Location Information)'}</span>
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {lang === 'en'
                        ? 'Location information of outlet this on the right side below General Information'
                        : 'ព័ត៌មានទីតាំងច្រកលក់នៅផ្នែកខាងស្តាំក្រោមព័ត៌មានទូទៅ'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Address - textbox and icon of map */}
                    <div className="space-y-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lang === 'en' ? 'Address (with Map Pointer)' : 'អាសយដ្ឋាន (Address)'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="#128 St. 598 Toul Kork, Phnom Penh"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleOpenMapModal}
                          title={lang === 'en' ? 'Click to show Phnom Penh Map and pin address' : 'ចុចដើម្បីបង្ហាញផែនទីរាជធានីភ្នំពេញ'}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer shrink-0"
                        >
                          <span>🗺️</span>
                          <span className="hidden sm:inline">{lang === 'en' ? 'Map' : 'ផែនទី'}</span>
                        </button>
                      </div>
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'City' : 'ទីក្រុង (City)'}
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Phnom Penh"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'State' : 'ខេត្ត/រាជធានី (State)'}
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="Phnom Penh Capital"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Post Code & Expire Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Post Code' : 'លេខកូដប្រៃសណីយ៍ (Post Code)'}
                        </label>
                        <input
                          type="text"
                          value={formData.postCode}
                          onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                          placeholder="120102"
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {lang === 'en' ? 'Expire Date' : 'កាលបរិច្ឆេទផុតកំណត់'}
                        </label>
                        <input
                          type="date"
                          value={formData.expireDate || ''}
                          onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                          className={`w-full rounded-xl border px-3.5 py-1.5 text-xs font-semibold outline-none transition ${
                            isDark
                              ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                              : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Country - Dropdown */}
                    <div className="space-y-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lang === 'en' ? 'Country' : 'ប្រទេស (Country)'}
                      </label>
                      <CountrySelect
                        value={formData.country}
                        onChange={(c) => setFormData({ ...formData, country: c })}
                        isDark={isDark}
                        lang={lang}
                      />
                    </div>

                    {/* Time Zone - Dropdown */}
                    <div className="space-y-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {lang === 'en' ? 'Time Zone' : 'តំបន់ម៉ោង (Time Zone)'}
                      </label>
                      <select
                        value={formData.timeZone}
                        onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${
                          isDark
                            ? 'border-slate-700 bg-slate-900 text-white focus:border-cyan-400'
                            : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 shadow-xs'
                        }`}
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz.id} value={tz.id}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      <span>{lang === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...'}</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>
                        {isEditing
                          ? lang === 'en' ? 'Save Changes' : 'រក្សាទុកការកែប្រែ'
                          : lang === 'en' ? 'Create Outlet' : 'បង្កើតច្រកលក់'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: PHNOM PENH INTERACTIVE MAP POPUP MODAL        */}
      {/* ======================================================== */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a] text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between border-b pb-3 border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 text-lg">
                  🗺️
                </span>
                <div>
                  <h3 className="text-base font-black font-['Montserrat']">
                    {lang === 'en' ? 'Phnom Penh Outlet Map Pinpoint' : 'ផែនទីទីតាំងច្រកលក់ រាជធានីភ្នំពេញ'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'en'
                      ? 'Point and preview outlet address on Phnom Penh city map'
                      : 'ចង្អុលបង្ហាញ និងមើលទីតាំងច្រកលក់លើផែនទីរាជធានីភ្នំពេញ'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick District Presets */}
            <div className="space-y-1.5">
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'en' ? 'Phnom Penh Main Districts:' : 'ខណ្ឌសំខាន់ៗនៅរាជធានីភ្នំពេញ៖'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Toul Kork (ទួលគោក)', addr: '#128 St. 598 Sangkat Boeung Kak II, Khan Toul Kork, Phnom Penh' },
                  { label: 'BKK1 (បឹងកេងកង)', addr: '#45 St. 51 Sangkat Boeung Keng Kang I, Khan Boeung Keng Kang, Phnom Penh' },
                  { label: 'Sen Sok (សែនសុខ)', addr: '#88 St. 1003 Sangkat Phnom Penh Thmey, Khan Sen Sok, Phnom Penh' },
                  { label: 'Daun Penh (ដូនពេញ)', addr: '#18 Preah Norodom Blvd, Sangkat Phsar Thmey, Khan Daun Penh, Phnom Penh' },
                  { label: 'Chbar Ampov (ច្បារអំពៅ)', addr: 'National Road 1, Sangkat Chbar Ampov, Khan Chbar Ampov, Phnom Penh' },
                ].map((dist) => (
                  <button
                    key={dist.label}
                    type="button"
                    onClick={() => setMapAddressInput(dist.addr)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      mapAddressInput === dist.addr
                        ? 'bg-cyan-600 text-white font-bold'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {dist.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Address input inside Map Modal */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📍</span>
              <input
                type="text"
                value={mapAddressInput}
                onChange={(e) => setMapAddressInput(e.target.value)}
                placeholder="Type address in Phnom Penh..."
                className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs font-semibold outline-none transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-cyan-400'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-500'
                }`}
              />
            </div>

            {/* Interactive Embedded Map View Centered on Phnom Penh */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-inner">
              <iframe
                title="Phnom Penh Outlet Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  mapAddressInput ? `${mapAddressInput}, Phnom Penh, Cambodia` : 'Phnom Penh, Cambodia'
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                📌 {lang === 'en' ? 'Marker points to:' : 'ទីតាំងចង្អុលបង្ហាញ៖'}{' '}
                <strong className="text-cyan-400">{mapAddressInput || 'Phnom Penh'}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMapModalOpen(false)}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                      : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'en' ? 'Close' : 'បិទ'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyMapAddress(mapAddressInput)}
                  className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
                >
                  {lang === 'en' ? 'Confirm Address' : 'យល់ព្រមអាសយដ្ឋាន'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: DELETE CONFIRMATION MODAL                     */}
      {/* ======================================================== */}
      {deleteConfirmOpen && outletToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 space-y-4 shadow-2xl ${
              isDark ? 'border-slate-800 bg-[#0f172a] text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 text-2xl font-bold">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-black font-['Montserrat']">
                  {lang === 'en' ? 'Delete Outlet Branch?' : 'លុបច្រកលក់នេះ?'}
                </h3>
                <p className="text-xs text-slate-400">
                  {outletToDelete.code} — {outletToDelete.description}
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {lang === 'en'
                ? `Are you sure you want to permanently delete outlet "${outletToDelete.description}" (${outletToDelete.code})? This action cannot be undone.`
                : `តើអ្នកប្រាកដជាចង់លុបច្រកលក់ "${outletToDelete.description}" (${outletToDelete.code}) ជាអចិន្ត្រៃយ៍មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'en' ? 'Cancel' : 'បោះបង់'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition active:scale-95 cursor-pointer"
              >
                {lang === 'en' ? 'Delete Permanently' : 'លុបជាអចិន្ត្រៃយ៍'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
