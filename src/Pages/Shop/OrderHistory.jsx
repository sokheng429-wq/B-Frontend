import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { ORDERS, STATUS_LABEL, STAGE_STEP, STEPS, formatOrderDate, orderTotal } from '../../data/orders'
import { formatPrice, FALLBACK_IMG } from '../../data/products'
import './OrderHistory.css'

const TEXTS = {
  eyebrow: { en: 'Account · Shopping history', kh: 'គណនី · ប្រវត្តិទិញទំនិញ' },
  title: { en: 'My orders', kh: 'ការបញ្ជាទិញរបស់ខ្ញុំ' },
  subtitle: {
    en: 'Every grocery run in one place — see what is moving, what arrived, and what is easy to buy again.',
    kh: 'រាល់ការទិញទំនិញនៅកន្លែងតែមួយ — មើលអ្វីកំពុងដឹកជញ្ជូន អ្វីបានមកដល់ និងអ្វីអាចទិញឡើងវិញបានងាយ។',
  },
  all: { en: 'All', kh: 'ទាំងអស់' },
  processing: { en: 'Packing', kh: 'កំពុងវេចខ្ចប់' },
  transit: { en: 'On the way', kh: 'កំពុងមកដល់' },
  delivered: { en: 'Delivered', kh: 'បានដឹកជញ្ជូន' },
  order: { en: 'Order', kh: 'ការបញ្ជាទិញ' },
  placed: { en: 'Placed', kh: 'បានបញ្ជាទិញ' },
  items: { en: 'items', kh: 'ទំនិញ' },
  total: { en: 'Total', kh: 'សរុប' },
  track: { en: 'Track order', kh: 'តាមដានការដឹកជញ្ជូន' },
  reorder: { en: 'Buy again', kh: 'ទិញម្តងទៀត' },
  active: { en: 'Active now', kh: 'កំពុងដំណើរការ' },
  receipt: { en: 'Receipt', kh: 'បង្កាន់ដៃ' },
  eta: { en: 'ETA', kh: 'ពេលមកដល់' },
  noOrders: { en: 'No orders in this lane yet.', kh: 'មិនទាន់មានការបញ្ជាទិញនៅផ្នែកនេះទេ។' },
  noOrdersHint: { en: 'Try another filter or start a fresh grocery basket.', kh: 'សាកល្បងតម្រងផ្សេង ឬចាប់ផ្តើមកន្ត្រកថ្មី។' },
  browse: { en: 'Browse products', kh: 'មើលផលិតផល' },
}

const ReceiptIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2h12v20l-2-1.2L14 22l-2-1.2L10 22l-2-1.2L6 22V2Z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="13" y2="15" />
  </svg>
)
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
)

const FILTERS = [
  { key: 'all', text: 'all' },
  { key: 'processing', text: 'processing' },
  { key: 'transit', text: 'transit' },
  { key: 'delivered', text: 'delivered' },
]

const stagePercent = (stage) => Math.round((STAGE_STEP[stage] / STEPS.length) * 100)

const ProgressRing = ({ percent, label }) => {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <span className="oh-ring" aria-label={`${label} ${percent}%`}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="oh-ring-track" cx="22" cy="22" r={radius} />
        <circle
          className="oh-ring-fill"
          cx="22"
          cy="22"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span>{percent}</span>
    </span>
  )
}

