// src/Pages/TermsPrivacy.jsx
import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Terms&Privacy.css'

const TABS = {
  terms: { en: 'Terms of Service', kh: 'លក្ខខណ្ឌប្រើប្រាស់' },
  privacy: { en: 'Privacy Policy', kh: 'គោលការណ៍ភាពឯកជន' },
}

const LAST_UPDATED = { en: 'Last updated: August 2026', kh: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ សីហា ២០២៦' }

const TERMS_SECTIONS = [
  {
    title: { en: 'Acceptance of Terms', kh: 'ការទទួលយកលក្ខខណ្ឌ' },
    body: {
      en: 'By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
      kh: 'ដោយចូលប្រើ ឬប្រើប្រាស់គេហទំព័រ និងសេវាកម្មរបស់យើង អ្នកយល់ព្រមចងភ្ជាប់ខ្លួនអ្នកជាមួយលក្ខខណ្ឌទាំងនេះ។ ប្រសិនបើអ្នកមិនយល់ព្រម សូមកុំប្រើប្រាស់សេវាកម្មរបស់យើង។',
    },
  },
  {
    title: { en: 'Orders & Payment', kh: 'ការបញ្ជាទិញ និងការទូទាត់' },
    body: {
      en: 'All orders are subject to product availability. Prices are listed in USD and may change without prior notice. Payment must be completed before delivery unless otherwise agreed.',
      kh: 'ការបញ្ជាទិញទាំងអស់អាស្រ័យលើភាពមានស្តុករបស់ផលិតផល។ តម្លៃត្រូវបានចុះជាដុល្លារ និងអាចផ្លាស់ប្តូរដោយគ្មានការជូនដំណឹងជាមុន។ ការទូទាត់ត្រូវតែបញ្ចប់មុនការដឹកជញ្ជូន លុះត្រាតែមានការយល់ព្រមផ្សេង។',
    },
  },
  {
    title: { en: 'Delivery', kh: 'ការដឹកជញ្ជូន' },
    body: {
      en: 'Delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by events outside our control.',
      kh: 'ពេលវេលាដឹកជញ្ជូនគឺជាការប៉ាន់ស្មានតែប៉ុណ្ណោះ និងមិនត្រូវបានធានា។ យើងមិនទទួលខុសត្រូវចំពោះការពន្យារពេលដែលបណ្តាលមកពីកត្តានៅក្រៅការគ្រប់គ្រងរបស់យើងទេ។',
    },
  },
  {
    title: { en: 'Returns & Refunds', kh: 'ការប្រគល់មកវិញ និងការសងប្រាក់វិញ' },
    body: {
      en: 'Damaged or incorrect items must be reported within 24 hours of delivery for a replacement or refund. Opened beverage items cannot be returned for hygiene reasons.',
      kh: 'ទំនិញខូច ឬខុសត្រូវរាយការណ៍ក្នុងរយៈពេល២៤ម៉ោងបន្ទាប់ពីការដឹកជញ្ជូន ដើម្បីទទួលបានការជំនួស ឬការសងប្រាក់វិញ។ ភេសជ្ជៈដែលបានបើកមិនអាចប្រគល់មកវិញបានទេ ដោយសារហេតុផលអនាម័យ។',
    },
  },
  {
    title: { en: 'Limitation of Liability', kh: 'ការកំណត់ទំនួលខុសត្រូវ' },
    body: {
      en: 'We are not liable for any indirect or incidental damages resulting from the use of our products or services.',
      kh: 'យើងមិនទទួលខុសត្រូវចំពោះការខូចខាតដោយប្រយោលឬដោយចៃដន្យណាមួយដែលបណ្តាលមកពីការប្រើប្រាស់ផលិតផល ឬសេវាកម្មរបស់យើងទេ។',
    },
  },
]

const PRIVACY_SECTIONS = [
  {
    title: { en: 'Information We Collect', kh: 'ព័ត៌មានដែលយើងប្រមូល' },
    body: {
      en: 'We collect information you provide directly, such as your name, phone number, delivery address, and payment details, in order to process your orders.',
      kh: 'យើងប្រមូលព័ត៌មានដែលអ្នកផ្តល់ដោយផ្ទាល់ ដូចជាឈ្មោះ លេខទូរស័ព្ទ អាសយដ្ឋានដឹកជញ្ជូន និងព័ត៌មានទូទាត់ ដើម្បីដំណើរការការបញ្ជាទិញរបស់អ្នក។',
    },
  },
  {
    title: { en: 'How We Use Your Information', kh: 'របៀបយើងប្រើប្រាស់ព័ត៌មានរបស់អ្នក' },
    body: {
      en: 'Your information is used to fulfill orders, provide customer support, send order updates, and improve our services. We do not sell your personal data to third parties.',
      kh: 'ព័ត៌មានរបស់អ្នកត្រូវបានប្រើដើម្បីបំពេញការបញ្ជាទិញ ផ្តល់ជំនួយអតិថិជន ផ្ញើការធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ និងកែលម្អសេវាកម្មរបស់យើង។ យើងមិនលក់ទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នកទៅភាគីទីបីទេ។',
    },
  },
  {
    title: { en: 'Cookies', kh: 'ខូគី' },
    body: {
      en: 'Our website may use cookies to remember your language preference and improve your browsing experience.',
      kh: 'គេហទំព័ររបស់យើងអាចប្រើខូគីដើម្បីចងចាំចំណូលចិត្តភាសារបស់អ្នក និងកែលម្អបទពិសោធន៍រុករករបស់អ្នក។',
    },
  },
  {
    title: { en: 'Data Security', kh: 'សុវត្ថិភាពទិន្នន័យ' },
    body: {
      en: 'We take reasonable measures to protect your personal information, but no method of transmission over the internet is 100% secure.',
      kh: 'យើងចាត់វិធានការសមហេតុផលដើម្បីការពារព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក ប៉ុន្តែគ្មានវិធីសាស្ត្របញ្ជូនតាមអ៊ីនធឺណិតណាមួយមានសុវត្ថិភាព១០០%ទេ។',
    },
  },
  {
    title: { en: 'Your Rights', kh: 'សិទ្ធិរបស់អ្នក' },
    body: {
      en: 'You may request to access, update, or delete your personal information at any time by contacting our support team.',
      kh: 'អ្នកអាចស្នើសុំចូលប្រើ ធ្វើបច្ចុប្បន្នភាព ឬលុបព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកនៅពេលណាមួយ ដោយទាក់ទងក្រុមជំនួយរបស់យើង។',
    },
  },
]

const SECTION_ICONS = [
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  <><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6v6l4 2" /></>,
  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  <path d="M20 7h-5v10h5V7zM4 7h5v10H4V7zM12 7h5v10h-5V7z" />,
  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
]

export const TermsPrivacy = () => {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('terms')
  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS

  return (
    <div className="tp-page">
      {/* Hero */}
      <section className="tp-hero">
        <div className="tp-hero-bg" />
        <div className="tp-hero-content">
          <div className="tp-hero-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M12 18v-6" />
              <path d="M9 15h6" />
            </svg>
          </div>
          <h1 className="tp-hero-title">
            {activeTab === 'terms'
              ? { en: 'Terms of Service', kh: 'លក្ខខណ្ឌប្រើប្រាស់' }[lang]
              : { en: 'Privacy Policy', kh: 'គោលការណ៍ភាពឯកជន' }[lang]}
          </h1>
          <p className="tp-hero-subtitle">
            {activeTab === 'terms'
              ? { en: 'The rules we live by so you can shop with confidence.', kh: 'ច្បាប់ដែលយើងអនុវត្ត ដើម្បីឲ្យអ្នកទិញទំនិញដោយទំនុកចិត្ត។' }[lang]
              : { en: 'How we protect and respect your personal information.', kh: 'របៀបដែលយើងការពារ និងគោរពព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក។' }[lang]}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="tp-tabs-wrapper">
        <div className="tp-tabs">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              className={`tp-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label[lang]}
              {activeTab === key && <span className="tp-tab-indicator" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="tp-content-wrapper">
        <p className="tp-updated">{LAST_UPDATED[lang]}</p>

        <div className="tp-cards">
          {sections.map((section, i) => (
            <div key={i} className="tp-card">
              <div className="tp-card-num">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {SECTION_ICONS[i % SECTION_ICONS.length]}
                </svg>
              </div>
              <div className="tp-card-body">
                <h3 className="tp-card-title">{section.title[lang]}</h3>
                <p className="tp-card-text">{section.body[lang]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="tp-footnote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <p>
            {lang === 'kh'
              ? 'ប្រសិនបើអ្នកមានសំណួរ សូមទាក់ទងមកយើងខ្ញុំតាមរយៈ hello@bgroceries.com'
              : 'If you have any questions about these terms, reach out to us at hello@bgroceries.com'}
          </p>
        </div>
      </section>
    </div>
  )
}

export default TermsPrivacy
