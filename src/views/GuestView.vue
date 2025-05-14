<script setup lang="ts">
import { useStore } from '@/stores/store'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router' //

import Welcome from './UserView_welc1.vue'
import Whois from './UserView_whois2.vue'
import Commit from './UserView_commit3.vue'
import Gallery from './UserView_gallery4.vue'

const store = useStore()
const route = useRoute() //

onMounted(() => {
  store.init()
  store.guestBookId = Number(route.params.guestBookId)
})
</script>

<template>
  <Welcome v-if="store.currentPage === 'welcome'" />
  <Whois v-else-if="store.currentPage === 'whois'" />
  <Commit v-else-if="store.currentPage === 'commit'" />
  <Gallery v-else />
</template>
