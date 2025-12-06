<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResidentes } from '../composables/useResidentes'
import { useAuth } from '../composables/useAuth'
import PayPalButton from '../components/PayPalButton.vue'

const { habitantes, pagos, estadoCuenta, loading, error, getHabitantes, addHabitante, updateHabitante, deleteHabitante, getPagos, getEstadoCuenta, registrarPago } = useResidentes()
const { user } = useAuth()

// Estados del modal
const showHabitanteModal = ref(false)
const showPagoModal = ref(false)
const showPayPalModal = ref(false)
const editingHabitante = ref(null)
const selectedPago = ref(null)
const selectedMesPagar = ref(null)
const processingPayment = ref(false)

// Formulario de habitante
const habitanteForm = ref({
  nombre: '',
  apellidop: '',
  apellidom: '',
  correo: '',
  telefono: '',
  tipohabitante: 'RESIDENTE'
})

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await Promise.all([getHabitantes(), getPagos(), getEstadoCuenta()])
  } catch (err) {
    console.error('Error loading data:', err)
  }
})

// Computed
const habitantesPropietarios = computed(() => {
  return habitantes.value.filter(h => h.tipohabitante === 'PROPIETARIO')
})

const habitantesOtros = computed(() => {
  return habitantes.value.filter(h => h.tipohabitante !== 'PROPIETARIO')
})

// Métodos
const openAddHabitante = () => {
  editingHabitante.value = null
  habitanteForm.value = {
    nombre: '',
    apellidop: '',
    apellidom: '',
    correo: '',
    telefono: '',
    tipohabitante: 'RESIDENTE'
  }
  showHabitanteModal.value = true
}

const openEditHabitante = (habitante) => {
  editingHabitante.value = habitante
  habitanteForm.value = { ...habitante }
  showHabitanteModal.value = true
}

const saveHabitante = async () => {
  try {
    if (editingHabitante.value) {
      await updateHabitante(editingHabitante.value.id, habitanteForm.value)
    } else {
      await addHabitante(habitanteForm.value)
    }
    showHabitanteModal.value = false
  } catch (err) {
    alert('Error al guardar habitante: ' + err.message)
  }
}

const confirmDelete = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este habitante?')) {
    try {
      await deleteHabitante(id)
    } catch (err) {
      alert('Error al eliminar habitante: ' + err.message)
    }
  }
}

const viewReferencia = (pago) => {
  selectedPago.value = pago
  showPagoModal.value = true
}

const getMesColor = (year, mes) => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
  const mesIndex = meses.indexOf(mes.toUpperCase())

  if (year > currentYear || (year === currentYear && mesIndex > currentMonth)) {
    return 'badge-success'
  } else if (year === currentYear && mesIndex === currentMonth) {
    return 'badge-warning'
  }
  return 'badge-info'
}

const openPayPalModal = (mes) => {
  selectedMesPagar.value = mes
  showPayPalModal.value = true
}

const handlePayPalSuccess = async (paymentData) => {
  try {
    processingPayment.value = true

    await registrarPago({
      order_id: paymentData.order_id,
      payer_email: paymentData.payer_email,
      amount: paymentData.amount,
      mes: paymentData.mes,
      year: paymentData.year,
      month_number: paymentData.month_number
    })

    showPayPalModal.value = false
    selectedMesPagar.value = null
    alert('¡Pago exitoso! Tu pago ha sido registrado correctamente.')
  } catch (err) {
    alert('Error al registrar el pago: ' + err.message)
  } finally {
    processingPayment.value = false
  }
}

const handlePayPalError = (error) => {
  console.error('PayPal error:', error)
  alert('Error al procesar el pago. Por favor intenta nuevamente.')
}

