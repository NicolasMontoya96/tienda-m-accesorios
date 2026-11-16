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

  // `stock` se guarda junto al item para poder topar la cantidad sin tener
  // que volver a consultar la API cada vez que alguien le da a "+". Se
  // refresca cada vez que se agrega el mismo producto de nuevo, por si el
  // stock cambió desde la última vez que se agregó.
  const agregarProducto = (producto, cantidad = 1) => {
    const existente = items.value.find(i => i.producto_id === producto.id)
    if (existente) {
      existente.stock = producto.stock
      existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock)
    } else {
      items.value.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_venta: producto.precio_venta,
        imagen_url: producto.imagen_url || null,
        stock: producto.stock,
        cantidad: Math.min(cantidad, producto.stock),
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
    // item.stock puede no existir en carritos guardados antes de este
    // cambio (localStorage viejo) — en ese caso no topamos, para no romper
    // un carrito que ya tenía alguien abierto.
    const tope = typeof item.stock === 'number' ? item.stock : Infinity
    item.cantidad = Math.min(cantidad, tope)
  }

  const quitarProducto = (producto_id) => {
    items.value = items.value.filter(i => i.producto_id !== producto_id)
  }

  // Se usa cuando el checkout devuelve 409 (stock insuficiente): el
  // carrito guarda el stock "en caché" desde que se agregó el producto,
  // y si nadie vuelve a tocarlo, nunca se entera de que alguien más ya
  // compró lo que quedaba. Esto trae el stock real desde el backend,
  // topa cada cantidad a lo que de verdad hay, y quita del carrito
  // cualquier producto que se haya agotado por completo.
  const sincronizarStock = (productosFrescos) => {
    items.value = items.value
      .map(item => {
        const fresco = productosFrescos.find(p => p.id === item.producto_id)
        if (!fresco) return item
        return { ...item, stock: fresco.stock, cantidad: Math.min(item.cantidad, fresco.stock) }
      })
      .filter(item => item.cantidad > 0)
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
    sincronizarStock,
  }
}