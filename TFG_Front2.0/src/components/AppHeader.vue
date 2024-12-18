<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">
        <RouterLink to="/"><img src="../assets/Logo-design.png" alt="Logo" /></RouterLink>
      </div>

      <!-- Botón de menú hamburguesa para pantallas pequeñas -->
      <button class="header__toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
        ☰
      </button>

      <!-- Menú de navegación con condicional para pantallas pequeñas -->
      <nav :class="['header__nav', { 'header__nav--open': isMobileMenuOpen }]">
        <ul class="header__nav-list">
          <li class="header__nav-item" @mouseover="showCategoryDropdown = true"
            @mouseleave="showCategoryDropdown = false">
            <a href="#" class="header__nav-link">{{ $t('header.categories') }}</a>
            <div v-if="showCategoryDropdown" class="header__dropdown">
              <div class="header__dropdown-content">
                <ul>
                  <li v-for="(categoria, index) in categoriasComputed" :key="index" class="header__dropdown-item">
                    <RouterLink :to="{ name: 'RecetasCat', params: { idCategoria: categoria.idCategoria } }"
                      @click.prevent="handleCategoryClick">
                      <img :src="categoria.icono" width="20" alt="Icono de la categoría" />
                      {{ categoria.nombreCategoria }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="header__nav-item">
            <RouterLink to="/PreferenciasUsuario" class="header__nav-link">{{ $t('header.preferences') }}</RouterLink>
          </li>
          <li class="header__nav-item">
            <a @click.prevent="checkMenuSemanal" class="header__nav-link">{{ $t('header.weeklyMenu') }}</a>
          </li>
          <li class="header__nav-item">
            <RouterLink to="/Contactanos" class="header__nav-link">{{ $t('header.contact') }}</RouterLink>
          </li>
          <li class="header__nav-item">
            <RouterLink to="/Favoritos" class="header__nav-link">{{ $t('header.favorites') }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="header__search">
        <input type="text" v-model="searchQuery" placeholder="Buscar..." @input="handleSearch" @keyup.esc="clearSearch"
          class="header__search-input" />
        <ul v-if="showSearchResults && searchResults.length" class="header__search-results">
          <li v-for="(receta, index) in searchResults" :key="index" class="header__search-item">
            <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }" @click.prevent="handleRecipeClick">
              {{ receta.nombre }}
            </RouterLink>

          </li>
        </ul>
      </div>

      <div class="header__user-actions">
        <RouterLink v-if="!isLoggedIn" to="/Register" class="header__user-link">{{ $t('header.register') }}</RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/Login" class="header__user-link">{{ $t('header.login') }}</RouterLink>

        <div v-if="isLoggedIn" class="header__logged-in">
          <span class="header__username">{{ $t('header.welcome') }}, {{ userName }}</span>
          <button @click="handleLogout" class="header__logout-button">{{ $t('header.logout') }}</button>
          <button 
        v-if="isAdmin" 
        @click="goToPanelAdmin" 
        class="header__logout-button"
      >
        {{ $t('header.adminPanel') }}
      </button>
        </div>
      </div>
      <div class="language-switcher">
      <button class="Español" @click="changeLanguage('es')">Español</button>
      <button class="Ingles" @click="changeLanguage('en')">English</button>
    </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useCategoriasStore } from '../store/Categorias';
import { useRecetasStore } from '../store/Recetas';
import { useMenuSemanalStore } from '../store/MenuSemanal';
import { useI18n } from 'vue-i18n';


const { locale } = useI18n();
const changeLanguage = (lang: string) => {
  locale.value = lang;
};

const loginStore = useLoginStore();
const router = useRouter();
const recetasStore = useRecetasStore();
const preferenciasStore = useMenuSemanalStore();

const isLoggedIn = computed(() => loginStore.usuario !== null);
const userName = computed(() => loginStore.usuario?.nombre || '');
const isAdmin = computed(() => loginStore.rol)

const handleLogout = () => {
  const loginStore = useLoginStore();
  const router = useRouter();

  loginStore.logout(); 
    window.location.reload();  
};

const categoriasStore = useCategoriasStore();
const categoriasComputed = computed(() => categoriasStore.categorias);

const searchQuery = ref('');
const searchResults = computed(() => recetasStore.resultadosBusqueda);
const showCategoryDropdown = ref(false);
const showSearchResults = ref(false);
const isMobileMenuOpen = ref(false); 

const goToPanelAdmin = () => {
  const userRole = loginStore.rol; 

  if (userRole) {
    router.push('/PanelAdmin'); //
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'Solo los administradores pueden acceder a esta página.',
      confirmButtonText: 'Aceptar'
    });
  }
};

const handleCategoryClick = (e: Event) => {
  e.preventDefault();
 
  const idCategoria = (e.target as HTMLElement).getAttribute('data-id');
  if (idCategoria) {
    router.push({ name: 'RecetasCat', params: { idCategoria } });
  }
};

const handleRecipeClick = (e: Event) => {
  e.preventDefault();
  
  const recetaId = (e.target as HTMLElement).getAttribute('data-id');
  if (recetaId) {
    router.push({ name: 'Recetas', params: { id: recetaId } });
  }
};



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
const clearSearch = () => {
  searchQuery.value = '';
  showSearchResults.value = false;
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
.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 20px;
}

.language-switcher button {
  padding: 6px 12px;
  background-color: #FF8A5C;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  width: 100px; 
}

.language-switcher button:hover {
  background-color: #d96b45;
}
.header {
  background-color: #fee3a0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
}

.header__content {
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 1500px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.header__logo img {
  max-width: 120px;
}

.header__toggle {
  display: none;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4A4A4A;
}

.header__nav {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 15px;
}

.header__nav-list {
  display: flex;
  gap: 15px;
  list-style: none;
}

.header__nav--open {
  display: block;
}

.header__nav-item {
  position: relative;
}

.header__nav-link {
  text-decoration: none;
  color: #4A4A4A;
  font-weight: bold;
  cursor: pointer;
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
  padding: 10px;
  border: 2px solid #FF8A5C;
  border-radius: 20px;
  width: 200px;
  margin-right: 10vh;
}

.header__search-results {
  position: absolute;
  top: 100%;
  width: 60%;
  left: 0;
  background: #FFE5A2;
  border: 1px solid #ccc;
  border-radius: 20px;
  max-height: 200px;
  overflow-y: auto;
  width: 75%;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  list-style: none;
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
.header__logout-button {
  background-color: #FF8A5C;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 5px ;
}

.header__logout-button:hover {
  background-color: #d96b45;
}
.header__username{
  margin-right: 10px;
}
@media (max-width: 1568px) {
  .header__toggle {
    display: block;
  }
  .header__nav {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: #FFE5A2;
  }
  .header__nav-list{
    flex-direction: column;
  }
  .header__nav--open {
    display: flex;
  }
  .header__user-link{
    margin-top: 15px;
  }
  .header__search-input{
    margin: 10px;
  }
  .header__logged-in{
    margin: 10px;
  }
}

@media (max-width: 768px) {
  .header__toggle {
    display: block;
  }
  .header__nav {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: #FFE5A2;
  }
  .header__nav-list{
    flex-direction: column;
  }
  .header__nav--open {
    display: flex;
    font-size: 0.75em;
  }
  .header__user-link{
    margin-top: 15px;
  }
  .header__search-input{
    margin: 10px;
  }
  .header__logged-in{
    margin: 10px;
  }
}
</style>
