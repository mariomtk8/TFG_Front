<template>
    <div class="receta-container">
      <h1>{{ receta?.nombre }}</h1>
  
      <section v-if="receta" class="descripcion">
        <h2>Descripción</h2>
        <p>{{ receta.descripcion }}</p>
      </section>
  
      <div v-if="receta" class="receta-layout">
        <div class="receta-info">
          <img :src="receta.imagen" alt="Imagen de la receta" class="receta-imagen" />
  
          <div class="datos">
            <h3>Datos</h3>
            <p><strong>Nivel de dificultad:</strong> {{ receta.nivelDificultad }}</p>
            <p><strong>Tiempo de preparación:</strong> {{ receta.tiempoPreparacion }} min</p>
            <p><strong>Tipo de plato:</strong> Primer plato</p>
          </div>
        </div>
  
        <div class="receta-detalles">
          <section class="ingredientes">
            <h3>Ingredientes</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </section>
  
          <section class="pasos">
            <h3>Pasos</h3>
            <div v-for="(paso, index) in pasos" :key="index">
              <h4>{{ index + 1 }}º Paso</h4>
              <p>{{ paso }}</p>
            </div>
          </section>
        </div>
      </div>
  
      <aside class="sidebar">
        <section>
          <h3>Recetas relacionadas</h3>
          <div v-for="recetaRel in recetasRelacionadas" :key="recetaRel.idReceta">
            <p>{{ recetaRel.nombre }}</p>
          </div>
        </section>
  
        <section>
          <h3>Más populares</h3>
          <div v-for="popular in recetasPopulares" :key="popular.idReceta">
            <p>{{ popular.nombre }}</p>
          </div>
        </section>
      </aside>
  
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/Recetas';

// Importar la tienda de recetas
const recetasStore = useRecetasStore();

// Extraer datos y acciones desde la tienda
const { receta, errorMessage, fetchRecetaPorId } = recetasStore;

// Obtener el ID de la receta desde la ruta
const route = useRoute();
const recetaId = route.params.id;

// Constante para almacenar los pasos de la receta
const pasos = ref<string[]>([]);

// Función para cargar la receta y preparar los pasos
const cargarReceta = async (id: number) => {
  await fetchRecetaPorId(id);
  if (receta.value) {
    // Dividir las instrucciones en pasos (asumiendo que vienen separadas por saltos de línea)
    pasos.value = receta.value.instrucciones.split('\n');
  }
};

// Ejecutar la carga de la receta cuando se monte el componente
onMounted(() => {
  cargarReceta(Number(recetaId));
});
</script>
<style scoped>
.receta-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.descripcion {
  margin-bottom: 20px;
}

.receta-layout {
  display: flex;
  gap: 20px;
}

.receta-info {
  flex: 1;
}

.receta-imagen {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.datos {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.receta-detalles {
  flex: 2;
}

.ingredientes,
.pasos {
  margin-top: 20px;
}

.pasos div {
  margin-bottom: 10px;
}

.sidebar {
  flex: 1;
  margin-left: 20px;
}

.sidebar section {
  margin-bottom: 30px;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
  