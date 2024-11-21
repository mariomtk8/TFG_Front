<template>
  <div class="favoritos-container">
    <h1>{{ $t('header.favorites') }}</h1>
    <div class="tarjetas-container">
      <div 
        class="tarjeta" 
        v-for="favorito in favoritos" 
        :key="favorito.idFavorito"
      >
        <RouterLink
          :to="{ name: 'Recetas', params: { id: favorito.receta.idReceta } }"
          class="receta-link"
        >
          <img :src="favorito.receta.imagen" alt="Imagen de la receta" class="receta-imagen" />
          <div class="contenido">
            <h3 class="titulo">{{ favorito.receta.nombre }}</h3>
          </div>
        </RouterLink>
        <button @click="eliminarFavorito(favorito.idFavorito)" class="eliminar-btn">
          {{ $t('favorites.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useFavoritosStore } from '../store/Favoritos';

export default defineComponent({
  setup() {
    const favoritosStore = useFavoritosStore();

    onMounted(() => {
      favoritosStore.obtenerFavoritos();
    });

    const favoritos = computed(() => favoritosStore.recetasFavoritas);

    const eliminarFavorito = (favoritoId: number) => {
      favoritosStore.eliminarFavorito(favoritoId);
    };

    return {
      favoritos,
      eliminarFavorito,
    };
  },
});
</script>

<style scoped>
.favoritos-container {
  margin-top: 7vh;
  padding: 20px;
  text-align: center;
}

.tarjetas-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  max-width: 1200px;
  margin: 20px auto;
}

.tarjeta {
  position: relative;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.tarjeta:hover {
  transform: translateY(-5px);
}

.receta-link {
  text-decoration: none;
  color: inherit;
}

.receta-imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.contenido {
  padding: 15px;
  text-align: left;
}

.titulo {
  font-size: 1.2em;
  margin: 0;
}

.eliminar-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4d4d;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.eliminar-btn:hover {
  background-color: #ff1a1a;
}
</style>
