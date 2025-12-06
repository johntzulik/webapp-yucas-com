import { ref } from 'vue'
import { useAuth } from './useAuth'

const YK_ADMIN_API_BASE_URL = import.meta.env.VITE_YK_ADMIN_API_BASE_URL

export function useConfiguracion() {
  const { token } = useAuth()
  const loading = ref(false)
  const error = ref(null)
  const configuracion = ref(null)

  /**
   * Obtiene la configuración global del sistema
   */
  const getConfiguracion = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_ADMIN_API_BASE_URL}/configuracion`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener configuración')
      }

      configuracion.value = data.data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error getting configuracion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza la configuración global del sistema
   */
  const updateConfiguracion = async (configData) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_ADMIN_API_BASE_URL}/configuracion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar configuración')
      }

      // Recargar configuración
      await getConfiguracion()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating configuracion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    configuracion,
    getConfiguracion,
    updateConfiguracion
  }
}
