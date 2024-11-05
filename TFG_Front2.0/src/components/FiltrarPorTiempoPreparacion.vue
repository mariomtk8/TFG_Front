<template>
  <div class="filtrar-container">
    <h2>Recetas por Tiempo de Preparación</h2>
    <div class="selector-container">
      <label class="selector-label">
        Ordenar por Tiempo:
        <select v-model="ascendente" @change="cambiarOrden" class="custom-select">
          <option value="true">Menor a Mayor</option>
          <option value="false">Mayor a Menor</option>
        </select>
      </label>
    </div>
    <div class="recetas-grid">
      <RouterLink
        class="receta-card"
        v-for="receta in recetasPorTiempo"
        :key="receta.idReceta"
        :to="{ name: 'Recetas', params: { id: receta.idReceta } }"
      >
        <img :src="receta.imagen" alt="Imagen de la receta" class="receta-imagen" />
        <h3 class="receta-nombre">{{ receta.nombre }}</h3>
        <p class="receta-atributo">Tiempo: {{ receta.tiempoPreparacion }} min</p>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useFiltradosStore } from '../store/Filtrados';

export default defineComponent({
  setup() {
    const store = useFiltradosStore();
    const ascendente = ref(true);

    onMounted(() => {
      store.filtrarPorTiempoPreparacion(ascendente.value);
    });

    const cambiarOrden = () => {
      store.filtrarPorTiempoPreparacion(ascendente.value);
    };

    const recetasPorTiempo = computed(() => store.recetasPorTiempo);

    return {
      ascendente,
      cambiarOrden,
      recetasPorTiempo,
    };
  },
});
</script>

<style scoped>
.filtrar-container {
  text-align: center;
  padding: 20px;
  
}

.selector-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selector-label {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 0 10px;
}

.custom-select {
  margin-left: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s;
}

.custom-select:hover {
  border-color: #888;
}

.recetas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Espaciado más amplio entre las tarjetas */
  justify-content: center;
}

.receta-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 10px;
  width: 150px; /* Ancho fijo para los recuadros */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.receta-card:hover {
  transform: translateY(-5px); /* Efecto de elevación al pasar el ratón */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra más intensa */
}

.receta-imagen {
  max-width: 100%;
  max-height: auto; /* Altura de imagen más amplia */
  object-fit: cover;
  border-radius: 10px; /* Esquinas más redondeadas */
}

.receta-nombre {
  font-size: 16px; /* Aumento de tamaño de fuente */
  margin: 10px 0;
  color: #333; /* Color de texto más oscuro */
}

.receta-atributo {
  font-size: 14px;
  color: #777; /* Color de texto más claro para los atributos */
}
</style>
