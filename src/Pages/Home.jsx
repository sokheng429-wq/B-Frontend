import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import homeHero from '../assets/Store.png'
import homeHero2 from '../assets/Home.png'
import inside from '../assets/inside.png'
import './Home.css'

const CATEGORIES = [
  { id: 'fruits', name: { en: 'Organic Fruits', kh: 'ផ្លែឈើអូហ្គានិក' }, icon: '🍎', link: '/products?cat=fruits' },
  { id: 'veggies', name: { en: 'Fresh Veggies', kh: 'បន្លែស្រស់ៗ' }, icon: '🥬', link: '/products?cat=veggies' },
  { id: 'meat', name: { en: 'Premium Meat', kh: 'សាច់គុណភាពខ្ពស់' }, icon: '🥩', link: '/products?cat=meat' },
  { id: 'seafood', name: { en: 'Catch Seafood', kh: 'គ្រឿងសមុទ្រស្រស់' }, icon: '🦐', link: '/products?cat=seafood' },
  { id: 'bakery', name: { en: 'Daily Bakery', kh: 'នំប៉័ងស្រស់ជារៀងរាល់ថ្ងៃ' }, icon: '🥐', link: '/products?cat=bakery' },
  { id: 'drinks', name: { en: 'Beverages', kh: 'ភេសជ្ជៈ' }, icon: '🧃', link: '/products?cat=drinks' },
]

