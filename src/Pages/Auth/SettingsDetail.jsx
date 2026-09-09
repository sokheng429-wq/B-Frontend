import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

// 3D Icons for Settings
import settingIcon from '../../assets/icon/3dicons-setting-dynamic-color.png'
import mapPinIcon from '../../assets/icon/3dicons-map-pin-dynamic-color.png'
import locationIcon from '../../assets/icon/3dicons-location-dynamic-color.png'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import keyIcon from '../../assets/icon/3dicons-key-dynamic-color.png'
import calculatorIcon from '../../assets/icon/3dicons-calculator-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import notebookIcon from '../../assets/icon/3dicons-notebook-dynamic-color.png'
import tickIcon from '../../assets/icon/3dicons-tick-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import lockIcon from '../../assets/icon/3dicons-lock-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import folderIcon from '../../assets/icon/3dicons-folder-dynamic-color.png'
import starIcon from '../../assets/icon/3dicons-star-dynamic-color.png'

import './ProductsHub.css'

// THE 16 SETTINGS CONFIGURATION MASTER
export const SETTINGS_MAP = {
  company: {
    key: 'company',
    icon: settingIcon,
    en: 'Company',
    kh: 'ក្រុមហ៊ុន',
    descEn: 'View of company information',
    descKh: 'មើលព័ត៌មានក្រុមហ៊ុន',
    color: '#3B82F6',
    route: '/admin/settings/company',
  },
  outlet: {
    key: 'outlet',
    icon: mapPinIcon,
    en: 'Outlet',
    kh: 'ច្រកលក់',
    descEn: 'View of outlet information',
    descKh: 'មើលព័ត៌មានច្រកលក់',
    color: '#10B981',
    route: '/admin/settings/outlet',
  },
  location: {
    key: 'location',
    icon: locationIcon,
    en: 'Location',
    kh: 'ទីតាំង',
    descEn: 'View of location information',
    descKh: 'មើលព័ត៌មានទីតាំង',
    color: '#06B6D4',
    route: '/admin/settings/location',
  },
  users: {
    key: 'users',
    icon: boyIcon,
    en: 'User',
    kh: 'អ្នកប្រើប្រាស់',
    descEn: 'View of users information',
    descKh: 'មើលព័ត៌មានអ្នកប្រើប្រាស់',
    color: '#77BC1F',
    route: '/admin/settings/users',
  },
  role: {
    key: 'role',
    icon: keyIcon,
    en: 'Role',
    kh: 'តួនាទី',
    descEn: 'View of role information',
    descKh: 'មើលព័ត៌មានតួនាទី',
    color: '#A855F7',
    route: '/admin/settings/role',
  },
  tax: {
    key: 'tax',
    icon: calculatorIcon,
    en: 'Tax',
    kh: 'ពន្ធ',
    descEn: 'View of tax information',
    descKh: 'មើលព័ត៌មានពន្ធ',
    color: '#EF4444',
    route: '/admin/settings/tax',
  },
  currency: {
    key: 'currency',
    icon: dollarIcon,
    en: 'Currency',
    kh: 'រូបិយប័ណ្ណ',
    descEn: 'View of currency information',
    descKh: 'មើលព័ត៌មានរូបិយប័ណ្ណ',
    color: '#F59E0B',
    route: '/admin/settings/currency',
  },
  'price-book': {
    key: 'price-book',
    icon: notebookIcon,
    en: 'Price Book',
    kh: 'សៀវភៅតម្លៃ',
    descEn: 'View of price book information',
    descKh: 'មើលព័ត៌មានសៀវភៅតម្លៃ',
    color: '#6366F1',
    route: '/admin/settings/price-book',
  },
  'approval-type': {
    key: 'approval-type',
    icon: tickIcon,
    en: 'Approval Type',
    kh: 'ប្រភេទការអនុម័ត',
    descEn: 'View of approval type information',
    descKh: 'មើលព័ត៌មានប្រភេទការអនុម័ត',
    color: '#14B8A6',
    route: '/admin/settings/approval-type',
  },
  'payment-type': {
    key: 'payment-type',
    icon: creditCardIcon,
    en: 'Payment Type',
    kh: 'ប្រភេទទូទាត់',
    descEn: 'View of payment type information',
    descKh: 'មើលព័ត៌មានប្រភេទទូទាត់',
    color: '#EC4899',
    route: '/admin/settings/payment-type',
  },
  email: {
    key: 'email',
    icon: mailIcon,
    en: 'Email',
    kh: 'អ៊ីមែល',
    descEn: 'View of email information',
    descKh: 'មើលព័ត៌មានអ៊ីមែល',
    color: '#3B82F6',
    route: '/admin/settings/email',
  },
  terms: {
    key: 'terms',
    icon: fileTextIcon,
    en: 'Terms and Condition',
    kh: 'លក្ខខណ្ឌ',
    descEn: 'View of terms and condition information',
    descKh: 'មើលព័ត៌មានលក្ខខណ្ឌ',
    color: '#8B5CF6',
    route: '/admin/settings/terms',
  },
  'system-key': {
    key: 'system-key',
    icon: lockIcon,
    en: 'System key change',
    kh: 'ផ្លាស់ប្តូរសោលប្រព័ន្ធ',
    descEn: 'View of system key change',
    descKh: 'មើលការផ្លាស់ប្តូរសោលប្រព័ន្ធ',
    color: '#F97316',
    route: '/admin/settings/system-key',
  },
  'bank-account': {
    key: 'bank-account',
    icon: walletIcon,
    en: 'Bank Account',
    kh: 'គណនីធនាគារ',
    descEn: 'View of bank account card',
    descKh: 'មើលកាតគណនីធនាគារ',
    color: '#10B981',
    route: '/admin/settings/bank-account',
  },
  'import-beginning': {
    key: 'import-beginning',
    icon: folderIcon,
    en: 'Import Beginning',
    kh: 'នាំចូលទិន្នន័យដំបូង',
    descEn: 'View of import beginning',
    descKh: 'មើលការនាំចូលទិន្នន័យដំបូង',
    color: '#0EA5E9',
    route: '/admin/settings/import-beginning',
  },
  preference: {
    key: 'preference',
    icon: starIcon,
    en: 'Preference',
    kh: 'ចំណូលចិត្ត',
    descEn: 'View of preference',
    descKh: 'មើលការកំណត់ចំណូលចិត្ត',
    color: '#EAB308',
    route: '/admin/settings/preference',
  },
}

