<script setup>
import CryptoJS from 'crypto-js';
import { ref } from 'vue';
//ejemplo de uso de CryptoJS para cifrado AES en modo ECB
const textToEncrypt = ref('');
const textToDecrypt = ref('');
const resultadoCifrado = ref('');
const llave = ref('');
const cifrarTexto = () => {
  const textoCifrado = CryptoJS.AES.encrypt(textToEncrypt.value, CryptoJS.enc.Utf8.parse(llave.value), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  //alert(`Texto cifrado: ${textoCifrado}`);
  resultadoCifrado.value = textoCifrado;
};

//descifrarTexto function (no usada en el formulario, pero incluida para referencia)
const descifrarTexto = () => {
    let rCifrado = resultadoCifrado;
  const textoDescifrado = CryptoJS.AES.decrypt(rCifrado.value, CryptoJS.enc.Utf8.parse(llave.value), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
  //alert(`Texto descifrado: ${textoDescifrado}`);
  textToDecrypt.value = textoDescifrado;
};
</script>

<template>
<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-5xl font-bold">Ejemplo de cifrado</h1>
      <p class="py-6">
            Ingrese el texto que desea cifrar utilizando AES en modo ECB.
      </p>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-5 m-5">
      <div class="card-body">
        <fieldset class="fieldset">
        <label class="label">Llave de cifrado</label>
        <input type="text" class="input" placeholder="Llave de cifrado" value="123456789012345" v-model="llave" />
        <label class="label">Texto a cifrar</label>
        <input type="text" class="input" placeholder="Texto a cifrar" v-model="textToEncrypt" />
        <label class="label">Texto cifrado</label>
        <input type="text" class="input" disabled v-model="resultadoCifrado"/>
        <button class="btn btn-primary mt-4" @click="cifrarTexto">Cifrar</button>
        <label class="label mt-4">Texto descifrado</label>
        <input type="text" class="input" disabled v-model="textToDecrypt"/>
        <button class="btn btn-primary mt-4" @click="descifrarTexto">Descifrar</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>
</template>