<script setup lang="ts">
import ImageUpload from '@/components/ImageUploadButton.vue'
import { ref } from 'vue'

import { useStore } from '@/stores/store'
const store = useStore()

const selectedFile = ref<File | null>(null)

function handleFile(file: File) {
  selectedFile.value = file
}

function addEntryLocal() {
  store.addEntry(comment.value)
  comment.value = ''
}

const comment = ref('')
</script>

<template>
  <div class="hero">
    <header class="header">
      <h1>Bogdan<br />&<br />Manuela</h1>
    </header>

    <main class="main">
      <p class="prompt">Senden Sie eine oder mehrere Nachrichten und Fotos.</p>

      <form @submit.prevent="addEntryLocal()">
        <div class="form-group">
          <ImageUpload id="upload-photo" @file-selected="handleFile" />
          <p v-if="selectedFile">Ausgewählt: {{ selectedFile.name }}</p>
        </div>
        <div class="form-group">
          <label for="message">Ihre Nachricht:</label>
          <textarea
            v-model="comment"
            id="message"
            rows="4"
            placeholder="Ihre Nachricht, max. 300 Zeichen"
            required
          ></textarea>
        </div>
        <button class="submit-button">SENDEN</button>
      </form>
    </main>

    <footer class="footer">
      <span class="logo">♥ heartscribe</span>
      <!-- <a class="logout" href="#">Abmelden</a> -->
    </footer>

    <button class="gallery-fab" @click="store.goTo('gallery')">
      <span class="icon">☰</span>
      <span class="label">Galerie</span>
    </button>
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
  background-image: url('@/assets/userimages/pexels-caio-56926.jpg');
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
  padding: 2rem;
  gap: 1.5rem;
  text-align: center;
}

.prompt {
  font-size: 1.1rem;
  color: #444;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 0.5rem;
}

input[type='file'] {
  padding: 0.5rem;
  border: none;
  background-color: #f3f3f3;
}

.upload-hint {
  color: #999;
  font-size: 0.9rem;
}

textarea {
  resize: vertical;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.submit-button {
  background-color: #ff8c7a;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
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

.logout {
  color: #ff8c7a;
  text-decoration: none;
  font-weight: bold;
}

.gallery-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: #ff8c7a;
  color: white;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  z-index: 1000;
  transition: background-color 0.2s ease;
}

.gallery-fab:hover {
  background-color: #f57460;
}

.gallery-fab .icon {
  font-size: 1.2rem;
  background: white;
  color: #ff8c7a;
  border-radius: 50%;
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.gallery-fab .label {
  font-size: 0.9rem;
}
</style>
