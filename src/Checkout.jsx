import { useState, useEffect, useCallback, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { addOrder } from './api'
import { getCart, clearCart, getCartTotal, getCartCount } from './cartUtils'

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ASANKRANGWA = { lat: 5.7836, lng: -2.4167 }
const DELIVERY_FEE = 20
const FREE_DELIVERY_THRESHOLD = 100

// Auto-locate component
function AutoLocate({ onLocationFound, onLocationError }) {
  const map = useMap()

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 17 })
    
    const handleLocationFound = (e) => {
      onLocationFound(e.latlng)
    }
    
    const handleLocationError = () => {
      console.log('Could not get location, using Asankrangwa default')
      if (onLocationError) {
        onLocationError()
      }
    }

    map.on('locationfound', handleLocationFound)
    map.on('locationerror', handleLocationError)

    return () => {
      map.off('locationfound', handleLocationFound)
      map.off('locationerror', handleLocationError)
    }
  }, [map, onLocationFound, onLocationError])

  return null
}

// Location picker component
function LocationPicker({ onLocationSelect, position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng)
    }
  })
  return position ? <Marker position={position} /> : null
}

function Checkout({ setPage }) {
  // Get cart items from localStorage
  const cartItems = useMemo(() => getCart(), [])
  
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
  const [locationError, setLocationError] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Calculate totals using real cart data
  const subtotal = useMemo(() => getCartTotal(cartItems), [cartItems])
  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems])
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      // Redirect to cart or show message
      setError('Your cart is empty. Please add some items before checking out.')
    }
  }, [cartItems, orderPlaced])

  // Handle form changes
  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // Clear error when user types
    if (error) setError('')
  }, [error])

  // Handle location found
  const handleLocationFound = useCallback((latlng) => {
    setPinLocation(latlng)
    setPosition(latlng)
    setLocationError(false)
  }, [])

  // Handle location error
  const handleLocationError = useCallback(() => {
    setLocationError(true)
    // Set default position to Asankrangwa
    setPinLocation(ASANKRANGWA)
    setPosition(ASANKRANGWA)
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    if (!form.name.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (form.phone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)')
      return false
    }
    if (!form.momoNumber.trim()) {
      setError('Please enter your Mobile Money number')
      return false
    }
    if (form.momoNumber.length < 10) {
      setError('Please enter a valid Mobile Money number (at least 10 digits)')
      return false
    }
    if (!pinLocation) {
      setError('Please wait for your location to load or click on the map to set your delivery location')
      return false
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add some items before checking out.')
      return false
    }
    return true
  }, [form, pinLocation, cartItems])

  // Handle place order
  const handlePlaceOrder = useCallback(async () => {
    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get token
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please sign in to place an order')
        setPage('signin')
        setLoading(false)
        return
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          category: item.category || 'General'
        })),
        delivery: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          pinLocation: {
            lat: pinLocation.lat,
            lng: pinLocation.lng
          },
          description: form.description.trim() || 'No description provided'
        },
        payment: {
          method: form.paymentMethod,
          momoNumber: form.momoNumber.trim(),
          status: 'pending'
        },
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total
      }

      // Send order to backend
      const response = await addOrder(orderData)
      
      // Clear cart after successful order
      clearCart()
      setOrderPlaced(true)
      
      // Navigate to confirmation page
      setPage('confirmation')
    } catch (err) {
      console.error('Error placing order:', err)
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [validateForm, form, pinLocation, cartItems, subtotal, deliveryFee, total, setPage])

  // Handle back to cart
  const handleBackToCart = useCallback(() => {
    setPage('cart')
  }, [setPage])

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    setPage('home')
  }, [setPage])

  // Empty cart state
  if (cartItems.length === 0 && !loading) {
    return (
      <div style={{
        backgroundColor: '#EAEDED',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <p style={{fontSize: '4rem', marginBottom: '16px'}}>🛒</p>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#131921', marginBottom: '8px'}}>
          Your cart is empty
        </h2>
        <p style={{color: '#555', marginBottom: '24px'}}>
          You need to add items to your cart before checking out.
        </p>
        <button 
          onClick={handleContinueShopping}
          style={{
            backgroundColor: '#FCD116',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E5B800'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FCD116'}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#EAEDED',
      minHeight: '100vh',
      padding: '30px 20px'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#131921'
      }}>
        Checkout ({cartCount} items)
      </h2>

      {/* Error message */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '20px'
      }}>
        {/* Left Column - Forms */}
        <div>
          {/* Delivery Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#131921'
            }}>
              Delivery Details
            </h3>

            <div style={{marginBottom: '14px'}}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '6px',
                color: '#131921'
              }}>
                Full Name <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{marginBottom: '14px'}}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '6px',
                color: '#131921'
              }}>
                Phone Number <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0240000000"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#888',
                marginTop: '4px'
              }}>
                Rider will call this number for delivery
              </p>
            </div>

            <div style={{marginBottom: '14px'}}>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '6px',
                color: '#131921'
              }}>
                House Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Red roof house, blue gate, near the market"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Location Picker */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#131921'
            }}>
              Your Delivery Location
            </h3>
            <p style={{
              color: '#555',
              fontSize: '0.9rem',
              marginBottom: '16px'
            }}>
              Your location is detected automatically. You can also click on the map to adjust your pin.
            </p>

            {pinLocation && (
              <p style={{
                color: '#006B3F',
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '0.9rem'
              }}>
                📍 Location set: {pinLocation.lat.toFixed(6)}, {pinLocation.lng.toFixed(6)}
              </p>
            )}

            {!pinLocation && !locationError && (
              <p style={{
                color: '#856404',
                backgroundColor: '#FFF3CD',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '12px',
                fontSize: '0.9rem'
              }}>
                🔍 Detecting your location... Please allow location access if prompted.
              </p>
            )}

            {locationError && !pinLocation && (
              <p style={{
                color: '#856404',
                backgroundColor: '#FFF3CD',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '12px',
                fontSize: '0.9rem'
              }}>
                📍 Could not detect location. Defaulting to Asankrangwa. Click on the map to set your exact location.
              </p>
            )}

            <MapContainer
              center={ASANKRANGWA}
              zoom={15}
              style={{ height: '350px', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <AutoLocate
                onLocationFound={handleLocationFound}
                onLocationError={handleLocationError}
              />
              <LocationPicker
                onLocationSelect={setPinLocation}
                position={position}
                setPosition={setPosition}
              />
            </MapContainer>

            <p style={{
              fontSize: '0.8rem',
              color: '#888',
              marginTop: '8px'
            }}>
              💡 Click anywhere on the map to adjust your delivery location
            </p>
          </div>

          {/* Payment Method */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#131921'
            }}>
              Payment Method
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money'].map(method => (
                <label
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    border: form.paymentMethod === method ? '2px solid #006B3F' : '1px solid #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: form.paymentMethod === method ? '#f0faf5' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                  />
                  <span style={{fontWeight: 'bold'}}>{method}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '1.2rem'
                  }}>
                    {method === 'MTN Mobile Money' && '📱'}
                    {method === 'Vodafone Cash' && '📱'}
                    {method === 'AirtelTigo Money' && '📱'}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '6px',
                color: '#131921'
              }}>
                Mobile Money Number <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="tel"
                name="momoNumber"
                value={form.momoNumber}
                onChange={handleChange}
                placeholder="Enter your MoMo number (e.g. 0240000000)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{
                fontSize: '0.8rem',
                color: '#888',
                marginTop: '4px'
              }}>
                We'll send a payment request to this number
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#131921'
            }}>
              Order Summary
            </h3>

            {/* Items */}
            {cartItems.map(item => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  color: '#555'
                }}
              >
                <span>
                  {item.name.length > 25 
                    ? item.name.substring(0, 25) + '...' 
                    : item.name} 
                  x{item.quantity}
                </span>
                <span>GH₵ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</span>
              </div>
            ))}

            {/* Subtotal */}
            <div style={{
              borderTop: '1px solid #eee',
              marginTop: '12px',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              color: '#555',
              marginBottom: '8px'
            }}>
              <span>Subtotal ({cartCount} items)</span>
              <span>GH₵ {subtotal.toFixed(2)}</span>
            </div>

            {/* Delivery Fee */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              color: '#555',
              marginBottom: '8px'
            }}>
              <span>Delivery Fee</span>
              <span style={{
                color: deliveryFee === 0 ? '#006B3F' : '#555'
              }}>
                {deliveryFee === 0 ? 'FREE 🎉' : `GH₵ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            {deliveryFee === 0 && (
              <div style={{
                fontSize: '0.8rem',
                color: '#006B3F',
                marginBottom: '8px',
                padding: '4px 8px',
                backgroundColor: '#e6f5ec',
                borderRadius: '4px'
              }}>
                🎉 Free delivery for orders over GH₵ {FREE_DELIVERY_THRESHOLD}!
              </div>
            )}

            {/* Total */}
            <div style={{
              borderTop: '1px solid #eee',
              marginTop: '12px',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: '#131921'
            }}>
              <span>Total</span>
              <span>GH₵ {total.toFixed(2)}</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              style={{
                width: '100%',
                backgroundColor: '#006B3F',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: (loading || cartItems.length === 0) ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                opacity: (loading || cartItems.length === 0) ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading && cartItems.length > 0) {
                  e.target.style.backgroundColor = '#005a33'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && cartItems.length > 0) {
                  e.target.style.backgroundColor = '#006B3F'
                }
              }}
            >
              {loading ? '⏳ Placing Order...' : 'Place Order'}
            </button>

            {/* Back to Cart */}
            <p
              onClick={handleBackToCart}
              style={{
                textAlign: 'center',
                color: '#006B3F',
                cursor: 'pointer',
                marginTop: '12px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              ← Back to Cart
            </p>

            {/* Continue Shopping */}
            <p
              onClick={handleContinueShopping}
              style={{
                textAlign: 'center',
                color: '#888',
                cursor: 'pointer',
                marginTop: '4px',
                fontSize: '0.8rem'
              }}
            >
              Continue Shopping
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout