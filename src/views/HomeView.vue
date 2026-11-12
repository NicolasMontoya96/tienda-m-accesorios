<template>
  <div class="font-sans bg-white text-[#111111]">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <!-- Header (incluye ahora la barra de categorías) -->
      <SiteHeader />

      <!-- Estado de carga: esqueleto gris, no texto plano -->
      <template v-if="cargando">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 items-center py-10 md:py-14">
          <div class="flex flex-col gap-4">
            <div class="h-3 w-24 bg-[#F0F0F0] rounded animate-pulse"></div>
            <div class="h-10 w-4/5 bg-[#F0F0F0] rounded animate-pulse"></div>
            <div class="h-4 w-3/5 bg-[#F0F0F0] rounded animate-pulse"></div>
            <div class="h-12 w-40 bg-[#F0F0F0] rounded-full animate-pulse mt-2"></div>
          </div>
          <div class="aspect-[1.2/1] bg-[#F4F4F4] rounded-lg animate-pulse"></div>
        </div>
        <div class="h-7 w-48 bg-[#F0F0F0] rounded animate-pulse mt-10 mb-5"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          <div v-for="n in 8" :key="n" class="flex flex-col gap-2.5">
            <div class="aspect-square bg-[#F4F4F4] rounded-[10px] animate-pulse"></div>
            <div class="h-4 w-4/5 bg-[#F0F0F0] rounded animate-pulse"></div>
            <div class="h-4 w-2/5 bg-[#F0F0F0] rounded animate-pulse"></div>
          </div>
        </div>
      </template>

      <!-- Error -->
      <div v-else-if="error" class="py-20 text-center text-sm text-red-500">No pudimos cargar el catálogo. Intenta de nuevo más tarde.</div>

      <template v-else>
        <!-- Hero: carrusel de productos destacados, a todo el ancho de la pantalla.
             Rompe el contenedor de 1320px con el truco estándar de "full-bleed":
             ancho 100vw + márgenes negativos calculados contra el padre, así
             funciona sin importar el padding/centrado del contenedor exterior. -->
        <section
          v-if="productoActivo"
          class="relative w-screen ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] overflow-hidden"
        >
          <transition name="fade-slide" mode="out-in">
            <div :key="productoActivo.id" class="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] md:min-h-[520px]">

              <!-- Imagen: a sangre completa (toca el borde derecho de la pantalla).
                   En móvil va arriba; en escritorio, a la derecha. -->
              <div class="relative order-1 md:order-2 aspect-[16/11] md:aspect-auto bg-[#F4F4F4] overflow-hidden">
                <img
                  v-if="productoActivo.imagen_url"
                  :src="productoActivo.imagen_url"
                  class="absolute inset-0 w-full h-full object-cover"
                  alt=""
                >
                <span v-else class="absolute inset-0 flex items-center justify-center text-[11px] tracking-wider uppercase text-[#B0B0B0]">Foto de producto</span>

                <!-- Flechas, sobre la imagen -->
                <template v-if="slides.length > 1">
                  <button
                    @click="anterior"
                    class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur items-center justify-center shadow-md hover:bg-white"
                    aria-label="Producto anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button
                    @click="siguiente"
                    class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur items-center justify-center shadow-md hover:bg-white"
                    aria-label="Producto siguiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </template>

                <!-- Puntos de navegación, sobre la imagen -->
                <div v-if="slides.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/25 backdrop-blur px-3 py-2 rounded-full">
                  <button
                    v-for="(s, i) in slides"
                    :key="s.id"
                    @click="irASlide(i)"
                    class="h-1.5 rounded-full transition-all"
                    :class="i === indiceActivo ? 'w-5 bg-white' : 'w-1.5 bg-white/50'"
                    :aria-label="`Ir al slide ${i + 1}`"
                  ></button>
                </div>
              </div>

              <!-- Texto: mantiene el mismo margen izquierdo que el resto del sitio,
                   aunque la sección sea full-bleed, para que no quede descuadrado. -->
              <div class="order-2 md:order-1 flex flex-col justify-center gap-4 py-10 md:py-14 pl-[max(18px,calc((100vw-1320px)/2))] sm:pl-[max(32px,calc((100vw-1320px)/2))] pr-[18px] sm:pr-8 md:pr-10">
                <small class="text-xs font-bold tracking-wider uppercase text-acento">Nuevo ingreso</small>
                <h1 class="text-4xl md:text-[52px] leading-[1.02] font-extrabold tracking-tight m-0">{{ productoActivo.nombre }}</h1>
                <p class="text-[15px] text-[#6A6A6A] max-w-[380px] leading-relaxed m-0">{{ productoActivo.descripcion || 'El mismo producto que tenemos físicamente en tienda, listo para enviar.' }}</p>
                <div class="flex items-baseline gap-2.5">
                  <span class="text-2xl font-extrabold">${{ formatearPrecio(productoActivo.precio_venta) }}</span>
                </div>
                <div class="flex gap-4 items-center mt-1">
                  <button @click="verProducto(productoActivo)" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Comprar ahora</button>
                  <router-link :to="`/producto/${productoActivo.id}`" class="text-sm font-bold border-b-[1.5px] border-black pb-0.5">Más información →</router-link>
                </div>
              </div>

            </div>
          </transition>
        </section>

        <!-- Grid de productos -->
        <h2 class="text-2xl font-extrabold mt-10 mb-5">{{ tituloSeccion }}</h2>
        <div v-if="productosFiltrados.length === 0" class="py-20 flex flex-col items-center gap-3 text-center">
          <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <p class="text-sm text-[#9A9A9A] max-w-xs">Todavía no hay productos en esta categoría. Vuelve pronto o mira el resto del catálogo.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          <div
            v-for="producto in productosFiltrados"
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
            <span class="text-[12px] text-[#9A9A9A] -mt-1.5">{{ nombreCategoria(producto.categoria_id) }}</span>
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

        <!-- Franja de confianza -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 py-10 border-t border-b border-[#EFEFEF]">
          <div class="flex items-start gap-3.5">
            <div class="shrink-0 w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-acento">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9m0 10H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2M9 17v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3"/><path d="M11 3v4"/></svg>
            </div>
            <div class="flex flex-col gap-0.5">
              <b class="text-sm font-bold">Stock real</b>
              <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Lo que ves aquí está disponible físicamente en la tienda.</span>
            </div>
          </div>
          <div class="flex items-start gap-3.5">
            <div class="shrink-0 w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-acento">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div class="flex flex-col gap-1.5">
              <b class="text-sm font-bold">Pago en línea</b>
              <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Tarjeta de crédito, PSE y otros medios de pago.</span>
              <div class="flex gap-1.5 mt-0.5">
                <span class="text-[10px] font-bold text-[#6A6A6A] bg-[#F4F4F4] border border-[#EBEBEB] rounded px-1.5 py-0.5">VISA</span>
                <span class="text-[10px] font-bold text-[#6A6A6A] bg-[#F4F4F4] border border-[#EBEBEB] rounded px-1.5 py-0.5">MASTERCARD</span>
                <span class="text-[10px] font-bold text-[#6A6A6A] bg-[#F4F4F4] border border-[#EBEBEB] rounded px-1.5 py-0.5">PSE</span>
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3.5">
            <div class="shrink-0 w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center text-acento">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <div class="flex flex-col gap-0.5">
              <b class="text-sm font-bold">Atención directa</b>
              <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Escríbenos por WhatsApp: {{ whatsappNumero }}.</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'
import { useCatalogo } from '../composables/useCatalogo'
import { useFavoritos } from '../composables/useFavoritos'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio, nombreCategoria as nombreCategoriaDe } from '../utils/formato'

