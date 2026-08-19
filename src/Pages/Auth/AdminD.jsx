import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import AddProducts from './AddProducts'
import Addjobs from './Addjobs'
import AddMember from './Addmember'
import ManageUsers from './ManageUsers'
import Addpromotion from './Addpromotion'
import AddPartner from './AddPartner'

const stats = [
  { label: { en: 'Total Products', kh: 'ផលិតផលសរុប' }, value: 24, change: '+3', up: true, icon: '📦', color: '#4caf50', bg: '#e8f5e9', link: '/admin/products' },
  { label: { en: 'Open Jobs', kh: 'ការងារកំពុងរើស' }, value: 6, change: '+1', up: true, icon: '💼', color: '#ff9800', bg: '#fff3e0', link: '/admin/jobs' },
  { label: { en: 'Team Members', kh: 'សមាជិកក្រុម' }, value: 12, change: '+2', up: true, icon: '👥', color: '#2196f3', bg: '#e3f2fd', link: '/admin/members' },
  { label: { en: 'Applications', kh: 'ពាក្យសុំការងារ' }, value: 9, change: '-2', up: false, icon: '📋', color: '#9c27b0', bg: '#f3e5f5', link: '/career' },
]

const categoryData = [
  { label: { en: 'Fruits & Veg', kh: 'បន្លែ និងផ្លែឈើ' }, value: 8, max: 10, color: '#4caf50' },
  { label: { en: 'Meat & Seafood', kh: 'សាច់ និងគ្រឿងសមុទ្រ' }, value: 4, max: 10, color: '#f44336' },
  { label: { en: 'Dairy & Eggs', kh: 'ទឹកដោះគោ និងស៊ុត' }, value: 5, max: 10, color: '#ff9800' },
  { label: { en: 'Bakery', kh: 'នំប៉័ង' }, value: 3, max: 10, color: '#795548' },
  { label: { en: 'Drinks', kh: 'ភេសជ្ជៈ' }, value: 2, max: 10, color: '#2196f3' },
  { label: { en: 'Snacks', kh: 'អាហារសម្រន់' }, value: 2, max: 10, color: '#9c27b0' },
]

const monthlyData = [
  { month: 'Jan', value: 12 }, { month: 'Feb', value: 18 }, { month: 'Mar', value: 15 },
  { month: 'Apr', value: 22 }, { month: 'May', value: 19 }, { month: 'Jun', value: 25 },
  { month: 'Jul', value: 20 }, { month: 'Aug', value: 24 },
]

const recentActivity = [
  { action: { en: 'New product added', kh: 'បានបន្ថែមផលិតផលថ្មី' }, detail: 'Canvas Backpack', time: '2 hours ago', icon: '📦', color: '#4caf50' },
  { action: { en: 'Job posted', kh: 'បានប្រកាសការងារ' }, detail: 'Senior Frontend Developer', time: '5 hours ago', icon: '💼', color: '#ff9800' },
  { action: { en: 'New application received', kh: 'បានទទួលពាក្យសុំថ្មី' }, detail: 'UI/UX Designer position', time: '1 day ago', icon: '📋', color: '#9c27b0' },
  { action: { en: 'Team member added', kh: 'បានបន្ថែមសមាជិកក្រុម' }, detail: 'Sarah Chen — Marketing', time: '2 days ago', icon: '👤', color: '#2196f3' },
  { action: { en: 'Product updated', kh: 'បានធ្វើបច្ចុប្បន្នភាពផលិតផល' }, detail: 'Organic Avocados price changed', time: '3 days ago', icon: '✏️', color: '#ff5722' },
]

