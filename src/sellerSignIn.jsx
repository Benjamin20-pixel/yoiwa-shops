import { useState } from 'react'
import { loginUser } from './api'

function SellerSignIn({ setPage }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password
      })

      const user = res.data.user

      if (user.role !== 'seller') {
        return setError('This account is not a seller account. Please use the customer Sign In.')
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(user))
      setPage('seller')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px'}}>
      
      <h1 onClick={() => setPage('home')} style={{color: '#FCD116', fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer'}}>Yoiwa Shops</h1>

      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Seller Sign In</h2>
        <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '20px'}}>Sign in to manage your Yoiwa Shops store</p>

        {error && <p style={{color: 'red', marginBottom: '16px', fontSize: '0.9rem', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>{error}</p>}

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '16px'}}>
          {loading ? 'Signing In...' : 'Sign In to My Store'}
        </button>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem'}}>
          New seller? <span onClick={() => setPage('sellerregister')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Create a seller account</span>
        </p>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem', marginTop: '8px'}}>
          Are you a customer? <span onClick={() => setPage('signin')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Customer Sign In</span>
        </p>

      </div>
    </div>
  )
}

export default SellerSignIn