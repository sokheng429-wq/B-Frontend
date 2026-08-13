
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
import AddMember from './Pages/Addmember'
import Addjobs from './Pages/Addjobs'
import AddProducts from './Pages/AddProducts'
import AdminD from './Pages/AdminD'
import ManageUsers from './Pages/ManageUsers'
import Addpromotion from './Pages/Addpromotion'
import Profile from './Pages/Profile'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const useHeader2 = location.pathname === '/products' || location.pathname === '/promotion'

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

          {/* Only Admin Emp or marchent Have permission to access this route can add more products*/}
          <Route path="/products" element={<PopularProducts />} />
          {/* Only Admin Have permission to access this route add promotion */}
          <Route path="/promotion" element={<Promotion />} />
          {/* Only Admin Have permission to access this route to add more members */}
          <Route path="/career" element={<Career />} />
          {/* Only Admin Have permission to access this route add or remove members */}
          <Route path="/member" element={<Member />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms-privacy" element={<TermsPrivacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingDelivery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/apply-now" element={<ApplyNow />} />

          {/* Only Admin Have permission to access this route */}
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/add-jobs" element={<Addjobs />} />
          <Route path="/add-products" element={<AddProducts />} />
          <Route path="/admin" element={<AdminD />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/add-promotion" element={<Addpromotion />} />

          <Route path="/profile" element={<Profile />} />

        </Routes>
      </PageTransition>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App