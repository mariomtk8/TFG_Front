<script setup lang="ts">
import { computed } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';

// Importar el store
const loginStore = useLoginStore();
const router = useRouter(); // Obtener acceso al router

// Computar si el usuario está logueado
const isLoggedIn = computed(() => loginStore.usuario !== null);

// Obtener el nombre del usuario si está logueado
const userName = computed(() => loginStore.usuario?.nombre || '');

// Método para cerrar sesión
const handleLogout = () => {
  loginStore.logout();
  router.push('/'); // Redirigir a la página de inicio al cerrar sesión
};
</script>

<template>
  <header>
    <div class="logo">
      <img src="../assets/Logo-design.png" alt="Logo"> 
    </div>
    
    <nav>
      <ul>
        <li><a href="#">Categorías</a></li>
        <li><a href="#">Menus</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>

    <div class="search">
      <input type="text" placeholder="Buscar...">
    </div>

    <div class="user-actions">
      <!-- Mostrar si no está logueado -->
      <RouterLink v-if="!isLoggedIn" to="/Register" class="nav__link">Register</RouterLink>
      <RouterLink v-if="!isLoggedIn" to="/Login" class="nav__link">Login</RouterLink>

      <!-- Mostrar si está logueado -->
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
}

header .logo img {
    height: 50px;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0 20px;
    display: flex;
}

nav ul li {
    margin-right: 20px;
}

.user-actions{
    display: flex;
    flex-direction: column;
    margin-left: 5vh;
}

nav ul li a {
    text-decoration: none;
    color: black;
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
</style>
