<template>
  <div class="font-sans bg-white text-[#111111]">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8">

      <!-- Header -->
      <header class="flex justify-between items-center py-5 border-b border-[#EFEFEF]">
        <router-link to="/" class="text-[22px] font-extrabold tracking-tight">
          M<span class="text-acento">·</span>Accesorios
        </router-link>
        <div class="flex gap-5 items-center text-[13px] font-semibold">
          <a href="#" class="hidden sm:inline">Buscar</a>
          <router-link to="#">Mi cuenta</router-link>
          <router-link to="/carrito" class="flex items-center gap-1.5">
            Carrito
            <i class="bg-black text-white text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center not-italic">{{ cantidadCarrito }}</i>
          </router-link>
        </div>
      </header>

      <!-- Estado de carga / error -->
      <div v-if="cargando" class="py-20 text-center text-sm text-[#9A9A9A]">Cargando catálogo...</div>
      <div v-else-if="error" class="py-20 text-center text-sm text-red-500">No pudimos cargar el catálogo. Intenta de nuevo más tarde.</div>

      <template v-else>
        <!-- Hero: producto destacado -->
        <section v-if="productoDestacado" class="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 items-center py-10 md:py-14">
          <div class="flex flex-col gap-4">
            <small class="text-xs font-bold tracking-wider uppercase text-acento">Nuevo ingreso</small>
            <h1 class="text-4xl md:text-[52px] leading-[1.02] font-extrabold tracking-tight m-0">{{ productoDestacado.nombre }}</h1>
            <p class="text-[15px] text-[#5A5A5A] max-w-[380px] leading-relaxed m-0">{{ productoDestacado.descripcion || 'El mismo producto que tenemos físicamente en tienda, listo para enviar.' }}</p>
            <div class="flex items-baseline gap-2.5">
              <span class="text-2xl font-extrabold">${{ formatearPrecio(productoDestacado.precio_venta) }}</span>
            </div>
            <div class="flex gap-4 items-center mt-1">
              <button @click="verProducto(productoDestacado)" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Comprar ahora</button>
              <router-link :to="`/producto/${productoDestacado.id}`" class="text-sm font-bold border-b-[1.5px] border-black pb-0.5">Más información →</router-link>
            </div>
          </div>
          <div class="aspect-[1.2/1] bg-[#F4F4F4] rounded-lg flex items-center justify-center text-[11px] tracking-wider uppercase text-[#B0B0B0] overflow-hidden">
            <img v-if="productoDestacado.imagen_url" :src="productoDestacado.imagen_url" class="w-full h-full object-cover" alt="">
            <span v-else>Foto de producto</span>
          </div>
        </section>

        <!-- Tabs de categorías -->
        <nav class="flex gap-7 border-b border-[#EFEFEF] mt-6 overflow-x-auto">
          <button
            @click="categoriaActiva = null"
            class="text-sm font-bold pb-3.5 whitespace-nowrap border-b-2"
            :class="categoriaActiva === null ? 'text-[#111111] border-acento' : 'text-[#B0B0B0] border-transparent'"
          >Todo</button>
          <button
            v-for="cat in listaCategorias"
            :key="cat.id"
            @click="categoriaActiva = cat.id"
            class="text-sm font-bold pb-3.5 whitespace-nowrap border-b-2"
            :class="categoriaActiva === cat.id ? 'text-[#111111] border-acento' : 'text-[#B0B0B0] border-transparent'"
          >{{ cat.nombre }}</button>
        </nav>

        <!-- Grid de productos -->
        <h2 class="text-2xl font-extrabold mt-10 mb-5">Productos populares</h2>
        <div v-if="productosFiltrados.length === 0" class="py-10 text-sm text-[#9A9A9A]">No hay productos en esta categoría todavía.</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          <div v-for="producto in productosFiltrados" :key="producto.id" class="flex flex-col gap-2.5 cursor-pointer" @click="verProducto(producto)">
            <div class="aspect-square bg-[#F7F7F7] rounded-[10px] flex items-center justify-center text-[10px] tracking-wide uppercase text-[#C2C2C2] overflow-hidden">
              <img v-if="producto.imagen_url" :src="producto.imagen_url" class="w-full h-full object-cover" alt="">
              <span v-else>Foto</span>
            </div>
            <span class="text-[15px] font-bold leading-snug">{{ producto.nombre }}</span>
            <span class="flex items-baseline gap-2">
              <b class="text-base font-extrabold">${{ formatearPrecio(producto.precio_venta) }}</b>
            </span>
            <span class="text-[13px] font-bold text-acento -mt-0.5">Más información</span>
          </div>
        </div>

        <!-- Franja de confianza -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 py-9 border-t border-b border-[#EFEFEF]">
          <div class="flex flex-col gap-1.5">
            <b class="text-sm font-bold">Stock real</b>
            <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Lo que ves aquí está disponible físicamente en la tienda.</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <b class="text-sm font-bold">Pago en línea</b>
            <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Tarjeta de crédito, PSE y otros medios de pago.</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <b class="text-sm font-bold">Atención directa</b>
            <span class="text-[13px] text-[#6A6A6A] leading-relaxed">Escríbenos por WhatsApp: {{ whatsappNumero }}.</span>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <footer class="py-8 pb-14 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[#8A8A8A]">
        <span class="font-extrabold">M Accesorios</span>
        <span>© {{ anioActual }} · Cali, Colombia</span>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useCarrito } from '../composables/useCarrito'

const router = useRouter()

const listaProductos = ref([])
const listaCategorias = ref([])
const categoriaActiva = ref(null)
const cargando = ref(true)
const error = ref(false)
const { cantidadTotal: cantidadCarrito } = useCarrito()

const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '[Número]'
const anioActual = new Date().getFullYear()

const productoDestacado = computed(() => listaProductos.value[0] || null)

const productosFiltrados = computed(() => {
  if (categoriaActiva.value === null) return listaProductos.value
  return listaProductos.value.filter(p => p.categoria_id === categoriaActiva.value)
})

const formatearPrecio = (valor) => parseFloat(valor).toLocaleString('es-CO')

const verProducto = (producto) => {
  router.push(`/producto/${producto.id}`)
}

onMounted(async () => {
  try {
    const [resProductos, resCategorias] = await Promise.all([
      api.get('/productos/'),
      api.get('/categorias/'),
    ])
    listaProductos.value = resProductos.data
    listaCategorias.value = resCategorias.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    cargando.value = false
  }
})
</script>