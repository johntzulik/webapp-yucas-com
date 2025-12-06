<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login, loading } = useAuth()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    errorMessage.value = ''

    if (!username.value || !password.value) {
      errorMessage.value = 'Por favor ingresa usuario y contraseña'
      return
    }

    const result = await login(username.value, password.value)

    if (result.success) {
      // Redirigir a la página principal o dashboard
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  }
}
onMounted(() => {
  console.log('Login component mounted')
  var imageBackground = "https://picsum.photos/800/800.webp?random=3";
  document.getElementById('background-image').style.backgroundImage = `url(${imageBackground})`;
  document.getElementById('background-image').style.backgroundSize = 'cover';
})
</script>

<template>
  <div class="bg-white-100 flex justify-center items-center h-screen">
    <!-- Left: Image -->
    <div id="background-image" class="w-1/2 h-screen hidden lg:block"></div>
    <!-- Right: Login Form -->
    <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <form id="login-image-content" class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="">
          <div class="flex-col lg:flex-center text-center mb-8">
            <h1 class="text-4xl font-semibold mb-4 text-center">Ingrese su usuario y contraseña</h1>
          </div>
          <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <div class="card-body">
                <fieldset class="fieldset">

                  <!-- Error message -->
                  <div v-if="errorMessage" class="alert alert-error mb-4">
                    <span>{{ errorMessage }}</span>
                  </div>

                  <!-- Username field -->
                  <div class="form-control mb-4">
                    <label class="label">
                      <span class="label-text">Usuario</span>
                    </label>
                    <input class="input input-bordered" required type="text" placeholder="Tu usuario" v-model="username"
                      :disabled="loading" />
                  </div>

                  <!-- Password field -->
                  <div class="form-control mb-4">
                    <label class="label">
                      <span class="label-text">Contraseña</span>
                    </label>
                    <input class="input input-bordered" required type="password" placeholder="Tu contraseña"
                      v-model="password" :disabled="loading" />
                  </div>

                  <!-- Submit button -->
                  <button type="submit" class="btn btn-secondary w-full" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                  </button>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>