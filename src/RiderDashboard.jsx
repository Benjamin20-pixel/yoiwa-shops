import { useState } from 'react'
import axios from 'axios'

function RiderDashboard({ setPage }) {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [delivered, setDelivered] = useState(false)

  const token = localStorage.getItem('token')

  const fetchOrder = async () => {
    setError('')
    setOrder(null)
    setDelivered(false)
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrder(res.data)
    } catch (err) {
      setError('Order not found. Please check the Order ID.')
    }
    setLoading(false)
  }

  const markDelivered = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`,
        { status: 'delivered' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setDelivered(true)
    } catch (err) {
      setError('Failed to update order status.')
    }
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <div>
          <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921'}}>Rider Dashboard</h2>
          <p style={{color: '#555', fontSize: '0.9rem'}}>Enter an Order ID to see delivery details</p>
        </div>
        <button onClick={() => setPage('home')} style={{backgroundColor: '#131921', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          Home
        </button>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Enter Order ID</h3>
        <div style={{display: 'flex', gap: '12px'}}>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter the Order ID given by the seller"
            style={{flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none'}}
          />
          <button onClick={fetchOrder} disabled={loading} style={{backgroundColor: '#FCD116', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'}}>
            {loading ? 'Searching...' : 'Find Order'}
          </button>
        </div>
        {error && <p style={{color: 'red', marginTop: '12px', fontSize: '0.9rem'}}>{error}</p>}
      </div>

      {order && (
        <div>

          <div style={{backgroundColor: delivered ? '#D4EDDA' : '#FFF3CD', borderRadius: '8px', padding: '16px', marginBottom: '20px', textAlign: 'center'}}>
            <p style={{fontWeight: 'bold', fontSize: '1.1rem', color: delivered ? '#155724' : '#856404'}}>
              {delivered ? 'Order Marked as Delivered!' : 'Order Status: ' + order.status.toUpperCase()}
            </p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>

            <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Customer Details</h3>

              <div style={{marginBottom: '12px'}}>
                <p style={{color: '#555', fontSize: '0.85rem', marginBottom: '4px'}}>Name</p>
                <p style={{fontWeight: 'bold', color: '#131921'}}>{order.delivery.name}</p>
              </div>

              <div style={{marginBottom: '12px'}}>
                <p style={{color: '#555', fontSize: '0.85rem', marginBottom: '4px'}}>Phone Number</p>
                <a href={'tel:' + order.delivery.phone} style={{fontWeight: 'bold', color: '#006B3F', fontSize: '1.1rem', textDecoration: 'none'}}>
                  {order.delivery.phone}
                </a>
              </div>

              <div style={{marginBottom: '12px'}}>
                <p style={{color: '#555', fontSize: '0.85rem', marginBottom: '4px'}}>House Description</p>
                <p style={{fontWeight: 'bold', color: '#131921'}}>{order.delivery.description || 'No description provided'}</p>
              </div>

              <div>
                <p style={{color: '#555', fontSize: '0.85rem', marginBottom: '8px'}}>Delivery Location</p>
                {order.delivery.pinLocation && order.delivery.pinLocation.lat ? (
                  <div>
                    <p style={{fontWeight: 'bold', color: '#131921', marginBottom: '8px'}}>
                      {order.delivery.pinLocation.lat.toFixed(4)}, {order.delivery.pinLocation.lng.toFixed(4)}
                    </p>
                    
                    <a
                      href={'https://www.google.com/maps/dir/?api=1&destination=' + order.delivery.pinLocation.lat + ',' + order.delivery.pinLocation.lng + '&travelmode=driving'}
                      target="_blank"
                      rel="noreferrer"
                      style={{display: 'block', backgroundColor: '#006B3F', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem', marginBottom: '8px'}}
                    >
                      Get Directions on Google Maps
                    </a>
                    
                    <a
                      href={'https://waze.com/ul?ll=' + order.delivery.pinLocation.lat + ',' + order.delivery.pinLocation.lng + '&navigate=yes'}
                      target="_blank"
                      rel="noreferrer"
                      style={{display: 'block', backgroundColor: '#33CCFF', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem'}}
                    >
                      Get Directions on Waze
                    </a>
                  </div>
                ) : (
                  <p style={{fontWeight: 'bold', color: '#131921'}}>No pin location set</p>
                )}
              </div>
            </div>

            <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Items to Deliver</h3>

              {order.items.map((item, index) => (
                <div key={index} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee'}}>
                  <div>
                    <p style={{fontWeight: 'bold', color: '#131921'}}>{item.name}</p>
                    <p style={{color: '#555', fontSize: '0.85rem'}}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{fontWeight: 'bold', color: '#006B3F'}}>GH₵ {item.price * item.quantity}</p>
                </div>
              ))}

              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 'bold', fontSize: '1.1rem', color: '#131921'}}>
                <span>Total</span>
                <span>GH₵ {order.total}</span>
              </div>

              <div style={{marginTop: '16px'}}>
                <p style={{color: '#555', fontSize: '0.85rem', marginBottom: '4px'}}>Payment Method</p>
                <p style={{fontWeight: 'bold', color: '#131921'}}>{order.payment.method}</p>
                <p style={{color: '#555', fontSize: '0.85rem', marginTop: '4px'}}>
                  Status: <span style={{color: order.payment.status === 'paid' ? '#006B3F' : '#856404'}}>{order.payment.status}</span>
                </p>
              </div>

              {!delivered && order.status !== 'delivered' && (
                <button 
                  onClick={markDelivered} 
                  style={{marginTop: '24px', width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem'}}
                >
                  Mark as Delivered
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default RiderDashboard
