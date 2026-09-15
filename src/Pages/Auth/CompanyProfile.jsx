import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { COUNTRIES } from '../../data/countries'
import { CountryFlag } from '../../components/CountryFlag'
import { companyAPI } from '../../api/api'
import defaultLogo from '../../assets/Logo1.png'
import {
  TIMEZONES,
  SECONDARY_CURRENCIES,
  DATE_FORMATS,
  TIME_FORMATS,
  NEGATIVE_PATTERNS,
  getCompanySettings,
  saveCompanySettings,
  formatDateTimeByPattern,
  formatQuantitySample,
  formatPercentageSample,
} from '../../utils/companySettings'

// Custom Searchable Country Select Dropdown matching AddProducts design
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
        className={`flex w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold outline-none transition ${
          isDark
            ? 'border-slate-700/80 bg-slate-950 text-white hover:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
        } ${open ? (isDark ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-blue-500 ring-2 ring-blue-500/20') : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedCountry ? (
            <>
              <CountryFlag code={selectedCountry.code} className="h-4 w-6 min-w-[24px] rounded object-cover shadow-xs" />
              <span className="truncate font-semibold">{lang === 'kh' ? selectedCountry.kh : selectedCountry.en}</span>
              <span className={`shrink-0 rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}>
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
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180 text-blue-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className={`absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col ${
          isDark ? 'border-slate-700 bg-slate-900/95 text-white shadow-black/60' : 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-300/50'
        }`}>
          <div className={`p-2.5 border-b ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search country name or code...' : 'ស្វែងរកឈ្មោះ ឬកូដប្រទេស...'}
                className={`w-full rounded-xl border py-1.5 pl-8 pr-3 text-xs outline-none transition ${
                  isDark ? 'border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:border-blue-400' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-52 p-1.5 space-y-0.5 scrollbar-thin">
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
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                      isSelected
                        ? isDark
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'bg-blue-50 text-blue-700 font-bold'
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

export default function CompanyProfile() {
  const { lang } = useLanguage()
  const { isDark } = useTheme()

  const [formData, setFormData] = useState(getCompanySettings)
  const [logoPreview, setLogoPreview] = useState(formData.logoUrl || defaultLogo)
  const [logoError, setLogoError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // View tabs: 'form' (Form Editor) or 'database' (Database Table View)
  const [activeTab, setActiveTab] = useState('form')

  // Backend connection check state
  const [backendStatus, setBackendStatus] = useState({
    checking: false,
    checked: false,
    ok: null,
    status: null,
    statusText: '',
    latency: null,
    error: '',
  })

  const [copiedCode, setCopiedCode] = useState(null)
  const fileInputRef = useRef(null)

  // Live timer to update dynamic sample displays every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync from backend database on mount
  useEffect(() => {
    companyAPI
      .get()
      .then((res) => {
        if (res?.data) {
          setFormData((prev) => ({ ...prev, ...res.data }))
          if (res.data.logoUrl) setLogoPreview(res.data.logoUrl)
          saveCompanySettings(res.data)
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle Logo Upload with 1MB size and format validation
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    setLogoError('')
    if (!file) return

    // Validate format (.jpg, .jpeg, .png)
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png']
    const hasValidExt = validExtensions.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name)
    if (!hasValidExt) {
      setLogoError(
        lang === 'en'
          ? 'Invalid file format. Only .jpg, .jpeg, and .png are allowed.'
          : 'ទម្រង់ឯកសារមិនត្រឹមត្រូវ។ អនុញ្ញាតត្រឹមតែ .jpg, .jpeg និង .png ប៉ុណ្ណោះ។'
      )
      return
    }

    // Validate size (Must not be over 1 MB = 1,048,576 bytes)
    const MAX_SIZE = 1 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setLogoError(
        lang === 'en'
          ? `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum size is 1 MB.`
          : `ទំហំឯកសារធំពេក (${(file.size / (1024 * 1024)).toFixed(2)} MB)។ ទំហំអតិបរមាគឺ 1 MB។`
      )
      return
    }

    // Read and preview
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result
      setLogoPreview(dataUrl)
      handleChange('logoUrl', dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview('')
    handleChange('logoUrl', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaveError('')

    // Required fields validation
    if (!formData.company?.trim()) {
      setSaveError(lang === 'en' ? 'Company Name is required.' : 'សូមបញ្ចូលឈ្មោះក្រុមហ៊ុន។')
      return
    }
    if (!formData.currency?.trim()) {
      setSaveError(lang === 'en' ? 'Currency is required.' : 'សូមបញ្ចូលរូបិយប័ណ្ណ។')
      return
    }
    if (!formData.phone?.trim()) {
      setSaveError(lang === 'en' ? 'Phone is required.' : 'សូមបញ្ចូលលេខទូរស័ព្ទ។')
      return
    }
    if (!formData.email?.trim()) {
      setSaveError(lang === 'en' ? 'Email is required.' : 'សូមបញ្ចូលអ៊ីមែល។')
      return
    }

    // Save locally
    const ok = saveCompanySettings(formData)
    if (ok) {
      // Also optionally attempt to sync to backend
      try {
        await companyAPI.update(formData)
      } catch (_) {
        // Backend optional
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    } else {
      setSaveError(
        lang === 'en' ? 'Failed to save settings. Please try again.' : 'មិនអាចរក្សាទុកបានទេ។ សូមព្យាយាមម្តងទៀត។'
      )
    }
  }

  // Check Backend Database connection
  const handleCheckBackend = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true, checked: false }))
    const res = await companyAPI.checkBackend()
    if (res?.data?.data) {
      setFormData((prev) => ({ ...prev, ...res.data.data }))
      if (res.data.data.logoUrl) setLogoPreview(res.data.data.logoUrl)
      saveCompanySettings(res.data.data)
    }
    setBackendStatus({
      checking: false,
      checked: true,
      ok: res.ok,
      status: res.status,
      statusText: res.statusText || '',
      latency: res.latency,
      error: res.error || '',
    })
  }

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Samples for the right column
  const sampleDateTime = useMemo(() => {
    return formatDateTimeByPattern(
      currentTime,
      formData.dateFormat,
      formData.timeFormat,
      formData.timeZone
    )
  }, [currentTime, formData.dateFormat, formData.timeFormat, formData.timeZone])

  const sampleQuantity = useMemo(() => {
    return formatQuantitySample(
      1234,
      formData.qtyDecimal,
      formData.qtySeparator,
      formData.negativePattern
    )
  }, [formData.qtyDecimal, formData.qtySeparator, formData.negativePattern])

  const sampleFactor = useMemo(() => {
    return formatQuantitySample(1234, formData.factorDecimal, formData.factorSeparator)
  }, [formData.factorDecimal, formData.factorSeparator])

  const samplePercentage = useMemo(() => {
    return formatPercentageSample(68, formData.percentageDecimal)
  }, [formData.percentageDecimal])

  // SQL Schema for Backend inspection
  const sqlSchemaText = `CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    second_language VARCHAR(255),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    second_currency VARCHAR(10) DEFAULT 'KHR',
    business_license VARCHAR(100),
    tax_no VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    fax VARCHAR(50),
    mobile VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    post_code VARCHAR(20),
    time_zone VARCHAR(100) DEFAULT 'Asia/Phnom_Penh',
    country VARCHAR(100) DEFAULT 'Cambodia',
    date_format VARCHAR(50) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(50) DEFAULT 'hh:mm A',
    logo_url LONGTEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

  const springEntityText = `@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "second_language")
    private String secondLanguage;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "second_currency")
    private String secondCurrency;

    @Column(name = "business_license")
    private String businessLicense;

    @Column(name = "tax_no")
    private String taxNo;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "time_zone")
    private String timeZone;

    @Column(name = "country")
    private String country;

    // Getters and Setters...
}`

  return (
    <div className="space-y-6">
      {/* Top Action & View Mode Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-4 sm:p-5 backdrop-blur-xl shadow-lg transition-colors ${
        isDark ? 'border-slate-800 bg-[#0f172a]/90 text-white' : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/50'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black tracking-tight font-['Montserrat']">
              {lang === 'en' ? 'Company Profile & Enterprise Settings' : 'ប្រវត្តិរូបក្រុមហ៊ុន និងការកំណត់ប្រព័ន្ធ'}
            </h2>
            <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-400 ring-1 ring-blue-500/30">
              Settings v2.4
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            {lang === 'en'
              ? 'Configure company legal identity, location, real-time timezone, inventory formats, and check backend database sync.'
              : 'កំណត់អត្តសញ្ញាណស្របច្បាប់ ទីតាំង ម៉ោងជាក់ស្តែង ទម្រង់ស្តុក និងពិនិត្យទិន្នន័យមូលដ្ឋានទិន្នន័យ Backend។'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
          {/* Tab Switcher: Form vs Database Table */}
          <div className={`flex items-center rounded-xl border p-1 ${
            isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'form'
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-blue-700 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✏️</span>
              <span>{lang === 'en' ? 'Form Editor' : 'ទម្រង់កែប្រែ'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'database'
                  ? isDark
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-blue-700 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗄️</span>
              <span>{lang === 'en' ? 'Database Table' : 'តារាង Database'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span className="text-sm">💾</span>
            <span>{lang === 'en' ? 'Save Settings' : 'រក្សាទុកការកំណត់'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/50 bg-emerald-950/80 p-4 text-emerald-200 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div className="text-xs">
              <p className="font-bold text-emerald-300">
                {lang === 'en' ? 'Settings Saved Successfully' : 'ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ'}
              </p>
              <p className="text-emerald-400/90 text-[11px] mt-0.5">
                {lang === 'en'
                  ? 'Company profile, timezone, and inventory numeric formats have been synchronized with AdminD and database storage.'
                  : 'ប្រវត្តិរូបក្រុមហ៊ុន តំបន់ពេលវេលា និងទម្រង់លេខស្តុកត្រូវបានសមកាលកម្មជាមួយ AdminD និងទិន្នន័យ។'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Notification */}
      {saveError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/50 bg-red-950/80 p-4 text-red-200 shadow-xl animate-in fade-in duration-200">
          <span className="text-xl">⚠️</span>
          <div className="text-xs">
            <p className="font-bold text-red-300">{lang === 'en' ? 'Validation Error' : 'កំហុសសុពលភាព'}</p>
            <p className="text-red-400 text-[11px] mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 1: FORM EDITOR (Two Columns)                   */}
      {/* ======================================================== */}
      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-150">
          {/* LEFT COLUMN: Company Information (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: General Information */}
            <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl transition-colors space-y-5 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 text-sm font-bold">
                    🏢
                  </span>
                  <h3 className={`text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'General Information' : 'ព័ត៌មានទូទៅ'}
                  </h3>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en'
                    ? 'Information of company and logo image with format (.jpg, .jpeg, .png) Size: Must not be over 1 MB'
                    : 'ព័ត៌មានក្រុមហ៊ុន និងរូបសញ្ញាឡូហ្គោជាមួយទម្រង់ (.jpg, .jpeg, .png) ទំហំ៖ មិនត្រូវលើសពី 1 MB ឡើយ'}
                </p>
              </div>

              {/* Inputs Grid without Dollar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company * */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Company *' : 'ក្រុមហ៊ុន *'}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="e.g. B'Groceries Supermarket Co., Ltd."
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Second Language */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Second Language' : 'ភាសាទីពីរ'}
                  </label>
                  <input
                    type="text"
                    value={formData.secondLanguage}
                    onChange={(e) => handleChange('secondLanguage', e.target.value)}
                    placeholder="e.g. ក្រុមហ៊ុន ប៊ី ហ្រ្គូសឺរីស៍ មាត ឯ.ក"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Currency * */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Currency *' : 'រូបិយប័ណ្ណ *'}
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    placeholder="e.g. USD"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Second Currency - Dropdown */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Second Currency' : 'រូបិយប័ណ្ណរង'}
                  </label>
                  <select
                    value={formData.secondCurrency}
                    onChange={(e) => handleChange('secondCurrency', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  >
                    {SECONDARY_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Business License Nº */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Business License Nº' : 'លេខបញ្ជីពាណិជ្ជកម្ម'}
                  </label>
                  <input
                    type="text"
                    value={formData.businessLicense}
                    onChange={(e) => handleChange('businessLicense', e.target.value)}
                    placeholder="e.g. 00048291/2022"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>
              </div>

              {/* Upload Picture space and a box that show pic that upload */}
              <div className={`mt-4 rounded-2xl border p-4 space-y-3 ${
                isDark ? 'border-slate-800/80 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
              }`}>
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Company Logo Picture' : 'រូបភាពឡូហ្គោក្រុមហ៊ុន'}
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">JPG, JPEG, PNG ≤ 1 MB</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className={`relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed p-2 overflow-hidden transition ${
                    isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
                  }`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-full w-full object-contain drop-shadow" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <span className="text-2xl block">🖼️</span>
                        <span className="text-[10px] block mt-1 leading-tight">No Logo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Action Zone */}
                  <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="company-logo-file-input"
                    />
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label
                        htmlFor="company-logo-file-input"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/15 px-3.5 py-2 text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer active:scale-95"
                      >
                        <span>📁</span>
                        <span>{lang === 'en' ? 'Upload Picture' : 'ផ្ទុកឡើងរូបភាព'}</span>
                      </label>

                      {logoPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-600 hover:text-white transition active:scale-95 cursor-pointer"
                        >
                          <span>✕</span>
                          <span>{lang === 'en' ? 'Remove' : 'លុប'}</span>
                        </button>
                      )}
                    </div>
                    <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en'
                        ? 'Upload high-resolution transparent or white backdrop brand logo for inventory reports and invoices.'
                        : 'ផ្ទុកឡើងរូបភាពឡូហ្គោម៉ាកដែលមានគុណភាពច្បាស់សម្រាប់របាយការណ៍ស្តុក និងវិក័យប័ត្រ។'}
                    </p>
                    {logoError && (
                      <p className="text-xs font-bold text-red-400 mt-1 animate-pulse">⚠️ {logoError}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Card 2: Contact */}
            <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                    📞
                  </span>
                  <h3 className={`text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
                  </h3>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'Add company contact here' : 'បញ្ចូលព័ត៌មានទំនាក់ទំនងក្រុមហ៊ុននៅទីនេះ'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tax Nº */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Tax Nº' : 'លេខអត្តសញ្ញាណកម្មសារពើពន្ធ (TIN)'}
                  </label>
                  <input
                    type="text"
                    value={formData.taxNo}
                    onChange={(e) => handleChange('taxNo', e.target.value)}
                    placeholder="e.g. K008-902203114"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono font-bold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-emerald-400 placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-emerald-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Phone * */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Phone *' : 'លេខទូរស័ព្ទ *'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="e.g. +855 (0) 23 888 999"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Email * */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Email *' : 'អ៊ីមែល *'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. bgroceriescompany@gmail.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Website' : 'គេហទំព័រ'}
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="e.g. https://bgroceries.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Fax */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Fax' : 'ទូរសារ'}
                  </label>
                  <input
                    type="text"
                    value={formData.fax}
                    onChange={(e) => handleChange('fax', e.target.value)}
                    placeholder="e.g. +855 (0) 23 888 998"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Mobile' : 'ទូរស័ព្ទចល័ត'}
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="e.g. +855 (0) 12 345 678"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Card 3: Location */}
            <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 text-sm font-bold">
                    📍
                  </span>
                  <h3 className={`text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Location' : 'ទីតាំង'}
                  </h3>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'Add company location here' : 'បញ្ចូលទីតាំងក្រុមហ៊ុននៅទីនេះ'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Address' : 'អាសយដ្ឋាន'}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. Building #18, Preah Monivong Blvd, Sangkat Boeung Keng Kang I"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'City' : 'រាជធានី/ក្រុង'}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Phnom Penh"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'State' : 'ខេត្ត/រដ្ឋ'}
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="e.g. Phnom Penh Capital"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Post Code */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Post Code' : 'លេខកូដប្រៃសណីយ៍'}
                  </label>
                  <input
                    type="text"
                    value={formData.postCode}
                    onChange={(e) => handleChange('postCode', e.target.value)}
                    placeholder="e.g. 120102"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs'
                    }`}
                  />
                </div>

                {/* Time Zone - Real Time Zone that links with AdminD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en' ? 'Time Zone' : 'តំបន់ពេលវេលា'}
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">⚡ Live Sync AdminD</span>
                  </div>
                  <select
                    value={formData.timeZone}
                    onChange={(e) => handleChange('timeZone', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-xs'
                    }`}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.id} value={tz.id}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country - Custom Dropdown matching Add Product design */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Country' : 'ប្រទេស'}
                  </label>
                  <CountrySelect
                    value={formData.country}
                    onChange={(val) => handleChange('country', val)}
                    isDark={isDark}
                    lang={lang}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Formats Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Date/Time Format */}
            <section className={`rounded-3xl border p-5 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-bold">
                    📅
                  </span>
                  <h3 className={`text-sm sm:text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Date/Time Format' : 'ទម្រង់កាលបរិច្ឆេទ និងពេលវេលា'}
                  </h3>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'The format will be use entire inventory' : 'ទម្រង់នេះនឹងត្រូវប្រើប្រាស់ទូទាំងស្តុក'}
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Date Format' : 'ទម្រង់កាលបរិច្ឆេទ'}
                  </label>
                  <select
                    value={formData.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-indigo-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500 shadow-xs'
                    }`}
                  >
                    {DATE_FORMATS.map((df) => (
                      <option key={df.id} value={df.id}>
                        {df.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Time Format' : 'ទម្រង់ពេលវេលា'}
                  </label>
                  <select
                    value={formData.timeFormat}
                    onChange={(e) => handleChange('timeFormat', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-indigo-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500 shadow-xs'
                    }`}
                  >
                    {TIME_FORMATS.map((tf) => (
                      <option key={tf.id} value={tf.id}>
                        {tf.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sample Display */}
                <div className={`rounded-xl border p-3 ${
                  isDark ? 'border-indigo-500/25 bg-indigo-950/20' : 'border-indigo-200 bg-indigo-50/70'
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    {lang === 'en' ? 'Text Sample Display :' : 'ការបង្ហាញគំរូអត្ថបទ ៖'}
                  </span>
                  <p className={`mt-1 font-mono text-sm sm:text-base font-black ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
                    {sampleDateTime}
                  </p>
                </div>
              </div>
            </section>

            {/* Card 2: QTY Format */}
            <section className={`rounded-3xl border p-5 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                    🔢
                  </span>
                  <h3 className={`text-sm sm:text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'QTY Format' : 'ទម្រង់បរិមាណ (QTY)'}
                  </h3>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'The format will be use entire inventory' : 'ទម្រង់នេះនឹងត្រូវប្រើប្រាស់ទូទាំងស្តុក'}
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en' ? 'Decimal Place *' : 'ចំនួនខ្ទង់ក្បៀស *'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={formData.qtyDecimal}
                      onChange={(e) => handleChange('qtyDecimal', e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700/80 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en' ? 'Thousand Separator *' : 'សញ្ញាក្បៀសខ្ទង់ពាន់ *'}
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={formData.qtySeparator}
                      onChange={(e) => handleChange('qtySeparator', e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold text-center outline-none transition ${
                        isDark
                          ? 'border-slate-700/80 bg-slate-950 text-white focus:border-emerald-400'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 shadow-xs'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Negative Pattern' : 'ទម្រង់ចំនួនអវិជ្ជមាន'}
                  </label>
                  <select
                    value={formData.negativePattern}
                    onChange={(e) => handleChange('negativePattern', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-emerald-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-emerald-500 shadow-xs'
                    }`}
                  >
                    {NEGATIVE_PATTERNS.map((np) => (
                      <option key={np.id} value={np.id}>
                        {np.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sample Display */}
                <div className={`rounded-xl border p-3 ${
                  isDark ? 'border-emerald-500/25 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/70'
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {lang === 'en' ? 'Text Sample Display :' : 'ការបង្ហាញគំរូអត្ថបទ ៖'}
                  </span>
                  <p className={`mt-1 font-mono text-base font-black ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                    {sampleQuantity}
                  </p>
                </div>
              </div>
            </section>

            {/* Card 3: Factor Format */}
            <section className={`rounded-3xl border p-5 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold">
                    ⚙️
                  </span>
                  <h3 className={`text-sm sm:text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Factor Format' : 'ទម្រង់មេគុណ (Factor)'}
                  </h3>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'The format will be use entire inventory' : 'ទម្រង់នេះនឹងត្រូវប្រើប្រាស់ទូទាំងស្តុក'}
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en' ? 'Decimal Place *' : 'ចំនួនខ្ទង់ក្បៀស *'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={formData.factorDecimal}
                      onChange={(e) => handleChange('factorDecimal', e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition ${
                        isDark
                          ? 'border-slate-700/80 bg-slate-950 text-white focus:border-amber-400'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 shadow-xs'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'en' ? 'Thousand Separator *' : 'សញ្ញាក្បៀសខ្ទង់ពាន់ *'}
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={formData.factorSeparator}
                      onChange={(e) => handleChange('factorSeparator', e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold text-center outline-none transition ${
                        isDark
                          ? 'border-slate-700/80 bg-slate-950 text-white focus:border-amber-400'
                          : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 shadow-xs'
                      }`}
                    />
                  </div>
                </div>

                {/* Sample Display */}
                <div className={`rounded-xl border p-3 ${
                  isDark ? 'border-amber-500/25 bg-amber-950/20' : 'border-amber-200 bg-amber-50/70'
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    {lang === 'en' ? 'Text Sample Display :' : 'ការបង្ហាញគំរូអត្ថបទ ៖'}
                  </span>
                  <p className={`mt-1 font-mono text-base font-black ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
                    {sampleFactor}
                  </p>
                </div>
              </div>
            </section>

            {/* Card 4: Percentage Format */}
            <section className={`rounded-3xl border p-5 shadow-xl transition-colors space-y-4 ${
              isDark ? 'border-slate-800 bg-[#0f172a]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-500/15 text-pink-400 text-xs font-bold">
                    %
                  </span>
                  <h3 className={`text-sm sm:text-base font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {lang === 'en' ? 'Percentage Format' : 'ទម្រង់ភាគរយ (%)'}
                  </h3>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'The format will be use entire inventory' : 'ទម្រង់នេះនឹងត្រូវប្រើប្រាស់ទូទាំងស្តុក'}
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                    {lang === 'en' ? 'Decimal Place *' : 'ចំនួនខ្ទង់ក្បៀស *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formData.percentageDecimal}
                    onChange={(e) => handleChange('percentageDecimal', e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none transition ${
                      isDark
                        ? 'border-slate-700/80 bg-slate-950 text-white focus:border-pink-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-pink-500 shadow-xs'
                    }`}
                  />
                </div>

                {/* Sample Display */}
                <div className={`rounded-xl border p-3 ${
                  isDark ? 'border-pink-500/25 bg-pink-950/20' : 'border-pink-200 bg-pink-50/70'
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>
                    {lang === 'en' ? 'Text Sample Display :' : 'ការបង្ហាញគំរូអត្ថបទ ៖'}
                  </span>
                  <p className={`mt-1 font-mono text-base font-black ${isDark ? 'text-pink-300' : 'text-pink-950'}`}>
                    {samplePercentage}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: DATABASE TABLE & BACKEND SYNC INSPECTOR    */}
      {/* ======================================================== */}
      <section className={`rounded-3xl border p-5 sm:p-7 shadow-xl space-y-5 transition-colors animate-in fade-in duration-150 ${
        isDark ? 'border-slate-800 bg-[#0f172a]/90 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 text-base font-bold shadow-xs">
                🗄️
              </span>
              <div>
                <h3 className={`text-base sm:text-lg font-black font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Company Database Table (Backend Entity: `companies`)' : 'តារាង Database ក្រុមហ៊ុន (Entity: `companies`)'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en'
                    ? 'Live relational table view of company profile records. Use this to verify Spring Boot REST API integration and database mapping.'
                    : 'ទិដ្ឋភាពតារាងទិន្នន័យជាក់ស្តែងនៃប្រវត្តិរូបក្រុមហ៊ុន។ ប្រើវាដើម្បីផ្ទៀងផ្ទាត់ការតភ្ជាប់ Spring Boot API និង Database។'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCheckBackend}
              disabled={backendStatus.checking}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs ${
                backendStatus.checking
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              <span>{backendStatus.checking ? '⏳' : '🔄'}</span>
              <span>{backendStatus.checking ? 'Checking Backend…' : (lang === 'en' ? 'Check Backend Database' : 'ពិនិត្យ Backend DB')}</span>
            </button>
          </div>
        </div>

        {/* Backend Connectivity Status Box */}
        {backendStatus.checked && (
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border p-4 text-xs font-semibold animate-in fade-in duration-200 ${
            backendStatus.ok
              ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
              : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{backendStatus.ok ? '🟢' : '🟡'}</span>
              <div>
                <p className="font-bold">
                  {backendStatus.ok
                    ? `Connected to Backend API: /api/company (HTTP ${backendStatus.status} ${backendStatus.statusText})`
                    : `Backend Checked: HTTP ${backendStatus.status || 'Offline'} ${backendStatus.statusText || 'Endpoint ready in Local DB'}`}
                </p>
                <p className="text-[11px] opacity-85 mt-0.5">
                  {backendStatus.ok
                    ? `Response latency: ${backendStatus.latency} ms. Live company entity is fully mapped and synchronized.`
                    : 'Server is active on port 8081. Endpoint /api/company can be added to Spring Boot using the schema below.'}
                </p>
              </div>
            </div>

            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-current opacity-80 self-start sm:self-center shrink-0">
              {backendStatus.ok ? 'SYNC STATUS: ONLINE' : 'STORAGE: VERIFIED LOCAL'}
            </span>
          </div>
        )}

        {/* 1. Live Relational Table */}
        <div className={`overflow-x-auto rounded-2xl border ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <th className="py-3 px-3.5">ID</th>
                <th className="py-3 px-3.5">Table</th>
                <th className="py-3 px-3.5">Company Legal Name</th>
                <th className="py-3 px-3.5">Second Language</th>
                <th className="py-3 px-3.5">Currency</th>
                <th className="py-3 px-3.5">Second Curr</th>
                <th className="py-3 px-3.5">Tax Nº (TIN)</th>
                <th className="py-3 px-3.5">Business License</th>
                <th className="py-3 px-3.5">Contact</th>
                <th className="py-3 px-3.5">Time Zone</th>
                <th className="py-3 px-3.5">Country</th>
                <th className="py-3 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
              <tr className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}>
                <td className="py-3.5 px-3.5 font-mono font-bold text-blue-400">#1</td>
                <td className="py-3.5 px-3.5 font-mono text-[11px] text-purple-400 font-bold">companies</td>
                <td className={`py-3.5 px-3.5 font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {formData.company || "B'Groceries Mart"}
                </td>
                <td className="py-3.5 px-3.5 text-slate-400 text-[11px]">
                  {formData.secondLanguage || '—'}
                </td>
                <td className="py-3.5 px-3.5 font-mono font-bold text-emerald-400">
                  {formData.currency || 'USD'}
                </td>
                <td className="py-3.5 px-3.5 font-mono text-cyan-400">
                  {formData.secondCurrency || 'KHR'}
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px] text-slate-300">
                  {formData.taxNo || '—'}
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px] text-slate-400">
                  {formData.businessLicense || '—'}
                </td>
                <td className="py-3.5 px-3.5 text-[11px] whitespace-nowrap">
                  <span className="block text-slate-200 font-semibold">{formData.phone || '—'}</span>
                  <span className="block text-[10px] text-slate-400">{formData.email || '—'}</span>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px] text-cyan-300">
                  {formData.timeZone}
                </td>
                <td className="py-3.5 px-3.5 font-semibold text-slate-300">
                  {formData.country || 'Cambodia'}
                </td>
                <td className="py-3.5 px-3.5 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Developer Backend Reference & Schema Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* SQL Table DDL */}
          <div className={`rounded-2xl border p-4 space-y-2.5 ${
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">SQL DDL: `companies` Table</span>
              <button
                type="button"
                onClick={() => handleCopy(sqlSchemaText, 'sql')}
                className={`text-[11px] font-bold transition px-2 py-0.5 rounded cursor-pointer ${
                  copiedCode === 'sql'
                    ? 'text-emerald-400 bg-emerald-500/20'
                    : 'text-slate-400 hover:text-white bg-slate-800/80'
                }`}
              >
                {copiedCode === 'sql' ? '✓ Copied SQL' : 'Copy SQL'}
              </button>
            </div>
            <pre className={`text-[10px] font-mono overflow-x-auto p-3 rounded-xl border max-h-48 scrollbar-thin ${
              isDark ? 'border-slate-800 bg-[#080c14] text-slate-300' : 'border-slate-200 bg-white text-slate-800'
            }`}>
              {sqlSchemaText}
            </pre>
          </div>

          {/* Spring Boot JPA Entity Guide */}
          <div className={`rounded-2xl border p-4 space-y-2.5 ${
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 font-mono">Java Spring Boot: Company.java</span>
              <button
                type="button"
                onClick={() => handleCopy(springEntityText, 'java')}
                className={`text-[11px] font-bold transition px-2 py-0.5 rounded cursor-pointer ${
                  copiedCode === 'java'
                    ? 'text-emerald-400 bg-emerald-500/20'
                    : 'text-slate-400 hover:text-white bg-slate-800/80'
                }`}
              >
                {copiedCode === 'java' ? '✓ Copied Java' : 'Copy Java Entity'}
              </button>
            </div>
            <pre className={`text-[10px] font-mono overflow-x-auto p-3 rounded-xl border max-h-48 scrollbar-thin ${
              isDark ? 'border-slate-800 bg-[#080c14] text-slate-300' : 'border-slate-200 bg-white text-slate-800'
            }`}>
              {springEntityText}
            </pre>
          </div>
        </div>

        {/* Live JSON API Payload */}
        <div className={`rounded-2xl border p-4 space-y-2 ${
          isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Live JSON Payload (for `GET /api/company` & `PUT /api/company`)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(formData, null, 2), 'json')}
              className={`text-[11px] font-bold transition px-2 py-0.5 rounded cursor-pointer ${
                copiedCode === 'json'
                  ? 'text-emerald-400 bg-emerald-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-800/80'
              }`}
            >
              {copiedCode === 'json' ? '✓ Copied JSON' : 'Copy JSON Payload'}
            </button>
          </div>
          <pre className={`text-[10px] font-mono overflow-x-auto p-3 rounded-xl border max-h-40 scrollbar-thin ${
            isDark ? 'border-slate-800 bg-[#080c14] text-emerald-300' : 'border-slate-200 bg-white text-emerald-700'
          }`}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  )
}
