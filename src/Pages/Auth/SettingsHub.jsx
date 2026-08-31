import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

/* =========================================================================
   16 CLEAN LINE / OUTLINE VECTOR ICONS (Consistent 1.8px stroke width)
   ========================================================================= */

// 1. Company — Building / Headquarters icon
const CompanyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </svg>
)

// 2. Outlet — House / Shopfront icon
const OutletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

// 3. Location — Map pin / Home location icon
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// 4. User — Person / User profile icon
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// 5. Role — Org-chart / Hierarchy / Shield badge icon
const RoleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
)

// 6. Tax — "TAX" Document / Receipt icon
const TaxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h3M9.5 13v5M13 18l3-5M16 18l-3-5" />
  </svg>
)

// 7. Currency — Card with currency / Cash exchange icon
const CurrencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

// 8. Price Book — Open book with $ icon
const PriceBookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <path d="M17 8h2M17 12h2" />
  </svg>
)

// 9. Approval Type — Checklist / Verification badge icon
const ApprovalTypeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

// 10. Payment Type — Card with Clock / Refresh cycle icon
const PaymentTypeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
    <path d="M17 14h2M17 17h.01" />
  </svg>
)

// 11. Email — Envelope with gear icon
const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

// 12. Terms and Condition — Clipboard / Legal document icon
const TermsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="14" y2="15" />
  </svg>
)

// 13. System key change — Gear / Key rotate icon
const SystemKeyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="12" r="4" />
    <path d="M12 12h8v3h-2v-3" />
    <path d="M18 12v3" />
    <path d="M21 4v4h-4" />
    <path d="M3 20v-4h4" />
  </svg>
)

// 14. Bank Account — Card / Bank vault icon
const BankAccountIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
  </svg>
)

// 15. Import Beginning — Phone / Document with $ upload icon
const ImportBeginningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// 16. Preference — Gear / Cog icon
const PreferenceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

/* =========================================================================
   16 SETTINGS DATA CONFIGURATION
   ========================================================================= */
export const SETTINGS_ITEMS = [
  {
    id: 'company',
    title: { en: 'Company', kh: 'ក្រុមហ៊ុន' },
    description: { en: 'View of company information', kh: 'មើលព័ត៌មានក្រុមហ៊ុន' },
    route: '/admin/settings/company',
    Icon: CompanyIcon,
    badge: { en: 'Profile', kh: 'ទម្រង់' },
    details: {
      en: 'Manage legal company name, VAT/Tax ID, business registration, headquarters address, and company brand logo.',
      kh: 'គ្រប់គ្រងឈ្មោះផ្លូវការរបស់ក្រុមហ៊ុន លេខសម្គាល់ពន្ធដារ អាសយដ្ឋានទីស្នាក់ការកណ្តាល និងនិមិត្តសញ្ញា។',
    },
  },
  {
    id: 'outlet',
    title: { en: 'Outlet', kh: 'សាខាហាង' },
    description: { en: 'View of outlet information', kh: 'មើលព័ត៌មានសាខាហាង' },
    route: '/admin/settings/outlet',
    Icon: OutletIcon,
    badge: { en: 'Stores', kh: 'ហាង' },
    details: {
      en: 'Configure branch outlets, retail hyperstores, warehouse hubs, operating hours, and outlet contact numbers.',
      kh: 'កំណត់សាខាហាង ហាងលក់រាយ ឃ្លាំងមេ ម៉ោងបើកដំណើរការ និងលេខទំនាក់ទំនង។',
    },
  },
  {
    id: 'location',
    title: { en: 'Location', kh: 'ទីតាំងស្តុក' },
    description: { en: 'View of location information', kh: 'មើលព័ត៌មានទីតាំងស្តុក' },
    route: '/admin/settings/location',
    Icon: LocationIcon,
    badge: { en: 'Warehouse', kh: 'ឃ្លាំង' },
    details: {
      en: 'Track stock storage bins, aisles, cold rooms, main floor racks, and warehouse dispatch zones.',
      kh: 'តាមដានធ្នើរស្តុកទំនិញ ផ្លូវដើរ បន្ទប់ត្រជាក់ និងតំបន់បញ្ជូនទំនិញក្នុងឃ្លាំង។',
    },
  },
  {
    id: 'users',
    title: { en: 'User', kh: 'អ្នកប្រើប្រាស់' },
    description: { en: 'View of users information', kh: 'មើលព័ត៌មានអ្នកប្រើប្រាស់' },
    route: '/admin/settings/users',
    Icon: UserIcon,
    badge: { en: 'Security', kh: 'សុវត្ថិភាព' },
    details: {
      en: 'Manage admin, store manager, cashier, and staff login accounts, passwords, and security activity.',
      kh: 'គ្រប់គ្រងគណនីបុគ្គលិក អ្នកគ្រប់គ្រងហាង បេឡាករ និងសកម្មភាពសុវត្ថិភាព។',
    },
  },
  {
    id: 'roles',
    title: { en: 'Role', kh: 'តួនាទី & សិទ្ធិ' },
    description: { en: 'View of role information', kh: 'មើលព័ត៌មានតួនាទី និងសិទ្ធិ' },
    route: '/admin/settings/roles',
    Icon: RoleIcon,
    badge: { en: 'Access', kh: 'សិទ្ធិ' },
    details: {
      en: 'Configure role permissions, access control lists, backoffice privileges, and audit limits.',
      kh: 'កំណត់សិទ្ធិតួនាទី ការអនុញ្ញាតចូលប្រើប្រាស់ផ្នែករដ្ឋបាល និងដែនកំណត់សវនកម្ម។',
    },
  },
  {
    id: 'tax',
    title: { en: 'Tax', kh: 'ពន្ធដារ' },
    description: { en: 'View of tax information', kh: 'មើលព័ត៌មានពន្ធដារ' },
    route: '/admin/settings/tax',
    Icon: TaxIcon,
    badge: { en: 'Fiscal', kh: 'ហិរញ្ញវត្ថុ' },
    details: {
      en: 'Configure standard VAT rates (10%), zero-tax goods, export tax, and official tax invoice layouts.',
      kh: 'កំណត់អត្រាពន្ធលើតម្លៃបន្ថែម (VAT 10%) ទំនិញលើកលែងពន្ធ និងវិក្កយបត្រពន្ធផ្លូវការ។',
    },
  },
  {
    id: 'currency',
    title: { en: 'Currency', kh: 'រូបិយប័ណ្ណ' },
    description: { en: 'View of currency information', kh: 'មើលព័ត៌មានរូបិយប័ណ្ណ' },
    route: '/admin/settings/currency',
    Icon: CurrencyIcon,
    badge: { en: 'Forex', kh: 'ប្តូរប្រាក់' },
    details: {
      en: 'Set official exchange rates for USD ($) and Khmer Riel (KHR ៛), rounding rules, and POS tender rates.',
      kh: 'កំណត់អត្រាប្តូរប្រាក់ផ្លូវការសម្រាប់ដុល្លារ ($) និងរៀល (KHR ៛) ព្រមទាំងក្បួនបង្គត់។',
    },
  },
  {
    id: 'price-book',
    title: { en: 'Price Book', kh: 'សៀវភៅតម្លៃ' },
    description: { en: 'View of price book information', kh: 'មើលព័ត៌មានសៀវភៅតម្លៃ' },
    route: '/admin/settings/price-book',
    Icon: PriceBookIcon,
    badge: { en: 'Pricing', kh: 'តម្លៃ' },
    details: {
      en: 'Define multiple price tiers (Base Price, Wholesale, Member Price, VIP Tier, Outlet Special).',
      kh: 'កំណត់តារាងតម្លៃច្រើនកម្រិត (តម្លៃដើម តម្លៃបោះដុំ តម្លៃសមាជិក តម្លៃពិសេសតាមសាខា)។',
    },
  },
  {
    id: 'approval-type',
    title: { en: 'Approval Type', kh: 'ប្រភេទការអនុម័ត' },
    description: { en: 'View of approval type information', kh: 'មើលព័ត៌មានប្រភេទការអនុម័ត' },
    route: '/admin/settings/approval-type',
    Icon: ApprovalTypeIcon,
    badge: { en: 'Workflow', kh: 'លំហូរការងារ' },
    details: {
      en: 'Setup multi-stage approval workflows for Purchase Orders, Stock Adjustments, and Write-offs.',
      kh: 'រៀបចំលំហូរអនុម័តច្រើនជំហានសម្រាប់ប័ណ្ណបញ្ជាទិញ ការកែតម្រូវស្តុក និងការលុបចោលទំនិញ។',
    },
  },
  {
    id: 'payment-type',
    title: { en: 'Payment Type', kh: 'ប្រភេទការទូទាត់' },
    description: { en: 'View of payment type information', kh: 'មើលព័ត៌មានប្រភេទការទូទាត់' },
    route: '/admin/settings/payment-type',
    Icon: PaymentTypeIcon,
    badge: { en: 'Payments', kh: 'ទូទាត់' },
    details: {
      en: 'Configure supported payment methods: Cash, KHQR (Bakong), Credit Cards, Wing, and Store Credits.',
      kh: 'កំណត់មធ្យោបាយទូទាត់៖ សាច់ប្រាក់ KHQR (បាគង) កាតឥណទាន វីង និងពិន្ទុហាង។',
    },
  },
  {
    id: 'email',
    title: { en: 'Email', kh: 'សារអ៊ីមែល' },
    description: { en: 'View of email information', kh: 'មើលព័ត៌មានសារអ៊ីមែល' },
    route: '/admin/settings/email',
    Icon: EmailIcon,
    badge: { en: 'SMTP', kh: 'សំបុត្រ' },
    details: {
      en: 'Setup SMTP gateway (Gmail / Amazon SES), OTP dispatch templates, order receipts, and alert notifications.',
      kh: 'កំណត់ម៉ាស៊ីនបម្រើ SMTP គំរូសារផ្ញើកូដ OTP វិក្កយបត្របញ្ជាទិញ និងការជូនដំណឹង។',
    },
  },
  {
    id: 'terms',
    title: { en: 'Terms and Condition', kh: 'លក្ខខណ្ឌប្រើប្រាស់' },
    description: { en: 'View of terms and condition information', kh: 'មើលព័ត៌មានលក្ខខណ្ឌប្រើប្រាស់' },
    route: '/admin/settings/terms',
    Icon: TermsIcon,
    badge: { en: 'Legal', kh: 'ច្បាប់' },
    details: {
      en: 'Edit customer purchase agreement, returns & refund policy, warranty clauses, and supplier contracts.',
      kh: 'កែប្រែកិច្ចព្រមព្រៀងទិញទំនិញ គោលការណ៍ប្តូរប្រាក់សងវិញ និងកិច្ចសន្យាអ្នកផ្គត់ផ្គង់។',
    },
  },
  {
    id: 'system-key',
    title: { en: 'System key change', kh: 'ផ្លាស់ប្តូរលេខកូដប្រព័ន្ធ' },
    description: { en: 'View of system key change', kh: 'មើលការផ្លាស់ប្តូរលេខកូដប្រព័ន្ធ' },
    route: '/admin/settings/system-key',
    Icon: SystemKeyIcon,
    badge: { en: 'License', kh: 'អាជ្ញាប័ណ្ណ' },
    details: {
      en: 'Rotate backend JWT secrets, API gateway tokens, database encryption keys, and system device credentials.',
      kh: 'ផ្លាស់ប្តូរកូដសម្ងាត់ JWT កូនសោ API សម្ងាត់ទិន្នន័យ និងព័ត៌មានសម្ងាត់ឧបករណ៍។',
    },
  },
  {
    id: 'bank-account',
    title: { en: 'Bank Account', kh: 'គណនីធនាគារ' },
    description: { en: 'View of bank account card', kh: 'មើលប័ណ្ណគណនីធនាគារ' },
    route: '/admin/settings/bank-account',
    Icon: BankAccountIcon,
    badge: { en: 'Banking', kh: 'ធនាគារ' },
    details: {
      en: 'Manage company settlement accounts: ABA Bank, ACLEDA, Canadia, Wing Bank, and merchant QR IDs.',
      kh: 'គ្រប់គ្រងគណនីទទួលប្រាក់៖ ធនាគារ ABA អេស៊ីលីដា កាណាឌីយ៉ា វីង និងលេខកូដ Merchant QR។',
    },
  },
  {
    id: 'import-beginning',
    title: { en: 'Import Beginning', kh: 'នាំចូលសមតុល្យដើមគ្រា' },
    description: { en: 'View of import beginning', kh: 'មើលការនាំចូលសមតុល្យដើមគ្រា' },
    route: '/admin/settings/import-beginning',
    Icon: ImportBeginningIcon,
    badge: { en: 'Migration', kh: 'ផ្ទេរទិន្នន័យ' },
    details: {
      en: 'Bulk import opening product inventory balances, initial costs, serial numbers, and initial ledger.',
      kh: 'នាំចូលសមតុល្យទំនិញដើមគ្រា តម្លៃដើមដំបូង លេខស៊េរី និងបញ្ជីកត់ត្រាដំបូងពី Excel។',
    },
  },
  {
    id: 'preference',
    title: { en: 'Preference', kh: 'ចំណង់ចំណូលចិត្ត' },
    description: { en: 'View of preference', kh: 'មើលការកំណត់ចំណង់ចំណូលចិត្ត' },
    route: '/admin/settings/preference',
    Icon: PreferenceIcon,
    badge: { en: 'General', kh: 'ទូទៅ' },
    details: {
      en: 'Configure default system language, dark/light theme, date & time format, decimal precision, and sounds.',
      kh: 'កំណត់ភាសាលំនាំដើម រូបរាង (Dark/Light) ទម្រង់កាលបរិច្ឆេទ និងភាពជាក់លាក់នៃក្បៀស។',
    },
  },
]

