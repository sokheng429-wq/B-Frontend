import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Home.css'

const CATEGORIES = [
  { label: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, emoji: '🥦', icon: '🥬', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop' },
  { label: { en: 'Meat & Seafood', kh: 'សាច់ និងគ្រឿងសមុទ្រ' }, emoji: '🍗', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop' },
  { label: { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ និងស៊ុត' }, emoji: '🥚', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop' },
  { label: { en: 'Bakery & Bread', kh: 'នំប៉័ង និងនំ' }, emoji: '🍞', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
  { label: { en: 'Drinks', kh: 'ភេសជ្ជៈ' }, emoji: '🧃', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=200&h=200&fit=crop' },
  { label: { en: 'Snacks', kh: 'អាហារសម្រន់' }, emoji: '🍪', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop' },
]

const PRODUCTS = [
  { name: { en: 'Fresh Strawberries', kh: 'ផ្លែស្ត្របឺរីស្រស់' }, price: '$3.50', oldPrice: null, unit: { en: 'box', kh: 'ប្រអប់' }, tag: 'New', rating: 4.8, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop' },
  { name: { en: 'Jasmine Rice 5kg', kh: 'អង្ករផ្កាម្លិះ ៥គក' }, price: '$6.20', oldPrice: '$7.50', unit: { en: 'bag', kh: 'កាបូប' }, tag: null, rating: 4.6, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop' },
  { name: { en: 'Free-range Eggs (12)', kh: 'ស៊ុតសេរី (១២)' }, price: '$2.80', oldPrice: null, unit: { en: 'pack', kh: 'កញ្ចប់' }, tag: 'Popular', rating: 4.9, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop' },
  { name: { en: 'Cold-pressed Orange Juice', kh: 'ទឹកក្រូចច្របាច់ស្រស់' }, price: '$4.10', oldPrice: '$4.90', unit: { en: 'bottle', kh: 'ដប' }, tag: null, rating: 4.5, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop' },
  { name: { en: 'Grilled Chicken Breast', kh: 'សុដន់មាន់អាំង' }, price: '$5.90', oldPrice: null, unit: { en: 'kg', kh: 'គក' }, tag: 'Popular', rating: 4.7, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop' },
  { name: { en: 'Sourdough Loaf', kh: 'នំប៉័ងសូរដូ' }, price: '$3.20', oldPrice: null, unit: { en: 'loaf', kh: 'ដុំ' }, tag: 'New', rating: 4.4, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop' },
  { name: { en: 'Cherry Tomatoes', kh: 'ប៉េងប៉ោះ cherry' }, price: '$1.90', oldPrice: '$2.40', unit: { en: 'box', kh: 'ប្រអប់' }, tag: null, rating: 4.3, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop' },
  { name: { en: 'Greek Yogurt', kh: 'យ៉ាអួក្រិក' }, price: '$2.50', oldPrice: null, unit: { en: 'tub', kh: 'ពែង' }, tag: null, rating: 4.6, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' },
]

const FEATURES = [
  { icon: '🚀', title: { en: 'Delivery in 45 min', kh: 'ដឹកជញ្ជូនក្នុង ៤៥នាទី' }, desc: { en: 'Order before 8pm, get it same day across Phnom Penh.', kh: 'បញ្ជាទិញមុនម៉ោង ៨យប់ ទទួលបានក្នុងថ្ងៃតែមួយទូទាំងភ្នំពេញ។' } },
  { icon: '✨', title: { en: 'Freshness Guaranteed', kh: 'ធានាភាពស្រស់' }, desc: { en: "Not happy? We'll replace or refund — no questions asked.", kh: 'មិនពេញចិត្ត? យើងនឹងជំនួស ឬបង្វិលប្រាក់ — គ្មានសំណួរ។' } },
  { icon: '🔄', title: { en: 'Easy Returns', kh: 'ការប្រគល់ទំនិញងាយស្រួល' }, desc: { en: 'Simple in-app returns on damaged or wrong items.', kh: 'ការប្រគល់ទំនិញងាយស្រួលក្នុងកម្មវិធី លើទំនិញខូច ឬខុស។' } },
]

const TEXTS = {
  heroEyebrow: { en: "B'Groceries Hyperstore", kh: 'ហាងទំនិញ B\'Groceries' },
  heroTitle1: { en: 'Fresh groceries, ', kh: 'គ្រឿងទេសស្រស់ៗ ' },
  heroHighlight: { en: 'delivered', kh: 'ដឹកជញ្ជូន' },
  heroTitle2: { en: ' to your door', kh: ' ដល់មាត់ទ្វារអ្នក' },
  heroSub: { en: 'Thousands of essentials from local farms and trusted brands — browse, order, and have it at your door in under an hour.', kh: 'ទំនិញប្រចាំថ្ងៃរាប់ពាន់មុខពីកសិដ្ឋានក្នុងស្រុក — ជ្រើសរើស បញ្ជាទិញ និងទទួលបាននៅមាត់ទ្វារក្នុងរយៈពេលក្រោមមួយម៉ោង។' },
  shopNow: { en: 'Shop Now', kh: 'ទិញឥឡូវនេះ' },
  viewPromos: { en: 'View Promotions', kh: 'មើលការផ្សព្វផ្សាយ' },
  shopByCategory: { en: 'Shop by Category', kh: 'ទិញតាមប្រភេទ' },
  freshPicks: { en: 'Fresh Picks', kh: 'ការជ្រើសរើសស្រស់ៗ' },
  popularProducts: { en: 'Popular Products', kh: 'ផលិតផលពេញនិយម' },
  seeAll: { en: 'See all products', kh: 'មើលផលិតផលទាំងអស់' },
  add: { en: 'Add to Cart', kh: 'ដាក់ក្នុងកន្ត្រក' },
  limitedTime: { en: 'Limited Time Offer', kh: 'ការផ្តល់ជូនពិសេស' },
  promoTitle: { en: 'Up to 30% off your first order', kh: 'បញ្ចុះតម្លៃរហូតដល់ ៣០%' },
  promoSub1: { en: 'Use code ', kh: 'ប្រើកូដ ' },
  promoSub2: { en: ' at checkout. Valid on orders over $15.', kh: ' នៅពេលទូទាត់។ មានសុពលភាពលើការបញ្ជាទិញលើស ១៥ ដុល្លារ។' },
  grabDeal: { en: 'Grab the Deal', kh: 'ទទួលការផ្តល់ជូន' },
  becomeMember: { en: 'Become a Member', kh: 'ក្លាយជាសមាជិក' },
  memberSub: { en: 'Free delivery, member-only prices, and early access to promotions.', kh: 'ដឹកជញ្ជូនឥតគិតថ្លៃ តម្លៃសម្រាប់សមាជិក និងចូលប្រើការផ្សព្វផ្សាយមុនគេ។' },
  joinFree: { en: 'Join for Free', kh: 'ចូលរួមដោយឥតគិតថ្លៃ' },
  whyChooseUs: { en: 'Why Choose Us', kh: 'ហេតុអ្វីជ្រើសរើសយើង' },
}

const TAG_LABELS = {
  New: { en: 'New', kh: 'ថ្មី' },
  Popular: { en: 'Popular', kh: 'ពេញនិយម' },
}

const StarRating = ({ rating }) => (
  <span className="stars-inline">
    {'★★★★★'.split('').map((star, i) => (
      <span key={i} className={i < Math.round(rating) ? 'star-on' : 'star-off'}>{star}</span>
    ))}
  </span>
)

export const Home = () => {
  const { lang } = useLanguage()
  const [hoveredProduct, setHoveredProduct] = useState(null)

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
              <Link to="/products" className="home-btn-primary">{TEXTS.shopNow[lang]}</Link>
              <Link to="/promotion" className="home-btn-outline">{TEXTS.viewPromos[lang]}</Link>
            </div>
            <div className="home-hero-stats">
              <div className="home-hero-stat"><strong>10K+</strong><span>{lang === 'en' ? 'Orders/day' : 'ការបញ្ជា/ថ្ងៃ'}</span></div>
              <div className="home-hero-stat"><strong>45min</strong><span>{lang === 'en' ? 'Avg delivery' : 'ជាមធ្យម'}</span></div>
              <div className="home-hero-stat"><strong>99%</strong><span>{lang === 'en' ? 'Satisfaction' : 'ការពេញចិត្ត'}</span></div>
            </div>
          </div>
          <div className="home-hero-visual">
            <div className="home-hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&h=500&fit=crop" alt="Fresh groceries" className="home-hero-img" />
            </div>
            <div className="home-hero-float home-hero-float--1">🥑</div>
            <div className="home-hero-float home-hero-float--2">🍎</div>
            <div className="home-hero-float home-hero-float--3">🥖</div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="home-categories">
        <div className="home-inner">
          <h2 className="home-section-title">{TEXTS.shopByCategory[lang]}</h2>
          <div className="home-cat-grid">
            {CATEGORIES.map((cat) => (
              <Link to="/products" key={cat.label.en} className="home-cat-card">
                <div className="home-cat-img-wrap">
                  <img src={cat.image} alt={cat.label[lang]} className="home-cat-img" loading="lazy" />
                </div>
                <span className="home-cat-label">{cat.emoji} {cat.label[lang]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR PRODUCTS ===== */}
      <section className="home-products">
        <div className="home-inner">
          <div className="home-section-header">
            <div>
              <span className="home-section-eyebrow">{TEXTS.freshPicks[lang]}</span>
              <h2 className="home-section-title">{TEXTS.popularProducts[lang]}</h2>
            </div>
            <Link to="/products" className="home-see-all">
              {TEXTS.seeAll[lang]}
              <ArrowRight />
            </Link>
          </div>

          <div className="home-prod-grid">
            {PRODUCTS.map((p) => (
              <div
                key={p.name.en}
                className={`home-prod-card ${hoveredProduct === p.name.en ? 'home-prod-card--hovered' : ''}`}
                onMouseEnter={() => setHoveredProduct(p.name.en)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="home-prod-img-wrap">
                  <img src={p.image} alt={p.name[lang]} className="home-prod-img" loading="lazy" />
                  {p.tag && <span className="home-prod-tag">{TAG_LABELS[p.tag][lang]}</span>}
                  {p.oldPrice && <span className="home-prod-sale">SALE</span>}
                  <div className="home-prod-quick">
                    <button className="home-prod-quick-btn">
                      <CartIcon /> {TEXTS.add[lang]}
                    </button>
                  </div>
                </div>
                <div className="home-prod-info">
                  <StarRating rating={p.rating} />
                  <h3 className="home-prod-name">{p.name[lang]}</h3>
                  <div className="home-prod-prices">
                    <span className="home-prod-price">{p.price}</span>
                    {p.oldPrice && <span className="home-prod-old">{p.oldPrice}</span>}
                    <span className="home-prod-unit">/ {p.unit[lang]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="home-promo-section">
        <div className="home-inner">
          <div className="home-promo-banner">
            <div className="home-promo-bg-shape" />
            <div className="home-promo-content">
              <span className="home-promo-eyebrow">🔥 {TEXTS.limitedTime[lang]}</span>
              <h2 className="home-promo-title">{TEXTS.promoTitle[lang]}</h2>
              <p className="home-promo-text">
                {TEXTS.promoSub1[lang]}<strong>FRESH30</strong>{TEXTS.promoSub2[lang]}
              </p>
              <Link to="/promotion" className="home-btn-accent">{TEXTS.grabDeal[lang]}</Link>
            </div>
            <div className="home-promo-visual">
              <span className="home-promo-emoji">🏷️</span>
              <div className="home-promo-circle home-promo-circle--1">-30%</div>
              <div className="home-promo-circle home-promo-circle--2">+Free Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="home-features">
        <div className="home-inner">
          <h2 className="home-section-title home-section-title--center">{TEXTS.whyChooseUs[lang]}</h2>
          <div className="home-feat-grid">
            {FEATURES.map((f) => (
              <div key={f.title.en} className="home-feat-card">
                <div className="home-feat-icon">{f.icon}</div>
                <h3 className="home-feat-title">{f.title[lang]}</h3>
                <p className="home-feat-desc">{f.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MEMBER CTA ===== */}
      <section className="home-member-section">
        <div className="home-inner">
          <div className="home-member-wrap">
            <div className="home-member-copy">
              <h2 className="home-member-title">{TEXTS.becomeMember[lang]}</h2>
              <p className="home-member-text">{TEXTS.memberSub[lang]}</p>
              <div className="home-member-perks">
                <span>🚚 Free Delivery</span>
                <span>💰 Member Prices</span>
                <span>⚡ Early Access</span>
                <span>🎂 Birthday Gift</span>
              </div>
            </div>
            <Link to="/member" className="home-btn-primary home-join-btn">{TEXTS.joinFree[lang]}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const ArrowRight = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

export default Home