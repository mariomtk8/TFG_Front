<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta } from '../store/Admin'; 

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

// Función para seleccionar una receta y editarla
const selectReceta = (receta: Receta) => {
  recetaSeleccionada.value = { ...receta };
};

// Función para actualizar una receta seleccionada
const updateReceta = async () => {
  if (recetaSeleccionada.value) {
    await adminStore.updateReceta(recetaSeleccionada.value.idReceta, recetaSeleccionada.value);
    recetaSeleccionada.value = recetaSeleccionada;
  }
};

// Función para eliminar una receta
const deleteReceta = async (id: number) => {
  await adminStore.deleteReceta(id);
};

// Función para limpiar los campos de nueva receta
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

// Función para cancelar edición
const cancelEdit = () => {
  recetaSeleccionada.value = null;
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

    <!-- Tabla con las recetas -->
    <h2>Lista de Recetas</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="receta in adminStore.recetas" :key="receta.idReceta">
          <td>{{ receta.nombre }}</td>
          <td>{{ receta.descripcion }}</td>
          <td>
            <button @click="selectReceta(receta)">Editar</button>
            <button @click="deleteReceta(receta.idReceta)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario para editar receta -->
    <details v-if="recetaSeleccionada">
      <summary>Editar Receta</summary>
      <div>
        <h2>Editar Receta</h2>
        <input v-model="recetaSeleccionada.nombre" placeholder="Nombre de la receta" />
        <textarea v-model="recetaSeleccionada.descripcion" placeholder="Descripción"></textarea>
        <input v-model="recetaSeleccionada.imagen" placeholder="URL de la imagen" />
        <input type="checkbox" v-model="recetaSeleccionada.esVegano" /> Vegano
        <input v-model="recetaSeleccionada.nivelDificultad" placeholder="Nivel de dificultad" type="number" />
        <input v-model="recetaSeleccionada.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />
        <select v-model="recetaSeleccionada.idCategoria">
          <option v-for="categoria in adminStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
            {{ categoria.nombreCategoria }}
          </option>
        </select>

        <!-- Gestión de los pasos -->
        <div v-for="(paso, index) in recetaSeleccionada.pasos" :key="index">
          <h3>Paso {{ paso.numero }}</h3>
          <input v-model="paso.descripcion" placeholder="Descripción del paso" />
          <input v-model="paso.imagenUrl" placeholder="URL de la imagen del paso" />
        </div>

        <div class="button-group">
          <button @click="updateReceta()">Guardar Cambios</button>
          <button @click="cancelEdit()">Cancelar</button>
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
h1, h2{
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
