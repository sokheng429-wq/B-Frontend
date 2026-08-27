import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminProductAPI, applicationAPI, jobAPI, memberAPI } from '../../api/api'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import sunIcon from '../../assets/icon/3dicons-sun-dynamic-color.png'
import bagIcon from '../../assets/icon/3dicons-bag-dynamic-color.png'
import targetIcon from '../../assets/icon/3dicons-target-dynamic-color.png'
import mailIcon from '../../assets/icon/3dicons-mail-dynamic-color.png'
import trophyIcon from '../../assets/icon/3dicons-trophy-dynamic-color.png'
import shieldIcon from '../../assets/icon/3dicons-shield-dynamic-color.png'
import giftIcon from '../../assets/icon/3dicons-gift-box-dynamic-color.png'
import travelIcon from '../../assets/icon/3dicons-travel-dynamic-color.png'
import linkIcon from '../../assets/icon/3dicons-link-dynamic-color.png'
import canIcon from '../../assets/icon/3dicons-can-dynamic-color.png'
import rocketIcon from '../../assets/icon/3dicons-rocket-dynamic-color.png'
import cupIcon from '../../assets/icon/3dicons-cup-dynamic-color.png'
import boyIcon from '../../assets/icon/3dicons-boy-dynamic-color.png'
import AddProducts from './AddProducts'
import Addjobs from './Addjobs'
import AddMember from './Addmember'
import ManageUsers from './ManageUsers'
import Addpromotion from './Addpromotion'
import AddPartner from './AddPartner'
import AddDriver from './AddDriver'
import ProductsHub, { PRODUCT_SECTIONS, STOCK_OPERATIONS } from './ProductsHub'
import { StocksList } from './StocksList'
import CatalogSection from './CatalogSection'
import MasterDataSection from './MasterDataSection'
import ProductGroups from './ProductGroups'
import Categories from './Categories'
import Brands from './Brands'
import Attributes from './Attributes'
import { Units } from './Units'
import SupplierGroups from './SupplierGroups'
import { Suppliers } from './Suppliers'
import TransactionSection from './TransactionSection'
import RequestTransferSection from './RequestTransferSection'
import ShipRequestTransferSection from './ShipRequestTransferSection'
import TransferProductsSection from './TransferProductsSection'
import ProductsQuantitiesSection from './ProductsQuantitiesSection'
import PrintLabelSection from './PrintLabelSection'
import ToolsSection, { SerialInformation } from './ToolsSection'
import MemberList from './MemberList'
import MemberForm from './MemberForm'
import MemberDetailPage from './MemberDetailPage'
import Applications from './Applications'

const EMPTY_DASHBOARD_DATA = {
  products: null,
  jobs: null,
  members: null,
  applications: null,
}

