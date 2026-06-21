import { useState, useEffect } from 'react'
import { getProducts } from './api'

function ProductGrid({ setPage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts()
        setProducts(res.data)
      } catch (err) {
        setError('Failed to load products')
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) return (
    <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: '#555'}}>
      Loading products...
    </div>
  )

  if (error) return (
    <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: 'red'}}>
      {error}
    </div>
  )

  if (products.length === 0) return (
    <div style={{textAlign: 'center', padding: '60px'}}>
      <p style={{fontSize: '1.2rem', color: '#555', marginBottom: '16px'}}>No products available yet.</p>
      <p style={{color: '#888'}}>Be the first to sell on Yoiwa Shops!</p>
    </div>
  )

  return (
    <div style={{padding: '40px 20px', backgroundColor: '#EAEDED'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#131921'}}>Featured Products</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
        {products.map(product => (
          <div key={product._id} style={{backgroundColor: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer'}}>
            <div style={{backgroundColor: '#EAEDED', height: '150px', borderRadius: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'}}>
              {product.image ? <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} /> : '📦 No Image'}
            </div>
            <p style={{fontSize: '0.8rem', color: '#006B3F', marginBottom: '4px'}}>{product.category}</p>
            <p style={{fontWeight: 'bold', marginBottom: '8px', color: '#131921'}}>{product.name}</p>
            <p style={{color: '#006B3F', fontWeight: 'bold', marginBottom: '4px'}}>GH₵ {product.price}</p>
            <p style={{color: '#888', fontSize: '0.8rem', marginBottom: '12px'}}>Stock: {product.stock}</p>
            <button style={{width: '100%', backgroundColor: '#FCD116', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductGrid