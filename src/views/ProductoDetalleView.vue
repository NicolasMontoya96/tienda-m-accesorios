<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <!-- Header (igual al Home) -->
      <SiteHeader />

      <!-- Esqueleto de carga -->
      <div v-if="cargando" class="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-start py-8">
        <div class="aspect-square bg-[#F4F4F4] rounded-lg animate-pulse"></div>
        <div class="flex flex-col gap-4">
          <div class="h-9 w-4/5 bg-[#F0F0F0] rounded animate-pulse"></div>
          <div class="h-4 w-full bg-[#F0F0F0] rounded animate-pulse"></div>
          <div class="h-4 w-3/5 bg-[#F0F0F0] rounded animate-pulse"></div>
          <div class="h-8 w-32 bg-[#F0F0F0] rounded animate-pulse mt-2"></div>
          <div class="h-12 w-44 bg-[#F0F0F0] rounded-full animate-pulse mt-2"></div>
        </div>
      </div>

      <div v-else-if="error" class="py-20 text-center flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p class="text-sm text-[#6A6A6A]">No encontramos este producto.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Volver al catálogo</router-link>
      </div>

      <template v-else-if="producto">
        <router-link to="/" class="inline-block text-[13px] font-semibold text-[#6A6A6A] mt-6">← Volver al catálogo</router-link>

        <section class="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-start py-8">
          <div class="relative aspect-square bg-[#F4F4F4] rounded-lg flex items-center justify-center text-[11px] tracking-wider uppercase text-[#B0B0B0] overflow-hidden">
            <img v-if="producto.imagen_url" :src="producto.imagen_url" class="w-full h-full object-cover" alt="">
            <span v-else>Foto de producto</span>
            <button
              @click="alternarFavorito(producto.id)"
              class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              :aria-label="esFavorito(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                :fill="esFavorito(producto.id) ? '#C9792F' : 'none'"
                :stroke="esFavorito(producto.id) ? '#C9792F' : '#111111'"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              ><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <h1 class="text-3xl md:text-[40px] leading-[1.05] font-extrabold tracking-tight m-0">{{ producto.nombre }}</h1>
            <p class="text-[15px] text-[#6A6A6A] leading-relaxed m-0">{{ producto.descripcion || 'Sin descripción adicional.' }}</p>

            <div class="flex items-baseline gap-2.5">
              <span class="text-3xl font-extrabold">${{ formatearPrecio(producto.precio_venta) }}</span>
            </div>

            <span
              class="text-xs font-bold tracking-wide uppercase w-fit px-2.5 py-1 rounded-full"
              :class="producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ producto.stock > 0 ? `Disponible (${producto.stock} en stock)` : 'Agotado' }}
            </span>

            <div v-if="producto.stock > 0" class="flex items-center gap-3 mt-2">
              <span class="text-sm font-semibold">Cantidad</span>
              <div class="flex items-center border border-[#E5E5E5] rounded-full">
                <button @click="cantidad = Math.max(1, cantidad - 1)" class="w-9 h-9 flex items-center justify-center text-lg">−</button>
                <span class="w-8 text-center text-sm font-bold">{{ cantidad }}</span>
                <button @click="cantidad = Math.min(producto.stock, cantidad + 1)" class="w-9 h-9 flex items-center justify-center text-lg">+</button>
              </div>
            </div>

            <div class="flex gap-4 items-center mt-2">
              <button
                v-if="producto.stock > 0"
                @click="agregarAlCarrito"
                class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full disabled:opacity-50"
                :disabled="agregado"
              >
                {{ agregado ? 'Agregado ✓' : 'Agregar al carrito' }}
              </button>
              <button v-else class="bg-[#F0F0F0] text-[#9A9A9A] font-bold text-sm px-6 py-3.5 rounded-full cursor-not-allowed" disabled>
                Agotado
              </button>
            </div>
          </div>
        </section>
      </template>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'
import { useCarrito } from '../composables/useCarrito'
import { useFavoritos } from '../composables/useFavoritos'
import { useToast } from '../composables/useToast'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio } from '../utils/formato'

const route = useRoute()
const { agregarProducto } = useCarrito()
const { esFavorito, alternarFavorito } = useFavoritos()
const { mostrarToast } = useToast()

const producto = ref(null)
const cargando = ref(true)
const error = ref(false)
const cantidad = ref(1)
const agregado = ref(false)

const cargarProducto = async (id) => {
  cargando.value = true
  error.value = false
  agregado.value = false
  cantidad.value = 1
  try {
    const res = await api.get(`/productos/${id}`)
    producto.value = res.data
    document.title = `${producto.value.nombre} — M Accesorios`
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    cargando.value = false
  }
}

const agregarAlCarrito = () => {
  agregarProducto(producto.value, cantidad.value)
  agregado.value = true
  mostrarToast(`${producto.value.nombre} se agregó a tu carrito`)
  setTimeout(() => { agregado.value = false }, 1500)
}

onMounted(() => cargarProducto(route.params.id))
watch(() => route.params.id, (nuevoId) => { if (nuevoId) cargarProducto(nuevoId) })
</script>