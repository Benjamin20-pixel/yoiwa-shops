import { useState, useEffect, useCallback } from 'react'
import { 
  getCart, 
  removeFromCart, 
  updateQuantity, 
  getCartTotal,
  getCartCount,
  clearCart,
  useCart 
} from './cartUtils'

function Cart({ setPage }) {
  // Using the enhanced useCart hook for better state management
  const { 
    cart: cartItems, 
    cartTotal: total, 
    cartCount,
    removeItem,
    updateItemQuantity,
    clearAll,
    refreshCart
  } = useCart()

  const [loading, setLoading] = useState(false)
  const [removingItem, setRemovingItem] = useState(null)
  const [updatingItem, setUpdatingItem] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const deliveryFee = cartItems.length > 0 ? 20 : 0
  const grandTotal = total + deliveryFee

  // Handle remove with loading state
  const handleRemove = useCallback(async (productId) => {
    if (!productId) return
    
    setRemovingItem(productId)
    try {
      const result = await removeItem(productId)
      if (!result.success) {
        console.error('Failed to remove item:', result.message)
      }
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setRemovingItem(null)
    }
  }, [removeItem])

  // Handle quantity change with loading state
  const handleQuantityChange = useCallback(async (productId, newQuantity, maxStock) => {
    if (!productId) return
    
    // Validate quantity
    if (newQuantity < 0) return
    if (maxStock && newQuantity > maxStock) {
      // You could show a toast notification here
      console.warn(`Cannot add more than ${maxStock} items`)
      return
    }

    setUpdatingItem(productId)
    try {
      const result = await updateItemQuantity(productId, newQuantity, maxStock)
      if (!result.success) {
        console.error('Failed to update quantity:', result.message)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdatingItem(null)
    }
  }, [updateItemQuantity])

  // Handle clear cart
  const handleClearCart = useCallback(async () => {
    setLoading(true)
    try {
      await clearAll()
      setShowClearConfirm(false)
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }, [clearAll])

  // Handle checkout navigation
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return
    setPage('checkout')
  }, [cartItems.length, setPage])

  // Empty cart state
  if (cartItems.length === 0) {
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
          Add some products to get started!
        </p>
        <button 
          onClick={() => setPage('home')} 
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
      {/* Header with cart count and clear button */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          color: '#131921'
        }}>
          Your Cart ({cartCount} items)
        </h2>
        
        <div style={{display: 'flex', gap: '12px'}}>
          {cartItems.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e55a5a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              Clear Cart
            </button>
          )}
          <button
            onClick={() => setPage('home')}
            style={{
              backgroundColor: '#006B3F',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#005a33'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#006B3F'}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{marginBottom: '12px', color: '#131921'}}>Clear Cart?</h3>
            <p style={{color: '#555', marginBottom: '20px'}}>
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#EAEDED',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{
        display: 'grid', 
        gridTemplateColumns: '1fr 300px', 
        gap: '20px'
      }}>
        {/* Cart items */}
        <div>
          {cartItems.map(item => {
            const isUpdating = updatingItem === item._id
            const isRemoving = removingItem === item._id
            
            return (
              <div 
                key={item._id} 
                style={{
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  padding: '20px', 
                  marginBottom: '16px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  display: 'flex', 
                  gap: '20px', 
                  alignItems: 'center',
                  opacity: isRemoving ? 0.5 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Product image */}
                <div style={{
                  backgroundColor: '#EAEDED', 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '4px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '4px'
                      }} 
                    />
                  ) : (
                    <span style={{fontSize: '2rem'}}>📦</span>
                  )}
                </div>

                {/* Product info */}
                <div style={{flex: 1}}>
                  <p style={{
                    fontSize: '0.8rem', 
                    color: '#006B3F', 
                    marginBottom: '4px',
                    fontWeight: 'bold'
                  }}>
                    {item.category}
                  </p>
                  <p style={{
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    marginBottom: '4px', 
                    color: '#131921'
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    color: '#006B3F', 
                    fontWeight: 'bold', 
                    marginBottom: '12px'
                  }}>
                    GH₵ {parseFloat(item.price).toFixed(2)}
                  </p>
                  
                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px'
                  }}>
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px'
                    }}>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.stock)}
                        disabled={isUpdating || item.quantity <= 1}
                        style={{
                          backgroundColor: '#EAEDED', 
                          border: 'none', 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '4px', 
                          fontSize: '1rem', 
                          cursor: (isUpdating || item.quantity <= 1) ? 'not-allowed' : 'pointer', 
                          fontWeight: 'bold',
                          opacity: (isUpdating || item.quantity <= 1) ? 0.5 : 1
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontWeight: 'bold', 
                        minWidth: '24px', 
                        textAlign: 'center'
                      }}>
                        {isUpdating ? '...' : item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.stock)}
                        disabled={isUpdating || (item.stock && item.quantity >= item.stock)}
                        style={{
                          backgroundColor: '#EAEDED', 
                          border: 'none', 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '4px', 
                          fontSize: '1rem', 
                          cursor: (isUpdating || (item.stock && item.quantity >= item.stock)) ? 'not-allowed' : 'pointer', 
                          fontWeight: 'bold',
                          opacity: (isUpdating || (item.stock && item.quantity >= item.stock)) ? 0.5 : 1
                        }}
                      >
                        +
                      </button>
                    </div>
                    <span 
                      onClick={() => handleRemove(item._id)}
                      style={{
                        color: '#ff6b6b', 
                        cursor: isRemoving ? 'not-allowed' : 'pointer', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        opacity: isRemoving ? 0.5 : 1
                      }}
                    >
                      {isRemoving ? 'Removing...' : 'Remove'}
                    </span>
                    {item.stock && item.quantity >= item.stock && (
                      <span style={{
                        color: '#ff6b6b',
                        fontSize: '0.8rem'
                      }}>
                        (Max stock reached)
                      </span>
                    )}
                  </div>
                </div>

                {/* Item subtotal */}
                <p style={{
                  fontWeight: 'bold', 
                  fontSize: '1.1rem', 
                  color: '#131921',
                  minWidth: '80px',
                  textAlign: 'right'
                }}>
                  GH₵ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Order summary */}
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

            {/* Item breakdown */}
            {cartItems.map(item => (
              <div key={item._id} style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px', 
                fontSize: '0.9rem', 
                color: '#555'
              }}>
                <span>
                  {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name} 
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
              <span>GH₵ {total.toFixed(2)}</span>
            </div>

            {/* Delivery fee */}
            <div style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.9rem', 
              color: '#555', 
              marginBottom: '8px'
            }}>
              <span>Delivery Fee</span>
              <span>GH₵ {deliveryFee.toFixed(2)}</span>
            </div>

            {/* Delivery info */}
            <div style={{
              fontSize: '0.8rem', 
              color: '#888', 
              marginBottom: '12px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              📍 Delivery available in Asankrangwa area
            </div>

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
              <span>GH₵ {grandTotal.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              style={{
                width: '100%', 
                backgroundColor: '#FCD116', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                fontSize: '1rem', 
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                opacity: cartItems.length === 0 ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (cartItems.length > 0) {
                  e.target.style.backgroundColor = '#E5B800'
                }
              }}
              onMouseLeave={(e) => {
                if (cartItems.length > 0) {
                  e.target.style.backgroundColor = '#FCD116'
                }
              }}
            >
              Proceed to Checkout
            </button>

            <p 
              onClick={() => setPage('home')} 
              style={{
                textAlign: 'center', 
                color: '#006B3F', 
                cursor: 'pointer', 
                marginTop: '12px', 
                fontSize: '0.9rem', 
                fontWeight: 'bold'
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

export default Cart