const CATEGORY_META = [
  { key: 'Fruits & Vegetables', label: { en: 'Fruits & Vegetables', kh: 'ផ្លែឈើ និងបន្លែ' }, color: '#4caf50' },
  { key: 'Meat & Seafood', label: { en: 'Meat & Seafood', kh: 'សាច់ និងគ្រឿងសមុទ្រ' }, color: '#f44336' },
  { key: 'Dairy & Eggs', label: { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ និងស៊ុត' }, color: '#ff9800' },
  { key: 'Bakery & Bread', label: { en: 'Bakery & Bread', kh: 'នំប៉័ង និងនំ' }, color: '#795548' },
  { key: 'Drinks', label: { en: 'Drinks', kh: 'ភេសជ្ជៈ' }, color: '#2196f3' },
  { key: 'Snacks', label: { en: 'Snacks', kh: 'អាហារសម្រន់' }, color: '#9c27b0' },
  { key: 'Other', label: { en: 'Other', kh: 'ផ្សេងទៀត' }, color: '#64748b' },
]

const CATEGORY_FALLBACK_COLORS = ['#14b8a6', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4']
const MONTHS = [
  { en: 'Jan', kh: 'មករា' }, { en: 'Feb', kh: 'កុម្ភៈ' }, { en: 'Mar', kh: 'មីនា' },
  { en: 'Apr', kh: 'មេសា' }, { en: 'May', kh: 'ឧសភា' }, { en: 'Jun', kh: 'មិថុនា' },
  { en: 'Jul', kh: 'កក្កដា' }, { en: 'Aug', kh: 'សីហា' }, { en: 'Sep', kh: 'កញ្ញា' },
  { en: 'Oct', kh: 'តុលា' }, { en: 'Nov', kh: 'វិច្ឆិកា' }, { en: 'Dec', kh: 'ធ្នូ' },
]

const toTimestamp = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string' || !value.trim()) return null
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : null
}

const formatRelativeTime = (timestamp, lang) => {
  if (!Number.isFinite(timestamp)) return '—'

  const difference = Math.max(0, new Date().getTime() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(difference / 3600000)
  const days = Math.floor(difference / 86400000)

  if (minutes < 1) return lang === 'en' ? 'Just now' : 'មុននេះ'
  if (minutes < 60) return lang === 'en' ? `${minutes}m ago` : `${minutes}នាទីមុន`
  if (hours < 24) return lang === 'en' ? `${hours}h ago` : `${hours}ម៉ោងមុន`
  return lang === 'en' ? `${days}d ago` : `${days}ថ្ងៃមុន`
}

const normalizeCollection = (response) => (Array.isArray(response?.data) ? response.data : [])

const TEXTS = {
  dashboard: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  products: { en: 'Stocks', kh: 'ផលិតផល' },
  jobs: { en: 'Jobs', kh: 'ការងារ' },
  applications: { en: 'Applications', kh: 'ពាក្យសុំការងារ' },
  members: { en: 'Members', kh: 'សមាជិក' },
  users: { en: 'Users', kh: 'អ្នកប្រើប្រាស់' },
  promotions: { en: 'Promotions', kh: 'ការផ្សព្វផ្សាយ' },
  partners: { en: 'Partners', kh: 'ដៃគូ' },
  drivers: { en: 'Delivery Drivers', kh: 'អ្នកដឹកជញ្ជូន' },
  addProduct: { en: 'Add Product', kh: 'បន្ថែមផលិតផល' },
  editProduct: { en: 'Edit Product', kh: 'កែប្រែផលិតផល' },
  deleteProduct: { en: 'Delete Product', kh: 'លុបផលិតផល' },
  updateProduct: { en: 'Update Product', kh: 'ធ្វើបច្ចុប្បន្នភាពផលិតផល' },
  addJob: { en: 'Add Job', kh: 'បន្ថែមការងារ' },
  editJob: { en: 'Edit Job', kh: 'កែប្រែការងារ' },
  deleteJob: { en: 'Delete Job', kh: 'លុបការងារ' },
  updateJob: { en: 'Update Job', kh: 'ធ្វើបច្ចុប្បន្នភាពការងារ' },
  addMember: { en: 'Add Member', kh: 'បន្ថែមសមាជិក' },
  editMember: { en: 'Edit Member', kh: 'កែប្រែសមាជិក' },
  deleteMember: { en: 'Delete Member', kh: 'លុបសមាជិក' },
  updateMember: { en: 'Update Member', kh: 'ធ្វើបច្ចុប្បន្នភាពសមាជិក' },
  addUser: { en: 'Add User', kh: 'បន្ថែមអ្នកប្រើប្រាស់' },
  editUser: { en: 'Edit User', kh: 'កែប្រែអ្នកប្រើប្រាស់' },
  deleteUser: { en: 'Delete User', kh: 'លុបអ្នកប្រើប្រាស់' },
  updateUser: { en: 'Update User', kh: 'ធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់' },
  addPromotion: { en: 'Add Promotion', kh: 'បន្ថែមការផ្សព្វផ្សាយ' },
  editPromotion: { en: 'Edit Promotion', kh: 'កែប្រែការផ្សព្វផ្សាយ' },
  deletePromotion: { en: 'Delete Promotion', kh: 'លុបការផ្សព្វផ្សាយ' },
  updatePromotion: { en: 'Update Promotion', kh: 'ធ្វើបច្ចុប្បន្នភាពការផ្សព្វផ្សាយ' },
  addPartner: { en: 'Add Partner', kh: 'បន្ថែមដៃគូ' },
  editPartner: { en: 'Edit Partner', kh: 'កែប្រែដៃគូ' },
  deletePartner: { en: 'Delete Partner', kh: 'លុបដៃគូ' },
  updatePartner: { en: 'Update Partner', kh: 'ធ្វើបច្ចុប្បន្នភាពដៃគូ' },
  shop: { en: 'Shop', kh: 'ហាង' },
  career: { en: 'Career', kh: 'ការងារ' },
  team: { en: 'Team', kh: 'ក្រុម' },
  backToSite: { en: 'Back to Site', kh: 'ត្រឡប់ទៅគេហទំព័រ' },
  overviewTitle: { en: 'Dashboard Overview', kh: 'ទិដ្ឋភាពទូទៅនៃផ្ទាំងគ្រប់គ្រង' },
  prodCategoryTitle: { en: 'Products by Category', kh: 'ផលិតផលតាមប្រភេទ' },
  prodCategorySub: { en: 'Distribution across categories', kh: 'ការបែងចែកតាមប្រភេទនីមួយៗ' },
  monthlyTitle: { en: 'Monthly Activity', kh: 'សកម្មភាពប្រចាំខែ' },
  monthlySub: { en: 'Products added this year', kh: 'ផលិតផលដែលបានបន្ថែមក្នុងឆ្នាំនេះ' },
  quickActions: { en: 'Quick Actions', kh: 'សកម្មភាពរហ័ស' },
  quickActionsSub: { en: 'Frequently used shortcuts', kh: 'ផ្លូវកាត់ដែលប្រើប្រាស់ញឹកញាប់' },
  recentTitle: { en: 'Recent Activity', kh: 'សកម្មភាពថ្មីៗ' },
  recentSub: { en: 'Latest jobs and applications', kh: 'ការងារ និងពាក្យសុំចុងក្រោយ' },
  liveData: { en: 'Live data', kh: 'ទិន្នន័យផ្ទាល់' },
  unavailable: { en: 'Not connected', kh: 'មិនទាន់ភ្ជាប់' },
  loadingOverview: { en: 'Loading dashboard overview…', kh: 'កំពុងផ្ទុកទិដ្ឋភាពទូទៅ…' },
  overviewError: { en: 'Some live dashboard data could not be loaded.', kh: 'ទិន្នន័យផ្ទាំងគ្រប់គ្រងផ្ទាល់មួយចំនួនមិនអាចផ្ទុកបានទេ។' },
  retry: { en: 'Try again', kh: 'ព្យាយាមម្ដងទៀត' },
  productDataUnavailable: { en: 'Product data is not connected to the server yet.', kh: 'ទិន្នន័យផលិតផលមិនទាន់ត្រូវបានភ្ជាប់ទៅម៉ាស៊ីនមេនៅឡើយទេ។' },
  noProducts: { en: 'No products to display yet.', kh: 'មិនទាន់មានផលិតផលសម្រាប់បង្ហាញទេ។' },
  noActivity: { en: 'No recent jobs or applications yet.', kh: 'មិនទាន់មានការងារ ឬពាក្យសុំថ្មីៗទេ។' },
  uncategorized: { en: 'Uncategorized', kh: 'មិនមានប្រភេទ' },
  activityTitle: { en: 'Job & application activity', kh: 'សកម្មភាពការងារ និងពាក្យសុំ' },
  activitySub: { en: 'Created this year', kh: 'បានបង្កើតក្នុងឆ្នាំនេះ' },
  jobPosted: { en: 'Job posted', kh: 'បានប្រកាសការងារ' },
  applicationReceived: { en: 'New application received', kh: 'បានទទួលពាក្យសុំថ្មី' },
}

function AdminD() {
  const { lang } = useLanguage()
  const location = useLocation()
  const { user } = useAuth()
  // STORE ("Online Store") sees the products side only; ADMIN sees everything.
  const role = (user?.role || 'USER').toUpperCase()
  const isAdmin = role === 'ADMIN'
  const canStore = role === 'ADMIN' || role === 'STORE'
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState({
    products: false,
    jobs: false,
    members: false,
    users: false,
    promotions: false,
    partners: false,
    drivers: false,
  })
  const [showNotifications, setShowNotifications] = useState(false)
  const [dashboardData, setDashboardData] = useState(EMPTY_DASHBOARD_DATA)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState(false)
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0)
  const notificationRef = useRef(null)
  const isOverview = location.pathname === '/admin'

  useEffect(() => {
    if (!isOverview || !isAdmin) return undefined

    let cancelled = false
    const loadDashboard = async () => {
      setDashboardLoading(true)
      setDashboardError(false)

      const requests = [
        ['products', () => adminProductAPI.getAll()],
        ['jobs', () => jobAPI.getAll()],
        ['members', () => memberAPI.getAll()],
        ['applications', () => applicationAPI.getAll()],
      ]
      const results = await Promise.allSettled(requests.map(([, request]) => Promise.resolve().then(request)))
      if (cancelled) return

      const nextData = { ...EMPTY_DASHBOARD_DATA }
      let hasError = false
      results.forEach((result, index) => {
        const [key] = requests[index]
        if (result.status === 'fulfilled') {
          nextData[key] = normalizeCollection(result.value)
        } else {
          hasError = true
        }
      })

      setDashboardData(nextData)
      setDashboardError(hasError)
      setDashboardLoading(false)
    }

    loadDashboard()
    return () => {
      cancelled = true
    }
  }, [dashboardRefreshKey, isAdmin, isOverview])

  const stats = useMemo(() => {
    const items = [
      { label: { en: 'Total Products', kh: 'ផលិតផលសរុប' }, value: dashboardData.products?.length, icon: bagIcon, color: '#4caf50', bg: 'rgba(76, 175, 80, 0.15)', link: '/admin/products' },
    ]

    if (isAdmin) {
      items.push(
        { label: { en: 'Open Jobs', kh: 'ការងារកំពុងរើស' }, value: dashboardData.jobs?.length, icon: targetIcon, color: '#ff9800', bg: 'rgba(255, 152, 0, 0.15)', link: '/admin/jobs' },
        { label: { en: 'Team Members', kh: 'សមាជិកក្រុម' }, value: dashboardData.members?.length, icon: trophyIcon, color: '#2196f3', bg: 'rgba(33, 150, 243, 0.15)', link: '/admin/members' },
        { label: { en: 'Applications', kh: 'ពាក្យសុំការងារ' }, value: dashboardData.applications?.length, icon: mailIcon, color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.15)', link: '/admin/applications' },
      )
    }

    return items
  }, [dashboardData, isAdmin])

  const categoryData = useMemo(() => {
    const counts = new Map()
      ; (dashboardData.products || []).forEach((product) => {
        const category = String(product.category || '').trim()
        counts.set(category, (counts.get(category) || 0) + 1)
      })

    return [...counts.entries()]
      .map(([category, value], index) => {
        const knownCategory = CATEGORY_META.find((item) => item.key === category)
        return {
          label: knownCategory?.label || (category ? { en: category, kh: category } : TEXTS.uncategorized),
          value,
          color: knownCategory?.color || CATEGORY_FALLBACK_COLORS[index % CATEGORY_FALLBACK_COLORS.length],
        }
      })
      .sort((a, b) => b.value - a.value || a.label.en.localeCompare(b.label.en))
  }, [dashboardData.products])

  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const counts = Array(MONTHS.length).fill(0)

      ;[...(dashboardData.jobs || []), ...(dashboardData.applications || [])].forEach((item) => {
        const timestamp = toTimestamp(item.createdAt)
        if (!timestamp) return

        const date = new Date(timestamp)
        if (date.getFullYear() === currentYear) counts[date.getMonth()] += 1
      })

    return MONTHS.map((month, index) => ({ ...month, value: counts[index] }))
  }, [dashboardData.applications, dashboardData.jobs])

  const recentActivity = useMemo(() => [
    ...(dashboardData.jobs || []).map((job) => ({
      id: `job-${job.id || job.createdAt || job.title}`,
      type: 'job',
      detail: job.title || '—',
      timestamp: toTimestamp(job.createdAt),
      icon: '💼',
      color: '#ff9800',
    })),
    ...(dashboardData.applications || []).map((application) => ({
      id: `application-${application.id || application.createdAt || application.email}`,
      type: 'application',
      detail: application.fullName
        ? `${application.fullName} — ${application.jobTitle || '—'}`
        : application.jobTitle || application.email || '—',
      timestamp: toTimestamp(application.createdAt),
      icon: '📋',
      color: '#9c27b0',
    })),
  ]
    .filter((item) => item.timestamp !== null)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5), [dashboardData.applications, dashboardData.jobs])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const formatTime = (timestamp) => formatRelativeTime(toTimestamp(timestamp), lang)

  const maxCategoryValue = Math.max(...categoryData.map((category) => category.value), 1)
  const maxMonthlyValue = Math.max(...monthlyData.map((month) => month.value), 1)

  const renderContent = () => {
    const path = location.pathname

    // Role-based access: Jobs / Members / Users are ADMIN-only; a STORE user
    // who opens one of these URLs directly gets a restricted screen.
    const adminOnly =
      path === '/add-jobs' || path.startsWith('/admin/jobs') ||
      path === '/add-member' || path.startsWith('/admin/members') ||
      path === '/manage-users' || path.startsWith('/admin/users') ||
      path === '/admin/applications' || path.startsWith('/admin/applications')
    const storeOnly =
      path === '/add-products' || path.startsWith('/admin/products') ||
      path === '/add-promotion' || path.startsWith('/admin/promotions') ||
      path === '/add-partner' || path.startsWith('/admin/partners') ||
      path === '/add-driver' || path.startsWith('/admin/drivers')

    if ((adminOnly && !isAdmin) || (storeOnly && !canStore)) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/80 p-12 text-center">
          <span className="text-4xl">🔒</span>
          <p className="text-sm font-semibold text-slate-300">
            {lang === 'en' ? 'You do not have access to this section.' : 'អ្នកគ្មានសិទ្ធិចូលប្រើផ្នែកនេះទេ។'}
          </p>
          <Link to="/admin" className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-green-400 hover:bg-green-500/10 hover:text-green-300">
            {TEXTS.dashboard[lang]}
          </Link>
        </div>
      )
    }

    if (path === '/add-products') {
      return <AddProducts />
    }
    if (path === '/admin/products' || path === '/admin/products/') {
      return <ProductsHub />
    }
    if (path === '/admin/products/all') {
      return <StocksList />
    }
    if (path.startsWith('/admin/products')) {
      // The classic Add/Edit Products page handles the CRUD sub-actions plus
      // "manage". Master-data sections get real CRUD pages, transaction
      // sections get document posting pages; anything unknown falls back to
      // the generic catalog landing.
      const sub = path.split('/')[3] || ''
      if (['add', 'edit', 'delete', 'update', 'manage'].includes(sub)) return <AddProducts />
      if (sub === 'groups') return <ProductGroups />
      if (sub === 'categories') return <Categories />
      if (sub === 'brands') return <Brands />
      if (sub === 'attributes') return <Attributes key="attributes" />
      if (sub === 'units') return <Units />
      if (sub === 'supplier-groups') return <SupplierGroups />
      if (sub === 'suppliers') return <Suppliers />
      if (sub === 'serial-information') return <SerialInformation />
      if (sub === 'request-transfer') return <RequestTransferSection key="request-transfer" />
      if (sub === 'ship-request-transfer') return <ShipRequestTransferSection key="ship-request-transfer" />
      if (sub === 'transfer-products') return <TransferProductsSection key="transfer-products" />
      if (sub === 'products-quantities') return <ProductsQuantitiesSection key="products-quantities" />
      if (sub === 'print-label') return <PrintLabelSection key="print-label" />
      if (['groups', 'categories', 'brands', 'units', 'suppliers', 'supplier-groups'].includes(sub)) {
        return <MasterDataSection sectionKey={sub} key={sub} />
      }
      if (['receive-products', 'issue-products', 'adjustment-products'].includes(sub)) {
        return <TransactionSection sectionKey={sub} key={sub} />
      }
      if (['products-prices', 'products-scale', 'change-attribute', 'cost-change', 'products-supplier'].includes(sub)) {
        return <ToolsSection sectionKey={sub} key={sub} />
      }
      return <CatalogSection />
    }
    if (path === '/add-jobs' || path.startsWith('/admin/jobs')) {
      return <Addjobs />
    }
    if (path === '/admin/applications' || path.startsWith('/admin/applications')) {
      return <Applications />
    }
    if (path === '/add-member') {
      return <AddMember />
    }
    if (path.startsWith('/admin/members')) {
      if (path === '/admin/members') return <MemberList />
      if (path.startsWith('/admin/members/add')) return <MemberForm />
      if (path.startsWith('/admin/members/edit')) return <MemberForm />
      return <MemberDetailPage />
    }
    if (path === '/manage-users' || path.startsWith('/admin/users') || path === '/admin/manage-users') {
      return <ManageUsers />
    }
    if (path === '/add-promotion' || path.startsWith('/admin/promotions')) {
      return <Addpromotion />
    }
    if (path === '/add-partner' || path.startsWith('/admin/partners')) {
      return <AddPartner />
    }
    if (path === '/add-driver' || path.startsWith('/admin/drivers')) {
      return <AddDriver />
    }

    return (
      <>
        {(dashboardLoading || dashboardError) && (
          <div className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${dashboardError ? 'border-amber-500/40 bg-amber-500/10 text-amber-200' : 'border-green-500/30 bg-green-500/10 text-green-200'}`}>
            <span>{dashboardLoading ? TEXTS.loadingOverview[lang] : TEXTS.overviewError[lang]}</span>
            {dashboardError && (
              <button
                type="button"
                onClick={() => setDashboardRefreshKey((key) => key + 1)}
                className="rounded-lg border border-amber-400/50 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-400/15"
              >
                {TEXTS.retry[lang]}
              </button>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className={`grid grid-cols-1 gap-6 mb-8 ${isAdmin ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-1 xl:grid-cols-1'}`}>
          {stats.map((stat) => (
            <Link to={stat.link} key={stat.label.en} className="group block bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="w-13 h-13 p-2 flex items-center justify-center rounded-2xl ring-1 ring-white/10 shadow-lg shadow-black/20" style={{ background: stat.bg }}>
                  {typeof stat.icon === 'string' && (stat.icon.includes('/') || stat.icon.endsWith('.png')) ? (
                    <img src={stat.icon} alt="" className="h-8 w-8 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <span className="text-2xl">{stat.icon}</span>
                  )}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.value === null || stat.value === undefined ? 'bg-slate-700/60 text-slate-300' : 'bg-green-500/20 text-green-400'}`}>
                  {stat.value === null || stat.value === undefined ? TEXTS.unavailable[lang] : TEXTS.liveData[lang]}
                </span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stat.value ?? '—'}</p>
              <p className="text-slate-400 text-sm font-medium">{stat.label[lang]}</p>
            </Link>
          ))}
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Category chart */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-baseline justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{TEXTS.prodCategoryTitle[lang]}</h3>
              <span className="text-xs text-slate-400">{TEXTS.prodCategorySub[lang]}</span>
            </div>
            {dashboardData.products === null ? (
              <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-8 text-center text-sm text-slate-400">{TEXTS.productDataUnavailable[lang]}</p>
            ) : categoryData.length === 0 ? (
              <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-8 text-center text-sm text-slate-400">{TEXTS.noProducts[lang]}</p>
            ) : (
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div className="flex items-center gap-3" key={cat.label.en}>
                    <span className="text-xs font-semibold text-slate-400 w-28 text-right">{cat.label[lang]}</span>
                    <div className="flex-1 h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(cat.value / maxCategoryValue) * 100}%`, background: cat.color }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-6">{cat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly overview */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-baseline justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{TEXTS.activityTitle[lang]}</h3>
              <span className="text-xs text-slate-400">{TEXTS.activitySub[lang]}</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-52 pt-4">
              {monthlyData.map((month) => (
                <div className="flex flex-col items-center flex-1 h-full" key={month.en}>
                  <div className="flex-1 w-full max-w-[40px] bg-slate-700/30 rounded-t-lg flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-700 ease-out"
                      style={{ height: `${month.value === 0 ? 0 : Math.max((month.value / maxMonthlyValue) * 100, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white mt-2">{month.value}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">{month[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Quick actions */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-baseline justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{TEXTS.quickActions[lang]}</h3>
              <span className="text-xs text-slate-400">{TEXTS.quickActionsSub[lang]}</span>
            </div>
            <div className="space-y-2">
              <Link to="/admin/products/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-green-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-green-500/15 ring-1 ring-green-400/30">
                  <img src={bagIcon} alt="" className="h-7 w-7 object-contain drop-shadow" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addProduct[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'List new grocery items in the shop' : 'បន្ថែមទំនិញថ្មីទៅក្នុងហាង'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/jobs/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-orange-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-400/30">
                  <img src={targetIcon} alt="" className="h-7 w-7 object-contain drop-shadow" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addJob[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Create a new career opening' : 'ប្រកាសការងារថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/members/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/30">
                  <img src={boyIcon} alt="" className="h-7 w-7 object-contain drop-shadow" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addMember[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Onboard a new team member' : 'បន្ថែមសមាជិកក្រុមថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/promotions/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-pink-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-pink-500/15 ring-1 ring-pink-400/30">
                  <img src={giftIcon} alt="" className="h-7 w-7 object-contain drop-shadow" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.promotions[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Create and edit promotional deals' : 'បង្កើត និងកែប្រែការផ្សព្វផ្សាយ'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/products" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] p-2 flex items-center justify-center rounded-xl bg-slate-700/50 ring-1 ring-slate-500/30">
                  <img src={canIcon} alt="" className="h-7 w-7 object-contain drop-shadow" />
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{lang === 'en' ? 'View Public Shop' : 'មើលហាងទំនិញ'}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'See the storefront as customers do' : 'មើលហាងដូចអតិថិជនមើល'}</p>
                </div>
                <ChevronIcon />
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-baseline justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{TEXTS.recentTitle[lang]}</h3>
              <span className="text-xs text-slate-400">{TEXTS.recentSub[lang]}</span>
            </div>
            {recentActivity.length === 0 ? (
              <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-8 text-center text-sm text-slate-400">{TEXTS.noActivity[lang]}</p>
            ) : (
              <div className="space-y-0">
                {recentActivity.map((item, index) => (
                  <div className="flex gap-4" key={item.id}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="w-9 h-9 flex items-center justify-center rounded-full text-base border-2 border-slate-700" style={{ background: item.color }}>
                        {item.icon}
                      </span>
                      {index < recentActivity.length - 1 && <div className="w-0.5 flex-1 bg-slate-700/50 my-1 rounded-full min-h-[20px]" />}
                    </div>
                    <div className={index < recentActivity.length - 1 ? 'pb-5' : ''}>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.type === 'job' ? TEXTS.jobPosted[lang] : TEXTS.applicationReceived[lang]}: <strong className="text-white font-semibold">{item.detail}</strong>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatTime(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside className={`sticky left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 flex flex-col z-50 transition-all duration-300 overflow-y-auto ${!sidebarOpen ? 'w-0 border-0' : 'w-72'}`}>
        {/* Brand Header - Fixed */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50 flex-shrink-0">
          <span className="w-11 h-11 min-w-[44px] rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-green-500/30">
            B
          </span>
          <div>
            <h3 className="text-white font-bold text-base leading-tight">B'Groceries</h3>
            <p className="text-slate-400 text-xs mt-0.5">{lang === 'en' ? 'Admin Panel' : 'ផ្ទាំងគ្រប់គ្រង'}</p>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 hover:scrollbar-thumb-slate-600">{/* ... rest of nav content ... */}
          {/* Main Group */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Main' : 'មេ'}</span>
            <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === '/admin' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}>
              <img src={sunIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
              <span className="font-semibold">{TEXTS.dashboard[lang]}</span>
            </Link>
          </div>

          {/* Management Group */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Management Hub' : 'មជ្ឈមណ្ឌលគ្រប់គ្រង'}</span>

            {/* 1. Stocks & Inventory Hub (ADMIN + STORE) */}
            {canStore && (
              <div className="mb-2">
                <div className="flex items-stretch">
                  <Link
                    to="/admin/products"
                    className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${location.pathname.startsWith('/admin/products') || location.pathname === '/add-products' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 rounded-l-xl border-y border-l border-green-500/30 font-bold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-l-xl'}`}
                  >
                    <img src={bagIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
                    <span className="truncate">{TEXTS.products[lang]}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={lang === 'en' ? 'Toggle stocks menu' : 'បើកម៉ឺនុយស្តុក'}
                    aria-expanded={openDropdowns.products}
                    className={`flex w-9 items-center justify-center text-sm transition-all ${location.pathname.startsWith('/admin/products') || location.pathname === '/add-products' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 rounded-r-xl border-y border-r border-green-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-r-xl'}`}
                    onClick={() => toggleDropdown('products')}
                  >
                    <span className={`transition-transform duration-200 ${openDropdowns.products ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
                {openDropdowns.products && (
                  <div className="mt-1.5 ml-4 pl-3 border-l-2 border-slate-700/60 space-y-1 py-1">
                    <Link to="/admin/products/all" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">📋</span> {lang === 'en' ? 'All Products' : 'ផលិតផលទាំងអស់'}
                    </Link>
                    <Link to="/admin/products/manage" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">📦</span> {lang === 'en' ? 'Add / Edit Catalog' : 'កាតាឡុកផលិតផល'}
                    </Link>
                    {PRODUCT_SECTIONS.filter((s) => s.key !== 'manage').map((section) => {
                      const isImg = typeof section.icon === 'string' && (section.icon.includes('/') || section.icon.endsWith('.png'))
                      return (
                        <Link key={section.key} to={`/admin/products/${section.key}`} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                          {isImg ? (
                            <img src={section.icon} alt="" className="h-4 w-4 object-contain" />
                          ) : (
                            <span className="text-sm">{section.icon}</span>
                          )}
                          <span>{lang === 'kh' ? section.kh : section.en}</span>
                        </Link>
                      )
                    })}

                    <div className="my-2 border-t border-slate-700/60" role="separator" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block">{lang === 'en' ? 'Stock Operations' : 'ប្រតិបត្តិការស្តុក'}</span>
                    {STOCK_OPERATIONS.map((section) => {
                      const isImg = typeof section.icon === 'string' && (section.icon.includes('/') || section.icon.endsWith('.png'))
                      return (
                        <Link key={section.key} to={`/admin/products/${section.key}`} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                          {isImg ? (
                            <img src={section.icon} alt="" className="h-4 w-4 object-contain" />
                          ) : (
                            <span className="text-sm">{section.icon}</span>
                          )}
                          <span>{lang === 'kh' ? section.kh : section.en}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. Jobs & Careers Hub (ADMIN only) */}
            {isAdmin && (
              <div className="mb-2">
                <div className="flex items-stretch">
                  <Link
                    to="/admin/jobs"
                    className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${location.pathname.startsWith('/admin/jobs') || location.pathname === '/add-jobs' || location.pathname.startsWith('/admin/applications') ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 rounded-l-xl border-y border-l border-orange-500/30 font-bold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-l-xl'}`}
                  >
                    <img src={targetIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
                    <span className="truncate">{TEXTS.jobs[lang]}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={lang === 'en' ? 'Toggle jobs menu' : 'បើកម៉ឺនុយការងារ'}
                    aria-expanded={openDropdowns.jobs}
                    className={`flex w-9 items-center justify-center text-sm transition-all ${location.pathname.startsWith('/admin/jobs') || location.pathname === '/add-jobs' || location.pathname.startsWith('/admin/applications') ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 rounded-r-xl border-y border-r border-orange-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-r-xl'}`}
                    onClick={() => toggleDropdown('jobs')}
                  >
                    <span className={`transition-transform duration-200 ${openDropdowns.jobs ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
                {openDropdowns.jobs && (
                  <div className="mt-1.5 ml-4 pl-3 border-l-2 border-orange-500/30 space-y-1 py-1">
                    <Link to="/admin/jobs" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">💼</span> {lang === 'en' ? 'Manage Jobs' : 'គ្រប់គ្រងការងារ'}
                    </Link>
                    <Link to="/admin/jobs/add" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">➕</span> {TEXTS.addJob[lang]}
                    </Link>
                    <Link to="/admin/applications" className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-sm">📋</span> {TEXTS.applications[lang]}
                      </span>
                      {Number(dashboardData.applications?.length) > 0 && (
                        <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/40">
                          {dashboardData.applications.length}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 3. Company Side Information (ADMIN only) */}
            {isAdmin && (
              <div className="mb-2">
                <div className="flex items-stretch">
                  <Link
                    to="/admin/members"
                    className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${location.pathname.startsWith('/admin/members') || location.pathname === '/add-member' || location.pathname.startsWith('/admin/partners') || location.pathname === '/add-partner' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400 rounded-l-xl border-y border-l border-blue-500/30 font-bold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-l-xl'}`}
                  >
                    <img src={trophyIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
                    <span className="truncate">{lang === 'en' ? 'Company Info' : 'ព័ត៌មានក្រុមហ៊ុន'}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={lang === 'en' ? 'Toggle company menu' : 'បើកម៉ឺនុយក្រុមហ៊ុន'}
                    aria-expanded={openDropdowns.members}
                    className={`flex w-9 items-center justify-center text-sm transition-all ${location.pathname.startsWith('/admin/members') || location.pathname === '/add-member' || location.pathname.startsWith('/admin/partners') || location.pathname === '/add-partner' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400 rounded-r-xl border-y border-r border-blue-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-r-xl'}`}
                    onClick={() => toggleDropdown('members')}
                  >
                    <span className={`transition-transform duration-200 ${openDropdowns.members ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
                {openDropdowns.members && (
                  <div className="mt-1.5 ml-4 pl-3 border-l-2 border-blue-500/30 space-y-1 py-1">
                    <Link to="/admin/members" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">👥</span> {TEXTS.members[lang]}
                    </Link>
                    <Link to="/admin/members/add" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">➕</span> {TEXTS.addMember[lang]}
                    </Link>
                    <Link to="/admin/partners" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">🤝</span> {TEXTS.partners[lang]}
                    </Link>
                    <Link to="/admin/partners/add" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">➕</span> {TEXTS.addPartner[lang]}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 4. Shop Side & Operations (ADMIN + STORE) */}
            {canStore && (
              <div className="mb-2">
                <div className="flex items-stretch">
                  <button
                    type="button"
                    className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${location.pathname.startsWith('/admin/promotions') || location.pathname === '/add-promotion' || location.pathname.startsWith('/admin/drivers') || location.pathname === '/add-driver' ? 'bg-gradient-to-r from-pink-500/20 to-pink-600/10 text-pink-400 rounded-l-xl border-y border-l border-pink-500/30 font-bold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-l-xl'}`}
                    onClick={() => toggleDropdown('promotions')}
                  >
                    <img src={giftIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
                    <span className="truncate">{lang === 'en' ? 'Shop Side' : 'ផ្នែកហាង'}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={lang === 'en' ? 'Toggle shop operations menu' : 'បើកម៉ឺនុយហាង'}
                    aria-expanded={openDropdowns.promotions}
                    className={`flex w-9 items-center justify-center text-sm transition-all ${location.pathname.startsWith('/admin/promotions') || location.pathname === '/add-promotion' || location.pathname.startsWith('/admin/drivers') || location.pathname === '/add-driver' ? 'bg-gradient-to-r from-pink-500/20 to-pink-600/10 text-pink-400 rounded-r-xl border-y border-r border-pink-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:rounded-r-xl'}`}
                    onClick={() => toggleDropdown('promotions')}
                  >
                    <span className={`transition-transform duration-200 ${openDropdowns.promotions ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>
                </div>
                {openDropdowns.promotions && (
                  <div className="mt-1.5 ml-4 pl-3 border-l-2 border-pink-500/30 space-y-1 py-1">
                    <Link to="/admin/promotions" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">🏷️</span> {TEXTS.promotions[lang]}
                    </Link>
                    <Link to="/admin/promotions/add" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">➕</span> {TEXTS.addPromotion[lang]}
                    </Link>
                    <Link to="/admin/drivers" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">🚚</span> {TEXTS.drivers[lang]}
                    </Link>
                    <Link to="/admin/drivers/add" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      <span className="text-sm">➕</span> {lang === 'en' ? 'Add Driver' : 'បន្ថែមអ្នកដឹកជញ្ជូន'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 5. User Access & Roles (ADMIN only) */}
            {isAdmin && (
              <div className="mb-2">
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname.startsWith('/admin/users') || location.pathname === '/manage-users' ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10 font-bold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
                >
                  <img src={shieldIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
                  <span>{TEXTS.users[lang]}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Public Storefront Group */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Public Storefront' : 'ទំព័រសាធារណៈ'}</span>
            <Link to="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <img src={canIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
              <span>{TEXTS.shop[lang]}</span>
            </Link>
            <Link to="/career" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <img src={rocketIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
              <span>{TEXTS.career[lang]}</span>
            </Link>
            <Link to="/member" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <img src={cupIcon} alt="" className="w-5 h-5 object-contain drop-shadow" />
              <span>{TEXTS.team[lang]}</span>
            </Link>
          </div>
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="px-4 py-4 border-t border-slate-700/50 flex-shrink-0">
          <Link to="/" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white border border-slate-700 hover:border-green-500/50 rounded-lg hover:bg-slate-800 transition-all">
            <ArrowLeftIcon />
            <span>{TEXTS.backToSite[lang]}</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-5 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-green-400 hover:bg-green-500 hover:text-white hover:scale-105 transition-all shadow-lg hover:shadow-green-500/30"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <MenuToggleIcon />
            </button>
            <div>
              <h1 className="text-white font-bold text-2xl">{TEXTS.overviewTitle[lang]}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{new Date().toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* ENG / KH language toggle */}
            <LanguageSwitcher />

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 min-w-[20px] bg-cyan-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                    <h3 className="text-white font-bold text-sm">{lang === 'en' ? 'Notifications' : 'ការជូនដំណឹង'}</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          {lang === 'en' ? 'Mark all read' : 'គេហដំណឹងទាំងអស់'}
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); clearAll(); }}
                        className="text-xs text-slate-400 hover:text-slate-300 font-medium"
                      >
                        {lang === 'en' ? 'Clear all' : 'លុបទាំងអស់'}
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <span className="text-4xl block mb-2">🔔</span>
                        <p className="text-slate-400 text-sm">{lang === 'en' ? 'No notifications yet' : 'មិនមានការជូនដំណឹងនៅមុននេះ'}</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-700/50">
                        {notifications.map((n) => (
                          <li
                            key={n.id}
                            className={`px-4 py-3 flex gap-3 transition-colors ${!n.read ? 'bg-cyan-500/5' : 'hover:bg-slate-800/50'}`}
                            onClick={() => {
                              if (!n.read) markAsRead(n.id)
                              if (n.href) window.location.href = n.href
                              setShowNotifications(false)
                            }}
                          >
                            <span
                              className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-xl text-base flex-shrink-0"
                              style={{ background: `${n.color}20`, color: n.color }}
                            >
                              {n.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm leading-snug ${!n.read ? 'text-white font-medium' : 'text-slate-300'}`}>
                                {n.title}
                              </p>
                              {n.detail && (
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.detail}</p>
                              )}
                              <p className="text-[10px] text-slate-500 mt-1">{formatTime(n.createdAt)}</p>
                            </div>
                            {!n.read && (
                              <span className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-black text-base flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-green-500/30">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  )
}

const MenuToggleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ShopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const TeamIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const HandshakeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17a1 1 0 0 1 2 0" />
    <path d="M3 11.5V8a2 2 0 0 1 2-2h1.5L8 4h4l2 2h3.5a2 2 0 0 1 2 2v3.5" />
    <path d="M21 12.5V16a2 2 0 0 1-2 2h-1.5L16 20h-4l-2-2H8.5" />
    <path d="M3 11.5l4.5 4.5" />
    <path d="M21 12.5l-4.5 4.5" />
    <path d="M12 17l-2 2" />
    <path d="M12 17l2 2" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

export default AdminD
