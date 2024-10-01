<template>
  <div>
    <h1>Recetas de {{ categoriaNombre }}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="recetas && recetas.length > 0">
      <div class="recetas-grid">
        <RouterLink
          v-for="receta in recetas"
          :key="receta.idReceta"
          :to="{ name: 'Recetas', params: { id: receta.idReceta } }"
          class="receta-item"
        >
          <img class="imagen-receta" v-if="receta.imagen" :src="receta.imagen" alt="Imagen de la receta" />
          <h3>{{ receta.nombre }}</h3>
          <p>{{ receta.descripcion }}</p>
          <span class="etiqueta">{{ receta.esVegano ? 'Vegano' : 'No Vegano' }}</span>
          <span class="etiqueta">Dificultad: {{ receta.nivelDificultad }}</span>
          <span class="etiqueta">Tiempo: {{ receta.tiempoPreparacion }} min</span>
        </RouterLink>
      </div>
    </div>

    <div v-else>
      <p>No hay recetas disponibles para esta categoría.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/RecetasCat';

const errorMessage = ref<string | null>(null);
const recetasStore = useRecetasStore();

const route = useRoute();
const idCategoria = computed(() => parseInt(route.params.idCategoria as string));
const categoriaNombre = ref<string | null>(null);

// Constante para acceder a las recetas
const recetas = ref<any[]>([]); // Inicializamos como un arreglo vacío

// Función para cargar recetas
const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null;
    const fetchedRecetas = await recetasStore.fetchRecetasPorCategoria(id);
    recetas.value = fetchedRecetas;
    console.log(recetas.value);

    // Obtener el nombre de la categoría
    categoriaNombre.value = await recetasStore.fetchNombreCategoria(id);
  } catch (error) {
    console.error('Error al cargar recetas:', error);
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.';
  }
};

onMounted(() => {
  cargarRecetas(idCategoria.value);
});
</script>

<style scoped>

h1 {
  margin-top: 5vh;
  margin-left: 15vh;
  margin-bottom: 5vh;
}
.recetas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.receta-item {
  padding: 16px;
  border: 1px solid #ddd;
  color: black;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  text-decoration: none;
  background: #fff; /* Fondo blanco para las tarjetas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave para las tarjetas */
}

.imagen-receta {
  max-width: 100%;
  border-radius: 8px; /* Bordes redondeados para la imagen */
}

.receta-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada al hacer hover */
}

.error {
  color: red;
  margin-top: 20px;
}
.etiqueta {
  display: inline-block;
  margin-top: 5px;
  background-color: #f2f2f2; /* Fondo gris claro para las etiquetas */
  border-radius: 4px; /* Bordes redondeados para las etiquetas */
  padding: 4px 8px; /* Espaciado interno para las etiquetas */
}
</style>
