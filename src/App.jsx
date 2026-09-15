import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Header2 from './components/Header2'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import SessionTimeoutModal from './components/SessionTimeoutModal'
import Home from './Pages/Home/Home'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import ForgotPassword from './Pages/Auth/Forgotpassword'
import OAuth2Redirect from './Pages/Auth/OAuth2Redirect'
import PopularProducts from './Pages/Shop/Popular Products'
import Promotion from './Pages/Shop/Promotion'
import Career from './Pages/Home/Career'
import Member from './Pages/Home/Member'
import Contact from './Pages/Home/Contact'
import About from './Pages/Home/AboutUs'
import TermsPrivacy from './Pages/Home/Terms&Privacy'
import FAQ from './Pages/Home/FAQ'
import ShippingDelivery from './Pages/Shop/Shipping&Delivery'
import Cart from './Pages/Shop/Cart'
import ApplyNow from './Pages/Home/Applynow'
import AdminD from './Pages/Auth/AdminD'
import Profile from './Pages/Home/Profile'
import Memberdetail from './Pages/Home/Memberdetail'
import Productdetail from './Pages/Shop/Productdetail'
import Careerdetail from './Pages/Home/Careerdetail'
import Partners from './Pages/Shop/Partners'
import OrderHistory from './Pages/Shop/OrderHistory'
import Tracking from './Pages/Shop/Tracking'
import ShopLayout from './components/ShopSidebar'
import { isStaffOrAdminRole } from './utils/roleUtils'

