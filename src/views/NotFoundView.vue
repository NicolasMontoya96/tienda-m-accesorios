<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <SiteHeader />

      <div class="py-24 text-center flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <h1 class="text-2xl font-extrabold">Página no encontrada</h1>
        <p class="text-sm text-[#6A6A6A] max-w-sm">
          El enlace que seguiste no existe o el producto que buscas ya no está disponible.
        </p>
        <div class="flex gap-3 mt-2">
          <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">
            Volver al catálogo
          </router-link>
          <router-link to="/buscar" class="bg-[#F7F7F7] text-[#111111] font-bold text-sm px-6 py-3.5 rounded-full hover:bg-[#EFEFEF] transition-colors">
            Buscar un producto
          </router-link>
        </div>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>