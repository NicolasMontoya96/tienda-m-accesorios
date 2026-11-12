<template>
  <Transition name="aparecer">
    <button
      v-if="visible"
      @click="subirArriba"
      class="fixed bottom-24 right-5 z-40 w-11 h-11 rounded-full bg-white border border-[#E5E5E5] shadow-md flex items-center justify-center text-[#111111] hover:bg-[#F7F7F7] transition-colors"
      aria-label="Volver arriba"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

const alHacerScroll = () => {
  visible.value = window.scrollY > 400
}

const subirArriba = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', alHacerScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', alHacerScroll))
</script>

<style scoped>
.aparecer-enter-active,
.aparecer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.aparecer-enter-from,
.aparecer-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>