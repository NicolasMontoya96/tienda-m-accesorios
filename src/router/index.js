import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/producto/:id', name: 'producto', component: () => import('../views/ProductoDetalleView.vue') },
    { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue') },
    { path: '/pedido/:referencia', name: 'confirmacion', component: () => import('../views/ConfirmacionView.vue') },
  ],
})

export default router