import { ref, computed, watch } from 'vue'

const CLAVE_STORAGE = 'm-accesorios-carrito'

const cargarInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// Estado compartido entre todas las vistas que usen este composable
const items = ref(cargarInicial())

watch(items, (nuevoValor) => {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevoValor))
  } catch {
    // Si localStorage falla (modo incógnito, cuota llena, etc.) seguimos sin persistencia
  }
}, { deep: true })

export function useCarrito() {
  const cantidadTotal = computed(() => items.value.reduce((suma, item) => suma + item.cantidad, 0))

  const totalPedido = computed(() => items.value.reduce((suma, item) => suma + item.precio_venta * item.cantidad, 0))

  const agregarProducto = (producto, cantidad = 1) => {
    const existente = items.value.find(i => i.producto_id === producto.id)
    if (existente) {
      existente.cantidad += cantidad
    } else {
      items.value.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_venta: producto.precio_venta,
        imagen_url: producto.imagen_url || null,
        cantidad,
      })
    }
  }

  const actualizarCantidad = (producto_id, cantidad) => {
    const item = items.value.find(i => i.producto_id === producto_id)
    if (!item) return
    if (cantidad <= 0) {
      quitarProducto(producto_id)
      return
    }
    item.cantidad = cantidad
  }

  const quitarProducto = (producto_id) => {
    items.value = items.value.filter(i => i.producto_id !== producto_id)
  }

  const vaciarCarrito = () => {
    items.value = []
  }

  return {
    items,
    cantidadTotal,
    totalPedido,
    agregarProducto,
    actualizarCantidad,
    quitarProducto,
    vaciarCarrito,
  }
}