const TEXTS = {
  dashboard: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
  products: { en: 'Products', kh: 'ផលិតផល' },
  jobs: { en: 'Jobs', kh: 'ការងារ' },
  members: { en: 'Members', kh: 'សមាជិក' },
  users: { en: 'Users', kh: 'អ្នកប្រើប្រាស់' },
  promotions: { en: 'Promotions', kh: 'ការផ្សព្វផ្សាយ' },
  partners: { en: 'Partners', kh: 'ដៃគូ' },
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
  recentSub: { en: 'Latest actions across the platform', kh: 'សកម្មភាពចុងក្រោយនៅលើប្រព័ន្ធ' },
}

function AdminD() {
  const { lang } = useLanguage()
  const location = useLocation()
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState({
    products: false,
    jobs: false,
    members: false,
    users: false,
    promotions: false,
    partners: false,
  })
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

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

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return lang === 'en' ? 'Just now' : 'មុននេះ'
    if (minutes < 60) return lang === 'en' ? `${minutes}m ago` : `${minutes}នាទីមុន`
    if (hours < 24) return lang === 'en' ? `${hours}h ago` : `${hours}ម៉ោងមុន`
    return lang === 'en' ? `${days}d ago` : `${days}ថ្ងៃមុន`
  }

  const renderContent = () => {
    const path = location.pathname
    if (path === '/add-products' || path.startsWith('/admin/products')) {
      return <AddProducts />
    }
    if (path === '/add-jobs' || path.startsWith('/admin/jobs')) {
      return <Addjobs />
    }
    if (path === '/add-member' || path.startsWith('/admin/members')) {
      return <AddMember />
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

    return (
      <>
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link to={stat.link} key={stat.label.en} className="group block bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.up ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
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
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div className="flex items-center gap-3" key={cat.label.en}>
                  <span className="text-xs font-semibold text-slate-400 w-28 text-right">{cat.label[lang]}</span>
                  <div className="flex-1 h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(cat.value / cat.max) * 100}%`, background: cat.color }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-6">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly overview */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-baseline justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{TEXTS.monthlyTitle[lang]}</h3>
              <span className="text-xs text-slate-400">{TEXTS.monthlySub[lang]}</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-52 pt-4">
              {monthlyData.map((m) => (
                <div className="flex flex-col items-center flex-1 h-full" key={m.month}>
                  <div className="flex-1 w-full max-w-[40px] bg-slate-700/30 rounded-t-lg flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-700 ease-out min-h-[8px]"
                      style={{ height: `${(m.value / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white mt-2">{m.value}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">{m.month}</span>
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
                <span className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-xl text-xl" style={{ background: '#e8f5e9', color: '#4caf50' }}>📦</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addProduct[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'List new grocery items in the shop' : 'បន្ថែមទំនិញថ្មីទៅក្នុងហាង'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/jobs/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-orange-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-xl text-xl" style={{ background: '#fff3e0', color: '#ff9800' }}>💼</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addJob[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Create a new career opening' : 'ប្រកាសការងារថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/members/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-xl text-xl" style={{ background: '#e3f2fd', color: '#2196f3' }}>👤</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.addMember[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Onboard a new team member' : 'បន្ថែមសមាជិកក្រុមថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/promotions/add" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-pink-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-xl text-xl" style={{ background: '#fce4ec', color: '#e91e63' }}>🏷️</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{TEXTS.promotions[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{lang === 'en' ? 'Create and edit promotional deals' : 'បង្កើត និងកែប្រែការផ្សព្វផ្សាយ'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/products" className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-500/50 hover:bg-slate-800/50 transition-all">
                <span className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-xl text-xl" style={{ background: '#eceff1', color: '#607d8b' }}>🛒</span>
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
            <div className="space-y-0">
              {recentActivity.map((item, index) => (
                <div className="flex gap-4" key={index}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className="w-9 h-9 flex items-center justify-center rounded-full text-base border-2 border-slate-700" style={{ background: item.color }}>
                      {item.icon}
                    </span>
                    {index < recentActivity.length - 1 && <div className="w-0.5 flex-1 bg-slate-700/50 my-1 rounded-full min-h-[20px]" />}
                  </div>
                  <div className={index < recentActivity.length - 1 ? 'pb-5' : ''}>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.action[lang]}: <strong className="text-white font-semibold">{item.detail}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Main' : 'មេ'}</span>
            <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/admin' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 shadow-lg shadow-green-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <span className="w-5 h-5 flex items-center justify-center"><HomeIcon /></span>
              <span>{TEXTS.dashboard[lang]}</span>
            </Link>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Management' : 'ការគ្រប់គ្រង'}</span>

            {/* Products Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/products') || location.pathname === '/add-products' ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('products')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><PackageIcon /></span>
                <span className="flex-1 text-left">{TEXTS.products[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.products ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.products && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/products/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addProduct[lang]}
                  </Link>
                  <Link to="/admin/products/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editProduct[lang]}
                  </Link>
                  <Link to="/admin/products/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deleteProduct[lang]}
                  </Link>
                  <Link to="/admin/products/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updateProduct[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Jobs Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/jobs') || location.pathname === '/add-jobs' ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('jobs')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><BriefcaseIcon /></span>
                <span className="flex-1 text-left">{TEXTS.jobs[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.jobs ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.jobs && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/jobs/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deleteJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updateJob[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Members Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/members') || location.pathname === '/add-member' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('members')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><UsersIcon /></span>
                <span className="flex-1 text-left">{TEXTS.members[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.members ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.members && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/members/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addMember[lang]}
                  </Link>
                  <Link to="/admin/members/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editMember[lang]}
                  </Link>
                  <Link to="/admin/members/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deleteMember[lang]}
                  </Link>
                  <Link to="/admin/members/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updateMember[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Users Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/users') ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('users')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><ShieldIcon /></span>
                <span className="flex-1 text-left">{TEXTS.users[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.users ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.users && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/users/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addUser[lang]}
                  </Link>
                  <Link to="/admin/users/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editUser[lang]}
                  </Link>
                  <Link to="/admin/users/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deleteUser[lang]}
                  </Link>
                  <Link to="/admin/users/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updateUser[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Promotions Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/promotions') || location.pathname === '/add-promotion' ? 'bg-gradient-to-r from-pink-500/20 to-pink-600/10 text-pink-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('promotions')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><TagIcon /></span>
                <span className="flex-1 text-left">{TEXTS.promotions[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.promotions ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.promotions && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/promotions/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addPromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editPromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deletePromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updatePromotion[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Partners Dropdown */}
            <div className="mb-1">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin/partners') || location.pathname === '/add-partner' ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                onClick={() => toggleDropdown('partners')}
              >
                <span className="w-5 h-5 flex items-center justify-center"><HandshakeIcon /></span>
                <span className="flex-1 text-left">{TEXTS.partners[lang]}</span>
                <span className={`transition-transform duration-200 ${openDropdowns.partners ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.partners && (
                <div className="mt-1 ml-8 space-y-0.5">
                  <Link to="/admin/partners/add" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">➕</span> {TEXTS.addPartner[lang]}
                  </Link>
                  <Link to="/admin/partners/edit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">✏️</span> {TEXTS.editPartner[lang]}
                  </Link>
                  <Link to="/admin/partners/delete" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🗑️</span> {TEXTS.deletePartner[lang]}
                  </Link>
                  <Link to="/admin/partners/update" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="text-sm">🔄</span> {TEXTS.updatePartner[lang]}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2">{lang === 'en' ? 'Public Pages' : 'ទំព័រសាធារណៈ'}</span>
            <Link to="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <span className="w-5 h-5 flex items-center justify-center"><ShopIcon /></span>
              <span>{TEXTS.shop[lang]}</span>
            </Link>
            <Link to="/career" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <span className="w-5 h-5 flex items-center justify-center"><GlobeIcon /></span>
              <span>{TEXTS.career[lang]}</span>
            </Link>
            <Link to="/member" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <span className="w-5 h-5 flex items-center justify-center"><TeamIcon /></span>
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

export default AdminD
