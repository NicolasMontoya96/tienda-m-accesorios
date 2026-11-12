<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8">

      <!-- Header (igual al resto de la tienda) -->
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

      <h1 class="text-2xl md:text-[32px] font-extrabold mt-8 mb-6">Tu carrito</h1>

      <!-- Carrito vacío -->
      <div v-if="items.length === 0" class="py-16 text-center flex flex-col items-center gap-4">
        <p class="text-sm text-[#6A6A6A]">Todavía no has agregado productos.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Ver catálogo</router-link>
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

      <footer class="py-8 pb-14 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[#8A8A8A] mt-6 border-t border-[#EFEFEF]">
        <span class="font-extrabold">M Accesorios</span>
        <span>© {{ anioActual }} · Cali, Colombia</span>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { useCarrito } from '../composables/useCarrito'

const { items, cantidadTotal, totalPedido, actualizarCantidad, quitarProducto } = useCarrito()

const anioActual = new Date().getFullYear()
const formatearPrecio = (valor) => parseFloat(valor).toLocaleString('es-CO')
</script>