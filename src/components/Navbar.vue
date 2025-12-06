<script setup>
import ToggleTheme from './ToggleTheme.vue'
import ThemeController from './ThemeController.vue'
import { useAuth } from '../composables/useAuth'

const { user, logout, isAdmin } = useAuth()

const handleLogout = () => {
  if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
    logout()
  }
}

</script>

<template>

<div class="drawer lg:drawer-open drawer-end">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-sm">

      <div class="navbar-start">

      </div>
      <!--hide on mobile-->
      <div class="navbar-center hidden lg:flex">
        <a class="btn btn-ghost text-xl">Las Yucas</a>
      </div>
      <div class="navbar-end gap-1 md:gap-2">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm md:btn-md avatar">
            <div class="w-8 md:w-10 rounded-full">
              <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" />
              <span v-else class="text-base md:text-xl">{{ user?.name?.charAt(0) || 'U' }}</span>
            </div>
          </div>
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 md:w-60 p-2 shadow text-xs md:text-sm">
            <li><a>Hola, {{ user?.name || user?.displayName }}</a></li>
            <li><a>Correo: {{ user?.email }}</a></li>
            <li><a>Rol: {{ user?.roles?.[0] || 'N/A' }}</a></li>
            <li><a>Admin: {{ isAdmin ? 'Sí' : 'No' }}</a></li>
            <li><a @click="handleLogout" class="text-red-600">Logout</a></li>
          </ul>
        </div>

        <div class="dropdown dropdown-end">
          <ThemeController />
        </div>
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost btn-sm md:btn-md">
        <!-- Sidebar toggle icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
      </label>
      </div>
    </div>
      <router-view />
  </div>

  <div class="drawer-side is-drawer-close:overflow-visible">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      <!-- Sidebar content here -->
      <ul class="menu w-full grow">
        <!-- List item -->
        <li  v-if="isAdmin">
          <a href="/" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
            <!-- Home secure icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4"><path d="M3 9l9-7l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path><path d="M22 12h-4"></path><path d="M20 10v4"></path></svg>
            <span class="is-drawer-close:hidden">Dashboard</span>
            </a>
        </li>
        <li>
          <a href="/dashboardusers" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Usuarios">
            <!-- users icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="is-drawer-close:hidden">Usuarios</span>
            </a>
        </li>
        <!-- List item -->
        <li v-if="isAdmin">
          <a href="/settings" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Configuración">
            <!-- Settings icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="my-1.5 inline-block size-4">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="is-drawer-close:hidden">Configuración</span>
          </a>
        </li>
        <li><a><ToggleTheme /></a></li>
        <li>
          <a @click="handleLogout" >
            <svg class="my-1.5 inline-block size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z"/></svg>
            <span class="is-drawer-close:hidden">Cerrar Sesión</span>
            </a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>