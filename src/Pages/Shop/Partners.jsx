import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Partners.css'

const PARTNERS = [
  { name: 'Mekong Farms', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, catKey: 'fresh', since: 2018, color: '#77BC1F', supplies: { en: ['Leafy greens', 'Seasonal fruit', 'Herbs'], kh: ['បន្លែស្លឹក', 'ផ្លែឈើតាមរដូវ', 'បន្លែផ្សេងៗ'] }, region: { en: 'Kandal', kh: 'កណ្តាល' } },
  { name: 'Angkor Rice Mill', category: { en: 'Grains & Rice', kh: 'គ្រាប់ធញ្ញជាតិ' }, catKey: 'pantry', since: 2015, color: '#FF9900', supplies: { en: ['Jasmine rice', 'Glutinous rice', 'Bamboo rice'], kh: ['អង្ករផ្កាម្លិះ', 'អង្ករដំណើប', 'អង្ករឫស្សី'] }, region: { en: 'Battambang', kh: 'បាត់ដំបង' } },
  { name: 'Khmer Bakehouse', category: { en: 'Bakery', kh: 'នំបុ័ង' }, catKey: 'bakery', since: 2021, color: '#8fd13a', supplies: { en: ['Sourdough', 'Baguettes', 'Croissants'], kh: ['នំសូរដូ', 'នំប៉័ងបារាំង', 'ក្រោសង់'] }, region: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' } },
  { name: 'Chaktomuk Dairy', category: { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ' }, catKey: 'dairy', since: 2019, color: '#4fc3f7', supplies: { en: ['Fresh milk', 'Greek yogurt', 'Butter'], kh: ['ទឹកដោះគោស្រស់', 'យ៉ាហួក្រិច', 'ប៊ឺ'] }, region: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' } },
  { name: 'Tonle Fresh Fish', category: { en: 'Meat & Seafood', kh: 'សាច់ ត្រី' }, catKey: 'meat', since: 2020, color: '#1976d2', supplies: { en: ['Tilapia', 'Snakehead', 'Shrimp'], kh: ['ត្រីទីឡាពី', 'ត្រីក្អែ', 'បង្គា'] }, region: { en: 'Kampong Chhnang', kh: 'កំពង់ឆ្នាំង' } },
  { name: 'Sen Sok Beverages', category: { en: 'Drinks', kh: 'ភេសជ្ជៈ' }, catKey: 'drinks', since: 2022, color: '#ff7043', supplies: { en: ['Iced tea', 'Juice', 'Sparkling water'], kh: ['តែទឹកកក', 'ទឹកផ្លែឈើ', 'ទឹកសូដា'] }, region: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' } },
  { name: 'Battambang Orchards', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, catKey: 'fresh', since: 2017, color: '#66bb6a', supplies: { en: ['Mangoes', 'Bananas', 'Oranges'], kh: ['ស្វាយ', 'ចេក', 'ក្រូច'] }, region: { en: 'Battambang', kh: 'បាត់ដំបង' } },
  { name: 'Golden Sesame Co.', category: { en: 'Pantry & Snacks', kh: 'អាហារសម្រន់' }, catKey: 'snacks', since: 2016, color: '#ffd54f', supplies: { en: ['Granola', 'Nuts', 'Honey'], kh: ['គ្រាប់ធញ្ញជាតិ', 'គ្រាប់ផ្សេងៗ', 'ទឹកឃ្មុំ'] }, region: { en: 'Kampong Speu', kh: 'កំពង់ស្ពឺ' } },
  { name: 'Kampot Pepper Co.', category: { en: 'Pantry & Snacks', kh: 'អាហារសម្រន់' }, catKey: 'pantry', since: 2014, color: '#a1887f', supplies: { en: ['Kampot pepper', 'Spices', 'Salt'], kh: ['ម្រេចកំពត', 'គ្រឿងទេស', 'អំបិល'] }, region: { en: 'Kampot', kh: 'កំពត' } },
  { name: 'Cardamom Highlands', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, catKey: 'fresh', since: 2019, color: '#26a69a', supplies: { en: ['Avocados', 'Peppers', 'Coffee'], kh: ['ផ្លែបឺរ', 'ម្ទេស', 'កាហ្វេ'] }, region: { en: 'Pursat', kh: 'ពោធិ៍សាត់' } },
  { name: 'Mondulkiri Naturals', category: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, catKey: 'fresh', since: 2020, color: '#9ccc65', supplies: { en: ['Strawberries', 'Avocados', 'Wild honey'], kh: ['ស្ត្របឺរី', 'ផ្លែបឺរ', 'ទឹកឃ្មុំព្រៃ'] }, region: { en: 'Mondulkiri', kh: 'មណ្ឌលគិរី' } },
  { name: 'Sihanouk Seafood', category: { en: 'Meat & Seafood', kh: 'សាច់ ត្រី' }, catKey: 'meat', since: 2018, color: '#039be5', supplies: { en: ['Blue crab', 'Squid', 'Snapper'], kh: ['ក្តាម', 'មឹក', 'ត្រីក្រហម'] }, region: { en: 'Preah Sihanouk', kh: 'ព្រះសីហនុ' } },
]

const FILTERS = [
  { key: 'all', icon: '🤝', en: 'All Partners', kh: 'ដៃគូទាំងអស់' },
  { key: 'fresh', icon: '🥬', en: 'Fresh', kh: 'ស្រស់' },
  { key: 'dairy', icon: '🥛', en: 'Dairy', kh: 'ទឹកដោះគោ' },
  { key: 'bakery', icon: '🥖', en: 'Bakery', kh: 'នំបុ័ង' },
  { key: 'meat', icon: '🥩', en: 'Meat & Fish', kh: 'សាច់ ត្រី' },
  { key: 'drinks', icon: '🧃', en: 'Drinks', kh: 'ភេសជ្ជៈ' },
  { key: 'pantry', icon: '🍚', en: 'Pantry', kh: 'គ្រឿងទេស' },
  { key: 'snacks', icon: '🍿', en: 'Snacks', kh: 'អាហារសម្រន់' },
]

const TEXTS = {
  eyebrow: { en: 'Trusted Network', kh: 'បណ្តាញដែលទុកចិត្ត' },
  title1: { en: 'Our Valued', kh: 'ដៃគូដ៏មានតម្លៃ' },
  title2: { en: 'Partners', kh: 'របស់យើង' },
  subtitle: {
    en: 'We work shoulder-to-shoulder with farmers, mills, and makers across Cambodia — so fresh, local quality lands on your table in 45 minutes.',
    kh: 'យើងធ្វើការយ៉ាងជិតស្និទ្ធជាមួយកសិករ រោងចក្រ និងអ្នកផលិតទូទាំងកម្ពុជា — ដើម្បីគុណភាពស្រស់ៗក្នុងស្រុកដល់តុអ្នកក្នុង ៤៥ នាទី។',
  },
  statPartners: { en: 'Local partners', kh: 'ដៃគូក្នុងស្រុក' },
  statProvinces: { en: 'Provinces served', kh: 'ខេត្តដែលបម្រើ' },
  statSince: { en: 'Since 2014', kh: 'តាំងពីឆ្នាំ ២០១៤' },
  searchPlaceholder: { en: 'Search partners…', kh: 'ស្វែងរកដៃគូ…' },
  since: { en: 'Partner since', kh: 'ដៃគូតាំងពី' },
  region: { en: 'Region', kh: 'តំបន់' },
  supplies: { en: 'Supplies', kh: 'ផ្គត់ផ្គង់' },
  results: { en: 'partners', kh: 'ដៃគូ' },
  noResults: { en: 'No partners found.', kh: 'រកមិនឃើញដៃគូ។' },
  noResultsHint: { en: 'Try a different search or category.', kh: 'សាកល្បងស្វែងរកផ្សេង ឬប្រភេទផ្សេង។' },
  featured: { en: 'Featured Partner', kh: 'ដៃគូលេចធ្លោ' },
  featuredQuote: {
    en: 'Working with B\'Groceries means our fruit goes from our orchard to a family\'s table in the same morning. That\'s a partnership we\'re proud of.',
    kh: 'ការធ្វើការជាមួយ B\'Groceries មានន័យថាផ្លែឈើរបស់យើងចេញពីចម្ការទៅតុគ្រួសារនាព្រឹកតែមួយ។ នោះជាភាពជាដៃគូដែលយើងមានមោទនភាព។',
  },
  ctaTitle: { en: 'Become a Partner', kh: 'ក្លាយជាដៃគូរបស់យើង' },
  ctaSubtitle: {
    en: 'Join our growing network of local producers and suppliers.',
    kh: 'ចូលរួមជាមួយបណ្តាញអ្នកផលិត និងអ្នកផ្គត់ផ្គង់ក្នុងស្រុកដែលកំពុងរីកចម្រើនរបស់យើង។',
  },
  ctaButton: { en: 'Contact Us', kh: 'ទំនាក់ទំនងយើង' },
}

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Partners = () => {
  const { lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = PARTNERS.filter((p) => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.en.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.catKey === filter
    return matchSearch && matchFilter
  })

  const featured = PARTNERS[0]

  return (
    <div className="partners-page">
      {/* Hero */}
      <section className="pt-hero">
        <div className="pt-hero-inner">
          <span className="pt-eyebrow">{TEXTS.eyebrow[lang]}</span>
          <h1 className="pt-title">
            {TEXTS.title1[lang]} <span className="pt-title-highlight">{TEXTS.title2[lang]}</span>
          </h1>
          <p className="pt-subtitle">{TEXTS.subtitle[lang]}</p>
          <div className="pt-stats">
            <div className="pt-stat"><strong>{PARTNERS.length}+</strong><span>{TEXTS.statPartners[lang]}</span></div>
            <div className="pt-stat"><strong>9</strong><span>{TEXTS.statProvinces[lang]}</span></div>
            <div className="pt-stat"><strong>45′</strong><span>{TEXTS.statSince[lang]}</span></div>
          </div>
        </div>
      </section>

      {/* Featured spotlight */}
      <section className="pt-featured">
        <div className="pt-featured-inner">
          <div className="pt-featured-badge" style={{ background: featured.color }}>{featured.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
          <div className="pt-featured-body">
            <span className="pt-featured-tag">{TEXTS.featured[lang]}</span>
            <h2 className="pt-featured-name">{featured.name}</h2>
            <p className="pt-featured-quote">“{TEXTS.featuredQuote[lang]}”</p>
            <div className="pt-featured-meta">
              <span><PinIcon /> {featured.region[lang]}</span>
              <span>·</span>
              <span>{TEXTS.since[lang]} {featured.since}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pt-grid-section">
        <div className="pt-grid-inner">
          <div className="pt-toolbar">
            <div className="pt-search-wrap">
              <span className="pt-search-icon"><SearchIcon /></span>
              <input
                type="search"
                className="pt-search"
                placeholder={TEXTS.searchPlaceholder[lang]}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={TEXTS.searchPlaceholder[lang]}
              />
            </div>
            <div className="pt-filters" role="group" aria-label="Partner categories">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`pt-filter ${filter === f.key ? 'pt-filter--on' : ''}`}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  <span aria-hidden="true">{f.icon}</span>
                  {f[lang]}
                </button>
              ))}
            </div>
          </div>

          <p className="pt-count">{filtered.length} {TEXTS.results[lang]}</p>

          {filtered.length === 0 ? (
            <div className="pt-empty">
              <p className="pt-empty-title">{TEXTS.noResults[lang]}</p>
              <p className="pt-empty-hint">{TEXTS.noResultsHint[lang]}</p>
            </div>
          ) : (
            <div className="pt-grid">
              {filtered.map((p) => (
                <article className="pt-card" key={p.name}>
                  <div className="pt-card-top">
                    <div className="pt-badge" style={{ background: p.color }}>{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                    <span className="pt-since">{TEXTS.since[lang]} {p.since}</span>
                  </div>
                  <h3 className="pt-name">{p.name}</h3>
                  <p className="pt-category">{p.category[lang]}</p>
                  <div className="pt-supplies">
                    {p.supplies[lang].map((s) => (
                      <span className="pt-chip" key={s}>{s}</span>
                    ))}
                  </div>
                  <p className="pt-region"><PinIcon /> {p.region[lang]}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pt-cta-section">
        <div className="pt-cta-inner">
          <div className="pt-cta">
            <div>
              <h2 className="pt-cta-title">{TEXTS.ctaTitle[lang]}</h2>
              <p className="pt-cta-subtitle">{TEXTS.ctaSubtitle[lang]}</p>
            </div>
            <Link to="/contact" className="btn-brand">{TEXTS.ctaButton[lang]}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Partners
