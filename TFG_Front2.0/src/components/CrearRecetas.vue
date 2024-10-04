<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';

// Importar el store
const adminStore = useAdminStore();

// Variables locales para una nueva receta
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
const pasosSeleccionados = ref<Paso[]>([]); // Estado para gestionar pasos seleccionados

// Cargar las recetas y categorías al montar el componente
onMounted(() => {
  adminStore.getRecetas();
  adminStore.getCategorias();
});

// Función para crear una nueva receta
const createReceta = async () => {
  await adminStore.createReceta(nuevaReceta.value);
  resetNuevaReceta();
};

const resetNuevaReceta = () => {
  nuevaReceta.value = {
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
  };
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
        <label>Nombre de la receta</label>
        <input v-model="nuevaReceta.nombre" placeholder="Nombre de la receta" />

        <label>Descripción</label>
        <textarea v-model="nuevaReceta.descripcion" placeholder="Descripción"></textarea>

        <label>URL de la imagen</label>
        <input v-model="nuevaReceta.imagen" placeholder="URL de la imagen" />

        <label>¿Es vegano?</label>
        <input type="checkbox" v-model="nuevaReceta.esVegano" /> Vegano

        <label>Nivel de dificultad</label>
        <input v-model="nuevaReceta.nivelDificultad" placeholder="Nivel de dificultad" type="number" />

        <label>Tiempo de preparación (minutos)</label>
        <input v-model="nuevaReceta.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />

        <label>Categoría</label>
        <select v-model="nuevaReceta.idCategoria">
          <option v-for="categoria in adminStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
            {{ categoria.nombreCategoria }}
          </option>
        </select>

        <div class="button-group">
          <button @click="createReceta()">Guardar Receta</button>
          <button @click="resetNuevaReceta()">Cancelar</button>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
.admin-panel {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: center;
}

h1, h2 {
  margin-left: 15vh;
}

details {
  margin-bottom: 20px;
}

input, textarea, select {
  display: block;
  margin-bottom: 10px;
  width: 35%;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}
</style>
