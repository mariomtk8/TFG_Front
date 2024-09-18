import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/index.vue';
import RecetasCat from '../views/RecetasCat.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/RecetasCat/:idCategoria', name: 'RecetasCat', component: RecetasCat },
  ],
});

export default router;
