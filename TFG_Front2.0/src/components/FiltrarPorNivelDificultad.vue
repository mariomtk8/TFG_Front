<template>
  <div class="filtrar-container">
    <h2>{{ $t('filtrar.dificultadTitle') }}</h2>
    <div class="selector-container">
      <label class="selector-label">
        {{ $t('filtrar.ordenarPorDificultad') }}:
        <select v-model="ascendente" @change="cambiarOrden" class="custom-select">
          <option value="true">{{ $t('filtrar.menorAMayor') }}</option>
          <option value="false">{{ $t('filtrar.mayorAMenor') }}</option>
        </select>
      </label>
    </div>
    <div class="recetas-grid">
      <RouterLink
        class="receta-card"
        v-for="receta in recetasPorNivel"
        :key="receta.idReceta"
        :to="{ name: 'Recetas', params: { id: receta.idReceta } }"
      >
        <img :src="receta.imagen" alt="Imagen de la receta" class="receta-imagen" />
        <h3 class="receta-nombre">{{ receta.nombre }}</h3>
        <p class="receta-atributo">{{ $t('filtrar.dificultad') }}: {{ receta.nivelDificultad }}</p>
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
    const ascendente = ref(false);

    onMounted(() => {
      store.filtrarPorNivelDificultad(ascendente.value);
    });

    const cambiarOrden = () => {
      store.filtrarPorNivelDificultad(ascendente.value);
    };

    const recetasPorNivel = computed(() => store.recetasPorNivel);

    return {
      ascendente,
      cambiarOrden,
      recetasPorNivel,
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px;
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
  gap: 30px; 
  justify-content: center;
}

.receta-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 20px;
  width: 200px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.receta-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}


.receta-imagen {
  width: 100%;
  height: 150px; 
  object-fit: cover; 
  border: 2px solid #ddd; 
  border-radius: 8px; 
}

.receta-nombre {
  font-size: 18px;
  margin: 15px 0;
  color: #333;
}

.receta-atributo {
  font-size: 14px;
  color: #777;
}
</style>
