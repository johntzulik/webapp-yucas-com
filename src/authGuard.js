import { useAuth } from './composables/useAuth'

export async function authGuard(to, from, next) {
  const { isAuthenticated, validateToken, initializeAuth, isAdmin } = useAuth()

  // Inicializar autenticación si hay token en localStorage (solo si no está inicializado)
  await initializeAuth()

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      next('/login')
      return
    }

    // Validar token solo una vez al inicio (cuando viene de login o refresh)
    if (from.path === '/login' || from.path === '/') {
      const isValidToken = await validateToken()
      if (!isValidToken) {
        next('/login')
        return
      }
    }

    // Validar permisos de rol SOLO si la ruta requiere ser admin
    if (to.meta.requiresAdmin && !isAdmin.value) {
      // Si no es admin pero intenta acceder a ruta de admin, redirigir a dashboard de usuarios
      next('/dashboardusers')
      return
    }
  }

  // Si está autenticado y trata de ir a /login, redirigir según el rol
  if (to.path === '/login' && isAuthenticated.value) {
    if (isAdmin.value) {
      next('/')
    } else {
      next('/dashboardusers')
    }
    return
  }

  next()
}

export default authGuard