function AdminDashboard({ setPage }) {
  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <div>
          <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>Admin Dashboard</h2>
          <p style={{color: '#555', fontSize: '0.9rem'}}>Yoiwa Shops — Asankrangwa Control Panel 🇬🇭</p>
        </div>
        <button onClick={() => setPage('home')} style={{backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          View Store
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Revenue</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#006B3F'}}>GH₵ 28,450</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Orders</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>214</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>This month</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Sellers</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>18</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Active sellers</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '8px'}}>Total Customers</p>
          <p style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>342</p>
          <p style={{color: '#aaa', fontSize: '0.8rem'}}>Registered users</p>
        </div>

      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>

        {/* Recent Orders */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Recent Orders</h3>

          {[
            { id: '#YS-00124', customer: 'Ama Mensah', amount: 'GH₵ 620', status: 'Pending' },
            { id: '#YS-00123', customer: 'Kwame Asante', amount: 'GH₵ 180', status: 'Delivered' },
            { id: '#YS-00122', customer: 'Abena Osei', amount: 'GH₵ 420', status: 'Delivered' },
            { id: '#YS-00121', customer: 'Kofi Boateng', amount: 'GH₵ 95', status: 'Pending' },
            { id: '#YS-00120', customer: 'Akua Frimpong', amount: 'GH₵ 250', status: 'Delivered' },
          ].map(order => (
            <div key={order.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{order.id}</p>
                <p style={{color: '#555', fontSize: '0.85rem'}}>{order.customer}</p>
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

        {/* Sellers */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Sellers</h3>

          {[
            { name: 'Kofi\'s Electronics', products: 12, sales: 'GH₵ 4,250', status: 'Active' },
            { name: 'Ama Fashion House', products: 8, sales: 'GH₵ 2,100', status: 'Active' },
            { name: 'Asankrangwa Mart', products: 20, sales: 'GH₵ 6,800', status: 'Active' },
            { name: 'Kwame Beauty', products: 5, sales: 'GH₵ 980', status: 'Suspended' },
          ].map((seller, index) => (
            <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
              <div>
                <p style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#131921'}}>{seller.name}</p>
                <p style={{color: '#555', fontSize: '0.85rem'}}>{seller.products} products · {seller.sales}</p>
              </div>
              <span style={{
                backgroundColor: seller.status === 'Active' ? '#D4EDDA' : '#F8D7DA',
                color: seller.status === 'Active' ? '#155724' : '#721C24',
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
              }}>
                {seller.status}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Customers */}
      <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Recent Customers</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
          {[
            { name: 'Ama Mensah', orders: 5, spent: 'GH₵ 1,200' },
            { name: 'Kwame Asante', orders: 3, spent: 'GH₵ 680' },
            { name: 'Abena Osei', orders: 8, spent: 'GH₵ 2,100' },
            { name: 'Kofi Boateng', orders: 2, spent: 'GH₵ 340' },
          ].map((customer, index) => (
            <div key={index} style={{backgroundColor: '#EAEDED', borderRadius: '8px', padding: '16px'}}>
              <p style={{fontWeight: 'bold', color: '#131921', marginBottom: '4px'}}>{customer.name}</p>
              <p style={{color: '#555', fontSize: '0.85rem'}}>{customer.orders} orders</p>
              <p style={{color: '#006B3F', fontWeight: 'bold', fontSize: '0.9rem'}}>{customer.spent} spent</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard