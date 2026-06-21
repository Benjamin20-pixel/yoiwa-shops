function SellerDashboard({ setPage }) {
  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <div>
          <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>Seller Dashboard</h2>
          <p style={{color: '#555', fontSize: '0.9rem'}}>Welcome back, Kofi's Store 👋</p>
        </div>
        <button onClick={() => setPage('home')} style={{backgroundColor: '#131921', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          View Store
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Sales</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#006B3F'}}>GH₵ 4,250</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Orders</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>38</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Products Listed</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>12</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Active listings</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Pending Orders</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#FCD116'}}>5</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Needs attention</p>
        </div>

      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>

        {/* Recent Orders */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Recent Orders</h3>
          
          {[
            { id: '#YS-00124', product: 'Wireless Headphones', amount: 'GH₵ 250', status: 'Pending' },
            { id: '#YS-00123', product: 'Rice Cooker', amount: 'GH₵ 180', status: 'Delivered' },
            { id: '#YS-00122', product: 'Smart Watch', amount: 'GH₵ 420', status: 'Delivered' },
            { id: '#YS-00121', product: 'Ladies Sandals', amount: 'GH₵ 95', status: 'Pending' },
          ].map(order => (
            <div key={order.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{order.id}</p>
                <p style={{color: '#555', fontSize: '0.85rem'}}>{order.product}</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{fontWeight: 'bold', color: '#006B3F', fontSize: '0.9rem'}}>{order.amount}</p>
                <span style={{
                  backgroundColor: order.status === 'Pending' ? '#FFF3CD' : '#D4EDDA',
                  color: order.status === 'Pending' ? '#856404' : '#155724',
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* My Products */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#131921'}}>My Products</h3>
            <button style={{backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'}}>
              + Add Product
            </button>
          </div>

          {[
            { name: 'Wireless Headphones', price: 'GH₵ 250', stock: 8 },
            { name: 'Smart Watch', price: 'GH₵ 420', stock: 3 },
            { name: 'Ladies Sandals', price: 'GH₵ 95', stock: 15 },
            { name: 'Face Moisturizer', price: 'GH₵ 60', stock: 20 },
          ].map((product, index) => (
            <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{product.name}</p>
                <p style={{color: '#006B3F', fontSize: '0.85rem', fontWeight: 'bold'}}>{product.price}</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{color: '#555', fontSize: '0.85rem'}}>Stock: {product.stock}</p>
                <span style={{color: '#006B3F', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold'}}>Edit</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default SellerDashboard