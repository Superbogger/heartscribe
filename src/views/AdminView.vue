<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

import { ref } from 'vue'

import { useStore } from '@/stores/store'
const store = useStore()
const inputUsername = ref('')
const inputPassword = ref('')
import apiClient from '@/services/apiClient'

const isLoading = ref(false)

//TODO: remove if not needed
const latestErrorMessage = ref('')

const errorMessages = ref<string[]>([])
const justShook = ref(false)
const addError = (msg: string) => {
  if (errorMessages.value.length >= 3) {
    errorMessages.value.shift() // remove oldest if at max
  }

  errorMessages.value.push(msg)
  justShook.value = true
  setTimeout(() => {
    justShook.value = false
  }, 400) // matches the duration of the animation

  // Auto-remove this message after 3 seconds
  setTimeout(() => {
    errorMessages.value.shift()
  }, 3000)
}

//TODO login actions
async function loginUser() {
  isLoading.value = true
  latestErrorMessage.value = ''
  try {
    const response = await apiClient.post('api/user/login', {
      username: inputUsername.value,
      password: inputPassword.value,
    })

    store.currentUserName = inputUsername.value
    store.loggedIn = true
    const token = response.data.token
    localStorage.setItem('heartscribe_user_token', token)
    router.push('/user') //switch page
  } catch (err) {
    addError((err as AxiosError<{ error: string }>)?.response?.data?.error || 'Unknown error')
    latestErrorMessage.value = 'Login failed'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function registerUser() {
  isLoading.value = true
  latestErrorMessage.value = ''
  try {
    const response = await apiClient.post('api/user/', {
      username: inputUsername.value,
      password: inputPassword.value,
    })

    store.loggedIn = true
    // Optional: store user ID
  } catch (err) {
    addError((err as AxiosError<{ error: string }>)?.response?.data?.error || 'Unknown error')
    latestErrorMessage.value = 'Registration failed'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="hero">
    <form v-if="!store.loggedIn" class="form-login" :class="{ shake: justShook }">
      <!-- //@submit.prevent="authentificateLogin" -->

      <div class="loginInputGroup">
        <label for="username">Name:</label>
        <input v-model="inputUsername" type="text" id="username" required />
      </div>
      <div class="loginInputGroup">
        <label for="password">Password:</label>
        <input v-model="inputPassword" type="password" id="password" required />
      </div>
      <button type="submit" class="btn-login" @click.prevent="loginUser">Login</button>
      <button type="button" class="btn-register" @click="registerUser">Register</button>
    </form>
    <div class="error-container">
      <transition-group name="fade" tag="div">
        <div v-for="(msg, index) in errorMessages" :key="msg + index" class="error-message">
          {{ msg }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
* {
  border: 1px solid salmon;
}

.error-container {
  width: 100%;
  min-height: 8rem;
  margin-top: 1rem;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.hero {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

/* LOGIN STYLING  */
.form-login {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #555;
  border-radius: 4px;
  max-width: 700px;
  margin: auto; /* auto center */
}

.loginInputGroup {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
  min-width: 150px;
}

.form-login label {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.form-login input {
  padding: 0.5rem;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  color: rgb(0, 0, 0);
}

.form-login button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: #ddd;
  border: none;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.shake {
  animation: shake 0.4s ease;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
