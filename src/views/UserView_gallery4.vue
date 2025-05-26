<script setup lang="ts">
import { useStore } from '@/stores/store'

import GalleryItem from '@/components/GalleryItem.vue'
import type { GuestEntry } from '../stores/store'
const store = useStore()

import { ref, onMounted } from 'vue'
import apiClient from '@/services/apiClient'

const galleryEntries = ref<GuestEntry[]>([])

onMounted(async () => {
  try {
    const response = await apiClient.get(`/api/guest-entries/${store.guestBookId}`)
    galleryEntries.value = response.data
    console.log('fetched stuff:', response.data)
  } catch (err) {
    console.error('Failed to load gallery entries', err)
  }
})

//REWRITE: send tuple of entryID and guestbookID to identify the ENTRY
//adapt servseide function
async function handleDelete(entryID: number) {
  try {
    const guestBookId = store.guestBookId
    await apiClient.delete(`/api/guest-entries/${guestBookId}/${entryID}`)
    // only remove from UI if the request succeeded
    galleryEntries.value = galleryEntries.value.filter((e) => e.entryID !== entryID)
  } catch (err) {
    console.error('Failed to delete guest entry:', err)
  }
}
</script>

<template>
  <!-- DEBUG: -->
  <!-- <div class="about">
    <h1>Page 2</h1>
    <button @click="store.reset()">Reset the UUID</button>
  </div> -->

  <div class="hero">
    <header class="header">
      <h1>Bogdan<br />&<br />Manuela</h1>
    </header>

    <main class="main">
      <div class="entry-grid">
        <GalleryItem
          v-for="entry in galleryEntries"
          :key="entry.entryID"
          :date="entry.date"
          :name="entry.name"
          :comment="entry.comment"
          :image-url="entry.imageUrl"
          :can-delete="store.ownsCurrentGuestbook"
          @delete="() => handleDelete(entry.entryID)"
        />
      </div>
      <!-- v-for loop and display all entries as boxes .. TODO component -->
    </main>

    <footer class="footer">
      <span class="logo">♥ heartscribe</span>
    </footer>

    <button class="gallery-fab" @click="store.goTo('commit')">
      <span class="icon">+</span>
      <span class="label"></span>
    </button>
  </div>
</template>

<style scoped>
.entry-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

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
  padding: 0rem;
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
  text-align: center;
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

.logo {
  color: white;
}

/* back to commit page */
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
