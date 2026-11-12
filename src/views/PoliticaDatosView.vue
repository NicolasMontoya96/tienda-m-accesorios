<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8">

      <header class="flex justify-between items-center py-5 border-b border-[#EFEFEF]">
        <router-link to="/" class="text-[22px] font-extrabold tracking-tight">
          M<span class="text-acento">·</span>Accesorios
        </router-link>
      </header>

      <div class="max-w-2xl mx-auto py-12 flex flex-col gap-6">
        <router-link to="/" class="text-[13px] font-semibold text-[#6A6A6A] w-fit">← Volver al catálogo</router-link>

        <h1 class="text-3xl font-extrabold tracking-tight">Política de tratamiento de datos personales</h1>
        <p class="text-sm text-[#9A9A9A] -mt-2">Última actualización: {{ fechaActualizacion }}</p>

        <section class="flex flex-col gap-2 text-[15px] text-[#3A3A3A] leading-relaxed">
          <h2 class="text-lg font-bold text-[#111111] mt-2">1. Responsable del tratamiento</h2>
          <p>
            <strong>M Accesorios</strong> ([Nombre o razón social completa], NIT/Cédula [Número]),
            con domicilio en Cali, Colombia, es responsable del tratamiento de los datos personales
            que usted suministra al realizar un pedido en este sitio. Puede contactarnos por
            WhatsApp al {{ whatsappNumero }} o al correo electrónico {{ correoContacto }}.
          </p>

          <h2 class="text-lg font-bold text-[#111111] mt-4">2. Datos que recolectamos</h2>
          <p>Para procesar su pedido recolectamos únicamente:</p>
          <ul class="list-disc pl-5 flex flex-col gap-1">
            <li>Nombre completo</li>
            <li>Número de teléfono</li>
            <li>Correo electrónico</li>
            <li>Dirección de envío</li>
          </ul>
          <p>No recolectamos ni almacenamos datos de tarjetas de crédito o débito: el pago se procesa directamente a través de nuestra pasarela de pagos autorizada (Wompi), que cumple con los estándares de seguridad exigidos por las entidades financieras.</p>

          <h2 class="text-lg font-bold text-[#111111] mt-4">3. Finalidad del tratamiento</h2>
          <p>Sus datos personales son utilizados exclusivamente para:</p>
          <ul class="list-disc pl-5 flex flex-col gap-1">
            <li>Procesar y confirmar su pedido</li>
            <li>Coordinar el envío de los productos comprados</li>
            <li>Contactarlo en caso de novedades con su pedido</li>
            <li>Enviar la confirmación y el estado de su compra por correo electrónico</li>
          </ul>
          <p>No compartimos, vendemos ni cedemos sus datos personales a terceros distintos de quienes sean estrictamente necesarios para completar la entrega de su pedido (por ejemplo, la empresa transportadora).</p>

          <h2 class="text-lg font-bold text-[#111111] mt-4">4. Sus derechos como titular de los datos</h2>
          <p>De acuerdo con la Ley 1581 de 2012 y sus decretos reglamentarios, usted tiene derecho a:</p>
          <ul class="list-disc pl-5 flex flex-col gap-1">
            <li>Conocer, actualizar y rectificar sus datos personales</li>
            <li>Solicitar prueba de la autorización otorgada</li>
            <li>Ser informado sobre el uso que se le ha dado a sus datos</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley</li>
            <li>Revocar la autorización y/o solicitar la supresión de sus datos, cuando no exista un deber legal o contractual que impida su eliminación</li>
            <li>Acceder de forma gratuita a sus datos personales que hayan sido objeto de tratamiento</li>
          </ul>

          <h2 class="text-lg font-bold text-[#111111] mt-4">5. Cómo ejercer sus derechos</h2>
          <p>
            Puede ejercer cualquiera de estos derechos escribiéndonos a {{ correoContacto }} o por
            WhatsApp al {{ whatsappNumero }}, indicando su nombre completo y la solicitud puntual.
            Responderemos dentro de los términos establecidos por la ley.
          </p>

          <h2 class="text-lg font-bold text-[#111111] mt-4">6. Vigencia</h2>
          <p>
            Esta política rige a partir de la fecha de publicación indicada arriba y permanecerá
            vigente mientras se mantengan las finalidades descritas. Cualquier cambio será
            publicado en esta misma página.
          </p>
        </section>
      </div>

      <footer class="py-8 pb-14 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-[#8A8A8A] mt-6 border-t border-[#EFEFEF]">
        <span class="font-extrabold">M Accesorios</span>
        <span>© {{ anioActual }} · Cali, Colombia</span>
      </footer>

    </div>
  </div>
</template>

<script setup>
const anioActual = new Date().getFullYear()
const fechaActualizacion = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '[Número]'
const correoContacto = import.meta.env.VITE_CORREO_CONTACTO || '[correo de contacto]'
</script>