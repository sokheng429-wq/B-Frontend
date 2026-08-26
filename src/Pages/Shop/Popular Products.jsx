import { useEffect, useMemo, useState } from 'react'
import { PRODUCTS, CATEGORIES } from '../../data/products'
import { adminProductAPI, adminCategoryAPI } from '../../api/api'
import { ProductShop } from '../../components/ProductShop'
import { useLanguage } from '../../context/LanguageContext'
import './Popular Products.css'

const TEXTS = {
  eyebrow: { en: 'Fresh · Fast · Local', kh: 'ស្រស់ · លឿន · ក្នុងស្រុក' },
  title1: { en: 'Popular Products', kh: 'ផលិតផលពេញនិយម' },
  title2: { en: 'Shop the store', kh: 'ទិញឥវ៉ាន់ទាំងអស់' },
  subtitle: {
    en: 'A whole market of fresh groceries, delivered to your door in 45 minutes. Shop everything the store stocks — find your favourites below.',
    kh: 'ទីផ្សារពេញលេញនៃគ្រឿងទេសស្រស់ៗ ដឹកជញ្ជូនដល់ផ្ទះក្នុង ៤៥ នាទី។ ទិញទំនិញទាំងអស់ដែលហាងមាន — ស្វែងរកអ្វីដែលអ្នកចូលចិត្តខាងក្រោម។',
  },
  statDelivery: { en: '45-min delivery', kh: 'ដឹកជញ្ជូន ៤៥ នាទី' },
  statProducts: { en: 'Fresh stock daily', kh: 'ស្តុកស្រស់រាល់ថ្ងៃ' },
  statRating: { en: '4.9★ rated', kh: 'ពិន្ទុ ៤.៩★' },
}

// Backend product.category stores the category description exactly as picked in
// Add Products (live from Stocks → Categories, or the built-in fallback list).
// The rail is built from the same master data, keyed by description.
const mapLiveCategories = (cats) =>
  cats
    .filter((c) => c.active !== false)
    .map((c) => ({
      key: String(c.description ?? c.id),
      icon: '🛍️',
      en: String(c.description ?? ''),
      kh: String(c.nameKh ?? '') || String(c.description ?? ''),
    }))
    .filter((c) => c.key)

// ProductDto (adminProductAPI) → the shop product shape ProductCard renders:
// { id, category, name:{en,kh}, price, oldPrice, unit, weight, rating, sold,
//   badge, image, origin, desc }. Rating/sold/badge aren't stored in the
// database yet, so they get stable per-id pseudo values instead of zeros.
const mapBackendProduct = (item) => {
  const id = item.id
  const nameEn = String(item.name ?? '')
  const img =
    typeof item.imageUrl === 'string' && item.imageUrl && !item.imageUrl.startsWith('blob:')
      ? item.imageUrl
      : null
  const price = Number(item.basePrice ?? 0) || 0
  return {
    id,
    // product.category is the category description string; ProductShop filters
    // the rail by this exact key.
    category: String(item.category ?? ''),
    name: { en: nameEn, kh: String(item.nameKh ?? '') || nameEn },
    price,
    oldPrice: null,
    unit: { en: item.uom || 'piece', kh: item.uom || 'ដុំ' },
    weight: '',
    rating: 4 + ((Number(id) || 0) % 10) / 10, // 4.0 – 4.9, stable per product
    sold: 100 + ((Number(id) * 137) % 2400),
    badge: item.favorite ? { en: 'Popular', kh: 'ពេញនិយម' } : null,
    image: img,
    origin: item.country ? { en: item.country, kh: item.country } : null,
    desc: {
      en: String(item.description ?? ''),
      kh: String(item.description ?? ''),
    },
  }
}

const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
)

export const PopularProducts = () => {
  const { lang } = useLanguage()
  // Live products created in the admin Stocks area; falls back to the demo
  // catalog while the backend is unreachable or still empty.
  const [shopProducts, setShopProducts] = useState(PRODUCTS)
  const [isLive, setIsLive] = useState(false)
  // Live categories from Stocks → Categories drive the rail; demo CATEGORIES
  // until the backend responds.
  const [shopCategories, setShopCategories] = useState(CATEGORIES)

  useEffect(() => {
    let cancelled = false
    adminProductAPI
      .getAll()
      .then((res) => {
        if (cancelled) return
        if (Array.isArray(res?.data) && res.data.length > 0) {
          setShopProducts(res.data.map(mapBackendProduct))
          setIsLive(true)
        }
      })
      .catch(() => {})
    adminCategoryAPI
      .getAll()
      .then((res) => {
        if (cancelled) return
        const cats = Array.isArray(res?.data) ? mapLiveCategories(res.data) : []
        // only switch when master data actually has entries
        if (cats.length > 0) setShopCategories(cats)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // When products are live but master-data categories haven't been created,
  // derive the rail from the categories actually used by the products so the
  // filters always match real data.
  const railCategories = useMemo(() => {
    if (!isLive) return CATEGORIES
    if (shopCategories !== CATEGORIES) return shopCategories
    const used = [...new Set(shopProducts.map((p) => p.category).filter(Boolean))]
    if (used.length === 0) return []
    return used.map((c) => ({ key: c, icon: '🛍️', en: c, kh: c }))
  }, [isLive, shopCategories, shopProducts])

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
            <span className="pp-stat"><span className="pp-stat-dot" /> {isLive ? `${shopProducts.length}+ ${lang === 'en' ? 'products' : 'ផលិតផល'}` : TEXTS.statProducts[lang]}</span>
            <span className="pp-stat"><span className="pp-stat-dot" /> {TEXTS.statRating[lang]}</span>
          </div>
        </div>
      </div>
      <div className="pp-inner">
        <ProductShop products={shopProducts} categories={railCategories} />
      </div>
    </section>
  )
}

export default PopularProducts
