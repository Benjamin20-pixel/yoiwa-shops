import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductDetail({ setPage, productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${productId}`)
        setProduct(res.data)
      } catch (err) {
        setError('Failed to load product')
      }
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item._id === product._id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: '#555'}}>
      Loading product...
    </div>
  )

  if (error) return (
    <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: 'red'}}>
      {error}
    </div>
  )

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      {/* Back button */}
      <p onClick={() => setPage('home')} style={{color: '#006B3F', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>
        Back to Products
      </p>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>

        {/* Product Image */}
        <div style={{backgroundColor: '#EAEDED', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px'}}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px'}} />
          ) : (
            <div style={{textAlign: 'center', color: '#888'}}>
              <p style={{fontSize: '4rem'}}>📦</p>
              <p>No Image Available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p style={{color: '#006B3F', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold'}}>{product.category}</p>
          <h1 style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#131921', marginBottom: '16px'}}>{product.name}</h1>
          <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#006B3F', marginBottom: '16px'}}>GH&#8373; {product.price}</p>

          <div style={{backgroundColor: '#EAEDED', borderRadius: '8px', padding: '16px', marginBottom: '20px'}}>
            <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '4px'}}>Sold by</p>
            <p style={{fontWeight: 'bold', color: '#131921'}}>{product.seller?.name || 'Yoiwa Shops'}</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <p style={{fontWeight: 'bold', color: '#131921', marginBottom: '8px'}}>Description</p>
            <p style={{color: '#555', lineHeight: '1.6'}}>{product.description}</p>
          </div>

          <div style={{marginBottom: '20px'}}>
            <p style={{color: product.stock > 0 ? '#006B3F' : 'red', fontWeight: 'bold'}}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>

          {product.stock > 0 && (
            <>
              {/* Quantity selector */}
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <p style={{fontWeight: 'bold', color: '#131921'}}>Quantity:</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{backgroundColor: '#EAEDED', border: 'none', width: '32px', height: '32px', borderRadius: '4px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold'}}>
                    -
                  </button>
                  <span style={{fontSize: '1.1rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center'}}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{backgroundColor: '#EAEDED', border: 'none', width: '32px', height: '32px', borderRadius: '4px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold'}}>
                    +
                  </button>
                </div>
              </div>

              <div style={{display: 'flex', gap: '12px'}}>
                <button onClick={handleAddToCart}
                  style={{flex: 1, backgroundColor: added ? '#006B3F' : '#FCD116', color: added ? 'white' : '#131921', border: 'none', padding: '14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}>
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button onClick={() => { handleAddToCart(); setPage('cart') }}
                  style={{flex: 1, backgroundColor: '#131921', color: 'white', border: 'none', padding: '14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}>
                  Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail