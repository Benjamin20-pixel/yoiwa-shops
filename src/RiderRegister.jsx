import { useState } from 'react'
import { registerUser } from './api'

function RiderRegister({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: '',
    licenseNumber: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const vehicleTypes = [
    'Motorcycle',
    'Bicycle',
    'Car',
    'Tricycle (Aboboyaa)',
    'On Foot'
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.name || !form.email || !form.phone || !form.password || !form.vehicleType) {
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
        role: 'rider',
        vehicleType: form.vehicleType,
        licenseNumber: form.licenseNumber
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setPage('rider')
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

        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Become a Rider</h2>
        <p style={{color: '#555', fontSize: '0.9rem', marginBottom: '24px'}}>Join our delivery team and earn money in Asankrangwa!</p>

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

        <h3 style={{fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#006B3F'}}>Delivery Information</h3>

        <div style={{marginBottom: '14px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>Vehicle Type *</label>
          <select name="vehicleType" value={form.vehicleType} onChange={handleChange}
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white'}}
          >
            <option value="">Select your vehicle type</option>
            {vehicleTypes.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div style={{marginBottom: '24px'}}>
          <label style={{display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#131921'}}>License Number (optional)</label>
          <input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="Enter your license number if applicable"
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'}}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{width: '100%', backgroundColor: '#006B3F', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '16px'}}>
          {loading ? 'Creating Account...' : 'Join as a Rider'}
        </button>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem'}}>
          Already have a rider account? <span onClick={() => setPage('ridersignin')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Sign In</span>
        </p>

        <p style={{textAlign: 'center', color: '#555', fontSize: '0.9rem', marginTop: '8px'}}>
          Are you a customer? <span onClick={() => setPage('home')} style={{color: '#006B3F', cursor: 'pointer', fontWeight: 'bold'}}>Go to Home</span>
        </p>

      </div>
    </div>
  )
}

export default RiderRegister