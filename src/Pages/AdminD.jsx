import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import './AdminD.css'

const stats = [
  { label: 'Total Products', value: 24, change: '+3', up: true, icon: '📦', color: '#4caf50', bg: '#e8f5e9', link: '/add-products' },
  { label: 'Open Jobs', value: 6, change: '+1', up: true, icon: '💼', color: '#ff9800', bg: '#fff3e0', link: '/add-jobs' },
  { label: 'Team Members', value: 12, change: '+2', up: true, icon: '👥', color: '#2196f3', bg: '#e3f2fd', link: '/add-member' },
  { label: 'Applications', value: 9, change: '-2', up: false, icon: '📋', color: '#9c27b0', bg: '#f3e5f5', link: '/career' },
]

const categoryData = [
  { label: 'Fruits & Veg', value: 8, max: 10, color: '#4caf50' },
  { label: 'Meat & Seafood', value: 4, max: 10, color: '#f44336' },
  { label: 'Dairy & Eggs', value: 5, max: 10, color: '#ff9800' },
  { label: 'Bakery', value: 3, max: 10, color: '#795548' },
  { label: 'Drinks', value: 2, max: 10, color: '#2196f3' },
  { label: 'Snacks', value: 2, max: 10, color: '#9c27b0' },
]

const monthlyData = [
  { month: 'Jan', value: 12 }, { month: 'Feb', value: 18 }, { month: 'Mar', value: 15 },
  { month: 'Apr', value: 22 }, { month: 'May', value: 19 }, { month: 'Jun', value: 25 },
  { month: 'Jul', value: 20 }, { month: 'Aug', value: 24 },
]

const recentActivity = [
  { action: 'New product added', detail: 'Canvas Backpack', time: '2 hours ago', icon: '📦', color: '#4caf50' },
  { action: 'Job posted', detail: 'Senior Frontend Developer', time: '5 hours ago', icon: '💼', color: '#ff9800' },
  { action: 'New application received', detail: 'UI/UX Designer position', time: '1 day ago', icon: '📋', color: '#9c27b0' },
  { action: 'Team member added', detail: 'Sarah Chen — Marketing', time: '2 days ago', icon: '👤', color: '#2196f3' },
  { action: 'Product updated', detail: 'Organic Avocados price changed', time: '3 days ago', icon: '✏️', color: '#ff5722' },
]

