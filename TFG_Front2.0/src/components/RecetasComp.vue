<template>
  <v-container max-width="lg" class="py-5 receta-container">
    <v-card elevation="2" class="pa-5">
      <v-card-title class="text-h4 receta-titulo text-center">
        {{ receta?.nombre }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <section v-if="receta" class="receta__descripcion mb-4">
          <v-subheader>Descripción</v-subheader>
          <p>{{ receta.descripcion }}</p>
        </section>

        <v-row class="receta__layout" dense>
          <v-col cols="12" md="8">
            <v-card class="pa-4 mb-4 receta__info">
              <v-subheader>Detalles de la receta</v-subheader>
              <p><strong>Dificultad:</strong> {{ receta?.nivelDificultad }}</p>
              <p><strong>Preparación:</strong> {{ receta?.tiempoPreparacion }} min</p>
              <p><strong>Tipo:</strong> Primer plato</p>
            </v-card>

            <v-card class="pa-4 mb-4 receta__ingredientes">
              <v-subheader>Ingredientes</v-subheader>
              <v-list dense>
                <v-list-item
                  v-for="ingrediente in ingredientes"
                  :key="ingrediente.idIngrediente"
                >
                  <v-list-item-content>
                    <p><strong>{{ ingrediente.nombreIngrediente }}</strong> - {{ ingrediente.cantidad }} {{ ingrediente.unidadMedida }}</p>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card class="pa-4 mb-4 receta__pasos">
              <v-subheader>Pasos</v-subheader>
              <div v-for="paso in pasos" :key="paso.idPaso" class="mb-3">
                <h4 class="text-h6">{{ paso.numero }}º Paso</h4>
                <p>{{ paso.descripcion }}</p>
                <v-img
                  v-if="paso.imagenUrl"
                  :src="paso.imagenUrl"
                  alt="Imagen del paso"
                  class="paso__imagen mb-2"
                  max-width="400"
                />
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-4 receta__sidebar sticky-top">
              <v-subheader class="text-center">Recetas Populares</v-subheader>
              <Populares />
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-row class="d-flex flex-column" align="center">
          <v-col cols="12" class="mb-4">
            <Votaciones />
          </v-col>
          <v-col cols="12">
            <Comentarios />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
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
  background-color: #f5f5f5;
  max-width: 1400px;
  margin-top: 3vh;
}

.receta-titulo {
  color: rgb(63, 25, 124);
}

.receta__descripcion,
.receta__info,
.receta__ingredientes,
.receta__pasos,
.receta__sidebar {
  background-color: #fafafa;
  border-radius: 8px;
}

.paso__imagen {
  border-radius: 8px;
}

.sticky-top {
  position: sticky;
  top: 20px;
}

/* Ajustes para el responsive */
@media (max-width: 600px) {
  .receta__layout {
    flex-direction: column;
  }

  .receta__sidebar {
    margin-top: 20px;
  }

  .receta__info,
  .receta__ingredientes,
  .receta__pasos {
    margin-bottom: 20px;
  }
}
</style>
