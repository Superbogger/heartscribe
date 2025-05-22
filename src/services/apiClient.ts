import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('heartscribe_user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // <- this is required!
  }
  return config
})

export default apiClient
