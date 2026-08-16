import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import careerHero from '../../assets/Career.png'
import './Career.css'

const DEPARTMENTS = [
  { key: 'all', en: 'All Departments', kh: 'គ្រប់ផ្នែក' },
  { key: 'sales', en: 'Sales', kh: 'ផ្នែកលក់' },
  { key: 'logistics', en: 'Logistics', kh: 'ដឹកជញ្ជូន' },
  { key: 'marketing', en: 'Marketing', kh: 'ទីផ្សារ' },
  { key: 'tech', en: 'Technology', kh: 'បច្ចេកវិទ្យា' },
  { key: 'operations', en: 'Operations', kh: 'ប្រតិបត្តិការ' },
]

const JOBS = [
  { id: 1, title: { en: 'Senior Sales Executive', kh: 'ប្រតិបត្តិករលក់ជាន់ខ្ពស់' }, department: 'sales', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$500 - $800', kh: '៥០០ - ៨០០ ដុល្លារ' }, posted: '2 days ago', urgent: true },
  { id: 2, title: { en: 'Warehouse Supervisor', kh: 'អ្នកគ្រប់គ្រងឃ្លាំង' }, department: 'logistics', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$600 - $900', kh: '៦០០ - ៩០០ ដុល្លារ' }, posted: '3 days ago', urgent: false },
  { id: 3, title: { en: 'Delivery Driver', kh: 'អ្នកបើកបរដឹកជញ្ជូន' }, department: 'logistics', location: { en: 'Siem Reap', kh: 'សៀមរាប' }, type: 'Full-time', salary: { en: '$350 - $500', kh: '៣៥០ - ៥០០ ដុល្លារ' }, posted: '1 week ago', urgent: true },
  { id: 4, title: { en: 'Marketing Manager', kh: 'អ្នកគ្រប់គ្រងទីផ្សារ' }, department: 'marketing', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$1,000 - $1,500', kh: '១,០០០ - ១,៥០០ ដុល្លារ' }, posted: '5 days ago', urgent: false },
  { id: 5, title: { en: 'Social Media Specialist', kh: 'អ្នកជំនាញបណ្តាញសង្គម' }, department: 'marketing', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Part-time', salary: { en: '$300 - $450', kh: '៣០០ - ៤៥០ ដុល្លារ' }, posted: '4 days ago', urgent: false },
  { id: 6, title: { en: 'Full-Stack Developer', kh: 'អ្នកអភិវឌ្ឍ Full-Stack' }, department: 'tech', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$1,200 - $2,000', kh: '១,២០០ - ២,០០០ ដុល្លារ' }, posted: '1 day ago', urgent: true },
  { id: 7, title: { en: 'UI/UX Designer', kh: 'អ្នករចនា UI/UX' }, department: 'tech', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$800 - $1,300', kh: '៨០០ - ១,៣០០ ដុល្លារ' }, posted: '6 days ago', urgent: false },
  { id: 8, title: { en: 'Quality Control Officer', kh: 'មន្ត្រីត្រួតពិនិត្យគុណភាព' }, department: 'operations', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$400 - $600', kh: '៤០០ - ៦០០ ដុល្លារ' }, posted: '1 week ago', urgent: false },
  { id: 9, title: { en: 'Customer Support Agent', kh: 'ភ្នាក់ងារគាំទ្រអតិថិជន' }, department: 'operations', location: { en: 'Battambang', kh: 'បាត់ដំបង' }, type: 'Full-time', salary: { en: '$300 - $450', kh: '៣០០ - ៤៥០ ដុល្លារ' }, posted: '3 days ago', urgent: false },
  { id: 10, title: { en: 'Junior Accountant', kh: 'គណនេយ្យករជំនួយ' }, department: 'operations', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$450 - $650', kh: '៤៥០ - ៦៥០ ដុល្លារ' }, posted: '2 days ago', urgent: false },
  { id: 11, title: { en: 'Graphic Designer', kh: 'អ្នករចនាក្រាហ្វិក' }, department: 'marketing', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Contract', salary: { en: '$500 - $700', kh: '៥០០ - ៧០០ ដុល្លារ' }, posted: '1 week ago', urgent: false },
  { id: 12, title: { en: 'Data Analyst', kh: 'អ្នកវិភាគទិន្នន័យ' }, department: 'tech', location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' }, type: 'Full-time', salary: { en: '$900 - $1,400', kh: '៩០០ - ១,៤០០ ដុល្លារ' }, posted: '4 days ago', urgent: false },
]

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
  viewAll: { en: 'View All Positions', kh: 'មើលមុខតំណែងទាំងអស់' },
  urgent: { en: 'Urgent', kh: 'បន្ទាន់' },
  noResults: { en: 'No open positions in this department right now — check back soon!', kh: 'មិនមានមុខតំណែងបើកក្នុងផ្នែកនេះទេឥឡូវ — សូមពិនិត្យម្តងទៀតនាពេលឆាប់ៗ!' },
}

export const Career = () => {
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('all')

  const filteredJobs = filter === 'all'
    ? JOBS
    : JOBS.filter((j) => j.department === filter)

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
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.key}
                className={`career-filter-btn ${filter === dept.key ? 'career-filter-btn--active' : ''}`}
                onClick={() => setFilter(dept.key)}
              >
                {dept[lang]}
              </button>
            ))}
          </div>

          <div className="career-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="career-card">
                <div className="career-card-left">
                  <div className="career-card-icon">
                    <JobIcon />
                  </div>
                  <div className="career-card-info">
                    <div className="career-card-header">
                      <Link to="/career-detail" state={{ job }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className="career-card-title">{job.title[lang]}</h3>
                      </Link>
                      {job.urgent && (
                        <span className="career-urgent-tag">{TEXTS.urgent[lang]}</span>
                      )}
                    </div>
                    <div className="career-card-meta">
                      <span className="career-meta-item">
                        <PinIcon /> {job.location[lang]}
                      </span>
                      <span className="career-meta-item">
                        <ClockIcon /> {job.type}
                      </span>
                      <span className="career-meta-item">
                        <DollarIcon /> {job.salary[lang]}
                      </span>
                      <span className="career-meta-item career-meta-posted">
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link to="/career-detail" state={{ job }} className="career-apply-btn" style={{ background: '#232F3F', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {lang === 'en' ? 'Details' : 'ព័ត៌មានលម្អិត'}
                  </Link>
                  <Link to="/apply-now" className="career-apply-btn">
                    {TEXTS.apply[lang]}
                    <ChevronIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
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
