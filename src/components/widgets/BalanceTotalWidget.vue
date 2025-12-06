<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const balance = ref(0)
const error = ref(null)

const fetchBalance = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiService.getBalanceTotal()

    if (response.success) {
      balance.value = response.data.total || 0
    }
  } catch (err) {
    error.value = 'Error al cargar el balance'
    console.error('Error fetching balance:', err)
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
  <WidgetBase title="Balance Total" :loading="loading">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-full">
      <div class="text-6xl font-bold text-primary">
        {{ formatMonto(balance) }}
      </div>
      <p class="text-base-content/60 mt-2">Total acumulado</p>
    </div>
  </WidgetBase>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