const handlePayPalCancel = () => {
  showPayPalModal.value = false
  selectedMesPagar.value = null
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <div v-if="loading && habitantes.length === 0" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-2">Mi Residencia</h1>
        <p class="text-gray-600">Bienvenido {{ user?.name }}</p>
      </div>

      <!-- Estado de Cuenta Section -->
      <div v-if="estadoCuenta" class="card bg-base-200 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Estado de Cuenta</h2>

          <!-- Cuenta al corriente -->
          <div v-if="estadoCuenta.al_corriente" class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¡Tu cuenta está al corriente! No tienes pagos pendientes.</span>
          </div>

          <!-- Pagos pendientes -->
          <div v-else>
            <div class="alert alert-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 class="font-bold">Tienes pagos pendientes</h3>
                <div class="text-xs">Total adeudado: ${{ estadoCuenta.total_adeudado }}</div>
              </div>
            </div>

            <!-- Stats -->
            <div class="stats stats-vertical lg:stats-horizontal shadow mb-4 w-full">
              <div class="stat">
                <div class="stat-title">Mes Corriente</div>
                <div class="stat-value text-warning">{{ estadoCuenta.mes_corriente_pendiente ? 'Pendiente' : 'Pagado' }}</div>
                <div v-if="estadoCuenta.mes_corriente_pendiente" class="stat-desc">
                  Monto: ${{ estadoCuenta.mes_corriente_pendiente.monto }}
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Pagos Atrasados</div>
                <div class="stat-value text-error">{{ estadoCuenta.pagos_atrasados.length }}</div>
                <div class="stat-desc">{{ estadoCuenta.pagos_atrasados.length }} mes(es) pendiente(s)</div>
              </div>

              <div class="stat">
                <div class="stat-title">Total Adeudado</div>
                <div class="stat-value text-primary">${{ estadoCuenta.total_adeudado }}</div>
                <div class="stat-desc">MXN</div>
              </div>
            </div>

            <!-- Pago mes corriente -->
            <div v-if="estadoCuenta.mes_corriente_pendiente" class="card bg-base-100 shadow-md mb-4">
              <div class="card-body">
                <h3 class="card-title">
                  Pagar Mes Corriente: {{ estadoCuenta.mes_corriente_pendiente.mes }} {{ estadoCuenta.mes_corriente_pendiente.year }}
                </h3>
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-2xl font-bold text-success">${{ estadoCuenta.mes_corriente_pendiente.monto }}</p>
                    <p class="text-sm text-gray-600">{{ estadoCuenta.mes_corriente_pendiente.concepto }}</p>
                  </div>
                  <button
                    @click="openPayPalModal(estadoCuenta.mes_corriente_pendiente)"
                    class="btn btn-primary"
                  >
                    Pagar Ahora
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagos atrasados -->
            <div v-if="estadoCuenta.pagos_atrasados.length > 0" class="space-y-4">
              <h3 class="text-xl font-bold">Pagos Atrasados</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="pago in estadoCuenta.pagos_atrasados"
                  :key="`${pago.year}-${pago.month_number}`"
                  class="card bg-base-100 shadow-md"
                >
                  <div class="card-body p-4">
                    <div class="badge badge-error">ATRASADO</div>
                    <h4 class="font-bold text-lg">{{ pago.mes }} {{ pago.year }}</h4>
                    <p class="text-2xl font-bold text-error">${{ pago.monto }}</p>
                    <p class="text-sm text-gray-600">{{ pago.concepto }}</p>
                    <button
                      @click="openPayPalModal(pago)"
                      class="btn btn-sm btn-error mt-2"
                    >
                      Pagar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Residentes Section -->
      <div class="card bg-base-200 shadow-xl mb-6">
        <div class="card-body">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title text-2xl">Residentes</h2>
            <button @click="openAddHabitante" class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Agregar Habitante
            </button>
          </div>

          <div v-if="habitantes.length === 0" class="text-center py-8 text-gray-500">
            No hay habitantes registrados
          </div>

          <!-- Grid de habitantes -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="habitante in habitantes" :key="habitante.id" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
              <div class="card-body">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-bold text-lg">{{ habitante.nombre }} {{ habitante.apellidop }}</h3>
                    <p class="text-sm text-gray-600">{{ habitante.apellidom }}</p>
                    <div class="badge badge-primary mt-2">{{ habitante.tipohabitante }}</div>
                  </div>
                  <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                      <li><a @click="openEditHabitante(habitante)">Editar</a></li>
                      <li><a @click="confirmDelete(habitante.id)" class="text-error">Eliminar</a></li>
                    </ul>
                  </div>
                </div>
                <div class="divider my-2"></div>
                <div class="space-y-1 text-sm">
                  <p v-if="habitante.correo">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {{ habitante.correo }}
                  </p>
                  <p v-if="habitante.telefono">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {{ habitante.telefono }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Meses Pagados Section -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Historial de Pagos</h2>

          <div v-if="pagos.length === 0" class="text-center py-8 text-gray-500">
            No hay pagos registrados
          </div>

          <!-- Grid de pagos -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="pago in pagos" :key="`${pago.year}-${pago.mesdepago}`" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
              <div class="card-body p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div :class="['badge', getMesColor(pago.year, pago.mesdepago)]">
                      {{ pago.mesdepago }} {{ pago.year }}
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-success">${{ pago.monto }}</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ pago.concepto }}</p>
                <p class="text-xs text-gray-500">{{ new Date(pago.fechadepago).toLocaleDateString('es-MX') }}</p>

                <button
                  v-if="pago.referencia"
                  @click="viewReferencia(pago)"
                  class="btn btn-sm btn-outline mt-2 w-full"
                >
                  Ver Referencia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Habitante -->
    <dialog :open="showHabitanteModal" class="modal" @click.self="showHabitanteModal = false">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">
          {{ editingHabitante ? 'Editar Habitante' : 'Agregar Habitante' }}
        </h3>

        <form @submit.prevent="saveHabitante" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Nombre *</span></label>
              <input v-model="habitanteForm.nombre" type="text" required class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Apellido Paterno *</span></label>
              <input v-model="habitanteForm.apellidop" type="text" required class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Apellido Materno</span></label>
              <input v-model="habitanteForm.apellidom" type="text" class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Correo</span></label>
              <input v-model="habitanteForm.correo" type="email" class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Teléfono</span></label>
              <input v-model="habitanteForm.telefono" type="tel" maxlength="10" class="input input-bordered" />
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Tipo de Habitante *</span></label>
              <select v-model="habitanteForm.tipohabitante" required class="select select-bordered">
                <option value="PROPIETARIO">Propietario</option>
                <option value="RESIDENTE">Residente</option>
                <option value="RENTA">Renta</option>
              </select>
            </div>
          </div>

          <div class="modal-action">
            <button type="button" @click="showHabitanteModal = false" class="btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ editingHabitante ? 'Actualizar' : 'Agregar' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @submit="showHabitanteModal = false">
        <button>close</button>
      </form>
    </dialog>

    <!-- Modal Referencia de Pago -->
    <dialog :open="showPagoModal" class="modal" @click.self="showPagoModal = false">
      <div class="modal-box max-w-4xl">
        <h3 class="font-bold text-lg mb-4">Referencia de Pago</h3>

        <div v-if="selectedPago" class="space-y-4">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 p-4 bg-white shadow-md rounded-lg">
              <div class="text-sm font-medium text-gray-500">Mes</div>
              <div class="text-3xl text-lg">{{ selectedPago.mesdepago }} {{ selectedPago.year }}</div>
            </div>
            <div class="flex-1 p-4 bg-white shadow-md rounded-lg">
              <div class="text-sm font-medium text-gray-500">Monto</div>
              <div class="text-3xl text-success">${{ selectedPago.monto }}</div>
            </div>
            <div class="flex-1 p-4 bg-white shadow-md rounded-lg">
              <div class="text-sm font-medium text-gray-500">Fecha</div>
              <div class="text-3xltext-lg">{{ new Date(selectedPago.fechadepago).toLocaleDateString('es-MX') }}</div>
            </div>
          </div>

          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-bold mb-2">Comprobante:</h4>
            <div v-if="selectedPago.referencia" class="overflow-auto max-h-96">
              {{ selectedPago.referencia }}
            </div>
            <p v-else class="text-gray-500">No hay referencia disponible</p>
          </div>
        </div>

        <div class="modal-action">
          <button @click="showPagoModal = false" class="btn">Cerrar</button>
        </div>
      </div>

    </dialog>

    <!-- Modal PayPal -->
    <dialog :open="showPayPalModal" class="modal" @click.self="handlePayPalCancel">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Realizar Pago</h3>

        <div v-if="selectedMesPagar" class="space-y-4">
          <!-- Información del pago -->
          <div class="bg-base-200 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Mes a pagar</p>
                <p class="text-lg font-bold">{{ selectedMesPagar.mes }} {{ selectedMesPagar.year }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Monto</p>
                <p class="text-2xl font-bold text-success">${{ selectedMesPagar.monto }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Concepto</p>
                <p class="text-sm">{{ selectedMesPagar.concepto }}</p>
              </div>
            </div>
          </div>

          <!-- Botón PayPal -->
          <div v-if="!processingPayment" class="border-2 border-dashed border-base-300 rounded-lg p-4">
            <PayPalButton
              :amount="selectedMesPagar.monto"
              :mes="selectedMesPagar.mes"
              :year="selectedMesPagar.year"
              :month-number="selectedMesPagar.month_number"
              @success="handlePayPalSuccess"
              @error="handlePayPalError"
              @cancel="handlePayPalCancel"
            />
          </div>

          <!-- Procesando pago -->
          <div v-else class="flex flex-col items-center justify-center py-8">
            <span class="loading loading-spinner loading-lg mb-4"></span>
            <p class="text-lg">Procesando tu pago...</p>
            <p class="text-sm text-gray-600">Por favor espera un momento</p>
          </div>
        </div>

        <div class="modal-action">
          <button @click="handlePayPalCancel" class="btn" :disabled="processingPayment">
            Cancelar
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @submit="handlePayPalCancel">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.modal[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
