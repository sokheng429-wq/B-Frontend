import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import {
  PRODUCTS, REVIEWS, catLabel, storageFor, getProduct,
  formatPrice, formatSold, discountPct, buildGallery, FALLBACK_IMG,
} from '../../data/products'
import { ProductCard } from '../../components/ProductCard'
import './Productdetail.css'

const TEXTS = {
  home: { en: 'Home', kh: 'ទំព័រដើម' },
  products: { en: 'Products', kh: 'ផលិតផល' },
  inStock: { en: 'In stock', kh: 'មានក្នុងស្តុក' },
  sold: { en: 'sold', kh: 'បានលក់' },
  quantity: { en: 'Quantity', kh: 'ចំនួន' },
  addToCart: { en: 'Add to Cart', kh: 'ដាក់ក្នុងកន្ត្រក' },
  added: { en: 'Added ✓', kh: 'បានបន្ថែម ✓' },
  buyNow: { en: 'Buy Now', kh: 'ទិញភ្លាមៗ' },
  delivery45: { en: 'Delivery in 45 min', kh: 'ដឹកជញ្ជូនក្នុង ៤៥ នាទី' },
  freshGuarantee: { en: 'Freshness Guaranteed', kh: 'ធានាភាពស្រស់' },
  easyReturns: { en: 'Easy 7-day returns', kh: 'ប្តូរវិញ ៧ថ្ងៃ' },
  tabDesc: { en: 'Description', kh: 'ការពិពណ៌នា' },
  tabDetails: { en: 'Details', kh: 'លម្អិត' },
  tabReviews: { en: 'Reviews', kh: 'ការវាយតម្លៃ' },
  origin: { en: 'Origin', kh: 'ប្រភព' },
  storage: { en: 'Storage', kh: 'ការរក្សាទុក' },
  netWeight: { en: 'Net weight', kh: 'ទម្ងន់សុទ្ធ' },
  category: { en: 'Category', kh: 'ប្រភេទ' },
  unit: { en: 'Unit', kh: 'ឯកតា' },
  related: { en: 'You may also like', kh: 'អាចចូលចិត្តផងដែរ' },
  verified: { en: 'Verified purchase', kh: 'ការទិញដែលបានផ្ទៀងផ្ទាត់' },
}

