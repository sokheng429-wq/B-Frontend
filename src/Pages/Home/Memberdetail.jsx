import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Memberdetail.css'

const TEXTS = {
  breadcrumbTeam: { en: 'Team', kh: 'ក្រុមការងារ' },
  notFoundTitle: { en: 'Team member not found', kh: 'រកមិនឃើញសមាជិកក្រុមការងារ' },
  notFoundBack: { en: 'Back to team', kh: 'ត្រឡប់ទៅក្រុមការងារ' },
  contactTitle: { en: 'Contact', kh: 'ទំនាក់ទំនង' },
  aboutTitle: { en: 'About', kh: 'អំពី' },
  email: { en: 'Email', kh: 'អ៊ីមែល' },
  phone: { en: 'Phone', kh: 'ទូរស័ព្ទ' },
  location: { en: 'Location', kh: 'ទីតាំង' },
  joined: { en: 'Joined', kh: 'ចូលបម្រើការងារ' },
  department: { en: 'Department', kh: 'នាយកដ្ឋាន' },
}

export const Memberdetail = () => {
  const { lang } = useLanguage()
  const member = useLocation().state?.member

  // Member.jsx only passes { id, name, role, image, dept, bio } via route state
  // and there's no id in the URL to look anyone up by, so if state is missing
  // (e.g. direct link or page refresh) we just show a "not found" screen.
  if (!member) {
    return (
      <div className="md-page">
        <div className="md-not-found">
          <p>{TEXTS.notFoundTitle[lang]}</p>
          <Link to="/member" className="btn-primary">{TEXTS.notFoundBack[lang]}</Link>
        </div>
      </div>
    )
  }

  const initials = member.name.en.split(' ').map((w) => w[0]).slice(0, 2).join('')

  return (
    <div className="md-page">

      <nav className="md-breadcrumb">
        <Link to="/">{lang === 'en' ? 'Home' : 'ទំព័រដើម'}</Link>
        <span>/</span>
        <Link to="/member">{TEXTS.breadcrumbTeam[lang]}</Link>
        <span>/</span>
        <span className="md-breadcrumb-current">{member.name[lang]}</span>
      </nav>

      <section className="md-hero">
        <div className="md-hero-inner">
          {member.image ? (
            <img src={member.image} alt={member.name[lang]} className="md-avatar-img" />
          ) : (
            <div className="md-avatar">{initials}</div>
          )}
          <h1 className="md-name">{member.name[lang]}</h1>
          <p className="md-role">{member.role[lang]}</p>
          {member.dept && (
            <span className="md-department-tag">{member.dept[lang]}</span>
          )}
        </div>
      </section>

      <section className="md-body">
        <div className="md-body-inner">

          <div className="md-main">
            <h2 className="md-section-title">{TEXTS.aboutTitle[lang]}</h2>
            <p className="md-bio">{member.bio?.[lang]}</p>
          </div>

          {(member.email || member.phone || member.location || member.dept || member.joined) && (
            <aside className="md-sidebar">
              <h2 className="md-section-title">{TEXTS.contactTitle[lang]}</h2>

              {member.email && (
                <div className="md-info-row">
                  <span className="md-info-label">{TEXTS.email[lang]}</span>
                  <a href={`mailto:${member.email}`} className="md-info-value md-info-link">
                    {member.email}
                  </a>
                </div>
              )}

              {member.phone && (
                <div className="md-info-row">
                  <span className="md-info-label">{TEXTS.phone[lang]}</span>
                  <a href={`tel:${member.phone}`} className="md-info-value md-info-link">
                    {member.phone}
                  </a>
                </div>
              )}

              {member.location && (
                <div className="md-info-row">
                  <span className="md-info-label">{TEXTS.location[lang]}</span>
                  <span className="md-info-value">{member.location[lang]}</span>
                </div>
              )}

              {member.dept && (
                <div className="md-info-row">
                  <span className="md-info-label">{TEXTS.department[lang]}</span>
                  <span className="md-info-value">{member.dept[lang]}</span>
                </div>
              )}

              {member.joined && (
                <div className="md-info-row">
                  <span className="md-info-label">{TEXTS.joined[lang]}</span>
                  <span className="md-info-value">{member.joined}</span>
                </div>
              )}
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}

export default Memberdetail