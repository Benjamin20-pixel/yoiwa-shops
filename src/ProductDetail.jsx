import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { addToCart } from './cartUtils'

// Move API URL to environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ProductDetail({ setPage, productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState('')
  const [imageLoading, setImageLoading] = useState(true)

  // Memoized API URL for product
  const productApiUrl = useMemo(() => 
    `${API_URL}/api/products/${productId}`,
    [productId]
  )

  // Fetch product on mount or when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('Product ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const res = await axios.get(productApiUrl)
        
        if (!res.data) {
          throw new Error('Product not found')
        }
        
        setProduct(res.data)
        // Reset quantity when product changes
        setQuantity(1)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.response?.data?.message || 'Failed to load product. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, productApiUrl])

  // Handle adding to cart
  const handleAddToCart = useCallback(async () => {
    if (!product) return
    
    // Validate quantity
    if (quantity < 1) {
      setAddError('Quantity must be at least 1')
      return
    }
    
    if (quantity > product.stock) {
      setAddError(`Only ${product.stock} items available in stock`)
      return
    }

    setAddError('')
    setIsAdding(true)

    try {
      // Use the imported utility function
      const result = addToCart(product, quantity)
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      
      setAdded(true)
      setAddError('')
      
      // Reset added state after 2.5 seconds
      setTimeout(() => {
        setAdded(false)
        setIsAdding(false)
      }, 2500)
    } catch (err) {
      console.error('Error adding to cart:', err)
      setAddError('Failed to add item to cart. Please try again.')
      setIsAdding(false)
    }
  }, [product, quantity])

  // Handle Buy Now (add to cart and navigate to checkout)
  const handleBuyNow = useCallback(async () => {
    if (!product) return
    
    // First add to cart
    await handleAddToCart()
    
    // Navigate to cart after a brief delay
    setTimeout(() => {
      setPage('cart')
    }, 300)
  }, [handleAddToCart, setPage])

  // Handle quantity change with validation
  const handleQuantityChange = useCallback((newQuantity) => {
    if (!product) return
    
    // Validate quantity range
    const validQuantity = Math.max(1, Math.min(product.stock, newQuantity))
    setQuantity(validQuantity)
    setAddError('') // Clear any previous errors
  }, [product])

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageLoading(false)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#EAEDED',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #EAEDED',
            borderTop: '4px solid #006B3F',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{fontSize: '1.2rem', color: '#555'}}>
            Loading product...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
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
        <p style={{fontSize: '3rem', marginBottom: '16px'}}>😕</p>
        <p style={{fontSize: '1.2rem', color: 'red', marginBottom: '16px'}}>
          {error || 'Product not found'}
        </p>
        <button 
          onClick={() => setPage('home')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#006B3F',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#005a33'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#006B3F'}
        >
          Back to Products
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
      {/* Back button */}
      <button 
        onClick={() => setPage('home')}
        style={{
          color: '#006B3F',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          borderRadius: '4px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,107,63,0.1)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        ← Back to Products
      </button>

      {/* Product details card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Product Image */}
        <div style={{
          backgroundColor: '#EAEDED',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '350px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {imageLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#888'
            }}>
              Loading image...
            </div>
          )}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name || 'Product image'}
              onError={handleImageError}
              style={{
                width: '100%',
                height: '350px',
                objectFit: 'cover',
                borderRadius: '8px',
                display: imageLoading ? 'none' : 'block'
              }}
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div style={{textAlign: 'center', color: '#888'}}>
              <p style={{fontSize: '4rem'}}>📦</p>
              <p>No Image Available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          <p style={{
            color: '#006B3F',
            fontSize: '0.9rem',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            {product.category}
          </p>

          {/* Product Name */}
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#131921',
            marginBottom: '16px'
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#006B3F',
            marginBottom: '16px'
          }}>
            GH₵ {parseFloat(product.price).toFixed(2)}
          </p>

          {/* Seller Info */}
          <div style={{
            backgroundColor: '#EAEDED',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '4px'}}>
              Sold by
            </p>
            <p style={{fontWeight: 'bold', color: '#131921'}}>
              {product.seller?.name || 'Yoiwa Shops'}
            </p>
          </div>

          {/* Description */}
          <div style={{marginBottom: '20px'}}>
            <p style={{fontWeight: 'bold', color: '#131921', marginBottom: '8px'}}>
              Description
            </p>
            <p style={{color: '#555', lineHeight: '1.6'}}>
              {product.description || 'No description available'}
            </p>
          </div>

          {/* Stock Status */}
          <div style={{marginBottom: '20px'}}>
            <p style={{
              color: product.stock > 0 ? '#006B3F' : '#ff6b6b',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: product.stock > 0 ? '#006B3F' : '#ff6b6b'
              }} />
              {product.stock > 0 
                ? `In Stock (${product.stock} available)` 
                : 'Out of Stock'}
            </p>
          </div>

          {/* Add to Cart Section */}
          {product.stock > 0 ? (
            <>
              {/* Error message */}
              {addError && (
                <p style={{
                  color: '#ff6b6b',
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#fff0f0',
                  borderRadius: '4px'
                }}>
                  {addError}
                </p>
              )}

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <label htmlFor="quantity" style={{
                  fontWeight: 'bold',
                  color: '#131921'
                }}>
                  Quantity:
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isAdding}
                    style={{
                      backgroundColor: '#EAEDED',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      cursor: (quantity <= 1 || isAdding) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      opacity: (quantity <= 1 || isAdding) ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span 
                    id="quantity"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      minWidth: '30px',
                      textAlign: 'center',
                      color: '#131921'
                    }}
                  >
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || isAdding}
                    style={{
                      backgroundColor: '#EAEDED',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      cursor: (quantity >= product.stock || isAdding) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      opacity: (quantity >= product.stock || isAdding) ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {quantity >= product.stock && (
                  <span style={{
                    color: '#ff6b6b',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    (Max)
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  style={{
                    flex: 1,
                    backgroundColor: added ? '#006B3F' : '#FCD116',
                    color: added ? 'white' : '#131921',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isAdding ? 'not-allowed' : 'pointer',
                    opacity: isAdding ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdding && !added) {
                      e.target.style.backgroundColor = '#E5B800'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdding && !added) {
                      e.target.style.backgroundColor = '#FCD116'
                    }
                  }}
                >
                  {isAdding ? (
                    <>
                      <span style={{marginRight: '8px'}}>⏳</span>
                      Adding...
                    </>
                  ) : added ? (
                    <>✓ Added to Cart!</>
                  ) : (
                    <>Add to Cart</>
                  )}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={isAdding}
                  style={{
                    flex: 1,
                    backgroundColor: '#131921',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: isAdding ? 'not-allowed' : 'pointer',
                    opacity: isAdding ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#131921'}
                >
                  Buy Now
                </button>
              </div>

              {/* Additional info */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: '#555'
              }}>
                <p>🚚 Delivery available in Asankrangwa area</p>
                <p style={{marginTop: '4px'}}>💰 Free delivery on orders above GH₵ 100</p>
              </div>
            </>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#fff0f0',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <p style={{fontSize: '2rem', marginBottom: '8px'}}>😔</p>
              <p style={{color: '#ff6b6b', fontWeight: 'bold'}}>
                This product is currently out of stock
              </p>
              <p style={{color: '#888', fontSize: '0.9rem', marginTop: '8px'}}>
                Check back later or browse other products
              </p>
              <button
                onClick={() => setPage('home')}
                style={{
                  marginTop: '12px',
                  padding: '10px 24px',
                  backgroundColor: '#006B3F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail