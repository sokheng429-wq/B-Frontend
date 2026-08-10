import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { useLanguage } from '../context/LanguageContext'

const NAV_LINKS = [
  { label: { en: 'Home', kh: 'ទំព័រដើម' }, href: '/' },
  { label: { en: 'Popular Products', kh: 'ផលិតផលពេញនិយម' }, href: '/products' },
  { label: { en: 'Promotion', kh: 'ការផ្សព្វផ្សាយ' }, href: '/promotion' },
  { label: { en: 'Career', kh: 'ការងារ' }, href: '/career' },
  { label: { en: 'Member', kh: 'សមាជិក' }, href: '/member' },
  { label: { en: 'Contact', kh: 'ទំនាក់ទំនង' }, href: '/contact' },
  { label: { en: 'About Us', kh: 'អំពីយើង' }, href: '/about' },
]

export const Header = () => {
  const { lang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const t = {
    login: { en: 'Login', kh: 'ចូលគណនី' },
    register: { en: 'Register', kh: 'ចុះឈ្មោះ' },
  }

  return (
    <header className="header">
      <div className="header-inner">

        {/* Logo */}
        <Link to="/" className="logo-link" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-desktop">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="nav-link">
              {link.label[lang]}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="controls-desktop">
          <LanguageSwitcher />

          <Link to="/login" className="nav-link">
            {t.login[lang]}
          </Link>

          <Link to="/register" className="btn-brand">
            {t.register[lang]}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <nav className="nav-mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="nav-link-mobile"
                onClick={() => setMobileOpen(false)}
              >
                {link.label[lang]}
              </Link>
            ))}
          </nav>

          <div className="controls-mobile">
            <LanguageSwitcher />
            <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
              {t.login[lang]}
            </Link>
            <Link to="/register" className="btn-brand btn-brand-mobile" onClick={() => setMobileOpen(false)}>
              {t.register[lang]}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default Header