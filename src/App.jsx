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

function App() {
  const [page, setPage] = useState('home')

  return (
    <div>
      <Navbar setPage={setPage} />
      
      {page === 'home' && (
        <>
          <Hero />
          <ProductGrid setPage={setPage} />
        </>
      )}

      {page === 'signin' && <SignIn setPage={setPage} />}
      {page === 'register' && <Register setPage={setPage} />}
      {page === 'cart' && <Cart setPage={setPage} />}
      {page === 'checkout' && <Checkout setPage={setPage} />}
      {page === 'confirmation' && <Confirmation setPage={setPage} />}
      {page === 'seller' && <SellerDashboard setPage={setPage} />}
      {page === 'admin' && <AdminDashboard setPage={setPage} />}
      {page === 'rider' && <RiderDashboard setPage={setPage} />}

      <Footer />
    </div>
  )
}

export default App