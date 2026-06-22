import { useState } from 'react'
import { registerUser } from './api'

function SellerRegister({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeDescription: '',
    category: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Beauty & Health',
    'Food & Drinks',
    'Agriculture',
    'Services',
    'Other'
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.name || !form.email || !form.phone || !form.password || !form.storeName) {
      return setError('Please fill in all required fields')
    }

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'seller',
        storeName: form.storeName,
        storeDescription: form.storeDescription,
        category: form.category
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setPage('seller')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', paddingBottom: '40px'}}>

      <h1 onClick={() => setPage('home')} style={{color: '#FCD116', fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', cursor: 'pointer'}}>Yoiwa Shops</h1>
      <p style={{color: '#555', marginBottom: '24px', fontSize: '0.95rem'}}>Asankrangwa's Online Marketplace</p>

      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>

        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Become a Seller</h2>
        <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '24px'}}>Start selling to the Asankrangwa community today!</p>

        {error && <p style={{color: 'red', marginBottom: '16px', fontSize: '0.9rem', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>{error}</p>}

        <h3 style={{fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#006B3F'}}>Personal Information</h3>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Full Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Phone Number *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 024 000 0000"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Password *</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '24px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Confirm Password *</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <h3 style={{fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#006B3F'}}>Store Information</h3>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Store Name *</label>
          <input type="text" name="storeName" value={form.storeName} onChange={handleChange} placeholder="e.g. Kofi's Electronics"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Store Description</label>
          <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} placeholder="Tell customers what you sell..."
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', height: '80px', resize: 'none'}}
          />
        </div>

        <div style={{marginBottom: '24px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Main Product Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white'}}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '16px'}}>
          {loading ? 'Creating Store...' : 'Create Seller Account'}
        </button>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem'}}>
            Already have a seller account? <span onClick={() => setPage('sellersignin')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Sign In</span>
        </p>    

      </div>
    </div>
  )
}

export default SellerRegister