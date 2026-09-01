import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import clockIcon from '../../assets/icon/3dicons-clock-dynamic-color.png'
import calculatorIcon from '../../assets/icon/3dicons-calculator-dynamic-color.png'
import shieldIcon from '../../assets/icon/3dicons-shield-dynamic-color.png'
import cubeIcon from '../../assets/icon/3dicons-cube-dynamic-color.png'
import './ProductsHub.css'

export const FREIGHT_TARIFF_MODULES = [
  {
    key: 'shipment-tariff',
    icon: dollarIcon,
    en: 'Shipment Tariff Rates',
    kh: 'អត្រាពន្ធ និងតម្លៃដឹកជញ្ជូន',
    descEn: 'Configure zone-based courier rates, weight tiers, and surcharge formulas.',
    descKh: 'កំណត់អត្រាតម្លៃដឹកជញ្ជូនតាមតំបន់ កម្រិតទម្ងន់ និងថ្លៃបន្ថែម។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'rates',
    tag: 'Pricing',
    route: '/admin/freight-management/shipment-tariff',
  },
  {
    key: 'shipment-method',
    icon: travelIcon,
    en: 'Shipment Methods',
    kh: 'វិធីសាស្ត្រដឹកជញ្ជូន',
    descEn: 'Manage road transport, cold-chain trucks, express motorbikes, and sea cargo.',
    descKh: 'គ្រប់គ្រងការដឹកជញ្ជូនតាមផ្លូវគោក រថយន្តក្លាសេ ម៉ូតូលឿន និងនាវា។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'rates',
    tag: 'Core',
    route: '/admin/freight-management/shipment-method',
  },
  {
    key: 'carrier-agreements',
    icon: shieldIcon,
    en: 'Carrier Contracts',
    kh: 'កិច្ចសន្យាក្រុមហ៊ុនដឹកជញ្ជូន',
    descEn: 'Manage 3PL logistics provider SLAs, insurance terms, and delivery performance.',
    descKh: 'គ្រប់គ្រងកិច្ចសន្យាក្រុមហ៊ុនដឹកជញ្ជូនភាគីទី៣ និងការធានារ៉ាប់រង។',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    category: 'rates',
    route: '/admin/freight-management',
  },
]

export const INBOUND_FREIGHT_MODULES = [
  {
    key: 'pending-receipt-po',
    icon: clockIcon,
    en: 'Pending PO Shipments',
    kh: 'ការដឹកជញ្ជូន PO ដែលរង់ចាំ',
    descEn: 'Monitor incoming freight from suppliers currently in transit to warehouse docks.',
    descKh: 'តាមដានការដឹកទំនិញពីអ្នកផ្គត់ផ្គង់ដែលកំពុងធ្វើដំណើរមកកាន់ឃ្លាំង។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'inbound',
    tag: 'Inbound',
    route: '/admin/freight-management/pending-receipt-po',
  },
  {
    key: 'freight-cost-allocation',
    icon: calculatorIcon,
    en: 'Freight Cost Allocation',
    kh: 'ការបែងចែកចំណាយដឹកជញ្ជូនលើថ្លៃដើម',
    descEn: 'Landed cost calculation: distribute freight charges across imported item unit costs.',
    descKh: 'គណនាថ្លៃដើមពិតប្រាកដ: បែងចែកថ្លៃដឹកជញ្ជូនចូលក្នុងតម្លៃដើមផលិតផលនីមួយៗ។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'inbound',
    tag: 'Landed Cost',
    route: '/admin/freight-management',
  },
  {
    key: 'customs-clearance',
    icon: cubeIcon,
    en: 'Customs & Port Handling',
    kh: 'ពន្ធគយ និងការលើកដាក់កំពង់ផែ',
    descEn: 'Track import duties, declaration documentation, and container demurrage.',
    descKh: 'តាមដានពន្ធនាំចូល ឯកសារប្រកាសគយ និងកម្រៃលើកដាក់កុងតឺន័រ។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'inbound',
    route: '/admin/freight-management',
  },
]

export const ALL_FREIGHT_MODULES = [...FREIGHT_TARIFF_MODULES, ...INBOUND_FREIGHT_MODULES]

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
      to={item.route || '/admin/freight-management'}
      className="hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#141922]/90 p-4 sm:p-5 text-left transition-all duration-300 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-xl hover:shadow-black/40"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: item.color }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110"
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
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors font-['Montserrat']">
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className="relative mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-bold transition-all"
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

export default function FreightManagement() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = ALL_FREIGHT_MODULES

    if (activeCategory === 'rates') {
      list = FREIGHT_TARIFF_MODULES
    } else if (activeCategory === 'inbound') {
      list = INBOUND_FREIGHT_MODULES
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

  const ratesFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'rates'),
    [filteredModules]
  )
  const inboundFiltered = useMemo(
    () => filteredModules.filter((s) => s.category === 'inbound'),
    [filteredModules]
  )

  return (
    <div className="space-y-6 text-slate-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-amber-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-amber-300 transition hover:border-amber-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 p-2 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/20">
                <img src={travelIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">
                  {lang === 'en' ? "B'Groceries Logistics & Tariffs" : 'ការគ្រប់គ្រងការដឹកជញ្ជូនទំនិញ'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Freight Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រងថ្លៃដឹកជញ្ជូន'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Control shipping rates, delivery methods, pending purchase order shipments, landed cost calculations, and carrier service agreements.'
                : 'គ្រប់គ្រងអត្រាតម្លៃដឹកជញ្ជូន វិធីដឹកជញ្ជូន ការដឹកទំនិញ PO ដែលរង់ចាំ ការគណនាថ្លៃដើមទំនិញពិតប្រាកដ និងកិច្ចសន្យាក្រុមហ៊ុនដឹកជញ្ជូន។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Freight Nodes' : 'ម៉ូឌុលដឹកជញ្ជូន'}</span>
                <span className="text-amber-400">● Live</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                {ALL_FREIGHT_MODULES.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Landed Cost' : 'ថ្លៃដើមសរុប'}</span>
                <span className="text-emerald-400">● Enabled</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Unit Allocation
              </p>
            </div>
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
                ? 'Search tariffs, shipment methods, pending POs, landed costs...'
                : 'ស្វែងរកអត្រាតម្លៃ វិធីដឹកជញ្ជូន ការដឹកទំនិញ PO ថ្លៃដើម...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
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
            { key: 'all', en: 'All Modules', kh: 'ទាំងអស់', count: ALL_FREIGHT_MODULES.length },
            { key: 'rates', en: 'Tariffs & Methods', kh: 'អត្រា និងវិធីដឹក', count: FREIGHT_TARIFF_MODULES.length },
            { key: 'inbound', en: 'Inbound & Landed Cost', kh: 'ការដឹកចូល និងថ្លៃដើម', count: INBOUND_FREIGHT_MODULES.length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:text-white hover:border-slate-500'
              }`}
            >
              <span>{lang === 'kh' ? tab.kh : tab.en}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === tab.key ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. FEATURED ACTION CARD */}
      {(!searchQuery || 'shipment method'.includes(searchQuery.toLowerCase())) && (
        <Link
          to="/admin/freight-management/shipment-method"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900/60 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-2xl ring-1 ring-amber-400/40 shadow-md">
              🚚
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-['Montserrat']">
                  {lang === 'en' ? 'Shipment Methods & Fleet Routing' : 'វិធីដឹកជញ្ជូន និងការរៀបចំយានយន្ត'}
                </h3>
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider">
                  Logistics
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {lang === 'en'
                  ? 'Configure cold-chain delivery rules, motorcycle express dispatch, and nationwide road cargo logistics.'
                  : 'កំណត់លក្ខខណ្ឌដឹកជញ្ជូនត្រជាក់ ការដឹកជញ្ជូនតាមម៉ូតូលឿន និងរថយន្តទូទាំងប្រទេស។'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold text-amber-300 transition-transform group-hover:translate-x-1 shrink-0">
            <span>{lang === 'en' ? 'Configure Fleet' : 'កំណត់យានយន្ត'}</span>
            <ChevronIcon />
          </span>
        </Link>
      )}

      {/* 4. TARIFFS & METHODS */}
      {ratesFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-amber-500" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Shipping Rates & Transit Methods' : 'អត្រាតម្លៃដឹកជញ្ជូន និងវិធីសាស្ត្រ'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Delivery tariff tiers, freight providers, and carrier SLAs' : 'កម្រិតតម្លៃដឹកជញ្ជូន អ្នកផ្តល់សេវា និងកិច្ចព្រមព្រៀង'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{ratesFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {ratesFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* 5. INBOUND & LANDED COST */}
      {inboundFiltered.length > 0 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1.5 rounded-full bg-[#77BC1F]" />
              <div>
                <h2 className="text-base font-bold text-white font-['Montserrat']">
                  {lang === 'en' ? 'Inbound Shipments & Landed Costs' : 'ការដឹកទំនិញចូល និងការបែងចែកថ្លៃដើម'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en'
                    ? 'Pending vendor shipments, customs handling, and unit landed cost distribution'
                    : 'ការដឹកទំនិញពីអ្នកផ្គត់ផ្គង់ ពន្ធគយ និងការបែងចែកថ្លៃដឹកចូលថ្លៃដើម'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">{inboundFiltered.length} items</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {inboundFiltered.map((item) => (
              <ModuleCard key={item.key} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Empty Search State */}
      {filteredModules.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-3xl">
            🔍
          </div>
          <p className="text-sm font-bold text-white">
            {lang === 'en' ? `No modules found matching "${searchQuery}"` : `រកមិនឃើញម៉ូឌុលដែលត្រូវនឹង "${searchQuery}" ទេ`}
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
