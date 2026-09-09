import React, { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

// 3D Icons
import creditCardIcon from '../../assets/icon/3dicons-credit-card-dynamic-color.png'
import mobileIcon from '../../assets/icon/3dicons-mobile-dynamic-color.png'
import fileTextIcon from '../../assets/icon/3dicons-file-text-dynamic-color.png'
import keyIcon from '../../assets/icon/3dicons-key-dynamic-color.png'
import computerIcon from '../../assets/icon/3dicons-computer-dynamic-color.png'
import bellIcon from '../../assets/icon/3dicons-bell-dynamic-color.png'
import chatIcon from '../../assets/icon/3dicons-chat-bubble-dynamic-color.png'
import settingIcon from '../../assets/icon/3dicons-setting-dynamic-color.png'
import flashIcon from '../../assets/icon/3dicons-flash-dynamic-color.png'

import './ProductsHub.css'

// THE EXACT 9 INTEGRATION MODULES
export const INTEGRATION_MODULES = [
  {
    key: 'payment-gateway',
    icon: creditCardIcon,
    en: 'Payment Gateway',
    kh: 'ច្រកទូទាត់ប្រាក់',
    descEn: 'Configure ABA KHQR, Wing, ACLEDA, Visa, MasterCard, and Alipay merchants.',
    descKh: 'ភ្ជាប់ និងកំណត់ច្រកទូទាត់ ABA KHQR, Wing, ACLEDA, Visa និង MasterCard។',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    category: 'channels',
    tag: 'Payment',
    route: '/admin/integration/payment-gateway',
  },
  {
    key: 'app',
    icon: mobileIcon,
    en: 'App',
    kh: 'កម្មវិធី',
    descEn: 'Manage e-commerce shopper mobile app, customer loyalty tokens, and push webhooks.',
    descKh: 'គ្រប់គ្រងកម្មវិធីទូរស័ព្ទទិញទំនិញ ប្រព័ន្ធពិន្ទុសមាជិក និង Webhook។',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    category: 'channels',
    tag: 'Apps',
    route: '/admin/integration/app',
  },
  {
    key: 'template',
    icon: fileTextIcon,
    en: 'Template',
    kh: 'ឯកសារគំរូ',
    descEn: 'Customize 80mm thermal receipt formats, ESC/POS printer codes, and invoice headers.',
    descKh: 'កំណត់ទម្រង់វិក័យប័ត្រកម្ដៅ ៨០មម ភាសាខ្មែរ និងក្បាលលិខិតវិក័យប័ត្រ។',
    color: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.12)',
    category: 'channels',
    tag: 'Thermal',
    route: '/admin/integration/template',
  },
  {
    key: 'key',
    icon: keyIcon,
    en: 'Key',
    kh: 'សោលគន្លឹះ',
    descEn: 'Generate developer API bearer tokens, manage OAuth clients, and audit webhook logs.',
    descKh: 'បង្កើតសោ API គ្រប់គ្រងកម្មវិធីភ្ជាប់ និងតាមដានកំណត់ត្រា Webhook។',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    category: 'channels',
    tag: 'API',
    route: '/admin/integration/key',
  },
  {
    key: 'station-info',
    icon: computerIcon,
    en: 'Station info',
    kh: 'ព័ត៌មានស្ថានីយ',
    descEn: 'Register counter POS terminals, pole displays, cash drawers, and barcode scanners.',
    descKh: 'ចុះឈ្មោះស្ថានីយ POS កុងទ័រ ថតលុយស្វ័យប្រវត្តិ និងម៉ាស៊ីនស្កេនបារកូដ។',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    category: 'hardware',
    tag: 'Hardware',
    route: '/admin/integration/station-info',
  },
  {
    key: 'sync-notification',
    icon: bellIcon,
    en: 'Sync Notification',
    kh: 'ការជូនដំណឹងសមកាលកម្ម',
    descEn: 'Telegram bot notifications for low stock alerts, cashier drawer opens, and huge sales.',
    descKh: 'ការផ្ញើសារជូនដំណឹងតាម Telegram ពេលស្តុកទាប ឬបើកថតលុយ។',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    category: 'hardware',
    tag: 'Telegram',
    route: '/admin/integration/sync-notification',
  },
  {
    key: 'communication',
    icon: chatIcon,
    en: 'Communication',
    kh: 'ការទំនាក់ទំនង',
    descEn: 'Connect SMS gateway providers for OTP authentication, invoice links, and delivery SMS.',
    descKh: 'ភ្ជាប់ច្រក SMS សម្រាប់លេខកូដ OTP តំណវិក័យប័ត្រ និងការដឹកជញ្ជូន។',
    color: '#77BC1F',
    bg: 'rgba(119, 188, 31, 0.12)',
    category: 'hardware',
    tag: 'SMS',
    route: '/admin/integration/communication',
  },
  {
    key: 'setting',
    icon: settingIcon,
    en: 'Setting',
    kh: 'ការកំណត់',
    descEn: 'Network timeout limits, automatic sync intervals, and SSL certificates.',
    descKh: 'កំណត់ពេលវេលាឆ្លើយតបបណ្តាញ ភាពញឹកញាប់នៃការធ្វើសមកាលកម្ម និង SSL។',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    category: 'hardware',
    tag: 'Network',
    route: '/admin/integration/setting',
  },
  {
    key: 'dual-display',
    icon: flashIcon,
    en: 'Dual Display',
    kh: 'អេក្រង់បង្ហាញពីរ',
    descEn: 'Configure secondary customer-facing screens for live totals and promotional media.',
    descKh: 'កំណត់អេក្រង់ទីពីរសម្រាប់អតិថិជនមើលតម្លៃទំនិញ និងផ្ទាំងផ្សាយពាណិជ្ជកម្ម។',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    category: 'hardware',
    tag: 'Screen',
    route: '/admin/integration/dual-display',
  },
]

