import { useLanguage } from '../../context/LanguageContext'
import './AboutUs.css'

const MILESTONES = [
  { year: '2018', icon: '🏪', en: 'Opened our first store in Toul Tompoung, Phnom Penh — just 3 people and a dream.', kh: 'បើកហាងដំបូងនៅទួលទំពូង ភ្នំពេញ — មានតែ ៣នាក់ និងក្តីសុបិន្ត។' },
  { year: '2020', icon: '🚀', en: 'Launched online delivery. Reached 1,000+ customers in our first year of digital.', kh: 'ដាក់ដំណើរការការដឹកជញ្ជូនតាមអនឡាញ។ ឈានដល់អតិថិជន ១,០០០+ នាក់ក្នុងឆ្នាំដំបូង។' },
  { year: '2022', icon: '🏆', en: 'Voted "Best Online Grocer" at Cambodia E-Commerce Awards. Team grew to 50.', kh: 'ទទួលបានពាន "ហាងទំនិញអនឡាញល្អបំផុត" នៅកម្ពុជា។ ក្រុមការងារកើនដល់ ៥០នាក់។' },
  { year: '2025', icon: '🌏', en: 'Expanded to Siem Reap & Battambang. 200+ local farm partners, 10K+ daily orders.', kh: 'ពង្រីកទៅសៀមរាប និងបាត់ដំបង។ ដៃគូកសិដ្ឋានក្នុងស្រុក ២០០+ ការបញ្ជាទិញប្រចាំថ្ងៃ ១០,០០០+។' },
]

const VALUES = [
  { icon: '🌱', title: { en: 'Freshness First', kh: 'ស្រស់ជាងគេ' }, desc: { en: 'Every item is sourced from local farms and checked for quality before it leaves our warehouse.', kh: 'រាល់ទំនិញទាំងអស់បានមកពីកសិដ្ឋានក្នុងស្រុក និងត្រូវបានត្រួតពិនិត្យគុណភាពមុនពេលចាកចេញពីឃ្លាំង។' } },
  { icon: '⚡', title: { en: 'Lightning Fast', kh: 'លឿនដូចរន្ទះ' }, desc: { en: 'Order before 8pm and get it the same day. Our riders average 35 minutes per delivery.', kh: 'បញ្ជាទិញមុនម៉ោង ៨យប់ ហើយទទួលបានក្នុងថ្ងៃតែមួយ។ អ្នកដឹកជញ្ជូនរបស់យើងចំណាយពេលជាមធ្យម ៣៥នាទីក្នុងមួយការដឹក។' } },
  { icon: '💰', title: { en: 'Fair Prices', kh: 'តម្លៃសមរម្យ' }, desc: { en: 'We negotiate directly with producers so you get the best prices — no middlemen, no markups.', kh: 'យើងចរចាដោយផ្ទាល់ជាមួយអ្នកផលិតដើម្បីឲ្យអ្នកទទួលបានតម្លៃល្អបំផុត — គ្មានឈ្មួញកណ្តាល គ្មានការដំឡើងថ្លៃ។' } },
  { icon: '🤝', title: { en: 'Community First', kh: 'សហគមន៍ជាចម្បង' }, desc: { en: 'We donate unsold food daily to local shelters and sponsor youth sports in the communities we serve.', kh: 'យើងបរិច្ចាកអាហារដែលមិនបានលក់ប្រចាំថ្ងៃទៅមជ្ឈមណ្ឌលក្នុងស្រុក និងឧបត្ថម្ភកីឡាយុវជនក្នុងសហគមន៍។' } },
  { icon: '🔒', title: { en: '100% Trusted', kh: 'ទុកចិត្តបាន ១០០%' }, desc: { en: 'Secure payment, real-time order tracking, and a satisfaction guarantee on every single order.', kh: 'ការទូទាត់សុវត្ថិភាព តាមដានការបញ្ជាទិញពេលវេលាពិត និងការធានាពេញចិត្តលើរាល់ការបញ្ជាទិញ។' } },
  { icon: '🌍', title: { en: 'Sustainable', kh: 'និរន្តរភាព' }, desc: { en: 'Plastic-free packaging, electric delivery fleet, and carbon-neutral operations by 2027.', kh: 'ការវេចខ្ចប់គ្មានផ្លាស្ទិក កង់ដឹកជញ្ជូនអគ្គិសនី និងប្រតិបត្តិការគ្មានកាបូននៅឆ្នាំ ២០២៧។' } },
]

const STATS = [
  { value: '10K+', label: { en: 'Daily Orders', kh: 'ការបញ្ជាទិញប្រចាំថ្ងៃ' }, icon: '📦' },
  { value: '3', label: { en: 'Cities', kh: 'ទីក្រុង' }, icon: '🏙️' },
  { value: '50+', label: { en: 'Team Members', kh: 'សមាជិកក្រុម' }, icon: '👥' },
  { value: '99.7%', label: { en: 'On-Time Rate', kh: 'អត្រាទាន់ពេល' }, icon: '⏱️' },
]