/* =========================================================================
   MAIN SETTINGS HUB COMPONENT
   ========================================================================= */
export const SettingsHub = () => {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const t = (en, kh) => (lang === 'en' ? en : kh)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSetting, setSelectedSetting] = useState(null)

  // Filter settings cards by search query
  const filteredSettings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return SETTINGS_ITEMS
    return SETTINGS_ITEMS.filter((item) => {
      const titleEn = item.title.en.toLowerCase()
      const titleKh = item.title.kh.toLowerCase()
      const descEn = item.description.en.toLowerCase()
      const descKh = item.description.kh.toLowerCase()
      const id = item.id.toLowerCase()
      return (
        titleEn.includes(q) ||
        titleKh.includes(q) ||
        descEn.includes(q) ||
        descKh.includes(q) ||
        id.includes(q)
      )
    })
  }, [searchQuery])

  // Handle View Button Click
  const handleViewSetting = (item) => {
    setSelectedSetting(item)
  }

  return (
    <div className="space-y-6 font-['Montserrat'] text-slate-200">
      {/* =========================================================================
         HEADER & BREADCRUMB
         ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700/60 pb-5">
        <div>
          {/* Breadcrumb with Home Icon */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#7EB631] underline underline-offset-4 decoration-slate-600 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>{t('Home', 'ទំព័រដើម')}</span>
            </Link>
            <span className="text-slate-600">&gt;</span>
            <span className="text-[#7EB631]">{t('Settings', 'ការកំណត់')}</span>
          </nav>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Montserrat']">
              {t('Settings', 'ការកំណត់')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-['Montserrat']">
              {t('Show all of the inventory Setting', 'បង្ហាញការកំណត់ស្តុកទំនិញទាំងអស់')}
            </p>
          </div>
        </div>

        {/* Quick Search & Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search settings…', 'ស្វែងរកការកំណត់…')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#7EB631] focus:ring-1 focus:ring-[#7EB631]/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-300 shrink-0">
            <span className="text-[#7EB631]">⚙️</span>
            <span>{filteredSettings.length} {t('Items', 'ការកំណត់')}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
         4-COLUMN RESPONSIVE GRID OF SETTING CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredSettings.map((item) => {
          const { Icon } = item
          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-[8px] border border-[#E1E5EA] dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 sm:p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7EB631]/60 hover:shadow-md hover:shadow-black/10 min-h-[148px]"
            >
              {/* TOP SECTION: Title & Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#7EB631] transition-colors truncate">
                    {item.title[lang] || item.title.en}
                  </h3>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
                    {item.badge[lang] || item.badge.en}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.2rem]">
                  {item.description[lang] || item.description.en}
                </p>
              </div>

              {/* THIN DIVIDER LINE UNDER TITLE BLOCK */}
              <div className="my-3 border-b border-[#E1E5EA] dark:border-slate-800/80" />

              {/* BOTTOM SECTION: Line Icon (Left) + Dark Navy "View" Pill Button (Right) */}
              <div className="flex items-center justify-between pt-0.5">
                {/* Line Style Icon */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 dark:text-slate-300 group-hover:text-[#7EB631] transition-colors">
                  <Icon />
                </div>

                {/* Dark Navy Pill "View" Button */}
                <button
                  type="button"
                  onClick={() => handleViewSetting(item)}
                  className="inline-flex items-center justify-center rounded-full bg-[#243040] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#7EB631] hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#7EB631]/50 active:scale-95 cursor-pointer"
                  aria-label={`View ${item.title.en}`}
                >
                  <span>{t('View', 'មើល')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSettings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8">
          <span className="text-4xl mb-2">🔍</span>
          <h3 className="text-base font-bold text-white mb-1">
            {t('No Settings Found', 'រកមិនឃើញការកំណត់ទេ')}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {t('No settings match your search term. Try checking for different keywords.', 'មិនមានការកំណត់ត្រូវនឹងពាក្យស្វែងរករបស់អ្នកទេ។')}
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-green-400 hover:bg-slate-700 transition"
          >
            {t('Clear Search', 'សម្អាតការស្វែងរក')}
          </button>
        </div>
      )}

      {/* =========================================================================
         SETTING DETAIL / PREVIEW MODAL
         ========================================================================= */}
      {selectedSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#243040] text-[#7EB631] border border-slate-700">
                  <selectedSetting.Icon />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedSetting.title[lang] || selectedSetting.title.en}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSetting.description[lang] || selectedSetting.description.en}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSetting(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7EB631]">
                  {t('Configuration Overview', 'ទិដ្ឋភាពទូទៅនៃការកំណត់')}
                </span>
                <p className="text-xs leading-relaxed text-slate-300">
                  {selectedSetting.details[lang] || selectedSetting.details.en}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('Setting Route', 'ផ្លូវការកំណត់')}</span>
                  <span className="text-slate-200 font-mono text-[11px] mt-0.5 block truncate">{selectedSetting.route}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('Status', 'ស្ថានភាព')}</span>
                  <span className="text-green-400 font-semibold text-[11px] mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    {t('Active / Ready', 'សកម្ម / រួចរាល់')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSetting(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                {t('Close', 'បិទ')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSetting(null)
                  // If standard page exists, navigate there
                  if (selectedSetting.id === 'users') {
                    navigate('/manage-users')
                  } else {
                    navigate(selectedSetting.route)
                  }
                }}
                className="rounded-xl bg-gradient-to-r from-[#7EB631] to-green-600 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 transition shadow-md shadow-green-600/20"
              >
                {t('Open Configuration', 'បើកការកំណត់')} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsHub
