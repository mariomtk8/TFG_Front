<template>
  <div>
    <h1>Categorías</h1>
    <div v-if="loading">Cargando categorías...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Icono</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Puntuación Promedio</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="categoria in categoriasComputed" :key="categoria.idCategoria">
          <td><img :src="categoria.icono" width="50" alt="Icono de la categoría"></td>
          <td>{{ categoria.nombreCategoria }}</td>
          <td>{{ categoria.descripcion }}</td>
          <td>{{ categoria.puntuacionPromedio }}</td>
          <td>
            <RouterLink :to="{ name: 'RecetasCat', params: { idCategoria: categoria.idCategoria } }">
              Ver Recetas
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useCategoriasStore } from '../store/Categorias';

// Inicializar el store de categorías
const categoriasStore = useCategoriasStore();

// Extraer el estado y las acciones del store
const fetchCategorias = categoriasStore.fetchCategorias;
const loading = categoriasStore.loading;
const error = categoriasStore.error;

// Computed para obtener las categorías
const categoriasComputed = computed(() => {
  return categoriasStore.categorias; // Devuelve directamente las categorías
});

// Cargar las categorías al montar el componente
onMounted(async () => {
  await fetchCategorias(); // Espera a que se complete la obtención de categorías
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
