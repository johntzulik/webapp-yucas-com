<script setup>
import { ref, onMounted } from 'vue'
import { loadScript } from '@paypal/paypal-js'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  mes: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  monthNumber: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'error', 'cancel'])

const paypalContainer = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // Cargar PayPal SDK
    const paypal = await loadScript({
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'ARTrIJkDTr5HwqQJJT1ZkxOFpjwoRdhpPqggyDJ6ouxRuC-bAoJ-GG1FGkjfr_AzCVvJZaAPkNMZxahh',
      currency: 'MXN'
    })

    // Renderizar botón de PayPal
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },

      // Crear la orden
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'MXN',
              value: props.amount.toFixed(2)
            },
            description: `Pago de mantenimiento - ${props.mes} ${props.year}`
          }]
        })
      },

      // Aprobar el pago
      onApprove: async (data, actions) => {
        try {
          const order = await actions.order.capture()

          // Emitir evento de éxito con información del pago
          emit('success', {
            order_id: order.id,
            payer_email: order.payer.email_address,
            amount: props.amount,
            mes: props.mes,
            year: props.year,
            month_number: props.monthNumber,
            paypal_data: order
          })
        } catch (err) {
          console.error('Error capturing PayPal order:', err)
          emit('error', err)
        }
      },

      // Cancelar el pago
      onCancel: () => {
        emit('cancel')
      },

      // Error en el pago
      onError: (err) => {
        console.error('PayPal error:', err)
        error.value = 'Error al procesar el pago con PayPal'
        emit('error', err)
      }
    }).render(paypalContainer.value)

    loading.value = false
  } catch (err) {
    console.error('Error loading PayPal:', err)
    error.value = 'Error al cargar PayPal'
    loading.value = false
  }
})
</script>

<template>
  <div class="paypal-button-container">
    <div v-if="loading" class="flex justify-center py-4">
      <span class="loading loading-spinner loading-md"></span>
    </div>

    <div v-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div ref="paypalContainer" class="paypal-buttons"></div>
  </div>
</template>

<style scoped>
.paypal-button-container {
  min-height: 150px;
}
</style>