const VALUES = [
  {
    icon: '🌱',
    title: { en: 'Freshness First', kh: 'ភាពស្រស់មកមុន' },
    desc: { en: 'Hand-picked every morning from trusted Cambodian farms — direct to your table.', kh: 'ជ្រើសរើសដោយដៃជារៀងរាល់ព្រឹកពីកសិដ្ឋានកម្ពុជាដែលទុកចិត្ត — ផ្ទាល់ទៅកាន់តុរបស់អ្នក។' },
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
  },
  {
    icon: '🤝',
    title: { en: 'Community Driven', kh: 'ជំរុញដោយសហគមន៍' },
    desc: { en: 'Empowering over 200 local farmers and artisan producers across Cambodia.', kh: 'ផ្តល់អំណាចដល់កសិករ និងអ្នកផលិតក្នុងស្រុកជាង ២០០នាក់ ទូទាំងប្រទេសកម្ពុជា។' },
    image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=600&h=400&fit=crop',
  },
  {
    icon: '⚡',
    title: { en: '45-Min Express', kh: 'ដឹកជញ្ជូន ៤៥ នាទី' },
    desc: { en: 'From our temperature-controlled hub to your doorstep in under 45 minutes.', kh: 'ពីឃ្លាំងដែលគ្រប់គ្រងសីតុណ្ហភាពរបស់យើងដល់មាត់ទ្វារអ្នកក្នុងរយៈពេលក្រោម ៤៥ នាទី។' },
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&h=400&fit=crop',
  },
  {
    icon: '💚',
    title: { en: '100% Satisfaction', kh: 'ការពេញចិត្ត ១០០%' },
    desc: { en: "If any product is less than perfect, it's free. That's our freshness guarantee.", kh: 'ប្រសិនបើផលិតផលណាមួយមិនល្អឥតខ្ចោះ វាឥតគិតថ្លៃ។ នោះគឺជាការធានាភាពស្រស់របស់យើង។' },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
]

const MILESTONES = [
  { year: '2026', title: { en: 'Store Launched', kh: 'ហាងបានបើកដំណើរការ' }, desc: { en: 'Started as a neighborhood grocery market in Phnom Penh.', kh: 'ចាប់ផ្តើមជាផ្សារគ្រឿងទេសក្នុងសហគមន៍នៅភ្នំពេញ។' }, image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: 'Digital Platform', kh: 'វេទិកាឌីជីថល' }, desc: { en: 'Launched online ordering with same-day express delivery.', kh: 'បើកដំណើរការបញ្ជាទិញអនឡាញ ជាមួយការដឹកជញ្ជូនរហ័សនៅថ្ងៃតែមួយ។' }, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: '200+ Partners', kh: 'ដៃគូ ២០០+' }, desc: { en: "Built Cambodia's largest direct farm-to-table network.", kh: 'បង្កើតបណ្តាញពីកសិដ្ឋានទៅកាន់តុហូបបាយធំបំផុតនៅកម្ពុជា។' }, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop' },
  { year: '2026', title: { en: '25 Provinces', kh: 'ខេត្តទាំង ២៥' }, desc: { en: 'Expanded nationwide serving over 50,000 daily active households.', kh: 'ពង្រីកទូទាំងប្រទេស បម្រើគ្រួសារជាង ៥០,០០០ ជារៀងរាល់ថ្ងៃ។' }, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop' },
]

const STATS = [
  { val: '50K+', label: { en: 'Happy Families', kh: 'គ្រួសាររីករាយ' }, icon: '😊' },
  { val: '200+', label: { en: 'Farm Partners', kh: 'ដៃគូកសិដ្ឋាន' }, icon: '🤝' },
  { val: '25', label: { en: 'Provinces Served', kh: 'ខេត្តដែលបម្រើ' }, icon: '📍' },
  { val: '99%', label: { en: '5-Star Reviews', kh: 'ការវាយតម្លៃ ៥ ផ្កាយ' }, icon: '⭐' },
]

const TEXTS = {
  heroEyebrow: { en: "Cambodia's #1 Grocery Platform", kh: 'វេទិកាគ្រឿងទេសលេខ១ នៅកម្ពុជា' },
  heroTitle1: { en: 'FRESH GROCERIES ', kh: 'គ្រឿងទេសស្រស់ៗ ' },
  heroHighlight: { en: 'DELIVERED TO YOUR DOOR ❤️', kh: 'ដឹកជញ្ជូនដល់ផ្ទះអ្នក នៅពេលណាក៏ដោយ' },
  heroSub: { en: "Connect direct with 200+ Cambodian local farms. Get fresh, organic produce delivered to your kitchen in under 45 minutes.", kh: 'ភ្ជាប់ផ្ទាល់ជាមួយកសិដ្ឋានក្នុងស្រុកកម្ពុជាជាង ២០០។ ទទួលបានផលិតផលស្រស់ៗអូហ្គានិក ដឹកដល់ផ្ទះបាយអ្នក ក្នុងរយៈពេលក្រោម ៤៥ នាទី។' },
  shopNow: { en: 'Shop Now', kh: 'ចាប់ផ្តើមទិញ' },
  contactUs: { en: 'Contact Us', kh: 'ទាក់ទងយើង' },

  categoriesTitle: { en: 'Explore Fresh Categories', kh: 'ស្វែងរកប្រភេទស្រស់ៗ' },
  categoriesSub: { en: 'Farm-fresh items curated daily', kh: 'ទំនិញស្រស់ៗពីកសិដ្ឋាន ជ្រើសរើសជារៀងរាល់ថ្ងៃ' },

  storyEyebrow: { en: 'Our Beginning', kh: 'ការចាប់ផ្តើមរបស់យើង' },
  storyTitle: { en: 'Connecting Farms to Every Table', kh: 'ភ្ជាប់កសិដ្ឋានទៅកាន់គ្រប់តុអាហារ' },
  storyText: { en: "What began as a neighborhood grocery store in Phnom Penh has evolved into Cambodia's premier digital food platform. We empower local agricultural communities while bringing uncompromised freshness directly to your home.", kh: 'អ្វីដែលចាប់ផ្តើមជាហាងគ្រឿងទេសក្នុងសហគមន៍នៅភ្នំពេញ បានរីកចម្រើនទៅជាវេទិកាអាហារឌីជីថលឈានមុខគេនៅកម្ពុជា។ យើងផ្តល់អំណាចដល់សហគមន៍កសិកម្មក្នុងស្រុក ខណៈពេលដែលនាំយកភាពស្រស់ឥតខ្ចោះផ្ទាល់ទៅកាន់គេហដ្ឋានរបស់អ្នក។' },

  missionTitle: { en: 'Our Core Mission', kh: 'បេសកកម្មស្នូលរបស់យើង' },
  missionText: { en: 'To make clean, organic, and affordable groceries accessible to every family in Cambodia — while building a sustainable supply chain for our local agricultural partners.', kh: 'ធ្វើឱ្យគ្រឿងទេសស្អាត អូហ្គានិក និងតម្លៃសមរម្យ អាចចូលប្រើប្រាស់បានសម្រាប់គ្រួសារគ្រប់រូបនៅកម្ពុជា — ខណៈពេលដែលកសាងខ្សែច្រវាក់ផ្គត់ផ្គង់ប្រកបដោយនិរន្តរភាពសម្រាប់ដៃគូកសិកម្មក្នុងស្រុករបស់យើង។' },

  valuesEyebrow: { en: 'Why Choose Us', kh: 'ហេតុអ្វីជ្រើសរើសយើង' },
  valuesTitle: { en: 'What We Stand For', kh: 'អ្វីដែលយើងឈរលើ' },

  numbersEyebrow: { en: 'Real Impact', kh: 'ផលប៉ះពាល់ពិតប្រាកដ' },
  numbersTitle: { en: 'Trusted Across Cambodia', kh: 'ទុកចិត្តទូទាំងប្រទេសកម្ពុជា' },

  journeyTitle: { en: 'Our Growth Journey', kh: 'ដំណើរនៃការរីកចម្រើនរបស់យើង' },

  ctaTitle: { en: 'Ready for Fresh Groceries Delivered Fast?', kh: 'ត្រៀមខ្លួនសម្រាប់គ្រឿងទេសស្រស់ៗ ដឹកជញ្ជូនលឿនហើយឬនៅ?' },
  ctaSub: { en: "Join 50,000+ households enjoying Cambodia's freshest farm-to-table delivery service.", kh: 'ចូលរួមជាមួយគ្រួសារជាង ៥០,០០០ ដែលកំពុងរីករាយជាមួយសេវាកម្មដឹកជញ្ជូនអាហារស្រស់ៗពីកសិដ្ឋាននៅកម្ពុជា។' },
  getInTouch: { en: 'Contact Team', kh: 'ទាក់ទងក្រុមការងារ' },
  browseProducts: { en: 'Browse All Products', kh: 'មើលផលិតផលទាំងអស់' },
}

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function AnimatedNumber({ value }) {
  const [ref, visible] = useScrollReveal()
  const [count, setCount] = useState(0)
  const num = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const suffix = value.replace(/[0-9]/g, '')
  useEffect(() => {
    if (!visible) return
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * num))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, num])
  return <span ref={ref}>{count}{suffix}</span>
}

