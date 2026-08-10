
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/Forgotpassword'
import PopularProducts  from './Pages/Popular Products'
import Promotion  from './Pages/Promotion'
import  Career  from './Pages/Career'
import Member  from './Pages/Member'
import Contact  from './Pages/Contact'
import About  from './Pages/AboutUs'

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Header />
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<PopularProducts />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/career" element={<Career />} />
          <Route path="/member" element={<Member />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>
      <Footer />
    </>
  )
}

export default App