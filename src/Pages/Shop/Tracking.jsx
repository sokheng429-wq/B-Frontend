import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { ORDERS, STEPS, STAGE_STEP, STATUS_LABEL, formatOrderDate, orderTotal } from '../../data/orders'
import { formatPrice, FALLBACK_IMG } from '../../data/products'
import './Tracking.css'

const TEXTS = {
  eyebrow: { en: 'Live · Track your delivery', kh: 'ផ្ទាល់ · តាមដានការដឹកជញ្ជូន' },
  title: { en: 'Track your delivery', kh: 'តាមដានការដឹកជញ្ជូន' },
  subtitle: {
    en: 'See exactly where your order is, in real time — from shelf to your door.',
    kh: 'មើលទីតាំងពិតប្រាកដរបស់ការបញ្ជាទិញរបស់អ្នក — ពីធ្នើរដល់មាត់ទ្វារ។',
  },
  selectOrder: { en: 'Select an order', kh: 'ជ្រើសរើសការបញ្ជាទិញ' },
  order: { en: 'Order', kh: 'ការបញ្ជាទិញ' },
  placedOn: { en: 'Placed on', kh: 'បានបញ្ជាទិញនៅថ្ងៃ' },
  courier: { en: 'Your rider', kh: 'អ្នកដឹកជញ្ជូនរបស់អ្នក' },
  vehicle: { en: 'Vehicle', kh: 'រថយន្ត' },
  contact: { en: 'Call rider', kh: 'ទាក់ទងអ្នកដឹកជញ្ជូន' },
  eta: { en: 'Estimated arrival', kh: 'ពេលមកដល់ប៉ាន់ស្មាន' },
  items: { en: 'Order items', kh: 'ទំនិញក្នុងការបញ្ជាទិញ' },
  timeline: { en: 'Delivery timeline', kh: 'ប្រវត្តិនៃការដឹកជញ្ជូន' },
  receipt: { en: 'View orders', kh: 'មើលការបញ្ជាទិញ' },
  journey: { en: 'Journey progress', kh: 'វឌ្ឍនភាពដំណើរ' },
  total: { en: 'Total', kh: 'សរុប' },
  deliveredSoon: { en: 'On the way', kh: 'កំពុងមកដល់' },
  liveTracking: { en: 'Live order location', kh: 'ទីតាំងការបញ្ជាទិញផ្ទាល់' },
  live: { en: 'Live', kh: 'ផ្ទាល់' },
  store: { en: 'B\'Groceries Store', kh: 'ហាង B\'Groceries' },
  home: { en: 'Your home', kh: 'ផ្ទះរបស់អ្នក' },
  courierIs: { en: 'Courier is', kh: 'អ្នកដឹកជញ្ជូនបាន' },
  ofWay: { en: 'of the way', kh: 'នៃផ្លូវ' },
  minLeft: { en: 'min left', kh: 'នាទីទៀត' },
  arrived: { en: 'Delivered', kh: 'បានដឹកជញ្ជូន' },
  done: { en: 'Done', kh: 'រួចរាល់' },
}

const LocationIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)
const BikeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6h2l2.5 8" />
    <path d="M8 17h4" />
    <path d="M12 17l-3-6h6" />
  </svg>
)
const BagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2h12l1.5 18.5A1.5 1.5 0 0 1 18 22H6a1.5 1.5 0 0 1-1.5-1.5L6 2Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
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
const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2h12v20l-2-1.2L14 22l-2-1.2L10 22l-2-1.2L6 22V2Z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
)

const stagePercent = (stage) => Math.round((STAGE_STEP[stage] / STEPS.length) * 100)

/* ── Live map: courier animates along a route from store to home ── */
const ROUTE = 'M 46 298 C 128 288 158 234 238 224 C 322 214 336 152 410 146 C 470 141 528 118 586 86'
const START = { x: 46, y: 298 }
const STAGE_TARGET = { processing: 0.52, transit: 0.86, delivered: 1 }

