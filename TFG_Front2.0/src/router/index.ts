import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import Index from '../views/index.vue';
import RecetasCat from '../views/RecetasCat.vue';
import Recetas from '../views/Recetas.vue';
import Login from '../views/login.vue';
import Register from '../views/Register.vue';
import PanelAdmin from '../views/PanelAdmin.vue';
import { useLoginStore } from '../store/Login';
import Favoritos from '../views/Favoritos.vue';
import PreferenciasUsuario from '../views/PreferenciasUsuario.vue';
import Contactanos from '../views/Contactanos.vue';
import MenuSemanal from '../views/MenuSemanal.vue';
import PortadaIndex from '../components/PortadaIndex.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'index', component: Index },
    { path: '/RecetasCat/:idCategoria', name: 'RecetasCat', component: RecetasCat },
    { path: '/Recetas/:id', name: 'Recetas', component: Recetas },
    { path: '/Recetas/:id', name: 'RecetasPort', component: PortadaIndex },
    { path: '/Contactanos', name: 'Contactanos', component: Contactanos },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    { path: '/MenuSemanal', 
      name: 'MenuSemanal', 
      component: MenuSemanal,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (!loginStore.usuario) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Necesitas iniciar sesión para acceder tu menú semanal',
            confirmButtonText: 'Aceptar'
          })
        } else {
          next(); 
        }
      },
    },
    { path: '/Favoritos', 
      name: 'Favoritos', 
      component: Favoritos,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (!loginStore.usuario) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Necesitas iniciar sesión para utilizar esta funcion',
            confirmButtonText: 'Aceptar'
          })
        } else {
          next(); 
        }
      },
    },
    {
      path: '/PreferenciasUsuario',
      name: 'PreferenciasUsuario',
      component: () => import('@/views/PreferenciasUsuario.vue'),
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (!loginStore.usuario) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Necesitas iniciar sesión para poder crear tu menú semanal',
            confirmButtonText: 'Aceptar'
          })
        } else {
          next(); 
        }
      },
    },
    {
      path: '/PanelAdmin',
      name: 'PanelAdmin',
      component: PanelAdmin,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (loginStore.rol) {
          next();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Inicia sesión como administrador para acceder a esta página',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            next('/Login'); 
          });
        }
      },
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
