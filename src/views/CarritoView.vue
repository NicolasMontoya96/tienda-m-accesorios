<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <!-- Header (igual al resto de la tienda) -->
      <SiteHeader />

      <h1 class="text-2xl md:text-[32px] font-extrabold mt-8 mb-6">Tu carrito</h1>

      <!-- Carrito vacío -->
      <div v-if="items.length === 0" class="py-20 text-center flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#C2C2C2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <p class="text-sm text-[#6A6A6A] max-w-xs">Todavía no has agregado productos a tu carrito.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full mt-1">Ver catálogo</router-link>
      </div>

      <template v-else>
        <div class="flex flex-col divide-y divide-[#EFEFEF] border-t border-b border-[#EFEFEF]">
          <div v-for="item in items" :key="item.producto_id" class="flex items-center gap-4 py-5">
            <div class="w-20 h-20 bg-[#F7F7F7] rounded-[10px] flex items-center justify-center text-[10px] uppercase text-[#C2C2C2] overflow-hidden shrink-0">
              <img v-if="item.imagen_url" :src="item.imagen_url" class="w-full h-full object-cover" alt="">
              <span v-else>Foto</span>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-[15px] font-bold truncate">{{ item.nombre }}</p>
              <p class="text-sm text-[#6A6A6A] mt-0.5">${{ formatearPrecio(item.precio_venta) }} c/u</p>
            </div>

            <div class="flex items-center border border-[#E5E5E5] rounded-full shrink-0">
              <button @click="actualizarCantidad(item.producto_id, item.cantidad - 1)" class="w-8 h-8 flex items-center justify-center text-base">−</button>
              <span class="w-7 text-center text-sm font-bold">{{ item.cantidad }}</span>
              <button @click="actualizarCantidad(item.producto_id, item.cantidad + 1)" class="w-8 h-8 flex items-center justify-center text-base">+</button>
            </div>

            <span class="text-[15px] font-extrabold w-24 text-right shrink-0">${{ formatearPrecio(item.precio_venta * item.cantidad) }}</span>

            <button @click="quitarProducto(item.producto_id)" class="text-[#B0B0B0] hover:text-red-500 text-lg shrink-0 ml-2" title="Quitar">×</button>
          </div>
        </div>

        <div class="flex flex-col items-end gap-4 py-8">
          <div class="flex items-baseline gap-3">
            <span class="text-sm text-[#6A6A6A]">Total</span>
            <span class="text-2xl font-extrabold">${{ formatearPrecio(totalPedido) }}</span>
          </div>
          <router-link to="/checkout" class="bg-black text-white font-bold text-sm px-8 py-3.5 rounded-full">Proceder al pago</router-link>
          <router-link to="/" class="text-[13px] font-semibold text-[#6A6A6A]">← Seguir comprando</router-link>
        </div>
      </template>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { useCarrito } from '../composables/useCarrito'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio } from '../utils/formato'

const { items, cantidadTotal, totalPedido, actualizarCantidad, quitarProducto } = useCarrito()
</script>