const SETTINGS_LIST = Object.values(SETTINGS_MAP)

export default function SettingsDetail({ settingType: propSettingType }) {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const params = useParams()

  // Normalize key from prop, param or URL
  const rawKey = propSettingType || params.settingType || window.location.pathname.replace('/admin/settings/', '') || 'company'
  const currentKey = useMemo(() => {
    const k = rawKey.toLowerCase().trim()
    if (k === 'user') return 'users'
    if (k === 'roles') return 'role'
    if (k === 'terms-and-condition' || k === 'terms-and-conditions') return 'terms'
    if (k === 'system-key-change') return 'system-key'
    return SETTINGS_MAP[k] ? k : 'company'
  }, [rawKey])

  const config = SETTINGS_MAP[currentKey] || SETTINGS_MAP.company

  // Local state for notification feedback
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(4100)
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCopy = (txt, id) => {
    navigator.clipboard?.writeText(txt)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <section
        className="relative overflow-hidden rounded-3xl border p-5 sm:p-7 shadow-2xl"
        style={{
          borderColor: `${config.color}30`,
          background: `linear-gradient(135deg, ${config.color}15 0%, #0f172a 60%, #080c14 100%)`,
          boxShadow: `0 20px 40px -15px ${config.color}20`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{ background: config.color }}
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link to="/admin" className="hover:text-white transition">Dashboard</Link>
              <span>/</span>
              <Link to="/admin/settings" className="hover:text-white transition">Setting</Link>
              <span>/</span>
              <span style={{ color: config.color }}>{lang === 'kh' ? config.kh : config.en}</span>
            </div>

            <div className="flex items-center gap-3.5">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-lg"
                style={{
                  background: `${config.color}15`,
                  borderColor: `${config.color}40`,
                }}
              >
                <img src={config.icon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: config.color }}>
                  {lang === 'en' ? `Setting Configuration` : 'ការកំណត់ប្រព័ន្ធ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'kh' ? config.kh : config.en}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'kh' ? config.descKh : config.descEn}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
            >
              ← {lang === 'en' ? 'All Settings' : 'ការកំណត់ទាំងអស់'}
            </Link>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black text-white shadow-lg transition active:scale-95 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${config.color}, #4338ca)`,
                boxShadow: `0 8px 20px -6px ${config.color}80`,
              }}
            >
              <span>💾</span>
              <span>{lang === 'en' ? 'Save Changes' : 'រក្សាទុកការកែប្រែ'}</span>
            </button>
          </div>
        </div>

        {/* 2. QUICK JUMP HORIZONTAL PILL BAR ACROSS ALL 16 SETTINGS */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Jump to Setting (16):' : 'ជ្រើសរើសការកំណត់ (១៦)៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {SETTINGS_LIST.map((item) => {
              const isActive = item.key === currentKey
              return (
                <Link
                  key={item.key}
                  to={item.route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-white font-bold ring-2 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600 hover:bg-slate-800/40'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${item.color}25` : undefined,
                    borderColor: isActive ? item.color : undefined,
                    boxShadow: isActive ? `0 4px 12px ${item.color}30` : undefined,
                  }}
                >
                  <img src={item.icon} alt="" className="h-4 w-4 object-contain" />
                  <span>{lang === 'kh' ? item.kh : item.en}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-emerald-300 text-xs font-bold shadow-lg animate-in fade-in duration-200">
          <span className="text-xl">✅</span>
          <span>{lang === 'en' ? `Settings for ${config.en} successfully updated and applied across B'Groceries.` : `ការកំណត់ ${config.kh} ត្រូវបានរក្សាទុកដោយជោគជ័យ។`}</span>
        </div>
      )}

      {/* 3. SETTING-SPECIFIC INTERACTIVE CONTENT VIEWER */}
      <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl shadow-black/40 space-y-6">

        {/* 1. COMPANY */}
        {currentKey === 'company' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Company Information & Legal Profile</h2>
              <p className="text-xs text-slate-400">View and update registered legal business identity, tax credentials, and headquarters contacts.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company Legal Name</label>
                <input
                  type="text"
                  defaultValue="B'Groceries Supermarket Co., Ltd."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trade Brand Name</label>
                <input
                  type="text"
                  defaultValue="B'Groceries Mart"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">VAT TIN Identification #</label>
                <input
                  type="text"
                  defaultValue="K008-902203114"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400 outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Registration No</label>
                <input
                  type="text"
                  defaultValue="00048291/2022"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hotline Contact</label>
                <input
                  type="text"
                  defaultValue="+855 (0) 23 888 999"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Email</label>
                <input
                  type="email"
                  defaultValue="bgroceriescompany@gmail.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Headquarters Address</label>
                <input
                  type="text"
                  defaultValue="Building #18, Preah Monivong Blvd, Sangkat Boeung Keng Kang I, Khan Boeung Keng Kang, Phnom Penh, Cambodia"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Legal Signatories */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Authorized Legal Signatories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <p className="text-[10px] text-slate-400 uppercase">Managing Director</p>
                  <p className="font-bold text-white mt-0.5">Sokheng Mean</p>
                  <p className="text-[11px] text-emerald-400">Authorized Signatory</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <p className="text-[10px] text-slate-400 uppercase">Operations Director</p>
                  <p className="font-bold text-white mt-0.5">Borith Keo</p>
                  <p className="text-[11px] text-blue-400">Inventory & Logistics</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60">
                  <p className="text-[10px] text-slate-400 uppercase">Chief Financial Officer</p>
                  <p className="font-bold text-white mt-0.5">Sreypov Lim</p>
                  <p className="text-[11px] text-purple-400">Tax & Treasury</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. OUTLET */}
        {currentKey === 'outlet' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Outlets & Store Branches</h2>
                <p className="text-xs text-slate-400">Manage 4 retail locations, operating schedules, and assigned POS checkouts.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                <span>+</span>
                <span>Add Branch Outlet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { code: 'OUT-01', name: 'Main Mart Toul Kork', pos: '4 Registers', address: '#128 St. 598 Toul Kork, Phnom Penh', hours: '06:00 - 22:00', manager: 'Dara Vorn', phone: '023 888 901', status: 'ACTIVE' },
                { code: 'OUT-02', name: 'BKK1 Flagship Store', pos: '6 Registers', address: '#45 St. 51 BKK1, Phnom Penh', hours: '06:00 - 23:00', manager: 'Piseth Chan', phone: '023 888 902', status: 'ACTIVE' },
                { code: 'OUT-03', name: 'Sen Sok Mega Mart', pos: '8 Registers', address: '#88 St. 1003 Sen Sok, Phnom Penh', hours: '07:00 - 22:00', manager: 'Bunroeun Sok', phone: '023 888 903', status: 'ACTIVE' },
                { code: 'OUT-04', name: 'Chbar Ampov Express', pos: '3 Registers', address: 'National Road 1, Chbar Ampov', hours: '06:30 - 21:30', manager: 'Channa Seng', phone: '023 888 904', status: 'ACTIVE' },
              ].map((out) => (
                <div key={out.code} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 hover:border-emerald-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{out.code}</span>
                      <h3 className="text-sm font-bold text-white mt-1">{out.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{out.address}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">● {out.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Terminals:</span>
                      <span className="font-bold text-slate-200">{out.pos}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hours:</span>
                      <span className="font-bold text-slate-200">{out.hours}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Manager:</span>
                      <span className="font-bold text-slate-200">{out.manager}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LOCATION */}
        {currentKey === 'location' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Warehouses & Storage Zones</h2>
              <p className="text-xs text-slate-400">Physical picking zones, temperature-controlled cold rooms, and staging bins.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { code: 'LOC-CW01', name: 'Central Warehouse - Dry Grocery', type: 'Ambient Storage', temp: '24°C', cap: '2,500 CBM', aisles: 'A1 - F8' },
                { code: 'LOC-CR02', name: 'Cold Room A - Dairy & Deli', type: 'Chilled Storage', temp: '2°C to 4°C', cap: '800 CBM', aisles: 'C1 - C12' },
                { code: 'LOC-FZ03', name: 'Deep Freezer B - Meat & Seafood', type: 'Frozen Storage', temp: '-18°C', cap: '600 CBM', aisles: 'F1 - F6' },
                { code: 'LOC-PR04', name: 'Produce Fresh Staging Bay', type: 'Rapid Turnover', temp: '15°C', cap: '400 CBM', aisles: 'Bay 1 - 3' },
                { code: 'LOC-PK05', name: 'Fast-Pick Front Line Staging', type: 'Retail Picking', temp: '22°C', cap: '300 CBM', aisles: 'P1 - P4' },
              ].map((loc) => (
                <div key={loc.code} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 hover:border-cyan-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{loc.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">{loc.temp}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">{loc.name}</h3>
                  <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                    <p>Type: <span className="text-slate-300 font-semibold">{loc.type}</span></p>
                    <p>Capacity: <span className="text-slate-300 font-semibold">{loc.cap}</span></p>
                    <p>Racks: <span className="text-slate-300 font-semibold">{loc.aisles}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. USER */}
        {currentKey === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">System Users & Staff Accounts</h2>
                <p className="text-xs text-slate-400">View user access credentials, assigned outlets, and status.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-lime-600 hover:bg-lime-500 px-3.5 py-2 text-xs font-bold text-white transition active:scale-95"
              >
                <span>+</span>
                <span>Add User Account</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/80 font-bold uppercase text-slate-400 text-[10px]">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Assigned Outlet</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                  {[
                    { name: 'Super Administrator', user: 'admin', role: 'Super Administrator', outlet: 'All Outlets', last: 'Just now', status: 'ACTIVE' },
                    { name: 'Piseth Chan', user: 'piseth.c', role: 'Store Manager', outlet: 'BKK1 Flagship', last: '10 mins ago', status: 'ACTIVE' },
                    { name: 'Sreynoch Heng', user: 'sreynoch.h', role: 'Cashier', outlet: 'Main Mart Toul Kork', last: '2 hours ago', status: 'ACTIVE' },
                    { name: 'Rithy Kong', user: 'rithy.k', role: 'Inventory Auditor', outlet: 'Sen Sok Mega Mart', last: 'Yesterday', status: 'ACTIVE' },
                    { name: 'Bopha Chem', user: 'bopha.c', role: 'Cashier', outlet: 'Chbar Ampov Express', last: '2 days ago', status: 'ACTIVE' },
                  ].map((u) => (
                    <tr key={u.user} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 font-mono text-slate-400">{u.user}</td>
                      <td className="p-3 text-cyan-300 font-semibold">{u.role}</td>
                      <td className="p-3 text-slate-300">{u.outlet}</td>
                      <td className="p-3 text-slate-400">{u.last}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">● {u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ROLE */}
        {currentKey === 'role' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Role-Based Access Control (RBAC)</h2>
              <p className="text-xs text-slate-400">Defined security roles and their granular access permissions matrix.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { role: 'Super Administrator', desc: 'Full unrestricted access across all 7 hubs, financials, and 16 settings.', users: 1, color: '#A855F7' },
                { role: 'Store Manager', desc: 'Outlet sales management, cashier oversight, manual discount overrides, and daily reports.', users: 4, color: '#3B82F6' },
                { role: 'Cashier', desc: 'POS checkout terminal, receipt issue, cash drawer access, shift closure.', users: 18, color: '#10B981' },
                { role: 'Inventory Auditor', desc: 'Stock cards, physical counts, movement audits, and barcode catalogue.', users: 3, color: '#F59E0B' },
                { role: 'Purchasing Officer', desc: 'Requisition processing, purchase orders, receiving inspection, vendor list.', users: 2, color: '#06B6D4' },
              ].map((r) => (
                <div key={r.role} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 hover:border-purple-500/40 transition">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{r.role}</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: `${r.color}20`, color: r.color }}>{r.users} Staff</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAX */}
        {currentKey === 'tax' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Tax Rates & Cambodia VAT</h2>
              <p className="text-xs text-slate-400">Configure General Department of Taxation (GDT) standard rates and invoice calculation rules.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Tax Brackets</h3>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">GDT Compliant</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Standard VAT</p>
                      <p className="text-[10px] text-slate-400">General retail supermarket products</p>
                    </div>
                    <span className="font-mono text-sm font-black text-emerald-400">10.0%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Zero-Rated VAT</p>
                      <p className="text-[10px] text-slate-400">Exported merchandise & zero-rated goods</p>
                    </div>
                    <span className="font-mono text-sm font-black text-slate-400">0.0%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Specific Tax</p>
                      <p className="text-[10px] text-slate-400">Select alcoholic beverages & wines</p>
                    </div>
                    <span className="font-mono text-sm font-black text-amber-400">3.0%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Public Lighting Tax (PLT)</p>
                      <p className="text-[10px] text-slate-400">Lighting tax for tobacco and liquor</p>
                    </div>
                    <span className="font-mono text-sm font-black text-amber-400">3.0%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Invoice Tax Options</h3>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Display VAT Separately on POS Receipts</p>
                      <p className="text-[10px] text-slate-400">Break down Net Amount + 10% VAT on customer bill</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Print VATTIN On Official Receipts</p>
                      <p className="text-[10px] text-slate-400">Print K008-902203114 for business customer audits</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Prices in Shelf Tags Include VAT</p>
                      <p className="text-[10px] text-slate-400">Gross pricing display for supermarket retail shoppers</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CURRENCY */}
        {currentKey === 'currency' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Currency & Dual Exchange Rate (USD / KHR)</h2>
              <p className="text-xs text-slate-400">Configure real-time Cambodian Riel to US Dollar valuation and rounding precision.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Base Currency</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">USD ($)</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Primary</span>
                </div>
                <p className="text-xs text-slate-400">United States Dollar</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Secondary Currency</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">KHR (៛)</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Khmer Riel</span>
                </div>
                <p className="text-xs text-slate-400">National Bank of Cambodia</p>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400">Active Exchange Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-300">$1.00 =</span>
                  <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="w-24 rounded-lg border border-amber-500/50 bg-slate-950 px-2 py-1 text-sm font-mono font-bold text-amber-300 outline-none"
                  />
                  <span className="text-xs font-bold text-amber-400">៛</span>
                </div>
                <p className="text-[10px] text-amber-300/80">Applied to cash registers, QR codes & receipts</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. PRICE BOOK */}
        {currentKey === 'price-book' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Price Books & Tiered Pricing</h2>
              <p className="text-xs text-slate-400">Custom pricing schedules for retail shoppers, loyalty members, and B2B wholesale orders.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: 'Standard Retail Price', code: 'PB-RETAIL', margin: '25.0% Standard', applies: 'All walk-in retail supermarket shoppers', active: true },
                { name: 'VIP Member Loyalty Club', code: 'PB-VIP5', margin: '20.0% (-5% Off)', applies: 'Registered B\'Groceries VIP app card holders', active: true },
                { name: 'Wholesale / B2B Bulk', code: 'PB-B2B', margin: '12.0% Wholesale', applies: 'Approved restaurants, hotels & corporate clients', active: true },
                { name: 'Staff & Employee Courtesy', code: 'PB-STAFF', margin: '15.0% (-10% Off)', applies: 'Verified B\'Groceries employees & family', active: true },
              ].map((pb) => (
                <div key={pb.code} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-indigo-400 font-bold">{pb.code}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{pb.name}</h3>
                  <p className="text-xs text-slate-400">{pb.applies}</p>
                  <p className="text-[11px] font-mono text-indigo-300 font-semibold pt-1">Margin Markup: {pb.margin}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. APPROVAL TYPE */}
        {currentKey === 'approval-type' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Approval Types & Authorization Limits</h2>
              <p className="text-xs text-slate-400">Threshold matrices requiring supervisor, manager, or director authorization.</p>
            </div>

            <div className="space-y-3">
              {[
                { type: 'Purchase Order Approval', limit: '> $1,000.00', approver: 'Branch Manager / Store Director', level: 'Level 2 Sign-off' },
                { type: 'Inventory Damage & Write-Off', limit: '> $50.00', approver: 'Inventory Auditor / Warehouse Lead', level: 'Level 1 Sign-off' },
                { type: 'Credit Limit Extension Override', limit: '> $2,000.00', approver: 'Chief Financial Officer (CFO)', level: 'Level 3 Sign-off' },
                { type: 'Supplier Prepayment / Advance', limit: '> $5,000.00', approver: 'Managing Director & Board', level: 'Executive Sign-off' },
              ].map((a, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <div>
                    <h3 className="text-xs font-bold text-white">{a.type}</h3>
                    <p className="text-[11px] text-slate-400">Required Approver: <span className="text-teal-300 font-semibold">{a.approver}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-400">{a.limit}</span>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">{a.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. PAYMENT TYPE */}
        {currentKey === 'payment-type' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Payment Types & Gateways</h2>
              <p className="text-xs text-slate-400">Supported tender options across retail checkouts, online deliveries, and B2B invoices.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Cash (USD & KHR)', code: 'CASH', fee: '0.0%', type: 'Cash Tender', active: true },
                { name: 'ABA PayWay / KHQR', code: 'ABA_PAYWAY', fee: '0.15%', type: 'Bakong QR', active: true },
                { name: 'Wing Bank KHQR', code: 'WING', fee: '0.20%', type: 'Mobile Wallet', active: true },
                { name: 'ACLEDA X-Pay', code: 'ACLEDA', fee: '0.20%', type: 'Mobile Banking', active: true },
                { name: 'Credit/Debit Card (Visa/MC)', code: 'CARD', fee: '1.50%', type: 'EMV Terminal', active: true },
                { name: 'Customer Credit Line (AR)', code: 'CREDIT', fee: '0.0%', type: '30-Day Term', active: true },
              ].map((pt) => (
                <div key={pt.code} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 hover:border-pink-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-pink-400 font-bold">{pt.code}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <h3 className="text-xs font-bold text-white">{pt.name}</h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{pt.type}</span>
                    <span className="font-mono font-bold text-pink-300">Fee: {pt.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. EMAIL */}
        {currentKey === 'email' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Email Server & SMTP Configuration</h2>
              <p className="text-xs text-slate-400">Automated notification dispatch for invoices, low-stock warnings, and EOD reports.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SMTP Server Host</label>
                <input type="text" defaultValue="smtp.gmail.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SMTP Port</label>
                <input type="text" defaultValue="587 (TLS)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sender Name</label>
                <input type="text" defaultValue="B'Groceries Automated System" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sender Email Address</label>
                <input type="email" defaultValue="bgroceriescompany@gmail.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-xs text-blue-300">
              <span>●</span>
              <span>SMTP Connection Status: <strong>Connected & Authenticated</strong></span>
            </div>
          </div>
        )}

        {/* 12. TERMS AND CONDITION */}
        {currentKey === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Terms and Condition Information</h2>
              <p className="text-xs text-slate-400">Customer retail agreement, 60-minute freshness refund guarantee, and supplier terms.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-white text-sm">1. 60-Minute Freshness Replacement Guarantee</h3>
                <p className="text-slate-300 leading-relaxed">
                  If any fruit, vegetable, meat, or bakery item arrives less than completely fresh or damaged, the customer can tap "Report Issue" in their order for an instant 100% refund or free replacement within 60 minutes.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-white text-sm">2. Supermarket POS Retail Purchases</h3>
                <p className="text-slate-300 leading-relaxed">
                  All transactions issued from B'Groceries cash counters are accompanied by an itemized tax receipt. Sealed packaged items in original condition may be exchanged within 7 days upon presentation of the original bill.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-white text-sm">3. Supplier Vendor Terms</h3>
                <p className="text-slate-300 leading-relaxed">
                  Consignment and purchase order invoices are paid according to the 30-day billing cycle following quality assurance and physical count verification at our central receiving bay.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 13. SYSTEM KEY CHANGE */}
        {currentKey === 'system-key' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">System Key Change & Security Secrets</h2>
              <p className="text-xs text-slate-400">Manage hardware register pairing tokens, payment webhook keys, and JWT API secrets.</p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'POS Hardware Terminal Pairing Key', id: 'k1', key: 'pos_sec_live_99812401828471928374', rotated: '2026-08-15' },
                { title: 'ABA PayWay Webhook Secret Key', id: 'k2', key: 'whsec_aba_prod_khqr_8837192837192', rotated: '2026-07-20' },
                { title: 'Spring Boot JWT Secret Token', id: 'k3', key: 'bgroc_jwt_supermarket_sha256_enterprise', rotated: '2026-09-01' },
                { title: 'PostgreSQL Database AES-256 Key', id: 'k4', key: 'aes256_pg_encrypt_salts_prod_bkh99', rotated: '2026-06-10' },
              ].map((sk) => (
                <div key={sk.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white">{sk.title}</h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{sk.key.slice(0, 14)}••••••••••••••••</p>
                    <p className="text-[10px] text-slate-500">Last Rotated: {sk.rotated}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(sk.key, sk.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      {copiedKey === sk.id ? '✓ Copied' : 'Copy Key'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-xl bg-orange-600/20 border border-orange-500/40 text-xs font-bold text-orange-400 hover:bg-orange-600/30 transition"
                    >
                      Rotate Key
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. BANK ACCOUNT */}
        {currentKey === 'bank-account' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Bank Account Cards & Treasury Channels</h2>
              <p className="text-xs text-slate-400">Official banking accounts for daily supermarket cashier settlements, supplier payments, and payroll.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { bank: 'ABA Bank', acc: '001 234 567', name: "B'GROCERIES SUPERMARKET CO., LTD.", cur: 'USD ($)', swift: 'ABAKPP', primary: true },
                { bank: 'ABA Bank (Payroll)', acc: '001 234 568', name: "B'GROCERIES SUPERMARKET CO., LTD.", cur: 'KHR (៛)', swift: 'ABAKPP', primary: false },
                { bank: 'ACLEDA Bank', acc: '2400-01-987654-12', name: "B'GROCERIES SUPERMARKET CO., LTD.", cur: 'KHR (៛)', swift: 'ACLEKPP', primary: false },
                { bank: 'Canadia Bank', acc: '002-098765-01', name: "B'GROCERIES SUPERMARKET CO., LTD.", cur: 'USD ($)', swift: 'CANDKPP', primary: false },
              ].map((ba, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 space-y-3 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-400">{ba.bank}</span>
                    {ba.primary && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full">Primary</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Account Number</p>
                    <p className="font-mono text-base font-black text-white tracking-widest">{ba.acc}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 text-[11px] truncate max-w-[200px]">{ba.name}</span>
                    <span className="font-bold text-amber-400 font-mono">{ba.cur}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 15. IMPORT BEGINNING */}
        {currentKey === 'import-beginning' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">Import Beginning & Opening Balance Data</h2>
              <p className="text-xs text-slate-400">Migrate and initialize initial stock on hand, supplier balances, and customer accounts.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Download Excel Templates (.xlsx)</h3>
                <div className="space-y-2 text-xs">
                  <button type="button" className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 transition">
                    <span>📦 Beginning Stock On Hand Template</span>
                    <span className="font-mono text-cyan-400">↓ Download</span>
                  </button>
                  <button type="button" className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 transition">
                    <span>🏢 Supplier Opening Balances Template</span>
                    <span className="font-mono text-cyan-400">↓ Download</span>
                  </button>
                  <button type="button" className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 transition">
                    <span>👥 Customer AR Opening Ledger Template</span>
                    <span className="font-mono text-cyan-400">↓ Download</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/40 text-center space-y-3 flex flex-col items-center justify-center">
                <span className="text-4xl">📤</span>
                <div>
                  <p className="text-xs font-bold text-white">Drop Excel or CSV File Here</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports .xlsx, .xls, .csv up to 25MB</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition active:scale-95"
                >
                  Browse Files
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 16. PREFERENCE */}
        {currentKey === 'preference' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white">System & POS Preferences</h2>
              <p className="text-xs text-slate-400">Configure hardware register behaviors, barcode scan triggers, sound effects, and UI theme.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">POS Hardware & Scanner Behavior</h3>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Auto-Submit Barcode Scan</p>
                      <p className="text-[10px] text-slate-400">Adds item directly into cart without pressing Enter</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Kick Cash Drawer on Cash Tender</p>
                      <p className="text-[10px] text-slate-400">Sends hardware pulse to open drawer on payment</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-white">Audible Scan Beep</p>
                      <p className="text-[10px] text-slate-400">Play confirmation audio chime upon barcode read</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Display & Interface</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Default Language</label>
                    <select defaultValue={lang} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                      <option value="en">English (US)</option>
                      <option value="kh">ភាសាខ្មែរ (Khmer)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Theme</label>
                    <select defaultValue="dark" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                      <option value="dark">Obsidian Dark Glassmorphic (Default)</option>
                      <option value="midnight">Midnight OLED Black</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Idle Screen Lock</label>
                    <select defaultValue="30" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="never">Never Lock</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
