function Confirmation({ setPage }) {
  return (
    <div style={{backgroundColor: '#EAEDED', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px'}}>
      
      <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center'}}>
        
        <div style={{fontSize: '4rem', marginBottom: '20px'}}>✅</div>
        
        <h2 style={{fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '12px', color: '#006B3F'}}>
          Order Placed Successfully!
        </h2>
        
        <p style={{color: '#555', fontSize: '1rem', marginBottom: '24px'}}>
          Thank you for shopping with Yoiwa Shops! Your order has been received and will be delivered to you in Asankrangwa shortly.
        </p>

        <div style={{backgroundColor: '#EAEDED', borderRadius: '8px', padding: '20px', marginBottom: '24px', textAlign: 'left'}}>
          <h3 style={{fontWeight: 'bold', marginBottom: '12px', color: '#131921'}}>Order Details</h3>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555'}}>
            <span>Order Number</span>
            <span style={{fontWeight: 'bold', color: '#131921'}}>#YS-00124</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555'}}>
            <span>Payment Method</span>
            <span style={{fontWeight: 'bold', color: '#131921'}}>MTN Mobile Money</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#555'}}>
            <span>Total Paid</span>
            <span style={{fontWeight: 'bold', color: '#006B3F'}}>GH₵ 620</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555'}}>
            <span>Estimated Delivery</span>
            <span style={{fontWeight: 'bold', color: '#131921'}}>Within Asankrangwa</span>
          </div>
        </div>

        <button onClick={() => setPage('home')} style={{width: '100%', backgroundColor: '#FCD116', border: 'none', padding: '14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '12px'}}>
          Continue Shopping
        </button>

        <p style={{color: '#555', fontSize: '0.85rem'}}>
          A confirmation will be sent to your phone via SMS 📱
        </p>

      </div>
    </div>
  )
}

export default Confirmation