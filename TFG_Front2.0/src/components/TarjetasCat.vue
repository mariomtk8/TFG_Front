<template>
  <div>
    <h1>Recetas de {{ categoriaNombre }}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div class="recetas-container" v-if="recetas && recetas.length > 0">
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta.idReceta" class="receta-item">
          <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }" class="receta-link">
            <img class="imagen-receta" v-if="receta.imagen" :src="receta.imagen" alt="Imagen de la receta" />
            <h3>{{ receta.nombre }}</h3>
            <p>{{ receta.descripcion }}</p>
            <span class="etiqueta">{{ receta.esVegano ? 'Vegano' : 'No Vegano' }}</span>
            <span class="etiqueta">Dificultad: {{ receta.nivelDificultad }}</span>
            <span class="etiqueta">Tiempo: {{ receta.tiempoPreparacion }} min</span>
          </RouterLink>

          <!-- Botón de favoritos -->
          <button
            @click="toggleFavorito(receta.idReceta)"
            :class="{ 'favorito-guardado': esFavorito(receta.idReceta) }"
            class="favorito-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              :fill="esFavorito(receta.idReceta) ? 'yellow' : 'gray'"
              width="24"
              height="24"
            >
            <path d="M30 2C4.9 2 4 2.9 4 4v16c0 .3.1.6.4.8.2.1.5.2.7.1l6.9-3.1 6.9 3.1c.1.1.3.1.5.1s.4-.1.5-.1c.3-.2.4-.5.4-.8V4c0-1.1-.9-2-2-2H6zm0 2h12v13.5l-6-2.7-6 2.7V4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No hay recetas disponibles en esta categoría.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useRecetasStore } from '../store/RecetasCat';
import { useFavoritosStore } from '../store/Favoritos';
import { useLoginStore } from '../store/Login';

const errorMessage = ref<string | null>(null);
const recetasStore = useRecetasStore();
const favoritosStore = useFavoritosStore();
const loginStore = useLoginStore();
const route = useRoute();
const idCategoria = computed(() => parseInt(route.params.idCategoria as string));
const categoriaNombre = ref<string | null>(null);

const recetas = ref<any[]>([]);

const isLoggedIn = computed(() => loginStore.usuario !== null);

const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null;
    const fetchedRecetas = await recetasStore.fetchRecetasPorCategoria(id);
    recetas.value = fetchedRecetas;
    categoriaNombre.value = await recetasStore.fetchNombreCategoria(id);
  } catch (error) {
    console.error('Error al cargar recetas:', error);
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.';
  }
};

// Función para agregar o eliminar de favoritos
const toggleFavorito = async (recetaId: number) => {
  if (!isLoggedIn.value) {
    Swal.fire({
      icon: 'warning',
      title: '¡Necesitas iniciar sesión!',
      text: 'Inicia sesión para guardar recetas en tus favoritos.',
    });
    return;
  }

  try {
    if (esFavorito(recetaId)) {
      const favorito = favoritosStore.recetasFavoritas.find((f: any) => f.idReceta === recetaId);
      if (favorito) {
        await favoritosStore.eliminarFavorito(favorito.idFavorito);
      }
    } else {
      await favoritosStore.agregarFavorito(recetaId);
    }
  } catch (error) {
    console.error('Error al gestionar favorito:', error);
  }
};

const esFavorito = (recetaId: number) => {
  return favoritosStore.recetasFavoritas.some((favorito: any) => favorito.idReceta === recetaId);
};

onMounted(() => {
  cargarRecetas(idCategoria.value);
  favoritosStore.obtenerFavoritos();
});
</script>

<style scoped>
h1 {
  margin-top: 5vh;
  margin-left: 15vh;
  margin-bottom: 5vh;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.recetas-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
a {
  text-decoration: none;
  color: inherit;
}

.recetas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-items: center;
}

.receta-item {
  position: relative;
  padding: 16px;
  border: 1px solid #ddd;
  color: #444;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  max-width: 300px;
}

.imagen-receta {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
}

.receta-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.favorito-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorito-btn:hover {
  transform: scale(1.1);
}

.favorito-guardado svg {
  fill: yellow;
}

.etiqueta {
  display: inline-block;
  margin-top: 5px;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 4px 8px;
  color: #333;
  font-weight: 600;
}
@media (max-width: 600px) {
  /* Reduce icon size for mobile */
  .favorito-icon {
    width: 20px;
    height: 20px;
  }
  .receta-item{
    max-width: 200px;
  }
  .imagen-receta{
    max-width: 200px;
  }
}
</style>
