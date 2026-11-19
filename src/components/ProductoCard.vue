<template>
  <div class="group flex flex-col gap-2.5 cursor-pointer" @click="verProducto">
    <div class="relative aspect-square bg-[#F3EFE8] border border-[#EAE3D7] rounded-[10px] flex items-center justify-center text-[10px] tracking-wide uppercase text-[#C2C2C2] overflow-hidden shadow-[0_1px_2px_rgba(30,25,15,0.05)] transition-shadow group-hover:shadow-[0_8px_24px_rgba(30,25,15,0.1)]">
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
      <!-- Antes decía "¡Últimas 1!" en naranja con signo de exclamación — un
           tono de urgencia de oferta que, al aparecer en casi todo el
           catálogo a la vez (porque de verdad manejamos unidad física por
           producto), termina pareciendo inventario inflado en vez de stock
           real. Un mensaje neutro, sin exclamación, es más honesto con lo
           que realmente es: piezas físicas limitadas, no una táctica de
           urgencia. -->
      <span
        v-else-if="producto.stock === 1"
        class="absolute top-2.5 left-2.5 bg-[#17140F] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      >Pieza única</span>
      <span
        v-else-if="producto.stock <= 2"
        class="absolute top-2.5 left-2.5 bg-[#17140F] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      >Quedan {{ producto.stock }}</span>

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
    <span class="text-[12px] text-[#9A9A9A] -mt-1.5">{{ nombreCategoriaDe(categorias, producto.categoria_id) }}</span>

    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-0.5">
        <b class="text-base font-extrabold">${{ formatearPrecio(producto.precio_venta) }}</b>
        <span v-if="producto.stock > 0" class="text-[13px] font-bold text-acento -mt-0.5">Más información</span>
        <span v-else class="text-[13px] font-bold text-[#B0B0B0] -mt-0.5">Agotado</span>
      </div>

      <!-- Compra rápida: agrega 1 unidad sin pasar por el detalle del
           producto. Solo cuando hay stock — si no, ya queda claro con el
           "Agotado" de al lado. -->
      <button
        v-if="producto.stock > 0"
        @click.stop="agregarRapido"
        class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shrink-0"
        aria-label="Agregar al carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCarrito } from '../composables/useCarrito'
import { useFavoritos } from '../composables/useFavoritos'
import { useToast } from '../composables/useToast'
import { formatearPrecio, nombreCategoria as nombreCategoriaDe } from '../utils/formato'

const props = defineProps({
  producto: { type: Object, required: true },
  categorias: { type: Array, default: () => [] },
})

const router = useRouter()
const { agregarProducto } = useCarrito()
const { esFavorito, alternarFavorito } = useFavoritos()
const { mostrarToast } = useToast()

const verProducto = () => {
  router.push(`/producto/${props.producto.id}`)
}

const agregarRapido = () => {
  agregarProducto(props.producto, 1)
  mostrarToast(`${props.producto.nombre} se agregó a tu carrito`)
}
</script>