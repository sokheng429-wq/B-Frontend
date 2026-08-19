import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useCart } from '../../context/CartContext'
import './Cart.css'

const TEXTS = {
  title: { en: 'Your Cart', kh: 'កន្ត្រករបស់អ្នក' },
  subtitle: { en: 'Review your items and checkout when ready.', kh: 'ពិនិត្យមើលទំនិញរបស់អ្នក និងទូទាត់នៅពេលរួចរាល់។' },
  empty: { en: 'Your cart is empty.', kh: 'កន្ត្រករបស់អ្នកទទេ។' },
  emptyHint: { en: 'Start adding fresh groceries from our selection!', kh: 'ចាប់ផ្តើមបន្ថែមគ្រឿងទេសស្រស់ៗពីការជ្រើសរើសរបស់យើង!' },
  summary: { en: 'Order Summary', kh: 'សង្ខេបការបញ្ជាទិញ' },
  subtotal: { en: 'Subtotal', kh: 'សរុប' },
  delivery: { en: 'Delivery', kh: 'ដឹកជញ្ជូន' },
  free: { en: 'Free', kh: 'ឥតគិតថ្លៃ' },
  total: { en: 'Total', kh: 'សរុបទាំងអស់' },
  checkout: { en: 'Proceed to Checkout', kh: 'បន្តទៅការទូទាត់' },
  items: { en: 'items', kh: 'ទំនិញ' },
  remove: { en: 'Remove', kh: 'លុប' },
  qty: { en: 'Qty', kh: 'ចំនួន' },
  continueShopping: { en: 'Continue Shopping', kh: 'បន្តទិញទំនិញ' },
}

export const Cart = () => {
  const { lang } = useLanguage()
  const { cartItems, updateQuantity, removeItem, totalItems, subtotal } = useCart()

  const delivery = subtotal > 15 ? 0 : 2.99
  const total = subtotal + delivery

  return (
    <div className="cart-page">
      {/* Hero */}
      <div className="cart-hero">
        <div className="cart-hero-bg" />
        <div className="cart-inner">
          <span className="cart-hero-icon">🛒</span>
          <h1 className="cart-hero-title">{TEXTS.title[lang]}</h1>
          <p className="cart-hero-sub">{TEXTS.subtitle[lang]}</p>
        </div>
      </div>

      <div className="cart-body">
        <div className="cart-inner cart-layout">
          {/* LEFT — cart items */}
          <div className="cart-main">
            {/* Cart items */}
            <div className="cart-items-section">
              <h2 className="cart-section-title">
                {TEXTS.title[lang]} {totalItems > 0 && <span className="cart-count">({totalItems} {TEXTS.items[lang]})</span>}
              </h2>

              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <span className="cart-empty-icon">🧺</span>
                  <p className="cart-empty-text">{TEXTS.empty[lang]}</p>
                  <p className="cart-empty-hint">{TEXTS.emptyHint[lang]}</p>
                  <Link to="/products" className="cart-empty-btn">
                    {TEXTS.continueShopping[lang]}
                  </Link>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-img-wrap">
                        <img src={item.image} alt={item.name[lang]} className="cart-item-img" />
                      </div>
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name[lang]}</h4>
                        <span className="cart-item-price">${item.price.toFixed(2)} / {item.unit[lang]}</span>
                        <div className="cart-item-actions">
                          <div className="cart-qty">
                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                          </div>
                          <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                            <TrashIcon /> {TEXTS.remove[lang]}
                          </button>
                        </div>
                      </div>
                      <span className="cart-item-line-total">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — order summary */}
          <aside className="cart-sidebar">
            <div className="cart-summary">
              <h3 className="cart-summary-title">{TEXTS.summary[lang]}</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>{TEXTS.subtotal[lang]}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>{TEXTS.delivery[lang]}</span>
                  <span className={delivery === 0 ? 'cart-free' : ''}>
                    {delivery === 0 ? TEXTS.free[lang] : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="cart-free-hint">
                    {lang === 'en' ? 'Free delivery on orders over $15' : 'ដឹកជញ្ជូនឥតគិតថ្លៃលើការបញ្ជាទិញលើស ១៥ ដុល្លារ'}
                  </p>
                )}
                <div className="cart-summary-row cart-summary-row--total">
                  <span>{TEXTS.total[lang]}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="cart-checkout-btn" disabled={cartItems.length === 0}>
                {TEXTS.checkout[lang]}
              </button>

              <Link to="/products" className="cart-continue-link">
                <ArrowLeft /> {TEXTS.continueShopping[lang]}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export default Cart
