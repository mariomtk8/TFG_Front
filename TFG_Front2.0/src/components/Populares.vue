<template>
  <section class="populares">
    <h1>Recetas Populares</h1>
    <div v-if="filtradosStore.recetasPopulares.length > 0" class="recetas-container">
      <div v-for="receta in filtradosStore.recetasPopulares" :key="receta.idReceta" class="receta-card">
        <RouterLink :to="`/Recetas/${receta.idReceta}`">
          <img :src="receta.imagen" :alt="receta.nombre" class="receta-imagen" />
          <h2>{{ receta.nombre }}</h2>
        </RouterLink>
        <div class="stars">
          <!-- Estrellas llenas -->
          <svg v-for="n in Math.floor(receta.promedioVotos)" :key="`filled-${n}`" class="filled" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
            <path d="M10 15.25l-6.478 3.403 1.236-7.213L.246 6.328l7.24-.105L10 0l2.514 6.223 7.24.105-4.512 4.112 1.236 7.213z" />
          </svg>
          <!-- Estrella media si corresponde -->
          <svg v-if="receta.promedioVotos % 1 >= 0.5" class="half" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
            <path d="M10 15.25l-6.478 3.403 1.236-7.213L.246 6.328l7.24-.105L10 0l2.514 6.223 7.24.105-4.512 4.112 1.236 7.213z" />
          </svg>
          <!-- Estrellas vacías -->
          <svg v-for="n in 5 - Math.ceil(receta.promedioVotos)" :key="`empty-${n}`" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
            <path d="M10 15.25l-6.478 3.403 1.236-7.213L.246 6.328l7.24-.105L10 0l2.514 6.223 7.24.105-4.512 4.112 1.236 7.213z" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useFiltradosStore } from '../store/Filtrados';

const filtradosStore = useFiltradosStore();

onMounted(async () => {
  await filtradosStore.fetchRecetasPopulares();
});
</script>

<style scoped>
.populares {
  padding: 20px;
}

.recetas-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
}

.receta-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 10px; 
  width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.receta-card:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}


.receta-imagen {
  width: 100%;
  height: 150px; 
  object-fit: cover;
  border: 2px solid #ddd; 
  border-radius: 5px;
}

h1 {
  text-align: center;
}

.stars {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.stars .filled {
  color: #FFD700;
}

.stars .half {
  color: #FFD700;
}

.stars svg {
  color: #ccc;
}
</style>
