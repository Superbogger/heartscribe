<script setup lang="ts">
import { useStore } from '@/stores/store'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/services/apiClient'

import Welcome from './UserView_welc1.vue'
import Whois from './UserView_whois2.vue'
import Commit from './UserView_commit3.vue'
import Gallery from './UserView_gallery4.vue'
// import { HttpStatusCode } from 'axios'

const store = useStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  store.init()
  const publicId = route.params.guestBookID as string

  await store.reAuth()
  await store.loadOwnedGuestbooks()

  try {
    const response = await apiClient.get(`/api/guestbook/${publicId}`)
    store.currentlyViewingGuestBook = response.data

    //TODO: active/inactive access
    // if(response.status === HttpStatusCode.Ok && !store.currentlyViewingGuestBook!.isActive)
    // {

    // }

    // Redirect to child route if directly at /guest/:id
    if (route.path === `/guest/${publicId}`) {
      router.replace({ name: 'guest-welcome', params: { guestBookID: publicId } })
    }
  } catch (err) {
    console.error('Guestbook not found', err)
    router.replace('/guest')
  }
})
</script>

<template>
  <Welcome v-if="store.currentPage === 'welcome'" />
  <Whois v-else-if="store.currentPage === 'whois'" />
  <Commit v-else-if="store.currentPage === 'commit'" />
  <Gallery v-else />
</template>
