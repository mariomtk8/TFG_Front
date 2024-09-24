<template>
  <div>
    <h1>Recetas para {{ categoriaNombre }}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="recetas && recetas.length > 0">
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
          <img class="imagen-receta" v-if="receta.imagen" :src="receta.imagen" alt="Paso imagen" />
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

const route = useRoute();
const idCategoria = computed(()=>parseInt(route.params.idCategoria as string));
const categoriaNombre = route.query.categoriaNombre as string;

// Constante para acceder a las recetas
const recetas = ref<any[]>([]); // Inicializamos como un arreglo vacío

// Función para cargar recetas
const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null;
    const fetchedRecetas = await recetasStore.fetchRecetasPorCategoria(id);
    recetas.value = fetchedRecetas;
    console.log(recetas.value);
  } catch (error) {
    console.error('Error al cargar recetas:', error);
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.';
  }
};

onMounted(() => {
  cargarRecetas(idCategoria.value);
});

// watch(() => route.params.idCategoria, (newId) => {
//   const parsedId = parseInt(newId as string);
//   if (parsedId !== idCategoria.value) {
//     cargarRecetas(idCategoria.value);
//   }
// });
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
  cursor: pointer;
  transition: transform 0.2s;
  text-decoration: none;
}

.imagen-receta{
  max-width: 250px;
}

.receta-item:hover {
  transform: scale(1.02);
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
