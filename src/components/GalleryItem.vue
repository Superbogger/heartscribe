<template>
  <div class="card">
    <img v-if="imageUrl" :src="fullImageUrl" alt="uploaded" class="card-image" />
    <div class="card-content">
      <p class="date">{{ date }}</p>
      <p class="author">{{ name || 'Anonym' }}</p>
      <p class="comment">{{ comment }}</p>
    </div>
    <button v-if="canDelete" class="delete-btn" @click="emit('delete')">✕</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  date: string
  name?: string
  comment: string
  imageUrl?: string
  canDelete?: boolean
}>()

const emit = defineEmits(['delete'])

// Automatically prepend localhost if imageUrl is relative
const fullImageUrl = computed(() =>
  props.imageUrl?.startsWith('http')
    ? props.imageUrl
    : `${import.meta.env.VITE_BACKEND_URL}${props.imageUrl}`,
)
</script>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 100%;
  position: relative; /* Required for absolute delete button */
}

/* .delete-btn {
  position: absolute;

  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
} */

.delete-btn {
  position: absolute;

  /* bottom: 10px;
  right: 10px; */

  top: 10px;
  right: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.delete-btn:hover {
  background-color: #d32f2f;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.card-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.date {
  font-size: 0.75rem;
  color: #888;
  font-family: 'Roboto Mono', monospace;
}

.author {
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
}

.comment {
  font-size: 1rem;
  font-family: 'Georgia', serif;
  line-height: 1.4;
}
</style>
