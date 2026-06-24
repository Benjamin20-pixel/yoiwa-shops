// cartUtils.js - Enhanced Version

const CART_STORAGE_KEY = 'cart'
const MAX_QUANTITY_PER_ITEM = 99

// ============ Core Functions ============

/**
 * Get cart from localStorage with error handling
 * @returns {Array} Cart items array
 */
export const getCart = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    if (!cartData) return []
    
    const parsed = JSON.parse(cartData)
    // Validate that we have an array
    if (!Array.isArray(parsed)) {
      console.warn('Cart data is not an array, resetting')
      return []
    }
    return parsed
  } catch (error) {
    console.error('Error retrieving cart:', error)
    return []
  }
}

/**
 * Save cart to localStorage with error handling
 * @param {Array} cart - Cart items array
 * @returns {Array} The saved cart
 */
export const saveCart = (cart) => {
  try {
    if (!Array.isArray(cart)) {
      throw new Error('Cart must be an array')
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart, count: getCartCountFromArray(cart) } 
    }))
    
    return cart
  } catch (error) {
    console.error('Error saving cart:', error)
    return []
  }
}

// ============ Add/Remove Functions ============

/**
 * Add item to cart with stock validation
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @param {number} maxStock - Maximum stock available (optional)
 * @returns {Object} { success: boolean, cart: Array, message?: string }
 */
export const addToCart = (product, quantity = 1, maxStock = Infinity) => {
  // Input validation
  if (!product || !product._id) {
    console.error('Invalid product')
    return { success: false, cart: getCart(), message: 'Invalid product' }
  }

  if (quantity <= 0) {
    return { success: false, cart: getCart(), message: 'Quantity must be greater than 0' }
  }

  if (!Number.isInteger(quantity)) {
    quantity = Math.floor(quantity)
  }

  const cart = getCart()
  const existingItem = cart.find(item => item._id === product._id)
  const currentQuantity = existingItem ? existingItem.quantity : 0
  const newQuantity = currentQuantity + quantity

  // Check stock availability
  if (newQuantity > maxStock) {
    const available = maxStock - currentQuantity
    return { 
      success: false, 
      cart, 
      message: `Only ${available} items available in stock` 
    }
  }

  // Check maximum quantity per item
  if (newQuantity > MAX_QUANTITY_PER_ITEM) {
    return {
      success: false,
      cart,
      message: `Cannot add more than ${MAX_QUANTITY_PER_ITEM} of the same item`
    }
  }

  // Store only essential product data to avoid inconsistency
  const cartItem = {
    _id: product._id,
    name: product.name || 'Unknown Product',
    price: product.price || 0,
    image: product.image || '',
    category: product.category || '',
    quantity: newQuantity,
    // Store only if available
    ...(product.attributes && { attributes: product.attributes }),
    // Store seller info if available
    ...(product.seller && { seller: { 
      _id: product.seller._id, 
      name: product.seller.name 
    }}),
    // Store stock for reference
    ...(product.stock && { stock: product.stock }),
    // Add timestamp for when added
    addedAt: existingItem ? existingItem.addedAt : new Date().toISOString()
  }

  if (existingItem) {
    Object.assign(existingItem, cartItem)
  } else {
    cart.push(cartItem)
  }

  const savedCart = saveCart(cart)
  return { success: true, cart: savedCart, message: 'Item added to cart' }
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 * @returns {Object} { success: boolean, cart: Array, message?: string }
 */
export const removeFromCart = (productId) => {
  if (!productId) {
    return { success: false, cart: getCart(), message: 'Invalid product ID' }
  }

  const cart = getCart()
  const initialLength = cart.length
  const updatedCart = cart.filter(item => item._id !== productId)
  
  if (updatedCart.length === initialLength) {
    return { success: false, cart, message: 'Item not found in cart' }
  }

  const savedCart = saveCart(updatedCart)
  return { success: true, cart: savedCart, message: 'Item removed from cart' }
}

/**
 * Update item quantity
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 * @param {number} maxStock - Maximum stock available (optional)
 * @returns {Object} { success: boolean, cart: Array, message?: string }
 */
export const updateQuantity = (productId, quantity, maxStock = Infinity) => {
  if (!productId) {
    return { success: false, cart: getCart(), message: 'Invalid product ID' }
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return { success: false, cart: getCart(), message: 'Quantity must be a positive integer' }
  }

  if (quantity === 0) {
    return removeFromCart(productId)
  }

  if (quantity > MAX_QUANTITY_PER_ITEM) {
    return {
      success: false,
      cart: getCart(),
      message: `Cannot set quantity above ${MAX_QUANTITY_PER_ITEM}`
    }
  }

  const cart = getCart()
  const itemIndex = cart.findIndex(item => item._id === productId)
  
  if (itemIndex === -1) {
    return { success: false, cart, message: 'Item not found in cart' }
  }

  // Check stock availability
  if (quantity > maxStock) {
    return {
      success: false,
      cart,
      message: `Only ${maxStock} items available in stock`
    }
  }

  cart[itemIndex].quantity = quantity
  const savedCart = saveCart(cart)
  return { success: true, cart: savedCart, message: 'Quantity updated' }
}

// ============ Utility Functions ============

/**
 * Clear entire cart
 * @returns {Array} Empty array
 */
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [], count: 0 } }))
  return []
}

