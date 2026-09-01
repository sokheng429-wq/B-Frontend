import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { adminCustomerAPI } from '../../api/api'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import giftIcon from '../../assets/icon/3dicons-gift-box-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import './ProductsHub.css'

// Sale Dashboard Modules
export const CUSTOMER_MODULES = [
  {
    key: 'customers',
    icon: boyIcon,
    en: 'Customers',
    kh: 'អតិថិជន',
    descEn: 'Manage customer accounts and information',
    descKh: 'គ្រប់គ្រងគណនីអតិថិជន និងព័ត៌មាន',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'customer',
    tag: 'Core',
  },
  {
    key: 'customer-groups',
    icon: bagIcon,
    en: 'Customer Groups',
    kh: 'ក្រុមអតិថិជន',
    descEn: 'Organize customers into groups',
    descKh: 'ចាត់ចែងអតិថិជនទៅក្នុងក្រុម',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
    category: 'customer',
  },
]

export const INVOICE_MODULES = [
  {
    key: 'sale-invoice',
    icon: mailIcon,
    en: 'Sale Invoices',
    kh: 'វិក័យប័ត្របូលរូប',
    descEn: 'View and manage all sale invoices',
    descKh: 'មើល និងគ្រប់គ្រងវិក័យប័ត្របូលរូបទាំងអស់',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'invoice',
    tag: 'Popular',
  },
  {
    key: 'pending-invoice',
    icon: chartIcon,
    en: 'Pending Invoices',
    kh: 'វិក័យប័ត្របង្អាក់',
    descEn: 'Track pending and unpaid invoices',
    descKh: 'តាមដានវិក័យប័ត្របង្អាក់ និងមិនទាន់បង់',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'invoice',
  },
  {
    key: 'return-invoice',
    icon: dollarIcon,
    en: 'Return Invoices',
    kh: 'វិក័យប័ត្របង្ហាញ',
    descEn: 'Manage returned items and refunds',
    descKh: 'គ្រប់គ្រងការត្រឡប់ទិន្នន័យ និងការសងប្រាក់វិញ',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    category: 'invoice',
  },
]

export const PROMOTION_MODULES = [
  {
    key: 'promotions',
    icon: giftIcon,
    en: 'Promotion',
    kh: 'ការផ្សព្វផ្សាយ',
    descEn: 'View and manage promotions',
    descKh: 'មើល និងគ្រប់គ្រងការផ្សព្វផ្សាយ',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'promotion',
    tag: 'Core',
  },
]

export const ALL_SALE_MODULES = [...CUSTOMER_MODULES, ...INVOICE_MODULES, ...PROMOTION_MODULES]

// Generate mock daily sales data for the last 7 days
const generateDailySalesData = () => {
  const data = []
  const today = new Date('2026-09-01')

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const sales = Math.floor(Math.random() * 5000) + 3000 // Random between $3k-$8k

    data.push({
      day: dayName,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: sales
    })
  }

  return data
}

export default function SaleDashboard() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    saleAmount: 0,
    refundAmount: 0,
    profit: 0,
    loading: true
  })
  const [dailySales, setDailySales] = useState([])

  // Load live statistics from backend
  useEffect(() => {
    let isMounted = true

    adminCustomerAPI.getAll()
      .then((res) => {
        if (!isMounted) return
        const list = res?.data || res || []
        const customerCount = Array.isArray(list) ? list.length : 0
        setStats((prev) => ({
          ...prev,
          totalCustomers: customerCount,
          loading: false,
        }))
      })
      .catch((err) => {
        console.error('Failed to load customer stats:', err)
        if (isMounted) {
          setStats((prev) => ({ ...prev, loading: false }))
        }
      })

    // Empty array for chart - ready for live daily sales
    setDailySales([])

    return () => {
      isMounted = false
    }
  }, [])

  // Filter modules based on search and active tab
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_SALE_MODULES

    if (activeCategory === 'customer') {
      list = CUSTOMER_MODULES
    } else if (activeCategory === 'invoice') {
      list = INVOICE_MODULES
    } else if (activeCategory === 'promotion') {
      list = PROMOTION_MODULES
    }

    if (!q) return list

    return list.filter((m) => {
      const en = (m.en || '').toLowerCase()
      const kh = (m.kh || '').toLowerCase()
      const descEn = (m.descEn || '').toLowerCase()
      const descKh = (m.descKh || '').toLowerCase()
      const key = (m.key || '').toLowerCase()
      return en.includes(q) || kh.includes(q) || descEn.includes(q) || descKh.includes(q) || key.includes(q)
    })
  }, [searchQuery, activeCategory])

  const customerFiltered = useMemo(
    () => filteredModules.filter((m) => m.category === 'customer'),
    [filteredModules]
  )

  const invoiceFiltered = useMemo(
    () => filteredModules.filter((m) => m.category === 'invoice'),
    [filteredModules]
  )

  const promotionFiltered = useMemo(
    () => filteredModules.filter((m) => m.category === 'promotion'),
    [filteredModules]
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const maxSales = Math.max(...dailySales.map(d => d.sales), 1)

  const text = {
    en: {
      backToAdmin: '← Back to Admin',
      title: 'Sale Dashboard',
      subtitle: 'Manage sales operations, invoices, and customer transactions',
      totalCustomers: 'Total Customers',
      totalInvoices: 'Total Invoices',
      saleAmount: 'Sale Amount',
      refundAmount: 'Refund Amount',
      profit: 'Profit',
      dailySales: 'Daily Sales (Last 7 Days)',
      searchPlaceholder: 'Search modules...',
      all: 'All',
      customerManagement: 'Customer Management',
      customerSubtitle: 'Manage customer accounts and relationships',
      invoiceManagement: 'Invoice Management',
      invoiceSubtitle: 'Track and manage all invoices',
      promotions: 'Sales Promotions',
      promotionSubtitle: 'Create and manage sales campaigns',
      noResults: 'No modules found',
    },
    kh: {
      backToAdmin: '← ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង',
      title: 'ផ្ទាំងលក់',
      subtitle: 'គ្រប់គ្រងប្រតិបត្តិការលក់ វិក័យប័ត្រ និងប្រតិបត្តិការអតិថិជន',
      totalCustomers: 'អតិថិជនសរុប',
      totalInvoices: 'វិក័យប័ត្រសរុប',
      saleAmount: 'ចំនួនលក់',
      refundAmount: 'ចំនួនសងប្រាក់',
      profit: 'ប្រាក់ចំណេញ',
      dailySales: 'ការលក់ប្រចាំថ្ងៃ (៧ថ្ងៃចុងក្រោយ)',
      searchPlaceholder: 'ស្វែងរកម៉ូឌុល...',
      all: 'ទាំងអស់',
      customerManagement: 'ការគ្រប់គ្រងអតិថិជន',
      customerSubtitle: 'គ្រប់គ្រងគណនីអតិថិជន',
      invoiceManagement: 'ការគ្រប់គ្រងវិក័យប័ត្រ',
      invoiceSubtitle: 'តាមដាន និងគ្រប់គ្រងវិក័យប័ត្របូលរូប',
      promotions: 'ការផ្សព្វផ្សាយលក់',
      promotionSubtitle: 'បង្កើត និងគ្រប់គ្រងការផ្សព្វផ្សាយលក់',
      noResults: 'រកមិនឃើញម៉ូឌុល',
    },
  }

  const t = text[lang]

  return (
    <div className="space-y-6 text-slate-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* HERO BANNER WITH DYNAMIC GLOW & LIVE KPIS */}
      <section className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-green-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#7EB631]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-[#7EB631]/40 to-transparent" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-green-300 transition hover:border-[#7EB631] hover:text-white active:scale-95"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.backToAdmin}
              </Link>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {t.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Total Customers */}
            <Link
              to="/admin/sale-dashboard/customers"
              className="group flex items-center gap-3 rounded-2xl border border-[#77BC1F]/30 bg-gradient-to-br from-[#77BC1F]/10 to-transparent px-4 py-3 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-[#77BC1F] hover:bg-[#77BC1F]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#77BC1F]/20 transition-transform group-hover:scale-110">
                <svg className="h-6 w-6 text-[#77BC1F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-black text-white">{stats.loading ? '...' : stats.totalCustomers}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.totalCustomers}</p>
                  <svg className="h-3 w-3 text-[#77BC1F] opacity-0 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Total Invoices */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#FF9900]/30 bg-gradient-to-br from-[#FF9900]/10 to-transparent px-4 py-3 shadow-md backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF9900]/20">
                <svg className="h-6 w-6 text-[#FF9900]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stats.loading ? '...' : stats.totalInvoices}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.totalInvoices}</p>
              </div>
            </div>

            {/* Sale Amount */}
            <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent px-4 py-3 shadow-md backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-black text-white">{stats.loading ? '...' : formatCurrency(stats.saleAmount)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.saleAmount}</p>
              </div>
            </div>

            {/* Refund Amount */}
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent px-4 py-3 shadow-md backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/20">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-black text-white">{stats.loading ? '...' : formatCurrency(stats.refundAmount)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.refundAmount}</p>
              </div>
            </div>

            {/* Profit */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent px-4 py-3 shadow-md backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-black text-white">{stats.loading ? '...' : formatCurrency(stats.profit)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t.profit}</p>
              </div>
            </div>
          </div>

          {/* Daily Sales Chart */}
          {dailySales.length > 0 ? (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{t.dailySales}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-[#77BC1F]"></div>
                  <span>Sales</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-48">
                {dailySales.map((day, idx) => {
                  const heightPercent = (day.sales / maxSales) * 100
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full flex-col items-center">
                        <span className="mb-1 text-xs font-bold text-slate-400">{formatCurrency(day.sales)}</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#77BC1F] to-[#9DD948] transition-all duration-500 hover:brightness-110"
                          style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white">{day.day}</div>
                        <div className="text-[10px] text-slate-500">{day.date}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{t.dailySales}</h3>
              </div>
              <div className="flex items-center justify-center h-48 text-slate-500">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-sm">{lang === 'en' ? 'No sales data available' : 'គ្មានទិន្នន័យលក់'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY TABS + SEARCH */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex gap-2 rounded-xl border border-slate-700/60 bg-slate-900/80 p-1 shadow-lg backdrop-blur-sm">
          {[
            { key: 'all', label: t.all },
            { key: 'customer', label: text[lang].customerManagement },
            { key: 'invoice', label: text[lang].invoiceManagement },
            { key: 'promotion', label: text[lang].promotions },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
                activeCategory === tab.key
                  ? 'bg-[#7EB631] text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 shadow-lg backdrop-blur-sm transition focus:border-[#7EB631] focus:outline-none focus:ring-2 focus:ring-[#7EB631]/50 sm:w-80"
          />
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* CUSTOMER MANAGEMENT */}
      {(activeCategory === 'all' || activeCategory === 'customer') && customerFiltered.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-[#7EB631]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">{text[lang].customerManagement}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-400">
              {customerFiltered.length}
            </span>
          </div>
          <p className="text-sm text-slate-400">{text[lang].customerSubtitle}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {customerFiltered.map((module) => (
              <Link
                key={module.key}
                to={`/admin/sale-dashboard/${module.key}`}
                className="hub-card group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 text-left shadow-xl backdrop-blur-sm transition hover:border-[#7EB631]/50 hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: module.color }} />

                <div className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="hub-icon flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: module.bg }}>
                      <img src={module.icon} alt="" className="h-9 w-9" />
                    </div>
                    {module.tag && (
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: module.bg, color: module.color }}
                      >
                        {module.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{lang === 'en' ? module.en : module.kh}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {lang === 'en' ? module.descEn : module.descKh}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 text-xs font-bold" style={{ color: module.color }}>
                    <span>{lang === 'en' ? 'Open' : 'បើក'}</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* INVOICE MANAGEMENT */}
      {(activeCategory === 'all' || activeCategory === 'invoice') && invoiceFiltered.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-[#FF9900]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">{text[lang].invoiceManagement}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-400">
              {invoiceFiltered.length}
            </span>
          </div>
          <p className="text-sm text-slate-400">{text[lang].invoiceSubtitle}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {invoiceFiltered.map((module) => (
              <Link
                key={module.key}
                to={`/admin/sale-dashboard/${module.key}`}
                className="hub-card group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 text-left shadow-xl backdrop-blur-sm transition hover:border-[#FF9900]/50 hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: module.color }} />

                <div className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="hub-icon flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: module.bg }}>
                      <img src={module.icon} alt="" className="h-9 w-9" />
                    </div>
                    {module.tag && (
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: module.bg, color: module.color }}
                      >
                        {module.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{lang === 'en' ? module.en : module.kh}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {lang === 'en' ? module.descEn : module.descKh}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 text-xs font-bold" style={{ color: module.color }}>
                    <span>{lang === 'en' ? 'Open' : 'បើក'}</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROMOTIONS */}
      {(activeCategory === 'all' || activeCategory === 'promotion') && promotionFiltered.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-[#3B82F6]" />
            <h2 className="text-xl font-black uppercase tracking-tight text-white">{text[lang].promotions}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-400">
              {promotionFiltered.length}
            </span>
          </div>
          <p className="text-sm text-slate-400">{text[lang].promotionSubtitle}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {promotionFiltered.map((module) => (
              <Link
                key={module.key}
                to={`/admin/sale-dashboard/${module.key}`}
                className="hub-card group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 text-left shadow-xl backdrop-blur-sm transition hover:border-[#3B82F6]/50 hover:shadow-2xl"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl" style={{ background: module.color }} />

                <div className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="hub-icon flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: module.bg }}>
                      <img src={module.icon} alt="" className="h-9 w-9" />
                    </div>
                    {module.tag && (
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: module.bg, color: module.color }}
                      >
                        {module.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{lang === 'en' ? module.en : module.kh}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {lang === 'en' ? module.descEn : module.descKh}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 text-xs font-bold" style={{ color: module.color }}>
                    <span>{lang === 'en' ? 'Open' : 'បើក'}</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* NO RESULTS */}
      {filteredModules.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/50">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-400">{t.noResults}</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your search or filter</p>
          </div>
        </div>
      )}
    </div>
  )
}
