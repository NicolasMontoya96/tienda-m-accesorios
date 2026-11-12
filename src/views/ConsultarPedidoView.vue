<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">
      <SiteHeader />

      <div class="max-w-md mx-auto py-16 flex flex-col gap-5">
        <h1 class="text-2xl font-extrabold tracking-tight">Consultar mi pedido</h1>
        <p class="text-sm text-[#6A6A6A] -mt-2">
          Ingresa el número de referencia que recibiste por correo al confirmar tu compra.
        </p>

        <form @submit.prevent="buscarPedido" class="flex flex-col gap-3">
          <input
            v-model.trim="referencia"
            type="text"
            required
            placeholder="Ej: 72f21be0-d88e-471a-b545-97f444d94ac5"
            class="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
          >
          <p v-if="errorMsg" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">{{ errorMsg }}</p>
          <button
            type="submit"
            :disabled="buscando || !referencia"
            class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ buscando ? 'Buscando...' : 'Consultar' }}
          </button>
        </form>

        <p class="text-xs text-[#9A9A9A]">
          ¿No encuentras tu referencia? Revisa el correo de confirmación de tu pedido, o
          <a
            :href="`https://wa.me/${whatsappNumero}`"
            target="_blank"
            rel="noopener"
            class="underline font-semibold text-[#6A6A6A]"
          >escríbenos por WhatsApp</a>
          si necesitas ayuda.
        </p>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const referencia = ref('')
const buscando = ref(false)
const errorMsg = ref('')
const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '573187925674'

const buscarPedido = async () => {
  errorMsg.value = ''
  buscando.value = true
  try {
    await api.get(`/pedidos-web/${referencia.value}`)
    router.push(`/pedido/${referencia.value}`)
  } catch (e) {
    errorMsg.value = e.response?.status === 404
      ? 'No encontramos un pedido con esa referencia. Revisa que esté bien copiada.'
      : 'No pudimos consultar tu pedido. Intenta de nuevo.'
  } finally {
    buscando.value = false
  }
}
</script>