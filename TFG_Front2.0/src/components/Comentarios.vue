<template>
  <v-container class="comentarios" max-width="750">
    <v-card elevation="2">
      <v-card-title>
        <h2>Comentarios</h2>
      </v-card-title>
      <v-card-text>
        <div v-if="comentariosOrdenados.length === 0" class="sin-comentarios">
          <v-alert type="info" dense>No hay comentarios aún. ¡Sé el primero en comentar!</v-alert>
        </div>
        <v-list>
          <v-list-item
            v-for="comentario in comentariosOrdenados"
            :key="comentario.id"
            class="comentario"
          >
            <v-list-item-content>
              <v-list-item-title>{{ comentario.contenido }}</v-list-item-title>
              <v-list-item-subtitle>
                Por {{ comentario.nombreUsuario }} el {{ new Date(comentario.fecha).toLocaleString() }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="idUsuarioLogeado === comentario.usuarioId"
                icon
                color="red"
                @click="eliminarComentario(comentario.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-form @submit.prevent="enviarComentario" class="form-comentario">
          <v-textarea
            v-model="nuevoComentario"
            label="Escribe tu comentario aquí..."
            rows="2"
            width="500px"
            outlined
            required
          ></v-textarea>
          <v-btn type="submit" color="green">Agregar Comentario</v-btn>
        </v-form>
      </v-card-actions>
    </v-card>
  </v-container>
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
  margin: 2rem auto;
  padding: 1rem;
}

/* Estilo para los comentarios */
.v-list-item-content {
  padding-bottom: 0.5rem;
}

.v-list-item-title {
  font-size: 1.1em;
}

.v-list-item-subtitle {
  font-size: 0.9em;
}

/* Estilos responsivos para dispositivos pequeños */
@media (max-width: 768px) {
  /* Centrar los elementos y asegurar que estén uno debajo del otro */
  .comentarios, .votaciones {
    padding: 1rem;
  }

  .v-list-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .v-card-subtitle h3 {
    text-align: center;
    font-size: 1.1em;
  }
}

/* Para escritorio */
@media (min-width: 768px) {
  .v-icon {
    font-size: 36px;
  }

  .v-list-item-content {
    padding-bottom: 1rem;
  }

  .v-list-item-title {
    font-size: 1.2em;
  }

  .v-list-item-subtitle {
    font-size: 1em;
  }
}
</style>
