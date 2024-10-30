<template>
    <div>
      <h1>Recetas de {{ categoriaNombre }}</h1>
  
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  
      <div class="recetas-container" v-if="recetas && recetas.length > 0">
        <div class="recetas-grid">
          <div v-for="receta in recetas" :key="receta.idReceta" class="receta-item">
            <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }"
          class="receta-link"
        >
            <img class="imagen-receta" v-if="receta.imagen" :src="receta.imagen" alt="Imagen de la receta" />
            <h3>{{ receta.nombre }}</h3>
            <p>{{ receta.descripcion }}</p>
            <span class="etiqueta">{{ receta.esVegano ? 'Vegano' : 'No Vegano' }}</span>
            <span class="etiqueta">Dificultad: {{ receta.nivelDificultad }}</span>
            <span class="etiqueta">Tiempo: {{ receta.tiempoPreparacion }} min</span>
        </RouterLink>
            <!-- Botón para agregar/eliminar de favoritos -->
            <button
              @click="toggleFavorito(receta.idReceta)"
              :class="{ 'favorito-guardado': esFavorito(receta.idReceta) }"
              class="favorito-btn"
            >
              <img
                v-if="esFavorito(receta.idReceta)"
                src="https://ik.imagekit.io/Mariocanizares/Recetas/guardado.webp?updatedAt=1729154857401"
                alt="Eliminar de favoritos"
              />
              <img
                v-else
                src="https://ik.imagekit.io/Mariocanizares/Recetas/guardado.webp?updatedAt=1729154857401"
                alt="Agregar a favoritos"
              />
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
  import { useRecetasStore } from '../store/RecetasCat';
  import { useFavoritosStore } from '../store/Favoritos';
  
  const errorMessage = ref<string | null>(null);
  const recetasStore = useRecetasStore();
  const favoritosStore = useFavoritosStore();
  
  const route = useRoute();
  const idCategoria = computed(() => parseInt(route.params.idCategoria as string));
  const categoriaNombre = ref<string | null>(null);
  
  const recetas = ref<any[]>([]);
  
  // Función para cargar recetas
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
    try {
      if (esFavorito(recetaId)) {
        // Si ya es favorito, eliminarlo
        const favorito = favoritosStore.recetasFavoritas.find((f: any) => f.idReceta === recetaId);
        if (favorito) {
          await favoritosStore.eliminarFavorito(favorito.idFavorito);
        }
      } else {
        // Si no es favorito, agregarlo
        await favoritosStore.agregarFavorito(recetaId);
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
    }
  };
  
  // Función para verificar si una receta está en favoritos
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
  }

  
  .recetas-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
  }
  a{
    text-decoration: none;
    color: black;
  }
  
  .recetas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 5fr));
    gap: 16px;
    justify-items: center;
  }
  
  .receta-item {
    position: relative;
    padding: 16px;
    border: 1px solid #ddd;
    color: black;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    text-decoration: none;
    max-width: 300px;
  }
  
  .imagen-receta {
    width: 100%;
    border-radius: 8px;
  }
  
  .receta-item:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .favorito-btn {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  
  .favorito-btn img {
    width: 24px;
    height: 24px;
  }
  
  .favorito-guardado {
    background-color: yellow;
  }
  
  .etiqueta {
    display: inline-block;
    margin-top: 5px;
    background-color: #f2f2f2;
    border-radius: 4px;
    padding: 4px 8px;
  }
  </style>
  