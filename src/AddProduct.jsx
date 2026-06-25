import { useState } from 'react'
import { addProduct, uploadImage } from './api'

function AddProduct({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = [
    'Electronics', 'Fashion', 'Home', 'Beauty',
    'Food', 'Agriculture', 'Services', 'Other'
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.name || !form.description || !form.price || !form.category || !form.stock) {
      return setError('Please fill in all required fields')
    }

    setLoading(true)
    try {
      let imageUrl = ''

      if (image) {
        setUploading(true)
        const formData = new FormData()
        formData.append('image', image)
        const uploadRes = await uploadImage(formData)
        imageUrl = uploadRes.data.imageUrl
        setUploading(false)
      }

      await addProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        image: imageUrl
      })

      setSuccess(true)
      setTimeout(() => {
        setPage('seller')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', padding: '30px 20px'}}>

      <div style={{display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px'}}>
        <p onClick={() => setPage('seller')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>
          Back to Dashboard
        </p>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '30px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#131921'}}>Add New Product</h2>

        {error && <p style={{color: 'red', marginBottom: '16px', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>{error}</p>}

        {success && <p style={{color: '#006B3F', marginBottom: '16px', backgroundColor: '#e6f5ec', padding: '10px', borderRadius: '4px'}}>Product added successfully! Redirecting...</p>}

        {/* Image Upload */}
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#131921'}}>Product Image</label>
          
          <div style={{border: '2px dashed #ccc', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '12px', cursor: 'pointer'}}
            onClick={() => document.getElementById('imageInput').click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px'}} />
            ) : (
              <div>
                <p style={{fontSize: '2rem', marginBottom: '8px'}}>📷</p>
                <p style={{color: '#555'}}>Click to upload product image</p>
                <p style={{color: '#888', fontSize: '0.8rem'}}>JPG, PNG, WEBP accepted</p>
              </div>
            )}
          </div>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
          {imagePreview && (
            <button onClick={() => { setImage(null); setImagePreview(null) }}
              style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem'}}>
              Remove image
            </button>
          )}
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Product Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter product name"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product..."
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', height: '100px', resize: 'none'}}
          />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
          <div>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Price (GH₵) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00"
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            />
          </div>
          <div>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0"
              style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
            />
          </div>
        </div>

        <div style={{marginBottom: '24px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white'}}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}>
          {uploading ? 'Uploading Image...' : loading ? 'Adding Product...' : 'Add Product'}
        </button>

      </div>
    </div>
  )
}

export default AddProduct