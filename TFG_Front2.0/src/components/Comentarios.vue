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
          <v-card-actions class="d-flex flex-column align-center">
  <v-btn type="submit" color="green">Agregar Comentario</v-btn>
</v-card-actions>
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
  margin: 1rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.v-card-title,
.v-card-actions {
  justify-content: center;
}

.sin-comentarios {
  text-align: center;
}

.v-list-item-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  text-align: left; 
}

.v-btn {
  margin-top: 1rem;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .comentarios {
    width: 65%; 
    margin: auto;
  }
  .v-card-title{
    text-align: center
  }
  .v-list-item-content{
    text-align: center;
  }

  .v-card {
    padding: 1rem; 
  }

  .v-list-item-content {
    margin-bottom: 1rem;
    text-align: left; 
  }

  .v-textarea {
    width: 50%; 
  }
  .v-field__input{
    width: 50%;
  }

  .form-comentario {
    display: flex;
    flex-direction: column;
    
    width: 120%;
  }
}
</style>
