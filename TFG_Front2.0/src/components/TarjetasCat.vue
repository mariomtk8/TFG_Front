<template>
  <v-container>
    <v-col>
      <v-row class="text-center">
        <h1>Recetas de {{ categoriaNombre }}</h1>
      </v-row>

      <!-- Mensaje de error -->
      <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>

      <!-- Controles de filtro -->
      <v-row class="filtros" no-gutters>
        <v-col cols="12" md="6" class="filtro-tiempo">
          <v-text-field
            v-model.number="tiempoMin"
            label="Tiempo de preparación (Min)"
            type="number"
            hide-details
            outlined
          ></v-text-field>
          <v-text-field
            v-model.number="tiempoMax"
            label="Tiempo de preparación (Max)"
            type="number"
            hide-details
            outlined
          ></v-text-field>
          <v-btn icon @click="filtrarPorTiempo" color="primary">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" md="6" class="filtro-dificultad">
          <v-select
            v-model.number="nivelDificultad"
            :items="[1, 2, 3, 4, 5]"
            label="Dificultad (1-5)"
            outlined
            hide-details
          ></v-select>
          <v-btn icon @click="filtrarPorDificultad" color="primary">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Lista de recetas -->
      <div v-if="recetasFiltradas && recetasFiltradas.length > 0" class="recetas-grid">
        <v-card
          v-for="receta in recetasFiltradas"
          :key="receta.idReceta"
          class="receta-item"
        >
          <RouterLink :to="{ name: 'Recetas', params: { id: receta.idReceta } }" class="receta-link">
            <v-img v-if="receta.imagen" :src="receta.imagen" aspect-ratio="16/9"></v-img>
            <v-card-title>{{ receta.nombre }}</v-card-title>
            <v-card-subtitle>{{ receta.descripcion }}</v-card-subtitle>
            <v-card-text>
              <v-chip>{{ receta.esVegano ? 'Vegano' : 'No Vegano' }}</v-chip>
              <v-chip>Dificultad: {{ receta.nivelDificultad }}</v-chip>
              <v-chip>Tiempo: {{ receta.tiempoPreparacion }} min</v-chip>
            </v-card-text>
          </RouterLink>

          <v-card-actions>
            <v-btn
              icon
              @click="toggleFavorito(receta.idReceta)"
              :color="esFavorito(receta.idReceta) ? 'yellow' : 'grey'"
            >
              <v-icon>mdi-star</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-row v-else>
        <p>No hay recetas disponibles en esta categoría.</p>
      </v-row>
    </v-col>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useRecetasStore } from '../store/RecetasCat';
import { useFavoritosStore } from '../store/Favoritos';
import { useLoginStore } from '../store/Login';

const errorMessage = ref<string | null>(null);
const recetasStore = useRecetasStore();
const favoritosStore = useFavoritosStore();
const loginStore = useLoginStore();
const route = useRoute();
const idCategoria = computed(() => parseInt(route.params.idCategoria as string));
const categoriaNombre = ref<string | null>(null);

const recetas = ref<any[]>([]);
const recetasFiltradas = ref<any[]>([]);
const tiempoMin = ref<number | null>(null);
const tiempoMax = ref<number | null>(null);
const nivelDificultad = ref<number | null>(null);

const isLoggedIn = computed(() => loginStore.usuario !== null);

const cargarRecetas = async (id: number) => {
  try {
    errorMessage.value = null;
    const fetchedRecetas = await recetasStore.fetchRecetasPorCategoria(id);
    recetas.value = fetchedRecetas;
    recetasFiltradas.value = fetchedRecetas; // Inicialmente muestra todas
    categoriaNombre.value = await recetasStore.fetchNombreCategoria(id);
  } catch (error) {
    console.error('Error al cargar recetas:', error);
    errorMessage.value = 'Error al cargar las recetas. Por favor, intente más tarde.';
  }
};

// Filtrar recetas por tiempo de preparación
const filtrarPorTiempo = () => {
  if (tiempoMin.value != null && tiempoMax.value != null && tiempoMin.value > tiempoMax.value) {
    Swal.fire({
      icon: 'error',
      title: 'Rango de tiempo inválido',
      text: 'El tiempo mínimo no puede ser mayor que el tiempo máximo.',
    });
    return;
  }
  recetasFiltradas.value = recetas.value.filter(receta => {
    const tiempoValido = (tiempoMin.value == null || receta.tiempoPreparacion >= tiempoMin.value) &&
                         (tiempoMax.value == null || receta.tiempoPreparacion <= tiempoMax.value);
    return tiempoValido;
  });
};

// Filtrar recetas por nivel de dificultad
const filtrarPorDificultad = () => {
  recetasFiltradas.value = recetas.value.filter(receta => {
    return nivelDificultad.value == null || receta.nivelDificultad === nivelDificultad.value;
  });
};

// Función para agregar o eliminar de favoritos
const toggleFavorito = async (recetaId: number) => {
  if (!isLoggedIn.value) {
    Swal.fire({
      icon: 'warning',
      title: '¡Necesitas iniciar sesión!',
      text: 'Inicia sesión para guardar recetas en tus favoritos.',
    });
    return;
  }

  try {
    if (esFavorito(recetaId)) {
      const favorito = favoritosStore.recetasFavoritas.find((f: any) => f.idReceta === recetaId);
      if (favorito) {
        await favoritosStore.eliminarFavorito(favorito.idFavorito);
      }
    } else {
      await favoritosStore.agregarFavorito(recetaId);
    }
  } catch (error) {
    console.error('Error al gestionar favorito:', error);
  }
};

const esFavorito = (recetaId: number) => {
  return favoritosStore.recetasFavoritas.some((favorito: any) => favorito.idReceta === recetaId);
};

onMounted(() => {
  cargarRecetas(idCategoria.value);
  favoritosStore.obtenerFavoritos();
});
</script>

<style scoped>
h1 {
  margin-top: 5vh;
  margin-left: 15vh;
  margin-bottom: 5vh;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.recetas-container {
  max-width: 1300px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
a {
  text-decoration: none;
  color: inherit;
}

.recetas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-items: center;
  max-width: 1300px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.receta-item {
  max-width: 350px;
  position: relative;
  padding: 16px;
  border: 1px solid #ddd;
  color: #444;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
}

.imagen-receta {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
}

.receta-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.favorito-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorito-btn:hover {
  transform: scale(1.1);
}

.favorito-guardado svg {
  fill: yellow;
}

.etiqueta {
  display: inline-block;
  margin-top: 5px;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 4px 8px;
  color: #333;
  font-weight: 600;
}
.filtros {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.filtro-tiempo, .filtro-dificultad {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtro-tiempo input, .filtro-dificultad select {
  width: 70px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.2s;
}

.filtro-tiempo input:focus, .filtro-dificultad select:focus {
  border-color: #666;
}

.filtro-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, transform 0.2s;
}

.filtro-btn:hover {
  background-color: #e0e0e0;
  border-radius: 50%;
  transform: scale(1.1);
}
@media (max-width: 600px) {
  /* Reduce icon size for mobile */
  .favorito-icon {
    width: 20px;
    height: 20px;
  }
  .receta-item{
    max-width: 200px;
  }
  .imagen-receta{
    max-width: 200px;
  }
  .filtros {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .filtro-tiempo, .filtro-dificultad {
    justify-content: center;
  }
}
</style>