const TEXTS = {
  heroEyebrow: { en: 'Who We Are', kh: 'យើងជាអ្នកណា' },
  heroTitle: { en: 'About B\'Groceries', kh: 'អំពី B\'Groceries' },
  heroSub: { en: "Cambodia's freshest grocery delivery — built on trust, speed, and a love for good food.", kh: 'ការដឹកជញ្ជូនគ្រឿងទេសស្រស់បំផុតនៅកម្ពុជា — កសាងឡើងលើការទុកចិត្ត ល្បឿន និងការស្រលាញ់អាហារល្អ។' },
  mission: { en: 'Our Mission', kh: 'បេសកកម្មរបស់យើង' },
  missionText: { en: 'To make fresh, affordable groceries accessible to every Cambodian household — delivered in under an hour, every time.', kh: 'ដើម្បីធ្វើឲ្យគ្រឿងទេសស្រស់ និងមានតម្លៃសមរម្យអាចចូលទៅដល់គ្រប់គ្រួសារខ្មែរ — ដឹកជញ្ជូនក្នុងរយៈពេលក្រោមមួយម៉ោងរាល់ពេល។' },
  storyEyebrow: { en: 'Our Journey', kh: 'ដំណើររបស់យើង' },
  ourStory: { en: 'Our Story', kh: 'ដំណើររឿងរបស់យើង' },
  storySub: { en: 'From a small shop to a growing team — every milestone is powered by our community.', kh: 'ពីហាងតូចមួយ ទៅក្រុមការងារដែលកំពុងរីកចម្រើន — រាល់សមិទ្ធផលទាំងអស់ដំណើរការដោយសហគមន៍របស់យើង។' },
  statsEyebrow: { en: 'By the Numbers', kh: 'តាមលេខ' },
  numbersSpeak: { en: 'The Numbers Speak', kh: 'លេខនិយាយដោយខ្លួនឯង' },
  numbersSub: { en: 'Growing fast, delivering faster.', kh: 'រីកចម្រើនលឿន ដឹកជញ្ជូនលឿនជាង។' },
  valuesEyebrow: { en: 'Our Principles', kh: 'គោលការណ៍របស់យើង' },
  ourValues: { en: 'What We Stand For', kh: 'អ្វីដែលយើងឈរលើ' },
}

export const About = () => {
  const { lang } = useLanguage()

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <span className="about-hero-eyebrow">{TEXTS.heroEyebrow[lang]}</span>
            <h1 className="about-hero-title">{TEXTS.heroTitle[lang]}</h1>
            <p className="about-hero-sub">{TEXTS.heroSub[lang]}</p>
          </div>
          <div className="about-hero-visual">
            <img
              src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&h=400&fit=crop"
              alt="Fresh groceries"
              className="about-hero-img"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <div className="about-mission-card">
            <div className="about-mission-icon-wrap">
              <span className="about-mission-icon">🎯</span>
            </div>
            <div className="about-mission-copy">
              <h2 className="about-mission-title">{TEXTS.mission[lang]}</h2>
              <p className="about-mission-text">{TEXTS.missionText[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="about-story">
        <div className="about-story-inner">
          <div className="about-section-header">
            <span className="about-section-eyebrow">{TEXTS.storyEyebrow[lang]}</span>
            <h2 className="about-section-title">{TEXTS.ourStory[lang]}</h2>
            <p className="about-section-sub">{TEXTS.storySub[lang]}</p>
          </div>
          <div className="about-timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="about-timeline-item">
                <div className="about-timeline-marker">
                  <span className="about-timeline-dot" />
                  {i < MILESTONES.length - 1 && <span className="about-timeline-line" />}
                </div>
                <div className="about-timeline-card">
                  <div className="about-timeline-header">
                    <span className="about-timeline-year">{m.year}</span>
                    <span className="about-timeline-icon">{m.icon}</span>
                  </div>
                  <p className="about-timeline-text">{m[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="about-stats-bg" />
        <div className="about-stats-inner">
          <div className="about-section-header about-section-header--light">
            <span className="about-section-eyebrow about-section-eyebrow--light">{TEXTS.statsEyebrow[lang]}</span>
            <h2 className="about-section-title about-section-title--light">{TEXTS.numbersSpeak[lang]}</h2>
            <p className="about-section-sub about-section-sub--light">{TEXTS.numbersSub[lang]}</p>
          </div>
          <div className="about-stats-grid">
            {STATS.map((s) => (
              <div key={s.value} className="about-stat-card">
                <span className="about-stat-icon">{s.icon}</span>
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-inner">
          <div className="about-section-header">
            <span className="about-section-eyebrow">{TEXTS.valuesEyebrow[lang]}</span>
            <h2 className="about-section-title">{TEXTS.ourValues[lang]}</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title.en} className="about-value-card">
                <div className="about-value-icon-wrap">
                  <span className="about-value-icon">{v.icon}</span>
                </div>
                <div className="about-value-copy">
                  <h3 className="about-value-title">{v.title[lang]}</h3>
                  <p className="about-value-desc">{v.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
