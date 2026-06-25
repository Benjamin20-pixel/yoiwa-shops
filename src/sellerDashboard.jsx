import { useState, useEffect } from 'react'
import { getProducts } from './api'

function SellerDashboard({ setPage }) {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    productsListed: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log('SellerDashboard loaded user:', user)
  //fetchSeellerData
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true)
        const res = await getProducts()
        const allProducts = res.data
        console.log('All products:', allProducts)
        console.log('User ID:', user.id)
        console.log('Seller products:', allProducts.filter(p => p.seller?._id === user.id))

        const sellerProducts = allProducts.filter(p =>
          p.seller?._id === user.id || p.seller?.id === user.id
        )

        setMyProducts(sellerProducts)
        setStats({
          totalSales: 0,
          totalOrders: 0,
          productsListed: sellerProducts.length,
          pendingOrders: 0
        })
        setRecentOrders([])
      } catch (err) {
        setError('Failed to load seller data')
        console.error('Error fetching seller data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [user.id])

  if (loading) {
    return (
      <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{fontSize: '1.2rem', color: '#555'}}>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{fontSize: '1.2rem', color: 'red'}}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px'}}>
        <div>
          <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>Seller Dashboard</h2>
          <p style={{color: '#555', fontSize: '0.9rem'}}>Welcome back, {user.name || 'Seller'} 👋</p>
        </div>
        <button onClick={() => setPage('home')} style={{backgroundColor: '#131921', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          View Store
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Sales</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#006B3F'}}>GH&#8373; {stats.totalSales}</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Orders</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>{stats.totalOrders}</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Products Listed</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>{stats.productsListed}</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Active listings</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Pending Orders</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#FCD116'}}>{stats.pendingOrders}</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Needs attention</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>

        {/* Recent Orders */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p style={{color: '#555', textAlign: 'center', padding: '20px'}}>No orders yet.</p>
          ) : (
            recentOrders.map(order => {
              const statusStyles = {
                'Pending': { bg: '#FFF3CD', color: '#856404' },
                'Delivered': { bg: '#D4EDDA', color: '#155724' },
                'Processing': { bg: '#CCE5FF', color: '#004085' },
                'Cancelled': { bg: '#F8D7DA', color: '#721C24' }
              }
              const style = statusStyles[order.status] || { bg: '#E2E3E5', color: '#383D41' }
              return (
                <div key={order.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
                  <div>
                    <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{order.id}</p>
                    <p style={{color: '#555', fontSize: '0.85rem'}}>{order.product}</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p style={{fontWeight: 'bold', color: '#006B3F', fontSize: '0.9rem'}}>GH&#8373; {order.amount}</p>
                    <span style={{backgroundColor: style.bg, color: style.color, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'}}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* My Products */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#131921'}}>My Products</h3>
            <button onClick={() => setPage('addproduct')} style={{backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'}}>
              + Add Product
            </button>
          </div>

          {myProducts.length === 0 ? (
            <p style={{color: '#555', textAlign: 'center', padding: '20px'}}>
              No products yet. Click + Add Product to get started!
            </p>
          ) : (
            myProducts.map((product) => (
              <div key={product._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <div style={{width: '50px', height: '50px', backgroundColor: '#EAEDED', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                    ) : '📦'}
                  </div>
                  <div>
                    <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{product.name}</p>
                    <p style={{color: '#006B3F', fontSize: '0.85rem', fontWeight: 'bold'}}>GH&#8373; {product.price}</p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{color: '#555', fontSize: '0.85rem'}}>Stock: {product.stock}</p>
                  <span style={{color: '#006B3F', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold'}}>Edit</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default SellerDashboard