<template>
    <div class="filtrar-container">
      <h2>Filtrar por Nivel de Dificultad</h2>
      <label class="checkbox-label">
        Orden ascendente:
        <input type="checkbox" v-model="ascendente" @change="cambiarOrden" />
      </label>
      <div class="recetas-grid">
        <div class="receta-card" v-for="receta in recetasPorNivel" :key="receta.idReceta">
          <img :src="receta.imagen" alt="Imagen de la receta" class="receta-imagen" />
          <h3 class="receta-nombre">{{ receta.nombre }}</h3>
          <p class="receta-atributo">Dificultad: {{ receta.nivelDificultad }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { useFiltradosStore } from '../store/Filtrados';
  
  export default defineComponent({
    setup() {
      const store = useFiltradosStore();
      const ascendente = ref(true);
  
      onMounted(() => {
        store.filtrarPorNivelDificultad(ascendente.value);
      });
  
      const cambiarOrden = () => {
        store.filtrarPorNivelDificultad(ascendente.value);
      };
  
      const recetasPorNivel = computed(() => store.recetasPorNivel);
  
      return {
        ascendente,
        cambiarOrden,
        recetasPorNivel
      };
    }
  });
  </script>
  
  
  <style scoped>
  .filtrar-container {
    text-align: center;
  }
  
  .checkbox-label {
    display: block;
    margin-bottom: 10px;
  }
  
  .recetas-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }
  
  .receta-card {
    width: 120px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
    background-color: #f9f9f9;
  }
  
  .receta-imagen {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .receta-nombre {
    font-size: 14px;
    margin: 5px 0;
  }
  
  .receta-atributo {
    font-size: 12px;
    color: #555;
  }
  </style>
  