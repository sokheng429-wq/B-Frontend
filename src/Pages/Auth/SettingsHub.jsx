import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

// 3D Icons for the 16 Settings Modules
import settingIcon from '../../assets/icon/3dicons-setting-dynamic-color.png'
import mapPinIcon from '../../assets/icon/3dicons-map-pin-dynamic-color.png'
import locationIcon from '../../assets/icon/3dicons-location-dynamic-color.png'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import shieldIcon from '../../assets/icon/3dicons-shield-dynamic-color.png'
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

// EXACT 16 SETTINGS MODULES
export const SETTINGS_MODULES = [
  {
    key: 'company',
    icon: settingIcon,
    en: 'Company',
    kh: 'ក្រុមហ៊ុន',
    descEn: 'View of company information',
    descKh: 'មើលព័ត៌មានក្រុមហ៊ុន',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'business',
    tag: 'Profile',
    route: '/admin/settings/company',
  },
  {
    key: 'outlet',
    icon: mapPinIcon,
    en: 'Outlet',
    kh: 'ច្រកលក់',
    descEn: 'View of outlet information',
    descKh: 'មើលព័ត៌មានច្រកលក់',
    color: '#10B981',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'business',
    tag: 'Branches',
    route: '/admin/settings/outlet',
  },
  {
    key: 'location',
    icon: locationIcon,
    en: 'Location',
    kh: 'ទីតាំង',
    descEn: 'View of location information',
    descKh: 'មើលព័ត៌មានទីតាំង',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'business',
    tag: 'Storage',
    route: '/admin/settings/location',
  },
  {
    key: 'users',
    icon: shieldIcon,
    en: 'Users',
    kh: 'អ្នកប្រើប្រាស់',
    descEn: 'Manage system users and access permissions',
    descKh: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ និងសិទ្ធិចូលប្រើ',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'access',
    tag: 'Staff',
    route: '/admin/users',
  },
  {
    key: 'role',
    icon: keyIcon,
    en: 'Role',
    kh: 'តួនាទី',
    descEn: 'View of role information',
    descKh: 'មើលព័ត៌មានតួនាទី',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'access',
    tag: 'RBAC',
    route: '/admin/settings/role',
  },
  {
    key: 'tax',
    icon: calculatorIcon,
    en: 'Tax',
    kh: 'ពន្ធ',
    descEn: 'View of tax information',
    descKh: 'មើលព័ត៌មានពន្ធ',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    category: 'finance',
    tag: 'VAT',
    route: '/admin/settings/tax',
  },
  {
    key: 'currency',
    icon: dollarIcon,
    en: 'Currency',
    kh: 'រូបិយប័ណ្ណ',
    descEn: 'View of currency information',
    descKh: 'មើលព័ត៌មានរូបិយប័ណ្ណ',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'finance',
    tag: 'USD/KHR',
    route: '/admin/settings/currency',
  },
  {
    key: 'price-book',
    icon: notebookIcon,
    en: 'Price Book',
    kh: 'សៀវភៅតម្លៃ',
    descEn: 'View of price book information',
    descKh: 'មើលព័ត៌មានសៀវភៅតម្លៃ',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    category: 'finance',
    tag: 'Pricing',
    route: '/admin/settings/price-book',
  },
  {
    key: 'approval-type',
    icon: tickIcon,
    en: 'Approval Type',
    kh: 'ប្រភេទការអនុម័ត',
    descEn: 'View of approval type information',
    descKh: 'មើលព័ត៌មានប្រភេទការអនុម័ត',
    color: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.12)',
    category: 'operations',
    tag: 'Workflow',
    route: '/admin/settings/approval-type',
  },
  {
    key: 'payment-type',
    icon: creditCardIcon,
    en: 'Payment Type',
    kh: 'ប្រភេទទូទាត់',
    descEn: 'View of payment type information',
    descKh: 'មើលព័ត៌មានប្រភេទទូទាត់',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'finance',
    tag: 'Methods',
    route: '/admin/settings/payment-type',
  },
  {
    key: 'email',
    icon: mailIcon,
    en: 'Email',
    kh: 'អ៊ីមែល',
    descEn: 'View of email information',
    descKh: 'មើលព័ត៌មានអ៊ីមែល',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'operations',
    tag: 'SMTP',
    route: '/admin/settings/email',
  },
  {
    key: 'terms',
    icon: fileTextIcon,
    en: 'Terms and Condition',
    kh: 'លក្ខខណ្ឌ',
    descEn: 'View of terms and condition information',
    descKh: 'មើលព័ត៌មានលក្ខខណ្ឌ',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    category: 'operations',
    tag: 'Legal',
    route: '/admin/settings/terms',
  },
  {
    key: 'system-key',
    icon: lockIcon,
    en: 'System key change',
    kh: 'ផ្លាស់ប្តូរសោលប្រព័ន្ធ',
    descEn: 'View of system key change',
    descKh: 'មើលការផ្លាស់ប្តូរសោលប្រព័ន្ធ',
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    category: 'access',
    tag: 'Security',
    route: '/admin/settings/system-key',
  },
  {
    key: 'bank-account',
    icon: walletIcon,
    en: 'Bank Account',
    kh: 'គណនីធនាគារ',
    descEn: 'View of bank account card',
    descKh: 'មើលកាតគណនីធនាគារ',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'finance',
    tag: 'Accounts',
    route: '/admin/settings/bank-account',
  },
  {
    key: 'import-beginning',
    icon: folderIcon,
    en: 'Import Beginning',
    kh: 'នាំចូលទិន្នន័យដំបូង',
    descEn: 'View of import beginning',
    descKh: 'មើលការនាំចូលទិន្នន័យដំបូង',
    color: '#0EA5E9',
    bg: 'rgba(14, 165, 233, 0.12)',
    category: 'operations',
    tag: 'Migration',
    route: '/admin/settings/import-beginning',
  },
  {
    key: 'preference',
    icon: starIcon,
    en: 'Preference',
    kh: 'ចំណូលចិត្ត',
    descEn: 'View of preference',
    descKh: 'មើលការកំណត់ចំណូលចិត្ត',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.12)',
    category: 'business',
    tag: 'System UI',
    route: '/admin/settings/preference',
  },
]

function ChevronLeftIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ModuleCard({ item, lang }) {
  return (
    <Link
      to={item.route}
      className="hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#141922]/90 p-4 sm:p-5 text-left transition-all duration-300 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: item.color }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 shadow-lg"
            style={{
              background: item.bg,
              borderColor: `${item.color}40`,
            }}
          >
            <img src={item.icon} alt="" className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow" />
          </div>
          {item.tag && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-sm"
              style={{
                background: item.bg,
                color: item.color,
                border: `1px solid ${item.color}40`,
              }}
            >
              {item.tag}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors font-['Montserrat']">
              {lang === 'kh' ? item.kh : item.en}
            </h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className="relative mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-bold transition-all"
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'មើលការកំណត់' : 'Configure'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function SettingsHub() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = SETTINGS_MODULES

    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory)
    }

    if (!q) return list

    return list.filter((s) => {
      const en = (s.en || '').toLowerCase()
      const kh = (s.kh || '').toLowerCase()
      const descEn = (s.descEn || '').toLowerCase()
      const descKh = (s.descKh || '').toLowerCase()
      const key = (s.key || '').toLowerCase()
      return en.includes(q) || kh.includes(q) || descEn.includes(q) || descKh.includes(q) || key.includes(q)
    })
  }, [searchQuery, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts = {
      all: SETTINGS_MODULES.length,
      business: SETTINGS_MODULES.filter((m) => m.category === 'business').length,
      access: SETTINGS_MODULES.filter((m) => m.category === 'access').length,
      finance: SETTINGS_MODULES.filter((m) => m.category === 'finance').length,
      operations: SETTINGS_MODULES.filter((m) => m.category === 'operations').length,
    }
    return counts
  }, [])

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-cyan-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 p-2 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/20">
                <img src={settingIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">
                  {lang === 'en' ? "B'Groceries ERP System Configuration" : 'ការកំណត់ប្រព័ន្ធស្នូល'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Setting' : 'ការកំណត់'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? "Unified 16 enterprise settings modules: Company, Outlet, Location, Users, Roles, Taxes, Currencies, Price Books, Approvals, Payment Types, Email SMTP, Terms, Security Keys, Bank Accounts, Beginning Imports, and System Preferences."
                : 'ម៉ូឌុលការកំណត់ទាំង ១៦ របស់ប្រព័ន្ធ៖ ក្រុមហ៊ុន សាខា ទីតាំង អ្នកប្រើប្រាស់ តួនាទី ពន្ធ រូបិយប័ណ្ណ សៀវភៅតម្លៃ ការអនុម័ត ប្រភេទទូទាត់ អ៊ីមែល លក្ខខណ្ឌ សោលប្រព័ន្ធ គណនីធនាគារ នាំចូលទិន្នន័យដំបូង និងចំណូលចិត្ត។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Settings Modules' : 'ម៉ូឌុលការកំណត់'}</span>
                <span className="text-cyan-400 font-bold">16 Modules</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">16</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'System Health' : 'សុខភាពប្រព័ន្ធ'}</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Protected & Verified
              </p>
            </div>
          </div>
        </div>

        {/* Quick Pill Jump Bar for all 16 modules */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Quick Jump (16 Settings):' : 'ផ្លូវកាត់ការកំណត់ទាំង ១៦៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {SETTINGS_MODULES.map((m) => (
              <Link
                key={m.key}
                to={m.route}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-cyan-400 hover:text-white hover:bg-slate-800/50 transition-all"
                style={{ borderColor: `${m.color}30` }}
              >
                <img src={m.icon} alt="" className="h-4 w-4 object-contain" />
                <span>{lang === 'kh' ? m.kh : m.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md p-3.5 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search 16 settings: company, outlet, user, tax, currency...'
                : 'ស្វែងរកការកំណត់ទាំង ១៦៖ ក្រុមហ៊ុន ច្រកលក់ អ្នកប្រើប្រាស់ ពន្ធ រូបិយប័ណ្ណ...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', en: 'All 16', kh: 'ទាំងអស់ ១៦', count: categoryCounts.all },
            { key: 'business', en: 'Business & UI', kh: 'អាជីវកម្ម & UI', count: categoryCounts.business },
            { key: 'access', en: 'Access & Security', kh: 'សិទ្ធិ & សុវត្ថិភាព', count: categoryCounts.access },
            { key: 'finance', en: 'Finance & Tax', kh: 'ហិរញ្ញវត្ថុ & ពន្ធ', count: categoryCounts.finance },
            { key: 'operations', en: 'Operations', kh: 'ប្រតិបត្តិការ', count: categoryCounts.operations },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 16 MODULES GRID */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredModules.map((item) => (
            <ModuleCard key={item.key} item={item} lang={lang} />
          ))}
        </div>
      </section>

      {/* Empty Search State */}
      {filteredModules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
            🔍
          </div>
          <p className="text-sm font-bold text-white">
            {lang === 'en' ? `No settings found matching "${searchQuery}"` : `រកមិនឃើញការកំណត់ដែលត្រូវនឹង "${searchQuery}" ទេ`}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            {lang === 'en' ? 'Clear Search' : 'សម្អាតការស្វែងរក'}
          </button>
        </div>
      )}
    </div>
  )
}
