import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import AddProducts from './AddProducts'
import Addjobs from './Addjobs'
import AddMember from './Addmember'
import ManageUsers from './ManageUsers'
import Addpromotion from './Addpromotion'
import './AdminD.css'

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openDropdowns, setOpenDropdowns] = useState({
    products: false,
    jobs: false,
    members: false,
    users: false,
    promotions: false,
  })

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
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

    return (
      <>
        {/* Stats row */}
        <div className="admind-stats-grid">
          {stats.map((stat) => (
            <Link to={stat.link} className="admind-stat-card" key={stat.label.en}>
              <div className="admind-stat-top">
                <span className="admind-stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</span>
                <span className={`admind-stat-change ${stat.up ? 'admind-stat-change--up' : 'admind-stat-change--down'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="admind-stat-value">{stat.value}</p>
              <p className="admind-stat-label">{stat.label[lang]}</p>
            </Link>
          ))}
        </div>

        {/* Analytics row */}
        <div className="admind-analytics-grid">
          {/* Category chart */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">{TEXTS.prodCategoryTitle[lang]}</h3>
              <span className="admind-panel-subtitle">{TEXTS.prodCategorySub[lang]}</span>
            </div>
            <div className="admind-bar-chart">
              {categoryData.map((cat) => (
                <div className="admind-bar-row" key={cat.label.en}>
                  <span className="admind-bar-label">{cat.label[lang]}</span>
                  <div className="admind-bar-track">
                    <div
                      className="admind-bar-fill"
                      style={{ width: `${(cat.value / cat.max) * 100}%`, background: cat.color }}
                    />
                  </div>
                  <span className="admind-bar-value">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly overview */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">{TEXTS.monthlyTitle[lang]}</h3>
              <span className="admind-panel-subtitle">{TEXTS.monthlySub[lang]}</span>
            </div>
            <div className="admind-column-chart">
              {monthlyData.map((m) => (
                <div className="admind-col-group" key={m.month}>
                  <div className="admind-col-track">
                    <div
                      className="admind-col-fill"
                      style={{ height: `${(m.value / 30) * 100}%` }}
                    />
                  </div>
                  <span className="admind-col-value">{m.value}</span>
                  <span className="admind-col-label">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="admind-bottom-grid">
          {/* Quick actions */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">{TEXTS.quickActions[lang]}</h3>
              <span className="admind-panel-subtitle">{TEXTS.quickActionsSub[lang]}</span>
            </div>
            <div className="admind-action-list">
              <Link to="/admin/products/add" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#4caf50' }}>📦</span>
                <div>
                  <h4>{TEXTS.addProduct[lang]}</h4>
                  <p>{lang === 'en' ? 'List new grocery items in the shop' : 'បន្ថែមទំនិញថ្មីទៅក្នុងហាង'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/jobs/add" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#ff9800' }}>💼</span>
                <div>
                  <h4>{TEXTS.addJob[lang]}</h4>
                  <p>{lang === 'en' ? 'Create a new career opening' : 'ប្រកាសការងារថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/members/add" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#2196f3' }}>👤</span>
                <div>
                  <h4>{TEXTS.addMember[lang]}</h4>
                  <p>{lang === 'en' ? 'Onboard a new team member' : 'បន្ថែមសមាជិកក្រុមថ្មី'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/admin/promotions/add" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#e91e63' }}>🏷️</span>
                <div>
                  <h4>{TEXTS.promotions[lang]}</h4>
                  <p>{lang === 'en' ? 'Create and edit promotional deals' : 'បង្កើត និងកែប្រែការផ្សព្វផ្សាយ'}</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/products" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#607d8b' }}>🛒</span>
                <div>
                  <h4>{lang === 'en' ? 'View Public Shop' : 'មើលហាងទំនិញ'}</h4>
                  <p>{lang === 'en' ? 'See the storefront as customers do' : 'មើលហាងដូចអតិថិជនមើល'}</p>
                </div>
                <ChevronIcon />
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">{TEXTS.recentTitle[lang]}</h3>
              <span className="admind-panel-subtitle">{TEXTS.recentSub[lang]}</span>
            </div>
            <div className="admind-timeline">
              {recentActivity.map((item, index) => (
                <div className="admind-timeline-item" key={index}>
                  <div className="admind-timeline-line">
                    <span className="admind-timeline-dot" style={{ background: item.color }}>
                      {item.icon}
                    </span>
                    {index < recentActivity.length - 1 && <div className="admind-timeline-track" />}
                  </div>
                  <div className="admind-timeline-body">
                    <p className="admind-timeline-action">
                      {item.action[lang]}: <strong>{item.detail}</strong>
                    </p>
                    <p className="admind-timeline-time">{item.time}</p>
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
    <div className={`admind-page ${!sidebarOpen ? 'admind-page--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admind-sidebar ${!sidebarOpen ? 'admind-sidebar--collapsed' : ''}`}>
        <div className="admind-sidebar-brand">
          <span className="admind-sidebar-logo">G</span>
          <div>
            <h3 className="admind-sidebar-name">Groceries</h3>
            <p className="admind-sidebar-role">{lang === 'en' ? 'Admin Panel' : 'ផ្ទាំងគ្រប់គ្រង'}</p>
          </div>
        </div>

        <nav className="admind-sidebar-nav">
          <div className="admind-nav-section">
            <span className="admind-nav-section-label">{lang === 'en' ? 'Main' : 'មេ'}</span>
            <Link to="/admin" className={`admind-nav-item ${location.pathname === '/admin' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><HomeIcon /></span>
              <span className="admind-nav-label">{TEXTS.dashboard[lang]}</span>
            </Link>
          </div>

          <div className="admind-nav-section">
            <span className="admind-nav-section-label">{lang === 'en' ? 'Management' : 'ការគ្រប់គ្រង'}</span>

            {/* Products Dropdown */}
            <div className="admind-nav-group">
              <button
                type="button"
                className={`admind-nav-item admind-nav-dropdown-btn ${location.pathname.startsWith('/admin/products') || location.pathname === '/add-products' ? 'admind-nav-item--active' : ''}`}
                onClick={() => toggleDropdown('products')}
              >
                <span className="admind-nav-icon"><PackageIcon /></span>
                <span className="admind-nav-label">{TEXTS.products[lang]}</span>
                <span className={`admind-dropdown-arrow ${openDropdowns.products ? 'admind-dropdown-arrow--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.products && (
                <div className="admind-dropdown-menu">
                  <Link to="/admin/products/add" className="admind-dropdown-item">
                    <span className="admind-subicon">➕</span> {TEXTS.addProduct[lang]}
                  </Link>
                  <Link to="/admin/products/edit" className="admind-dropdown-item">
                    <span className="admind-subicon">✏️</span> {TEXTS.editProduct[lang]}
                  </Link>
                  <Link to="/admin/products/delete" className="admind-dropdown-item">
                    <span className="admind-subicon">🗑️</span> {TEXTS.deleteProduct[lang]}
                  </Link>
                  <Link to="/admin/products/update" className="admind-dropdown-item">
                    <span className="admind-subicon">🔄</span> {TEXTS.updateProduct[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Jobs Dropdown */}
            <div className="admind-nav-group">
              <button
                type="button"
                className={`admind-nav-item admind-nav-dropdown-btn ${location.pathname.startsWith('/admin/jobs') || location.pathname === '/add-jobs' ? 'admind-nav-item--active' : ''}`}
                onClick={() => toggleDropdown('jobs')}
              >
                <span className="admind-nav-icon"><BriefcaseIcon /></span>
                <span className="admind-nav-label">{TEXTS.jobs[lang]}</span>
                <span className={`admind-dropdown-arrow ${openDropdowns.jobs ? 'admind-dropdown-arrow--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.jobs && (
                <div className="admind-dropdown-menu">
                  <Link to="/admin/jobs/add" className="admind-dropdown-item">
                    <span className="admind-subicon">➕</span> {TEXTS.addJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/edit" className="admind-dropdown-item">
                    <span className="admind-subicon">✏️</span> {TEXTS.editJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/delete" className="admind-dropdown-item">
                    <span className="admind-subicon">🗑️</span> {TEXTS.deleteJob[lang]}
                  </Link>
                  <Link to="/admin/jobs/update" className="admind-dropdown-item">
                    <span className="admind-subicon">🔄</span> {TEXTS.updateJob[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Members Dropdown */}
            <div className="admind-nav-group">
              <button
                type="button"
                className={`admind-nav-item admind-nav-dropdown-btn ${location.pathname.startsWith('/admin/members') || location.pathname === '/add-member' ? 'admind-nav-item--active' : ''}`}
                onClick={() => toggleDropdown('members')}
              >
                <span className="admind-nav-icon"><UsersIcon /></span>
                <span className="admind-nav-label">{TEXTS.members[lang]}</span>
                <span className={`admind-dropdown-arrow ${openDropdowns.members ? 'admind-dropdown-arrow--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.members && (
                <div className="admind-dropdown-menu">
                  <Link to="/admin/members/add" className="admind-dropdown-item">
                    <span className="admind-subicon">➕</span> {TEXTS.addMember[lang]}
                  </Link>
                  <Link to="/admin/members/edit" className="admind-dropdown-item">
                    <span className="admind-subicon">✏️</span> {TEXTS.editMember[lang]}
                  </Link>
                  <Link to="/admin/members/delete" className="admind-dropdown-item">
                    <span className="admind-subicon">🗑️</span> {TEXTS.deleteMember[lang]}
                  </Link>
                  <Link to="/admin/members/update" className="admind-dropdown-item">
                    <span className="admind-subicon">🔄</span> {TEXTS.updateMember[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Users Dropdown */}
            <div className="admind-nav-group">
              <button
                type="button"
                className={`admind-nav-item admind-nav-dropdown-btn ${location.pathname.startsWith('/admin/users') ? 'admind-nav-item--active' : ''}`}
                onClick={() => toggleDropdown('users')}
              >
                <span className="admind-nav-icon"><ShieldIcon /></span>
                <span className="admind-nav-label">{TEXTS.users[lang]}</span>
                <span className={`admind-dropdown-arrow ${openDropdowns.users ? 'admind-dropdown-arrow--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.users && (
                <div className="admind-dropdown-menu">
                  <Link to="/admin/users/add" className="admind-dropdown-item">
                    <span className="admind-subicon">➕</span> {TEXTS.addUser[lang]}
                  </Link>
                  <Link to="/admin/users/edit" className="admind-dropdown-item">
                    <span className="admind-subicon">✏️</span> {TEXTS.editUser[lang]}
                  </Link>
                  <Link to="/admin/users/delete" className="admind-dropdown-item">
                    <span className="admind-subicon">🗑️</span> {TEXTS.deleteUser[lang]}
                  </Link>
                  <Link to="/admin/users/update" className="admind-dropdown-item">
                    <span className="admind-subicon">🔄</span> {TEXTS.updateUser[lang]}
                  </Link>
                </div>
              )}
            </div>

            {/* Promotions Dropdown */}
            <div className="admind-nav-group">
              <button
                type="button"
                className={`admind-nav-item admind-nav-dropdown-btn ${location.pathname.startsWith('/admin/promotions') || location.pathname === '/add-promotion' ? 'admind-nav-item--active' : ''}`}
                onClick={() => toggleDropdown('promotions')}
              >
                <span className="admind-nav-icon"><TagIcon /></span>
                <span className="admind-nav-label">{TEXTS.promotions[lang]}</span>
                <span className={`admind-dropdown-arrow ${openDropdowns.promotions ? 'admind-dropdown-arrow--open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {openDropdowns.promotions && (
                <div className="admind-dropdown-menu">
                  <Link to="/admin/promotions/add" className="admind-dropdown-item">
                    <span className="admind-subicon">➕</span> {TEXTS.addPromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/edit" className="admind-dropdown-item">
                    <span className="admind-subicon">✏️</span> {TEXTS.editPromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/delete" className="admind-dropdown-item">
                    <span className="admind-subicon">🗑️</span> {TEXTS.deletePromotion[lang]}
                  </Link>
                  <Link to="/admin/promotions/update" className="admind-dropdown-item">
                    <span className="admind-subicon">🔄</span> {TEXTS.updatePromotion[lang]}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="admind-nav-section">
            <span className="admind-nav-section-label">{lang === 'en' ? 'Public Pages' : 'ទំព័រសាធារណៈ'}</span>
            <Link to="/products" className="admind-nav-item">
              <span className="admind-nav-icon"><ShopIcon /></span>
              <span className="admind-nav-label">{TEXTS.shop[lang]}</span>
            </Link>
            <Link to="/career" className="admind-nav-item">
              <span className="admind-nav-icon"><GlobeIcon /></span>
              <span className="admind-nav-label">{TEXTS.career[lang]}</span>
            </Link>
            <Link to="/member" className="admind-nav-item">
              <span className="admind-nav-icon"><TeamIcon /></span>
              <span className="admind-nav-label">{TEXTS.team[lang]}</span>
            </Link>
          </div>
        </nav>

        <div className="admind-sidebar-footer">
          <Link to="/" className="admind-back-site-btn">
            <ArrowLeftIcon />
            <span>{TEXTS.backToSite[lang]}</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="admind-main">
        {/* Top bar */}
        <header className="admind-topbar">
          <div className="admind-topbar-left">
            <button
              className="admind-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <MenuToggleIcon />
            </button>
            <div>
              <h1 className="admind-topbar-title">{TEXTS.overviewTitle[lang]}</h1>
              <p className="admind-topbar-date">{new Date().toLocaleDateString(lang === 'kh' ? 'km-KH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="admind-topbar-right">
            <span className="admind-topbar-badge">🔔</span>
            <div className="admind-topbar-avatar">A</div>
          </div>
        </header>

        {renderContent()}
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

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default AdminD
