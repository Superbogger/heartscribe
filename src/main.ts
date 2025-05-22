import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//AXIOS
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
