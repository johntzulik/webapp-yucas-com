<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const morosos = ref([])
const error = ref(null)

const fetchMorosos = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiService.getMorosos()

    if (response.success) {
      morosos.value = response.data
    }
  } catch (err) {
    error.value = 'Error al cargar los pagos'
    console.error('Error fetching pagos:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMorosos()
})

</script>

<template>
  <WidgetBase title="Top Morosos" :loading="loading">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="morosos.length > 0" class="space-y-2">
      <div v-for="(moroso, index) in morosos" :key="index" class="border border-base-300 rounded-lg p-3 hover:bg-base-200 transition-colors">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-bold text-sm">
              Casa {{ moroso.direccion }}
            </p>
            <p class="text-xs text-base-content/70">
              {{ moroso.nombre_completo }}
            </p>
            <p class="text-xs text-base-content/60 mt-1">
              {{ moroso.telefono }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-bold text-success">
              {{ moroso.ultimo_pago }}
            </p>
            <p class="text-xs text-base-content/60">
              {{ moroso.meses_sin_pagar }}
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