export const ALL_INTEGRATION_MODULES = INTEGRATION_MODULES

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
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
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
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors font-['Montserrat']">
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
        <span>{lang === 'kh' ? 'បើកដំណើរការ' : 'Open Integration'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function Integration() {
  const { lang } = useLanguage()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Check if current route is a detail view: /admin/integration/:moduleKey
  const pathParts = location.pathname.split('/').filter(Boolean)
  const isDetail = pathParts.length >= 3 && pathParts[1] === 'integration'
  const detailKey = isDetail ? pathParts[2] : null
  const currentDetailModule = useMemo(() => {
    if (!detailKey) return null
    return INTEGRATION_MODULES.find((m) => m.key === detailKey) || null
  }, [detailKey])

  // Save/action notification state
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)

  const handleSave = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleCopy = (txt, id) => {
    navigator.clipboard?.writeText(txt)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = INTEGRATION_MODULES

    if (activeCategory === 'channels') {
      list = list.filter((s) => s.category === 'channels')
    } else if (activeCategory === 'hardware') {
      list = list.filter((s) => s.category === 'hardware')
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

  // ==========================================
  // VIEW 1: INTEGRATION DETAIL VIEW
  // Route: /admin/integration/:moduleKey
  // ==========================================
  if (isDetail && currentDetailModule) {
    const m = currentDetailModule

    return (
      <div className="space-y-6 text-slate-100 font-['Montserrat']">
        {/* Banner Header */}
        <section
          className="relative overflow-hidden rounded-3xl border p-5 sm:p-7 shadow-2xl"
          style={{
            borderColor: `${m.color}30`,
            background: `linear-gradient(135deg, ${m.color}15 0%, #0f172a 60%, #080c14 100%)`,
            boxShadow: `0 20px 40px -15px ${m.color}20`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl opacity-20"
            style={{ background: m.color }}
          />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Link to="/admin" className="hover:text-white transition">Dashboard</Link>
                <span>/</span>
                <Link to="/admin/integration" className="hover:text-white transition">Integration</Link>
                <span>/</span>
                <span style={{ color: m.color }}>{lang === 'kh' ? m.kh : m.en}</span>
              </div>

              <div className="flex items-center gap-3.5">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-lg"
                  style={{
                    background: `${m.color}15`,
                    borderColor: `${m.color}40`,
                  }}
                >
                  <img src={m.icon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
                </span>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: m.color }}>
                    {lang === 'en' ? 'Hardware & API Integration' : 'ការតភ្ជាប់ឧបករណ៍ និង API'}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {lang === 'kh' ? m.kh : m.en}
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                {lang === 'kh' ? m.descKh : m.descEn}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
              <Link
                to="/admin/integration"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
              >
                ← {lang === 'en' ? 'All Integrations' : 'ការតភ្ជាប់ទាំងអស់'}
              </Link>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black text-white shadow-lg transition active:scale-95 hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${m.color}, #4338ca)`,
                  boxShadow: `0 8px 20px -6px ${m.color}80`,
                }}
              >
                <span>⚡</span>
                <span>{lang === 'en' ? 'Save & Sync' : 'រក្សាទុក និងធ្វើសមកាលកម្ម'}</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Bar across all 9 integration modules */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {lang === 'en' ? 'Jump to Integration (9):' : 'ផ្លូវកាត់ការតភ្ជាប់ (៩)៖'}
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {INTEGRATION_MODULES.map((mod) => {
                const isActive = mod.key === m.key
                return (
                  <Link
                    key={mod.key}
                    to={mod.route}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-white font-bold ring-2 shadow-md'
                        : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600 hover:bg-slate-800/40'
                    }`}
                    style={{
                      backgroundColor: isActive ? `${mod.color}25` : undefined,
                      borderColor: isActive ? mod.color : undefined,
                      boxShadow: isActive ? `0 4px 12px ${mod.color}30` : undefined,
                    }}
                  >
                    <img src={mod.icon} alt="" className="h-4 w-4 object-contain" />
                    <span>{lang === 'kh' ? mod.kh : mod.en}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Save feedback alert */}
        {savedSuccess && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-emerald-300 text-xs font-bold shadow-lg animate-in fade-in duration-200">
            <span className="text-xl">✅</span>
            <span>{lang === 'en' ? `Integration settings for ${m.en} successfully synced and verified.` : `ការកំណត់សម្រាប់ ${m.kh} ត្រូវបានធ្វើសមកាលកម្មដោយជោគជ័យ។`}</span>
          </div>
        )}

        {/* Detail Body per Module */}
        <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-md p-5 sm:p-7 shadow-xl shadow-black/40 space-y-6">

          {/* 1. Payment Gateway */}
          {m.key === 'payment-gateway' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Payment Gateway Merchants</h2>
                <p className="text-xs text-slate-400">Configure real-time QR payment gateways and EMV terminal listeners.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'ABA PayWay (Bakong KHQR)', mid: 'MCH-BGROC-998', fee: '0.15%', status: 'CONNECTED', type: 'Dynamic QR' },
                  { name: 'Wing Bank KHQR', mid: 'WING-MERCH-4412', fee: '0.20%', status: 'CONNECTED', type: 'Merchant QR' },
                  { name: 'ACLEDA X-Pay', mid: 'ACLE-781920-01', fee: '0.20%', status: 'CONNECTED', type: 'Mobile Banking' },
                  { name: 'Canadia POS EMV Terminal', mid: 'IP: 192.168.1.105:8080', fee: '1.50%', status: 'ONLINE', type: 'Ethernet POS' },
                  { name: 'Alipay+ & WeChat Pay', mid: 'ALI-GLOBAL-331', fee: '1.80%', status: 'STANDBY', type: 'Cross-Border' },
                ].map((pg) => (
                  <div key={pg.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 hover:border-blue-500/40 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-white">{pg.name}</h3>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{pg.mid}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">● {pg.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{pg.type}</span>
                      <span className="font-mono text-blue-400 font-bold">Fee: {pg.fee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. App */}
          {m.key === 'app' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Shopper Mobile & Web Applications</h2>
                <p className="text-xs text-slate-400">Manage client mobile shopping apps, loyalty card synchronization, and push tokens.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                  <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">B'Groceries iOS & Android Client</h3>
                  <div className="space-y-2">
                    <p className="text-slate-300">Live Production App Version: <strong className="text-white font-mono">v2.4.1 (Build 182)</strong></p>
                    <p className="text-slate-300">Minimum Required Version: <strong className="text-white font-mono">v2.1.0</strong></p>
                    <p className="text-slate-300">Active Mobile Tokens: <strong className="text-emerald-400 font-mono">8,420 Active Users</strong></p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                  <h3 className="font-bold text-blue-400 uppercase tracking-wider text-[11px]">Firebase Cloud Messaging (FCM)</h3>
                  <div className="space-y-2">
                    <p className="text-slate-300">Push Status: <strong className="text-emerald-400">● Operational</strong></p>
                    <p className="text-slate-300">Project ID: <span className="font-mono text-slate-400">bgroceries-kh-prod</span></p>
                    <p className="text-slate-300">Delivery Latency: <span className="font-mono text-slate-400">&lt; 250ms</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Template */}
          {m.key === 'template' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Thermal Receipt & Document Templates</h2>
                <p className="text-xs text-slate-400">Configure 80mm ESC/POS cash register receipt layout, tax invoice headers, and barcode slips.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                  <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Receipt Header & Printing Options</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Header Store Name</label>
                      <input type="text" defaultValue="B'GROCERIES SUPERMARKET" className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Receipt Footer Notice</label>
                      <input type="text" defaultValue="Thank you for shopping at B'Groceries! Please check items upon receipt." className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none" />
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                      <span className="text-slate-300">Print ABA KHQR Payment QR at receipt bottom</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                      <span className="text-slate-300">Auto-cut paper at the end of transaction</span>
                    </label>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-700 bg-white text-slate-950 font-mono text-xs space-y-2 shadow-2xl max-w-sm mx-auto">
                  <div className="text-center border-b border-dashed border-slate-400 pb-2">
                    <p className="font-black text-sm">B'GROCERIES SUPERMARKET</p>
                    <p className="text-[10px] text-slate-600">Building #18, Preah Monivong Blvd</p>
                    <p className="text-[10px] text-slate-600">VATTIN: K008-902203114</p>
                  </div>
                  <div className="text-[10px] space-y-0.5 pt-1">
                    <div className="flex justify-between"><span>Inv: INV-2026-9812</span><span>Date: 2026-09-09</span></div>
                    <div className="flex justify-between"><span>Cashier: Sreynoch</span><span>POS: #01</span></div>
                  </div>
                  <div className="border-y border-dashed border-slate-400 py-1 text-[11px] space-y-1">
                    <div className="flex justify-between"><span>Fresh Strawberries 500g</span><span>$4.50</span></div>
                    <div className="flex justify-between"><span>Angkor Pure Drinking Water</span><span>$0.60</span></div>
                  </div>
                  <div className="text-[11px] font-bold pt-1 space-y-0.5">
                    <div className="flex justify-between"><span>SUBTOTAL:</span><span>$5.10</span></div>
                    <div className="flex justify-between text-slate-600 text-[10px]"><span>VAT 10%:</span><span>$0.51</span></div>
                    <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-1"><span>TOTAL (USD):</span><span>$5.61</span></div>
                    <div className="flex justify-between text-xs text-slate-700"><span>TOTAL (KHR):</span><span>23,000 ៛</span></div>
                  </div>
                  <div className="text-center text-[10px] text-slate-600 pt-2 border-t border-dashed border-slate-400">
                    <p>*** THANK YOU FOR SHOPPING! ***</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Key */}
          {m.key === 'key' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">API Keys & OAuth Tokens</h2>
                <p className="text-xs text-slate-400">Generate bearer tokens for external warehouse logistics, mobile apps, and accounting ERPs.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Production POS Hardware Key', id: 'pk1', token: 'bgroc_live_pos_a88b192c739102837482', scopes: 'pos:checkout, pos:sync', status: 'ACTIVE' },
                  { name: 'Shopper Mobile App Bearer Token', id: 'pk2', token: 'bgroc_live_app_m99c2847192837491023', scopes: 'orders:create, customer:read', status: 'ACTIVE' },
                  { name: 'Accounting ERP Webhook Key', id: 'pk3', token: 'bgroc_wh_erp_91827491827491028374', scopes: 'reports:export, finance:read', status: 'ACTIVE' },
                ].map((k) => (
                  <div key={k.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-white">{k.name}</h3>
                      <p className="text-[11px] font-mono text-purple-400 mt-0.5">{k.token.slice(0, 16)}••••••••••••</p>
                      <p className="text-[10px] text-slate-500">Scopes: {k.scopes}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(k.token, k.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white transition shrink-0"
                    >
                      {copiedKey === k.id ? '✓ Copied' : 'Copy Key'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Station info */}
          {m.key === 'station-info' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">POS Stations & Counter Registers</h2>
                <p className="text-xs text-slate-400">View live connectivity status of counter terminals, barcode readers, and receipt printers.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { id: 'POS-TK01', outlet: 'Main Mart Toul Kork', ip: '192.168.1.51', printer: 'Epson TM-T88VI', scanner: 'Honeywell 2D', status: 'ONLINE' },
                  { id: 'POS-TK02', outlet: 'Main Mart Toul Kork', ip: '192.168.1.52', printer: 'Epson TM-T88VI', scanner: 'Honeywell 2D', status: 'ONLINE' },
                  { id: 'POS-BKK01', outlet: 'BKK1 Flagship', ip: '192.168.2.51', printer: 'Star TSP100', scanner: 'Zebra DS2208', status: 'ONLINE' },
                  { id: 'POS-BKK02', outlet: 'BKK1 Flagship', ip: '192.168.2.52', printer: 'Star TSP100', scanner: 'Zebra DS2208', status: 'ONLINE' },
                  { id: 'POS-SEN01', outlet: 'Sen Sok Mega Mart', ip: '192.168.3.51', printer: 'Epson TM-m30II', scanner: 'Datalogic 2D', status: 'ONLINE' },
                  { id: 'POS-MOB01', outlet: 'Mobile Express Cart', ip: '192.168.1.99', printer: 'Bluetooth Thermal', scanner: 'Built-in Cam', status: 'STANDBY' },
                ].map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2 hover:border-cyan-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-cyan-400">{s.id}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">● {s.status}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{s.outlet}</h3>
                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <p>IP: <span className="font-mono text-slate-300">{s.ip}</span></p>
                      <p>Printer: <span className="text-slate-300">{s.printer}</span></p>
                      <p>Scanner: <span className="text-slate-300">{s.scanner}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Sync Notification */}
          {m.key === 'sync-notification' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Telegram Real-Time Alert Bot</h2>
                <p className="text-xs text-slate-400">Broadcast automated warehouse alerts, cash variance alerts, and daily sales reports to Telegram.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Telegram Bot Token</label>
                  <input type="text" defaultValue="7182938192:AAFxK9918237491028374_BGrocAlerts" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-amber-300 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Channel / Group Chat ID</label>
                  <input type="text" defaultValue="@bgroceries_management_alerts" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-white outline-none" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Active Notification Rules</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <span>Instant alert when item stock falls below 5 units</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <span>Instant alert on large transaction exceeding $500.00</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <span>Daily EOD closing summary sent at 22:30</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 7. Communication */}
          {m.key === 'communication' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">SMS Gateway & Customer Messaging</h2>
                <p className="text-xs text-slate-400">Configure SMS delivery for customer digital receipts, OTP logins, and delivery tracking SMS.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">SMS Gateway Provider</label>
                  <input type="text" defaultValue="Plasgate SMS API (Smart / Cellcard / Metfone)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Approved Sender ID</label>
                  <input type="text" defaultValue="BGROCERIES" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono font-bold text-lime-400 outline-none" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-lime-500/30 bg-lime-500/10 text-xs text-lime-300 flex items-center justify-between">
                <span>SMS Gateway Balance: <strong>14,850 SMS Credits</strong></span>
                <button type="button" className="px-3 py-1 rounded-lg bg-lime-600 text-white font-bold hover:bg-lime-500 transition">Top Up Credits</button>
              </div>
            </div>
          )}

          {/* 8. Setting */}
          {m.key === 'setting' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Integration Network & Sync Settings</h2>
                <p className="text-xs text-slate-400">Configure timeout thresholds, background polling intervals, and failover parameters.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Connection Timeout</label>
                  <select defaultValue="10" className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                    <option value="5">5 Seconds</option>
                    <option value="10">10 Seconds (Recommended)</option>
                    <option value="30">30 Seconds</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Real-time Sync Interval</label>
                  <select defaultValue="ws" className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                    <option value="ws">WebSockets (Live Instant)</option>
                    <option value="30">Every 30 Seconds</option>
                    <option value="60">Every 1 Minute</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Webhook Retry Limit</label>
                  <select defaultValue="3" className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                    <option value="1">1 Attempt</option>
                    <option value="3">3 Attempts with Backoff</option>
                    <option value="5">5 Attempts</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 9. Dual Display */}
          {m.key === 'dual-display' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white">Customer Facing Dual Display</h2>
                <p className="text-xs text-slate-400">Configure customer secondary screens displaying live item totals and marketing banners.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
                  <h3 className="font-bold text-pink-400 uppercase tracking-wider text-[11px]">Display Parameters</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Secondary Monitor Resolution</label>
                      <select defaultValue="1080" className="w-full mt-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white outline-none">
                        <option value="1080">1920x1080 (16:9 Full HD)</option>
                        <option value="768">1024x768 (4:3 Standard)</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                      <span className="text-slate-300">Play promotional promotional slideshow when cart is idle</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                      <span className="text-slate-300">Display ABA KHQR QR code prominently on checkout</span>
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-center">
                  <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-pink-950 flex flex-col items-center justify-center p-6 border border-slate-800 text-xs">
                    <span className="text-2xl mb-1">🛒</span>
                    <p className="font-bold text-white">Welcome to B'Groceries Supermarket</p>
                    <p className="text-[11px] text-pink-300 mt-1">Scan items or pay with ABA KHQR</p>
                  </div>
                  <p className="text-[10px] text-slate-500">Live Customer Secondary Display Monitor Preview</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW 2: INTEGRATION HUB (THE 9 MODULES)
  // Route: /admin/integration
  // ==========================================
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
                <img src={creditCardIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">
                  {lang === 'en' ? "B'Groceries Connected Ecosystem" : 'ប្រព័ន្ធតភ្ជាប់ និងឧបករណ៍'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Integration' : 'ការរួមបញ្ចូល'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'External channel connectivity — integrate ABA KHQR payment gateways, mobile apps, ESC/POS thermal receipt templates, developer keys, counter POS stations, Telegram alerts, SMS communication, network settings, and customer dual displays.'
                : 'ការតភ្ជាប់ប្រព័ន្ធខាងក្រៅ — ច្រកទូទាត់ ABA KHQR កម្មវិធីទូរស័ព្ទ គំរូបោះពុម្ពវិក័យប័ត្រ សោលកូដ ព័ត៌មានស្ថានីយ POS សារជូនដំណឹងសមកាលកម្ម ការទំនាក់ទំនង ការកំណត់ និងអេក្រង់បង្ហាញពីរ។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:flex lg:flex-col shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Integration Modules' : 'ម៉ូឌុលតភ្ជាប់'}</span>
                <span className="text-cyan-400 font-bold">9 Modules</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">9</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'POS & KHQR Sync' : 'KHQR និង POS'}</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Connected & Verified
              </p>
            </div>
          </div>
        </div>

        {/* Quick Pill Jump Bar for all 9 modules */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Quick Jump (9 Integrations):' : 'ផ្លូវកាត់ការតភ្ជាប់ទាំង ៩៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {INTEGRATION_MODULES.map((m) => (
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
                ? 'Search 9 integrations: payment gateway, app, template, key, station...'
                : 'ស្វែងរកការតភ្ជាប់ទាំង ៩៖ ច្រកទូទាត់ កម្មវិធី គំរូ សោ ស្ថានីយ...'
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
            { key: 'all', en: 'All 9', kh: 'ទាំងអស់ ៩', count: INTEGRATION_MODULES.length },
            { key: 'channels', en: 'Payment & Apps', kh: 'ការទូទាត់ & កម្មវិធី', count: INTEGRATION_MODULES.filter((m) => m.category === 'channels').length },
            { key: 'hardware', en: 'Hardware & POS', kh: 'ឧបករណ៍ & POS', count: INTEGRATION_MODULES.filter((m) => m.category === 'hardware').length },
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

      {/* 3. 9 MODULES GRID */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {lang === 'en' ? `No integrations found matching "${searchQuery}"` : `រកមិនឃើញការតភ្ជាប់ដែលត្រូវនឹង "${searchQuery}" ទេ`}
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