// Standard authenticated user guard (redirects unauthenticated users to /login)
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const storedIsLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false
  const effectiveLoggedIn = isLoggedIn || storedIsLoggedIn || Boolean(token)

  if (!effectiveLoggedIn || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Allow any authenticated user who has an assigned role to access the admin panel
const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuth()
  const location = useLocation()

  // 1. Must be logged in and possess a token
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const storedIsLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false
  const effectiveLoggedIn = isLoggedIn || storedIsLoggedIn || Boolean(token)

  if (!effectiveLoggedIn || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Synchronize user from localStorage if state is in-flight
  let effectiveUser = user
  if (!effectiveUser && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user')
      if (stored) effectiveUser = JSON.parse(stored)
    } catch {}
  }

  // 2. Allow any user with an assigned staff / administrative role
  if (!isStaffOrAdminRole(effectiveUser)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuth = ['/login', '/forgot-password', '/register', '/oauth2/redirect'].includes(location.pathname)
  const useHeader2 = ['/products', '/promotion', '/partners', '/product-detail', '/orders', '/tracking', '/cart'].includes(location.pathname)

  return (
    <>
      <ScrollToTop />
      <SessionTimeoutModal />
      {!isAdmin && !isAuth && (useHeader2 ? <Header2 /> : <Header />)}
      <PageTransition key={location.pathname}>
        <Routes location={location}>

          {/* Root page: redirects unauthenticated users to /login, renders Home once logged in */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<Navigate to="/login?help=admin" replace />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

          {/* Customer Standard & Interactive Pages (Require Login) */}
          <Route path="/products" element={<ProtectedRoute><ShopLayout><PopularProducts /></ShopLayout></ProtectedRoute>} />
          <Route path="/product-detail" element={<ProtectedRoute><ShopLayout><Productdetail /></ShopLayout></ProtectedRoute>} />
          <Route path="/product-details" element={<ProtectedRoute><ShopLayout><Productdetail /></ShopLayout></ProtectedRoute>} />

          <Route path="/promotion" element={<ProtectedRoute><ShopLayout><Promotion /></ShopLayout></ProtectedRoute>} />

          <Route path="/career" element={<ProtectedRoute><Career /></ProtectedRoute>} />
          <Route path="/career-detail" element={<ProtectedRoute><Careerdetail /></ProtectedRoute>} />
          <Route path="/career-details" element={<ProtectedRoute><Careerdetail /></ProtectedRoute>} />
          <Route path="/career-detail/:id" element={<ProtectedRoute><Careerdetail /></ProtectedRoute>} />

          <Route path="/member" element={<ProtectedRoute><Member /></ProtectedRoute>} />
          <Route path="/member-detail" element={<AdminRoute><Memberdetail /></AdminRoute>} />

          <Route path="/partners" element={<ProtectedRoute><ShopLayout><Partners /></ShopLayout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><ShopLayout><OrderHistory /></ShopLayout></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><ShopLayout><Tracking /></ShopLayout></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/terms-privacy" element={<ProtectedRoute><TermsPrivacy /></ProtectedRoute>} />
          <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute><ShippingDelivery /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/apply-now" element={<ProtectedRoute><ApplyNow /></ProtectedRoute>} />

          {/* Admin Back office Management (ADMIN only) */}
          {/* Specific routes MUST come before wildcard routes */}
          <Route path="/admin/customers" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/admin/customers/*" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-member" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-jobs" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-products" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-promotion" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/manage-users" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-partner" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-driver" element={<AdminRoute><AdminD /></AdminRoute>} />

          {/* Direct Purchase Management shortcuts */}
          <Route path="/requisition" element={<Navigate to="/admin/purchase-management/requisition" replace />} />
          <Route path="/inventory-to-order" element={<Navigate to="/admin/purchase-management/inventory-to-order" replace />} />
          <Route path="/purchase-order" element={<Navigate to="/admin/purchase-management/purchase-order" replace />} />
          <Route path="/receipt-po" element={<Navigate to="/admin/purchase-management/receipt-po" replace />} />
          <Route path="/return-receipt-po" element={<Navigate to="/admin/purchase-management/return-receipt-po" replace />} />

          {/* Direct Freight Management shortcuts */}
          <Route path="/shipment-tariff" element={<Navigate to="/admin/freight-management/shipment-tariff" replace />} />
          <Route path="/shipment-method" element={<Navigate to="/admin/freight-management/shipment-method" replace />} />
          <Route path="/pending-receipt-po" element={<Navigate to="/admin/freight-management/pending-receipt-po" replace />} />

          {/* Direct Payable Management shortcuts */}
          <Route path="/enter-bill" element={<Navigate to="/admin/payable-management/enter-bill" replace />} />
          <Route path="/bill-payment" element={<Navigate to="/admin/payable-management/bill-payment" replace />} />
          <Route path="/enter-freight" element={<Navigate to="/admin/payable-management/enter-freight" replace />} />
          <Route path="/supplier-deposit" element={<Navigate to="/admin/payable-management/supplier-deposit" replace />} />
          <Route path="/supplier-refund" element={<Navigate to="/admin/payable-management/supplier-refund" replace />} />

          {/* Direct Cash Book shortcuts */}
          <Route path="/cash-book" element={<Navigate to="/admin/cash-book" replace />} />
          <Route path="/cash-in-out" element={<Navigate to="/admin/cash-book/cash-in-out" replace />} />
          <Route path="/cash-in-out/create" element={<Navigate to="/admin/cash-book/cash-in-out/create" replace />} />
          <Route path="/cash-category" element={<Navigate to="/admin/cash-book/cash-category" replace />} />
          <Route path="/bank-in-out" element={<Navigate to="/admin/cash-book/bank-in-out" replace />} />
          <Route path="/bank-in-out/create" element={<Navigate to="/admin/cash-book/bank-in-out/create" replace />} />
          <Route path="/bank-transfer" element={<Navigate to="/admin/cash-book/bank-transfer" replace />} />
          <Route path="/bank-transfer/create" element={<Navigate to="/admin/cash-book/bank-transfer/create" replace />} />

          {/* Direct Employee shortcuts */}
          <Route path="/employee" element={<Navigate to="/admin/employee" replace />} />
          <Route path="/employee-list" element={<Navigate to="/admin/employee/list" replace />} />
          <Route path="/office" element={<Navigate to="/admin/employee/office" replace />} />
          <Route path="/department" element={<Navigate to="/admin/employee/department" replace />} />
          <Route path="/section" element={<Navigate to="/admin/employee/section" replace />} />
          <Route path="/position" element={<Navigate to="/admin/employee/position" replace />} />

          {/* Direct Report shortcuts */}
          <Route path="/report" element={<Navigate to="/admin/report" replace />} />
          <Route path="/report/*" element={<Navigate to="/admin/report" replace />} />

          {/* Wildcard routes last */}
          <Route path="/admin" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminD /></AdminRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </PageTransition>
      {!isAdmin && !isAuth && <Footer />}
    </>
  )
}

export default App


