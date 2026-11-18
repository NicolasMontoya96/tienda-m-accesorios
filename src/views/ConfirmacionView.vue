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

        <!-- Cuenta regresiva: solo mientras el pedido sigue pendiente de pago
             y todavía queda tiempo de reserva. Se actualiza sola cada
             segundo; si llega a cero, volvemos a consultar el pedido para
             reflejar el estado real (expirado) sin que el cliente tenga que
             recargar la página a mano. -->
        <div
          v-if="pedido.estado === 'pendiente' && tiempoRestanteMs !== null && tiempoRestanteMs > 0"
          class="flex flex-col items-center gap-1 -mt-1"
        >
          <span class="text-[11px] font-bold uppercase tracking-wide text-[#9A9A9A]">Tiempo de reserva restante</span>
          <span class="text-2xl font-mono font-extrabold tabular-nums">{{ tiempoRestanteTexto }}</span>
        </div>

        <!-- Mientras confirmamos el pago (tras cerrar el widget) no mostramos
             el botón "Pagar ahora" de nuevo — el cliente ya pagó, solo
             estamos esperando a que el webhook de Wompi le avise a nuestro
             backend. Pagos con tarjeta suelen confirmar casi al instante,
             pero PSE/Nequi/transferencia pueden tardar más. -->
        <div v-if="confirmandoPago" class="w-full max-w-xs flex flex-col items-center gap-2">
          <div class="flex items-center gap-2 text-sm font-semibold text-[#6A6A6A]">
            <span class="w-4 h-4 border-2 border-[#D0D0D0] border-t-black rounded-full animate-spin"></span>
            Confirmando tu pago...
          </div>
          <p class="text-xs text-[#9A9A9A] text-center">Puede tardar unos segundos. No cierres ni recargues esta página.</p>
        </div>

        <div v-else-if="pedido.estado === 'pendiente'" class="w-full max-w-xs flex flex-col items-center gap-2">
          <button
            @click="abrirWidgetPago"
            :disabled="cargandoPago"
            class="w-full bg-black text-white font-bold text-sm px-8 py-3.5 rounded-full disabled:opacity-50"
          >{{ cargandoPago ? 'Abriendo pago...' : 'Pagar ahora' }}</button>
          <p v-if="errorPago" class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 w-full text-center">{{ errorPago }}</p>
        </div>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { formatearPrecio } from '../utils/formato'

const route = useRoute()

const pedido = ref(null)
const cargando = ref(true)
const error = ref(false)
const cargandoPago = ref(false)
const errorPago = ref('')
const confirmandoPago = ref(false)

// El script del Widget de Wompi se carga una sola vez y se reutiliza, sin
// importar cuántas veces el cliente le dé a "Pagar ahora" (ej. si cierra el
// widget sin pagar y lo vuelve a abrir).
let promesaScriptWompi = null
const cargarScriptWompi = () => {
  if (window.WidgetCheckout) return Promise.resolve()
  if (promesaScriptWompi) return promesaScriptWompi
  promesaScriptWompi = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.wompi.co/widget.js'
    script.onload = () => resolve()
    script.onerror = () => {
      promesaScriptWompi = null
      reject(new Error('No se pudo cargar el widget de pago'))
    }
    document.head.appendChild(script)
  })
  return promesaScriptWompi
}

const cargarPedido = async () => {
  const res = await api.get(`/pedidos-web/${route.params.referencia}`)
  pedido.value = res.data
}

// Pequeña espera (helper de promesas) entre cada intento de la función
// de abajo.
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Tras cerrar el widget, el pago ya se intentó, pero el pedido solo cambia
// de "pendiente" cuando el webhook de Wompi le avisa a nuestro backend —
// eso puede tardar unos segundos (tarjeta) o más (PSE/Nequi/transferencia).
// En vez de consultar una sola vez y mostrar "pendiente" si el webhook
// todavía no llegó, reintentamos cada 3 segundos durante ~1 minuto.
const esperarConfirmacionPago = async () => {
  const intentosMax = 20
  const esperaEntreIntentosMs = 3000
  for (let intento = 0; intento < intentosMax; intento++) {
    try {
      await cargarPedido()
    } catch (e) {
      console.error(e)
    }
    if (pedido.value?.estado !== 'pendiente') return
    await esperar(esperaEntreIntentosMs)
  }
  // Se acabaron los intentos y sigue "pendiente": seguramente el método de
  // pago elegido tarda más de un minuto en confirmar (ej. transferencia).
  // Dejamos de insistir por ahora — el cliente puede recargar más tarde, o
  // le llega la confirmación por correo cuando el webhook sí llegue.
}

