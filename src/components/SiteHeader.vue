<template>
  <header class="relative flex justify-between items-center gap-4 py-5 border-b border-[#EFEFEF]">
    <div class="flex items-center gap-8 flex-1 min-w-0">
      <router-link to="/" class="text-[22px] font-extrabold tracking-tight shrink-0">
        M<span class="text-acento">·</span>Accesorios
      </router-link>

      <!-- Buscador (escritorio) -->
      <div class="flex-1 max-w-sm relative hidden sm:block" ref="cajaBusquedaDesktop">
      <form @submit.prevent="irAResultados">
        <input
          v-model.trim="busqueda"
          type="search"
          placeholder="Buscar productos..."
          @focus="mostrarDropdown = true"
          class="w-full bg-[#F7F7F7] border border-transparent focus:border-[#E0E0E0] focus:bg-white rounded-full pl-4 pr-9 py-2 text-[13px] outline-none transition-colors"
        >
        <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" aria-label="Buscar">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </form>

      <!-- Dropdown de resultados en vivo -->
      <div
        v-if="mostrarDropdown && busqueda.length > 0"
        class="absolute left-0 right-0 top-full mt-2 bg-white border border-[#EFEFEF] rounded-xl shadow-lg overflow-hidden z-20"
      >
        <template v-if="resultadosPreview.length > 0">
          <button
            v-for="producto in resultadosPreview"
            :key="producto.id"
            @mousedown.prevent="irAProducto(producto)"
            class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7F7F7] text-left"
          >
            <div class="w-9 h-9 shrink-0 bg-[#F4F4F4] rounded-md overflow-hidden flex items-center justify-center">
              <img v-if="producto.imagen_url" :src="producto.imagen_url" class="w-full h-full object-cover" alt="">
            </div>
            <span class="flex-1 text-[13px] font-semibold truncate">{{ producto.nombre }}</span>
            <span class="text-[13px] font-bold shrink-0">${{ formatearPrecio(producto.precio_venta) }}</span>
          </button>
          <button
            @mousedown.prevent="irAResultados"
            class="w-full text-center px-3 py-2.5 text-[12px] font-bold text-acento border-t border-[#EFEFEF] hover:bg-[#F7F7F7]"
          >
            Ver todos los resultados para "{{ busqueda }}"
          </button>
        </template>
        <p v-else class="px-3 py-3 text-[13px] text-[#9A9A9A]">Sin resultados para "{{ busqueda }}"</p>
      </div>
      </div>
    </div>

    <div class="flex gap-2 items-center text-[15px] font-bold shrink-0">
      <button @click="mostrarBuscadorMovil = !mostrarBuscadorMovil" class="sm:hidden w-10 h-10 flex items-center justify-center" aria-label="Buscar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <router-link to="/consultar-pedido" class="px-2 py-2 hover:text-acento transition-colors">Mi pedido</router-link>
      <router-link
        to="/favoritos"
        class="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F7F7F7] transition-colors"
        aria-label="Mis favoritos"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span
          v-if="idsFavoritos.length > 0"
          class="absolute -top-1 -right-1 bg-acento text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none"
        >{{ idsFavoritos.length }}</span>
      </router-link>
      <router-link
        to="/carrito"
        class="relative flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-[#F7F7F7] transition-colors"
        aria-label="Carrito"
      >
        <span class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span
            v-if="cantidadTotal > 0"
            class="absolute -top-2 -right-2 bg-acento text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center leading-none"
          >{{ cantidadTotal }}</span>
        </span>
        <span>Carrito</span>
      </router-link>
    </div>

    <!-- Buscador móvil -->
    <div v-if="mostrarBuscadorMovil" class="absolute left-0 right-0 top-full px-[18px] sm:hidden z-20">
      <div class="relative max-w-[1320px] mx-auto">
        <form @submit.prevent="irAResultados">
          <input
            v-model.trim="busqueda"
            type="search"
            placeholder="Buscar productos..."
            autofocus
            class="w-full bg-[#F7F7F7] border border-[#E0E0E0] rounded-full pl-4 pr-9 py-2.5 text-[13px] outline-none"
          >
          <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>

        <div
          v-if="busqueda.length > 0"
          class="mt-2 bg-white border border-[#EFEFEF] rounded-xl shadow-lg overflow-hidden"
        >
          <template v-if="resultadosPreview.length > 0">
            <button
              v-for="producto in resultadosPreview"
              :key="producto.id"
              @click="irAProducto(producto)"
              class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7F7F7] text-left"
            >
              <div class="w-9 h-9 shrink-0 bg-[#F4F4F4] rounded-md overflow-hidden flex items-center justify-center">
                <img v-if="producto.imagen_url" :src="producto.imagen_url" class="w-full h-full object-cover" alt="">
              </div>
              <span class="flex-1 text-[13px] font-semibold truncate">{{ producto.nombre }}</span>
              <span class="text-[13px] font-bold shrink-0">${{ formatearPrecio(producto.precio_venta) }}</span>
            </button>
            <button
              @click="irAResultados"
              class="w-full text-center px-3 py-2.5 text-[12px] font-bold text-acento border-t border-[#EFEFEF] hover:bg-[#F7F7F7]"
            >
              Ver todos los resultados para "{{ busqueda }}"
            </button>
          </template>
          <p v-else class="px-3 py-3 text-[13px] text-[#9A9A9A]">Sin resultados para "{{ busqueda }}"</p>
        </div>
      </div>
    </div>
  </header>

  <!-- Barra de categorías: navegación fija del sitio, estilo Dafiti.
       Si hay más de LIMITE_CATEGORIAS_VISIBLES, el resto se agrupa en un
       dropdown "Más" para que la barra no crezca sin control. -->
  <nav v-if="categorias.length > 0" class="relative flex items-center gap-6 overflow-x-auto border-b border-[#EFEFEF] -mx-[18px] px-[18px] sm:mx-0 sm:px-0">
    <button
      @click="irACategoria(null)"
      class="py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors"
      :class="categoriaActivaId === null ? 'text-[#111111] border-acento' : 'text-[#6A6A6A] border-transparent hover:text-[#111111]'"
    >Todo</button>
    <button
      v-for="cat in categoriasVisibles"
      :key="cat.id"
      @click="irACategoria(cat)"
      class="py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors uppercase tracking-wide"
      :class="categoriaActivaId === cat.id ? 'text-[#111111] border-acento' : 'text-[#6A6A6A] border-transparent hover:text-[#111111]'"
    >{{ cat.nombre }}</button>

    <div v-if="categoriasOcultas.length > 0" class="relative" ref="cajaMenuCategorias">
      <button
        @click="mostrarMenuCategorias = !mostrarMenuCategorias"
        class="flex items-center gap-1 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors uppercase tracking-wide"
        :class="categoriaOcultaActiva ? 'text-[#111111] border-acento' : 'text-[#6A6A6A] border-transparent hover:text-[#111111]'"
      >
        {{ categoriaOcultaActiva ? categoriaOcultaActiva.nombre : 'Más categorías' }}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      <div
        v-if="mostrarMenuCategorias"
        class="absolute left-0 top-full mt-1 bg-white border border-[#EFEFEF] rounded-xl shadow-lg overflow-hidden z-20 min-w-[180px] py-1"
      >
        <button
          v-for="cat in categoriasOcultas"
          :key="cat.id"
          @click="irACategoria(cat); mostrarMenuCategorias = false"
          class="w-full text-left px-4 py-2.5 text-[13px] font-semibold hover:bg-[#F7F7F7] transition-colors"
          :class="categoriaActivaId === cat.id ? 'text-acento' : 'text-[#111111]'"
        >{{ cat.nombre }}</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCarrito } from '../composables/useCarrito'
