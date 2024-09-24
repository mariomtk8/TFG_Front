<template>
  <div class="receta-container">
    <h1>{{ receta?.nombre }}</h1>

    <section v-if="receta" class="descripcion">
      <h2>Descripción</h2>
      <p>{{ receta.descripcion }}</p>
    </section>

    <div v-if="receta" class="receta-layout">
      <div class="receta-info">
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
          <ul>
            <li v-for="ingrediente in ingredientes" :key="ingrediente.idIngrediente">
              <p><strong>Nombre:</strong> {{ ingrediente.nombreIngrediente }}</p>
              <p><strong>Cantidad:</strong> {{ ingrediente.cantidad }} {{ ingrediente.unidadMedida }}</p>
              <p><strong>Calorías:</strong> {{ ingrediente.calorias }} kcal</p>
              <p><strong>Contiene alérgenos:</strong> {{ ingrediente.contieneAlergenos ? 'Sí' : 'No' }}</p>
              <p v-if="ingrediente.contieneAlergenos"><strong>Tipo de alérgeno:</strong> {{ ingrediente.tipoAlergeno }}</p>
              <p><strong>Fecha de expiración:</strong> {{ ingrediente.fechaExpiracion }}</p>
            </li>
          </ul>
        </section>

        <section class="pasos">
          <h3>Pasos</h3>
          <div v-for="paso in pasos" :key="paso.idPaso">
            <h4>{{ paso.numero }}º Paso</h4>
            <p>{{ paso.descripcion }}</p>
            <img class="imagen-pasos" v-if="paso.imagenUrl" :src="paso.imagenUrl" alt="Paso imagen" />
          </div>
        </section>
      </div>
    </div>

    <aside class="sidebar">
      <section>
        <h3>Recetas relacionadas</h3>
      </section>

      <section>
        <h3>Más populares</h3>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/Recetas';

// Obtener el store de recetas
const recetasStore = useRecetasStore();

// Extraer la receta actual desde el store
const receta = computed(() => recetasStore.recetaActual); // Se define receta como un ref reactivo

// Crear una computed property para ingredientes
const ingredientes = computed(() => recetasStore.ingredientes); // Asegúrate de que el store tenga esta propiedad

// Crear una computed property para pasos
const pasos = computed(() => recetasStore.pasos); // Extraer los pasos del store

// Obtener el ID de la receta desde la ruta
const route = useRoute();
const recetaId = route.params.id ? Number(route.params.id) : null;

// Función para cargar la receta y los ingredientes
const cargarReceta = async (id: number) => {
  await recetasStore.fetchRecetaPorId(id);
  await recetasStore.fetchIngredientesPorRecetaId(id);
};

// Ejecutar la carga de la receta cuando se monte el componente
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

.imagen-pasos{
  width: 200px;
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
