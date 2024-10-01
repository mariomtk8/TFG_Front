<template>
  <div class="contenedor-tabla">
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
          <td><img :src="categoria.icono" width="40" alt="Icono de la categoría"></td>
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
const fetchCategorias = categoriasStore.fetchCategorias;
const loading = categoriasStore.loading;
const error = categoriasStore.error;

// Computed para obtener las categorías
const categoriasComputed = computed(() => categoriasStore.categorias);

// Cargar las categorías al montar el componente
onMounted(async () => {
  await fetchCategorias();
});
</script>

<style scoped>
/* Centrar el contenedor */
.contenedor-tabla {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

/* Centrar y estilizar el título */
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8em;
  color: #333;
}

/* Estilizar la tabla */
table {
  width: 80%;
  max-width: 800px;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* Estilizar las celdas */
th, td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  font-size: 0.9em;
}

/* Estilizar los encabezados */
th {
  background-color: #FFE5A2;
  color: black;
  font-weight: bold;
}

/* Estilizar las filas */
tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Estilo del error */
.error {
  color: red;
  margin-top: 20px;
  text-align: center;
}

/* Adaptar tabla a dispositivos pequeños */
@media screen and (max-width: 768px) {
  table {
    width: 95%;
  }

  th, td {
    font-size: 0.8em;
    padding: 8px;
  }
}
</style>
