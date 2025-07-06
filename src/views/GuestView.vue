<script setup lang="ts">
import { useStore } from '@/stores/store'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

import Welcome from './UserView_welc1.vue'
import Whois from './UserView_whois2.vue'
import Commit from './UserView_commit3.vue'
import Gallery from './UserView_gallery4.vue'
// import { HttpStatusCode } from 'axios'

const store = useStore()
const route = useRoute()
const router = useRouter()

//handleGuestBookDelete
//reactive fallback to safe page if guestbook has been deleted
watch(
  () => store.currentlyViewingGuestBook,
  (newVal) => {
    if (newVal === null) {
      store.goTo('guest-landing')
      router.push('/guest')
    }
  },
)

onMounted(async () => {
  const publicId = route.params.guestBookID as string
  await store.reAuth()
  await store.loadOwnedGuestbooks()

  try {
    await store.waitForApiClientReady()

    //GET current GB
    const response = await store.apiClient!.get(`/api/guestbook/${publicId}`)
    store.currentlyViewingGuestBook = response.data

    // register/unregister of the guestbook (cleanup)
    // assert guest has only registered to one GB at any time
    store.registerCurrentlyViewing(response.data.publicId)

    //GET current Entries
    try {
      await store.waitForApiClientReady()

      const response = await store.apiClient!.get(
        `/api/guest-entries/${store.currentlyViewingGuestBook!.publicId}`,
      )
      store.currentlyViewingGuestEntries = response.data
      console.log('fetched stuff:', response.data)
    } catch (err) {
      console.error('Failed to load gallery entries', err)
    }

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
  <Gallery v-else-if="store.currentPage === 'gallery'" />
</template>
