<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore, type GuestBook } from '@/stores/store'
import apiClient from '@/services/apiClient'
import ImageUpload from '@/components/ImageUploadButton.vue'

const store = useStore()
const inputTitle = ref('')
const showExplanation = ref(false)

onMounted(async () => {
  try {
    //fill owned guestbooks
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
async function deleteGuestbook(gb: GuestBook) {
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

// filehandling
const selectedFile = ref<File | null>(null)
function handleFile(file: File) {
  selectedFile.value = file
}

/* costumizer bar code*/
// let costumizeON: boolean = false
const customHeader = ref('')
const customFooter = ref('')
const customizingId = ref<string | null>(null)

function toggleCustomize(publicID: string) {
  customizingId.value = customizingId.value === publicID ? null : publicID
}

//FIXME:  add patch for costum text and or image ( both text mandatory, image optional but needs to be uploaded)
//update header
async function submitPatch(gb: GuestBook) {
  try {
    const formData = new FormData()
    formData.append('headerText', customHeader.value)
    formData.append('footerText', customFooter.value)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    const response = await apiClient.patch(`/api/guestbook/${gb.publicId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Update frontend state with new values
    gb.headerText = customHeader.value
    gb.footerText = customFooter.value
    if (response.data.imageUrl) {
      gb.imageUrl = response.data.imageUrl
    }

    // Reset UI
    toggleCustomize('')
    customHeader.value = ''
    customFooter.value = ''
    selectedFile.value = null
  } catch (err) {
    console.error('Failed to update guestbook', err)
  }
}
</script>

<template>
  <div class="hero">
    <section class="inputNewGuestBook">
      <h2>
        New GuestBook<span class="blueQuestionmark" @click="showExplanation = !showExplanation"
          >?</span
        >
      </h2>

      <form class="inputTitle" @submit.prevent="createGuestbook">
        <label for="titleGuestbook">Name:</label>
        <input v-model="inputTitle" type="text" id="titleGuestbook" required />
      </form>
    </section>

    <section class="explainText" v-if="showExplanation">
      <p>
        Manage your Guestbooks here: create, delete, set the active status.
        <br />
        <strong> You may edit the Title, and costum settings of the guestbook at any time </strong>
      </p>
      <p>Costumize them by setting your own Background Image and Text</p>
    </section>

    <section class="outputGuestBooks">
      <h2>Guestbooks</h2>
      <table class="guestbook-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Share</th>
            <th>Costumize</th>
            <th class="responsive-hide">Created</th>
            <th class="responsive-hide">Active</th>
            <th class="responsive-hide">Actions</th>
          </tr>
        </thead>
        <tbody v-for="gb in store.guestBooks" :key="gb.publicId">
          <tr>
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
              <RouterLink @click="setCurrGB_switchPage(gb)" :to="`/guest/${gb.publicId}/`">
                {{ gb.publicId }}
              </RouterLink>
            </td>
            <td>
              <button class="costumizeGB" @click="toggleCustomize(gb.publicId)">Customize</button>
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
              <button class="btn-delete responsive-hide" @click="deleteGuestbook(gb)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="customizingId === gb.publicId" class="customize-row">
            <td colspan="6">
              <transition name="slide">
                <div class="customizer-bar" v-if="customizingId === gb.publicId">
                  <div class="customizer-inner">
                    <div>
                      <label for="title">Header:</label>
                      <input
                        id="title"
                        type="text"
                        v-model="customHeader"
                        :placeholder="gb.headerText"
                        required
                      />
                    </div>

                    <div>
                      <label for="message">Message:</label>
                      <input
                        id="message"
                        type="text"
                        v-model="customFooter"
                        :placeholder="gb.footerText"
                        required
                      />
                    </div>
                    <div class="upload-wrapper">
                      <ImageUpload id="upload-photo" @file-selected="handleFile" />
                    </div>
                    <p v-if="selectedFile">Ausgewählt: {{ selectedFile.name }}</p>
                  </div>
                  <button @click="submitPatch(gb)">Submit</button>
                </div>
              </transition>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.upload-wrapper {
  margin-top: auto;
}
strong {
  font-weight: 900;
}

.explainText {
  text-align: left;
  border-bottom: 2px solid #ccc;
  width: 100%;
  max-width: 700px;
  padding: 1rem 1rem 1.5rem;
  color: #444;
  font-size: 1rem;
  line-height: 1.5;
  background-color: #fafafa;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* costumizer bar */
.customizer-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  background: #f3f3f3;
  border-top: 1px solid #ccc;
  gap: 1rem;
}

.customizer-inner > div {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
  min-width: 150px;
  max-width: 100%;
}

.customizer-inner label {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.customizer-inner input[type='text'] {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  width: 100%;
}
.customizer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
}

.customizer-inner > * {
  flex: 1 1 200px;
  min-width: 150px;
  max-width: 100%;
}

.customizer-bar button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 6px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

/*  */

.costumizeGB {
  background: linear-gradient(45deg, #ffd700, #ffc107);
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  transition: transform 0.2s;
}

.costumizeGB:hover {
  transform: scale(1.05);
}

/* Sparkle layer */
.costumizeGB::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 80%);
  animation: sparkle 4s linear infinite;
  pointer-events: none;
  opacity: 0.5;
}

@keyframes sparkle {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(50%, 50%) rotate(360deg);
  }
}

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
  margin-bottom: 0;
}

.blueQuestionmark {
  background-color: #64a1f1;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 50%;
  margin-left: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.blueQuestionmark:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 0 8px rgba(100, 161, 241, 0.6);
}

.blueQuestionmark:active {
  transform: scale(0.95);
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
