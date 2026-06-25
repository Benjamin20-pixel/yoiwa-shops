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
import RiderRegister from './RiderRegister'
import RiderSignIn from './RiderSignIn'
import ProductDetail from './ProductDetail'
import AddProduct from './AddProduct'

function App() {
  const [page, setPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const getCurrentPage = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (page === 'home') {
      if (user?.role === 'seller') return 'seller'
      if (user?.role === 'rider') return 'rider'
      if (user?.role === 'admin') return 'admin'
      return 'home'
    }
    return page
  }

  const currentPage = getCurrentPage()

  const handleSearch = (query) => {
    setSearchQuery(query)
    setPage('home')
  }

  const handleProductClick = (productId) => {
    setSelectedProduct(productId)
    setPage('product')
  }

  return (
    <div>
      <Navbar setPage={setPage} onSearch={handleSearch} />
      
      {currentPage === 'home' && (
        <>
          <Hero />
          <ProductGrid setPage={setPage} searchQuery={searchQuery} onProductClick={handleProductClick} />
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
      {currentPage === 'riderregister' && <RiderRegister setPage={setPage} />}
      {currentPage === 'ridersignin' && <RiderSignIn setPage={setPage} />}
      {currentPage === 'product' && <ProductDetail setPage={setPage} productId={selectedProduct} />}
      {currentPage === 'addproduct' && <AddProduct setPage={setPage} />}

      <Footer setPage={setPage} />
    </div>
  )
}

export default App