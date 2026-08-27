import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import folderIcon from '../../assets/icon/3dicons-folder-dynamic-color.png'
import bookmarkIcon from '../../assets/icon/3dicons-bookmark-fav-dynamic-color.png'
import crownIcon from '../../assets/icon/3dicons-crown-dynamic-color.png'
import cubeIcon from '../../assets/icon/3dicons-cube-dynamic-color.png'
import paletteIcon from '../../assets/icon/3dicons-color-palette-dynamic-color.png'
import moneyBagIcon from '../../assets/icon/3dicons-money-bag-dynamic-color.png'
import folderFavIcon from '../../assets/icon/3dicons-folder-fav-dynamic-color.png'
import fileNewIcon from '../../assets/icon/3dicons-file-new-dynamic-color.png'
import callOutIcon from '../../assets/icon/3dicons-call-out-dynamic-color.png'
import toolsIcon from '../../assets/icon/3dicons-tools-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import rocketIcon from '../../assets/icon/3dicons-rocket-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import chartIcon from '../../assets/icon/3dicons-chart-dynamic-color.png'
import dollarIcon from '../../assets/icon/3dicons-dollar-dynamic-color.png'
import copyIcon from '../../assets/icon/3dicons-copy-dynamic-color.png'
import calculatorIcon from '../../assets/icon/3dicons-calculator-dynamic-color.png'
import toggleIcon from '../../assets/icon/3dicons-toggle-dynamic-color.png'
import walletIcon from '../../assets/icon/3dicons-wallet-dynamic-color.png'
import hashIcon from '../../assets/icon/3dicons-hash-dynamic-color.png'
import linkIcon from '../../assets/icon/3dicons-link-dynamic-color.png'
import './ProductsHub.css'

// The eight catalog sub-sections reachable from this hub. Keys are used as this Will Show when click on Stocks
// URL segments: /admin/products/<key>.
export const PRODUCT_SECTIONS = [
  {
    key: 'manage',
    icon: bagIcon,
    en: 'Products',
    kh: 'ផលិតផល',
    descEn: 'Create, edit and delete products in the shop catalog.',
    descKh: 'បង្កើត កែប្រែ និងលុបផលិតផលក្នុងកាតាឡុកហាង។',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  {
    key: 'groups',
    icon: folderIcon,
    en: 'Product Groups',
    kh: 'ក្រុមផលិតផល',
    descEn: 'Group related products together for pricing and filtering.',
    descKh: 'បង្កុំប្រជុំផលិតផលដែលទាក់ទងគ្នា សម្រាប់តម្លៃ និងការច្រោក។',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    key: 'categories',
    icon: bookmarkIcon,
    en: 'Category',
    kh: 'ប្រភេទ',
    descEn: 'Manage the product categories shown across the shop.',
    descKh: 'គ្រប់គ្រងប្រភេទផលិតផលដែលបង្ហាញក្នុងហាងទាំងមូល។',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    key: 'brands',
    icon: crownIcon,
    en: 'Brands',
    kh: 'ម៉ាក',
    descEn: 'Register the brands carried by B\'Groceries.',
    descKh: 'ចុះឈ្មោះម៉ាកទំនិញដែល B\'Groceries លក់។',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    key: 'units',
    icon: cubeIcon,
    en: 'Unit of Measure',
    kh: 'ឯកតាវាស់',
    descEn: 'Define units such as kg, g, L, ml and piece.',
    descKh: 'កំណត់ឯកតាដូចជា គីឡូ ក្រាម លីត្រ មីលីលីត្រ និងដុំ។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    key: 'attributes',
    icon: paletteIcon,
    en: 'Attribute',
    kh: 'លក្ខណៈសម្បត្តិ',
    descEn: 'Extra specs like origin, organic label or storage temp.',
    descKh: 'ព័ត៌មានបន្ថែមដូចជា ប្រភព ស្លាកសញ្ញា ឬសីតុណ្ហភាពរក្សាទុក។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
  },
  {
    key: 'suppliers',
    icon: moneyBagIcon,
    en: 'Suppliers',
    kh: 'អ្នកផ្គត់ផ្គង់',
    descEn: 'Contact details for farms, producers and wholesalers.',
    descKh: 'ព័ត៌មានទំនាក់ទំនងរបស់កសិដ្ឋាន អ្នកផលិត និងពាណិជ្ជករធំៗ។',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
  },
  {
    key: 'supplier-groups',
    icon: folderFavIcon,
    en: 'Suppliers Group',
    kh: 'ក្រុមអ្នកផ្គត់ផ្គង់',
    descEn: 'Organize suppliers into regional or category groups.',
    descKh: 'រៀបចំអ្នកផ្គត់ផ្គង់ជាក្រុមតាមតំបន់ ឬប្រភេទ។',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
]

// Stock Operations — inventory workflows that live under the Stocks menu,
// shown BELOW Suppliers Group (after a divider).
export const STOCK_OPERATIONS = [
  {
    key: 'receive-products',
    icon: fileNewIcon,
    en: 'Receive Products',
    kh: 'ទទួលផលិតផល',
    descEn: 'Record incoming stock deliveries from suppliers.',
    descKh: 'កត់ត្រាការដឹកជញ្ជូនទំនិញចូលពីអ្នកផ្គត់ផ្គង់។',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  {
    key: 'issue-products',
    icon: callOutIcon,
    en: 'Issue Products',
    kh: 'បញ្ចេញផលិតផល',
    descEn: 'Issue stock out of the warehouse for orders or usage.',
    descKh: 'បញ្ចេញទំនិញចេញពីឃ្លាំងសម្រាប់ការបញ្ជាទិញ ឬការប្រើប្រាស់។',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
  },
  {
    key: 'adjustment-products',
    icon: toolsIcon,
    en: 'Adjustment Products',
    kh: 'កែតម្លៃផលិតផល',
    descEn: 'Correct stock counts after audits or damages.',
    descKh: 'កែសម្រួលចំនួនស្តុកបន្ទាប់ពីត្រួតពិនិត្យ ឬបាតបង់។',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
  },
  {
    key: 'request-transfer',
    icon: mailIcon,
    en: 'Request Transfer Products',
    kh: 'សំណើបញ្ជូនផលិតផល',
    descEn: 'Ask another branch or warehouse to send stock.',
    descKh: 'ស្នើសុំសាខា ឬឃ្លាំងផ្សេងទៀតឱ្យបញ្ជូនទំនិញ។',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    key: 'ship-request-transfer',
    icon: rocketIcon,
    en: 'Ship & Request Transfer Products',
    kh: 'ដឹកជញ្ជូន និងសំណើបញ្ជូនផលិតផល',
    descEn: 'Ship requested transfers and track them in transit.',
    descKh: 'ដឹកជញ្ជូនសំណើបញ្ជូន ហើយតាមដានវាពេលកំពុងផ្ញើ។',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
  {
    key: 'transfer-products',
    icon: travelIcon,
    en: 'Transfer Products',
    kh: 'បញ្ជូនផលិតផល',
    descEn: 'Move products between warehouses and stores.',
    descKh: 'ផ្លាស់ទីផលិតផលរវាងឃ្លាំង និងហាង។',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    key: 'products-quantities',
    icon: chartIcon,
    en: 'Products Quantities',
    kh: 'បរិមាណផលិតផល',
    descEn: 'See and set on-hand quantities per location.',
    descKh: 'មើល និងកំណត់ចំនួនស្តុកតាមទីតាំងនីមួយៗ។',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    key: 'products-prices',
    icon: dollarIcon,
    en: 'Products Prices',
    kh: 'តម្លៃផលិតផល',
    descEn: 'Manage cost and selling prices per product.',
    descKh: 'គ្រប់គ្រងតម្លៃចំណាយ និងតម្លៃលក់តាមផលិតផលនីមួយៗ។',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    key: 'print-label',
    icon: copyIcon,
    en: 'Print Label',
    kh: 'បោះពុម្ពស្លាក',
    descEn: 'Print barcode and price labels for shelf items.',
    descKh: 'បោះពុម្ពស្លាកបារកូដ និងតម្លៃសម្រាប់ទំនិញលើធ្នើ។',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.15)',
  },
  {
    key: 'products-scale',
    icon: calculatorIcon,
    en: 'Products Scale',
    kh: 'ទំនឹងផលិតផល',
    descEn: 'Configure scale-linked weighed goods.',
    descKh: 'កំណត់ទំនិញដែលជាប់តាមទំនឹង។',
    color: '#84cc16',
    bg: 'rgba(132, 204, 22, 0.12)',
  },
  {
    key: 'change-attribute',
    icon: toggleIcon,
    en: 'Change Attribute',
    kh: 'ផ្លាស់ប្តូរលក្ខណៈសម្បត្តិ',
    descEn: 'Bulk-edit product attribute values.',
    descKh: 'កែតម្លៃលក្ខណៈសម្បត្តិផលិតផលជាក្រុម។',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
  },
  {
    key: 'cost-change',
    icon: walletIcon,
    en: 'Cost Change',
    kh: 'ផ្លាស់ប្តូរចំណាយ',
    descEn: 'Review and apply supplier cost changes.',
    descKh: 'ពិនិត្យ និងអនុវត្តការផ្លាស់ប្តូរតម្លៃចំណាយពីអ្នកផ្គត់ផ្គង់។',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
  },
  {
    key: 'serial-information',
    icon: hashIcon,
    en: 'Serial Information',
    kh: 'ព័ត៌មានស៊េរី',
    descEn: 'Track serialized items by serial number.',
    descKh: 'តាមដានទំនិញលេខស៊េរីតាមលេខស៊េរីនីមួយៗ។',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
  },
  {
    key: 'products-supplier',
    icon: linkIcon,
    en: 'Products Supplier',
    kh: 'អ្នកផ្គត់ផ្គង់ផលិតផល',
    descEn: 'Link products to the suppliers who provide them.',
    descKh: 'ភ្ជាប់ផលិតផលទៅអ្នកផ្គត់ផ្គង់ដែលផ្ដល់វា។',
    color: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.12)',
  },
]

// Every catalog section — master data first, then stock operations.
export const ALL_CATALOG_SECTIONS = [...PRODUCT_SECTIONS, ...STOCK_OPERATIONS]

const TEXTS = {
  back: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  eyebrow: { en: 'B\'Groceries catalog manager', kh: 'អ្នកគ្រប់គ្រងកាតាឡុក' },
  heroTitle: { en: 'Products', kh: 'ផលិតផល' },
  heroSub: {
    en: 'Choose a section below to manage every part of the product catalog — from items and groupings to brands, units and suppliers.',
    kh: 'ជ្រើសរើសផ្នែកខាងក្រោម ដើម្បីគ្រប់គ្រងគ្រប់ផ្នែកនៃកាតាឡុកផលិតផល — ចាប់ពីទំនិញ ក្រុម ម៉ាក ឯកតា និងអ្នកផ្គត់ផ្គង់។',
  },
  sectionsTitle: { en: 'Catalog sections', kh: 'ផ្នែកនៃកាតាឡុក' },
  sectionsSub: { en: 'Click a section to open it', kh: 'ចុចលើផ្នែកដើម្បីបើកវា' },
  opsTitle: { en: 'Stock operations', kh: 'ប្រតិបត្តិការស្តុក' },
  opsSub: { en: 'Day-to-day inventory workflows', kh: 'ការងារគ្រប់គ្រងស្តុកប្រចាំថ្ងៃ' },
}

// One grid of section cards. Used for both groups on the hub.
const SectionGrid = ({ items, lang }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((section) => {
      const isImg = typeof section.icon === 'string' && (section.icon.includes('/') || section.icon.endsWith('.png'))
      return (
        <Link
          key={section.key}
          to={`/admin/products/${section.key}`}
          className="group flex flex-col rounded-2xl border border-slate-700/60 bg-slate-950/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-950 hover:shadow-xl"
        >
          <span
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl p-2 ring-1 ring-white/10 shadow-lg shadow-black/20"
            style={{ background: section.bg }}
          >
            {isImg ? (
              <img src={section.icon} alt="" className="h-9 w-9 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <span className="text-2xl">{section.icon}</span>
            )}
          </span>
          <h3 className="text-base font-black text-white">{lang === 'kh' ? section.kh : section.en}</h3>
          <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-400">
            {lang === 'kh' ? section.descKh : section.descEn}
          </p>
          <span
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold transition-transform group-hover:translate-x-1"
            style={{ color: section.color }}
          >
            {lang === 'en' ? 'Open' : 'បើក'} <ChevronIcon />
          </span>
        </Link>
      )
    })}
  </div>
)

export const ProductsHub = () => {
  const { lang } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-green-500/10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <div className="relative">
          <Link to="/admin" className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-green-300 transition hover:border-green-400 hover:text-green-200">
            <ChevronLeftIcon /> {TEXTS.back[lang]}
          </Link>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 p-2 ring-1 ring-green-400/30 shadow-lg shadow-green-500/20">
              <img src={bagIcon} alt="" className="h-9 w-9 object-contain drop-shadow-md" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-green-300">{TEXTS.eyebrow[lang]}</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">{TEXTS.heroTitle[lang]}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{TEXTS.heroSub[lang]}</p>
        </div>
      </section>

      {/* Master data cards */}
      <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-white">{TEXTS.sectionsTitle[lang]}</h2>
          <span className="text-xs text-slate-400">{TEXTS.sectionsSub[lang]}</span>
        </div>

        {/* All Products — overview card above the sections */}
        <Link
          to="/admin/products/all"
          className="group mb-5 flex flex-col gap-3 rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-xl sm:flex-row sm:items-center"
        >
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-2xl ring-1 ring-green-400/30">📋</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-white">{lang === 'en' ? 'All Products' : 'ផលិតផលទាំងអស់'}</h3>
            <p className="mt-0.5 text-xs leading-5 text-slate-400">
              {lang === 'en'
                ? 'See every product in one list — search, filter by category and check stock at a glance.'
                : 'មើលផលិតផលទាំងអស់ក្នុងបញ្ជីតែមួយ — ស្វែងរក ត្រងតាមប្រភេទ និងពិនិត្យស្តុកមើលម្តងចប់។'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-300 transition-transform group-hover:translate-x-1">
            {lang === 'en' ? 'Open' : 'បើក'} <ChevronIcon />
          </span>
        </Link>

        <SectionGrid items={PRODUCT_SECTIONS} lang={lang} />
      </section>

      {/* Divider line */}
      <div className="relative py-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
          {TEXTS.opsTitle[lang]}
        </span>
      </div>

      {/* Stock operations cards */}
      <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-white">{TEXTS.opsTitle[lang]}</h2>
          <span className="text-xs text-slate-400">{TEXTS.opsSub[lang]}</span>
        </div>

        <SectionGrid items={STOCK_OPERATIONS} lang={lang} />
      </section>
    </div>
  )
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default ProductsHub
