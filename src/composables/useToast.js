import { ref } from 'vue'

const mensaje = ref('')
const visible = ref(false)
let temporizador = null

function mostrarToast(texto, duracionMs = 2500) {
  mensaje.value = texto
  visible.value = true
  if (temporizador) clearTimeout(temporizador)
  temporizador = setTimeout(() => {
    visible.value = false
  }, duracionMs)
}

export function useToast() {
  return { mensaje, visible, mostrarToast }
}