import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/index.vue';
import RecetasCat from '../views/RecetasCat.vue';
import Recetas from '../views/Recetas.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/RecetasCat/:idCategoria', name: 'RecetasCat', component: RecetasCat },
    { path: '/Recetas/:id', name: 'Recetas', component: Recetas}
  ],
});

export default router;
