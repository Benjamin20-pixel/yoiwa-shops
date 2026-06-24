import { useState, useEffect, useCallback, useMemo } from 'react'
import { getCartCount } from './cartUtils'

function Navbar({ setPage, onSearch }) {
  // Get user from localStorage with error handling
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(getCartCount())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update cart count when cart changes
  useEffect(() => {
    const updateCount = () => {
      setCartCount(getCartCount())
    }

    // Listen for cart update events
    window.addEventListener('cartUpdated', updateCount)
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCount()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', updateCount)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Handle logout
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent('userLoggedOut'))
      // Redirect to home
      window.location.href = '/'
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }, [])

  // Handle search
  const handleSearch = useCallback(() => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setPage('home')
      setIsMobileMenuOpen(false)
    }
  }, [onSearch, searchQuery, setPage])

  // Handle key press for search
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }, [onSearch])

  // Get user greeting
  const getUserGreeting = useCallback(() => {
    if (!user) return ''
    const firstName = user.name?.split(' ')[0] || 'User'
    return `Hi, ${firstName}!`
  }, [user])

  // Check if user is customer
  const isCustomer = !user || user.role === 'customer'

  // Navigation items based on user role
  const getNavItems = useCallback(() => {
    if (!user) {
      return [
        { label: 'Sign In', action: () => setPage('signin') },
        { label: 'Register', action: () => setPage('register') },
        { label: 'Sell on Yoiwa', action: () => setPage('sellerregister') }
      ]
    }

    const items = []
    
    // Add role-specific items
    if (user.role === 'seller') {
      items.push({ label: 'My Store', action: () => setPage('seller') })
    } else if (user.role === 'rider') {
      items.push({ label: 'My Deliveries', action: () => setPage('rider') })
    } else if (user.role === 'admin') {
      items.push({ label: 'Admin Panel', action: () => setPage('admin') })
    }

    // Add logout
    items.push({ label: 'Logout', action: handleLogout, isLogout: true })

    return items
  }, [user, setPage, handleLogout])

  const navItems = getNavItems()

  return (
    <nav style={{
      backgroundColor: '#131921',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {/* Logo */}
      <div 
        onClick={() => {
          setPage('home')
          setIsMobileMenuOpen(false)
        }} 
        style={{
          color: '#FCD116',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          userSelect: 'none'
        }}
      >
        <span>🛍️</span>
        <span>Yoiwa Shops</span>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: 'none',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '4px 8px'
        }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Search Bar */}
      {isCustomer && (
        <div style={{
          display: 'flex',
          flex: 1,
          margin: '0 20px',
          backgroundColor: 'white',
          borderRadius: '4px',
          overflow: 'hidden',
          maxWidth: '600px',
          minWidth: '200px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
            aria-label="Search for products"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: 'none',
              outline: 'none',
              backgroundColor: 'white',
              color: '#131921'
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0 8px',
                cursor: 'pointer',
                color: '#888',
                fontSize: '1rem'
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button 
            onClick={handleSearch}
            style={{
              backgroundColor: '#FCD116',
              padding: '8px 16px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E5B800'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FCD116'}
            aria-label="Search"
          >
            🔍
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        gap: '20px',
        color: 'white',
        fontSize: '0.9rem',
        alignItems: 'center',
        marginLeft: isCustomer ? '0' : 'auto',
        flexWrap: 'wrap'
      }}>
        {/* User greeting */}
        {user && (
          <span style={{
            color: '#FCD116',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {getUserGreeting()}
          </span>
        )}

        {/* Navigation items */}
        {navItems.map((item, index) => (
          <span
            key={index}
            onClick={item.action}
            style={{
              cursor: 'pointer',
              color: item.isLogout ? '#ff6b6b' : 'white',
              fontWeight: item.isLogout ? 'bold' : 'normal',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              ...(item.isLogout ? {} : {
                ':hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              })
            }}
            onMouseEnter={(e) => {
              if (!item.isLogout) {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            {item.label}
          </span>
        ))}

        {/* Cart */}
        {isCustomer && (
          <span 
            onClick={() => {
              setPage('cart')
              setIsMobileMenuOpen(false)
            }} 
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              position: 'relative',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            🛒
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: '#FCD116',
                color: '#131921',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center',
                animation: cartCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          display: 'none'
        }} onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80%',
          maxWidth: '320px',
          backgroundColor: '#131921',
          padding: '20px',
          zIndex: 1001,
          overflowY: 'auto',
          display: 'none',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.3)'
        }}>
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              alignSelf: 'flex-end',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>

          {/* User info */}
          {user && (
            <div style={{
              color: '#FCD116',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              {getUserGreeting()}
            </div>
          )}

          {/* Navigation items */}
          {navItems.map((item, index) => (
            <span
              key={index}
              onClick={() => {
                item.action()
                setIsMobileMenuOpen(false)
              }}
              style={{
                cursor: 'pointer',
                color: item.isLogout ? '#ff6b6b' : 'white',
                fontWeight: item.isLogout ? 'bold' : 'normal',
                padding: '12px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
                fontSize: '1rem'
              }}
            >
              {item.label}
            </span>
          ))}

          {/* Cart in mobile */}
          {isCustomer && (
            <span 
              onClick={() => {
                setPage('cart')
                setIsMobileMenuOpen(false)
              }} 
              style={{
                cursor: 'pointer',
                color: 'white',
                padding: '12px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1rem'
              }}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: '#FCD116',
                  color: '#131921',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </span>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          nav > div:last-child {
            display: none;
          }
          nav > button:first-of-type {
            display: block !important;
          }
          .mobile-menu {
            display: flex !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }

        @media (max-width: 480px) {
          nav {
            padding: 8px 12px;
          }
          nav > div:first-child {
            font-size: 1.2rem;
          }
          nav > div:first-child span:first-child {
            display: none;
          }
          nav > div:first-child span:last-child {
            font-size: 1rem;
          }
          .search-bar {
            margin: 0 8px;
            min-width: 120px;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar