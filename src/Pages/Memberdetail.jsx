import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Memberdetail.css'

const TEXTS = {
  eyebrow: { en: 'B\'Groceries Membership', kh: 'សមាជិកភាព B\'Groceries' },
  title: { en: 'Unlock Exclusive Perks & Savings', kh: 'ទទួលអត្ថប្រយោជន៍ និងការសន្សំប្រាក់ពិសេស' },
  subtitle: { en: 'Choose the membership plan that best fits your lifestyle and start saving on fresh grocery deliveries.', kh: 'ជ្រើសរើសកម្រិតសមាជិកភាពដែលស័ក្តិសមបំផុតសម្រាប់អ្នក ហើយចាប់ផ្តើមសន្សំប្រាក់លើការដឹកជញ្ជូនគ្រឿងទេសស្រស់ៗ។' },
  joinFree: { en: 'Join Free', kh: 'ចុះឈ្មោះឥតគិតថ្លៃ' },
  tiersTitle: { en: 'Membership Plans', kh: 'ផែនការសមាជិកភាព' },
  mostPopular: { en: 'Most Popular', kh: 'ពេញនិយមបំផុត' },
  free: { en: 'Free', kh: 'ឥតគិតថ្លៃ' },
  perMonth: { en: '/ month', kh: '/ ខែ' },
  howItWorksTitle: { en: 'How It Works', kh: 'របៀបដំណើរការ' },
}

export const Memberdetail = () => {
  const { lang } = useLanguage()
  const memberState = useLocation().state?.member

  const TIERS = [
    {
      key: 'basic',
      name: { en: 'Basic', kh: 'មូលដ្ឋាន' },
      price: TEXTS.free[lang],
      popular: false,
      perks: {
        en: ['Free account & order history', 'Standard delivery rates', 'Access to promotions'],
        kh: ['គណនីឥតគិតថ្លៃ និងប្រវត្តិការបញ្ជាទិញ', 'អត្រាដឹកជញ្ជូនធម្មតា', 'ចូលប្រើការផ្សព្វផ្សាយ'],
      },
    },
    {
      key: 'plus',
      name: { en: 'Plus', kh: 'ប្លុស' },
      price: '$2.99',
      popular: true,
      perks: {
        en: ['Free delivery on every order', 'Member-only prices', 'Early access to promotions', 'Priority support'],
        kh: ['ដឹកជញ្ជូនឥតគិតថ្លៃរាល់ការបញ្ជាទិញ', 'តម្លៃពិសេសសមាជិក', 'ចូលប្រើការផ្សព្វផ្សាយមុនគេ', 'ជំនួយអតិថិជនអាទិភាព'],
      },
    },
    {
      key: 'family',
      name: { en: 'Family', kh: 'គ្រួសារ' },
      price: '$5.99',
      popular: false,
      perks: {
        en: ['Everything in Plus', 'Up to 4 linked accounts', 'Shared DeliPoints wallet', 'Monthly bonus coupons'],
        kh: ['អ្វីៗគ្រប់យ៉ាងក្នុងផែនការ ប្លុស', 'គណនីភ្ជាប់រហូតដល់ ៤', 'ចែករំលែកពិន្ទុ DeliPoints', 'គូប៉ុងបន្ថែមប្រចាំខែ'],
      },
    },
  ]

  const STEPS = {
    en: [
      { title: 'Create your account', desc: 'Sign up for free in under a minute.' },
      { title: 'Pick your tier', desc: 'Start free, or upgrade for delivery savings and more.' },
      { title: 'Shop and save', desc: 'Member prices and perks apply automatically at checkout.' },
    ],
    kh: [
      { title: 'បង្កើតគណនីរបស់អ្នក', desc: 'ចុះឈ្មោះឥតគិតថ្លៃក្នុងរយៈពេលមិនដល់មួយនាទី។' },
      { title: 'ជ្រើសរើសកម្រិតរបស់អ្នក', desc: 'ចាប់ផ្តើមឥតគិតថ្លៃ ឬដំឡើងឋានៈដើម្បីសន្សំលើការដឹកជញ្ជូន និងច្រើនទៀត។' },
      { title: 'ទិញឥវ៉ាន់ ហើយសន្សំ', desc: 'តម្លៃ និងអត្ថប្រយោជន៍សមាជិកអនុវត្តដោយស្វ័យប្រវត្តិពេលទូទាត់ប្រាក់។' },
    ],
  }

  return (
    <div className="md-page">

      <section className="md-hero">
        <div className="md-hero-inner">
          <span className="md-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h1 className="md-title">
            {memberState?.name ? (typeof memberState.name === 'object' ? memberState.name[lang] : memberState.name) : TEXTS.title[lang]}
          </h1>
          <p className="md-subtitle">
            {memberState?.bio ? (typeof memberState.bio === 'object' ? memberState.bio[lang] : memberState.bio) : TEXTS.subtitle[lang]}
          </p>
          <Link to="/register" className="btn-primary">{TEXTS.joinFree[lang]}</Link>
        </div>
      </section>

      <section className="md-section">
        <div className="md-section-inner">
          <h2 className="md-section-title">{TEXTS.tiersTitle[lang]}</h2>

          <div className="md-tiers-grid">
            {TIERS.map((tier) => (
              <div className={`md-tier-card ${tier.popular ? 'md-tier-popular' : ''}`} key={tier.key}>
                {tier.popular && <span className="md-tier-badge">{TEXTS.mostPopular[lang]}</span>}
                <p className="md-tier-name">{tier.name[lang]}</p>
                <p className="md-tier-price">
                  {tier.price}
                  {tier.price !== TEXTS.free[lang] && <span>{TEXTS.perMonth[lang]}</span>}
                </p>
                <ul className="md-tier-perks">
                  {tier.perks[lang].map((perk) => (
                    <li key={perk}><CheckIcon /> {perk}</li>
                  ))}
                </ul>
                <Link to="/register" className={tier.popular ? 'btn-primary md-tier-btn' : 'btn-outline-md md-tier-btn'}>
                  {TEXTS.joinFree[lang]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md-section md-steps-section">
        <div className="md-section-inner">
          <h2 className="md-section-title">{TEXTS.howItWorksTitle[lang]}</h2>
          <div className="md-steps">
            {STEPS[lang].map((step, i) => (
              <div className="md-step" key={step.title}>
                <span className="md-step-number">{i + 1}</span>
                <p className="md-step-title">{step.title}</p>
                <p className="md-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m20 6-11 11-5-5" />
  </svg>
)

export default Memberdetail
