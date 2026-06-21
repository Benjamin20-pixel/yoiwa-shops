import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { addOrder } from './api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ASANKRANGWA = { lat: 5.7836, lng: -2.4167 }

function AutoLocate({ onLocationFound }) {
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 17 })
    map.on('locationfound', (e) => {
      onLocationFound(e.latlng)
    })
    map.on('locationerror', () => {
      console.log('Could not get location, using Asankrangwa default')
    })
  }, [map])

  return null
}

function LocationPicker({ onLocationSelect, position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng)
    }
  })
  return position ? <Marker position={position} /> : null
}

const cartItems = [
  { id: 1, name: 'Wireless Headphones', price: 250, quantity: 1 },
  { id: 2, name: "Men's Casual Shirt", price: 85, quantity: 2 },
  { id: 3, name: 'Rice Cooker', price: 180, quantity: 1 },
]

function Checkout({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    description: '',
    momoNumber: '',
    paymentMethod: 'MTN Mobile Money'
  })
  const [pinLocation, setPinLocation] = useState(null)
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 20
  const total = subtotal + deliveryFee

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLocationFound = (latlng) => {
    setPinLocation(latlng)
    setPosition(latlng)
  }

  const handlePlaceOrder = async () => {
    setError('')
    if (!form.name || !form.phone || !form.momoNumber) {
      return setError('Please fill in all required fields')
    }
    if (!pinLocation) {
      return setError('Please wait for your location to load or click on the map')
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setPage('signin')
        return
      }
      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        delivery: {
          name: form.name,
          phone: form.phone,
          pinLocation: {
            lat: pinLocation.lat,
            lng: pinLocation.lng
          },
          description: form.description
        },
        payment: {
          method: form.paymentMethod,
          momoNumber: form.momoNumber,
          status: 'pending'
        },
        total
      }
      await addOrder(orderData)
      setPage('confirmation')
    } catch (err) {
      setError('Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>
      <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#131921'}}>Checkout</h2>

      {error && (
        <p style={{color: 'red', marginBottom: '16px', backgroundColor: '#ffe6e6', padding: '12px', borderRadius: '4px'}}>
          {error}
        </p>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px'}}>

        <div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Delivery Details</h3>

            <div style={{marginBottom: '14px'}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name"
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              />
            </div>

            <div style={{marginBottom: '14px'}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Phone Number * (Rider will call this number)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 024 000 0000"
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              />
            </div>

            <div style={{marginBottom: '14px'}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>House Description (optional)</label>
              <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Red roof house, blue gate, near the market"
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              />
            </div>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px', color: '#131921'}}>Your Delivery Location</h3>
            <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '16px'}}>
              Your location is detected automatically. You can also click on the map to adjust your pin.
            </p>

            {pinLocation && (
              <p style={{color: '#006B3F', fontWeight: 'bold', marginBottom: '12px', fontSize: '0.9rem'}}>
                Location set: {pinLocation.lat.toFixed(4)}, {pinLocation.lng.toFixed(4)}
              </p>
            )}

            {!pinLocation && (
              <p style={{color: '#856404', backgroundColor: '#FFF3CD', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '0.9rem'}}>
                Detecting your location... Please allow location access if prompted.
              </p>
            )}

            <MapContainer center={ASANKRANGWA} zoom={15} style={{height: '350px', borderRadius: '8px'}}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <AutoLocate onLocationFound={handleLocationFound} />
              <LocationPicker
                onLocationSelect={setPinLocation}
                position={position}
                setPosition={setPosition}
              />
            </MapContainer>
          </div>

          <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Payment Method</h3>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
              {['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money'].map(method => (
                <label key={method} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: form.paymentMethod === method ? '2px solid #006B3F' : '1px solid #ccc', borderRadius: '8px', cursor: 'pointer'}}>
                  <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} />
                  <span style={{fontWeight: 'bold'}}>{method}</span>
                </label>
              ))}
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Mobile Money Number *</label>
              <input type="tel" name="momoNumber" value={form.momoNumber} onChange={handleChange} placeholder="Enter your MoMo number"
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
              />
            </div>
          </div>

        </div>

        <div>
          <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '20px'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#131921'}}>Order Summary</h3>

            {cartItems.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555'}}>
                <span>{item.name} x{item.quantity}</span>
                <span>GH&#8373; {item.price * item.quantity}</span>
              </div>
            ))}

            <div style={{borderTop: '1px solid #eee', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '8px'}}>
              <span>Subtotal</span>
              <span>GH&#8373; {subtotal}</span>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '8px'}}>
              <span>Delivery Fee</span>
              <span>GH&#8373; {deliveryFee}</span>
            </div>

            <div style={{borderTop: '1px solid #eee', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: '#131921'}}>
              <span>Total</span>
              <span>GH&#8373; {total}</span>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading} style={{width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '20px'}}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            <p onClick={() => setPage('cart')} style={{textAlign: 'center', color: '#006B3F', cursor: 'pointer', marginTop: '12px', fontSize: '0.9rem', fontWeight: 'bold'}}>
              Back to Cart
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout