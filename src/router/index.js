import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // Si el usuario usa "atrás/adelante" del navegador, respeta dónde estaba.
    // Para cualquier otra navegación (link, búsqueda, etc.), sube al inicio.
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Inicio' } },
    { path: '/producto/:id', name: 'producto', component: () => import('../views/ProductoDetalleView.vue'), meta: { title: 'Producto' } },
    { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue'), meta: { title: 'Mi carrito' } },
    { path: '/favoritos', name: 'favoritos', component: () => import('../views/FavoritosView.vue'), meta: { title: 'Mis favoritos' } },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { title: 'Finalizar compra' } },
    { path: '/pedido/:referencia', name: 'confirmacion', component: () => import('../views/ConfirmacionView.vue'), meta: { title: 'Estado de tu pedido' } },
    { path: '/politica-de-datos', name: 'politica-datos', component: () => import('../views/PoliticaDatosView.vue'), meta: { title: 'Política de tratamiento de datos' } },
    { path: '/consultar-pedido', name: 'consultar-pedido', component: () => import('../views/ConsultarPedidoView.vue'), meta: { title: 'Consultar mi pedido' } },
    { path: '/buscar', name: 'buscar', component: () => import('../views/BuscarView.vue'), meta: { title: 'Buscar productos' } },
    { path: '/terminos-y-condiciones', name: 'terminos', component: () => import('../views/TerminosCondicionesView.vue'), meta: { title: 'Términos y condiciones' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Página no encontrada' } },
  ],
})

// Título dinámico de la pestaña. La vista de producto lo sobreescribe
// con el nombre real una vez que carga (ver ProductoDetalleView.vue).
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — M Accesorios`
    : 'M Accesorios'
})

export default router