export const OrderHistory = () => {
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => ({
    all: ORDERS.length,
    processing: ORDERS.filter((o) => o.stage === 'processing').length,
    transit: ORDERS.filter((o) => o.stage === 'transit').length,
    delivered: ORDERS.filter((o) => o.stage === 'delivered').length,
  }), [])

  const filtered = filter === 'all' ? ORDERS : ORDERS.filter((o) => o.stage === filter)
  const activeOrders = ORDERS.filter((o) => o.stage !== 'delivered').length

  return (
    <div className="oh-page">
      <section className="oh-hero">
        <div className="oh-hero-inner">
          <div className="oh-copy">
            <span className="oh-eyebrow"><ReceiptIcon /> {TEXTS.eyebrow[lang]}</span>
            <h1 className="oh-title">{TEXTS.title[lang]}</h1>
            <p className="oh-subtitle">{TEXTS.subtitle[lang]}</p>
          </div>
          <div className="oh-hero-ticket" aria-label={TEXTS.active[lang]}>
            <span className="oh-ticket-label">{TEXTS.active[lang]}</span>
            <strong>{activeOrders}</strong>
            <span className="oh-ticket-note">{TEXTS.processing[lang]} + {TEXTS.transit[lang]}</span>
          </div>
        </div>
      </section>

      <main className="oh-inner">
        <div className="oh-filters" role="tablist" aria-label="Order status">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`oh-filter ${filter === f.key ? 'oh-filter--on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              <span>{TEXTS[f.text][lang]}</span>
              <strong>{stats[f.key]}</strong>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="oh-empty">
            <span className="oh-empty-icon" aria-hidden="true">🧺</span>
            <p className="oh-empty-title">{TEXTS.noOrders[lang]}</p>
            <p className="oh-empty-hint">{TEXTS.noOrdersHint[lang]}</p>
            <Link to="/products" className="oh-empty-btn">{TEXTS.browse[lang]}</Link>
          </div>
        ) : (
          <div className="oh-list" aria-live="polite">
            {filtered.map((order) => {
              const total = orderTotal(order) + order.delivery.fee
              const percent = stagePercent(order.stage)
              const isActive = order.stage !== 'delivered'
              const previewItems = order.items.slice(0, 3)
              const extraItems = order.items.length - previewItems.length

              return (
                <article className={`oh-card oh-card--${order.stage} ${isActive ? 'oh-card--active' : ''}`} key={order.id}>
                  <div className="oh-card-main">
                    <div className="oh-card-left">
                      <ProgressRing percent={percent} label={STATUS_LABEL[order.stage][lang]} />
                      <div>
                        <div className="oh-card-title-row">
                          <h2>{TEXTS.order[lang]} #{order.id}</h2>
                          {isActive && <span className="oh-live-pill">{TEXTS.active[lang]}</span>}
                        </div>
                        <p className="oh-date">{TEXTS.placed[lang]} {formatOrderDate(order.date, lang)}</p>
                        <span className={`oh-status oh-status--${order.stage}`}>
                          <span className="oh-status-dot" />
                          {STATUS_LABEL[order.stage][lang]}
                        </span>
                      </div>
                    </div>

                    <div className="oh-product-stack" aria-label={`${order.items.length} ${TEXTS.items[lang]}`}>
                      {previewItems.map((it, index) => (
                        <span className="oh-stack-thumb" style={{ '--i': index }} key={it.product.id}>
                          <img
                            src={it.product.image}
                            alt={it.product.name[lang]}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                          />
                        </span>
                      ))}
                      {extraItems > 0 && <span className="oh-stack-more">+{extraItems}</span>}
                    </div>
                  </div>

                  <div className="oh-items">
                    {order.items.map((it) => (
                      <div className="oh-item" key={it.product.id}>
                        <span className="oh-item-name">{it.product.name[lang]}</span>
                        <span className="oh-item-qty">×{it.qty}</span>
                        <span className="oh-item-total">{formatPrice(it.product.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="oh-card-foot">
                    <div className="oh-delivery">
                      <TruckIcon />
                      <span>{order.delivery.label[lang]}</span>
                      <span className="oh-dot-sep" />
                      <span>{TEXTS.eta[lang]}: {order.eta[lang]}</span>
                    </div>
                    <div className="oh-total">
                      <span>{TEXTS.total[lang]}</span>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                    <div className="oh-actions">
                      <button type="button" className="oh-btn oh-btn--ghost">
                        <RefreshIcon /> {TEXTS.reorder[lang]}
                      </button>
                      <Link to="/tracking" state={{ orderId: order.id }} className="oh-btn oh-btn--solid">
                        <TruckIcon /> {TEXTS.track[lang]}
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default OrderHistory
