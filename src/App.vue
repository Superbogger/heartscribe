<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import UserView_welc1 from '@/views/UserView_welc1.vue'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>hallo bogdan</div>

  <header>
    <nav>
      <RouterLink to="/">Admin</RouterLink>
      <br />
      <RouterLink to="/guest">Guest</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
