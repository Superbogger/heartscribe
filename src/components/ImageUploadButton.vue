<template>
  <div class="form-group">
    <label :for="id" class="custom-file-label">FOTO HINZUFÜGEN</label>
    <input :id="id" type="file" class="hidden-file-input" @change="onFileChange" />
  </div>
</template>

<script setup lang="ts">
//Emits are outputs from a component.
const emit = defineEmits<{ (e: 'file-selected', file: File): void }>()

//Props are inputs to a component.
defineProps<{
  id: string
}>()

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]

  if (file) {
    emit('file-selected', file)
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 0.5rem;
}

.custom-file-label {
  display: block;
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fefefe;
  text-align: center;
  font-weight: bold;
  color: #ff8c7a;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.custom-file-label:hover {
  background-color: #fff1ee;
}

.hidden-file-input {
  display: none;
}
</style>
