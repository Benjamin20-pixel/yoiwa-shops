import { useState } from 'react'
import { registerUser } from './api'

function Register({ setPage }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setPage('home')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px'}}>
      
      <h1 onClick={() => setPage('home')} style={{color: '#FCD116', fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer'}}>Yoiwa Shops</h1>

      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#131921'}}>Create Account</h2>

        {error && <p style={{color: 'red', marginBottom: '16px', fontSize: '0.9rem'}}>{error}</p>}

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Full Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Phone Number</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 024 000 0000"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{width: '100%', backgroundColor: '#FCD116', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '16px'}}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem'}}>
          Already have an account? <span onClick={() => setPage('signin')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Sign In</span>
        </p>

      </div>
    </div>
  )
}

export default Register