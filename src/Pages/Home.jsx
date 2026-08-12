import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import homeHero from '../assets/Store.png'
import homeHero2 from '../assets/Home.png'
import inside from '../assets/Inside.png'
import './Home.css'

const VALUES = [
  {
    icon: '🌱',
    title: { en: 'Freshness First', kh: 'ភាពស្រស់មកមុន' },
    desc: { en: 'We hand-pick every item from trusted local farms to ensure only the freshest produce reaches your table.', kh: 'យើងជ្រើសរើសទំនិញនីមួយៗដោយដៃពីកសិដ្ឋានក្នុងស្រុកដែលទុកចិត្តបាន ដើម្បីធានាថាមានតែផលិតផលស្រស់ៗប៉ុណ្ណោះដែលទៅដល់តុរបស់អ្នក។' },
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
  },
  {
    icon: '🤝',
    title: { en: 'Community Driven', kh: 'ជំរុញដោយសហគមន៍' },
    desc: { en: 'We partner with over 200 Cambodian farmers and producers — growing together, thriving together.', kh: 'យើងសហការជាមួយកសិករ និងអ្នកផលិតកម្ពុជាជាង ២០០នាក់ — រីកចម្រើនជាមួយគ្នា ជោគជ័យជាមួយគ្នា។' },
    image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=600&h=400&fit=crop',
  },
  {
    icon: '⚡',
    title: { en: 'Lightning Fast', kh: 'រហ័សដូចផ្លេកបន្ទោរ' },
    desc: { en: 'From our hub to your doorstep in under 45 minutes — because fresh food deserves fast delivery.', kh: 'ពីឃ្លាំងរបស់យើងដល់មាត់ទ្វារអ្នកក្នុងរយៈពេលក្រោម ៤៥ នាទី — ព្រោះអាហារស្រស់ៗត្រូវការការដឹកជញ្ជូនរហ័ស។' },
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&h=400&fit=crop',
  },
  {
    icon: '💚',
    title: { en: '100% Satisfaction', kh: 'ការពេញចិត្ត ១០០%' },
    desc: { en: "If anything arrives less than perfect, it's free — no questions asked. That's our promise to you.", kh: 'ប្រសិនបើអ្វីមួយមិនល្អឥតខ្ចោះ វាឥតគិតថ្លៃ — គ្មានសំណួរ។ នោះគឺជាការសន្យារបស់យើងចំពោះអ្នក។' },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
]

const MILESTONES = [
  { year: '2026', title: { en: 'Founded', kh: 'បង្កើតឡើង' }, desc: { en: 'Started as a small neighborhood grocery store in Phnom Penh with a simple mission: make fresh food accessible to everyone.', kh: 'ចាប់ផ្តើមជាហាងលក់គ្រឿងទេសតូចមួយនៅភ្នំពេញ ជាមួយបេសកកម្មសាមញ្ញ៖ ធ្វើឱ្យអាហារស្រស់ៗអាចចូលប្រើប្រាស់បានសម្រាប់មនុស្សគ្រប់គ្នា។' }, image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: 'Went Digital', kh: 'ប្តូរទៅឌីជីថល' }, desc: { en: 'Launched our online platform, bringing thousands of products to customers across Phnom Penh with same-day delivery.', kh: 'បើកដំណើរការវេទិកាអនឡាញរបស់យើង នាំយកផលិតផលរាប់ពាន់មុខទៅកាន់អតិថិជនទូទាំងភ្នំពេញ ជាមួយការដឹកជញ្ជូននៅថ្ងៃតែមួយ។' }, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: '200+ Partners', kh: 'ដៃគូ ២០០+' }, desc: { en: 'Built a network of over 200 local farms and producers, becoming Cambodia\'s largest online grocery platform.', kh: 'បង្កើតបណ្តាញកសិដ្ឋាន និងអ្នកផលិតក្នុងស្រុកជាង ២០០ ក្លាយជាវេទិកាលក់គ្រឿងទេសអនឡាញធំបំផុតនៅកម្ពុជា។' }, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: 'Nationwide', kh: 'ទូទាំងប្រទេស' }, desc: { en: 'Expanded to all 25 provinces, serving over 50,000 happy customers every single day.', kh: 'ពង្រីកទៅកាន់ខេត្តទាំង ២៥ បម្រើអតិថិជនជាង ៥០,០០០ នាក់ជារៀងរាល់ថ្ងៃ។' }, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop' },
]

const STATS = [
  { num: { en: '50K+', kh: 'ជាង ៥០,០០០' }, label: { en: 'Happy Customers', kh: 'អតិថិជនពេញចិត្ត' }, icon: '😊' },
  { num: { en: '200+', kh: 'ជាង ២០០' }, label: { en: 'Local Partners', kh: 'ដៃគូក្នុងស្រុក' }, icon: '🤝' },
  { num: { en: '1', kh: '១' }, label: { en: 'Provinces', kh: 'ខេត្ត' }, icon: '📍' },
  { num: { en: '99%', kh: '៩៩%' }, label: { en: 'Satisfaction Rate', kh: 'អត្រាពេញចិត្ត' }, icon: '⭐' },
]

