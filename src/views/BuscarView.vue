<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <SiteHeader />

      <!-- Sin término de búsqueda: no venimos de un submit, sino de un link vacío -->
      <div v-if="!termino" class="py-24 flex flex-col items-center gap-4 text-center">
        <div class="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h1 class="text-xl font-extrabold">¿Qué estás buscando?</h1>
        <p class="text-sm text-[#6A6A6A] max-w-xs">
          Escribe el nombre de un producto en la barra de búsqueda de arriba.
        </p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Volver al catálogo</router-link>
      </div>

      <template v-else>
        <div class="py-10">
          <h1 class="text-2xl font-extrabold">
            Resultados para "{{ termino }}"
          </h1>
          <p class="text-[13px] text-[#9A9A9A] mt-1">
            {{ cargando ? 'Buscando...' : `${resultados.length} producto${resultados.length === 1 ? '' : 's'} encontrado${resultados.length === 1 ? '' : 's'}` }}
          </p>
        </div>

        <div v-if="cargando" class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 pb-16">
          <div v-for="n in 8" :key="n" class="flex flex-col gap-2.5">
            <div class="aspect-square bg-[#F4F4F4] rounded-[10px] animate-pulse"></div>
            <div class="h-4 w-4/5 bg-[#F0F0F0] rounded animate-pulse"></div>
            <div class="h-4 w-2/5 bg-[#F0F0F0] rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="error" class="py-20 text-center flex flex-col items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p class="text-sm text-[#6A6A6A]">No pudimos cargar el catálogo. Intenta de nuevo más tarde.</p>
        </div>

        <template v-else>
          <div v-if="resultados.length === 0" class="py-16 flex flex-col items-center gap-4 text-center">
            <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <p class="text-sm text-[#6A6A6A] max-w-xs">
              No encontramos productos que coincidan con "{{ termino }}". Intenta con otra palabra.
            </p>
            <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Volver al catálogo</router-link>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 pb-16">
            <div
              v-for="producto in resultados"
              :key="producto.id"
              class="group flex flex-col gap-2.5 cursor-pointer"
              @click="verProducto(producto)"
            >
              <div class="relative aspect-square bg-[#F7F7F7] rounded-[10px] flex items-center justify-center text-[10px] tracking-wide uppercase text-[#C2C2C2] overflow-hidden">
                <img
                  v-if="producto.imagen_url"
                  :src="producto.imagen_url"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  :class="{ 'grayscale opacity-70': producto.stock === 0 }"
                  alt=""
                >
                <span v-else>Foto</span>

                <span
                  v-if="producto.stock === 0"
                  class="absolute top-2 left-2 bg-black text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                >Sin stock</span>

                <button
                  @click.stop="alternarFavorito(producto.id)"
                  class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  :aria-label="esFavorito(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                    :fill="esFavorito(producto.id) ? '#C9792F' : 'none'"
                    :stroke="esFavorito(producto.id) ? '#C9792F' : '#111111'"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  ><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <span class="text-[15px] font-bold leading-snug">{{ producto.nombre }}</span>
              <span class="text-xs text-[#9A9A9A] -mt-1.5">{{ nombreCategoria(producto.categoria_id) }}</span>
              <span class="flex items-baseline gap-2">
                <b class="text-base font-extrabold">${{ formatearPrecio(producto.precio_venta) }}</b>
              </span>
              <span
                class="text-[13px] font-bold -mt-0.5"
                :class="producto.stock === 0 ? 'text-[#9A9A9A]' : 'text-acento'"
              >{{ producto.stock === 0 ? 'Agotado' : 'Más información' }}</span>
            </div>
          </div>
        </template>
      </template>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogo } from '../composables/useCatalogo'
import { useFavoritos } from '../composables/useFavoritos'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio, nombreCategoria as nombreCategoriaDe } from '../utils/formato'

const route = useRoute()
const router = useRouter()
const { productos, categorias, cargando, error, cargarCatalogo } = useCatalogo()
const { esFavorito, alternarFavorito } = useFavoritos()

const termino = computed(() => route.query.q || '')

const resultados = computed(() => {
  if (!termino.value) return []
  const t = termino.value.toLowerCase()
  return productos.value.filter(p => p.nombre.toLowerCase().includes(t))
})

const nombreCategoria = (categoriaId) => nombreCategoriaDe(categorias.value, categoriaId)

const verProducto = (producto) => {
  router.push(`/producto/${producto.id}`)
}

onMounted(cargarCatalogo)

// Si el usuario busca de nuevo estando ya en esta vista, vuelve a traer el
// catálogo solo si aún no se había cargado (cargarCatalogo ya es idempotente).
watch(() => route.query.q, cargarCatalogo)
</script>