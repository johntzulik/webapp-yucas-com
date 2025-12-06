<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const pagos = ref([])
const error = ref(null)

const fetchPagos = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiService.getUltimosPagos()

    if (response.success) {
      pagos.value = response.data
    }
  } catch (err) {
    error.value = 'Error al cargar los pagos'
    console.error('Error fetching pagos:', err)
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
</script>

<template>
  <WidgetBase title="Últimos Pagos" :loading="loading">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="pagos.length > 0" class="space-y-2">
      <div
        v-for="(pago, index) in pagos"
        :key="index"
        class="border border-base-300 rounded-lg p-3 hover:bg-base-200 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-bold text-sm">
              Casa {{ pago.idcasa }}
            </p>
            <p class="text-xs text-base-content/70">
              {{ pago.concepto }}
            </p>
            <p class="text-xs text-base-content/60 mt-1">
              {{ pago.mesdepago }} {{ pago.year }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-bold text-success">
              {{ formatMonto(pago.monto) }}
            </p>
            <p class="text-xs text-base-content/60">
              {{ formatFecha(pago.fechadepago) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-base-content/60 py-8">
      No hay pagos registrados
    </div>
  </WidgetBase>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
