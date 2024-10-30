<template>
  <div class="receta-container">
    <h1 class="receta-titulo">{{ receta?.nombre }}</h1>

    <section v-if="receta" class="receta__descripcion">
      <h2>Descripción</h2>
      <p>{{ receta.descripcion }}</p>
    </section>

    <div class="receta__layout">
      <div class="receta__info">
        <h3>Detalles de la receta</h3>
        <p><strong>Dificultad:</strong> {{ receta?.nivelDificultad }}</p>
        <p><strong>Preparación:</strong> {{ receta?.tiempoPreparacion }} min</p>
        <p><strong>Tipo:</strong> Primer plato</p>
      </div>

      <section class="receta__ingredientes">
        <h3>Ingredientes</h3>
        <ul>
          <li v-for="ingrediente in ingredientes" :key="ingrediente.idIngrediente" class="ingrediente">
            <p><strong>{{ ingrediente.nombreIngrediente }}</strong> - {{ ingrediente.cantidad }} {{ ingrediente.unidadMedida }}</p>
          </li>
        </ul>
      </section>

      <section class="receta__pasos">
        <h3>Pasos</h3>
        <div v-for="paso in pasos" :key="paso.idPaso" class="paso">
          <h4>{{ paso.numero }}º Paso</h4>
          <p>{{ paso.descripcion }}</p>
          <img v-if="paso.imagenUrl" :src="paso.imagenUrl" alt="Imagen del paso" class="paso__imagen"/>
        </div>
      </section>

      <aside class="receta__sidebar">
        <h3>Recetas Populares</h3>
        <Populares />
      </aside>
    </div>
    <Votaciones />
    <Comentarios />
  </div>
</template>
<script setup lang="ts">
import Comentarios from '../components/Comentarios.vue';
import Votaciones from '../components/Votaciones.vue';
import Populares from './Populares.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/Recetas';

const recetasStore = useRecetasStore();
const receta = computed(() => recetasStore.recetaActual);
const ingredientes = computed(() => recetasStore.ingredientes.map(ingrediente => ({ ...ingrediente, mostrarDetalles: false })));
const pasos = computed(() => recetasStore.pasos);
const route = useRoute();
const recetaId = route.params.id ? Number(route.params.id) : null;

const cargarReceta = async (id: number) => {
  await recetasStore.fetchRecetaPorId(id);
  await recetasStore.fetchIngredientesPorRecetaId(id);
};

onMounted(() => {
  if (recetaId !== null && !isNaN(recetaId)) {
    cargarReceta(recetaId);
  } else {
    console.error('ID de receta no válido');
  }
});
</script>
<style scoped>
.receta-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.receta-titulo {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.receta__descripcion {
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.6;
}

.receta__layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.receta__info,
.receta__ingredientes,
.receta__pasos {
  
  padding: 15px;
  border-radius: 8px;
  
}

.receta__info h3,
.receta__ingredientes h3,
.receta__pasos h3 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #4CAF50;
}

.ingrediente {
  font-size: 1rem;
  color: #333;
  padding: 5px 0;
}

.paso {
  margin-bottom: 15px;
}

.paso__imagen {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-top: 10px;
}

.receta__sidebar {
  position: sticky;
  top: 20px;
}

.receta__sidebar h3 {
  font-size: 1.5rem;
  color: #4CAF50;
  text-align: center;
  margin-bottom: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