const route = useRoute()
const router = useRouter()
const { productos: listaProductos, categorias: listaCategorias, cargando, error, cargarCatalogo } = useCatalogo()
const { esFavorito, alternarFavorito } = useFavoritos()

const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '[Número]'

const nombreCategoria = (categoriaId) => nombreCategoriaDe(listaCategorias.value, categoriaId)

// Carrusel del hero: rota entre los primeros 5 productos del catálogo
const indiceActivo = ref(0)
const slides = computed(() => listaProductos.value.slice(0, 5))
const productoActivo = computed(() => slides.value[indiceActivo.value] || null)
let intervaloCarrusel = null

const siguiente = () => {
  if (!slides.value.length) return
  indiceActivo.value = (indiceActivo.value + 1) % slides.value.length
}
const anterior = () => {
  if (!slides.value.length) return
  indiceActivo.value = (indiceActivo.value - 1 + slides.value.length) % slides.value.length
}
const irASlide = (i) => { indiceActivo.value = i }

// La categoría activa ahora vive en la URL (?categoria=ID), controlada
// desde la barra de categorías del SiteHeader, no en un estado local.
const categoriaActivaId = computed(() => {
  const id = route.query.categoria
  return id ? Number(id) : null
})

const categoriaActivaNombre = computed(() => {
  if (categoriaActivaId.value === null) return null
  return listaCategorias.value.find(c => c.id === categoriaActivaId.value)?.nombre || null
})

const tituloSeccion = computed(() => categoriaActivaNombre.value || 'Productos populares')

const productosFiltrados = computed(() => {
  if (categoriaActivaId.value === null) return listaProductos.value
  return listaProductos.value.filter(p => p.categoria_id === categoriaActivaId.value)
})

const verProducto = (producto) => {
  router.push(`/producto/${producto.id}`)
}

onMounted(() => {
  cargarCatalogo()
  intervaloCarrusel = setInterval(siguiente, 5000)
})

onBeforeUnmount(() => {
  if (intervaloCarrusel) clearInterval(intervaloCarrusel)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
</style>