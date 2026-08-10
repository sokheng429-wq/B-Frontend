import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Promotion.css'

const PROMOTIONS = [
  {
    id: 1,
    title: { en: 'Buy 2 Get 1 Free', kh: 'ទិញ២ថែម១' },
    desc: { en: 'Stock up on all cola products and get one free. Perfect for parties!', kh: 'ទិញកូឡាទាំងអស់ ហើយទទួលបានមួយដោយឥតគិតថ្លៃ ល្អឥតខ្ចោះសម្រាប់ពិធីជប់លៀង!' },
    tag: { en: '33% OFF', kh: 'បញ្ចុះតម្លៃ ៣៣%' },
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=700&h=400&fit=crop',
    color: '#e63946',
    badge: { en: 'Ends in 2 days', kh: 'នៅសល់ ២ថ្ងៃ' },
    code: 'COLA241',
  },
  {
    id: 2,
    title: { en: 'Weekend Special', kh: 'ការផ្តល់ជូនចុងសប្តាហ៍' },
    desc: { en: '20% off all juices and iced tea. Refresh your weekend!', kh: 'បញ្ចុះតម្លៃ២០% លើទឹកផ្លែឈើ និងតែទឹកកកទាំងអស់' },
    tag: { en: '20% OFF', kh: 'បញ្ចុះតម្លៃ ២០%' },
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=700&h=400&fit=crop',
    color: '#f4a261',
    badge: { en: 'Weekend Only', kh: 'ចុងសប្តាហ៍នេះ' },
    code: 'WEEKEND20',
  },
  {
    id: 3,
    title: { en: 'Bulk Order Discount', kh: 'បញ្ចុះតម្លៃទិញច្រើន' },
    desc: { en: 'Save 15% when you buy any 12-pack combo. Bigger savings, bigger smiles!', kh: 'សន្សំ ១៥% ពេលទិញកញ្ចប់ ១២ សន្សំកាន់តែច្រើន រីករាយកាន់តែច្រើន!' },
    tag: { en: '15% OFF', kh: 'បញ្ចុះតម្លៃ ១៥%' },
    image: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=700&h=400&fit=crop',
    color: '#2a9d8f',
    badge: { en: 'Limited Time', kh: 'មានកំណត់' },
    code: 'BULK241',
  },
  {
    id: 4,
    title: { en: 'Free Delivery Weekend', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' },
    desc: { en: 'Free delivery on all orders over $20. Shop from home, we bring it to you!', kh: 'ឥតគិតថ្លៃដឹកជញ្ជូនលើការបញ្ជាទិញលើស ២០ ដុល្លារ' },
    tag: { en: 'FREE DELIVERY', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ' },
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=700&h=400&fit=crop',
    color: '#FF9900',
    badge: { en: 'This Weekend', kh: 'ចុងសប្តាហ៍នេះ' },
    code: 'FREEDEL',
  },
]

const TEXTS = {
  title: { en: 'Hot Promotions', kh: 'ការផ្សព្វផ្សាយពិសេស' },
  subtitle: { en: 'Limited time deals you don\'t want to miss', kh: 'ការផ្តល់ជូនមានកំណត់ កុំឲ្យខកខាន' },
  viewAll: { en: 'View All Promotions', kh: 'មើលការផ្សព្វផ្សាយទាំងអស់' },
  getDeal: { en: 'Get Deal', kh: 'ទទួលការផ្តល់ជូន' },
  copyCode: { en: 'Copy Code', kh: 'ចម្លងកូដ' },
  useCode: { en: 'Use code:', kh: 'ប្រើកូដ:' },
}

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export const Promotion = () => {
  const { lang } = useLanguage()

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <section className="promotion">
      <div className="promo-inner">
        <div className="promo-header">
          <div className="promo-header-left">
            <span className="promo-eyebrow">
              <SparkleIcon />
              {TEXTS.subtitle[lang]}
            </span>
            <h2 className="promo-title">{TEXTS.title[lang]}</h2>
          </div>
          <Link to="/promotion" className="promo-view-all">
            {TEXTS.viewAll[lang]}
            <ArrowIcon />
          </Link>
        </div>

        <div className="promo-grid">
          {PROMOTIONS.map((promo) => (
            <div key={promo.id} className="promo-card">
              <div className="promo-image-wrap">
                <img
                  src={promo.image}
                  alt={promo.title[lang]}
                  className="promo-image"
                  loading="lazy"
                />
                <div className="promo-image-overlay" />
                <div className="promo-image-content">
                  <span className="promo-badge">{promo.badge[lang]}</span>
                  <span className="promo-tag">{promo.tag[lang]}</span>
                </div>
              </div>
              <div className="promo-info">
                <h3 className="promo-title-text">{promo.title[lang]}</h3>
                <p className="promo-desc">{promo.desc[lang]}</p>
                <div className="promo-actions">
                  <Link to={`/promotion/${promo.id}`} className="promo-get-deal">
                    {TEXTS.getDeal[lang]}
                    <ArrowIcon />
                  </Link>
                  <button
                    className="promo-copy-code"
                    onClick={() => copyCode(promo.code)}
                    title={TEXTS.copyCode[lang]}
                  >
                    <CopyIcon />
                    <span>{TEXTS.useCode[lang]} <strong>{promo.code}</strong></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Promotion