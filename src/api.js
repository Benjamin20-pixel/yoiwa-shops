import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// User routes
export const registerUser = (data) => API.post('/users/register', data)
export const loginUser = (data) => API.post('/users/login', data)

// Product routes
export const getProducts = () => API.get('/products')
export const addProduct = (data) => API.post('/products', data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Order routes
export const addOrder = (data) => API.post('/orders', data)
export const getOrders = () => API.get('/orders')
export const getOrder = (id) => API.get(`/orders/${id}`)
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data)