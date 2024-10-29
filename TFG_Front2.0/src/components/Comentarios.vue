<template>
    <div class="comentarios">
      <h2>Comentarios</h2>
      <div v-if="comentariosOrdenados.length === 0" class="sin-comentarios">
        <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
      </div>
      <div v-for="comentario in comentariosOrdenados" :key="comentario.id" class="comentario">
        <p class="contenido"><strong>{{ comentario.contenido }}</strong></p>
        <small class="info">
          Por Usuario ID: {{ comentario.usuarioId }} el {{ new Date(comentario.fecha).toLocaleString() }}
        </small>
      </div>
      <form @submit.prevent="enviarComentario" class="form-comentario">
        <textarea v-model="nuevoComentario" placeholder="Escribe tu comentario aquí..." required></textarea>
        <button type="submit">Agregar Comentario</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { useComentariosStore } from '../store/ComentariosVotaciones';
  
  export default defineComponent({
    setup() {
      const comentariosStore = useComentariosStore();
      const recetaId = 1; // Cambia esto por el ID de la receta actual.
      const nuevoComentario = ref('');
  
      onMounted(async () => {
        await comentariosStore.obtenerComentarios(recetaId);
      });
  
      const enviarComentario = async () => {
        await comentariosStore.agregarComentario(recetaId, nuevoComentario.value);
        await comentariosStore.obtenerComentarios(recetaId); // Vuelve a cargar los comentarios
        nuevoComentario.value = ''; // Limpiar el campo después de agregar
      };
  
      // Computed para obtener los comentarios ordenados por fecha
      const comentariosOrdenados = computed(() => {
        return comentariosStore.comentarios ? [...comentariosStore.comentarios].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) : [];
      });
  
      return {
        comentariosOrdenados,
        nuevoComentario,
        enviarComentario,
      };
    },
  });
  </script>
  
  <style scoped>
  .comentarios {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sin-comentarios {
    text-align: center;
    font-style: italic;
    color: #777;
  }
  
  .comentario {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.3s;
  }
  
  .comentario:last-child {
    border-bottom: none;
  }
  
  .comentario:hover {
    background-color: #f1f1f1;
  }
  
  .contenido {
    font-size: 1.1rem;
  }
  
  .info {
    font-size: 0.9rem;
    color: #555;
  }
  
  .form-comentario {
    margin-top: 1rem;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    resize: none; /* Deshabilitar el redimensionamiento */
  }
  
  button {
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
  </style>
  