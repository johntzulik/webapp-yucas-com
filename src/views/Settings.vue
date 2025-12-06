<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfiguracion } from '../composables/useConfiguracion'
import { useAuth } from '../composables/useAuth'

const { configuracion, loading, error, getConfiguracion, updateConfiguracion } = useConfiguracion()
const { user, isAdmin } = useAuth()

// Form state
const configForm = ref({
  pago_mensual: 250,
  incremento_tipo: 'pesos',
  incremento_valor: 25,
  dia_limite_pago: 5,
  pago_atrasado: 300,
  moneda: 'MXN',
  año_inicio: 2023
})

const saving = ref(false)

// Cargar configuración al montar
onMounted(async () => {
  try {
    await getConfiguracion()
    if (configuracion.value) {
      configForm.value = { ...configuracion.value }
    }
  } catch (err) {
    console.error('Error loading configuration:', err)
  }
})

// Computed
const montoConIncremento = computed(() => {
  const base = parseFloat(configForm.value.pago_mensual) || 0
  const incremento = parseFloat(configForm.value.incremento_valor) || 0

  if (configForm.value.incremento_tipo === 'porcentaje') {
    return (base + (base * (incremento / 100))).toFixed(2)
  } else {
    return (base + incremento).toFixed(2)
  }
})

// Methods
const handleSave = async () => {
  try {
    saving.value = true

    await updateConfiguracion(configForm.value)
    alert('Configuración actualizada correctamente')
  } catch (err) {
    alert('Error al guardar configuración: ' + err.message)
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  if (confirm('¿Estás seguro de que deseas restablecer los valores por defecto?')) {
    configForm.value = {
      pago_mensual: 250,
      incremento_tipo: 'pesos',
      incremento_valor: 25,
      dia_limite_pago: 5,
      pago_atrasado: 300,
      moneda: 'MXN',
      año_inicio: 2023
    }
  }
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Configuración del Sistema</h1>
      <p class="text-gray-600">Administra las configuraciones globales de pagos</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !configuracion" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Main Form -->
    <div v-else class="space-y-6">
      <!-- Configuración de Pagos -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Configuración de Pagos
          </h2>

          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Pago Mensual -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Pago Mensual Base</span>
                </label>
                <label class="input-group">
                  <span>$</span>
                  <input
                    v-model.number="configForm.pago_mensual"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input input-bordered w-full"
                  />
                  <span>{{ configForm.moneda }}</span>
                </label>
                <label class="label">
                  <span class="label-text-alt">Monto base del pago mensual</span>
                </label>
              </div>

              <!-- Día Límite de Pago -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Día Límite de Pago</span>
                </label>
                <input
                  v-model.number="configForm.dia_limite_pago"
                  type="number"
                  min="1"
                  max="31"
                  required
                  class="input input-bordered w-full"
                />
                <label class="label">
                  <span class="label-text-alt">Día del mes límite para pagar sin recargo</span>
                </label>
              </div>

              <!-- Tipo de Incremento -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Tipo de Incremento por Mora</span>
                </label>
                <select
                  v-model="configForm.incremento_tipo"
                  class="select select-bordered w-full"
                  required
                >
                  <option value="pesos">Pesos</option>
                  <option value="porcentaje">Porcentaje</option>
                </select>
                <label class="label">
                  <span class="label-text-alt">Cómo se calcula el recargo por pago tardío</span>
                </label>
              </div>

              <!-- Valor de Incremento -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Valor del Incremento</span>
                </label>
                <label class="input-group">
                  <span v-if="configForm.incremento_tipo === 'pesos'">$</span>
                  <input
                    v-model.number="configForm.incremento_valor"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input input-bordered w-full"
                  />
                  <span v-if="configForm.incremento_tipo === 'porcentaje'">%</span>
                  <span v-else>{{ configForm.moneda }}</span>
                </label>
                <label class="label">
                  <span class="label-text-alt">
                    {{ configForm.incremento_tipo === 'porcentaje' ? 'Porcentaje de recargo' : 'Monto de recargo' }}
                  </span>
                </label>
              </div>

              <!-- Pago Atrasado -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Pago Mensual Atrasado</span>
                </label>
                <label class="input-group">
                  <span>$</span>
                  <input
                    v-model.number="configForm.pago_atrasado"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input input-bordered w-full"
                  />
                  <span>{{ configForm.moneda }}</span>
                </label>
                <label class="label">
                  <span class="label-text-alt">Monto para meses atrasados (no corrientes)</span>
                </label>
              </div>

              <!-- Año de Inicio -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Año de Inicio del Sistema</span>
                </label>
                <input
                  v-model.number="configForm.año_inicio"
                  type="number"
                  min="2020"
                  max="2030"
                  required
                  class="input input-bordered w-full"
                />
                <label class="label">
                  <span class="label-text-alt">A partir de qué año se calculan los pagos</span>
                </label>
              </div>
            </div>

            <!-- Preview del Cálculo -->
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <h3 class="font-bold">Vista Previa de Cálculos:</h3>
                <ul class="text-sm mt-2 space-y-1">
                  <li>• Pago normal (dentro del día {{ configForm.dia_limite_pago }}): <strong>${{ configForm.pago_mensual }}</strong></li>
                  <li>• Pago con recargo (después del día {{ configForm.dia_limite_pago }}): <strong>${{ montoConIncremento }}</strong></li>
                  <li>• Pago atrasado (meses anteriores): <strong>${{ configForm.pago_atrasado }}</strong></li>
                </ul>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 justify-end">
              <button
                type="button"
                @click="handleReset"
                class="btn btn-outline"
                :disabled="saving"
              >
                Restablecer Valores
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="saving || loading"
              >
                <span v-if="saving" class="loading loading-spinner loading-sm"></span>
                {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-xl mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Información
          </h2>
          <div class="text-sm space-y-2">
            <p><strong>Última actualización:</strong> {{ user?.name }}</p>
            <p class="text-gray-600">Los cambios en la configuración se aplicarán inmediatamente a todos los cálculos de pagos pendientes.</p>
            <p class="text-warning">⚠️ Los pagos ya registrados NO se verán afectados por estos cambios.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
