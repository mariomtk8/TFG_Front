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
      <button type="submit" class="btn-enviar">Agregar Comentario</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useComentariosStore } from '../store/ComentariosVotaciones';
import { useLoginStore } from '../store/Login';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const comentariosStore = useComentariosStore();
    const loginStore = useLoginStore();
    const route = useRoute();
    const recetaId = Number(route.params.id);
    const nuevoComentario = ref('');
    
    onMounted(async () => {
      await comentariosStore.obtenerComentarios(recetaId);
    });

    const enviarComentario = async () => {
      await comentariosStore.agregarComentario(recetaId, nuevoComentario.value);
      await comentariosStore.obtenerComentarios(recetaId);
      nuevoComentario.value = '';
    };

    const eliminarComentario = async (comentarioId: number) => {
      await comentariosStore.eliminarComentario(comentarioId);
    };

    const idUsuarioLogeado = computed(() => loginStore.usuario?.idUsuario);

    const comentariosOrdenados = computed(() => {
      return comentariosStore.comentarios
        ? [...comentariosStore.comentarios].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        : [];
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
  max-width: 750px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f7f7fb;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #3f197c;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.sin-comentarios {
  text-align: center;
  font-style: italic;
  color: #888;
  margin-bottom: 1rem;
}

.comentario {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}

.comentario:hover {
  background-color: #f0f4fa;
}

.contenido {
  font-size: 1rem;
  color: #333;
  margin: 0.5rem 0;
}

.info {
  font-size: 0.8rem;
  color: #666;
  display: block;
  margin-top: 0.5rem;
}

.btn-eliminar {
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
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
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: none;
  margin-bottom: 1rem;
}

textarea:focus {
  border-color: #3f197c;
  outline: none;
}

.btn-enviar {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-enviar:hover {
  background-color: #45a049;
}
</style>
