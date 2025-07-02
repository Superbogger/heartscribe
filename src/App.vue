<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import UserView_welc1 from '@/views/UserView_welc1.vue'

import { useStore } from '@/stores/store'
import { onMounted } from 'vue'
import { connectSocket } from './services/socketClient'
const store = useStore()

onMounted(() => {
  try {
    connectSocket()
    store.init() //give a unique tracker UUID per user
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <header>
    <div class="logo">♥ heartscribe</div>
    <nav>
      <RouterLink to="/user">{{ store.loggedIn ? 'Manage' : '' }}</RouterLink>
      <RouterLink to="/" @click="store.loggedIn ? store.logout() : null">
        {{ store.loggedIn ? 'Logout:' + store.currentUserName : 'Login' }}
      </RouterLink>
      <RouterLink to="/guest">GuestBook</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  background-color: #1c1c1c;
  color: white;
  display: flex;
  justify-content: flex-start;
  padding: 1rem 2rem;
  align-items: center;
  font-family: cursive;
}

.logo {
  margin-right: auto;
}

nav {
  color: white;
  display: flex;
  gap: 18px;
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

nav :deep(a:hover) {
  color: #ff8c7a;
}
</style>
