<template>
  <v-container class="votaciones" max-width="600">
    <v-card elevation="2">
      <v-card-title>
        <h2>Votaciones</h2>
      </v-card-title>
      <v-card-text>
        <div class="estrellas">
          <v-icon
            v-for="i in 5"
            :key="i"
            @click="seleccionarPuntuacion(i)"
            :color="i <= puntuacionSeleccionada ? 'yellow' : 'grey'"
            large
          >
            mdi-star
          </v-icon>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" :disabled="puntuacionSeleccionada === 0" @click="enviarVotacion">
          Enviar Votación
        </v-btn>
      </v-card-actions>
      <v-card-subtitle>
        <h3>Promedio de Votaciones: {{ promedioPuntuacion }}</h3>
      </v-card-subtitle>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useComentariosStore } from '../store/ComentariosVotaciones';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const comentariosStore = useComentariosStore();
    const route = useRoute();
    const recetaId = Number(route.params.id);

    onMounted(async () => {
      await comentariosStore.obtenerComentarios(recetaId);
      await comentariosStore.obtenerPromedioVotaciones(recetaId); 
    });

    const puntuacionSeleccionada = computed(() => comentariosStore.puntuacionSeleccionada as number);

    const enviarVotacion = async () => {
      await comentariosStore.agregarVotacion(recetaId, puntuacionSeleccionada.value);
    };

    const promedioPuntuacion = computed(() => {
      return comentariosStore.promedioVotaciones as number; 
    });

    const seleccionarPuntuacion = (puntuacion: number) => {
      comentariosStore.puntuacionSeleccionada = puntuacion; 
    };

    return {
      enviarVotacion,
      promedioPuntuacion,
      seleccionarPuntuacion,
      puntuacionSeleccionada,
    };
  },
});
</script>

<style scoped>
.votaciones {
  margin: 2rem auto;
  padding: 1rem;
}

/* Estilo para las estrellas */
.estrellas {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.v-icon {
  margin: 0 4px;
}

/* Para hacer las estrellas más grandes en escritorio */
@media (min-width: 768px) {
  .v-icon {
    font-size: 36px; /* Aumentar tamaño de las estrellas en escritorio */
  }
}

/* Estilos responsivos para dispositivos pequeños */
@media (max-width: 768px) {
  .v-icon {
    font-size: 28px; /* Estrellas más pequeñas en móviles */
  }

  .v-card-subtitle h3 {
    text-align: center;
    font-size: 1.1em;
  }
}
</style>
