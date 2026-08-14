import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Header2 from './components/Header2'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import Home from './Pages/Home'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import ForgotPassword from './Pages/Auth/Forgotpassword'
import PopularProducts from './Pages/Popular Products'
import Promotion from './Pages/Promotion'
import Career from './Pages/Career'
import Member from './Pages/Member'
import Contact from './Pages/Contact'
import About from './Pages/AboutUs'
import TermsPrivacy from './Pages/Terms&Privacy'
import FAQ from './Pages/FAQ'
import ShippingDelivery from './Pages/Shipping&Delivery'
import Cart from './Pages/Cart'
import ApplyNow from './Pages/Applynow'
import AdminD from './Pages/AdminD'
import Profile from './Pages/Profile'
import Memberdetail from './Pages/Memberdetail'
import Productdetail from './Pages/Productdetail'
import Careerdetail from './Pages/Careerdetail'
import Partners from './Pages/Partners'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const useHeader2 = location.pathname === '/products' || location.pathname === '/promotion' || location.pathname === '/partners'

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
          <Route path="/products" element={<PopularProducts />} />
          <Route path="/product-detail" element={<Productdetail />} />
          <Route path="/product-details" element={<Productdetail />} />

          <Route path="/promotion" element={<Promotion />} />

          <Route path="/career" element={<Career />} />
          <Route path="/career-detail" element={<Careerdetail />} />
          <Route path="/career-details" element={<Careerdetail />} />

          <Route path="/member" element={<Member />} />
          <Route path="/member-detail" element={<Memberdetail />} />
          <Route path="/member-details" element={<Memberdetail />} />

          <Route path="/partners" element={<Partners />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms-privacy" element={<TermsPrivacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingDelivery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/apply-now" element={<ApplyNow />} />

          {/* Admin Backoffice Management */}
          <Route path="/admin" element={<AdminD />} />
          <Route path="/admin/*" element={<AdminD />} />
          <Route path="/add-member" element={<AdminD />} />
          <Route path="/add-jobs" element={<AdminD />} />
          <Route path="/add-products" element={<AdminD />} />
          <Route path="/add-promotion" element={<AdminD />} />
          <Route path="/manage-users" element={<AdminD />} />

          <Route path="/profile" element={<Profile />} />

        </Routes>
      </PageTransition>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
