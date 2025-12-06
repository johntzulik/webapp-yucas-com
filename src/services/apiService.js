const VUE_PAGOS_API_BASE_URL = import.meta.env.VITE_VUE_PAGOS_API_BASE_URL

class ApiService {
  constructor() {
    this.baseURL = VUE_PAGOS_API_BASE_URL
  }

  // Obtener el token de autenticación
  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  // Configurar headers con autenticación
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: this.getHeaders(options.headers)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Métodos HTTP específicos
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    })
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    })
  }

  // === ENDPOINTS ESPECÍFICOS ===

  // Dashboard - Últimos pagos
  async getUltimosPagos() {
    return this.post('/dashboard/ultimos-pagos')
  }

  async getMorosos () {
    return this.post('/dashboard/morosos')
  }
  // Ejemplo de otros posibles endpoints (puedes agregar más según lo necesites)
  async getBalanceTotal() {
    return this.get('/dashboard/balance-total')
  }

  async getBalanceMensual(mes, year) {
    return this.get(`/dashboard/balance-mensual?mes=${mes}&year=${year}`)
  }

  async getPagosGenerales(filtros = {}) {
    const queryParams = new URLSearchParams(filtros).toString()
    return this.get(`/dashboard/pagos-generales${queryParams ? '?' + queryParams : ''}`)
  }
}

// Exportar instancia única (singleton)
export const apiService = new ApiService()

// Exportar clase por si se necesita crear instancias personalizadas
export default ApiService
