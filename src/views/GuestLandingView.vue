<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/store'

const guestBookID = ref('')
const errorMessages = ref<string[]>([])

const router = useRouter()
const store = useStore()
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

const goToGuestbook = () => {
  const id = Number(guestBookID.value)
  if (guestBookID.value && store.isExistingGuestBookID(id)) {
    router.push({ name: 'guest-welcome', params: { guestBookID: id.toString() } })
    guestBookID.value = ''
  } else {
    let errStr: string
    if (guestBookID.value === '') {
      errStr = 'No ID provided'
    } else {
      errStr = 'Incorrect GuestBook ID: '
    }
    addError(`${errStr} ${guestBookID.value}`)
    guestBookID.value = ''
  }
}
</script>

<template>
  <div class="guest-landing">
    <div class="center-box">
      <form class="form-guestbook" @submit.prevent="goToGuestbook">
        <div>
          <h2>Enter your Guestbook ID</h2>
          <input v-model="guestBookID" placeholder="e.g. 42" :class="{ shake: justShook }" />
          <button>Open Guestbook</button>
        </div>
      </form>

      <div class="error-container">
        <transition-group name="fade" tag="div">
          <div v-for="(msg, index) in errorMessages" :key="msg + index" class="error-message">
            {{ msg }}
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guest-landing {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #fdfdfd;
}

/* Wrapper that holds both form and errors */
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
}

form {
  width: 100%;
}

/* * {
  border: 1px solid black;
} */

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

input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  border: 2px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #666;
}

button {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #005fa3;
}

/*box shake and transistions  */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

/* router.push_ Changes the URL — just like clicking a link e.g. from /guest to /guest/42 Loads the
matching route components Parent route components (e.g. GuestView.vue) Plus any nested children
(e.g. UserView_welc1.vue) Updates useRoute() and triggers lifecycle hooks So your components can
react to route params like guestBookId */
