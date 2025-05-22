<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore, type GuestBook } from '@/stores/store'
import apiClient from '@/services/apiClient'

const store = useStore()
const inputTitle = ref('')

onMounted(async () => {
  try {
    const response = await apiClient.get('/api/guestbook')
    store.guestBooks = response.data
  } catch (err) {
    console.error('Failed to load guestbooks', err)
  }
})

// new local state for editing
const editingId = ref<string | null>(null)
const editedTitle = ref('')
function startEdit(gb) {
  editingId.value = gb.publicId
  editedTitle.value = gb.title
}

async function saveEdit(gb) {
  try {
    const response = await apiClient.patch(`/api/guestbook/${gb.publicId}`, {
      title: editedTitle.value,
    })

    // Only update frontend if successful
    const updated = store.guestBooks.find((g) => g.publicId === gb.publicId)
    if (updated) updated.title = editedTitle.value

    editingId.value = null
  } catch (err) {
    console.error('Update failed', err)
  }
}
async function toggleActive(gb) {
  try {
    const response = await apiClient.patch(`/api/guestbook/${gb.publicId}`, {
      isActive: !gb.isActive,
    })

    // On success, update locally
    gb.isActive = !gb.isActive
  } catch (err) {
    console.error('Failed to toggle active state', err)
  }
}
async function createGuestbook() {
  if (!inputTitle.value.trim()) return

  try {
    const response = await apiClient.post('/api/guestbook', {
      title: inputTitle.value,
    })

    store.guestBooks.push(response.data)
    inputTitle.value = '' //reset inpu title
  } catch (err) {
    console.error('Failed to create guestbook', err)
  }
}
async function deleteGuestbook(gb: any) {
  if (!confirm(`Delete "${gb.title}"? This cannot be undone.`)) return

  try {
    await apiClient.delete(`/api/guestbook/${gb.publicId}`)
    store.guestBooks = store.guestBooks.filter((g) => g.publicId !== gb.publicId)
  } catch (err) {
    console.error('Failed to delete guestbook', err)
  }
}

function setCurrGB_switchPage(gb: GuestBook) {
  store.currentlyViewingGuestBook = gb // only needed for tracking deletion
  store.currentPage = 'gallery'
}
</script>

<template>
  <div class="hero">
    <section class="inputNewGuestBook">
      <h2>New GuestBook <span class="greenPlus">+</span></h2>
      <form class="inputTitle" @submit.prevent="createGuestbook">
        <label for="titleGuestbook">Name:</label>
        <input v-model="inputTitle" type="text" id="titleGuestbook" required />
      </form>
    </section>

    <section class="outputGuestBooks">
      <h2>Guestbooks</h2>
      <table class="guestbook-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Share</th>
            <th class="responsive-hide">Created</th>
            <th class="responsive-hide">Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="gb in store.guestBooks" :key="gb.publicId">
            <td>
              <span v-if="editingId !== gb.publicId" @click="startEdit(gb)">
                {{ gb.title }}
              </span>
              <input
                v-else
                v-model="editedTitle"
                @blur="saveEdit(gb)"
                @keyup.enter="saveEdit(gb)"
                class="edit-input"
              />
            </td>
            <td>
              //TODO:
              <RouterLink @click="setCurrGB_switchPage(gb)" :to="`/guest/${gb.publicId}/`">
                {{ gb.publicId }}
              </RouterLink>
            </td>
            <td class="responsive-hide">{{ new Date(gb.createdAt).toLocaleDateString() }}</td>
            <td class="responsive-hide">
              <button
                class="btn-toggle"
                :class="{ active: gb.isActive, inactive: !gb.isActive }"
                @click="toggleActive(gb)"
              >
                {{ gb.isActive ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td>
              <button class="btn-delete" @click="deleteGuestbook(gb)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
td a {
  color: #0077cc;
  text-decoration: underline;
  cursor: pointer;
}
td a:hover {
  color: #005fa3;
}
.guestbook-table th {
  text-align: center;
}

.btn-toggle {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.btn-toggle.active {
  background-color: #4caf50;
}

.btn-toggle.inactive {
  background-color: #f44336;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
}

.inputNewGuestBook {
  width: 100%;
  max-width: 700px;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ccc;
}

.greenPlus {
  background-color: #4caf50;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 50%;
  margin-left: 0.5rem;
  font-weight: bold;
}

.inputTitle {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}

.inputTitle input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.outputGuestBooks {
  width: 100%;
  max-width: 700px;
}

.guestbook-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.guestbook-table th,
.guestbook-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.btn-edit,
.btn-delete {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

/* mq */
.responsive-hide {
  display: table-cell;
}

@media (max-width: 600px) {
  .responsive-hide {
    display: none;
  }
}
</style>
