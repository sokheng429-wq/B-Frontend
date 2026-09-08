import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import folderFavIcon from '../../assets/icon/3dicons-folder-fav-dynamic-color.png'
import bookmarkIcon from '../../assets/icon/3dicons-bookmark-fav-dynamic-color.png'
import starIcon from '../../assets/icon/3dicons-star-dynamic-color.png'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import './ProductsHub.css'

export const EMPLOYEE_MODULES = [
  {
    key: 'employee',
    icon: '👤',
    imgIcon: boyIcon,
    en: 'Employee',
    kh: 'និយោជក',
    descEn: 'View of employee information',
    descKh: 'មើលព័ត៌មានបុគ្គលិក',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    route: '/admin/employee/list',
    tag: 'Staff',
  },
  {
    key: 'office',
    icon: '🏢',
    imgIcon: folderFavIcon,
    en: 'Office',
    kh: 'ការិយាល័យ',
    descEn: 'View of office information',
    descKh: 'មើលព័ត៌មានការិយាល័យ',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    route: '/admin/employee/office',
    tag: 'Branches',
  },
  {
    key: 'department',
    icon: '📋',
    imgIcon: bookmarkIcon,
    en: 'Department',
    kh: 'ដេប៉ាតឺម៉ង់',
    descEn: 'View of department information',
    descKh: 'មើលព័ត៌មានដេប៉ាតឺម៉ង់',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
    route: '/admin/employee/department',
    tag: 'Units',
  },
  {
    key: 'section',
    icon: '🔖',
    imgIcon: starIcon,
    en: 'Section',
    kh: 'ផ្នែក',
    descEn: 'View of section information',
    descKh: 'មើលព័ត៌មានផ្នែក',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/admin/employee/section',
    tag: 'Teams',
  },
  {
    key: 'position',
    icon: '⭐',
    imgIcon: crownIcon,
    en: 'Position',
    kh: 'មុខតំណែង',
    descEn: 'View of position information',
    descKh: 'មើលព័ត៌មានមុខតំណែង',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    route: '/admin/employee/position',
    tag: 'Roles',
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
      className="hub-card group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#141922]/90 p-5 text-left transition-all duration-300 hover:border-slate-700 hover:bg-[#1a2230] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: item.color }}
      />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className="hub-icon flex h-13 w-13 items-center justify-center rounded-2xl ring-1 transition-all duration-300 group-hover:scale-110 shadow-lg"
            style={{
              background: item.bg,
              borderColor: item.color + '40',
            }}
          >
            <img src={item.imgIcon} alt="" className="h-8 w-8 object-contain drop-shadow" />
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
          <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors font-['Montserrat']">
            {lang === 'kh' ? item.kh : item.en}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {lang === 'kh' ? item.descKh : item.descEn}
          </p>
        </div>
      </div>

      <div
        className="relative mt-5 flex items-center justify-between pt-3.5 border-t border-slate-800/80 text-xs font-bold transition-all"
        style={{ color: item.color }}
      >
        <span>{lang === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Module'}</span>
        <span className="transform transition-transform duration-200 group-hover:translate-x-1.5">
          <ChevronIcon />
        </span>
      </div>
    </Link>
  )
}

export default function Employee() {
  const { lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return EMPLOYEE_MODULES

    return EMPLOYEE_MODULES.filter((s) => {
      const en = (s.en || '').toLowerCase()
      const kh = (s.kh || '').toLowerCase()
      const descEn = (s.descEn || '').toLowerCase()
      const descKh = (s.descKh || '').toLowerCase()
      const key = (s.key || '').toLowerCase()
      return en.includes(q) || kh.includes(q) || descEn.includes(q) || descKh.includes(q) || key.includes(q)
    })
  }, [searchQuery])

  return (
    <div className="space-y-6 text-slate-100 font-['Montserrat']">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f17] p-5 sm:p-7 shadow-2xl shadow-indigo-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 transition hover:border-indigo-400 hover:text-white active:scale-95"
            >
              <ChevronLeftIcon /> {lang === 'en' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង'}
            </Link>

            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 p-2 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/20">
                <img src={boyIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
              </span>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400">
                  {lang === 'en' ? "B'Groceries Human Resources" : 'ធនធានមនុស្ស និងបុគ្គលិក'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {lang === 'en' ? 'Employee' : 'និយោជក'}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {lang === 'en'
                ? 'Manage enterprise employee roster, corporate branch offices, organizational departments, specialized operational sections, and job positions.'
                : 'គ្រប់គ្រងបញ្ជីឈ្មោះបុគ្គលិក ការិយាល័យសាខា ដេប៉ាតឺម៉ង់ ផ្នែកការងារ និងមុខតំណែង។'}
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 shrink-0 min-w-[220px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Modules' : 'ម៉ូឌុល'}</span>
                <span className="text-indigo-400 font-bold">5 Only</span>
              </div>
              <p className="mt-1 font-mono text-2xl font-black text-white">
                5
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'en' ? 'Structure' : 'រចនាសម្ព័ន្ធ'}</span>
                <span className="text-emerald-400">● Active</span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-300">
                Enterprise Org
              </p>
            </div>
          </div>
        </div>

        {/* 5 EMPLOYEE MODULE PILLS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {lang === 'en' ? 'Employee Modules (5):' : 'ម៉ូឌុលបុគ្គលិក (៥)៖'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {EMPLOYEE_MODULES.map((cat) => (
              <Link
                key={cat.key}
                to={cat.route}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-indigo-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{lang === 'kh' ? cat.kh : cat.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SEARCH BAR */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-[#1e293b]/70 backdrop-blur-md p-3.5 shadow-lg">
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
                ? 'Search employee, office, department, section, position...'
                : 'ស្វែងរកបុគ្គលិក ការិយាល័យ ដេប៉ាតឺម៉ង់ ផ្នែក មុខតំណែង...'
            }
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
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

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          {filteredModules.length} / 5 Modules
        </div>
      </div>

      {/* 3. 5 MODULES GRID */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredModules.map((item) => (
            <ModuleCard key={item.key} item={item} lang={lang} />
          ))}
        </div>

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
      </section>
    </div>
  )
}
