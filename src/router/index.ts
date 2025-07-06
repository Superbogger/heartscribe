import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores/store'
// import HomeView from '../views/AdminView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin-login',
      component: () => import('../views/AdminView.vue'),
      beforeEnter: (to, from, next) => {
        const store = useStore()
        if (store.loggedIn) return next('/user') // redirect logged-in user to admin page
        next()
      },
    },
    {
      path: '/user',
      name: 'admin-panel',
      component: () => import('../views/AdminLoggedInView.vue'),
      beforeEnter: (to, from, next) => {
        const store = useStore()
        if (!store.loggedIn) return next({ name: 'admin-login' }) // redirect !loggedin user to
        next()
      },
    },
    {
      // Guest lands here via NavLinks or if no ID provided
      path: '/guest',
      name: 'guest-landing',
      component: () => import('../views/GuestLandingView.vue'),
    },
    {
      // Guest lands directly at the respective Guestbook
      path: '/guest/:guestBookID',
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
