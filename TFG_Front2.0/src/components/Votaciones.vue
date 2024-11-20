<template>
  <v-container class="votaciones" max-width="740">
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
import Swal from 'sweetalert2';
import { useComentariosStore } from '../store/ComentariosVotaciones';
import { useRoute } from 'vue-router';
import { useLoginStore } from '../store/Login';

export default defineComponent({
  setup() {
    const comentariosStore = useComentariosStore();
    const loginStore = useLoginStore();
    const route = useRoute();
    const recetaId = Number(route.params.id);

    const isLoggedIn = computed(() => loginStore.usuario !== null);

    onMounted(async () => {
      await comentariosStore.obtenerComentarios(recetaId);
      await comentariosStore.obtenerPromedioVotaciones(recetaId);
    });

    const puntuacionSeleccionada = computed(() => comentariosStore.puntuacionSeleccionada as number);

    const enviarVotacion = async () => {
      if (!isLoggedIn.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para poder votar.',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      await comentariosStore.agregarVotacion(recetaId, puntuacionSeleccionada.value);
      Swal.fire({
        icon: 'success',
        title: 'Votación enviada',
        text: '¡Gracias por tu voto!',
        confirmButtonText: 'Aceptar',
      });
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
      isLoggedIn,
    };
  },
});
</script>

<style scoped>
.votaciones {
  margin: 1rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.estrellas {
  display: flex;
  justify-content: center;
  gap: 10px; 
  margin-bottom: 1rem;
}
.estrellas .v-icon {
    font-size: 33px; 
  }

.v-btn {
  margin-top: 1rem; 
}
.v-card-actions{
  justify-content: center
}
.v-btn__content{
  text-align: center;
    line-height: 2.425;
}
.v-card .v-card-title {
  text-align: center;
    line-height: 2.425;
}
.v-card .v-card-subtitle {
  text-align: center;
    line-height: 2.425;
}


@media (max-width: 768px) {
  .votaciones {
  margin: 1rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center; 
}
  .estrellas .v-icon {
    font-size: 28px; 
  }

  .v-card {
    padding: 1rem;
  }

  .v-card-subtitle h3 {
    text-align: center;
    font-size: 1em;
  }
}
</style>
