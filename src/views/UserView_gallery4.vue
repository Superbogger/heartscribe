<script setup lang="ts">
import { useStore } from '@/stores/store'

import GalleryItem from '@/components/GalleryItem.vue'
const store = useStore()

//adapt servseide function
async function handleDelete(entryID: string) {
  const gb = store.currentlyViewingGuestBook
  if (!gb) {
    console.error('No guestbook selected')
    return
  }

  try {
    await store.waitForApiClientReady()
    await store.apiClient!.delete(`/api/guest-entries/${gb.publicId}/${entryID}`)
    store.handleEntryDelete(entryID)
  } catch (err) {
    console.error('Failed to delete guest entry:', err)
  }
}
</script>

<template>
  <div class="hero">
    <header class="header" :style="{ backgroundImage: `url('${store.computeImageURL}')` }">
      <h1>{{ store.currentlyViewingGuestBook!.headerText }}</h1>
    </header>

    <main class="main">
      <div class="entry-grid">
        <GalleryItem
          v-for="entry in store.currentlyViewingGuestEntries"
          :key="entry._id"
          :date="entry.date"
          :name="entry.name"
          :comment="entry.comment"
          :image-url="entry.imageUrl"
          :can-delete="store.ownsCurrentGuestbook"
          @delete="() => handleDelete(entry._id)"
        />
      </div>
      <!-- v-for loop and display all entries as boxes .. TODO component -->
    </main>

    <footer class="footer">
      <span class="logo">♥ heartscribe</span>
    </footer>

    <button class="gallery-fab" @click="store.goTo('commit')">
      <span class="icon">+</span>
      <span class="label">Add</span>
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
  background-size: cover;
  background-position: center;
  padding: 0rem;
  text-align: center;
}

.header h1 {
  color: white;
  font-size: 2rem;
  text-shadow: 1px 1px 3px black;
  padding: 16px;
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
  padding: 0.6rem 1.3rem;
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
