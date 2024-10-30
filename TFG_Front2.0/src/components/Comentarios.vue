<template>
  <div class="comentarios">
    <h2>Comentarios</h2>
    <div v-if="comentariosOrdenados.length === 0" class="sin-comentarios">
      <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
    </div>
    <div v-for="comentario in comentariosOrdenados" :key="comentario.id" class="comentario">
      <p class="contenido">{{ comentario.contenido }}</p>
      <small class="info">
        Por {{ comentario.nombreUsuario }} el {{ new Date(comentario.fecha).toLocaleString() }}
      </small>
      <button
        v-if="idUsuarioLogeado === comentario.usuarioId"
        @click="eliminarComentario(comentario.id)"
        class="btn-eliminar"
      >
        Eliminar
      </button>
    </div>
    <form @submit.prevent="enviarComentario" class="form-comentario">
      <textarea
        v-model="nuevoComentario"
        placeholder="Escribe tu comentario aquí..."
        required
      ></textarea>
      <button type="submit">Agregar Comentario</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useComentariosStore } from '../store/ComentariosVotaciones';
import { useLoginStore } from '../store/Login';

export default defineComponent({
  setup() {
    const comentariosStore = useComentariosStore();
    const loginStore = useLoginStore();
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

    const eliminarComentario = async (comentarioId: number) => {
      await comentariosStore.eliminarComentario(comentarioId);
    };

    // Computed para obtener el ID del usuario logeado
    const idUsuarioLogeado = computed(() => loginStore.usuario?.idUsuario);

    // Computed para obtener los comentarios ordenados por fecha
    const comentariosOrdenados = computed(() => {
      return comentariosStore.comentarios ? [...comentariosStore.comentarios].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) : [];
    });

    return {
      comentariosOrdenados,
      nuevoComentario,
      enviarComentario,
      eliminarComentario,
      idUsuarioLogeado,
    };
  },
});
</script>

<style scoped>
.comentarios {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  
}

.sin-comentarios {
  text-align: center;
  font-style: italic;
  color: #888;
  margin-bottom: 1rem;
}

.comentario {
  padding: 1rem;
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.3s;
}

.comentario:last-child {
  border-bottom: none;
}

.comentario:hover {
  background-color: #f9f9f9;
}

.contenido {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.info {
  font-size: 0.8rem;
  color: #666;
}

.btn-eliminar {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.btn-eliminar:hover {
  background-color: #c0392b;
}

.form-comentario {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  resize: none; /* Deshabilitar el redimensionamiento */
  font-size: 0.9rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>
