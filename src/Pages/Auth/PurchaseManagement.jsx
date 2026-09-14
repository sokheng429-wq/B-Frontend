import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import folderFavIcon from '../../assets/icon/3dicons-folder-fav-dynamic-color.png'
import linkIcon from '../../assets/icon/3dicons-link-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import fileNewIcon from '../../assets/icon/3dicons-file-new-dynamic-color.png'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import copyIcon from '../../assets/icon/3dicons-copy-dynamic-color.png'
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import './ProductsHub.css'

export const VENDOR_MASTER_MODULES = [
  {
    key: 'suppliers',
    icon: moneyBagIcon,
    en: 'Suppliers Master',
    kh: 'អ្នកផ្គត់ផ្គង់',
    descEn: 'Register farms, producers and wholesalers with contact and credit terms.',
    descKh: 'ចុះឈ្មោះកសិដ្ឋាន ក្រុមហ៊ុនផលិត និងលក្ខខណ្ឌឥណទាន។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'master',
    tag: 'Core',
    route: '/admin/products/suppliers',
  },
  {
    key: 'supplier-groups',
    icon: folderFavIcon,
    en: 'Supplier Groups',
    kh: 'ក្រុមអ្នកផ្គត់ផ្គង់',
    descEn: 'Categorize suppliers by perishables, dry goods, beverages and logistics.',
    descKh: 'បែងចែកក្រុមអ្នកផ្គត់ផ្គង់តាមប្រភេទបន្លែស្រស់ ទំនិញស្ងួត និងភេសជ្ជៈ។',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
    category: 'master',
    route: '/admin/products/supplier-groups',
  },
  {
    key: 'product-supplier',
    icon: linkIcon,
    en: 'Product Supplier Links',
    kh: 'ផលិតផលអ្នកផ្គត់ផ្គង់',
    descEn: 'Link catalog products to primary and secondary suppliers with part numbers.',
    descKh: 'ភ្ជាប់ផលិតផលទៅកាន់អ្នកផ្គត់ផ្គង់ចម្បង និងបន្ទាប់បន្សំ។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'master',
    tag: 'Mapping',
    route: '/admin/products/products-supplier',
  },
  {
    key: 'inventory-to-order',
    icon: chartIcon,
    en: 'Inventory to Order',
    kh: 'ស្តុកដែលត្រូវបញ្ជាទិញ',
    descEn: 'Auto-detect low inventory below reorder points and draft procurement orders.',
    descKh: 'ស្វ័យប្រវត្តិកំណត់ស្តុកដែលធ្លាក់ចុះក្រោមចំណុចបញ្ជាទិញឡើងវិញ។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'master',
    tag: 'Smart',
    route: '/admin/purchase-management/inventory-to-order',
  },
]

export const PURCHASE_OPS_MODULES = [
  {
    key: 'requisition',
    icon: fileNewIcon,
    en: 'Requisition',
    kh: 'លិខិតស្នើសុំបញ្ជាទិញ',
    descEn: 'Internal stock purchase requests created by branch and floor managers.',
    descKh: 'លិខិតស្នើសុំទិញស្តុកផ្ទៃក្នុងដែលបង្កើតឡើងដោយអ្នកគ្រប់គ្រងសាខា។',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    category: 'procurement',
    tag: 'Workflow',
    route: '/admin/purchase-management/requisition',
  },
  {
    key: 'purchase-order',
    icon: bagIcon,
    en: 'Purchase Orders',
    kh: 'ការបញ្ជាទិញទំនិញ',
    descEn: 'Official purchase orders sent to vendors with quantities, pricing and ETAs.',
    descKh: 'លិខិតបញ្ជាទិញផ្លូវការផ្ញើជូនអ្នកផ្គត់ផ្គង់ ជាមួយតម្លៃ និងកាលបរិច្ឆេទដឹក។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'procurement',
    tag: 'Core',
    route: '/admin/purchase-management/purchase-order',
  },
  {
    key: 'receipt-po',
    icon: mailIcon,
    en: 'Receipt PO',
    kh: 'ការទទួលទំនិញតាម PO',
    descEn: 'Inspect physical shipments, record received batches, and verify delivery notes.',
    descKh: 'ពិនិត្យទំនិញជាក់ស្តែង កត់ត្រាចំនួនទទួល និងផ្ទៀងផ្ទាត់ប័ណ្ណដឹក។',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'procurement',
    tag: 'Receiving',
    route: '/admin/purchase-management/receipt-po',
  },
  {
    key: 'return-receipt-po',
    icon: copyIcon,
    en: 'Return Receipt PO',
    kh: 'ការប្រគល់ទំនិញត្រឡប់ជូនអ្នកផ្គត់ផ្គង់',
    descEn: 'Return rejected or damaged items back to suppliers with debit notes.',
    descKh: 'ប្រគល់ទំនិញខូច ឬមិនត្រូវតាមស្តង់ដារត្រឡប់ជូនអ្នកផ្គត់ផ្គង់វិញ។',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    category: 'procurement',
    tag: 'Returns',
    route: '/admin/purchase-management/return-receipt-po',
  },
]

