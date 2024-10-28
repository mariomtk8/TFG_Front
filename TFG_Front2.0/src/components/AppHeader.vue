<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';
import { useCategoriasStore } from '../store/Categorias';
import { usePreferencias } from '../store/PrefsUser';
import { useRecetasStore } from '../store/Recetas'; 
import Recetas from '@/views/Recetas.vue';
import { useMenuSemanalStore } from '../store/MenuSemanal';

const loginStore = useLoginStore();
const router = useRouter();
const recetasStore = useRecetasStore(); 
const preferenciasStore = useMenuSemanalStore();

const isLoggedIn = computed(() => loginStore.usuario !== null);
const userName = computed(() => loginStore.usuario?.nombre || '');

const handleLogout = () => {
  loginStore.logout();
  router.push('/');
};

const categoriasStore = useCategoriasStore();
const categoriasComputed = computed(() => categoriasStore.categorias);

const searchQuery = ref(''); 
const searchResults = computed(() => recetasStore.resultadosBusqueda); 
const showDropdown = ref(false); 

const handleSearch = async () => {
  if (searchQuery.value.trim() === '') {
    recetasStore.resultadosBusqueda = []; 
    return;
  }
  
  try {
    await recetasStore.searchRecetas(searchQuery.value); 
    console.log(searchResults.value)
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  }
};
const checkMenuSemanal = async () => {
  const userId = loginStore.usuario?.idUsuario; // Cambia 'id' por 'idUsuario'
  if (!userId) return;

  try {
    const hasMenuSemanal = await preferenciasStore.hasMenuSemanal(userId);
    if (!hasMenuSemanal) {
      alert("No se encontraron menús para el usuario.");
      router.push('/PreferenciasUsuario');
    } else {
      router.push('/MenuSemanal');
    }
  } catch (error) {
    console.error("Error al verificar el menú semanal:", error);
    alert("Hubo un problema al verificar el menú semanal.");
  }
};

</script>

<template>
  <header>
    <div class="logo">
      <RouterLink to="/"><img src="../assets/Logo-design.png" alt="Logo"></RouterLink>
    </div>
    
    <nav>
      <ul>
        <li @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
          <a href="#">Categorías</a>
          <div v-if="showDropdown" class="dropdown" @mouseleave="showDropdown = false">
            <div class="dropdown-content">
              <ul>
                <li v-for="(categoria, index) in categoriasComputed" :key="index">
                  <RouterLink :to="{ name: 'RecetasCat', params: { idCategoria: categoria.idCategoria } }">
                    <img :src="categoria.icono" width="20" alt="Icono de la categoría" />
                    {{ categoria.nombreCategoria }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </li>
        
        <li v-if="isLoggedIn"><RouterLink to="/PreferenciasUsuario" class="nav__link">Seleccionar <br> Preferencias</RouterLink></li>
        <li style="cursor: pointer;" v-if="isLoggedIn"><a @click.prevent="checkMenuSemanal" class="nav__link">Menu</a></li>
        <li><a href="#">Contacto</a></li>
        <li><RouterLink to="/Favoritos" class="nav__link">Favoritos</RouterLink></li>
      </ul>
    </nav>

    <div class="search">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar..."
        @input="handleSearch"
      >
      <ul v-if="searchResults && searchResults.length > 0" class="search-results">
        <li v-for="(receta, index) in searchResults" :key="index">
          <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }">
            {{ receta.nombre }}
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="user-actions">
      <li><RouterLink v-if="!isLoggedIn" to="/Register" class="nav__link">Register</RouterLink></li>
      <li><RouterLink v-if="!isLoggedIn" to="/Login" class="nav__link">Login</RouterLink></li>

      <div v-if="isLoggedIn" class="logged-in-actions">
        <span>Bienvenido, {{ userName }}</span>
        <button @click="handleLogout" class="logout-button">Cerrar sesión</button>
      </div>
    </div>
  </header>
</template>


<style scoped>
header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFE5A2;
    padding: 35px 20px;
    position: relative; 
}

header .logo img {
    height: 100px;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0 20px;
    display: flex;
}

nav ul li {
    margin-right: 20px;
    position: relative; /* Asegura que el dropdown se posicione respecto a este elemento */
}

.user-actions {
    display: flex;
    flex-direction: column;
    margin-left: 5vh;
    flex-direction: row;
}

nav ul li a {
    text-decoration: none;
    color: black;
}

/* Estilos para el dropdown */
.dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Más sombra para mayor contraste */
    border-radius: 8px;
    z-index: 1000;
    width: 300px; /* Ancho fijo para mejor control */
}

/* Estilo de la lista del dropdown */
.dropdown-content {
  padding: 10px;
}

.dropdown ul {
  list-style: none;
    padding: 0;
    margin: 0;
    display: grid; /* Usar grid para un mejor control de columnas */
    grid-template-columns: repeat(2, 1fr); /* Dos columnas */
}

.dropdown li {
  padding: 10px; /* Espaciado para cada ítem */
    display: flex;
    align-items: center;
    cursor: pointer;
}

.dropdown li:hover {
    background-color: #f0f0f0; /* Color de fondo al pasar el ratón */
}

/* Estilo de los iconos en el dropdown */
.dropdown img {
    margin-right: 5px;
}

.search input[type="text"] {
    padding: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
}

.user-actions button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 10px;
}

.user-actions button:hover {
    text-decoration: underline;
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logout-button {
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.logout-button:hover {
    background-color: #d9363e;
}

.search {
  position: relative; /* Para permitir que el dropdown se posicione correctamente */
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px; /* Limitar la altura del dropdown de resultados */
  overflow-y: auto; /* Permitir el scroll si hay muchos resultados */
  z-index: 1000; /* Asegurarse de que esté por encima de otros elementos */
}

.search-results li {
  padding: 10px; /* Espaciado para cada ítem */
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f0f0f0; /* Color de fondo al pasar el ratón */
}
a{
  text-decoration: none;
}
</style>
