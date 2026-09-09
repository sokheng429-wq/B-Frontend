import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import RealTimeClock from './RealTimeClock'
import StatCards from './StatCards'
import DonutPieChartWidget from './DonutPieChartWidget'
import HorizontalBarChart from './HorizontalBarChart'
import AreaLineChartWidget from './AreaLineChartWidget'
import UserSummaryCard from './UserSummaryCard'

import bagIcon from '../../../assets/icon/3dicons-bag-dynamic-color.png'
import targetIcon from '../../../assets/icon/3dicons-target-dynamic-color.png'
import boyIcon from '../../../assets/icon/3dicons-boy-dynamic-color.png'
import canIcon from '../../../assets/icon/3dicons-can-dynamic-color.png'

export default function DashboardOverview({
  dashboardData,
  dashboardLoading,
  dashboardError,
  setDashboardRefreshKey,
  lang,
  isAdmin,
  user,
  categoryData,
  monthlyProducts,
  monthlyData,
  stockKpis,
  appsByStatus,
  topLowStock,
  recentActivity,
  formatTime,
  TEXTS,
}) {
  const { isDark } = useTheme()

  return (
    <div className="space-y-6">
      {/* Loading / Error Banner */}
      {(dashboardLoading || dashboardError) && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm backdrop-blur-md ${
            dashboardError
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{dashboardError ? '⚠️' : '⚡'}</span>
            <span>{dashboardLoading ? TEXTS.loadingOverview[lang] : TEXTS.overviewError[lang]}</span>
          </div>
          {dashboardError && (
            <button
              type="button"
              onClick={() => setDashboardRefreshKey((k) => k + 1)}
              className="rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-400/30"
            >
              {TEXTS.retry[lang]}
            </button>
          )}
        </div>
      )}

      {/* ── 1. REAL-TIME STATUS BAR & CLOCK ── */}
      <RealTimeClock
        lang={lang}
        onRefresh={() => setDashboardRefreshKey((k) => k + 1)}
        isRefreshing={dashboardLoading}
      />

      {/* ── 2. EXECUTIVE STAT CARDS ── */}
      <StatCards
        dashboardData={dashboardData}
        stockKpis={stockKpis}
        appsByStatus={appsByStatus}
        lang={lang}
        isAdmin={isAdmin}
      />

      {/* ── 3. CHARTS ROW 1: DONUT & HORIZONTAL BAR ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DonutPieChartWidget
          categoryData={categoryData}
          stockKpis={stockKpis}
          appsByStatus={appsByStatus}
          lang={lang}
        />
        <HorizontalBarChart
          categoryData={categoryData}
          stockKpis={stockKpis}
          topLowStock={topLowStock}
          lang={lang}
        />
      </div>

      {/* ── 4. CHARTS ROW 2: AREA / LINE CHART WITH PEAK ANNOTATIONS & USER SUMMARY CARD ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AreaLineChartWidget
            monthlyProducts={monthlyProducts}
            monthlyActivity={monthlyData}
            lang={lang}
          />
        </div>
        <div className="xl:col-span-1">
          <UserSummaryCard
            user={user}
            dashboardData={dashboardData}
            lang={lang}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* ── 5. BOTTOM ROW: RECENT AUDIT ACTIVITY & DIRECT SHORTCUTS ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Activity Timeline */}
        <div className={`xl:col-span-2 rounded-3xl border p-6 transition-colors ${
          isDark
            ? 'border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-xl'
            : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className={`mb-4 flex items-center justify-between border-b pb-3 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#232F3F]'}`}>{TEXTS.recentTitle[lang]}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{TEXTS.recentSub[lang]}</p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-purple-500 hover:text-purple-600 hover:underline"
            >
              {lang === 'en' ? 'All Activity' : 'សកម្មភាពទាំងអស់'} →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">{TEXTS.noActivity[lang]}</div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-3.5 transition ${
                    isDark
                      ? 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg border ${
                        isDark ? 'border-slate-700/60 shadow-inner' : 'border-slate-200 bg-white'
                      }`}
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className={`truncate text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-[#232F3F]'}`}>
                        {item.detail}
                      </p>
                      <p className={`text-[10px] capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.type === 'job'
                          ? (lang === 'en' ? '💼 Job Position' : '💼 មុខតំណែងការងារ')
                          : (lang === 'en' ? '📋 Candidate Application' : '📋 ពាក្យសុំបេក្ខជន')}
                      </p>
                    </div>
                  </div>

                  <span className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-mono border ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700/60'
                      : 'bg-slate-100 text-slate-600 border-slate-200 font-semibold'
                  }`}>
                    {formatTime(item.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className={`xl:col-span-1 rounded-3xl border p-6 flex flex-col justify-between transition-colors ${
          isDark
            ? 'border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-xl'
            : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div>
            <div className={`mb-4 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#232F3F]'}`}>{TEXTS.quickActions[lang]}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{TEXTS.quickActionsSub[lang]}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/admin/products/add', icon: bagIcon, label: { en: 'Add Product', kh: 'បន្ថែមផលិតផល' }, color: '#10b981' },
                { to: '/admin/jobs/add', icon: targetIcon, label: { en: 'Post Job', kh: 'ប្រកាសការងារ' }, color: '#f59e0b', adminOnly: true },
                { to: '/admin/members/add', icon: boyIcon, label: { en: 'Add Member', kh: 'បន្ថែមសមាជិក' }, color: '#3b82f6', adminOnly: true },
                { to: '/products', icon: canIcon, label: { en: 'Public Shop', kh: 'ហាងទំនិញ' }, color: '#a855f7' },
              ]
                .filter((item) => !item.adminOnly || isAdmin)
                .map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition hover:-translate-y-0.5 ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/80 hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg'
                        : 'border-slate-200 bg-slate-50/80 hover:border-[#77BC1F] hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <img src={action.icon} alt="" className="h-6 w-6 object-contain" />
                    </span>
                    <span className={`text-xs font-bold transition-colors ${
                      isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-[#232F3F]'
                    }`}>
                      {action.label[lang]}
                    </span>
                  </Link>
                ))}
            </div>
          </div>

          <div className={`mt-4 rounded-2xl border p-3 text-center transition-colors ${
            isDark
              ? 'border-emerald-500/20 bg-emerald-950/20'
              : 'border-emerald-200 bg-emerald-50/80'
          }`}>
            <p className={`text-[11px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {lang === 'en' ? 'B’Groceries ERP Suite v2.0' : 'ប្រព័ន្ធគ្រប់គ្រង B’Groceries ២.០'}
            </p>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-emerald-700/80'}`}>
              {lang === 'en' ? 'All systems active and operational' : 'ប្រព័ន្ធទាំងអស់ដំណើរការយ៉ាងល្អ'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