// Abre el Widget de Wompi para pagar este pedido. La firma de integridad
// viene del backend (ver /pedidos-web/{referencia}/firma-pago) — nunca se
// calcula aquí, porque eso requeriría tener el secreto de integridad en el
// navegador, visible para cualquiera.
//
// El resultado que el widget devuelve en su callback es solo para refrescar
// la pantalla al cerrarse: la confirmación real del pago (que mueve el
// pedido a "pagado") la hace el webhook de Wompi contra el backend, no el
// navegador del cliente — por eso después de cerrar el widget simplemente
// volvemos a consultar el pedido en vez de confiar en lo que diga el widget.
const abrirWidgetPago = async () => {
  errorPago.value = ''
  cargandoPago.value = true
  try {
    const res = await api.get(`/pedidos-web/${pedido.value.referencia_pago}/firma-pago`)
    const datos = res.data
    await cargarScriptWompi()

    const configWidget = {
      currency: datos.moneda,
      amountInCents: datos.monto_centavos,
      reference: datos.referencia,
      publicKey: datos.llave_publica,
      signature: { integrity: datos.firma_integridad },
    }
    // redirectUrl es necesario en producción (HTTPS): es a dónde vuelve el
    // cliente tras pagar con Nequi/PSE/banco, que lo sacan del widget hacia
    // la página del banco. En desarrollo local (http://localhost) el
    // firewall de Wompi bloquea la petición completa si detecta esa URL —
    // probado: sin este parámetro el widget abre normal en localhost. Como
    // el pago con tarjeta nunca sale del widget, probar tarjetas en local
    // sigue funcionando igual sin este parámetro.
    if (window.location.protocol === 'https:') {
      configWidget.redirectUrl = window.location.href
    }
    const checkout = new window.WidgetCheckout(configWidget)
    checkout.open(async () => {
      confirmandoPago.value = true
      try {
        await esperarConfirmacionPago()
      } finally {
        confirmandoPago.value = false
      }
    })
  } catch (e) {
    if (e.response?.status === 409) {
      // El pedido cambió de estado mientras tanto (ej. ya se pagó por otro
      // medio, o se venció la reserva) — refrescamos para mostrar lo real.
      await cargarPedido().catch(() => {})
    } else if (e.response?.status === 503) {
      errorPago.value = 'Los pagos en línea todavía no están disponibles. Intenta más tarde o contáctanos por WhatsApp.'
    } else {
      errorPago.value = 'No pudimos abrir la pasarela de pago. Intenta de nuevo.'
    }
  } finally {
    cargandoPago.value = false
  }
}

// Cuenta regresiva de la reserva de 15 minutos.
const tiempoRestanteMs = ref(null)
let intervaloCuentaRegresiva = null

const tiempoRestanteTexto = computed(() => {
  if (tiempoRestanteMs.value === null) return ''
  const segundosTotales = Math.max(0, Math.floor(tiempoRestanteMs.value / 1000))
  const minutos = Math.floor(segundosTotales / 60)
  const segundos = segundosTotales % 60
  return `${minutos}:${String(segundos).padStart(2, '0')}`
})

const actualizarCuentaRegresiva = async () => {
  if (!pedido.value?.expira_en) return
  const restante = new Date(pedido.value.expira_en).getTime() - Date.now()
  tiempoRestanteMs.value = restante

  if (restante <= 0) {
    if (intervaloCuentaRegresiva) {
      clearInterval(intervaloCuentaRegresiva)
      intervaloCuentaRegresiva = null
    }
    // El reloj local llegó a cero — volvemos a preguntarle al backend qué
    // pasó realmente (pudo expirar, o el pago se confirmó justo a tiempo),
    // en vez de dejar el "00:00" ahí mostrando un estado que ya no es real.
    try {
      await cargarPedido()
    } catch (e) {
      console.error(e)
    }
  }
}

const iniciarCuentaRegresivaSiAplica = () => {
  if (pedido.value?.estado === 'pendiente' && pedido.value?.expira_en) {
    actualizarCuentaRegresiva()
    intervaloCuentaRegresiva = setInterval(actualizarCuentaRegresiva, 1000)
  }
}

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
  return { icono: '⏱', circulo: 'bg-orange-100 text-acento', titulo: '¡Pedido recibido!', etiqueta: 'Pendiente de pago', mensaje: 'Reservamos tus productos por 15 minutos. Completa el pago para confirmar tu pedido.' }
})

onMounted(async () => {
  try {
    await cargarPedido()
    iniciarCuentaRegresivaSiAplica()
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    cargando.value = false
  }
})

onBeforeUnmount(() => {
  if (intervaloCuentaRegresiva) clearInterval(intervaloCuentaRegresiva)
})
</script>