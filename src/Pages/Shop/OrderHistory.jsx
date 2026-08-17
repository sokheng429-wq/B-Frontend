import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { ORDERS, STATUS_LABEL, formatOrderDate, orderTotal } from '../../data/orders'
import { formatPrice, FALLBACK_IMG } from '../../data/products'
import './OrderHistory.css'

const TEXTS = {
  eyebrow: { en: 'Account · Shopping history', kh: 'គណនី · ប្រវត្តិទិញទំនិញ' },
  title1: { en: 'My', kh: 'ប្រវត្តិ' },
  title2: { en: 'Orders', kh: 'ការបញ្ជាទិញរបស់ខ្ញុំ' },
  subtitle: {
    en: 'Track, review, and reorder everything you\'ve ordered with us.',
    kh: 'តាមដាន ពិនិត្យ និងបញ្ជាទិញឡើងវិញនូវអ្វីដែលអ្នកបានបញ្ជាទិញជាមួយយើង។',
  },
  all: { en: 'All', kh: 'ទាំងអស់' },
  processing: { en: 'Processing', kh: 'កំពុងដំណើរការ' },
  transit: { en: 'In Transit', kh: 'កំពុងដឹកជញ្ជូន' },
  delivered: { en: 'Delivered', kh: 'បានដឹកជញ្ជូន' },
  order: { en: 'Order', kh: 'ការបញ្ជាទិញ' },
  placed: { en: 'Placed on', kh: 'បានបញ្ជាទិញនៅថ្ងៃ' },
  items: { en: 'items', kh: 'ទំនិញ' },
  total: { en: 'Total', kh: 'សរុប' },
  track: { en: 'Track Order', kh: 'តាមដានការដឹកជញ្ជូន' },
  reorder: { en: 'Reorder', kh: 'បញ្ជាទិញឡើងវិញ' },
  noOrders: { en: 'No orders in this status yet.', kh: 'មិនទាន់មានការបញ្ជាទិញនៅក្នុងស្ថានភាពនេះទេ។' },
  noOrdersHint: { en: 'Try another filter, or browse the shop.', kh: 'សាកល្បងតម្រងផ្សេង ឬមើលហាងរបស់យើង។' },
  browse: { en: 'Browse Products', kh: 'មើលផលិតផល' },
}

const ReceiptIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2h12v20l-2-1.2L14 22l-2-1.2L10 22l-2-1.2L6 22V2Z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
)
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
)

const statusClass = (stage) => `oh-status oh-status--${stage}`

export const OrderHistory = () => {
  const { lang } = useLanguage()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? ORDERS : ORDERS.filter((o) => o.stage === filter)

  return (
    <div className="oh-page">
      {/* Hero */}
      <section className="oh-hero">
        <div className="oh-hero-inner">
          <span className="oh-eyebrow"><ReceiptIcon /> {TEXTS.eyebrow[lang]}</span>
          <h1 className="oh-title">
            {TEXTS.title1[lang]} <span className="oh-title-highlight">{TEXTS.title2[lang]}</span>
          </h1>
          <p className="oh-subtitle">{TEXTS.subtitle[lang]}</p>
        </div>
      </section>

      <div className="oh-inner">
        {/* Status filters */}
        <div className="oh-filters" role="tablist" aria-label="Order status">
          {[
            { key: 'all', label: TEXTS.all[lang] },
            { key: 'processing', label: TEXTS.processing[lang] },
            { key: 'transit', label: TEXTS.transit[lang] },
            { key: 'delivered', label: TEXTS.delivered[lang] },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`oh-filter ${filter === f.key ? 'oh-filter--on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="oh-filter-count">
                {f.key === 'all' ? ORDERS.length : ORDERS.filter((o) => o.stage === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="oh-empty">
            <span className="oh-empty-icon" aria-hidden="true">🧾</span>
            <p className="oh-empty-title">{TEXTS.noOrders[lang]}</p>
            <p className="oh-empty-hint">{TEXTS.noOrdersHint[lang]}</p>
            <Link to="/products" className="oh-empty-btn">{TEXTS.browse[lang]}</Link>
          </div>
        ) : (
          <div className="oh-list">
            {filtered.map((order) => {
              const total = orderTotal(order) + order.delivery.fee
              return (
                <article className="oh-card" key={order.id}>
                  <div className="oh-card-head">
                    <div>
                      <span className="oh-id">{TEXTS.order[lang]} #{order.id}</span>
                      <span className="oh-date">{TEXTS.placed[lang]} {formatOrderDate(order.date, lang)}</span>
                    </div>
                    <span className={`oh-status ${statusClass(order.stage)}`}>
                      <span className="oh-status-dot" />
                      {STATUS_LABEL[order.stage][lang]}
                    </span>
                  </div>

                  <div className="oh-items">
                    {order.items.map((it) => (
                      <div className="oh-item" key={it.product.id}>
                        <div className="oh-item-thumb">
                          <img
                            src={it.product.image}
                            alt={it.product.name[lang]}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                          />
                        </div>
                        <div className="oh-item-info">
                          <p className="oh-item-name">{it.product.name[lang]}</p>
                          <p className="oh-item-meta">{formatPrice(it.product.price)} · ×{it.qty}</p>
                        </div>
                        <span className="oh-item-total">{formatPrice(it.product.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="oh-card-foot">
                    <div className="oh-delivery">
                      <TruckIcon />
                      {order.delivery.label[lang]}
                    </div>
                    <div className="oh-total">
                      <span className="oh-total-label">{TEXTS.total[lang]}</span>
                      <span className="oh-total-value">{formatPrice(total)}</span>
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
      </div>
    </div>
  )
}

export default OrderHistory