const TEXTS = {
  heroEyebrow: { en: "Cambodia's Trusted Grocer", kh: 'ហាងទំនិញដែលកម្ពុជាទុកចិត្ត' },
  heroTitle1: { en: 'Bringing fresh, quality groceries ', kh: 'នាំយកគ្រឿងទេសស្រស់ៗ មានគុណភាព ' },
  heroHighlight: { en: 'to every home', kh: 'ទៅគ្រប់គេហដ្ឋាន' },
  heroTitle2: { en: '', kh: '' },
  heroSub: { en: "B'Groceries is Cambodia's leading online grocery platform. We connect local farms to your kitchen — making fresh, affordable food accessible to families across the country.", kh: 'B\'Groceries គឺជាវេទិកាលក់គ្រឿងទេសអនឡាញឈានមុខគេនៅកម្ពុជា។ យើងភ្ជាប់កសិដ្ឋានក្នុងស្រុកទៅកាន់ផ្ទះបាយរបស់អ្នក — ធ្វើឱ្យអាហារស្រស់ៗ តម្លៃសមរម្យ អាចចូលប្រើប្រាស់បានសម្រាប់គ្រួសារទូទាំងប្រទេស។' },
  learnMore: { en: 'Learn More', kh: 'ស្វែងយល់បន្ថែម' },
  contactUs: { en: 'Contact Us', kh: 'ទាក់ទងយើង' },

  ourStory: { en: 'Our Story', kh: 'រឿងរ៉ាវរបស់យើង' },
  ourStoryEyebrow: { en: 'How We Started', kh: 'របៀបដែលយើងចាប់ផ្តើម' },
  ourStoryText: { en: "What began as a small family-run grocery store in the heart of Phnom Penh has grown into Cambodia's most trusted online grocery platform. We saw how busy families struggled to find time for quality grocery shopping — so we decided to bring the store to them.", kh: 'អ្វីដែលចាប់ផ្តើមជាហាងលក់គ្រឿងទេសគ្រួសារតូចមួយនៅកណ្តាលភ្នំពេញ បានរីកចម្រើនទៅជាវេទិកាលក់គ្រឿងទេសអនឡាញដែលគួរឱ្យទុកចិត្តបំផុតនៅកម្ពុជា។ យើងបានឃើញពីរបៀបដែលគ្រួសាររវល់តស៊ូក្នុងការស្វែងរកពេលវេលាសម្រាប់ការទិញគ្រឿងទេសដែលមានគុណភាព — ដូច្នេះយើងសម្រេចចិត្តនាំហាងទៅកាន់ពួកគេ។' },

  missionTitle: { en: 'Our Mission', kh: 'បេសកកម្មរបស់យើង' },
  missionText: { en: 'To make fresh, high-quality groceries accessible and affordable for every Cambodian family — while supporting local farmers and building a sustainable food ecosystem.', kh: 'ធ្វើឱ្យគ្រឿងទេសស្រស់ៗ មានគុណភាពខ្ពស់ អាចចូលប្រើប្រាស់បាន និងតម្លៃសមរម្យសម្រាប់គ្រួសារកម្ពុជាគ្រប់រូប — ខណៈពេលដែលគាំទ្រកសិករក្នុងស្រុក និងកសាងប្រព័ន្ធអាហារប្រកបដោយនិរន្តរភាព។' },

  valuesTitle: { en: 'What We Stand For', kh: 'អ្វីដែលយើងឈរលើ' },
  valuesEyebrow: { en: 'Our Values', kh: 'គុណតម្លៃរបស់យើង' },

  byTheNumbers: { en: 'By the Numbers', kh: 'តាមតួលេខ' },
  numbersEyebrow: { en: 'Our Impact', kh: 'ផលប៉ះពាល់របស់យើង' },

  journeyTitle: { en: 'Our Journey', kh: 'ដំណើររបស់យើង' },

  readyToJoin: { en: 'Ready to experience the difference?', kh: 'ត្រៀមខ្លួនទទួលបទពិសោធន៍ថ្មីហើយឬនៅ?' },
  ctaSub: { en: 'Join 50,000+ happy customers and discover why B\'Groceries is Cambodia\'s favorite online grocery store.', kh: 'ចូលរួមជាមួយអតិថិជនពេញចិត្តជាង ៥០,០០០ នាក់ ហើយស្វែងយល់ពីមូលហេតុដែល B\'Groceries ជាហាងលក់គ្រឿងទេសអនឡាញពេញនិយមបំផុតនៅកម្ពុជា។' },
  getInTouch: { en: 'Get in Touch', kh: 'ទំនាក់ទំនងមកយើង' },
  browseProducts: { en: 'Browse Products', kh: 'មើលផលិតផល' },
}

