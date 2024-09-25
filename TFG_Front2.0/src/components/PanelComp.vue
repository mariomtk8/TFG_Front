<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta } from '../store/Admin'; // Asegúrate de importar el tipo correcto

// Importar el store
const adminStore = useAdminStore();

// Variables locales
const nuevaReceta = ref<Receta>({
  idReceta: 0,
  nombre: '',
  descripcion: '',
  imagen: '',
  pasos: [],
  esVegano: false,
  fechaCreacion: new Date().toISOString(),
  nivelDificultad: 0,
  tiempoPreparacion: 0,
  idCategoria: 0
});

const recetaSeleccionada = ref<Receta | null>(null);

// Cargar las recetas al montar el componente
onMounted(() => {
  adminStore.getRecetas();
});

// Función para crear una nueva receta
const createReceta = async () => {
  await adminStore.createReceta(nuevaReceta.value);
};

// Función para seleccionar una receta y editarla
const selectReceta = (receta: Receta) => {
  recetaSeleccionada.value = { ...receta };
};

// Función para actualizar una receta seleccionada
const updateReceta = async () => {
  if (recetaSeleccionada.value) {
    await adminStore.updateReceta(recetaSeleccionada.value.idReceta, recetaSeleccionada.value);
    recetaSeleccionada.value = null;
  }
};

// Función para eliminar una receta
const deleteReceta = async (id: number) => {
  await adminStore.deleteReceta(id);
};
</script>


<template>
    <div class="admin-panel">
      <h1>Panel de Administración de Recetas</h1>
  
      <!-- Sección para Crear una nueva receta -->
      <details>
        <summary>Nueva Receta</summary>
        <div>
          <h2>Crear Receta</h2>
          <input v-model="nuevaReceta.nombre" placeholder="Nombre de la receta" />
          <textarea v-model="nuevaReceta.descripcion" placeholder="Descripción"></textarea>
          <input v-model="nuevaReceta.imagen" placeholder="URL de la imagen" />
          <input type="checkbox" v-model="nuevaReceta.esVegano" /> Vegano
          <input v-model="nuevaReceta.nivelDificultad" placeholder="Nivel de dificultad" type="number" />
          <input v-model="nuevaReceta.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />
          <input v-model="nuevaReceta.idCategoria" placeholder="ID de categoría" type="number" />
          <button @click="createReceta()">Guardar Receta</button>
        </div>
      </details>
  
      <!-- Sección para editar una receta existente -->
      <details>
        <summary>Editar Receta</summary>
        <div v-if="recetaSeleccionada">
          <h2>Editar Receta</h2>
          <input v-model="recetaSeleccionada.nombre" placeholder="Nombre de la receta" />
          <textarea v-model="recetaSeleccionada.descripcion" placeholder="Descripción"></textarea>
          <input v-model="recetaSeleccionada.imagen" placeholder="URL de la imagen" />
          <input type="checkbox" v-model="recetaSeleccionada.esVegano" /> Vegano
          <input v-model="recetaSeleccionada.nivelDificultad" placeholder="Nivel de dificultad" type="number" />
          <input v-model="recetaSeleccionada.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />
          <input v-model="recetaSeleccionada.idCategoria" placeholder="ID de categoría" type="number" />
          <button @click="updateReceta()">Guardar Cambios</button>
        </div>
  
        <!-- Listado de recetas con botón para seleccionar y editar -->
        <ul>
          <li v-for="receta in adminStore.recetas" :key="receta.idReceta">
            <h3>{{ receta.nombre }}</h3>
            <p>{{ receta.descripcion }}</p>
            <button @click="selectReceta(receta)">Editar</button>
          </li>
        </ul>
      </details>
  
      <!-- Sección para eliminar una receta -->
      <details>
        <summary>Eliminar Receta</summary>
        <div>
          <h2>Eliminar Receta</h2>
          <p>Selecciona una receta para eliminar:</p>
  
          <ul>
            <li v-for="receta in adminStore.recetas" :key="receta.idReceta">
              <h3>{{ receta.nombre }}</h3>
              <button @click="deleteReceta(receta.idReceta)">Eliminar</button>
            </li>
          </ul>
        </div>
      </details>
    </div>
  </template>
  
  <style scoped>
  .admin-panel {
    padding: 20px;
  }
  
  details {
    margin-bottom: 20px;
  }
  
  details summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  input, textarea {
    display: block;
    margin-bottom: 10px;
  }
  
  button {
    margin-top: 10px;
  }
  </style>
  
