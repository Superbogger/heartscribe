<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue'

import { ref } from 'vue'

import { useStore } from '@/stores/store'
const store = useStore()
const inputUsername = ref('')
const inputPassword = ref('')
</script>

<template>
  <div class="hero">
    <form v-if="!store.loggedIn" class="form-login">
      <!-- //@submit.prevent="authentificateLogin" -->

      <div class="loginInputGroup">
        <label for="username">Name:</label>
        <input v-model="inputUsername" type="text" id="username" required />
      </div>
      <div class="loginInputGroup">
        <label for="password">Password:</label>
        <input v-model="inputPassword" type="password" id="password" required />
      </div>
      <button type="submit" class="btn-login">Login</button>
      <button type="button" class="btn-register">Register</button>
    </form>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: center;
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
  color: white;
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
</style>