export const Home = () => {
  const { lang } = useLanguage()

  return (
    <div className="home-page">
      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-hero-eyebrow">{TEXTS.heroEyebrow[lang]}</span>
            <h1 className="home-hero-title">
              {TEXTS.heroTitle1[lang]}
              <mark className="home-hero-mark">{TEXTS.heroHighlight[lang]}</mark>
              {TEXTS.heroTitle2[lang]}
            </h1>
            <p className="home-hero-sub">{TEXTS.heroSub[lang]}</p>
            <div className="home-hero-actions">
              <Link to="/about" className="home-btn-primary">{TEXTS.learnMore[lang]}</Link>
              <Link to="/contact" className="home-btn-outline">{TEXTS.contactUs[lang]}</Link>
            </div>
            <div className="home-hero-stats">
              {STATS.map((s) => (
                <div key={s.label.en} className="home-hero-stat">
                  <strong>{s.num[lang]}</strong>
                  <span>{s.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="home-hero-visual">
            <img src={homeHero} alt="B'Groceries" className="home-hero-img" />
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="home-story">
        <div className="home-inner">
          <div className="home-story-grid">
            <div className="home-story-image">
              <div className="home-story-frame">
                <img src={homeHero2} alt="B'Groceries" className="home-story-img" />
              </div>
            </div>
            <div className="home-story-copy">
              <span className="home-section-eyebrow">{TEXTS.ourStoryEyebrow[lang]}</span>
              <h2 className="home-section-title">{TEXTS.ourStory[lang]}</h2>
              <p className="home-story-text">{TEXTS.ourStoryText[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="home-mission">
        <div className="home-inner">
          <div className="home-mission-grid">
            <div className="home-mission-image">
              <div className="home-story-frame">
                <img src={inside} alt="Inside B'Groceries" className="home-story-img" />
              </div>
            </div>
            <div className="home-mission-copy">
              <span className="home-section-eyebrow">🎯</span>
              <h2 className="home-section-title">{TEXTS.missionTitle[lang]}</h2>
              <p className="home-mission-text">{TEXTS.missionText[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="home-values">
        <div className="home-inner">
          <div className="home-section-header home-section-header--center">
            <div>
              <span className="home-section-eyebrow">{TEXTS.valuesEyebrow[lang]}</span>
              <h2 className="home-section-title">{TEXTS.valuesTitle[lang]}</h2>
            </div>
          </div>
          <div className="home-values-grid">
            {VALUES.map((v) => (
              <div key={v.title.en} className="home-value-card">
                <div className="home-value-img-wrap">
                  <img src={v.image} alt={v.title[lang]} className="home-value-img" loading="lazy" />
                  <span className="home-value-icon-overlay">{v.icon}</span>
                </div>
                <div className="home-value-body">
                  <h3 className="home-value-title">{v.title[lang]}</h3>
                  <p className="home-value-desc">{v.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BY THE NUMBERS ===== */}
      <section className="home-numbers">
        <div className="home-inner">
          <div className="home-section-header home-section-header--center">
            <div>
              <span className="home-section-eyebrow">{TEXTS.numbersEyebrow[lang]}</span>
              <h2 className="home-section-title">{TEXTS.byTheNumbers[lang]}</h2>
            </div>
          </div>
          <div className="home-numbers-grid">
            {STATS.map((s) => (
              <div key={s.label.en} className="home-number-card">
                <span className="home-number-icon">{s.icon}</span>
                <span className="home-number-num">{s.num[lang]}</span>
                <span className="home-number-label">{s.label[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR JOURNEY / TIMELINE ===== */}
      <section className="home-journey">
        <div className="home-inner">
          <div className="home-section-header home-section-header--center">
            <div>
              <h2 className="home-section-title">{TEXTS.journeyTitle[lang]}</h2>
            </div>
          </div>
          <div className="home-timeline">
            {MILESTONES.map((m) => (
              <div key={m.year} className="home-timeline-item">
                <div className="home-timeline-card">
                  <div className="home-timeline-img-wrap">
                    <img src={m.image} alt={m.title[lang]} className="home-timeline-img" loading="lazy" />
                    <span className="home-timeline-year-badge">{m.year}</span>
                  </div>
                  <div className="home-timeline-body">
                    <h3 className="home-timeline-title">{m.title[lang]}</h3>
                    <p className="home-timeline-desc">{m.desc[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="home-cta">
        <div className="home-inner">
          <div className="home-cta-card">
            <h2 className="home-cta-title">{TEXTS.readyToJoin[lang]}</h2>
            <p className="home-cta-sub">{TEXTS.ctaSub[lang]}</p>
            <div className="home-cta-actions">
              <Link to="/contact" className="home-btn-primary">{TEXTS.getInTouch[lang]}</Link>
              <Link to="/products" className="home-btn-outline home-btn-outline--dark">{TEXTS.browseProducts[lang]}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