export const ALL_PURCHASE_MODULES = [...VENDOR_MASTER_MODULES, ...PURCHASE_OPS_MODULES]

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
  const { isDark } = useTheme()
  return (
    <Link
      to={item.route || '/admin/purchase-management'}
      className={`hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? 'border-slate-800 bg-[#141922]/90 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-black/40'
          : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white hover:shadow-slate-200/60 shadow-xs'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: item.color }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`hub-icon flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 ${
              isDark ? 'ring-white/10 shadow-black/30' : 'ring-black/5 shadow-slate-200/50'
            }`}
            style={{
              background: item.bg,
              borderColor: item.color + '40',
            }}
          >
            <img src={item.icon} alt="" className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow" />
          </div>
          {item.tag && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-sm"
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
          <h3 className={`text-sm sm:text-base font-bold tracking-tight transition-colors font-['Montserrat'] ${
            isDark ? 'text-white group-hover:text-green-300' : 'text-slate-950 group-hover:text-green-700'
          }`}>
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
            isDark ? 'text-slate-400' : 'text-slate-700 font-medium'
          }`}>
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className={`relative mt-4 flex items-center justify-between pt-3 border-t text-xs font-bold transition-all ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'បើកដំណើរការ' : 'Open Module'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function PurchaseManagement() {
  const { isDark } = useTheme()
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_PURCHASE_MODULES

    if (activeCategory === 'master') {
      list = VENDOR_MASTER_MODULES
    } else if (activeCategory === 'procurement') {
      list = PURCHASE_OPS_MODULES
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

  const masterFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'master'),
    [filteredModules]
  )
  const procFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'procurement'),
    [filteredModules]
  )

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER */}
      <section className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 shadow-2xl ${
        isDark
          ? 'border-green-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] shadow-green-500/10'
          : 'border-green-500/20 bg-gradient-to-br from-green-50/70 via-white to-slate-50 shadow-slate-200/50'
      }`}>
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#7EB631]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-[#7EB631]/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition active:scale-95 ${
                isDark
                  ? 'border-slate-700/80 bg-slate-950/60 text-green-300 hover:border-[#7EB631] hover:text-white'
                  : 'border-slate-200 bg-white text-green-700 hover:border-[#7EB631] hover:text-slate-950 shadow-xs'
              }`}
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#7EB631]/15 p-2 ring-1 ring-[#7EB631]/30 shadow-lg shadow-green-500/20">
                <img src={moneyBagIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#7EB631]">
                  {lang === 'en' ? "B'Groceries Procurement & Sourcing" : 'ការបញ្ជាទិញ និងផ្គត់ផ្គង់'}
                </p>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Purchase Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងការបញ្ជាទិញទំនិញ'}
                </h1>
              </div>
            </div>

            <p className={`max-w-2xl text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
              {lang === 'en'
                ? 'Supermarket procurement central — manage vendor relationships, supplier groups, automatic reorder forecasting, purchase requisitions, PO issuing and receiving docks.'
                : 'មជ្ឈមណ្ឌលលទ្ធកម្មផ្សារទំនើប — គ្រប់គ្រងទំនាក់ទំនងអ្នកផ្គត់ផ្គង់ ការបញ្ជាទិញស្តុកដោយស្វ័យប្រវត្តិ លិខិតស្នើសុំទិញ ការចេញ PO និងការទទួលទំនិញចូលស្តុក។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className={`rounded-2xl border p-3.5 shadow-md ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-xs'}`}>
              <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>
                <span>{lang === 'en' ? 'Procurement Nodes' : 'ម៉ូឌុលលទ្ធកម្ម'}</span>
                <span className="text-emerald-500 font-bold">● Active</span>
              </div>
              <p className={`mt-1 font-mono text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {ALL_PURCHASE_MODULES.length}
              </p>
            </div>

            <div className={`rounded-2xl border p-3.5 shadow-md ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-xs'}`}>
              <div className={`flex items-center justify-between text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>
                <span>{lang === 'en' ? 'Receiving Dock' : 'ច្រកទទួលទំនិញ'}</span>
                <span className="text-blue-500 font-bold">● Live</span>
              </div>
              <p className={`mt-1 font-mono text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Barcode Integrated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border p-3.5 shadow-lg ${
        isDark ? 'border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
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
                ? 'Search suppliers, POs, requisitions, receiving, RTV...'
                : 'ស្វែងរកអ្នកផ្គត់ផ្គង់ បញ្ជាទិញ ស្នើសុំ ការទទួលទំនិញ...'
            }
            className={`w-full rounded-xl border py-2 pl-9 pr-8 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-[#7EB631]/20 ${
              isDark
                ? 'border-slate-700/80 bg-slate-950/90 text-white placeholder-slate-500 focus:border-[#7EB631]'
                : 'border-slate-300 bg-slate-50 text-slate-950 placeholder-slate-400 focus:border-[#7EB631] focus:bg-white shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-950'}`}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_PURCHASE_MODULES.length },
            { key: 'master', en: 'Suppliers Master', kh: 'អ្នកផ្គត់ផ្គង់', count: VENDOR_MASTER_MODULES.length },
            { key: 'procurement', en: 'PO & Receiving', kh: 'PO និងការទទួល', count: PURCHASE_OPS_MODULES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-[#7EB631] text-slate-950 shadow-md shadow-green-600/20 font-black'
                  : isDark
                    ? 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200/70'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key
                    ? 'bg-slate-950 text-green-300'
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED ACTION CARD: SUPPLIER MASTER DIRECTORY */}
      {(!searchQuery || 'suppliers'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/products/suppliers"
          className={`hub-hero-card group relative overflow-hidden flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-center sm:justify-between ${
            isDark
              ? 'border-[#77BC1F]/30 bg-gradient-to-r from-[#77BC1F]/15 via-slate-900/90 to-[#0f172a]/90 hover:border-[#77BC1F]/60 shadow-lg shadow-black/40 hover:shadow-[#77BC1F]/10'
              : 'border-[#77BC1F]/40 bg-gradient-to-r from-emerald-50/90 via-green-50/50 to-white hover:border-[#77BC1F] shadow-md shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/15'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ring-1 shadow-md transition-transform duration-300 group-hover:scale-110 ${
              isDark ? 'bg-[#77BC1F]/20 ring-[#77BC1F]/40 text-[#77BC1F] shadow-[#77BC1F]/20' : 'bg-white ring-[#77BC1F]/30 text-[#77BC1F] shadow-sm'
            }`}>
              🏭
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className={`text-base sm:text-lg font-black tracking-tight font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Supplier Master Directory' : 'បញ្ជីអ្នកផ្គត់ផ្គង់មេ'}
                </h3>
                <span className="hero-tag rounded-full bg-[#77BC1F] px-2.5 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider shadow-xs">
                  Live Master
                </span>
              </div>
              <p className={`mt-1 max-w-2xl text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {lang === 'en'
                  ? 'Access live supplier database with automated SP-#### codes, tax registration, payment terms, and direct purchase links.'
                  : 'ចូលទៅកាន់បញ្ជីអ្នកផ្គត់ផ្គង់ជាក់ស្តែង ជាមួយកូដ SP-#### ស្វ័យប្រវត្តិ លេខពន្ធ និងលក្ខខណ្ឌទូទាត់។'}
              </p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 self-start sm:self-center rounded-xl px-4 py-2.5 text-xs font-black transition-all duration-300 shrink-0 shadow-sm ${
            isDark
              ? 'bg-[#77BC1F]/20 text-[#77BC1F] ring-1 ring-[#77BC1F]/40 group-hover:bg-[#77BC1F] group-hover:text-slate-950 group-hover:shadow-md group-hover:shadow-[#77BC1F]/20'
              : 'bg-[#77BC1F] text-slate-950 ring-1 ring-[#77BC1F]/60 group-hover:bg-[#68a71b] group-hover:shadow-md group-hover:shadow-green-600/20'
          }`}>
            <span>{lang === 'en' ? 'Open Directory' : 'បើកបញ្ជី'}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        </Link>
      )}

      {/* 4. VENDOR MASTER DATA */}
      {masterFiltered.length > 0 && (
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/80 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#7EB631]" />
              <div>
                <h2 className={`text-base font-bold font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Suppliers & Product Sourcing' : 'អ្នកផ្គត់ផ្គង់ និងការស្វែងរកទំនិញ'}
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en' ? 'Supplier registry, groupings, item mapping, and low-stock replenishment' : 'បញ្ជីអ្នកផ្គត់ផ្គង់ ក្រុម ការភ្ជាប់ទំនិញ និងការបំពេញស្តុកទាប'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{masterFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {masterFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. PROCUREMENT WORKFLOW */}
      {procFiltered.length > 0 && (
        <section className={`rounded-3xl border p-5 sm:p-6 shadow-xl space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/80 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#06b6d4]" />
              <div>
                <h2 className={`text-base font-bold font-['Montserrat'] ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {lang === 'en' ? 'Purchase Workflow & Receiving' : 'លំហូរការបញ្ជាទិញ និងការទទួល'}
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {lang === 'en'
                    ? 'Purchase requisitions, purchase order documents, goods receipt notes and return to vendor'
                    : 'លិខិតស្នើសុំទិញ ឯកសារបញ្ជាទិញ ប័ណ្ណទទួលទំនិញ និងការប្រគល់ត្រឡប់'}
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-semibold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{procFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {procFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Empty Search State */}
      {filteredModules.length === 0 && (
        <div className={`rounded-2xl border border-dashed p-12 text-center space-y-3 ${
          isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-300 bg-slate-50'
        }`}>
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
            isDark ? 'bg-slate-900' : 'bg-slate-200'
          }`}>
            🔍
          </div>
          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {lang === 'en' ? `No modules found matching "${searchQuery}"` : `រកមិនឃើញម៉ូឌុលដែលត្រូវនឹង "${searchQuery}" ទេ`}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`rounded-xl border px-4 py-1.5 text-xs font-bold transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100 shadow-xs'
            }`}
          >
            {lang === 'en' ? 'Clear Search' : 'សម្អាតការស្វែងរក'}
          </button>
        </div>
      )}
    </div>
  )
}
