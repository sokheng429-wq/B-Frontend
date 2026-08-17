import { PRODUCTS } from '../../data/products'
import { ProductShop } from '../../components/ProductShop'
import { useLanguage } from '../../context/LanguageContext'
import './Popular Products.css'

const TEXTS = {
  eyebrow: { en: 'Fresh · Fast · Local', kh: 'ស្រស់ · លឿន · ក្នុងស្រុក' },
  title1: { en: 'Popular Products', kh: 'ផលិតផលពេញនិយម' },
  title2: { en: 'Shop the store', kh: 'ទិញឥវ៉ាន់ទាំងអស់' },
  subtitle: {
    en: 'A whole market of fresh groceries, delivered to your door in 45 minutes. 80+ products across 7 categories — find your favourites below.',
    kh: 'ទីផ្សារពេញលេញនៃគ្រឿងទេសស្រស់ៗ ដឹកជញ្ជូនដល់ផ្ទះក្នុង ៤៥ នាទី។ ផលិតផល ៨០+ ក្នុង ៧ ប្រភេទ — ស្វែងរកអ្វីដែលអ្នកចូលចិត្តខាងក្រោម។',
  },
  statDelivery: { en: '45-min delivery', kh: 'ដឹកជញ្ជូន ៤៥ នាទី' },
  statProducts: { en: '80+ products', kh: 'ផលិតផល ៨០+' },
  statRating: { en: '4.9★ rated', kh: 'ពិន្ទុ ៤.៩★' },
}

const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
)

export const PopularProducts = () => {
  const { lang } = useLanguage()

  return (
    <section className="popular-products">
      <div className="pp-hero">
        <div className="pp-hero-inner">
          <span className="pp-eyebrow"><BoltIcon /> {TEXTS.eyebrow[lang]}</span>
          <h1 className="pp-title">
            {TEXTS.title1[lang]} <span className="pp-title-highlight">{TEXTS.title2[lang]}</span>
          </h1>
          <p className="pp-subtitle">{TEXTS.subtitle[lang]}</p>
          <div className="pp-stats">
            <span className="pp-stat"><span className="pp-stat-dot" /> {TEXTS.statDelivery[lang]}</span>
            <span className="pp-stat"><span className="pp-stat-dot" /> {TEXTS.statProducts[lang]}</span>
            <span className="pp-stat"><span className="pp-stat-dot" /> {TEXTS.statRating[lang]}</span>
          </div>
        </div>
      </div>
      <div className="pp-inner">
        <ProductShop products={PRODUCTS} />
      </div>
    </section>
  )
}

export default PopularProducts
