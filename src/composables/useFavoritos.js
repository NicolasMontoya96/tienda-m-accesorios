import { ref, watch } from 'vue'

// Favoritos persistidos en localStorage, mismo patrón que useCarrito.
// Consumido por el corazón en las cards de producto y por la vista
// dedicada en FavoritosView.vue.
const CLAVE_STORAGE = 'm-accesorios-favoritos'

const cargarInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

const idsFavoritos = ref(cargarInicial())

watch(idsFavoritos, (nuevoValor) => {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevoValor))
  } catch {}
}, { deep: true })

export function useFavoritos() {
  const esFavorito = (productoId) => idsFavoritos.value.includes(productoId)

  const alternarFavorito = (productoId) => {
    if (esFavorito(productoId)) {
      idsFavoritos.value = idsFavoritos.value.filter(id => id !== productoId)
    } else {
      idsFavoritos.value = [...idsFavoritos.value, productoId]
    }
  }

  return { idsFavoritos, esFavorito, alternarFavorito }
}