const StarRow = ({ rating, size = 15 }) => (
  <span className="pd-stars" aria-label={`${rating} / 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7-5.4-4.7 7.1-.6L12 2Z" />
      </svg>
    ))}
  </span>
)

const TruckIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
const ReturnIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

export const Productdetail = () => {
  const { lang } = useLanguage()
  const location = useLocation()

  const product = location.state?.product || getProduct(1)

  // Keying by product id remounts the view, so all local state is fresh
  // (quantity, gallery image, active tab) whenever a new product is opened.
  return <ProductDetailView key={product.id} product={product} lang={lang} />
}

const ProductDetailView = ({ product, lang }) => {
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const [tab, setTab] = useState('desc')
  const [added, setAdded] = useState(false)

  const t = (k) => TEXTS[k][lang]
  const cat = catLabel(product.category)
  const discount = discountPct(product.oldPrice, product.price)
  const gallery = useMemo(() => buildGallery(product), [product])

  const reviews = useMemo(() => {
    const start = product.id % REVIEWS.length
    return [0, 1, 2].map((i) => REVIEWS[(start + i) % REVIEWS.length])
  }, [product.id])

  const related = useMemo(() => {
    const same = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    const others = PRODUCTS.filter((p) => p.category !== product.category)
    return [...same, ...others].slice(0, 4)
  }, [product.id, product.category])

  const handleAdd = () => {
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="pd-page">
      <div className="pd-inner">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span className="pd-crumb-sep">/</span>
          <Link to="/products">{t('products')}</Link>
          <span className="pd-crumb-sep">/</span>
          <span className="pd-crumb-current">{product.name[lang]}</span>
        </nav>

        <div className="pd-layout">

          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              <img
                src={gallery[imgIdx]}
                alt={product.name[lang]}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
              />
              {discount > 0 && <span className="pd-float-pct">-{discount}%</span>}
              {product.badge && <span className="pd-float-badge">{product.badge[lang]}</span>}
            </div>
            <div className="pd-thumbs">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pd-thumb ${i === imgIdx ? 'pd-thumb--on' : ''}`}
                  onClick={() => setImgIdx(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={g} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-info-top">
              <span className="pd-cat">{cat.icon} {cat[lang]}</span>
              <h1 className="pd-name">{product.name[lang]}</h1>
              <div className="pd-rating-row">
                <StarRow rating={product.rating} />
                <span className="pd-rating-val">{product.rating}</span>
                <span className="pd-rating-sep">·</span>
                <span className="pd-rating-count">{formatSold(product.sold)} {t('sold')}</span>
              </div>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="pd-old">{formatPrice(product.oldPrice)}</span>}
              <span className="pd-unit">{product.unit[lang]}</span>
              <span className="pd-stock"><span className="pd-stock-dot" /> {t('inStock')}</span>
            </div>

            <div className="pd-qty-row">
              <span className="pd-qty-label">{t('quantity')}</span>
              <div className="pd-stepper">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span className="pd-qty-num">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button
                type="button"
                className={`btn-outline-pd ${added ? 'btn-outline-pd--ok' : ''}`}
                onClick={handleAdd}
              >
                {added ? <><CheckIcon /> {t('added')}</> : <><CartIcon /> {t('addToCart')}</>}
              </button>
              <button type="button" className="btn-primary-pd">{t('buyNow')}</button>
            </div>

            <div className="pd-perks">
              <div className="pd-perk"><TruckIcon /> {t('delivery45')}</div>
              <div className="pd-perk"><ShieldIcon /> {t('freshGuarantee')}</div>
              <div className="pd-perk"><ReturnIcon /> {t('easyReturns')}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs">
          <div className="pd-tabs-bar" role="tablist">
            {[
              { key: 'desc', label: t('tabDesc') },
              { key: 'details', label: t('tabDetails') },
              { key: 'reviews', label: t('tabReviews') },
            ].map((tb) => (
              <button
                key={tb.key}
                type="button"
                role="tab"
                aria-selected={tab === tb.key}
                className={`pd-tab ${tab === tb.key ? 'pd-tab--on' : ''}`}
                onClick={() => setTab(tb.key)}
              >
                {tb.label}
                {tb.key === 'reviews' && <span className="pd-tab-count">{reviews.length}</span>}
              </button>
            ))}
          </div>

          <div className="pd-tab-panel" role="tabpanel">
            {tab === 'desc' && (
              <p className="pd-desc">{product.desc[lang]}</p>
            )}

            {tab === 'details' && (
              <div className="pd-specs">
                <div className="pd-spec-row"><span>{t('origin')}</span><span>{product.origin[lang]}</span></div>
                <div className="pd-spec-row"><span>{t('storage')}</span><span>{storageFor(product.category)[lang]}</span></div>
                <div className="pd-spec-row"><span>{t('netWeight')}</span><span>{product.weight}</span></div>
                <div className="pd-spec-row"><span>{t('category')}</span><span>{cat[lang]}</span></div>
                <div className="pd-spec-row"><span>{t('unit')}</span><span>{product.unit[lang]}</span></div>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="pd-reviews">
                <div className="pd-review-summary">
                  <span className="pd-review-score">{product.rating}</span>
                  <div className="pd-review-stars"><StarRow rating={product.rating} size={18} /></div>
                  <span className="pd-review-note">{formatSold(product.sold)} {t('sold')}</span>
                </div>
                {reviews.map((r, i) => (
                  <article className="pd-review" key={i}>
                    <div className="pd-review-head">
                      <span className="pd-review-avatar">{r.author[lang].charAt(0)}</span>
                      <div>
                        <p className="pd-review-author">{r.author[lang]}</p>
                        <p className="pd-review-date">{r.date} · {t('verified')}</p>
                      </div>
                      <span className="pd-review-rating"><StarRow rating={r.rating} size={12} /></span>
                    </div>
                    <p className="pd-review-text">{r.text[lang]}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <section className="pd-related">
          <h2 className="pd-related-title">{t('related')}</h2>
          <div className="pd-related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky mobile bar */}
      <div className="pd-sticky">
        <div className="pd-sticky-inner">
          <div className="pd-sticky-price">
            <span className="pd-sticky-amount">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="pd-sticky-old">{formatPrice(product.oldPrice)}</span>}
          </div>
          <button type="button" className="pd-sticky-add" onClick={handleAdd}>
            {added ? <CheckIcon /> : <CartIcon />}
            {added ? t('added') : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Productdetail
