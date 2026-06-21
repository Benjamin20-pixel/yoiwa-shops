const cartItems = [
  { id: 1, name: 'Wireless Headphones', price: 250, quantity: 1, category: 'Electronics' },
  { id: 2, name: 'Men\'s Casual Shirt', price: 85, quantity: 2, category: 'Fashion' },
  { id: 3, name: 'Rice Cooker', price: 180, quantity: 1, category: 'Home' },
]

function Cart({ setPage }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>
      <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#131921'}}>Your Cart 🛒</h2>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px'}}>
        
        {/* Cart Items */}
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'center'}}>
              <div style={{backgroundColor: '#EAEDED', width: '100px', height: '100px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                📦
              </div>
              <div style={{flex: 1}}>
                <p style={{fontSize: '0.8rem', color: '#006B3F', marginBottom: '4px'}}>{item.category}</p>
                <p style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px', color: '#131921'}}>{item.name}</p>
                <p style={{color: '#006B3F', fontWeight: 'bold', marginBottom: '12px'}}>GH₵ {item.price}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <span style={{color: '#555'}}>Qty: {item.quantity}</span>
                  <span style={{color: 'red', cursor: 'pointer', fontSize: '0.9rem'}}>Remove</span>
                </div>
              </div>
              <p style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#131921'}}>GH₵ {item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Order Summary</h3>
            
            {cartItems.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555'}}>
                <span>{item.name} x{item.quantity}</span>
                <span>GH₵ {item.price * item.quantity}</span>
              </div>
            ))}

            <div style={{borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: '#131921'}}>
              <span>Total</span>
              <span>GH₵ {total}</span>
            </div>

            <button onClick={() => setPage('checkout')} style={{width: '100%', backgroundColor: '#FCD116', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '20px'}}>
              Proceed to Checkout
            </button>

            <p onClick={() => setPage('home')} style={{textAlign: 'center', color: '#006B3F', cursor: 'pointer', marginTop: '12px', fontSize: '0.9rem', fontWeight: 'bold'}}>
              Continue Shopping
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart