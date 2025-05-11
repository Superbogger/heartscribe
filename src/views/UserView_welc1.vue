<script setup lang="ts">
import { useStore } from '@/stores/store'

const store = useStore()
</script>

<template>
  <div class="hero">
    <div class="content">
      <h1>Bogdan<br />&<br />Manuela</h1>
      <p>Welcome to our wedding! 💍 Send us all your love, pics, and messages! ♥</p>
      <button @click="store.goTo('whois')">EINGEBEN</button>
    </div>
  </div>
</template>

<style scoped>
.hero {
  /* VUEHOOK: */
  background-image: url('@/assets/userimages/pexels-caio-56926.jpg');

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
