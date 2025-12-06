<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="widget-base card bg-base-100 shadow-xl h-full">
    <div class="card-body p-4">
      <h2 class="card-title text-lg mb-2">{{ title }}</h2>

      <div v-if="loading" class="flex justify-center items-center h-full">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else class="widget-content overflow-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-base {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.widget-content {
  flex: 1;
  overflow-y: auto;
}
</style>
