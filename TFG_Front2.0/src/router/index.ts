import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/index.vue';
import RecetasCat from '../views/RecetasCat.vue';
import Recetas from '../views/Recetas.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import PanelAdmin from '../views/PanelAdmin.vue';
import { useLoginStore } from '../store/Login';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/RecetasCat/:idCategoria', name: 'RecetasCat', component: RecetasCat },
    { path: '/Recetas/:id', name: 'Recetas', component: Recetas },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    {
      path: '/PanelAdmin',
      name: 'PanelAdmin',
      component: PanelAdmin,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (loginStore.rol) {
          next();
        } else {
          next('/Login');
        }
      }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();
  if (to.path === '/PanelAdmin' && !loginStore.rol) {
    next('/Login');
  } else {
    next();
  }
});

export default router;
