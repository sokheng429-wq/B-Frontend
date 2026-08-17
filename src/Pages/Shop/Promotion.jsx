import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { PRODUCTS, PROMOS, getProduct, formatPrice, discountPct, catLabel, FALLBACK_IMG } from '../../data/products'
import { ProductShop } from '../../components/ProductShop'
import './Promotion.css'

const TEXTS = {
  eyebrow: { en: 'Flash sale · Today only', kh: 'ការផ្តល់ជូនប្រចាំថ្ងៃ' },
  title1: { en: 'Deal of the Day', kh: 'ការផ្តល់ជូនប្រចាំថ្ងៃ' },
  title2: { en: 'Up to 25% off', kh: 'បញ្ចុះតម្លៃរហូតដល់ ២៥%' },
  subtitle: {
    en: 'Our partners drop fresh deals every day. Grab the hottest promos before the timer runs out — no coupon hunting needed.',
    kh: 'ដៃគូរបស់យើងផ្តល់ជូនការផ្សព្វផ្សាយស្រស់ៗរាល់ថ្ងៃ។ ចាប់យកការផ្តល់ជូនក្តៅៗ មុនពេលវេលាអស់ — មិនចាំបាច់ស្វែងរកគូប៉ុងទេ។',
  },
  endsIn: { en: 'Sale ends in', kh: 'ការផ្តល់ជូនបញ្ចប់ក្នុង' },
  promoTitle: { en: 'Popular promo codes', kh: 'កូដផ្សព្វផ្សាយពេញនិយម' },
  copy: { en: 'Copy', kh: 'ចម្លង' },
  copied: { en: 'Copied!', kh: 'បានចម្លង!' },
  useCode: { en: 'Use at checkout', kh: 'ប្រើនៅពេលទូទាត់' },
  save: { en: 'Save', kh: 'សន្សំ' },
  shopAll: { en: 'Shop all deals', kh: 'ទិញការផ្តល់ជូនទាំងអស់' },
  viewDeal: { en: 'View deal', kh: 'មើលការផ្តល់ជូន' },
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const FlameIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22c4.4 0 7-2.8 7-6.5 0-2.6-1.3-4.6-2.8-6.4-.4 1-1 1.9-1.8 2.5.2-2.6-.9-5.3-3.4-7.3.1 1.9-.6 3.6-1.9 4.9C7.6 10.4 5 12 5 15.5 5 19.2 7.6 22 12 22Zm0-2c-2.3 0-3.8-1.5-3.8-3.6 0-1.5.8-2.5 2-3.6.6 1.1 1.8 1.8 2.9 1.8.5-1.5.9-2.9.9-4.6.9 1.6 2 3.6 2 5.6 0 2.4-1.5 4.4-4 4.4Z" />
  </svg>
)

/* Live countdown to end of day */
const useCountdown = () => {
  const [left, setLeft] = useState(() => {
    const now = new Date()
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)
    return Math.max(0, end - now)
  })
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date()
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      setLeft(Math.max(0, end - now))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])
  const s = Math.floor(left / 1000)
  return {
    h: String(Math.floor(s / 3600)).padStart(2, '0'),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
    sec: String(s % 60).padStart(2, '0'),
  }
}

export const Promotion = () => {
  const { lang } = useLanguage()
  const { h, m, sec } = useCountdown()
  const [copied, setCopied] = useState(null)

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code)
    setCopied(code)
    window.setTimeout(() => setCopied(null), 1600)
  }

  const deals = PROMOS
    .map((promo) => ({ promo, product: getProduct(promo.productId) }))
    .filter((d) => Boolean(d.product))

  return (
    <section className="promotion-page">
      {/* ── Flash sale hero ── */}
      <div className="promo-hero">
        <div className="promo-hero-inner">
          <div className="promo-hero-copy">
            <span className="promo-eyebrow"><FlameIcon /> {TEXTS.eyebrow[lang]}</span>
            <h1 className="promo-title">
              {TEXTS.title1[lang]} <span className="promo-title-highlight">{TEXTS.title2[lang]}</span>
            </h1>
            <p className="promo-subtitle">{TEXTS.subtitle[lang]}</p>

            <div className="promo-timer-wrap">
              <span className="promo-timer-label">{TEXTS.endsIn[lang]}</span>
              <div className="promo-timer" role="timer" aria-live="off">
                {[
                  { v: h, label: 'HH' },
                  { v: m, label: 'MM' },
                  { v: sec, label: 'SS' },
                ].map((d, i) => (
                  <span className="promo-timer-group" key={d.label}>
                    {i > 0 && <span className="promo-timer-colon">:</span>}
                    <span className="promo-timer-cell">
                      <span className="promo-timer-num">{d.v}</span>
                      <span className="promo-timer-unit">{d.label}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="promo-hero-art" aria-hidden="true">
            <div className="promo-orb promo-orb-a" />
            <div className="promo-orb promo-orb-b" />
            <div className="promo-big-tag">-25%</div>
            <div className="promo-big-tag promo-big-tag--alt">45min</div>
            <div className="promo-hero-glyph">🛒</div>
          </div>
        </div>
      </div>

      <div className="promo-inner">
        {/* ── Promo code cards ── */}
        <div className="promo-codes">
          <div className="promo-codes-head">
            <h2 className="promo-codes-title">{TEXTS.promoTitle[lang]}</h2>
            <span className="promo-codes-note">{TEXTS.useCode[lang]}</span>
          </div>
          <div className="promo-codes-grid">
            {deals.map(({ promo, product }) => {
              const saved = product.oldPrice ? product.oldPrice - product.price : product.price * 0.15
              const cat = catLabel(product.category)
              return (
                <div className="promo-code-card" key={promo.id}>
                  <Link to="/product-detail" state={{ product }} className="promo-code-media">
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                    />
                    <span className="promo-code-save">
                      {TEXTS.save[lang]} ${formatPrice(saved).slice(1)}
                    </span>
                  </Link>
                  <div className="promo-code-body">
                    <span className="promo-code-badge">{promo.badge[lang]}</span>
                    <Link to="/product-detail" state={{ product }} className="promo-code-name">
                      {product.name[lang]}
                    </Link>
                    <span className="promo-code-cat">{cat.icon} {cat[lang]}</span>
                    <div className="promo-code-price-row">
                      <span className="promo-code-price">{formatPrice(product.price)}</span>
                      {product.oldPrice && <s className="promo-code-old">{formatPrice(product.oldPrice)}</s>}
                      {discountPct(product.oldPrice, product.price) > 0 && (
                        <span className="promo-code-pct">-{discountPct(product.oldPrice, product.price)}%</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`promo-code-copy ${copied === promo.code ? 'promo-code-copy--ok' : ''}`}
                      onClick={() => copyCode(promo.code)}
                    >
                      {copied === promo.code ? <CheckIcon /> : <CopyIcon />}
                      <span>{copied === promo.code ? TEXTS.copied[lang] : promo.code}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Deal grid (paginated) ── */}
        <div className="promo-shop">
          <div className="promo-shop-head">
            <h2 className="promo-shop-title">{TEXTS.shopAll[lang]}</h2>
          </div>
          <ProductShop products={PRODUCTS} initialSort="deal" />
        </div>
      </div>
    </section>
  )
}

export default Promotion
