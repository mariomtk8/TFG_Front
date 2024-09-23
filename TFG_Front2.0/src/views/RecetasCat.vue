<template>
  <div>
    <h1>Recetas para {{ categoriaNombre }}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="recetas.length > 0">
      <div class="recetas-grid">
        <RouterLink
          v-for="receta in recetas"
          :key="receta.idReceta"
          :to="{ name: 'Recetas', params: { id: receta.idReceta } }"
          class="receta-item"
        >
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/RecetasCat';

const errorMessage = ref<string | null>(null);
const recetasStore = useRecetasStore();
const { fetchRecetasPorCategoria } = recetasStore;

const route = useRoute();
const idCategoria = ref(parseInt(route.params.idCategoria as string));
const categoriaNombre = route.query.categoriaNombre as string;

// Constante para acceder a las recetas
const recetas = computed(() => recetasStore.recetas);

// Función para cargar recetas
const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null; 
    await fetchRecetasPorCategoria(id); 
  } catch (error) {
    console.error('Error al cargar recetas:', error);
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.';
  }
};

onMounted(() => {
  cargarRecetas(idCategoria.value);
});

watch(() => route.params.idCategoria, (newId) => {
  const parsedId = parseInt(newId as string);
  if (parsedId !== idCategoria.value) {
    idCategoria.value = parsedId;
    cargarRecetas(idCategoria.value);
  }
});
</script>

<style scoped>
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
  cursor: pointer; /* Cambia el cursor para indicar que es clickeable */
  transition: transform 0.2s;
  text-decoration: none;
}

.receta-item:hover {
  transform: scale(1.02); /* Añade un efecto al pasar el mouse */
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
