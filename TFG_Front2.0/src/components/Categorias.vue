<template>
  <div>
    <h1>Categorías</h1>
    <table>
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
        <tr v-for="categoria in categorias" :key="categoria.idCategoria">
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
import { onMounted } from 'vue';
import { useCategoriasStore } from '../store/Categorias';

const categoriasStore = useCategoriasStore();
const { categorias, fetchCategorias } = categoriasStore;

onMounted(() => {
  fetchCategorias();
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
</style>
