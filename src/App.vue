<script setup>
import Navbar from './components/Navbar.vue'
import { useAuth } from './composables/useAuth'

const { isAuthenticated } = useAuth()
</script>
<template>
  <!-- Si el usuario está autenticado, mostrar Navbar (que incluye router-view) -->
  <Navbar v-if="isAuthenticated" />

  <!-- Si NO está autenticado, mostrar solo el router-view (para login/forgot password) -->
  <router-view v-else />
</template>