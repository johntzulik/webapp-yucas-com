<script setup>

</script>
<template>
<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Olvide mi password</h1>
        <p class="py-6">Recupera tu contraseña aquí </p>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div class="card-body">
        <fieldset class="fieldset">
          <label class="label">Email</label>
          <input type="email" class="input" placeholder="Email" />
          <div><a href="/login" class="link link-hover">Ingresar</a></div>
          <button class="btn btn-neutral mt-4">Enviar contraseña al correo</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>
</template>