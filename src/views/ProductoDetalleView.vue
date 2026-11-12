<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8">

      <!-- Header (igual al Home) -->
      <header class="flex justify-between items-center py-5 border-b border-[#EFEFEF]">
        <router-link to="/" class="text-[22px] font-extrabold tracking-tight">
          M<span class="text-acento">·</span>Accesorios
        </router-link>
        <div class="flex gap-5 items-center text-[13px] font-semibold">
          <a href="#" class="hidden sm:inline">Buscar</a>
          <router-link to="#">Mi cuenta</router-link>
          <router-link to="/carrito" class="flex items-center gap-1.5">
            Carrito
            <i class="bg-black text-white text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center not-italic">{{ cantidadTotal }}</i>
          </router-link>
        </div>
      </header>

      <div v-if="cargando" class="py-20 text-center text-sm text-[#9A9A9A]">Cargando producto...</div>
      <div v-else-if="error" class="py-20 text-center text-sm text-red-500">
        No encontramos este producto.
        <router-link to="/" class="underline block mt-2">Volver al catálogo</router-link>
      </div>

      <template v-else-if="producto">
        <router-link to="/" class="inline-block text-[13px] font-semibold text-[#6A6A6A] mt-6">← Volver al catálogo</router-link>

        <section class="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-start py-8">
          <div class="aspect-square bg-[#F4F4F4] rounded-lg flex items-center justify-center text-[11px] tracking-wider uppercase text-[#B0B0B0] overflow-hidden">
            <img v-if="producto.imagen_url" :src="producto.imagen_url" class="w-full h-full object-cover" alt="">
            <span v-else>Foto de producto</span>
          </div>

          <div class="flex flex-col gap-4">
            <h1 class="text-3xl md:text-[40px] leading-[1.05] font-extrabold tracking-tight m-0">{{ producto.nombre }}</h1>
            <p class="text-[15px] text-[#5A5A5A] leading-relaxed m-0">{{ producto.descripcion || 'Sin descripción adicional.' }}</p>

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

      <footer class="py-8 pb-14 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[#8A8A8A] mt-10 border-t border-[#EFEFEF]">
        <span class="font-extrabold">M Accesorios</span>
        <span>© {{ anioActual }} · Cali, Colombia</span>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'
import { useCarrito } from '../composables/useCarrito'

const route = useRoute()
const { cantidadTotal, agregarProducto } = useCarrito()

const producto = ref(null)
const cargando = ref(true)
const error = ref(false)
const cantidad = ref(1)
const agregado = ref(false)

const anioActual = new Date().getFullYear()

const formatearPrecio = (valor) => parseFloat(valor).toLocaleString('es-CO')

const cargarProducto = async (id) => {
  cargando.value = true
  error.value = false
  agregado.value = false
  cantidad.value = 1
  try {
    const res = await api.get(`/productos/${id}`)
    producto.value = res.data
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
  setTimeout(() => { agregado.value = false }, 1500)
}

onMounted(() => cargarProducto(route.params.id))
watch(() => route.params.id, (nuevoId) => { if (nuevoId) cargarProducto(nuevoId) })
</script>