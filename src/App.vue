<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import UserView_welc1 from '@/views/UserView_welc1.vue'
</script>

<template>
  <header>
    <div class="logo">♥ heartscribe</div>
    <nav>
      <RouterLink to="/">Admin</RouterLink>
      <RouterLink to="/guest">Guest</RouterLink>
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
