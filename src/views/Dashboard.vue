<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { GridLayout, GridItem } from 'vue3-grid-layout'
import 'vue3-grid-layout/public/app.css'
import UltimosPagosWidget from '../components/widgets/UltimosPagosWidget.vue'
import MorososWidget from '@/components/widgets/MorososWidget.vue'

//import BalanceTotalWidget from '../components/widgets/BalanceTotalWidget.vue'
//import BalanceMensualWidget from '../components/widgets/BalanceMensualWidget.vue'
//import PagosGeneralesWidget from '../components/widgets/PagosGeneralesWidget.vue'

// Configuración del layout - Grid responsive
const layout = ref([
  { x: 0, y: 0, w: 1, h: 2, i: '0', component: 'UltimosPagosWidget' },
  { x: 1, y: 0, w: 1, h: 2, i: '1', component: 'MorososWidget' },
  { x: 2, y: 0, w: 1, h: 2, i: '2', component: 'UltimosPagosWidget' },
  { x: 0, y: 2, w: 1, h: 2, i: '3', component: 'UltimosPagosWidget' },
])
/*
const layout = ref([
  { x: 0, y: 0, w: 1, h: 2, i: '0', component: 'UltimosPagosWidget' },
  { x: 1, y: 0, w: 1, h: 1, i: '1', component: 'BalanceTotalWidget' },
  { x: 2, y: 0, w: 1, h: 1, i: '2', component: 'BalanceMensualWidget' },
  { x: 1, y: 1, w: 2, h: 2, i: '3', component: 'PagosGeneralesWidget' },
])
  */

// Configuración del grid con responsive breakpoints
const colNum = ref(3)
const rowHeight = 220
const isDraggable = ref(true)
const isResizable = ref(true)
const verticalCompact = true
const preventCollision = false

// Configuración responsive para diferentes tamaños de pantalla
const responsiveLayouts = {
  lg: { // Desktop (1200px+)
    breakpoint: 1200,
    cols: 3,
    layouts: [
      { x: 0, y: 0, w: 1, h: 2, i: '0', component: 'UltimosPagosWidget' },
      { x: 1, y: 0, w: 1, h: 2, i: '1', component: 'MorososWidget' },
      { x: 2, y: 0, w: 1, h: 2, i: '2', component: 'UltimosPagosWidget' },
      { x: 0, y: 2, w: 1, h: 2, i: '3', component: 'UltimosPagosWidget' },
    ]
  },
  md: { // Tablet (768px - 1199px)
    breakpoint: 768,
    cols: 2,
    layouts: [
      { x: 0, y: 0, w: 1, h: 2, i: '0', component: 'UltimosPagosWidget' },
      { x: 1, y: 0, w: 1, h: 2, i: '1', component: 'MorososWidget' },
      { x: 0, y: 2, w: 1, h: 2, i: '2', component: 'UltimosPagosWidget' },
      { x: 1, y: 2, w: 1, h: 2, i: '3', component: 'UltimosPagosWidget' },
    ]
  },
  sm: { // Mobile (menos de 768px)
    breakpoint: 0,
    cols: 1,
    layouts: [
      { x: 0, y: 0, w: 1, h: 2, i: '0', component: 'UltimosPagosWidget' },
      { x: 0, y: 2, w: 1, h: 2, i: '1', component: 'MorososWidget' },
      { x: 0, y: 4, w: 1, h: 2, i: '2', component: 'UltimosPagosWidget' },
      { x: 0, y: 6, w: 1, h: 2, i: '3', component: 'UltimosPagosWidget' },
    ]
  }
}

// Función para actualizar el layout según el tamaño de pantalla
const updateLayout = () => {
  const width = window.innerWidth

  if (width >= 1200) {
    colNum.value = responsiveLayouts.lg.cols
    layout.value = responsiveLayouts.lg.layouts
    isDraggable.value = true
    isResizable.value = true
  } else if (width >= 768) {
    colNum.value = responsiveLayouts.md.cols
    layout.value = responsiveLayouts.md.layouts
    isDraggable.value = true
    isResizable.value = true
  } else {
    colNum.value = responsiveLayouts.sm.cols
    layout.value = responsiveLayouts.sm.layouts
    isDraggable.value = false
    isResizable.value = false
  }
}

// Lifecycle hooks para manejar el resize
onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
})

// Mapeo de componentes
const widgetComponents = {
  UltimosPagosWidget,
  MorososWidget
}
/*
const widgetComponents = {
  UltimosPagosWidget
  BalanceTotalWidget,
  BalanceMensualWidget,
  PagosGeneralesWidget
}
  */
</script>

<template>
  <div class="dashboard-container p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold">Dashboard - Las Yucas</h1>
      <p class="text-base-content/70">Panel de administración y control de pagos</p>
    </div>

    <GridLayout
      v-model:layout="layout"
      :col-num="colNum"
      :row-height="rowHeight"
      :is-draggable="isDraggable"
      :is-resizable="isResizable"
      :vertical-compact="verticalCompact"
      :prevent-collision="preventCollision"
      :use-css-transforms="true"
      class="dashboard-grid"
    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        class="grid-item"
      >
        <component :is="widgetComponents[item.component]" />
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: var(--fallback-b1, oklch(var(--b1) / 1));
}

.dashboard-grid {
  background-color: transparent;
}

.grid-item {
  touch-action: none;
}

:deep(.vue-grid-item) {
  background: transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: oklch(var(--p) / 0.2);
  opacity: 0.5;
  border-radius: 8px;
  border: 2px dashed oklch(var(--p) / 1);
}

:deep(.vue-grid-item > .vue-resizable-handle) {
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.vue-grid-item:hover > .vue-resizable-handle) {
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 1199px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-container h1 {
    font-size: 1.875rem;
  }
}

@media (max-width: 767px) {
  .dashboard-container {
    padding: 0.5rem;
  }

  .dashboard-container h1 {
    font-size: 1.5rem;
  }

  .dashboard-container p {
    font-size: 0.875rem;
  }

  /* Deshabilitar drag y resize en móviles para mejor experiencia táctil */
  :deep(.vue-grid-item > .vue-resizable-handle) {
    display: none;
  }
}
</style>
