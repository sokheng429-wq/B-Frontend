import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Popular Products.css'

const PRODUCTS = [
  { id: 1, name: { en: 'Cola Classic 330ml', kh: 'កូឡាបុរាណ ៣៣០ម.ល' }, price: '$0.75', rating: 4.8, sold: '2.3k', badge: { en: 'Best Seller', kh: 'លក់ដាច់បំផុត' }, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop' },
  { id: 2, name: { en: 'Cola Zero Sugar 330ml', kh: 'កូឡាគ្មានស្ករ ៣៣០ម.ល' }, price: '$0.75', rating: 4.6, sold: '1.8k', badge: { en: 'Healthy Pick', kh: 'ជម្រើសសុខភាព' }, image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400&h=400&fit=crop' },
  { id: 3, name: { en: 'Orange Soda 330ml', kh: 'ទឹកក្រូចសូដា ៣៣០ម.ល' }, price: '$0.70', rating: 4.5, sold: '1.5k', badge: null, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&h=400&fit=crop' },
  { id: 4, name: { en: 'Lemon Lime Soda 330ml', kh: 'សូដាក្រូចឆ្មារ ៣៣០ម.ល' }, price: '$0.70', rating: 4.4, sold: '980', badge: { en: 'New', kh: 'ថ្មី' }, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop' },
  { id: 5, name: { en: 'Root Beer 330ml', kh: 'ប៊ៀរឫស ៣៣០ម.ល' }, price: '$0.80', rating: 4.3, sold: '720', badge: null, image: 'https://images.unsplash.com/photo-1615484477778-b15b08380f53?w=400&h=400&fit=crop' },
  { id: 6, name: { en: 'Ginger Ale 330ml', kh: 'ជីនជើអាល ៣៣០ម.ល' }, price: '$0.80', rating: 4.7, sold: '1.1k', badge: { en: 'Popular', kh: 'ពេញនិយម' }, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop' },
  { id: 7, name: { en: 'Grape Soda 330ml', kh: 'ទឹកទំពាំងបាយជូរសូដា ៣៣០ម.ល' }, price: '$0.70', rating: 4.2, sold: '640', badge: null, image: 'https://images.unsplash.com/photo-1638170352450-ba99a38e30bf?w=400&h=400&fit=crop' },
  { id: 8, name: { en: 'Energy Drink 250ml', kh: 'ភេសជ្ជៈថាមពល ២៥០ម.ល' }, price: '$1.20', rating: 4.9, sold: '3.1k', badge: { en: 'Best Seller', kh: 'លក់ដាច់បំផុត' }, image: 'https://images.unsplash.com/photo-1622543925233-e1bb5b3c78d1?w=400&h=400&fit=crop' },
  { id: 9, name: { en: 'Sparkling Water 500ml', kh: 'ទឹកសូដា ៥០០ម.ល' }, price: '$0.90', rating: 4.4, sold: '860', badge: null, image: 'https://images.unsplash.com/photo-1605548230624-8c9ca98f1b11?w=400&h=400&fit=crop' },
  { id: 10, name: { en: 'Iced Tea Lemon 500ml', kh: 'តែទឹកកកក្រូចឆ្មារ ៥០០ម.ល' }, price: '$1.00', rating: 4.5, sold: '1.4k', badge: { en: 'Refreshing', kh: 'ស្រស់ស្រាយ' }, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' },
  { id: 11, name: { en: 'Iced Tea Peach 500ml', kh: 'តែទឹកកកផ្កាភ្លុក ៥០០ម.ល' }, price: '$1.00', rating: 4.6, sold: '1.2k', badge: { en: 'New', kh: 'ថ្មី' }, image: 'https://images.unsplash.com/photo-1571934811356-5cc065b3d7a4?w=400&h=400&fit=crop' },
  { id: 12, name: { en: 'Mineral Water 500ml', kh: 'ទឹកសុទ្ធ ៥០០ម.ល' }, price: '$0.50', rating: 4.3, sold: '5.2k', badge: { en: 'Essential', kh: 'ចាំបាច់' }, image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=400&h=400&fit=crop' },
  { id: 13, name: { en: 'Apple Juice 1L', kh: 'ទឹកផ្លែប៉ោម ១លីត្រ' }, price: '$2.10', rating: 4.7, sold: '920', badge: null, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
  { id: 14, name: { en: 'Orange Juice 1L', kh: 'ទឹកក្រូច ១លីត្រ' }, price: '$2.10', rating: 4.8, sold: '1.6k', badge: { en: 'Fresh', kh: 'ស្រស់' }, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop' },
  { id: 15, name: { en: 'Mango Juice 1L', kh: 'ទឹកស្វាយ ១លីត្រ' }, price: '$2.30', rating: 4.9, sold: '2.0k', badge: { en: 'Premium', kh: 'ពិសេស' }, image: 'https://images.unsplash.com/photo-1601493812260-1ab4f10dfa42?w=400&h=400&fit=crop' },
  { id: 16, name: { en: 'Coconut Water 330ml', kh: 'ទឹកដូង ៣៣០ម.ល' }, price: '$1.10', rating: 4.5, sold: '1.3k', badge: null, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704d6e2?w=400&h=400&fit=crop' },
  { id: 17, name: { en: 'Cola Can 12-Pack', kh: 'កូឡាកំប៉ុង ១២កំប៉ុង' }, price: '$7.50', oldPrice: '$9.00', rating: 4.9, sold: '4.1k', badge: { en: 'Best Value', kh: 'តម្លៃពិសេស' }, image: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&h=400&fit=crop' },
  { id: 18, name: { en: 'Cola Bottle 1.5L', kh: 'កូឡាដប ១.៥លីត្រ' }, price: '$1.80', rating: 4.6, sold: '2.7k', badge: null, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&h=400&fit=crop' },
  { id: 19, name: { en: 'Soda Water 330ml', kh: 'ទឹកសូដា ៣៣០ម.ល' }, price: '$0.65', rating: 4.1, sold: '550', badge: null, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop' },
  { id: 20, name: { en: 'Sports Drink 500ml', kh: 'ភេសជ្ជៈកីឡា ៥០០ម.ល' }, price: '$1.30', rating: 4.7, sold: '2.9k', badge: { en: 'Hot Deal', kh: 'ការផ្តល់ជូនពិសេស' }, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
]

const TEXTS = {
  title: { en: 'Popular Products', kh: 'ផលិតផលពេញនិយម' },
  subtitle: { en: 'Top picks from our customers', kh: 'ជម្រើសកំពូលពីអតិថិជនរបស់យើង' },
  viewAll: { en: 'View All Products', kh: 'មើលផលិតផលទាំងអស់' },
  addToCart: { en: 'Add to Cart', kh: 'ដាក់ក្នុងកន្ត្រក' },
  sold: { en: 'sold', kh: 'បានលក់' },
  searchPlaceholder: { en: 'Search products...', kh: 'ស្វែងរកផលិតផល...' },
  filterAll: { en: 'All Products', kh: 'ផលិតផលទាំងអស់' },
  filterOnSale: { en: 'On Sale', kh: 'បញ្ចុះតម្លៃ' },
  filterBestSeller: { en: 'Best Sellers', kh: 'លក់ដាច់បំផុត' },
  filterNew: { en: 'New Arrivals', kh: 'មកដល់ថ្មី' },
  sortDefault: { en: 'Sort: Default', kh: 'តម្រៀប៖ លំនាំដើម' },
  sortPriceLow: { en: 'Price: Low to High', kh: 'តម្លៃ៖ ទាបទៅខ្ពស់' },
  sortPriceHigh: { en: 'Price: High to Low', kh: 'តម្លៃ៖ ខ្ពស់ទៅទាប' },
  sortRating: { en: 'Top Rated', kh: 'ពិន្ទុខ្ពស់' },
  noResults: { en: 'No products match your search.', kh: 'រកមិនឃើញផលិតផលដែលត្រូវគ្នា។' },
  resultsCount: { en: 'results', kh: 'ផលិតផល' },
}

const StarRating = ({ rating }) => (
  <span className="stars">
    {'★★★★★'.split('').map((star, i) => (
      <span key={i} className={i < Math.round(rating) ? 'star star-filled' : 'star star-empty'}>{star}</span>
    ))}
  </span>
)

export const PopularProducts = () => {
  const { lang } = useLanguage()
  const [hovered, setHovered] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const filtered = PRODUCTS
    .filter((p) => {
      const matchesSearch = p.name.en.toLowerCase().includes(search.toLowerCase()) ||
        p.name.kh.includes(search)
      if (filter === 'all') return matchesSearch
      if (filter === 'sale') return matchesSearch && p.oldPrice
      if (filter === 'bestseller') return matchesSearch && p.badge?.en === 'Best Seller'
      if (filter === 'new') return matchesSearch && p.badge?.en === 'New'
      return matchesSearch
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace('$', ''))
      const priceB = parseFloat(b.price.replace('$', ''))
      if (sort === 'price-low') return priceA - priceB
      if (sort === 'price-high') return priceB - priceA
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <section className="popular-products">
      <div className="popular-section-bg" />
      <div className="popular-inner">

        <div className="popular-header">
          <div>
            <span className="popular-eyebrow">{TEXTS.subtitle[lang]}</span>
            <h2 className="popular-title">{TEXTS.title[lang]}</h2>
          </div>
          <Link to="/products" className="popular-view-all">
            {TEXTS.viewAll[lang]}
            <ArrowIcon />
          </Link>
        </div>

        {/* Search & Filter bar */}
        <div className="popular-toolbar">
          <div className="popular-search-wrap">
            <span className="popular-search-icon-anim"><SearchIcon /></span>
            <input
              type="text"
              className="popular-search"
              placeholder={TEXTS.searchPlaceholder[lang]}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="popular-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                <XIcon />
              </button>
            )}
          </div>

          <div className="popular-filter-group">
            <div className="popular-filter-tabs">
              {[
                { key: 'all', icon: '⚡', label: TEXTS.filterAll[lang] },
                { key: 'sale', icon: '🔥', label: TEXTS.filterOnSale[lang] },
                { key: 'bestseller', icon: '🏆', label: TEXTS.filterBestSeller[lang] },
                { key: 'new', icon: '✨', label: TEXTS.filterNew[lang] },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`popular-filter-tab ${filter === f.key ? 'popular-filter-tab--active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  <span className="popular-filter-icon">{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Modern Dropdown Sort */}
            <div className="popular-sort-custom-wrap">
              <button
                className={`popular-sort-custom-btn ${sortDropdownOpen ? 'active' : ''}`}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <SortIcon />
                <span>
                  {sort === 'default' && TEXTS.sortDefault[lang]}
                  {sort === 'price-low' && TEXTS.sortPriceLow[lang]}
                  {sort === 'price-high' && TEXTS.sortPriceHigh[lang]}
                  {sort === 'rating' && TEXTS.sortRating[lang]}
                </span>
                <ChevronDownIcon />
              </button>

              {sortDropdownOpen && (
                <div className="popular-sort-menu">
                  {[
                    { key: 'default', label: TEXTS.sortDefault[lang] },
                    { key: 'price-low', label: TEXTS.sortPriceLow[lang] },
                    { key: 'price-high', label: TEXTS.sortPriceHigh[lang] },
                    { key: 'rating', label: TEXTS.sortRating[lang] },
                  ].map((s) => (
                    <button
                      key={s.key}
                      className={`popular-sort-menu-item ${sort === s.key ? 'selected' : ''}`}
                      onClick={() => { setSort(s.key); setSortDropdownOpen(false) }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="popular-results-count">{filtered.length} {TEXTS.resultsCount[lang]}</p>

        {filtered.length === 0 ? (
          <div className="popular-no-results">
            <span className="popular-no-results-icon">🔍</span>
            <p>{TEXTS.noResults[lang]}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to="/product-detail"
                state={{ product }}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <article
                  className={`product-card ${hovered === product.id ? 'product-card--hovered' : ''}`}
                  onMouseEnter={() => setHovered(product.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="product-image"
                      loading="lazy"
                    />
                    <div className="product-image-gradient" />
                    {product.badge && (
                      <span className="product-badge">{product.badge[lang]}</span>
                    )}
                    {product.oldPrice && (
                      <span className="product-sale-badge">SALE</span>
                    )}
                    <div className="product-quick-add">
                      <button className="product-add-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <CartIcon />
                        {TEXTS.addToCart[lang]}
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <StarRating rating={product.rating} />
                      <span className="product-sold">{product.sold} {TEXTS.sold[lang]}</span>
                    </div>
                    <h3 className="product-name">{product.name[lang]}</h3>
                    <div className="product-price-row">
                      <span className="product-price">{product.price}</span>
                      {product.oldPrice && (
                        <span className="product-old-price">{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="11" y1="5" x2="21" y2="5" />
    <line x1="11" y1="12" x2="19" y2="12" />
    <line x1="11" y1="19" x2="16" y2="19" />
    <polyline points="3 8 6 5 9 8" />
    <line x1="6" y1="5" x2="6" y2="19" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default PopularProducts