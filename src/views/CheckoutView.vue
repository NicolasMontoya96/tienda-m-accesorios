<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8">

      <header class="flex justify-between items-center py-5 border-b border-[#EFEFEF]">
        <router-link to="/" class="text-[22px] font-extrabold tracking-tight">
          M<span class="text-acento">·</span>Accesorios
        </router-link>
        <div class="flex gap-5 items-center text-[13px] font-semibold">
          <router-link to="/carrito" class="flex items-center gap-1.5">
            Carrito
            <i class="bg-black text-white text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center not-italic">{{ cantidadTotal }}</i>
          </router-link>
        </div>
      </header>

      <!-- Carrito vacío: no debería poder llegar aquí sin productos -->
      <div v-if="items.length === 0" class="py-16 text-center flex flex-col items-center gap-4">
        <p class="text-sm text-[#6A6A6A]">Tu carrito está vacío.</p>
        <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full">Ver catálogo</router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12 py-8">

        <!-- Formulario -->
        <form @submit.prevent="enviarPedido" class="flex flex-col gap-5 max-w-lg">
          <h1 class="text-2xl font-extrabold mb-1">Datos de entrega</h1>

          <div>
            <label class="block text-sm font-semibold mb-1">Nombre completo *</label>
            <input v-model="form.nombre_cliente" type="text" required class="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Teléfono *</label>
            <input v-model="form.telefono_cliente" type="tel" required class="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Correo electrónico *</label>
            <input v-model="form.email_cliente" type="email" required class="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black">
            <p class="text-xs text-[#9A9A9A] mt-1">Te enviaremos la confirmación del pedido a este correo.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Dirección de envío *</label>
            <textarea v-model="form.direccion_envio" required rows="2" class="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"></textarea>
          </div>

          <label class="flex items-start gap-2.5 mt-2">
            <input v-model="form.acepta_tratamiento_datos" type="checkbox" required class="mt-0.5">
            <span class="text-[13px] text-[#5A5A5A] leading-relaxed">
               Autorizo el tratamiento de mis datos personales conforme a la
          <router-link to="/politica-de-datos" target="_blank" class="underline font-semibold">Política de tratamiento de datos personales</router-link>,
                con el fin de procesar este pedido y contactarme sobre su estado.
            </span>
          </label>

          <p v-if="errorEnvio" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">{{ errorEnvio }}</p>

          <button
            type="submit"
            :disabled="enviando"
            class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ enviando ? 'Procesando...' : 'Confirmar pedido' }}
          </button>

          <p class="text-xs text-[#9A9A9A]">
            Reservamos tus productos por 15 minutos mientras confirmas el pago. Pasado ese tiempo, el stock se libera.
          </p>
        </form>

        <!-- Resumen del pedido -->
        <aside class="bg-[#F7F7F7] rounded-xl p-6 h-fit flex flex-col gap-4">
          <h2 class="text-base font-extrabold">Resumen del pedido</h2>
          <div class="flex flex-col gap-3 divide-y divide-[#E5E5E5]">
            <div v-for="item in items" :key="item.producto_id" class="flex justify-between gap-3 pt-3 first:pt-0 text-sm">
              <span class="text-[#5A5A5A]">{{ item.nombre }} × {{ item.cantidad }}</span>
              <span class="font-bold shrink-0">${{ formatearPrecio(item.precio_venta * item.cantidad) }}</span>
            </div>
          </div>
          <div class="flex justify-between items-baseline pt-4 border-t border-[#E0E0E0]">
            <span class="text-sm font-semibold">Total</span>
            <span class="text-xl font-extrabold">${{ formatearPrecio(totalPedido) }}</span>
          </div>
        </aside>

      </div>

      <footer class="py-8 pb-14 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[#8A8A8A] mt-6 border-t border-[#EFEFEF]">
        <span class="font-extrabold">M Accesorios</span>
        <span>© {{ anioActual }} · Cali, Colombia</span>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useCarrito } from '../composables/useCarrito'

const router = useRouter()
const { items, cantidadTotal, totalPedido, vaciarCarrito } = useCarrito()

const anioActual = new Date().getFullYear()
const formatearPrecio = (valor) => parseFloat(valor).toLocaleString('es-CO')

const form = ref({
  nombre_cliente: '',
  telefono_cliente: '',
  email_cliente: '',
  direccion_envio: '',
  acepta_tratamiento_datos: false,
})

const enviando = ref(false)
const errorEnvio = ref('')

const enviarPedido = async () => {
  errorEnvio.value = ''
  enviando.value = true
  try {
    const payload = {
      ...form.value,
      items: items.value.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
    }
    const res = await api.post('/pedidos-web/', payload)
    vaciarCarrito()
    router.push(`/pedido/${res.data.referencia_pago}`)
  } catch (e) {
    const detalle = e.response?.data?.detail
    if (e.response?.status === 409) {
      errorEnvio.value = detalle || 'Uno de los productos ya no tiene suficiente stock disponible. Vuelve al carrito y ajusta la cantidad.'
    } else if (e.response?.status === 429) {
      errorEnvio.value = 'Demasiados intentos en poco tiempo. Espera un minuto y vuelve a intentar.'
    } else {
      errorEnvio.value = detalle || 'No pudimos procesar tu pedido. Intenta de nuevo.'
    }
  } finally {
    enviando.value = false
  }
}
</script>