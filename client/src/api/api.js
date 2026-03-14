import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pv_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// Policies
export const getPolicies = () =>
  api.get('/policies')

export const downloadPolicy = (policyId) =>
  api.get(`/policies/${policyId}/download`)

export const renewPolicy = (policyId) =>
  api.get(`/policies/${policyId}/renew`)

export default api
