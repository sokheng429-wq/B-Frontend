import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
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
}

export const Careerdetail = () => {
  const { lang } = useLanguage()
  const locationState = useLocation().state?.job

  const title = locationState?.title?.[lang] || locationState?.title || (lang === 'kh' ? 'អ្នកអភិវឌ្ឍ Frontend' : 'Frontend Developer')
  const department = locationState?.department || 'Engineering'
  const jobLocation = locationState?.location?.[lang] || locationState?.location || (lang === 'kh' ? 'ភ្នំពេញ' : 'Phnom Penh, Cambodia')
  const type = locationState?.type || (lang === 'kh' ? 'ពេញម៉ោង' : 'Full-time')
  const salary = locationState?.salary?.[lang] || locationState?.salary || '$500 – $800 / month'

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
          <Link to="/apply-now" className="btn-apply">{TEXTS.applyNow[lang]}</Link>
        </div>

        <div className="cd-layout">
          <div className="cd-main">
            <section className="cd-section">
              <h2 className="cd-section-title">{TEXTS.overviewTitle[lang]}</h2>
              <p className="cd-text">
                {lang === 'kh'
                  ? 'យើងកំពុងស្វែងរកបេក្ខជនដែលមានសមត្ថភាពខ្ពស់ និងភាពច្នៃប្រឌិតដើម្បីចូលរួមជាមួយ B\'Groceries ក្នុងការអភិវឌ្ឍន៍សេវាកម្ម និងប្រព័ន្ធរបស់យើងឲ្យកាន់តែប្រសើរឡើង។'
                  : "We're looking for a passionate professional to join B'Groceries and build next-generation grocery delivery services for thousands of customers every day."}
              </p>
            </section>

            <section className="cd-section">
              <h2 className="cd-section-title">{TEXTS.responsibilitiesTitle[lang]}</h2>
              <ul className="cd-list">
                <li>{lang === 'kh' ? 'អនុវត្ត និងថែទាំសមាសធាតុ UI នៅក្នុង React' : 'Build and maintain UI components in React'}</li>
                <li>{lang === 'kh' ? 'សហការជាមួយវិស្វករ backend ដើម្បីភ្ជាប់ REST APIs' : 'Work with backend engineers to integrate REST APIs'}</li>
                <li>{lang === 'kh' ? 'បង្កើនប្រសិទ្ធភាពទំព័រសម្រាប់ឧបករណ៍ចល័ត' : 'Optimize pages for performance and mobile devices'}</li>
                <li>{lang === 'kh' ? 'ចូលរួមក្នុងការពិនិត្យមើលកូដ និងការរៀបចំផែនការ' : 'Participate in code reviews and sprint planning'}</li>
              </ul>
            </section>

            <section className="cd-section">
              <h2 className="cd-section-title">{TEXTS.requirementsTitle[lang]}</h2>
              <ul className="cd-list">
                <li>{lang === 'kh' ? 'បទពិសោធន៍ ១ ឆ្នាំឡើងទៅជាមួយ React ឬ framework ស្រដៀងគ្នា' : '1+ years of experience with React or a similar framework'}</li>
                <li>{lang === 'kh' ? 'យល់ដឹងច្បាស់អំពី HTML, CSS, និង JavaScript' : 'Comfortable with HTML, CSS, and modern JavaScript'}</li>
                <li>{lang === 'kh' ? 'ស្គាល់ប្រព័ន្ធ Git និងការធ្វើការងារជាក្រុម' : 'Familiarity with Git and collaborative workflows'}</li>
                <li>{lang === 'kh' ? 'ទំនាក់ទំនងល្អជាភាសាខ្មែរ និងអង់គ្លេស' : 'Good communication in Khmer and English'}</li>
              </ul>
            </section>

            <section className="cd-section">
              <h2 className="cd-section-title">{TEXTS.benefitsTitle[lang]}</h2>
              <ul className="cd-list">
                <li>{lang === 'kh' ? 'ប្រាក់ខែប្រកួតប្រជែងជាមួយនឹងការពិនិត្យឡើងវិញប្រចាំឆ្នាំ' : 'Competitive salary with annual review'}</li>
                <li>{lang === 'kh' ? 'ធានារ៉ាប់រងសុខភាព និងច្បាប់ឈប់សម្រាកប្រចាំឆ្នាំ' : 'Health insurance and paid annual leave'}</li>
                <li>{lang === 'kh' ? 'ការបញ្ចុះតម្លៃសម្រាប់បុគ្គលិកលើរាល់ការបញ្ជាទិញ B\'Groceries' : "Staff discount on all B'Groceries orders"}</li>
                <li>{lang === 'kh' ? 'ឱកាសរីកចម្រើនក្នុងតួនាទីជាន់ខ្ពស់' : 'Growth path into senior and lead roles'}</li>
              </ul>
            </section>
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
              <Link to="/apply-now" className="btn-apply btn-apply-block">
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
