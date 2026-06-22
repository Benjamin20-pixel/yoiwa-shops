import { useState } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import ProductGrid from './ProductGrid'
import Footer from './Footer'
import SignIn from './SignIn'
import Register from './Register'
import Cart from './Cart'
import Checkout from './Checkout'
import Confirmation from './Confirmation'
import SellerDashboard from './SellerDashboard'
import AdminDashboard from './AdminDashboard'
import RiderDashboard from './RiderDashboard'
import SellerRegister from './SellerRegister'
import SellerSignIn from './SellerSignIn'

function App() {
  const [page, setPage] = useState('home')
  const user = JSON.parse(localStorage.getItem('user'))

  const getHomePage = () => {
    if (user?.role === 'seller') return 'seller'
    if (user?.role === 'rider') return 'rider'
    if (user?.role === 'admin') return 'admin'
    return 'home'
  }

  const currentPage = page === 'home' ? getHomePage() : page

  return (
    <div>
      <Navbar setPage={setPage} />
      
      {currentPage === 'home' && (
        <>
          <Hero />
          <ProductGrid setPage={setPage} />
        </>
      )}

      {currentPage === 'signin' && <SignIn setPage={setPage} />}
      {currentPage === 'register' && <Register setPage={setPage} />}
      {currentPage === 'cart' && <Cart setPage={setPage} />}
      {currentPage === 'checkout' && <Checkout setPage={setPage} />}
      {currentPage === 'confirmation' && <Confirmation setPage={setPage} />}
      {currentPage === 'seller' && <SellerDashboard setPage={setPage} />}
      {currentPage === 'admin' && <AdminDashboard setPage={setPage} />}
      {currentPage === 'rider' && <RiderDashboard setPage={setPage} />}
      {currentPage === 'sellerregister' && <SellerRegister setPage={setPage} />}
      {currentPage === 'sellersignin' && <SellerSignIn setPage={setPage} />}

      <Footer />
    </div>
  )
}

export default App