# Sistema de Widgets Arrastrables - Dashboard Las Yucas

Sistema de widgets arrastrables implementado con `vue-grid-layout` que permite visualizar información del dashboard en un grid configurable de 3x3.

## Características

- **Widgets arrastrables**: Mueve los widgets por el dashboard
- **Redimensionables**: Ajusta el tamaño de cada widget
- **Grid responsivo**: Sistema de 3 columnas adaptable
- **Fácil extensión**: Agrega nuevos widgets fácilmente

## Widgets Disponibles

### UltimosPagosWidget
Muestra los últimos 10 pagos registrados en el sistema.

**Datos mostrados:**
- ID de casa
- Monto del pago
- Concepto
- Mes y año
- Fecha de pago

### BalanceTotalWidget
Muestra el balance total acumulado de todos los pagos.

**Datos mostrados:**
- Monto total formateado en MXN

### BalanceMensualWidget
Muestra el balance del mes actual.

**Datos mostrados:**
- Mes y año actual
- Monto total del mes en MXN

### PagosGeneralesWidget
Tabla con todos los pagos generales con resumen estadístico.

**Datos mostrados:**
- Tabla de pagos (casa, monto, mes, fecha)
- Total de pagos registrados
- Monto total acumulado

## Crear un Nuevo Widget

### 1. Crear el componente del widget

Crea un archivo en `src/components/widgets/TuNuevoWidget.vue`:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import WidgetBase from '../WidgetBase.vue'
import { apiService } from '../../services/apiService'

const loading = ref(false)
const data = ref(null)
const error = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await apiService.tuEndpoint()

    if (response.success) {
      data.value = response.data
    }
  } catch (err) {
    error.value = 'Error al cargar los datos'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <WidgetBase title="Tu Título" :loading="loading">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <div v-else>
      <!-- Tu contenido aquí -->
      {{ data }}
    </div>
  </WidgetBase>
</template>
```

### 2. Agregar el widget al Dashboard

Edita `src/views/Dashboard.vue`:

```javascript
// Importar el widget
import TuNuevoWidget from '../components/widgets/TuNuevoWidget.vue'

// Agregar al mapeo de componentes
const widgetComponents = {
  UltimosPagosWidget,
  BalanceTotalWidget,
  BalanceMensualWidget,
  PagosGeneralesWidget,
  TuNuevoWidget  // <-- Agregar aquí
}

// Agregar al layout
const layout = ref([
  // ... widgets existentes
  { x: 0, y: 2, w: 1, h: 1, i: '4', component: 'TuNuevoWidget' },
])
```

## Configuración del Grid

El grid está configurado en `Dashboard.vue`:

```javascript
const colNum = 3           // 3 columnas
const rowHeight = 200      // Altura de cada fila en píxeles
const isDraggable = true   // Permite arrastrar widgets
const isResizable = true   // Permite redimensionar widgets
```

## Propiedades del Layout

Cada widget en el layout tiene las siguientes propiedades:

- `x`: Posición horizontal (0-2 para grid de 3 columnas)
- `y`: Posición vertical
- `w`: Ancho en columnas
- `h`: Alto en filas
- `i`: ID único del widget
- `component`: Nombre del componente a renderizar

## Componente WidgetBase

Todos los widgets deben usar `WidgetBase` como wrapper, que proporciona:

- Estructura consistente (card con título)
- Estado de carga con spinner
- Manejo de overflow para contenido largo
- Estilos consistentes

### Props de WidgetBase

- `title` (String, requerido): Título del widget
- `loading` (Boolean, default: false): Muestra spinner de carga
