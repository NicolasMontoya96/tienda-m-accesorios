<template>
  <router-view />
  <ToastNotificacion />
  <BotonSubir />
</template>

<script setup>
import ToastNotificacion from './components/ToastNotificacion.vue'
import BotonSubir from './components/BotonSubir.vue'
</script>