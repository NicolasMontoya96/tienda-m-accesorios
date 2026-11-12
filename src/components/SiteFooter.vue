<template>
  <footer class="pt-10 pb-14 mt-10 border-t border-[#EFEFEF] flex flex-col gap-8">

    <!-- Medios de pago + compra segura -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div class="flex flex-col gap-2">
        <span class="text-[11px] font-bold uppercase tracking-wide text-[#9A9A9A]">Medios de pago</span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="medio in mediosDePago"
            :key="medio.etiqueta"
            class="relative w-11 h-7 rounded-[5px] shadow-sm flex items-center justify-center overflow-hidden shrink-0"
            :style="{ backgroundColor: medio.color }"
          >
            <div class="absolute top-[5px] left-0 right-0 h-[3px]" :style="{ backgroundColor: medio.colorFranja }"></div>
            <span class="text-[9px] font-extrabold tracking-tight" :style="{ color: medio.colorTexto }">{{ medio.etiqueta }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-full bg-[#F7F7F7] flex items-center justify-center text-acento shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="flex flex-col">
          <span class="text-[13px] font-bold text-[#111111]">Compra segura</span>
          <span class="text-[12px] text-[#9A9A9A]">Conexión cifrada (HTTPS) en todo el sitio</span>
        </div>
      </div>
    </div>

    <!-- Links legales -->
    <nav class="flex flex-col sm:flex-row gap-1.5 sm:gap-6 text-[13px] text-[#8A8A8A]">
      <router-link to="/terminos-y-condiciones" class="hover:text-[#111111] font-semibold">Términos y condiciones</router-link>
      <router-link to="/politica-de-datos" class="hover:text-[#111111] font-semibold">Política de tratamiento de datos</router-link>
    </nav>

    <!-- Identificación legal del negocio -->
    <div class="flex flex-col gap-1 pt-6 border-t border-[#EFEFEF] text-[12px] text-[#9A9A9A]">
      <span class="font-extrabold text-[#111111] text-[13px]">M Accesorios</span>
      <span>{{ razonSocial }} · NIT/Cédula {{ nit }} · Cali, Colombia</span>
      <span>© {{ anioActual }} M Accesorios. Todos los derechos reservados.</span>
    </div>

  </footer>
</template>

<script setup>
const anioActual = new Date().getFullYear()

// TEMPORAL: íconos genéricos de tarjeta (forma + color), no los logos
// reales de cada marca (esos tienen derechos de autor). Reemplazar por
// los íconos oficiales que entregue Wompi en su documentación (o por
// los SVG de la librería "simple-icons") cuando se integre el pago real.
const mediosDePago = [
  { etiqueta: 'VISA', color: '#1A1F71', colorFranja: '#2E3494', colorTexto: '#FFFFFF' },
  { etiqueta: 'MC',   color: '#2B2B2B', colorFranja: '#EB001B', colorTexto: '#FFFFFF' },
  { etiqueta: 'PSE',  color: '#00833E', colorFranja: '#00A651', colorTexto: '#FFFFFF' },
  { etiqueta: 'NEQ',  color: '#1A0033', colorFranja: '#DA1884', colorTexto: '#FFFFFF' },
]

// Mismos placeholders usados en PoliticaDatosView.vue y
// TerminosCondicionesView.vue — reemplazar con los datos reales del
// negocio antes de producción (ver estándar de seguridad, sección 4).
const razonSocial = import.meta.env.VITE_RAZON_SOCIAL || '[Nombre o razón social completa]'
const nit = import.meta.env.VITE_NIT_NEGOCIO || '[Número]'
</script>