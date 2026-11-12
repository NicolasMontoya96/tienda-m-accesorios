<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <SiteHeader />

      <h1 class="text-2xl md:text-[32px] font-extrabold mt-8 mb-6">Mis favoritos</h1>

      <!-- Esqueleto de carga -->
      <div v-if="cargando" class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 pb-16">
        <div v-for="n in 4" :key="n" class="flex flex-col gap-2.5">
          <div class="aspect-square bg-[#F4F4F4] rounded-[10px] animate-pulse"></div>
          <div class="h-4 w-4/5 bg-[#F0F0F0] rounded animate-pulse"></div>
          <div class="h-3 w-2/5 bg-[#F0F0F0] rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-20 text-center flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p class="text-sm text-[#6A6A6A]">No pudimos cargar tus favoritos.</p>
        <button @click="cargarCatalogo" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Reintentar</button>
      </div>

      <!-- Sin favoritos -->
      <div v-else-if="productosFavoritos.length === 0" class="py-20 text-center flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
        <p class="text-sm text-[#6A6A6A] max-w-xs">Todavía no has guardado ningún producto. Toca el corazón en cualquier producto para agregarlo aquí.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full mt-1">Ver catálogo</router-link>
      </div>

      <!-- Grid de favoritos -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 pb-16">
        <div
          v-for="producto in productosFavoritos"
          :key="producto.id"
          class="group flex flex-col gap-2.5 cursor-pointer"
          @click="verProducto(producto)"
        >
          <div class="relative aspect-square bg-[#F7F7F7] rounded-[10px] flex items-center justify-center text-[10px] tracking-wide uppercase text-[#C2C2C2] overflow-hidden transition-shadow group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <img
              v-if="producto.imagen_url"
              :src="producto.imagen_url"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              :class="{ 'grayscale opacity-60': producto.stock === 0 }"
              alt=""
            >
            <span v-else :class="{ 'opacity-60': producto.stock === 0 }">Foto</span>
            <span
              v-if="producto.stock === 0"
              class="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            >Sin stock</span>
            <button
              @click.stop="alternarFavorito(producto.id)"
              class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              aria-label="Quitar de favoritos"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="#C9792F" stroke="#C9792F"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              ><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
          <span class="text-[15px] font-bold leading-snug">{{ producto.nombre }}</span>
          <span class="text-[12px] text-[#9A9A9A] -mt-1.5">{{ nombreCategoria(categorias, producto.categoria_id) }}</span>
          <span class="flex items-baseline gap-2">
            <b class="text-base font-extrabold">${{ formatearPrecio(producto.precio_venta) }}</b>
          </span>
          <span
            v-if="producto.stock > 0"
            class="text-[13px] font-bold text-acento -mt-0.5"
          >Más información</span>
          <span v-else class="text-[13px] font-bold text-[#B0B0B0] -mt-0.5">Agotado</span>
        </div>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogo } from '../composables/useCatalogo'
import { useFavoritos } from '../composables/useFavoritos'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio, nombreCategoria } from '../utils/formato'

const router = useRouter()
const { productos, categorias, cargando, error, cargarCatalogo } = useCatalogo()
const { idsFavoritos, alternarFavorito } = useFavoritos()

// El orden del grid sigue el orden en que se fueron marcando como favoritos
// (el más reciente primero), no el orden del catálogo.
const productosFavoritos = computed(() => {
  return [...idsFavoritos.value]
    .reverse()
    .map((id) => productos.value.find((p) => p.id === id))
    .filter(Boolean)
})

const verProducto = (producto) => {
  router.push(`/producto/${producto.id}`)
}

onMounted(() => cargarCatalogo())
</script>