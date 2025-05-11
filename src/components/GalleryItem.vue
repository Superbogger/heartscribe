<template>
  <div class="card">
    <img v-if="imageUrl" :src="imageUrl" alt="uploaded" class="card-image" />
    <div class="card-content">
      <p class="date">{{ date }}</p>
      <p class="author">{{ name || 'Anonym' }}</p>
      <p class="comment">{{ comment }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date: string
  name?: string
  comment: string
  imageUrl?: string
}>()
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