import { useCatalogo } from '../composables/useCatalogo'
import { useFavoritos } from '../composables/useFavoritos'
import { formatearPrecio } from '../utils/formato'

const { cantidadTotal } = useCarrito()
const { idsFavoritos } = useFavoritos()
const { productos, categorias, cargarCatalogo } = useCatalogo()
const router = useRouter()
const route = useRoute()

const categoriaActivaId = computed(() => {
  const id = route.query.categoria
  return id ? Number(id) : null
})

// Si hay muchas categorías, solo mostramos las primeras N como pestañas y
// el resto va agrupado en un dropdown "Más categorías", para que la barra
// no crezca sin control a medida que el catálogo agrega categorías nuevas.
const LIMITE_CATEGORIAS_VISIBLES = 6
const categoriasVisibles = computed(() => categorias.value.slice(0, LIMITE_CATEGORIAS_VISIBLES))
const categoriasOcultas = computed(() => categorias.value.slice(LIMITE_CATEGORIAS_VISIBLES))
const categoriaOcultaActiva = computed(() => categoriasOcultas.value.find(c => c.id === categoriaActivaId.value))

const mostrarMenuCategorias = ref(false)
const cajaMenuCategorias = ref(null)

const irACategoria = (cat) => {
  if (cat) {
    router.push({ path: '/', query: { categoria: cat.id } })
  } else {
    router.push({ path: '/' })
  }
}

const busqueda = ref('')
const mostrarBuscadorMovil = ref(false)
const mostrarDropdown = ref(false)
const cajaBusquedaDesktop = ref(null)

const resultadosPreview = computed(() => {
  if (!busqueda.value) return []
  const termino = busqueda.value.toLowerCase()
  return productos.value
    .filter(p => p.nombre.toLowerCase().includes(termino))
    .slice(0, 6)
})

const irAResultados = () => {
  if (!busqueda.value) return
  router.push({ path: '/buscar', query: { q: busqueda.value } })
  mostrarDropdown.value = false
  mostrarBuscadorMovil.value = false
}

const irAProducto = (producto) => {
  router.push(`/producto/${producto.id}`)
  mostrarDropdown.value = false
  mostrarBuscadorMovil.value = false
  busqueda.value = ''
}

const cerrarDropdownAfuera = (evento) => {
  if (cajaBusquedaDesktop.value && !cajaBusquedaDesktop.value.contains(evento.target)) {
    mostrarDropdown.value = false
  }
  if (cajaMenuCategorias.value && !cajaMenuCategorias.value.contains(evento.target)) {
    mostrarMenuCategorias.value = false
  }
}

onMounted(() => {
  cargarCatalogo()
  document.addEventListener('click', cerrarDropdownAfuera)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', cerrarDropdownAfuera)
})
</script>