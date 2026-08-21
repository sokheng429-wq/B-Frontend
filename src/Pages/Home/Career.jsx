import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { publicAPI } from '../../api/api'
import careerHero from '../../assets/Career.png'
import './Career.css'

const formatPosted = (iso, lang) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const BENEFITS = [
  { icon: '⏰', en: 'Flexible Hours', kh: 'ម៉ោងបត់បែន' },
  { icon: '🏥', en: 'Health Insurance', kh: 'ធានារ៉ាប់រងសុខភាព' },
  { icon: '📚', en: 'Learning Budget', kh: 'ថវិកាសិក្សា' },
  { icon: '🎉', en: 'Team Events', kh: 'ព្រឹត្តិការណ៍ក្រុម' },
  { icon: '📈', en: 'Growth Path', kh: 'ផ្លូវរីកចម្រើន' },
  { icon: '🍎', en: 'Free Snacks', kh: 'អាហារសម្រន់ឥតគិតថ្លៃ' },
]

const STATS = [
  { value: '200+', en: 'Team Members', kh: 'សមាជិកក្រុម' },
  { value: '4', en: 'Cities', kh: 'ទីក្រុង' },
  { value: '95%', en: 'Retention Rate', kh: 'អត្រារក្សាបុគ្គលិក' },
  { value: '12+', en: 'Open Positions', kh: 'មុខតំណែងបើកទទួល' },
]

const TEXTS = {
  heroEyebrow: { en: "B'Groceries Careers", kh: "B'Groceries ការងារ" },
  title: { en: 'Join Our Team', kh: 'ចូលរួមជាមួយក្រុមការងារយើង' },
  subtitle: { en: "Build your career with Cambodia's fastest-growing grocery delivery service", kh: 'កសាងអាជីពរបស់អ្នកជាមួយសេវាកម្មដឹកជញ្ជូនគ្រឿងទេសដែលរីកចម្រើនលឿនបំផុតនៅកម្ពុជា' },
  benefitsEyebrow: { en: 'Perks & Benefits', kh: 'អត្ថប្រយោជន៍' },
  benefits: { en: 'Why Work With Us', kh: 'ហេតុអ្វីត្រូវធ្វើការជាមួយយើង' },
  benefitsSub: { en: 'We take care of our people — because great service starts with a great team.', kh: 'យើងថែរក្សាបុគ្គលិករបស់យើង — ព្រោះសេវាកម្មដ៏អស្ចារ្យចាប់ផ្តើមពីក្រុមការងារដ៏អស្ចារ្យ។' },
  apply: { en: 'Apply Now', kh: 'ដាក់ពាក្យឥឡូវនេះ' },
  details: { en: 'Details', kh: 'ព័ត៌មានលម្អិត' },
  allDepartments: { en: 'All Departments', kh: 'គ្រប់ផ្នែក' },
  noResults: { en: 'No open positions in this department right now — check back soon!', kh: 'មិនមានមុខតំណែងបើកក្នុងផ្នែកនេះទេឥឡូវ — សូមពិនិត្យម្តងទៀតនាពេលឆាប់ៗ!' },
  loading: { en: 'Loading open positions...', kh: 'កំពុងផ្ទុកមុខតំណែង...' },
  loadError: { en: 'Could not load open positions.', kh: 'មិនអាចផ្ទុកមុខតំណែងបានទេ។' },
  retry: { en: 'Try again', kh: 'ព្យាយាមម្តងទៀត' },
  posted: { en: 'Posted', kh: 'បានប្រកាស' },
}

export const Career = () => {
  const { lang } = useLanguage()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await publicAPI.getJobs()
        const data = Array.isArray(res.data) ? res.data : []
        if (!cancelled) setJobs(data)
      } catch (err) {
        if (!cancelled) setError(err.message || TEXTS.loadError[lang])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey, lang])

  // Department filter options are derived from the live data.
  const departments = useMemo(
    () => [...new Set(jobs.map((j) => j.department).filter(Boolean))].sort(),
    [jobs]
  )

  const filterOptions = useMemo(
    () => [{ key: 'all', label: TEXTS.allDepartments[lang] }, ...departments.map((d) => ({ key: d, label: d }))],
    [departments, lang]
  )

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter((j) => j.department === filter)

  return (
    <div className="career-page">
      {/* Hero */}
      <section className="career-hero">
        <div className="career-hero-bg" />
        <div className="career-hero-inner">
          <div className="career-hero-copy">
            <span className="career-hero-eyebrow">{TEXTS.heroEyebrow[lang]}</span>
            <h1 className="career-hero-title">{TEXTS.title[lang]}</h1>
            <p className="career-hero-subtitle">{TEXTS.subtitle[lang]}</p>
          </div>
          <div className="career-hero-visual">
            <img
              src={careerHero}
              alt="B'Groceries team"
              className="career-hero-img"
            />
          </div>
        </div>
        <div className="career-hero-stats">
          {STATS.map((stat) => (
            <div key={stat.value} className="career-stat">
              <span className="career-stat-value">{stat.value}</span>
              <span className="career-stat-label">{stat[lang]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="career-benefits">
        <div className="career-inner">
          <div className="career-section-header">
            <span className="career-section-eyebrow">{TEXTS.benefitsEyebrow[lang]}</span>
            <h2 className="career-section-title">{TEXTS.benefits[lang]}</h2>
            <p className="career-section-sub">{TEXTS.benefitsSub[lang]}</p>
          </div>
          <div className="benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.en} className="benefit-card">
                <div className="benefit-icon-wrap">
                  <span className="benefit-icon">{b.icon}</span>
                </div>
                <span className="benefit-label">{b[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="career-jobs">
        <div className="career-inner">
          <div className="career-jobs-header">
            <div>
              <span className="career-section-eyebrow">{lang === 'en' ? `${filteredJobs.length} Openings` : `${filteredJobs.length} មុខតំណែង`}</span>
              <h2 className="career-section-title">{lang === 'en' ? 'Open Positions' : 'មុខតំណែងដែលកំពុងទទួល'}</h2>
            </div>
          </div>

          <div className="career-filters">
            {filterOptions.map((dept) => (
              <button
                key={dept.key}
                className={`career-filter-btn ${filter === dept.key ? 'career-filter-btn--active' : ''}`}
                onClick={() => setFilter(dept.key)}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="career-empty">
              <span className="career-empty-icon">⏳</span>
              <p>{TEXTS.loading[lang]}</p>
            </div>
          ) : error ? (
            <div className="career-empty">
              <span className="career-empty-icon">⚠️</span>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => { setError(''); setLoading(true); setRefreshKey((k) => k + 1) }}
                className="career-retry-btn"
              >
                {TEXTS.retry[lang]}
              </button>
            </div>
          ) : (
            <div className="career-list">
              {filteredJobs.map((job) => (
                <div key={job.id} className="career-card">
                  <div className="career-card-left">
                    <div className="career-card-icon">
                      <JobIcon />
                    </div>
                    <div className="career-card-info">
                      <div className="career-card-header">
                        <Link to={`/career-detail/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 className="career-card-title">{job.title}</h3>
                        </Link>
                      </div>
                      <div className="career-card-meta">
                        <span className="career-meta-item">
                          <PinIcon /> {job.location}
                        </span>
                        <span className="career-meta-item">
                          <ClockIcon /> {job.type}
                        </span>
                        <span className="career-meta-item">
                          <DollarIcon /> {job.salary}
                        </span>
                        <span className="career-meta-item career-meta-posted">
                          🕐 {TEXTS.posted[lang]} {formatPosted(job.createdAt, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link to={`/career-detail/${job.id}`} className="career-apply-btn" style={{ background: '#232F3F', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {TEXTS.details[lang]}
                    </Link>
                    <Link to={`/apply-now?job=${job.id}`} className="career-apply-btn">
                      {TEXTS.apply[lang]}
                      <ChevronIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="career-empty">
              <span className="career-empty-icon">📭</span>
              <p>{TEXTS.noResults[lang]}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const JobIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const DollarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default Career
