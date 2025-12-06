import { createRouter, createWebHistory } from 'vue-router'
import authGuard from './authGuard'

const routes = [
    { path: '/login',
      name: 'Login',
      component: () => import('./views/Login.vue')
    },
    { path: '/forgotpassword',
      name: 'ForgotPassword',
      component: () => import('./views/ForgotPassword.vue'),
    },
    { path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/dashboardusers',
      name: 'DashboardUsers',
      component: () => import('./views/DashboardUsers.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Aplicar guard global
router.beforeEach(authGuard)

export default router