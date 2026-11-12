import { ref } from 'vue'
import api from '../api/axios'

// Cache compartido del catálogo: todas las vistas que lo usen comparten
// la misma lista ya cargada en lugar de volver a pedirla al backend.
const productos = ref([])
const categorias = ref([])
const cargado = ref(false)
const cargando = ref(false)
const error = ref(false)

async function cargarCatalogo() {
  if (cargado.value || cargando.value) return
  cargando.value = true
  error.value = false
  try {
    const [resProductos, resCategorias] = await Promise.all([
      api.get('/productos/'),
      api.get('/categorias/'),
    ])
    productos.value = resProductos.data
    categorias.value = resCategorias.data
    cargado.value = true
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    cargando.value = false
  }
}

export function useCatalogo() {
  return { productos, categorias, cargado, cargando, error, cargarCatalogo }
}