/**
 * Get cart total
 * @param {Array} cart - Optional cart array (uses getCart if not provided)
 * @returns {number} Total price
 */
export const getCartTotal = (cart = null) => {
  const cartItems = cart || getCart()
  return cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 0
    return sum + (price * quantity)
  }, 0)
}

/**
 * Get cart total as formatted string
 * @param {string} currency - Currency symbol (default: GH₵)
 * @param {Array} cart - Optional cart array
 * @returns {string} Formatted total
 */
export const getCartTotalFormatted = (currency = 'GH₵', cart = null) => {
  const total = getCartTotal(cart)
  return `${currency} ${total.toFixed(2)}`
}

/**
 * Get cart count (total items)
 * @param {Array} cart - Optional cart array (uses getCart if not provided)
 * @returns {number} Total item count
 */
export const getCartCount = (cart = null) => {
  const cartItems = cart || getCart()
  return cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
}

/**
 * Get cart count from array (helper for internal use)
 * @param {Array} cart - Cart array
 * @returns {number} Total item count
 */
const getCartCountFromArray = (cart) => {
  return cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
}

/**
 * Check if cart has items
 * @param {Array} cart - Optional cart array
 * @returns {boolean} True if cart has items
 */
export const hasItems = (cart = null) => {
  return getCartCount(cart) > 0
}

/**
 * Get item quantity in cart
 * @param {string} productId - Product ID
 * @param {Array} cart - Optional cart array
 * @returns {number} Quantity of item in cart (0 if not found)
 */
export const getItemQuantity = (productId, cart = null) => {
  if (!productId) return 0
  const cartItems = cart || getCart()
  const item = cartItems.find(item => item._id === productId)
  return item ? parseInt(item.quantity) || 0 : 0
}

/**
 * Check if item exists in cart
 * @param {string} productId - Product ID
 * @param {Array} cart - Optional cart array
 * @returns {boolean} True if item is in cart
 */
export const isItemInCart = (productId, cart = null) => {
  return getItemQuantity(productId, cart) > 0
}

/**
 * Get cart summary object
 * @param {Array} cart - Optional cart array
 * @returns {Object} Cart summary
 */
export const getCartSummary = (cart = null) => {
  const cartItems = cart || getCart()
  const total = getCartTotal(cartItems)
  const count = getCartCount(cartItems)
  
  const items = cartItems.map(item => ({
    ...item,
    subtotal: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
  }))

  return {
    items,
    total,
    count,
    itemCount: cartItems.length,
    isEmpty: cartItems.length === 0,
    currency: 'GH₵',
    totalFormatted: `GH₵ ${total.toFixed(2)}`
  }
}

/**
 * Merge two carts (useful for guest cart merging with user cart)
 * @param {Array} sourceCart - Source cart to merge
 * @param {Array} targetCart - Target cart (defaults to current cart)
 * @returns {Object} { success: boolean, cart: Array, message?: string }
 */
