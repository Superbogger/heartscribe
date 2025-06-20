import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/',
  headers: { 'Content-Type': 'application/json' },
})

//register req interceptor, modify every outgoing HTTP request
//headers are autmatically attached here
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('heartscribe_user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