const LiveMap = ({ stage, courierName, lang }) => {
  const target = STAGE_TARGET[stage] || 0.5
  const [progress, setProgress] = useState(stage === 'delivered' ? 1 : 0)
  const [pos, setPos] = useState(START)
  const [len, setLen] = useState(0)
  const pathRef = useRef(null)

  /* Advance the courier until it reaches its stage target */
  useEffect(() => {
    let id
    const tick = () => {
      setProgress((p) => {
        if (p >= target) {
          window.clearInterval(id)
          return p
        }
        return Math.min(p + 0.0035, target)
      })
    }
    id = window.setInterval(tick, 120)
    return () => window.clearInterval(id)
  }, [target])

  /* Read the route length once mounted */
  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength())
    }
  }, [])

  /* Move the marker along the path */
  useEffect(() => {
    const el = pathRef.current
    if (el) {
      const pt = el.getPointAtLength(progress * (len || el.getTotalLength()))
      setPos({ x: pt.x, y: pt.y })
    }
  }, [progress, len])

  const pct = Math.round(progress * 100)
  const minsLeft = stage === 'delivered' ? 0 : Math.max(1, Math.ceil((target - progress) * 34))

  return (
    <div className="tr-map">
      <div className="tr-map-head">
        <div className="tr-map-title">
          <span className="tr-map-pin-dot" />
          {TEXTS.liveTracking[lang]}
        </div>
        <span className="tr-map-live"><span className="tr-map-live-dot" /> {TEXTS.live[lang]}</span>
      </div>

      <div className="tr-map-canvas">
        <svg viewBox="0 0 640 360" role="img" aria-label="Live delivery map" preserveAspectRatio="xMidYMid slice">
          {/* Base */}
          <rect width="640" height="360" fill="#18222e" />

          {/* Streets */}
          {[70, 150, 240, 320].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="640" y2={y} stroke="#243142" strokeWidth="14" />
          ))}
          {[90, 210, 340, 470, 580].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="360" stroke="#243142" strokeWidth="14" />
          ))}

          {/* City blocks */}
          {[
            [120, 18, 70, 40], [220, 18, 90, 40], [340, 18, 110, 40],
            [120, 90, 60, 44], [260, 90, 60, 44], [400, 90, 60, 44],
            [120, 180, 70, 44], [260, 180, 60, 44], [520, 180, 90, 44],
            [40, 180, 56, 44], [560, 260, 56, 60], [440, 280, 90, 56],
            [60, 260, 90, 56],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#22303f" />
          ))}

          {/* Park */}
          <rect x="330" y="180" width="70" height="44" rx="8" fill="#27422e" />

          {/* Route base */}
          <path d={ROUTE} fill="none" stroke="#3d4f63" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 12" />

          {/* Traveled trail */}
          <path
            ref={pathRef}
            d={ROUTE}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: `${progress * (len || 700)} ${len || 700}` }}
          />

          {/* Store marker */}
          <g transform={`translate(${START.x} ${START.y})`}>
            <circle r="13" fill="#FF9900" opacity="0.25" />
            <circle r="9" fill="#FF9900" />
            <text y="4" textAnchor="middle" fontSize="11" fill="#0B0F14" fontWeight="800">🏪</text>
          </g>

          {/* Home marker */}
          <g transform="translate(586 96)">
            <circle r="13" fill="var(--brand)" opacity="0.25" />
            <circle r="9" fill="var(--brand)" />
            <text y="4" textAnchor="middle" fontSize="11" fill="#0B0F14" fontWeight="800">🏠</text>
          </g>

          {/* Courier marker */}
          <g transform={`translate(${pos.x} ${pos.y})`}>
            <circle r="16" fill="var(--accent)" opacity="0.22" className="tr-map-courier-pulse" />
            <circle r="10" fill="#0B0F14" stroke="var(--accent)" strokeWidth="2.5" />
            <text y="4" textAnchor="middle" fontSize="11">🛵</text>
          </g>
        </svg>

        {/* Map legend */}
        <div className="tr-map-legend">
          <span><span className="tr-map-key" style={{ background: '#FF9900' }} /> {TEXTS.store[lang]}</span>
          <span><span className="tr-map-key" style={{ background: 'var(--brand)' }} /> {TEXTS.home[lang]}</span>
          <span><span className="tr-map-key tr-map-key--rider" /> {courierName}</span>
        </div>
      </div>

      {/* Live status bar */}
      <div className="tr-map-status">
        <div className="tr-map-status-text">
          {stage === 'delivered' ? (
            <strong>{TEXTS.arrived[lang]} ✓</strong>
          ) : (
            <>
              <strong>{TEXTS.courierIs[lang]} {pct}%</strong>
              <span className="tr-map-status-sub">{TEXTS.ofWay[lang]}</span>
            </>
          )}
        </div>
        {stage !== 'delivered' && (
          <span className="tr-map-eta"><TruckIcon /> {minsLeft} {TEXTS.minLeft[lang]}</span>
        )}
      </div>
    </div>
  )
}

/* Journey progress ring echoing the order-history cards */
const JourneyRing = ({ stage, label, percent }) => {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="tr-ring" aria-label={`${label} ${percent}%`}>
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <circle className="tr-ring-track" cx="36" cy="36" r={radius} />
        <circle
          className={`tr-ring-fill tr-ring-fill--${stage}`}
          cx="36"
          cy="36"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="tr-ring-pct">{percent}%</span>
    </div>
  )
}