export const mergeCarts = (sourceCart, targetCart = null) => {
  if (!sourceCart || !Array.isArray(sourceCart)) {
    return { success: false, cart: getCart(), message: 'Invalid source cart' }
  }

  const baseCart = targetCart || getCart()
  const mergedCart = [...baseCart]

  sourceCart.forEach(sourceItem => {
    const existingItem = mergedCart.find(item => item._id === sourceItem._id)
    if (existingItem) {
      existingItem.quantity += sourceItem.quantity
    } else {
      mergedCart.push(sourceItem)
    }
  })

  const savedCart = saveCart(mergedCart)
  return { success: true, cart: savedCart, message: 'Carts merged successfully' }
}

/**
 * Validate cart items (remove invalid items)
 * @param {Array} productIds - Array of valid product IDs
 * @returns {Object} { success: boolean, cart: Array, removed: Array }
 */
export const validateCart = (productIds) => {
  if (!productIds || !Array.isArray(productIds)) {
    return { success: false, cart: getCart(), removed: [] }
  }

  const cart = getCart()
  const validItems = cart.filter(item => productIds.includes(item._id))
  const removedItems = cart.filter(item => !productIds.includes(item._id))

  if (validItems.length !== cart.length) {
    saveCart(validItems)
  }

  return { 
    success: true, 
    cart: validItems, 
    removed: removedItems 
  }
}

/**
 * Get cart item by ID
 * @param {string} productId - Product ID
 * @param {Array} cart - Optional cart array
 * @returns {Object|null} Cart item or null
 */
export const getCartItem = (productId, cart = null) => {
  if (!productId) return null
  const cartItems = cart || getCart()
  return cartItems.find(item => item._id === productId) || null
}

// ============ React Hook ============

import { useState, useEffect, useCallback } from 'react'

/**
 * React hook for using cart in components
 * @returns {Object} Cart state and functions
 */
export const useCart = () => {
  const [cart, setCart] = useState(getCart())
  const [cartCount, setCartCount] = useState(getCartCount())
  const [cartTotal, setCartTotal] = useState(getCartTotal())

  const updateCartState = useCallback(() => {
    const currentCart = getCart()
    setCart(currentCart)
    setCartCount(getCartCount(currentCart))
    setCartTotal(getCartTotal(currentCart))
  }, [])

  useEffect(() => {
    // Initial update
    updateCartState()

    // Listen for cart updates
    const handleCartUpdate = () => updateCartState()
    window.addEventListener('cartUpdated', handleCartUpdate)

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        updateCartState()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [updateCartState])

  const addItem = useCallback((product, quantity = 1, maxStock = Infinity) => {
    const result = addToCart(product, quantity, maxStock)
    if (result.success) {
      updateCartState()
    }
    return result
  }, [updateCartState])

  const removeItem = useCallback((productId) => {
    const result = removeFromCart(productId)
    if (result.success) {
      updateCartState()
    }
    return result
  }, [updateCartState])

  const updateItemQuantity = useCallback((productId, quantity, maxStock = Infinity) => {
    const result = updateQuantity(productId, quantity, maxStock)
    if (result.success) {
      updateCartState()
    }
    return result
  }, [updateCartState])

  const clearAll = useCallback(() => {
    clearCart()
    updateCartState()
  }, [updateCartState])

  const getSummary = useCallback(() => {
    return getCartSummary(cart)
  }, [cart])

  return {
    cart,
    cartCount,
    cartTotal,
    isItemInCart: useCallback((productId) => isItemInCart(productId, cart), [cart]),
    getItemQuantity: useCallback((productId) => getItemQuantity(productId, cart), [cart]),
    getSummary,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAll,
    refreshCart: updateCartState
  }
}

// Export all functions
export default {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  getCartTotalFormatted,
  getCartCount,
  hasItems,
  getItemQuantity,
  isItemInCart,
  getCartSummary,
  mergeCarts,
  validateCart,
  getCartItem,
  useCart
}