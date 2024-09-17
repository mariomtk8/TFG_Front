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
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useRecetasStore } from '../store/RecetasCat';
  
  const errorMessage = ref<string | null>(null); 
  
  const recetasStore = useRecetasStore();
  const { recetas, fetchRecetasPorCategoria } = recetasStore;
  
  const route = useRoute();
  const idCategoria = parseInt(route.params.idCategoria as string);
  const categoriaNombre = route.query.categoriaNombre as string;
  
  onMounted(async () => {
    try {
      await fetchRecetasPorCategoria(idCategoria);
    } catch (error) {
      console.error('Error al cargar recetas:', error); 
      errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.'; 
    }
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
  