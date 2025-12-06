import { ref } from 'vue'
import { useAuth } from './useAuth'

const YK_RESIDENTE_API_BASE_URL = import.meta.env.VITE_YK_RESIDENTE_API_BASE_URL

export function useResidentes() {
  const { token } = useAuth()
  const loading = ref(false)
  const error = ref(null)

  const habitantes = ref([])
  const pagos = ref([])
  const estadoCuenta = ref(null)

  /**
   * Obtiene los habitantes del residente
   */
  const getHabitantes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/habitantes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener habitantes')
      }

      habitantes.value = data.data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error getting habitantes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Agrega un nuevo habitante
   */
  const addHabitante = async (habitanteData) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/habitantes/agregar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(habitanteData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar habitante')
      }

      // Recargar habitantes
      await getHabitantes()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error adding habitante:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza un habitante existente
   */
  const updateHabitante = async (id, habitanteData) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/habitantes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(habitanteData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar habitante')
      }

      // Recargar habitantes
      await getHabitantes()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating habitante:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Elimina un habitante
   */
  const deleteHabitante = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/habitantes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar habitante')
      }

      // Recargar habitantes
      await getHabitantes()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error deleting habitante:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene los pagos del residente
   */
  const getPagos = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pagos')
      }

      pagos.value = data.data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error getting pagos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene el estado de cuenta del residente
   */
  const getEstadoCuenta = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/estado-cuenta`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estado de cuenta')
      }

      estadoCuenta.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error getting estado cuenta:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Registra un pago de PayPal
   */
  const registrarPago = async (pagoData) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${YK_RESIDENTE_API_BASE_URL}/registrar-pago`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pagoData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar pago')
      }

      // Recargar estado de cuenta y pagos
      await Promise.all([getEstadoCuenta(), getPagos()])
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error registering payment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    habitantes,
    pagos,
    estadoCuenta,
    getHabitantes,
    addHabitante,
    updateHabitante,
    deleteHabitante,
    getPagos,
    getEstadoCuenta,
    registrarPago
  }
}
