import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/guest/:guestBookId',
      component: () => import('../views/GuestView.vue'), // optional wrapper, can replace with GuestLayout.vue
      children: [
        {
          path: '',
          name: 'guest-welcome',
          component: () => import('../views/UserView_welc1.vue'),
        },
        {
          path: 'whois',
          name: 'guest-whois',
          component: () => import('../views/UserView_whois2.vue'),
        },
        {
          path: 'commit',
          name: 'guest-commit',
          component: () => import('../views/UserView_commit3.vue'),
        },
        {
          path: 'gallery',
          name: 'guest-gallery',
          component: () => import('../views/UserView_gallery4.vue'),
        },
      ],
    },
  ],
})

export default router
