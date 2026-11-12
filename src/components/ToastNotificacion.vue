<template>
  <Teleport to="body">
    <Transition name="toast-subir">
      <div
        v-if="visible"
        class="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 flex items-center gap-2.5 bg-[#111111] text-white text-[13px] font-semibold px-4 py-3 rounded-full shadow-lg max-w-[90vw]"
      >
        <span class="w-5 h-5 rounded-full bg-acento flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <span class="truncate">{{ mensaje }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { mensaje, visible } = useToast()
</script>

<style scoped>
.toast-subir-enter-active,
.toast-subir-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-subir-enter-from,
.toast-subir-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
@media (min-width: 640px) {
  .toast-subir-enter-from,
  .toast-subir-leave-to {
    transform: translateY(8px);
  }
}
</style>