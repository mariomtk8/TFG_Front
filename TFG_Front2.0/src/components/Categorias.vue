<template>
  <v-container class="contenedor-tabla" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card>
          <v-card-title class="headline">Categorías</v-card-title>

          <!-- Mensajes de carga o error -->
          <v-alert v-if="loading" type="info" class="mt-3">Cargando categorías...</v-alert>
          <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>

          <!-- Buscador centrado -->
          <v-row class="mt-3" justify="center">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="search"
                label="Buscar Categoría"
                append-icon="mdi-magnify"
                clearable
                class="mx-auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Tabla de categorías -->
          <v-data-table
            v-if="!loading && !error"
            :headers="headers"
            :items="filteredCategories"
            item-key="idCategoria"
            class="my-4"
            hide-default-footer
            :items-per-page="20"
          >
            <template v-slot:item.icono="{ item }">
              <v-img :src="item.icono" max-width="40" max-height="40" contain />
            </template>

            <template v-slot:item.nombreCategoria="{ item }">
              {{ item.nombreCategoria }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                color="#FFE5A2"
                :to="{ name: 'RecetasCat', params: { idCategoria: item.idCategoria } }"
                class="ma-2"
                depressed
              >
                Ver Recetas
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useCategoriasStore } from '../store/Categorias';

// Inicializar el store de categorías
const categoriasStore = useCategoriasStore();
const fetchCategorias = categoriasStore.fetchCategorias;
const loading = categoriasStore.loading;
const error = categoriasStore.error;

// Computed para obtener las categorías
const categoriasComputed = computed(() => categoriasStore.categorias);

// Filtros
const search = ref('');

// Computed para las categorías filtradas por búsqueda
const filteredCategories = computed(() => {
  let categories = categoriasComputed.value;

  // Filtro de búsqueda por nombre
  if (search.value) {
    categories = categories.filter(category =>
      category.nombreCategoria.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return categories;
});

// Definir los encabezados de la tabla
const headers = [
  { text: 'Icono', align: 'start', key: 'icono' },
  { text: 'Nombre', align: 'start', key: 'nombreCategoria' },
  { text: 'Acción', align: 'center', key: 'actions' }
];

// Cargar las categorías al montar el componente
onMounted(async () => {
  await fetchCategorias();
});
</script>

<style scoped>
.contenedor-tabla {
  margin-top: 5vh;
}

/* Título de la tabla */
.headline {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

/* Estilo del botón */
.v-btn {
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #FFE5A2;
  border-radius: 4px;
  text-transform: none;
}

.v-btn:hover {
  background-color: #d6b86b;
}

/* Estilizar la tabla */
.v-data-table {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilizar la tabla con bordes */
.v-data-table th,
.v-data-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  font-size: 0.9em;
}

/* Estilizar los encabezados */
.v-data-table th {
  background-color: #FFE5A2;
  color: black;
  font-weight: bold;
}

/* Estilizar las filas */
.v-data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* Responsividad */
@media (max-width: 768px) {
  .v-data-table {
    font-size: 0.8em;
  }
  .v-btn {
    font-size: 12px;
  }
  .headline {
    font-size: 1.5em;
  }
}
</style>
