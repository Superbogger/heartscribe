import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// AXIOS default baseURL
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001'

import App from './App.vue'
import router from './router'

// 👉 Create Vue app
const app = createApp(App)

// 👉 Create and use Pinia
const pinia = createPinia()
app.use(pinia)

// 👉 Import the store after Pinia is installed
import { useStore } from '@/stores/store'
const store = useStore()

// 👉 Await init and reAuth *before* mounting the app
await store.init()
await store.reAuth()

// 👉 Now use router
app.use(router)

// 👉 Mount the app
app.mount('#app')
