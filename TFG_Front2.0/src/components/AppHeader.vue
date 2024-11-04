<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">
        <RouterLink to="/"><img src="../assets/Logo-design.png" alt="Logo" /></RouterLink>
      </div>
      
      <nav class="header__nav">
        <ul class="header__nav-list">
          <li class="header__nav-item" @mouseover="showCategoryDropdown = true" @mouseleave="showCategoryDropdown = false">
            <a href="#" class="header__nav-link">Categorías</a>
            <div v-if="showCategoryDropdown" class="header__dropdown">
              <div class="header__dropdown-content">
                <ul>
                  <li v-for="(categoria, index) in categoriasComputed" :key="index" class="header__dropdown-item">
                    <RouterLink :to="{ name: 'RecetasCat', params: { idCategoria: categoria.idCategoria } }">
                      <img :src="categoria.icono" width="20" alt="Icono de la categoría" />
                      {{ categoria.nombreCategoria }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="header__nav-item" >
            <RouterLink to="/PreferenciasUsuario" class="header__nav-link">Preferencias</RouterLink>
          </li>
          <li class="header__nav-item" >
            <a @click.prevent="checkMenuSemanal" class="header__nav-link">Menú Semanal</a>
          </li>
          <li class="header__nav-item"><a href="#" class="header__nav-link">Contacto</a></li>
          <li class="header__nav-item"><RouterLink to="/Favoritos" class="header__nav-link">Favoritos</RouterLink></li>
        </ul>
      </nav>

      <div class="header__search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar..."
          @input="handleSearch"
          class="header__search-input"
        />
        <ul v-if="showSearchResults && searchResults.length" class="header__search-results">
          <li v-for="(receta, index) in searchResults" :key="index" class="header__search-item">
            <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }">
              {{ receta.nombre }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="header__user-actions">
        <RouterLink v-if="!isLoggedIn" to="/Register" class="header__user-link">Register</RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/Login" class="header__user-link">Login</RouterLink>

        <div v-if="isLoggedIn" class="header__logged-in">
          <span class="header__username">Bienvenido, {{ userName }}</span>
          <button @click="handleLogout" class="header__logout-button">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </header>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';
import { useCategoriasStore } from '../store/Categorias';
import { useRecetasStore } from '../store/Recetas';
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
const showCategoryDropdown = ref(false);
const showSearchResults = ref(false);

const handleSearch = async () => {
  if (searchQuery.value.trim() === '') {
    recetasStore.resultadosBusqueda = [];
    showSearchResults.value = false;
    return;
  }
  try {
    await recetasStore.searchRecetas(searchQuery.value);
    showSearchResults.value = true;
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  }
};

const checkMenuSemanal = async () => {
  const userId = loginStore.usuario?.idUsuario;
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

<style scoped>
.header {
  background-color: #FFE5A2;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.header__content {
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  flex-wrap: wrap; 
  justify-content: flex-start;
}

.header__content--right {
  justify-content: flex-end;
}

.header__logo img {
  height: 90px;
}

.header__nav {
  list-style: none;
  padding: 0;
  margin: 0 40px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header__nav-list {
  list-style: none;
  display: flex;
  gap: 15px;
  padding: 0;
  margin: 0;
}

.header__nav-item {
  position: relative;
}

.header__nav-link {
  text-decoration: none;
  color: #4A4A4A;
  font-weight: bold;
}

.header__dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FFF3D1;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1000;
  width: 300px;
}

.header__dropdown-content ul{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.header__dropdown-content li{
  padding: 8px;
  display: flex;
  align-items: center;
}
.header__dropdown-content li:hover{
  background-color: #FFD9A4;
}


.header__dropdown-item {
  padding: 8px;
  display: flex;
  align-items: center;
}

.header__dropdown-item:hover {
  background-color: #FFD9A4;
}

.header__search {
  position: relative;
}

.header__search-input {
  padding: 8px;
  border: 2px solid #FF8A5C;
  border-radius: 8px;
  width: 160px;
  margin-right: 10vh;
}

.header__search-results {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
}

.header__search-item {
  padding: 8px;
}

.header__search-item:hover {
  background-color: #FFD9A4;
}

.header__user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__user-link {
  text-decoration: none;
  color: #4A4A4A;
  font-weight: bold;
}

.header__logged-in {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 20px;
}

.header__username {
  margin-right: 10px;
  color: #4A4A4A;
}

.header__logout-button {
  background-color: #FF8A5C;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.header__logout-button:hover {
  background-color: #d96b45;
}

/* Responsive para móvil */
@media (max-width: 844px) {
  .header__content {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .header__nav-list {
    flex-direction: column;
    gap: 10px;
  }

  .header__search-input {
    width: 100%;
  }

  .header__dropdown {
    width: 200px;
  }
}
</style>