import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Header2 from './components/Header2'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import Home from './Pages/Home/Home'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import ForgotPassword from './Pages/Auth/Forgotpassword'
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
import AddPartner from './Pages/Auth/AddPartner'

// Only users with role ADMIN may see admin pages; everyone else goes home.
const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const useHeader2 = ['/products', '/promotion', '/partners', '/product-detail', '/orders', '/tracking'].includes(location.pathname)

  return (
    <>
      <ScrollToTop />
      {!isAdmin && (useHeader2 ? <Header2 /> : <Header />)}
      <PageTransition key={location.pathname}>
        <Routes location={location}>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Standard & Interactive Pages */}
          <Route path="/products" element={<ShopLayout><PopularProducts /></ShopLayout>} />
          <Route path="/product-detail" element={<ShopLayout><Productdetail /></ShopLayout>} />
          <Route path="/product-details" element={<ShopLayout><Productdetail /></ShopLayout>} />

          <Route path="/promotion" element={<ShopLayout><Promotion /></ShopLayout>} />

          <Route path="/career" element={<Career />} />
          <Route path="/career-detail" element={<Careerdetail />} />
          <Route path="/career-details" element={<Careerdetail />} />

          <Route path="/member" element={<Member />} />
          <Route path="/member-detail" element={<Memberdetail />} />

          <Route path="/partners" element={<ShopLayout><Partners /></ShopLayout>} />
          <Route path="/orders" element={<ShopLayout><OrderHistory /></ShopLayout>} />
          <Route path="/tracking" element={<ShopLayout><Tracking /></ShopLayout>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms-privacy" element={<TermsPrivacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingDelivery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/apply-now" element={<ApplyNow />} />

          {/* Admin Backoffice Management (ADMIN only) */}
          <Route path="/admin" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-member" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-jobs" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-products" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-promotion" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/manage-users" element={<AdminRoute><AdminD /></AdminRoute>} />
          <Route path="/add-partner" element={<AdminRoute><AddPartner /></AdminRoute>} />

          <Route path="/profile" element={<Profile />} />

        </Routes>
      </PageTransition>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
