# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B'Groceries Frontend - A bilingual (English/Khmer) e-commerce grocery platform built with React 19, React Router 7, Vite 8, and Tailwind CSS 4. The frontend connects to a Spring Boot backend running on `http://localhost:8081/api`.

**Theme Colors:**
- Primary Orange: `#FF9900`
- Primary Green: `#77BC1F`
- Dark Background: `#0B0F14`
- Secondary Dark: `#232F3F`

## Development Commands

```bash
# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture & Key Patterns

### Context Providers (Nested in main.jsx)
The app uses four global context providers that wrap the entire application in this order:
1. **AuthContext** - Manages authentication state, login/logout, user data, and JWT token storage
2. **ThemeContext** - Handles dark/light theme switching with localStorage persistence
3. **LanguageContext** - Manages bilingual support (English `en` / Khmer `kh`) with localStorage persistence
4. **CartContext** - Manages shopping cart state (items, quantities, totals) with localStorage persistence

All contexts persist their state to `localStorage` and must be accessed via their respective hooks: `useAuth()`, `useTheme()`, `useLanguage()`, `useCart()`.

### API Integration (src/api/api.js)
- All backend requests go through a centralized `request()` function that handles JWT token injection from localStorage
- The backend expects `Authorization: Bearer <token>` headers for protected routes
- File uploads use `FormData` and the `Content-Type` header is automatically removed for multipart requests
- API modules: `authAPI`, `productAPI`, `jobAPI`, `memberAPI`, `applicationAPI`, `userAPI`, `orderAPI`, `dashboardAPI`

### Authentication Flow
- Login accepts multiple identifier types: username, email, phone, telegram, facebook + password
- Social login is one-click (just provider name: gmail|telegram|facebook)
- OTP-based login and password reset are 3-step flows (send → verify → action)
- The backend returns `{ token, tokenType, user }` on successful login
- `AuthContext.login(data)` stores the token and exposes `user.name` (aliased from `user.fullName`)

### Route Structure
- **Home routes** (`/`, `/member`, `/career`, `/contact`, `/about`, `/faq`, `/terms-privacy`) - Use `Header` component
- **Shop routes** (`/products`, `/promotion`, `/partners`, `/orders`, `/tracking`) - Use `Header2` + `ShopLayout` wrapper
- **Admin routes** (`/admin/*`) - Protected by `AdminRoute` wrapper (requires `user.role === 'ADMIN'`), no header/footer
- **Auth routes** (`/login`, `/register`, `/forgot-password`) - Public, use `Header`

### Bilingual Content Pattern
All user-facing text is stored as `{ en: 'English', kh: 'ខ្មែរ' }` objects. Access the current language text with:
```javascript
const { lang } = useLanguage()
const text = { en: 'Hello', kh: 'សួស្តី' }
<p>{text[lang]}</p>
```

### Demo Data (src/data/)
- `products.js` - 80 products across 7 categories with bilingual names, descriptions, prices, ratings
- `orders.js` - Order history with tracking stages (processing → transit → delivered)
- Both files export helper functions for formatting and lookups

## File Organization

```
src/
├── api/
│   └── api.js                    # Centralized API client with JWT handling
├── assets/                       # Images (Logo.jpg, Profile.avif, team photos)
├── components/
│   ├── Header.jsx/Header2.jsx   # Two header variants (standard vs shop pages)
│   ├── Footer.jsx               # Shared footer
│   ├── Logo.jsx                 # Animated logo component
│   ├── LanguageSwitcher.jsx     # EN/KH toggle
│   ├── ThemeToggle.jsx          # Dark/light mode toggle
│   ├── ProductCard.jsx          # Product listing card
│   ├── ProductShop.jsx          # Shop product display
│   ├── ShopSidebar.jsx          # Shop layout with sidebar (wraps shop routes)
│   ├── PageTransition.jsx       # Route transition animations
│   └── ScrollToTop.jsx          # Reset scroll on route change
├── context/
│   ├── AuthContext.jsx          # Authentication & user state
│   ├── ThemeContext.jsx         # Dark/light theme
│   ├── LanguageContext.jsx      # Bilingual EN/KH
│   └── CartContext.jsx          # Shopping cart state
├── data/
│   ├── products.js              # 80 demo products (7 categories, bilingual)
│   └── orders.js                # Demo order history & tracking data
├── Pages/
│   ├── Home/                    # Home, Member, Career, Contact, About, FAQ, etc.
│   ├── Shop/                    # Products, Cart, Orders, Tracking, Promotion, Partners
│   └── Auth/                    # Login, Register, ForgotPassword, Admin dashboard
├── App.jsx                      # Route definitions & layout logic
└── main.jsx                     # React root with nested context providers
```

## Component Conventions

- All pages use the `PageTransition` wrapper for animated route changes
- Shop-related pages are wrapped in `ShopLayout` which provides a sidebar
- Admin pages check `user.role === 'ADMIN'` via the `AdminRoute` wrapper
- The `Header` vs `Header2` distinction is based on route path (see App.jsx line 46)

## State Management

- **Global state:** React Context (Auth, Theme, Language, Cart)
- **Local state:** React `useState` for component-specific UI state
- **Persistence:** `localStorage` for auth tokens, theme preference, language preference, cart items
- **No Redux or external state library** - Context API is sufficient for this app's scope

## Styling

- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- Theme variables set via `data-theme` attribute on `<html>` element
- Light theme uses `.light-theme` class
- Custom CSS files per component/page (e.g., `Header.css`, `Home.css`)
- Global styles in `index.css`

## Testing & Verification

- No test framework is currently configured
- When adding tests, use the standard choice for React (likely Vitest given Vite setup)
- Manual testing: start dev server and test in browser

## Admin Role Requirements

- Admin dashboard and management pages require `user.role === 'ADMIN'`
- Non-admin users attempting to access `/admin/*` routes are redirected to `/`
- Admin pages include: Add/Edit Products, Add/Edit Jobs, Add/Edit Members, Add/Edit Promotions, Add/Edit Partners, Manage Users

## Backend Contract

- Backend runs on `http://localhost:8081/api` (see `src/api/api.js`)
- CORS is open on the backend
- All API responses follow `{ success, message, data }` shape
- JWT tokens are stored in `localStorage` with key `token`
- File uploads use multipart/form-data

## Known Patterns

- Product images are fetched from Unsplash via helper functions in `products.js`
- Cart count is currently hardcoded to `0` (see Header.jsx line 32) - cart logic needs implementation
- Order tracking has 4 stages: placed → packed → transit → delivered
- The app defaults to dark theme if no preference is saved