function Reveal({ children }) {
  const [ref, visible] = useScrollReveal()
  return <div ref={ref} className={`home-reveal ${visible ? 'home-reveal--visible' : ''}`}>{children}</div>
}

export const Home = () => {
  const { lang } = useLanguage()

  return (
    <div className="home-page">

      {/* ===== 1. HERO SECTION ===== */}
      <section className="home-hero">
        <div className="home-hero-glow-green" />
        <div className="home-hero-glow-orange" />

        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-hero-eyebrow">
              <span>🌟</span> {TEXTS.heroEyebrow[lang]}
            </span>

            <h1 className="home-hero-title">
              {TEXTS.heroTitle1[lang]}
              <mark>{TEXTS.heroHighlight[lang]}</mark>
            </h1>

            <p className="home-hero-sub">{TEXTS.heroSub[lang]}</p>

            {/* CTA Wrapper with Animated Arrow */}
            <div className="home-hero-cta-wrapper">
              <div className="home-hero-arrow-container">
                <span className="home-hero-arrow-text">Click Here</span>
                <HeroBouncingArrow />
              </div>
              <div className="home-hero-cta-buttons">
                <Link to="/products" className="home-btn-shop">
                  <span>🛒</span>
                  <span>{TEXTS.shopNow[lang]}</span>
                  <span className="home-btn-chevron">→</span>
                </Link>
                <Link to="/contact" className="home-btn-contact">
                  <span>💬</span>
                  <span>{TEXTS.contactUs[lang]}</span>
                  <span className="home-btn-chevron">→</span>
                </Link>
              </div>
            </div>

            {/* Category Quick Tags */}
            <div className="home-hero-tags">
              <span className="home-hero-tag">🥬 Fresh Veggies</span>
              <span className="home-hero-tag">🍎 Organic Fruits</span>
              <span className="home-hero-tag">🥩 Meat & Poultry</span>
              <span className="home-hero-tag">⚡ 45m Delivery</span>
            </div>
          </div>

          {/* Hero Visual Stack */}
          <div className="home-hero-visual">
            <div className="home-hero-floating-badge home-hero-floating-badge--top">
              <span className="home-hero-badge-icon">⚡</span>
              <div>
                <span className="home-hero-badge-title">45 Min Delivery</span>
                <span className="home-hero-badge-sub">Fast Phnom Penh Express</span>
              </div>
            </div>

            <div className="home-hero-floating-badge home-hero-floating-badge--bottom">
              <span className="home-hero-badge-icon">🌿</span>
              <div>
                <span className="home-hero-badge-title">100% Organic</span>
                <span className="home-hero-badge-sub">Certified Local Farms</span>
              </div>
            </div>

            <div className="home-hero-img-frame">
              <img src={homeHero} alt="B'Groceries Store" className="home-hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. FEATURED CATEGORIES RIBBON ===== */}
      <Reveal>
        <section className="home-categories">
          <div className="home-inner">
            <div className="home-section-header--center">
              <h2 className="home-section-title">{TEXTS.categoriesTitle[lang]}</h2>
              <div className="home-accent-line" />
              <p className="home-section-body">{TEXTS.categoriesSub[lang]}</p>
            </div>
            <div className="home-categories-grid">
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} to={cat.link} className="home-category-card">
                  <span className="home-category-icon">{cat.icon}</span>
                  <span className="home-category-name">{cat.name[lang]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== 3. OUR STORY ===== */}
      <Reveal>
        <section className="home-story">
          <div className="home-inner">
            <div className="home-story-grid">
              <div className="home-story-image">
                <div className="home-story-frame">
                  <img src={homeHero2} alt="B'Groceries Store Front" className="home-story-img" />
                </div>
              </div>
              <div className="home-story-copy">
                <span className="home-section-eyebrow">{TEXTS.storyEyebrow[lang]}</span>
                <h2 className="home-section-title">
                  {TEXTS.storyTitle[lang]}
                </h2>
                <div className="home-accent-line" />
                <p className="home-section-body">{TEXTS.storyText[lang]}</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== 4. MISSION ===== */}
      <Reveal>
        <section className="home-mission">
          <div className="home-inner">
            <div className="home-mission-card">
              <div className="home-mission-image">
                <div className="home-story-frame">
                  <img src={inside} alt="Inside B'Groceries Market" className="home-story-img" />
                </div>
              </div>
              <div className="home-mission-copy">
                <div className="home-mission-badge">🎯</div>
                <h2 className="home-section-title">{TEXTS.missionTitle[lang]}</h2>
                <div className="home-accent-line" />
                <p className="home-section-body">{TEXTS.missionText[lang]}</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== 5. CORE VALUES ===== */}
      <Reveal>
        <section className="home-values">
          <div className="home-inner">
            <div className="home-section-header--center">
              <span className="home-section-eyebrow">{TEXTS.valuesEyebrow[lang]}</span>
              <h2 className="home-section-title">{TEXTS.valuesTitle[lang]}</h2>
              <div className="home-accent-line" />
            </div>
            <div className="home-values-grid">
              {VALUES.map((v) => (
                <div key={v.title.en} className="home-value-card">
                  <div className="home-value-img-wrap">
                    <img src={v.image} alt={v.title[lang]} className="home-value-img" loading="lazy" />
                    <span className="home-value-icon">{v.icon}</span>
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
      </Reveal>

      {/* ===== 6. BY THE NUMBERS ===== */}
      <Reveal>
        <section className="home-numbers">
          <div className="home-inner">
            <div className="home-section-header--center">
              <span className="home-section-eyebrow">{TEXTS.numbersEyebrow[lang]}</span>
              <h2 className="home-section-title">{TEXTS.numbersTitle[lang]}</h2>
              <div className="home-accent-line" />
            </div>
            <div className="home-numbers-grid">
              {STATS.map((s) => (
                <div key={s.label.en} className="home-number-card">
                  <span className="home-number-icon">{s.icon}</span>
                  <span className="home-number-val">
                    <AnimatedNumber value={s.val} />
                  </span>
                  <span className="home-number-lbl">{s.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== 7. GROWTH JOURNEY ===== */}
      <Reveal>
        <section className="home-journey">
          <div className="home-inner">
            <div className="home-section-header--center">
              <h2 className="home-section-title">{TEXTS.journeyTitle[lang]}</h2>
              <div className="home-accent-line" />
            </div>
            <div className="home-timeline">
              {MILESTONES.map((m, i) => (
                <div key={i} className="home-timeline-card">
                  <div className="home-timeline-img-wrap">
                    <img src={m.image} alt={m.title[lang]} className="home-timeline-img" loading="lazy" />
                    <span className="home-timeline-year">{m.year}</span>
                  </div>
                  <div className="home-timeline-body">
                    <h3 className="home-timeline-title">{m.title[lang]}</h3>
                    <p className="home-timeline-desc">{m.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ===== 8. HIGH IMPACT CTA ===== */}
      <Reveal>
        <section className="home-cta">
          <div className="home-inner">
            <div className="home-cta-card">
              <h2 className="home-cta-title">{TEXTS.ctaTitle[lang]}</h2>
              <p className="home-cta-sub">{TEXTS.ctaSub[lang]}</p>
              <div className="home-cta-actions">
                <Link to="/products" className="home-btn-shop">
                  <span>🛒</span>
                  <span>{TEXTS.browseProducts[lang]}</span>
                  <span className="home-btn-chevron">→</span>
                </Link>
                <Link to="/contact" className="home-btn-contact">
                  <span>💬</span>
                  <span>{TEXTS.getInTouch[lang]}</span>
                  <span className="home-btn-chevron">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  )
}

const HeroBouncingArrow = () => (
  <svg width="40" height="54" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="home-hero-arrow-svg">
    <defs>
      <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#77BC1F" />
      </linearGradient>
    </defs>
    <path d="M22 4V46" stroke="url(#arrowGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
    <path d="M9 34L22 52L35 34" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default Home
