function Navbar({ setPage }) {
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setPage('home')
  }

  const isCustomer = !user || user.role === 'customer'

  return (
    <nav style={{backgroundColor: '#131921', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

      <div onClick={() => setPage('home')} style={{color: '#FCD116', fontSize: '1.8rem', fontWeight: 'bold', cursor: 'pointer'}}>
        Yoiwa Shops
      </div>

      {/* Search bar — only for customers */}
      {isCustomer && (
        <div style={{display: 'flex', flex: 1, margin: '0 20px'}}>
          <input
            type="text"
            placeholder="Search for products..."
            style={{width: '100%', padding: '8px 12px', fontSize: '1rem', border: 'none', borderRadius: '4px 0 0 4px', outline: 'none'}}
          />
          <button style={{backgroundColor: '#FCD116', padding: '8px 16px', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold'}}>
            Search
          </button>
        </div>
      )}

      <div style={{display: 'flex', gap: '20px', color: 'white', fontSize: '0.9rem', alignItems: 'center', marginLeft: isCustomer ? '0' : 'auto'}}>

        {/* Not logged in */}
        {!user && (
          <>
            <span onClick={() => setPage('signin')} style={{cursor: 'pointer'}}>Sign In</span>
            <span onClick={() => setPage('register')} style={{cursor: 'pointer'}}>Register</span>
            <span onClick={() => setPage('sellerregister')} style={{cursor: 'pointer'}}>Sell on Yoiwa</span>
          </>
        )}

        {/* Customer */}
        {user && user.role === 'customer' && (
          <span style={{color: '#FCD116'}}>Hi, {user.name.split(' ')[0]}!</span>
        )}

        {/* Seller */}
        {user && user.role === 'seller' && (
          <>
            <span style={{color: '#FCD116'}}>Hi, {user.name.split(' ')[0]}!</span>
            <span onClick={() => setPage('seller')} style={{cursor: 'pointer'}}>My Store</span>
          </>
        )}

        {/* Rider */}
        {user && user.role === 'rider' && (
          <>
            <span style={{color: '#FCD116'}}>Hi, {user.name.split(' ')[0]}!</span>
            <span onClick={() => setPage('rider')} style={{cursor: 'pointer'}}>My Deliveries</span>
          </>
        )}

        {/* Admin */}
        {user && user.role === 'admin' && (
          <>
            <span style={{color: '#FCD116'}}>Hi, {user.name.split(' ')[0]}!</span>
            <span onClick={() => setPage('admin')} style={{cursor: 'pointer'}}>Admin Panel</span>
          </>
        )}

        {/* Logout */}
        {user && (
          <span onClick={handleLogout} style={{cursor: 'pointer', color: '#ff6b6b'}}>Logout</span>
        )}

        {/* Cart — only for customers */}
        {isCustomer && (
          <span onClick={() => setPage('cart')} style={{cursor: 'pointer'}}>Cart 🛒</span>
        )}

      </div>
    </nav>
  )
}

export default Navbar