function AdminD() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={`admind-page ${!sidebarOpen ? 'admind-page--collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admind-sidebar ${!sidebarOpen ? 'admind-sidebar--collapsed' : ''}`}>
        <div className="admind-sidebar-brand">
          <span className="admind-sidebar-logo">G</span>
          <div>
            <h3 className="admind-sidebar-name">Groceries</h3>
            <p className="admind-sidebar-role">Admin Panel</p>
          </div>
        </div>

        <nav className="admind-sidebar-nav">
          <div className="admind-nav-section">
            <span className="admind-nav-section-label">Main</span>
            <Link to="/admin" className={`admind-nav-item ${location.pathname === '/admin' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><HomeIcon /></span>
              <span className="admind-nav-label">Dashboard</span>
            </Link>
          </div>

          <div className="admind-nav-section">
            <span className="admind-nav-section-label">Management</span>
            <Link to="/add-products" className={`admind-nav-item ${location.pathname === '/add-products' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><PackageIcon /></span>
              <span className="admind-nav-label">Products</span>
            </Link>
            <Link to="/add-jobs" className={`admind-nav-item ${location.pathname === '/add-jobs' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><BriefcaseIcon /></span>
              <span className="admind-nav-label">Jobs</span>
            </Link>
            <Link to="/add-member" className={`admind-nav-item ${location.pathname === '/add-member' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><UsersIcon /></span>
              <span className="admind-nav-label">Members</span>
            </Link>
            <Link to="/admin/users" className={`admind-nav-item ${location.pathname === '/admin/users' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><ShieldIcon /></span>
              <span className="admind-nav-label">Users</span>
            </Link>
            <Link to="/add-promotion" className={`admind-nav-item ${location.pathname === '/add-promotion' ? 'admind-nav-item--active' : ''}`}>
              <span className="admind-nav-icon"><TagIcon /></span>
              <span className="admind-nav-label">Promotions</span>
            </Link>
          </div>

          <div className="admind-nav-section">
            <span className="admind-nav-section-label">Public Pages</span>
            <Link to="/products" className="admind-nav-item">
              <span className="admind-nav-icon"><ShopIcon /></span>
              <span className="admind-nav-label">Shop</span>
            </Link>
            <Link to="/career" className="admind-nav-item">
              <span className="admind-nav-icon"><GlobeIcon /></span>
              <span className="admind-nav-label">Career</span>
            </Link>
            <Link to="/member" className="admind-nav-item">
              <span className="admind-nav-icon"><TeamIcon /></span>
              <span className="admind-nav-label">Team</span>
            </Link>
          </div>
        </nav>

        <div className="admind-sidebar-footer">
          <Link to="/" className="admind-back-site-btn">
            <ArrowLeftIcon />
            <span>Back to Site</span>
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
              <h1 className="admind-topbar-title">Dashboard Overview</h1>
              <p className="admind-topbar-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="admind-topbar-right">
            <ThemeToggle />
            <span className="admind-topbar-badge">🔔</span>
            <div className="admind-topbar-avatar">A</div>
          </div>
        </header>

        {/* Stats row */}
        <div className="admind-stats-grid">
          {stats.map((stat) => (
            <Link to={stat.link} className="admind-stat-card" key={stat.label}>
              <div className="admind-stat-top">
                <span className="admind-stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</span>
                <span className={`admind-stat-change ${stat.up ? 'admind-stat-change--up' : 'admind-stat-change--down'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="admind-stat-value">{stat.value}</p>
              <p className="admind-stat-label">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Analytics row */}
        <div className="admind-analytics-grid">
          {/* Category chart */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">Products by Category</h3>
              <span className="admind-panel-subtitle">Distribution across categories</span>
            </div>
            <div className="admind-bar-chart">
              {categoryData.map((cat) => (
                <div className="admind-bar-row" key={cat.label}>
                  <span className="admind-bar-label">{cat.label}</span>
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
              <h3 className="admind-panel-title">Monthly Activity</h3>
              <span className="admind-panel-subtitle">Products added this year</span>
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
              <h3 className="admind-panel-title">Quick Actions</h3>
              <span className="admind-panel-subtitle">Frequently used shortcuts</span>
            </div>
            <div className="admind-action-list">
              <Link to="/add-products" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#4caf50' }}>📦</span>
                <div>
                  <h4>Add a Product</h4>
                  <p>List new grocery items in the shop</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/add-jobs" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#ff9800' }}>💼</span>
                <div>
                  <h4>Post a Job</h4>
                  <p>Create a new career opening</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/add-member" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#2196f3' }}>👤</span>
                <div>
                  <h4>Add Team Member</h4>
                  <p>Onboard a new team member</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/add-promotion" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#e91e63' }}>🏷️</span>
                <div>
                  <h4>Manage Promotions</h4>
                  <p>Create and edit promotional deals</p>
                </div>
                <ChevronIcon />
              </Link>
              <Link to="/products" className="admind-action-item">
                <span className="admind-action-dot" style={{ background: '#607d8b' }}>🛒</span>
                <div>
                  <h4>View Public Shop</h4>
                  <p>See the storefront as customers do</p>
                </div>
                <ChevronIcon />
              </Link>
            </div>
          </div>

          {/* Recent activity */}
          <div className="admind-panel">
            <div className="admind-panel-header">
              <h3 className="admind-panel-title">Recent Activity</h3>
              <span className="admind-panel-subtitle">Latest actions across the platform</span>
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
                      {item.action}: <strong>{item.detail}</strong>
                    </p>
                    <p className="admind-timeline-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

export default AdminD
