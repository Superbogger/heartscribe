<script setup lang="ts">
import { useStore } from '@/stores/store'
import { computed } from 'vue'
const store = useStore()

const guestbook = computed(() => store.currentlyViewingGuestBook)
const imageUrl = computed(() => {
  const img = guestbook.value?.imageUrl
  if (!img) return ''
  return img.startsWith('http') ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`
})

console.log('LOGIN STATUS:' + store.loggedIn)
</script>

<template>
  <div class="hero" :style="{ backgroundImage: `url('${imageUrl}')` }">
    <div class="content">
      <h1>{{ guestbook!.headerText }}</h1>
      <p>{{ guestbook!.footerText }}</p>
      <button @click="store.goTo('whois')">EINGEBEN</button>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background-size: cover;
  background-position: center;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  color: black;
  background-color: rgba(255, 255, 255, 0.4);
}

.content h1 {
  /* color: white; */
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.content p {
  /* color: white; */
  margin-bottom: 1rem;
  /* background-color: antiquewhite; */
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 30px;
  padding: 0.5em;
}

button {
  background-color: #ff8c7a;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
