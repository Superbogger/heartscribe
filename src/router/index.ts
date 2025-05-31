import AdminLoggedInView from '@/views/AdminLoggedInView.vue'
import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/AdminView.vue'
import { useStore } from '@/stores/store'
import apiClient from '@/services/apiClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin-login',
      component: () => import('../views/AdminView.vue'), // login/register page
    },
    {
      path: '/user',
      name: 'admin-panel',
      component: () => import('../views/AdminLoggedInView.vue'), // shown after login
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

//REFACTOR: more efficient to use onMounted ( save some api calls)
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('heartscribe_user_token')
  const store = useStore()

  try {
    const res = await apiClient.get('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.data?.name) {
      store.currentUserName = res.data.name
      store.loggedIn = true
    }
  } catch {
    localStorage.removeItem('heartscribe_user_token')
  }

  // If user goes to / and already has a token, redirect to /user
  if (to.name === 'admin-login' && token) {
    return next('/user')
  }

  // If user tries to access /user without a valid login, redirect to login
  if (to.name === 'admin-panel' && !token) {
    return next({ name: 'admin-login' })
  }

  next()
})

// onMounted(async () => {
//   const token = localStorage.getItem('heartscribe_user_token')
//   if (!token) return

//   try {
//     const res = await apiClient.get('/api/user/me', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     store.loggedIn = true
//     store.currentUserName = res.data.name
//   } catch {
//     localStorage.removeItem('heartscribe_user_token')
//   }
// })

// OR

// {
//   path: '/user',
//   name: 'admin-panel',
//   component: () => import('../views/AdminLoggedInView.vue'),
//   beforeEnter: async (to, from, next) => {
//     const token = localStorage.getItem('heartscribe_user_token')
//     if (!token) return next({ name: 'admin-login' })

//     try {
//       const res = await apiClient.get('/api/user/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       store.loggedIn = true
//       store.currentUserName = res.data.name
//       next()
//     } catch {
//       localStorage.removeItem('heartscribe_user_token')
//       next({ name: 'admin-login' })
//     }
//   },
// }

export default router
