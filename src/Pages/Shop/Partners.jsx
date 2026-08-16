import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Partners.css'

const PARTNERS = [
  { name: 'Mekong Farms', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, since: 2018 },
  { name: 'Angkor Rice Mill', category: { en: 'Grains & Rice', kh: 'គ្រាប់ធញ្ញជាតិ' }, since: 2015 },
  { name: 'Khmer Bakehouse', category: { en: 'Bakery', kh: 'នំបុ័ង' }, since: 2021 },
  { name: 'Chaktomuk Dairy', category: { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ' }, since: 2019 },
  { name: 'Tonle Fresh Fish', category: { en: 'Meat & Seafood', kh: 'សាច់ ត្រី' }, since: 2020 },
  { name: 'Sen Sok Beverages', category: { en: 'Drinks', kh: 'ភេសជ្ជៈ' }, since: 2022 },
  { name: 'Battambang Orchards', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, since: 2017 },
  { name: 'Golden Sesame Co.', category: { en: 'Pantry & Snacks', kh: 'អាហារសម្រន់' }, since: 2016 },
]

const TEXTS = {
  eyebrow: { en: 'Trusted Network', kh: 'បណ្តាញដែលទុកចិត្ត' },
  title: { en: 'Our Valued Partners', kh: 'ដៃគូដ៏មានតម្លៃរបស់យើង' },
  subtitle: { en: 'We work closely with local farmers, suppliers, and producers across Cambodia to bring fresh quality to your doorstep.', kh: 'យើងធ្វើការយ៉ាងជិតស្និទ្ធជាមួយកសិករ អ្នកផ្គត់ផ្គង់ និងអ្នកផលិតក្នុងស្រុកទូទាំងប្រទេសកម្ពុជា ដើម្បីនាំយកគុណភាពស្រស់ៗជូនលោកអ្នក។' },
  ctaTitle: { en: 'Become a Partner', kh: 'ក្លាយជាដៃគូរបស់យើង' },
  ctaSubtitle: { en: 'Join our growing network of local producers and suppliers.', kh: 'ចូលរួមជាមួយបណ្តាញអ្នកផលិត និងអ្នកផ្គត់ផ្គង់ក្នុងស្រុកដែលកំពុងរីកចម្រើនរបស់យើង។' },
  ctaButton: { en: 'Contact Us', kh: 'ទំនាក់ទំនងយើង' },
}

export const Partners = () => {
  const { lang } = useLanguage()

  return (
    <div className="partners-page">

      <section className="partners-hero">
        <div className="partners-hero-inner">
          <span className="partners-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h1 className="partners-title">{TEXTS.title[lang]}</h1>
          <p className="partners-subtitle">{TEXTS.subtitle[lang]}</p>
        </div>
      </section>

      <section className="partners-grid-section">
        <div className="partners-grid-inner">
          <div className="partners-grid">
            {PARTNERS.map((p) => (
              <div className="partner-card" key={p.name}>
                <div className="partner-badge">{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                <p className="partner-name">{p.name}</p>
                <p className="partner-category">{p.category[lang]}</p>
                <p className="partner-since">{lang === 'en' ? `Partner since ${p.since}` : `ដៃគូតាំងពីឆ្នាំ ${p.since}`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="partners-cta-section">
        <div className="partners-cta-inner">
          <div className="partners-cta">
            <div>
              <h2 className="partners-cta-title">{TEXTS.ctaTitle[lang]}</h2>
              <p className="partners-cta-subtitle">{TEXTS.ctaSubtitle[lang]}</p>
            </div>
            <Link to="/contact" className="btn-primary">{TEXTS.ctaButton[lang]}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Partners
