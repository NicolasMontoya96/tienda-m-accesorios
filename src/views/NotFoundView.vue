<template>
  <div class="font-sans bg-white text-[#111111] min-h-screen flex flex-col">
    <div class="max-w-[1180px] mx-auto px-[18px] sm:px-8 w-full">
      <header class="flex justify-between items-center py-5 border-b border-[#EFEFEF]">
        <router-link to="/" class="text-[22px] font-extrabold tracking-tight">
          M<span class="text-acento">·</span>Accesorios
        </router-link>
      </header>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <span class="text-sm font-bold tracking-wider uppercase text-acento">Error 404</span>
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Esta página no existe</h1>
      <p class="text-sm text-[#6A6A6A] max-w-sm">
        Puede que el enlace esté roto o que la página haya sido movida. Vuelve al catálogo para seguir comprando.
      </p>
      <router-link to="/" class="bg-black text-white font-bold text-sm px-6 py-3.5 rounded-full mt-2">
        Volver al catálogo
      </router-link>
    </div>
  </div>
</template>