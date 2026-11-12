<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <SiteHeader />

      <div v-if="cargando" class="py-20 text-center text-sm text-[#9A9A9A]">Buscando tu pedido...</div>
      <div v-else-if="error" class="py-20 text-center flex flex-col items-center gap-4">
        <p class="text-sm text-red-500">No encontramos un pedido con esa referencia.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Volver al catálogo</router-link>
      </div>

      <div v-else-if="pedido" class="max-w-lg mx-auto py-16 flex flex-col gap-6 text-center items-center">
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          :class="estiloEstado.circulo"
        >{{ estiloEstado.icono }}</div>

        <h1 class="text-2xl font-extrabold">{{ estiloEstado.titulo }}</h1>
        <p class="text-sm text-[#6A6A6A] leading-relaxed">{{ estiloEstado.mensaje }}</p>

        <div class="w-full bg-[#F7F7F7] rounded-xl p-6 flex flex-col gap-3 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-[#6A6A6A]">Referencia</span>
            <span class="font-mono font-semibold text-xs break-all text-right">{{ pedido.referencia_pago }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-[#6A6A6A]">Estado</span>
            <span class="font-bold">{{ estiloEstado.etiqueta }}</span>
          </div>
          <div class="flex flex-col gap-2 divide-y divide-[#E5E5E5] pt-2 mt-1 border-t border-[#E5E5E5]">
            <div v-for="detalle in pedido.detalles" :key="detalle.id" class="flex justify-between pt-2 first:pt-0 text-sm">
              <span class="text-[#6A6A6A]">{{ detalle.nombre_producto }} × {{ detalle.cantidad }}</span>
              <span class="font-bold shrink-0">${{ formatearPrecio(detalle.precio_unitario * detalle.cantidad) }}</span>
            </div>
          </div>
          <div class="flex justify-between items-baseline pt-3 border-t border-[#E0E0E0]">
            <span class="text-sm font-semibold">Total</span>
            <span class="text-xl font-extrabold">${{ formatearPrecio(pedido.total_pedido) }}</span>
          </div>
        </div>

        <p class="text-xs text-[#9A9A9A]">Te enviamos los detalles a tu correo. Guarda esta referencia por si necesitas contactarnos.</p>

        <router-link to="/" class="text-sm font-bold border-b-[1.5px] border-black pb-0.5 mt-2">Volver al catálogo</router-link>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio } from '../utils/formato'

const route = useRoute()

const pedido = ref(null)
const cargando = ref(true)
const error = ref(false)

const estiloEstado = computed(() => {
  const estado = pedido.value?.estado
  if (estado === 'pagado') {
    return { icono: '✓', circulo: 'bg-green-100 text-green-700', titulo: '¡Pago confirmado!', etiqueta: 'Pagado', mensaje: 'Tu pedido fue confirmado y pronto lo estaremos preparando para enviar.' }
  }
  if (estado === 'expirado') {
    return { icono: '×', circulo: 'bg-red-100 text-red-700', titulo: 'Reserva expirada', etiqueta: 'Expirado', mensaje: 'El tiempo de reserva se agotó antes de completar el pago. Puedes volver a hacer el pedido desde el catálogo.' }
  }
  if (estado === 'fallido') {
    return { icono: '×', circulo: 'bg-red-100 text-red-700', titulo: 'El pago no se completó', etiqueta: 'Fallido', mensaje: 'Hubo un problema con el pago. Puedes volver a intentarlo desde el catálogo.' }
  }
  // "pendiente" — estado por defecto mientras Wompi no está activo todavía
  return { icono: '⏱', circulo: 'bg-orange-100 text-acento', titulo: '¡Pedido recibido!', etiqueta: 'Pendiente de pago', mensaje: 'Reservamos tus productos por 15 minutos. Pronto nos pondremos en contacto contigo para coordinar el pago.' }
})

onMounted(async () => {
  try {
    const res = await api.get(`/pedidos-web/${route.params.referencia}`)
    pedido.value = res.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    cargando.value = false
  }
})
</script>