<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const pagos = ref([])
const error = ref(null)
const filtros = ref({
  mes: '',
  year: new Date().getFullYear().toString()
})

const fetchPagos = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiService.getPagosGenerales(filtros.value)

    if (response.success) {
      pagos.value = response.data || []
    }
  } catch (err) {
    error.value = 'Error al cargar los pagos generales'
    console.error('Error fetching pagos generales:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPagos()
})

const formatMonto = (monto) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(monto)
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const totalPagos = () => {
  return pagos.value.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0)
}
</script>

<template>
  <WidgetBase title="Pagos Generales" :loading="loading">
    <div v-if="error" class="alert alert-error mb-2">
      <span>{{ error }}</span>
    </div>

    <div v-else>
      <!-- Resumen -->
      <div class="stats bg-base-200 mb-4 w-full">
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">Total de Pagos</div>
          <div class="stat-value text-2xl">{{ pagos.length }}</div>
        </div>
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">Monto Total</div>
          <div class="stat-value text-2xl">{{ formatMonto(totalPagos()) }}</div>
        </div>
      </div>

      <!-- Tabla de pagos -->
      <div class="overflow-x-auto">
        <table class="table table-xs table-zebra">
          <thead>
            <tr>
              <th>Casa</th>
              <th>Monto</th>
              <th>Mes</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pago, index) in pagos" :key="index">
              <td class="font-semibold">{{ pago.idcasa }}</td>
              <td class="text-success">{{ formatMonto(pago.monto) }}</td>
              <td>{{ pago.mesdepago }}</td>
              <td>{{ formatFecha(pago.fechadepago) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagos.length === 0" class="text-center text-base-content/60 py-4">
        No hay pagos registrados
      </div>
    </div>
  </WidgetBase>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
