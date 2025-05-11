<script setup lang="ts">
import { useStore } from '@/stores/store'
import { ref } from 'vue'

const store = useStore()
const name = ref('')

function handleSubmit() {
  if (!name.value.trim()) return
  store.attachNameToUser(name.value)
  name.value = ''
}
</script>

<template>
  <div class="about">
    <h1>Page 2</h1>
    <button @click="store.reset()">Reset the UUID</button>
  </div>

  <div class="hero">
    <header class="header">
      <h1>Bogdan<br />&<br />Manuela</h1>
    </header>

    <main class="main">
      <p class="prompt">Um beizutreten, teilen Sie uns mit, wer Sie sind.</p>

      <form @submit.prevent="handleSubmit" class="form-group">
        <label for="name">Name:</label>
        <input v-model="name" id="name" type="text" placeholder="Vorname Nachname" required />
        <button>EINGEBEN</button>
      </form>
    </main>

    <footer class="footer">
      <span class="logo">♥ heartscribe</span>
    </footer>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fffaf9;
}

.header {
  background-image: url('@/assets/userimages/IMG_20230824_195820.jpg');
  background-size: cover;
  background-position: center;
  padding: 3rem;
  text-align: center;
}

.header h1 {
  color: white;
  font-size: 2rem;
  text-shadow: 1px 1px 3px black;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
  padding: 2rem;
  text-align: center;
}

.prompt {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #444;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  gap: 0.5rem;
}

input {
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid #ccc;
  text-align: center;
  font-size: 1rem;
}

button {
  background-color: #ff8c7a;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.footer {
  background-color: #1c1c1c;
  padding: 1rem;
  text-align: center;
}

.logo {
  color: white;
  font-family: cursive;
}

.footer {
  background-color: #1c1c1c;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  align-items: center;
  font-family: cursive;
}
</style>