export const Tracking = () => {
  const { lang } = useLanguage()
  const location = useLocation()
  const requested = location.state?.orderId

  const [selectedId, setSelectedId] = useState(requested || ORDERS[0].id)
  const order = ORDERS.find((o) => o.id === selectedId) || ORDERS[0]

  const currentStep = useMemo(() => STAGE_STEP[order.stage], [order.stage])
  const total = orderTotal(order) + order.delivery.fee
  const percent = stagePercent(order.stage)

  const changeOrder = (id) => setSelectedId(id)

  return (
    <div className="tr-page">
      {/* Hero */}
      <section className="tr-hero">
        <div className="tr-hero-inner">
          <div className="tr-copy">
            <span className="tr-eyebrow"><LocationIcon /> {TEXTS.eyebrow[lang]}</span>
            <h1 className="tr-title">{TEXTS.title[lang]}</h1>
            <p className="tr-subtitle">{TEXTS.subtitle[lang]}</p>
          </div>
          <div className="tr-hero-ticket" aria-label={TEXTS.journey[lang]}>
            <span className="tr-ticket-label">{TEXTS.journey[lang]}</span>
            <JourneyRing stage={order.stage} label={TEXTS.journey[lang]} percent={percent} />
          </div>
        </div>
      </section>

      <div className="tr-inner">
        {/* Order picker */}
        <div className="tr-picker">
          <label className="tr-picker-label" htmlFor="tr-order-select">{TEXTS.selectOrder[lang]}</label>
          <div className="tr-picker-chips" role="tablist">
            {ORDERS.map((o) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={o.id === order.id}
                className={`tr-chip ${o.id === order.id ? 'tr-chip--on' : ''}`}
                onClick={() => changeOrder(o.id)}
              >
                <span className="tr-chip-id">#{o.id}</span>
                <span className="tr-chip-date">{formatOrderDate(o.date, lang)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live map */}
        <LiveMap key={order.id} stage={order.stage} courierName={order.courier.name} lang={lang} />

        <div className="tr-layout">
          {/* Left: progress */}
          <div className="tr-main">
            <div className="tr-order-head">
              <div>
                <span className="tr-order-id">{TEXTS.order[lang]} #{order.id}</span>
                <span className="tr-order-date">{TEXTS.placedOn[lang]} {formatOrderDate(order.date, lang)}</span>
              </div>
              <span className={`tr-banner tr-banner--${order.stage}`}>
                <span className="tr-banner-dot" />
                {order.stage === 'delivered' ? STATUS_LABEL[order.stage][lang] : TEXTS.deliveredSoon[lang]}
              </span>
            </div>

            {/* Stepper */}
            <div className="tr-steps" role="list">
              {STEPS.map((step, i) => {
                const done = i < currentStep
                const active = i === currentStep - 1
                const last = i === STEPS.length - 1
                return (
                  <div
                    className={`tr-step ${done ? 'tr-step--done' : ''} ${active ? 'tr-step--active' : ''}`}
                    key={step.key}
                    role="listitem"
                  >
                    <div className="tr-step-node-wrap">
                      {!last && <div className={`tr-step-line ${done ? 'tr-step-line--done' : ''}`} />}
                      <div className="tr-step-node">
                        {done ? '✓' : <span aria-hidden="true">{step.icon}</span>}
                      </div>
                    </div>
                    <div className="tr-step-body">
                      <span className="tr-step-label">{step.label[lang]}</span>
                      <span className="tr-step-sub">
                        {active && !done && order.stage !== 'delivered' ? order.eta[lang] : ''}
                        {done && !active ? (lang === 'en' ? TEXTS.done.en : TEXTS.done.kh) : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Timeline */}
            <div className="tr-timeline">
              <h2 className="tr-section-title">{TEXTS.timeline[lang]}</h2>
              {order.timeline.map((entry, i) => (
                <div className="tr-timeline-item" key={i}>
                  <span className="tr-timeline-dot" />
                  <span className="tr-timeline-time">{entry.time}</span>
                  <span className="tr-timeline-label">{entry.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: courier + items */}
          <div className="tr-side">
            <div className="tr-card tr-courier">
              <h2 className="tr-card-title">{TEXTS.courier[lang]}</h2>
              <div className="tr-courier-row">
                <div className="tr-courier-avatar">{order.courier.name.charAt(0)}</div>
                <div className="tr-courier-info">
                  <p className="tr-courier-name">{order.courier.name}</p>
                  <p className="tr-courier-vehicle"><BikeIcon /> {order.courier.vehicle}</p>
                </div>
              </div>
              <a href={`tel:${order.courier.phone.replace(/\s/g, '')}`} className="tr-courier-call">
                <PhoneIcon /> {TEXTS.contact[lang]}
              </a>
            </div>

            <div className="tr-card tr-items">
              <h2 className="tr-card-title">{TEXTS.items[lang]}</h2>
              <div className="tr-items-list">
                {order.items.map((it) => (
                  <div className="tr-item" key={it.product.id}>
                    <div className="tr-item-thumb">
                      <img
                        src={it.product.image}
                        alt={it.product.name[lang]}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG }}
                      />
                    </div>
                    <div className="tr-item-info">
                      <p className="tr-item-name">{it.product.name[lang]}</p>
                      <p className="tr-item-meta">×{it.qty}</p>
                    </div>
                    <span className="tr-item-price">{formatPrice(it.product.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="tr-items-total">
                <span>{TEXTS.total[lang]}</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <div className="tr-card tr-eta">
              <span className="tr-eta-icon"><BagIcon /></span>
              <div>
                <p className="tr-eta-label">{TEXTS.eta[lang]}</p>
                <p className="tr-eta-value">{order.eta[lang]}</p>
              </div>
              <Link to="/orders" className="tr-eta-link" aria-label={TEXTS.receipt[lang]}>
                <ReceiptIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tracking