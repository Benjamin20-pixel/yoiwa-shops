function Footer() {
  return (
    <footer style={{backgroundColor: '#131921', color: 'white', padding: '40px 20px', marginTop: '40px'}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px', marginBottom: '30px'}}>
        <div>
          <h3 style={{color: '#FCD116', marginBottom: '12px'}}>Yoiwa Shops</h3>
          <p style={{color: '#aaa', fontSize: '0.9rem'}}>Asankrangwa's one-stop online marketplace 🇬🇭</p>
        </div>
        <div>
          <h4 style={{marginBottom: '12px'}}>Get to Know Us</h4>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer'}}>About Us</p>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer'}}>Careers</p>
          <p style={{color: '#aaa', fontSize: '0.9rem', cursor: 'pointer'}}>Contact Us</p>
        </div>
        <div>
          <h4 style={{marginBottom: '12px'}}>Make Money With Us</h4>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer'}}>Sell on Yoiwa Shops</p>
          <p style={{color: '#aaa', fontSize: '0.9rem', cursor: 'pointer'}}>Become an Affiliate</p>
        </div>
        <div>
          <h4 style={{marginBottom: '12px'}}>Let Us Help You</h4>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer'}}>Your Account</p>
          <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '8px', cursor: 'pointer'}}>Track Your Order</p>
          <p style={{color: '#aaa', fontSize: '0.9rem', cursor: 'pointer'}}>Help Center</p>
        </div>
      </div>
      <div style={{borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem'}}>
        © 2026 Yoiwa Shops. All rights reserved. Made with ❤️ in Asankrangwa, Ghana 🇬🇭
      </div>
    </footer>
  )
}

export default Footer