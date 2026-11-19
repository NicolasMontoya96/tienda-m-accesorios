<template>
  <!-- Antes el footer era blanco como el resto de la página — justo donde
       un sitio suele "cerrar" con algo de peso visual, este se diluía
       igual que todo lo demás. Un bloque oscuro contenido (no a todo el
       ancho de la pantalla, para no rediseñar el layout de cada vista)
       le da a la página un punto de anclaje claro al final. -->
  <footer class="mt-10 mb-6">
    <div class="bg-[#17140F] rounded-2xl px-6 sm:px-9 py-9 sm:py-10 flex flex-col gap-8">

      <!-- Medios de pago + compra segura -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wide text-[#8A8578]">Medios de pago</span>
          <div class="flex flex-wrap items-center gap-2">
            <!-- Visa: wordmark oficial (fuente: librería open-source "simple-icons",
                 misma forma y color de marca que usa Visa — no una recreación a mano). -->
            <div class="w-12 h-8 rounded-[5px] bg-white flex items-center justify-center shrink-0">
              <svg width="30" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1A1F71" aria-label="Visa">
                <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/>
              </svg>
            </div>
            <!-- Mastercard: los dos círculos superpuestos en sus colores oficiales
                 (EB001B / F79E1B) — es la marca en sí, geometría simple, no una
                 interpretación. -->
            <div class="w-12 h-8 rounded-[5px] bg-white flex items-center justify-center shrink-0">
              <svg width="26" height="16" viewBox="0 0 26 16" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                <circle cx="9.5" cy="8" r="7" fill="#EB001B"/>
                <circle cx="16.5" cy="8" r="7" fill="#F79E1B"/>
                <path d="M13 2.4a7 7 0 010 11.2 7 7 0 010-11.2z" fill="#FF5F00"/>
              </svg>
            </div>
            <!-- PSE y Nequi: sin logo exacto todavía — no tenemos el asset oficial
                 (ni "simple-icons" ni la documentación de Wompi lo traen), así que
                 en vez de inventar una forma que se le parezca, usamos el nombre
                 real de la marca con tipografía cuidada y su color de marca. Al
                 integrar el pago real con Wompi, su panel entrega los badges
                 oficiales — ahí se reemplazan estos dos por los definitivos. -->
            <div class="h-8 px-3 rounded-[5px] bg-white flex items-center justify-center shrink-0">
              <span class="text-[13px] font-extrabold tracking-tight" style="color:#00833E">PSE</span>
            </div>
            <div class="h-8 px-3 rounded-[5px] bg-white flex items-center justify-center shrink-0">
              <span class="text-[13px] font-extrabold tracking-tight lowercase" style="color:#DA1884">nequi</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-acento shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[13px] font-bold text-white">Compra segura</span>
            <span class="text-[12px] text-[#9A9589]">Conexión cifrada (HTTPS) en todo el sitio</span>
          </div>
        </div>
      </div>

      <!-- Links legales -->
      <nav class="flex flex-col sm:flex-row gap-1.5 sm:gap-6 text-[13px] text-[#B5B0A3] pt-2 border-t border-white/10">
        <router-link to="/terminos-y-condiciones" class="hover:text-acento font-semibold pt-2">Términos y condiciones</router-link>
        <router-link to="/politica-de-datos" class="hover:text-acento font-semibold pt-2 sm:pt-0">Política de tratamiento de datos</router-link>
      </nav>

      <!-- Identificación legal del negocio -->
      <div class="flex flex-col gap-1 pt-6 border-t border-white/10 text-[12px] text-[#9A9589]">
        <span class="font-extrabold text-white text-[13px]">M<span class="text-acento">·</span>Accesorios</span>
        <span>Cédula {{ cedulaNegocio }} · Cali, Colombia</span>
        <span>© {{ anioActual }} M Accesorios. Todos los derechos reservados.</span>
      </div>

    </div>
  </footer>
</template>

<script setup>
const anioActual = new Date().getFullYear()

// M Accesorios es persona natural: va cédula, no NIT (el NIT aplica a
// empresas o a personas naturales comerciantes registradas en DIAN).
// Mismo placeholder usado en PoliticaDatosView.vue y
// TerminosCondicionesView.vue — queda así hasta que se decida si se
// publica el número real (ver estándar de seguridad, sección 4).
const cedulaNegocio = import.meta.env.VITE_CEDULA_NEGOCIO || '[Número]'
</script>