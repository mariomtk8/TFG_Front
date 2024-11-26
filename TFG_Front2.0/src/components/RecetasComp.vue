<template>
  <v-container max-width="lg" class="py-5 receta-container">
    <v-card elevation="2" class="pa-5">
      <v-card-title class="text-h4 receta-titulo text-center">
        {{ receta?.nombre}}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <section v-if="receta" class="receta__descripcion mb-4">
          <h2>{{ $t('receta.description') }}</h2>
          <p style="margin-left: 3vh; max-width: 600px;">{{ receta.descripcion }}</p>
        </section>

        <v-row class="receta__layout" dense>
          <v-col cols="12" md="8">
            <v-card class="pa-4 mb-4 receta__info">
              <h2>{{ $t('receta.details') }}</h2>
              <p style="margin: 1vh;"><strong>{{ $t('receta.difficulty') }}:</strong> {{ receta?.nivelDificultad }}</p>
              <p style="margin: 1vh;"><strong>{{ $t('receta.preparationTime') }}:</strong> {{ receta?.tiempoPreparacion }} min</p>
              <p style="margin: 1vh;"><strong>{{ $t('receta.vegan') }}:</strong> {{ receta?.esVegano ? $t('receta.veganYes') : $t('receta.veganNo') }}</p>
            </v-card>

            <v-card class="pa-4 mb-4 receta__ingredientes">
              <h2>{{ $t('receta.ingredients') }}</h2>
              <v-list dense>
                <v-list-item
                  v-for="ingrediente in ingredientes"
                  :key="ingrediente.idIngrediente"
                >
                  <v-list-item-content>
                    <p><strong>{{ ingrediente.nombreIngrediente }}</strong> - {{ borrarCant(ingrediente.cantidad) }} {{ ingrediente.notas }} </p>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>

            <v-card class="pa-4 mb-4 receta__pasos">
              <h2>{{ $t('receta.steps') }}</h2>
              <div v-for="paso in pasos" :key="paso.idPaso" class="mb-3">
                <h4 class="text-h6">{{ paso.numero }}º {{ $t('receta.step') }}</h4>
                <p style="margin: 2vh;">- {{ paso.descripcion }}</p>
                <v-img style="margin-left: 2vh;" width="300px"
                  v-if="paso.imagenUrl"
                  :src="paso.imagenUrl"
                  :alt="$t('receta.stepImage')"
                  class="paso__imagen mb-2"
                  max-width="400"
                />
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="pa-4 receta__sidebar sticky-top">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRecetasStore } from '../store/Recetas';

const recetasStore = useRecetasStore();
const receta = computed(() => recetasStore.recetaActual);
const ingredientes = computed(() => recetasStore.ingredientes.map(ingrediente => ({ ...ingrediente, mostrarDetalles: false })));
const pasos = computed(() => recetasStore.pasos);
const route = useRoute();
const recetaId = computed(() => route.params.id ? Number(route.params.id) : null);

const borrarCant = (numero : number) =>{
  if (numero <= 1) {
    return null
  } else {
    return numero
  }
}
const cargarReceta = async (id: number) => {
  await recetasStore.fetchRecetaPorId(id);
  await recetasStore.fetchIngredientesPorRecetaId(id);
};

onMounted(() => {
  if (recetaId.value !== null && !isNaN(recetaId.value)) {
    cargarReceta(recetaId.value);
  } else {
    console.error('ID de receta no válido');
  }
});

watch(
  recetaId,
  (newId) => {
    if (newId !== null && !isNaN(newId)) {
      cargarReceta(newId);
    } else {
      console.error('ID de receta no válido');
    }
  }
);
</script>

<style scoped>
.receta-container {
  background-color: #f5f5f5;
  max-width: 1400px;
  margin-top: 3vh;
}
h2{
  padding: 2vh;
  margin-bottom: 2vh;
  font-size: 24px;
}
p{
  font-size: 18px
}
h4{
  margin: 2vh;
}

.receta-titulo {
  color: rgb(0, 0, 0);
}

.receta__descripcion,
.receta__info,
.receta__ingredientes,
.receta__pasos,
.receta__sidebar {
  background-color: #fafafa;
  border-radius: 8px;
}
.pasos{
  font-size: 18px;

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
