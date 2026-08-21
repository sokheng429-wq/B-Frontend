import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { publicAPI } from '../../api/api'
import './Careerdetail.css'

const TEXTS = {
  home: { en: 'Home', kh: 'ទំព័រដើម' },
  career: { en: 'Careers', kh: 'ការងារ' },
  applyNow: { en: 'Apply Now', kh: 'ដាក់ពាក្យឥឡូវនេះ' },
  overviewTitle: { en: 'Job Overview', kh: 'ទិដ្ឋភាពទូទៅនៃតួនាទី' },
  responsibilitiesTitle: { en: 'Key Responsibilities', kh: 'ទំនួលខុសត្រូវចម្បង' },
  requirementsTitle: { en: 'Requirements', kh: 'តម្រូវការ' },
  benefitsTitle: { en: 'Benefits & Perks', kh: 'អត្ថប្រយោជន៍ និងការលើកទឹកចិត្ត' },
  department: { en: 'Department', kh: 'ផ្នែក' },
  location: { en: 'Location', kh: 'ទីតាំង' },
  type: { en: 'Job Type', kh: 'ប្រភេទ' },
  salary: { en: 'Salary Range', kh: 'ប្រាក់ខែ' },
  loading: { en: 'Loading job details...', kh: 'កំពុងផ្ទុកព័ត៌មានការងារ...' },
  notFound: { en: 'Job not found', kh: 'រកមិនឃើញការងារ' },
  notFoundText: { en: 'This position may have been filled or removed.', kh: 'មុខតំណែងនេះប្រហែលជាត្រូវបានបំពេញ ឬលុបចេញ។' },
  backToCareer: { en: 'Back to Careers', kh: 'ត្រលប់ទៅការងារ' },
  loadError: { en: 'Could not load this job.', kh: 'មិនអាចផ្ទុកការងារនេះបានទេ។' },
  retry: { en: 'Try again', kh: 'ព្យាយាមម្តងទៀត' },
}

const splitLines = (value) =>
  (value || '').split('\n').map((line) => line.trim()).filter(Boolean)

export const Careerdetail = () => {
  const { lang } = useLanguage()
  const { id } = useParams()
  const stateJob = useLocation().state?.job
  const [job, setJob] = useState(stateJob || null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const load = async () => {
      try {
        const res = await publicAPI.getJobById(id)
        if (!cancelled) {
          setJob(res.data || null)
          setError('')
        }
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
  }, [id, refreshKey, lang])

  // Line-oriented fields: description line 1 = overview, lines 2+ = responsibilities.
  const descLines = splitLines(job?.description)
  const overview = descLines[0] || ''
  const responsibilities = descLines.slice(1)
  const requirements = splitLines(job?.requirements)
  const benefits = splitLines(job?.benefits)

  const title = job?.title || (lang === 'kh' ? 'មុខតំណែង' : 'Position')
  const department = job?.department || (lang === 'kh' ? 'ផ្នែក' : 'Department')
  const jobLocation = job?.location || (lang === 'kh' ? 'ភ្នំពេញ' : 'Phnom Penh, Cambodia')
  const type = job?.type || (lang === 'kh' ? 'ពេញម៉ោង' : 'Full-time')
  const salary = job?.salary || (lang === 'kh' ? 'ប្រាក់ខែប្រកួតប្រជែង' : 'Competitive salary')

  if (loading) {
    return (
      <div className="cd-page">
        <div className="cd-inner">
          <div className="cd-loading">
            <span className="cd-loading-spinner" />
            <p>{TEXTS.loading[lang]}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="cd-page">
        <div className="cd-inner">
          <div className="cd-notfound">
            <span className="cd-notfound-icon">💼</span>
            <h1 className="cd-notfound-title">{TEXTS.notFound[lang]}</h1>
            <p>{error || TEXTS.notFoundText[lang]}</p>
            <div className="cd-notfound-actions">
              <Link to="/career" className="btn-apply">{TEXTS.backToCareer[lang]}</Link>
              {error && (
                <button
                  type="button"
                  className="btn-apply cd-retry-btn"
                  onClick={() => { setLoading(true); setError(''); setRefreshKey((k) => k + 1) }}
                >
                  {TEXTS.retry[lang]}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cd-page">
      <div className="cd-inner">

        <nav className="cd-breadcrumb">
          <Link to="/">{TEXTS.home[lang]}</Link>
          <span>/</span>
          <Link to="/career">{TEXTS.career[lang]}</Link>
          <span>/</span>
          <span className="cd-breadcrumb-current">{title}</span>
        </nav>

        <div className="cd-header">
          <div>
            <span className="cd-department-tag">{department}</span>
            <h1 className="cd-title">{title}</h1>
            <div className="cd-meta-row">
              <span className="cd-meta"><PinIcon /> {jobLocation}</span>
              <span className="cd-meta"><ClockIcon /> {type}</span>
              <span className="cd-meta"><CoinIcon /> {salary}</span>
            </div>
          </div>
          <Link to={`/apply-now?job=${job.id}`} className="btn-apply">{TEXTS.applyNow[lang]}</Link>
        </div>

        <div className="cd-layout">
          <div className="cd-main">
            {overview && (
              <section className="cd-section">
                <h2 className="cd-section-title">{TEXTS.overviewTitle[lang]}</h2>
                <p className="cd-text">{overview}</p>
              </section>
            )}

            {responsibilities.length > 0 && (
              <section className="cd-section">
                <h2 className="cd-section-title">{TEXTS.responsibilitiesTitle[lang]}</h2>
                <ul className="cd-list">
                  {responsibilities.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </section>
            )}

            {requirements.length > 0 && (
              <section className="cd-section">
                <h2 className="cd-section-title">{TEXTS.requirementsTitle[lang]}</h2>
                <ul className="cd-list">
                  {requirements.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </section>
            )}

            {benefits.length > 0 && (
              <section className="cd-section">
                <h2 className="cd-section-title">{TEXTS.benefitsTitle[lang]}</h2>
                <ul className="cd-list">
                  {benefits.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </section>
            )}
          </div>

          <aside className="cd-sidebar">
            <div className="cd-sidebar-card">
              <p className="cd-sidebar-label">{TEXTS.department[lang]}</p>
              <p className="cd-sidebar-value">{department}</p>
              <p className="cd-sidebar-label">{TEXTS.location[lang]}</p>
              <p className="cd-sidebar-value">{jobLocation}</p>
              <p className="cd-sidebar-label">{TEXTS.type[lang]}</p>
              <p className="cd-sidebar-value">{type}</p>
              <p className="cd-sidebar-label">{TEXTS.salary[lang]}</p>
              <p className="cd-sidebar-value">{salary}</p>
              <Link to={`/apply-now?job=${job.id}`} className="btn-apply btn-apply-block">
                {TEXTS.applyNow[lang]}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)
const CoinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2-3 .8-3 2 1.3 2 3 2 3-.8 3-2" />
  </svg>
)

export default Careerdetail
