import { useState, useEffect, useMemo } from 'react'
import { getProducts } from './api'

function ProductGrid({ searchQuery, onProductClick }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = useMemo(() => 
    ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Food', 'Agriculture', 'Services'],
    []
  )

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const category = selectedCategory === 'All' ? '' : selectedCategory
        const res = await getProducts(searchQuery || '', category)
        setProducts(res?.data || [])
      } catch (err) {
        setError('Failed to load products. Please try again.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery, selectedCategory])

  // Loading state
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: '#555'}}>
        Loading products...
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '60px', fontSize: '1.2rem', color: 'red'}}>
        {error}
      </div>
    )
  }

  return (
    <div style={{padding: '40px 20px', backgroundColor: '#EAEDED'}}>
      {searchQuery && (
        <p style={{marginBottom: '16px', color: '#555', fontSize: '1rem'}}>
          Showing results for <strong>"{searchQuery}"</strong> — {products.length} product(s) found
        </p>
      )}

      {/* Category filter */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap'}}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              backgroundColor: selectedCategory === cat ? '#006B3F' : 'white',
              color: selectedCategory === cat ? 'white' : '#131921',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#131921'}}>
        {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Featured Products' : selectedCategory}
      </h2>

      {products.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px'}}>
          <p style={{fontSize: '1.2rem', color: '#555', marginBottom: '16px'}}>No products found.</p>
          <p style={{color: '#888'}}>Try a different search or category.</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
          {products.map(product => (
            <div 
              key={product._id} 
              onClick={() => onProductClick?.(product._id)} 
              style={{
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '16px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <div style={{
                backgroundColor: '#EAEDED', 
                height: '150px', 
                borderRadius: '4px', 
                marginBottom: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#888',
                overflow: 'hidden'
              }}>
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name || 'Product image'} 
                    style={{
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '4px'
                    }} 
                  />
                ) : 'No Image'}
              </div>
              <p style={{fontSize: '0.8rem', color: '#006B3F', marginBottom: '4px'}}>
                {product.category}
              </p>
              <p style={{fontWeight: 'bold', marginBottom: '8px', color: '#131921'}}>
                {product.name}
              </p>
              <p style={{color: '#006B3F', fontWeight: 'bold', marginBottom: '4px'}}>
                GH₵ {product.price?.toFixed?.(2) || product.price}
              </p>
              <p style={{color: '#888', fontSize: '0.8rem', marginBottom: '12px'}}>
                Stock: {product.stock}
              </p>
              <button 
                style={{
                  width: '100%', 
                  backgroundColor: '#FCD116', 
                  border: 'none', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent card click when clicking button
                  // Add to cart logic here
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGrid