// Utilidades de formato compartidas por todas las vistas y componentes de
// la tienda. Antes cada archivo declaraba su propia copia de estas
// funciones; centralizarlas evita que una futura actualización (ej. cambiar
// el formato de precio) tenga que repetirse en cada archivo.

export function formatearPrecio(valor) {
  return parseFloat(valor).toLocaleString('es-CO')
}

export function nombreCategoria(categorias, categoriaId) {
  return categorias.find((c) => c.id === categoriaId)?.nombre || ''
}