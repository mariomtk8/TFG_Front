<template>
    <div class="votaciones">
      <h2>Votaciones</h2>
      <div class="estrellas">
        <svg
          v-for="i in 5"
          :key="i"
          @click="seleccionarPuntuacion(i)"
          :fill="i <= puntuacionSeleccionada ? 'gold' : 'lightgray'"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .587l3.668 7.431 8.165 1.181-5.9 5.733 1.39 8.115L12 18.896l-7.323 3.851 1.39-8.115-5.9-5.733 8.165-1.181z" />
        </svg>
      </div>
      <button @click="enviarVotacion" :disabled="puntuacionSeleccionada === 0">Enviar Votación</button>
      <h3>Promedio de Votaciones: {{ promedioPuntuacion }}</h3>
    </div>
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
  
      // Asegúrate de que 'puntuacionSeleccionada' sea un número
      const puntuacionSeleccionada = computed(() => comentariosStore.puntuacionSeleccionada as number);
  
      const enviarVotacion = async () => {
        await comentariosStore.agregarVotacion(recetaId, puntuacionSeleccionada.value);
      };
  
      // Asegúrate de que 'promedioVotaciones' sea un número
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
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
  }
  
  .estrellas {
    display: flex;
    cursor: pointer;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  h3 {
    margin-top: 1rem;
  }
  </style>
  