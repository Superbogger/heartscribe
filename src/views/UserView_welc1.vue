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

// !store.currentlyViewingGuestBook!.isActive || store.ownsCurrentGuestbook

const onEnterClick = () => {
  if (!store.isAllowedAccess) return
  store.goTo('whois')
}
</script>

//TODO color changes for disabled //ALLOW Owning user to still access normally too

<template>
  <div class="hero" :style="{ backgroundImage: `url('${imageUrl}')` }">
    <div class="content">
      <h1>{{ guestbook!.headerText }}</h1>
      <p class="footerText">{{ guestbook!.footerText }}</p>
      <button :disabled="!store.isAllowedAccess" @click="onEnterClick">EINGEBEN</button>
      <p class="blockedNotice" v-if="!store.isCurrentGBactive">
        This guestbook has been deactivated by its owner.
      </p>
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

.footerText {
  /* color: white; */
  margin-bottom: 1rem;
  /* background-color: antiquewhite; */
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 30px;
  padding: 0.5em;
}

.blockedNotice {
  color: red;
  margin-top: 0.5rem;
  border-radius: 30px;
  padding: 0.5em;
  background-color: rgba(0, 0, 0, 0.8);
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
