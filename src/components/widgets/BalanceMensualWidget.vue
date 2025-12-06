<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const balance = ref(0)
const mes = ref('')
const year = ref('')
const error = ref(null)

const fetchBalance = async () => {
  try {
    loading.value = true
    error.value = null

    // Obtener mes y año actual
    const fecha = new Date()
    mes.value = fecha.toLocaleDateString('es-MX', { month: 'long' }).toUpperCase()
    year.value = fecha.getFullYear().toString()

    const response = await apiService.getBalanceMensual(mes.value, year.value)

    if (response.success) {
      balance.value = response.data.total || 0
    }
  } catch (err) {
    error.value = 'Error al cargar el balance mensual'
    console.error('Error fetching balance mensual:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBalance()
})

const formatMonto = (monto) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(monto)
}
</script>

<template>
  <WidgetBase title="Balance Mensual" :loading="loading">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-full">
      <p class="text-base-content/60 mb-2">{{ mes }} {{ year }}</p>
      <div class="text-5xl font-bold text-secondary">
        {{ formatMonto(balance) }}
      </div>
      <p class="text-base-content/60 mt-2">Total del mes</p>
    </div>
  </WidgetBase>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
