<template>
  <div>
    <h1>Recetas para {{ categoriaNombre }}</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div> <!-- Mostrar el error -->
    
    <div v-if="recetas.length > 0">
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta.idReceta" class="receta-item">
          <h3>{{ receta.nombre }}</h3>
          <p>{{ receta.descripcion }}</p>
          <span class="etiqueta">{{ receta.esVegano ? 'Vegano' : 'No Vegano' }}</span>
          <span class="etiqueta">Dificultad: {{ receta.nivelDificultad }}</span>
          <span class="etiqueta">Tiempo: {{ receta.tiempoPreparacion }} min</span>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No hay recetas disponibles para esta categoría.</p> <!-- Mostrar mensaje si no hay recetas -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/RecetasCat';

// Variables para el manejo de errores y recetas
const errorMessage = ref<string | null>(null); 

// Obtener el store de recetas
const recetasStore = useRecetasStore();
const { recetas, fetchRecetasPorCategoria } = recetasStore;

// Obtener la ruta y parámetros
const route = useRoute();
const idCategoria = ref(parseInt(route.params.idCategoria as string));
const categoriaNombre = route.query.categoriaNombre as string;

// Función para cargar recetas
const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null; // Limpiar cualquier mensaje de error anterior
    await fetchRecetasPorCategoria(id); // Llamada para obtener las recetas
  } catch (error) {
    console.error('Error al cargar recetas:', error); 
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.'; 
  }
};

// Cargar las recetas al montar el componente
onMounted(() => {
  cargarRecetas(idCategoria.value);
});

// Si el parámetro de la ruta cambia, recargar las recetas
watch(() => route.params.idCategoria, (newId) => {
  idCategoria.value = parseInt(newId as string);
  cargarRecetas(idCategoria.value);
});
</script>

<style scoped>
.recetas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.receta-item {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
}

.etiqueta {
  display: inline-block;
  background-color: #eee;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  font-size: 12px;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
