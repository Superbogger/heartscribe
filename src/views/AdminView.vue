<script setup lang="ts">
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { onMounted } from 'vue'

const store = useStore()
const router = useRouter()

// CHANGED: emoji background logic
const containerRef = ref<HTMLElement | null>(null)
const emojis = [
  // Hearts (yours plus a few extras)
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '🤍',
  '🤎',
  '💖',
  '💗',
  '💘',
  '💝',
  '💕',
  '💞',
  '💓',
  'λ',
  '💌',
  '❣️',

  // Animals
  '🐶',
  '🐱',
  '🐭',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🐒',
  '🦄',
  '🐥',
  '🐸',
  '🐧',
  '🐢',
  '🐞',
  '🐝',
  '🦋',
  '🐙',
  '🐳',

  // Flowers and nature
  '🌸',
  '🌼',
  '🌻',
  '🌺',
  '🌹',
  '🌷',
  '🍀',
  '🌿',
  '🍃',

  // Sparkles and stars
  '✨',
  '💫',
  '⭐',
  '🌟',
  '🪄',

  // Other cute/fun
  '🎀',
  '🎁',
  '🧸',
  '🎈',
  '🍭',
  '🍬',
  '🍓',
  '🍒',
]

//for spacing sequential emojis
let lastHorizontalPos: number | null

//Function to spawn a single emoji
function spawnEmoji() {
  if (!containerRef.value) return

  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  const span = document.createElement('span')
  span.textContent = emoji

  span.style.position = 'absolute'
  span.style.fontSize = `${3 + Math.random() * 3}rem`
  span.style.opacity = '0.4'
  // User shouldn't be able to select the emoji text
  span.style.userSelect = 'none'
  // Prevent the emoji from intercepting any mouse events
  span.style.pointerEvents = 'none'

  let nextPos = Math.random() * 100
  if (lastHorizontalPos !== null && Math.abs(nextPos - lastHorizontalPos) < 10) {
    nextPos = (nextPos + 20) % 100
  }
  lastHorizontalPos = nextPos
  span.style.left = `${nextPos}%`

  span.style.top = '110%' // start below screen
  span.style.transition = 'transform 40s linear'

  // Add the span to the emoji container in the DOM
  containerRef.value.appendChild(span)

  // Force reflow
  void span.offsetWidth

  // Animate
  span.style.transform = `translateY(-150vh) translateX(${Math.random() * 100 - 50}px)`

  // Cleanup after animation
  setTimeout(() => {
    span.remove()
  }, 40000 + 1000)
}

onMounted(() => {
  store.currentPage = 'admin-login'

  //EMOJI RELATED
  // Initially spawn a few
  for (let i = 0; i < 10; i++) {
    setTimeout(() => spawnEmoji(), i * 2000)
  }
  // Continuously spawn
  setInterval(() => {
    spawnEmoji()
  }, 3000)
})

const inputUsername = ref('')
const inputPassword = ref('')
const isLoading = ref(false)
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
  }, 400)

  setTimeout(() => {
    errorMessages.value.shift()
  }, 3000)
}

async function loginUser() {
  isLoading.value = true
  latestErrorMessage.value = ''
  try {
    await store.waitForApiClientReady()

    const response = await store.apiClient!.post('api/user/login', {
      username: inputUsername.value,
      password: inputPassword.value,
    })

    store.currentUserName = inputUsername.value
    store.loggedIn = true
    const token = response.data.token
    localStorage.setItem('heartscribe_user_token', token)
    router.push('/user')
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
    await store.waitForApiClientReady()

    await store.apiClient!.post('api/user/', {
      username: inputUsername.value,
      password: inputPassword.value,
    })

    await loginUser()
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
  <!-- emoji background container -->
  <div ref="containerRef" class="emoji-background" aria-hidden="true"></div>
  <div class="hero">
    <form v-if="!store.loggedIn" class="form-login" :class="{ shake: justShook }">
      <div class="loginInputGroup">
        <label for="username">Name:</label>
        <input v-model="inputUsername" type="text" id="username" required />
      </div>
      <div class="loginInputGroup">
        <label for="password">Password:</label>
        <input v-model="inputPassword" type="password" id="password" required />
      </div>
      <button type="button" class="btn-login" @click.prevent="loginUser">Login</button>
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
/* CHANGED: emoji background styling */
.emoji-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* use entire viewwport*/
  overflow: hidden;
  z-index: -1; /* Places it behind all other content on the page */
  pointer-events: none; /*Allows clicks to pass through without blocking UI interactions */
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

.form-login {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #555;
  border-radius: 4px;
  max-width: 700px;
  margin: auto;
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
