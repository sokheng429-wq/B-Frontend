import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Productdetail.css'

const RELATED = [
  { name: { en: 'Cherry Tomatoes', kh: 'ប៉េងប៉ោះតូច' }, price: '$1.90', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop' },
  { name: { en: 'Greek Yogurt', kh: 'យ៉ាហួក្រិច' }, price: '$2.50', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' },
  { name: { en: 'Sourdough Loaf', kh: 'នំប៉័ង Sourdough' }, price: '$3.20', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&h=400&fit=crop' },
  { name: { en: 'Cold-pressed Orange Juice', kh: 'ទឹកក្រូចស្រស់' }, price: '$4.10', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop' },
]

const TEXTS = {
  home: { en: 'Home', kh: 'ទំព័រដើម' },
  products: { en: 'Products', kh: 'ផលិតផល' },
  inStock: { en: 'In stock', kh: 'មានក្នុងស្តុក' },
  quantity: { en: 'Quantity', kh: 'ចំនួន' },
  addToCart: { en: 'Add to Cart', kh: 'ដាក់ក្នុងកន្ត្រក' },
  buyNow: { en: 'Buy Now', kh: 'ទិញភ្លាមៗ' },
  delivery45: { en: 'Delivery in 45 min', kh: 'ដឹកជញ្ជូនក្នុងរយៈពេល ៤៥ នាទី' },
  freshGuarantee: { en: 'Freshness Guaranteed', kh: 'ធានាភាពស្រស់' },
  easyReturns: { en: 'Easy 7-day returns', kh: 'ប្តូរវិញងាយស្រួលក្នុង ៧ថ្ងៃ' },
  descriptionTitle: { en: 'Description', kh: 'ការពិពណ៌នា' },
  specsTitle: { en: 'Specifications', kh: 'លក្ខណៈបច្ចេកទេស' },
  relatedTitle: { en: 'Related Products', kh: 'ផលិតផលទាក់ទង' },
  origin: { en: 'Origin', kh: 'ប្រភព' },
  storage: { en: 'Storage', kh: 'ការរក្សាទុក' },
  weight: { en: 'Net weight', kh: 'ទម្ងន់សុទ្ធ' },
  originVal: { en: 'Kampong Speu, Cambodia', kh: 'កំពង់ស្ពឺ, កម្ពុជា' },
  storageVal: { en: 'Refrigerate, use within 3 days', kh: 'ក្លាសេ, ប្រើប្រាស់ក្នុងរយៈពេល ៣ថ្ងៃ' },
}

export const Productdetail = () => {
  const { lang } = useLanguage()
  const location = useLocation()
  const productState = location.state?.product

  const name = productState?.name?.[lang] || (lang === 'kh' ? 'ផ្លែស្ត្របឺរីស្រស់' : 'Fresh Strawberries')
  const price = productState?.price || '$3.50'
  const unit = productState?.unit || (lang === 'kh' ? '/ ប្រអប់' : '/ box')
  const tag = productState?.badge?.[lang] || (lang === 'kh' ? 'ថ្មី' : 'New')
  const rating = productState?.rating || 4.6
  const reviewCount = productState?.sold || 128
  const image = productState?.image || 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop'

  const [qty, setQty] = useState(1)

  return (
    <div className="pd-page">
      <div className="pd-inner">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link to="/">{TEXTS.home[lang]}</Link>
          <span>/</span>
          <Link to="/products">{TEXTS.products[lang]}</Link>
          <span>/</span>
          <span className="pd-breadcrumb-current">{name}</span>
        </nav>

        <div className="pd-layout">

          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <div className="pd-gallery-thumbs">
              <div className="pd-thumb pd-thumb-active">
                <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            {tag && <span className="pd-tag">{tag}</span>}
            <h1 className="pd-name">{name}</h1>

            <div className="pd-rating">
              <StarRow rating={rating} />
              <span className="pd-rating-value">{rating}</span>
              <span className="pd-rating-count">({reviewCount})</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{price}</span>
              <span className="pd-unit">{unit}</span>
              <span className="pd-stock">{TEXTS.inStock[lang]}</span>
            </div>

            <div className="pd-qty-row">
              <span className="pd-qty-label">{TEXTS.quantity[lang]}</span>
              <div className="pd-stepper">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button type="button" className="btn-outline-pd">{TEXTS.addToCart[lang]}</button>
              <button type="button" className="btn-primary-pd">{TEXTS.buyNow[lang]}</button>
            </div>

            <div className="pd-perks">
              <div className="pd-perk"><TruckIcon /> {TEXTS.delivery45[lang]}</div>
              <div className="pd-perk"><ShieldIcon /> {TEXTS.freshGuarantee[lang]}</div>
              <div className="pd-perk"><ReturnIcon /> {TEXTS.easyReturns[lang]}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="pd-section">
          <h2 className="pd-section-title">{TEXTS.descriptionTitle[lang]}</h2>
          <p className="pd-description">
            {lang === 'kh'
              ? 'ផ្លែឈើស្រស់ៗដាំដុះដោយកសិដ្ឋានក្នុងស្រុក និងប្រមូលផលតាមរដូវ ជ្រើសរើសដោយប្រុងប្រយ័ត្នដើម្បីគុណភាព និងភាពស្រស់ខ្ពស់បំផុត។'
              : 'Grown by local farms and picked at peak ripeness, carefully hand-sorted for freshness before delivering directly to your door.'}
          </p>
        </div>

        {/* Specs */}
        <div className="pd-section">
          <h2 className="pd-section-title">{TEXTS.specsTitle[lang]}</h2>
          <div className="pd-specs">
            <div className="pd-spec-row"><span>{TEXTS.origin[lang]}</span><span>{TEXTS.originVal[lang]}</span></div>
            <div className="pd-spec-row"><span>{TEXTS.storage[lang]}</span><span>{TEXTS.storageVal[lang]}</span></div>
            <div className="pd-spec-row"><span>{TEXTS.weight[lang]}</span><span>500g</span></div>
          </div>
        </div>

        {/* Related products */}
        <div className="pd-section">
          <h2 className="pd-section-title">{TEXTS.relatedTitle[lang]}</h2>
          <div className="pd-related-grid">
            {RELATED.map((r) => (
              <div className="pd-related-card" key={r.name.en}>
                <img src={r.image} alt={r.name[lang]} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }} />
                <p className="pd-related-name">{r.name[lang]}</p>
                <p className="pd-related-price">{r.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const StarRow = ({ rating }) => (
  <div className="pd-stars" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.5">
        <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7-5.4-4.7 7.1-.6L12 2Z" />
      </svg>
    ))}
  </div>
)

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
  </svg>
)
const ReturnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

export default Productdetail
