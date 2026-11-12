<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen">
    <div class="max-w-[1320px] mx-auto px-[18px] sm:px-8">

      <SiteHeader />

      <div class="max-w-2xl mx-auto py-14 flex flex-col gap-8">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Términos y condiciones</h1>
          <p class="text-[13px] text-[#9A9A9A] mt-2">Última actualización: {{ fechaActualizacion }}</p>
        </div>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">1. Quiénes somos</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            M Accesorios, operado por <strong>[Nombre o razón social completa]</strong>, identificado con
            NIT/Cédula <strong>[Número]</strong>, con domicilio en Cali, Colombia, es responsable de la
            venta de los productos ofrecidos en este sitio web.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">2. Productos y precios</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Todos los productos publicados corresponden a unidades disponibles físicamente en nuestra
            tienda al momento de la publicación. Los precios se muestran en pesos colombianos (COP) e
            incluyen los impuestos aplicables. Nos reservamos el derecho de modificar precios y
            disponibilidad sin previo aviso, sin afectar los pedidos ya confirmados.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">3. Proceso de compra</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Al confirmar un pedido, reservamos el stock seleccionado por un tiempo limitado mientras se
            coordina o procesa el pago. Si el pago no se completa dentro de ese plazo, la reserva expira
            y el stock vuelve a estar disponible para otros compradores. Recibirás una confirmación por
            correo electrónico con el detalle y la referencia de tu pedido.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">4. Medios de pago</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Aceptamos los medios de pago habilitados en el sitio al momento de tu compra (tarjeta de
            crédito, PSE y otros disponibles a través de nuestra pasarela de pagos). El procesamiento del
            pago está a cargo de un proveedor externo especializado; nosotros no almacenamos los datos de
            tu tarjeta.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">5. Envíos</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Realizamos envíos a nivel nacional a través de transportadora. El costo y tiempo estimado de
            entrega se informan antes de confirmar el pedido. Los tiempos de entrega son estimados y
            pueden variar por factores ajenos a nosotros (clima, paro de transportadores, zona de
            cobertura, entre otros).
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">6. Cambios y devoluciones</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Conforme al derecho de retracto establecido en la Ley 1480 de 2011 (Estatuto del Consumidor),
            tienes hasta <strong>5 días hábiles</strong> después de recibido el producto para solicitar su
            devolución, siempre que se encuentre sin uso, con su empaque original y accesorios completos.
            Para solicitar un cambio o devolución, escríbenos por WhatsApp al
            <strong>{{ whatsappNumero }}</strong> indicando tu número de referencia de pedido.
          </p>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Si el producto presenta una falla de fábrica, aplica la garantía descrita en la sección
            siguiente en lugar del derecho de retracto.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">7. Garantía</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Todos los productos cuentan con garantía legal por defectos de fabricación conforme a la
            normativa colombiana vigente. Si tu producto presenta una falla, contáctanos por WhatsApp al
            <strong>{{ whatsappNumero }}</strong> con tu referencia de pedido para evaluar el caso.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">8. Tratamiento de datos personales</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            El tratamiento de tus datos personales se rige por nuestra
            <router-link to="/politica-de-datos" class="underline font-semibold">Política de tratamiento de datos personales</router-link>,
            conforme a la Ley 1581 de 2012.
          </p>
        </section>

        <section class="flex flex-col gap-2">
          <h2 class="text-base font-extrabold">9. Contacto</h2>
          <p class="text-[14px] text-[#6A6A6A] leading-relaxed">
            Para cualquier duda, reclamo o solicitud relacionada con tu pedido, puedes escribirnos por
            WhatsApp al <strong>{{ whatsappNumero }}</strong>{{ correoContacto ? ` o al correo ${correoContacto}` : '' }}.
          </p>
        </section>

        <router-link to="/" class="text-sm font-bold border-b-[1.5px] border-black pb-0.5 w-fit mt-2">
          Volver al catálogo
        </router-link>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup>
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '[Número]'
const correoContacto = import.meta.env.VITE_CORREO_CONTACTO || ''

const fechaActualizacion = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
</script>