<template>
  <div class="container">
    <!-- Campo de búsqueda -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="filterRecetas" 
        placeholder="Buscar receta por nombre"
        class="search-input"
      />
    </div>

    <!-- Tabla de recetas como desplegable -->
    <details>
      <summary class="recipes-summary">
        <span class="title">Lista de Recetas</span>
      </summary>
      
      <table class="recipes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in filteredRecetas" :key="receta.idReceta">
            <td>{{ receta.nombre }}</td>
            <td class="action-buttons">
              <button class="btn edit-btn" @click="selectReceta(receta)">Editar</button>
              <button class="btn delete-btn" @click="deleteReceta(receta.idReceta)">Eliminar</button>
              <button class="btn add-step-btn" @click="addPaso">Añadir Paso</button>
            </td>
          </tr>
        </tbody>
      </table>
    </details>

    <!-- Formulario para editar receta -->
    <div v-if="recetaEditar" class="edit-section">
      <details open>
        <summary class="summary-title">Editar Receta</summary>
        <div class="form-container">
          <label>Nombre de la receta</label>
          <input v-model="recetaEditar.nombre" placeholder="Nombre de la receta" />

          <label>Descripción</label>
          <textarea v-model="recetaEditar.descripcion" placeholder="Descripción"></textarea>

          <label>URL de la imagen</label>
          <input v-model="recetaEditar.imagen" placeholder="URL de la imagen" />

          <label>¿Es vegano?</label>
          <input type="checkbox" v-model="recetaEditar.esVegano" /> Vegano

          <label>Nivel de dificultad</label>
          <input v-model="recetaEditar.nivelDificultad" placeholder="Nivel de dificultad" type="number" />

          <label>Tiempo de preparación (minutos)</label>
          <input v-model="recetaEditar.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />

          <div class="form-buttons">
            <button class="btn save-btn" @click="updateReceta">Guardar Cambios</button>
            <button class="btn cancel-btn" @click="cancelarEdicion">Cancelar</button>
          </div>
        </div>
      </details>
    </div>

    <!-- Sección para editar pasos -->
    <div v-if="pasosSeleccionados.length > 0" class="edit-steps-section">
      <details open>
        <summary class="summary-title">Editar Pasos</summary>
        <div class="form-container">
          <div v-for="(paso, index) in pasosSeleccionados" :key="paso.idPaso" class="step-item">
            <label>Número del Paso</label>
            <input v-model="paso.numero" placeholder="Número del Paso" />

            <label>Descripción del Paso</label>
            <input v-model="paso.descripcion" placeholder="Descripción del paso" />

            <label>URL de la imagen del Paso</label>
            <input v-model="paso.imagenUrl" placeholder="URL de la imagen del paso" />

            <div class="button-group">
              <button class="btn delete-btn" @click="deletePaso(index, paso.idPaso)">Eliminar Paso</button>
            </div>
          </div>
          <div class="form-buttons">
            <button class="btn add-step-btn" @click="addPaso">Añadir Paso</button>
            <button class="btn save-btn" @click="updatePaso">Guardar Pasos</button>
            <button class="btn cancel-btn" @click="cancelarEdicion">Cancelar</button>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';

// Stores
const adminStore = useAdminStore();

// Refs
const recetaEditar = ref<Receta | null>(null);
const pasosSeleccionados = ref<Paso[]>([]);
const searchQuery = ref(''); // Query para buscar recetas
const filteredRecetas = ref<Receta[]>([]); // Recetas filtradas

// On Mounted
onMounted(async () => {
  await adminStore.getRecetas();
  filteredRecetas.value = adminStore.recetas; // Inicializa con todas las recetas
});

// Función para seleccionar una receta y editarla
const selectReceta = async (receta: Receta) => {
  recetaEditar.value = { ...receta };
  pasosSeleccionados.value = await adminStore.getPasosByRecetaId(receta.idReceta);
};

// Función para actualizar la receta
const updateReceta = async () => {
  if (recetaEditar.value) {
    await adminStore.updateReceta(recetaEditar.value.idReceta, recetaEditar.value);
    recetaEditar.value = null;
    pasosSeleccionados.value = [];
  }
};

// Función para eliminar una receta
const deleteReceta = async (idReceta: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
    await adminStore.deleteReceta(idReceta);
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  recetaEditar.value = null;
  pasosSeleccionados.value = [];
};

// Añadir un nuevo paso
const addPaso = async () => {
  if (recetaEditar.value) {
    const paso: Paso = {
      idPaso: 0,
      idReceta: recetaEditar.value.idReceta,
      numero: pasosSeleccionados.value.length + 1,
      descripcion: '',
      imagenUrl: ''
    };
    await adminStore.createPaso(recetaEditar.value.idReceta, paso);
    pasosSeleccionados.value.push(paso);
  }
};

// Eliminar un paso
const deletePaso = async (index: number, idPaso: number) => {
  if (idPaso !== 0) {
    await adminStore.deletePaso(idPaso);
  }
  pasosSeleccionados.value.splice(index, 1);
};

// Actualizar pasos
const updatePaso = async () => {
  if (recetaEditar.value) {
    for (const paso of pasosSeleccionados.value) {
      await adminStore.updatePaso(recetaEditar.value.idReceta, paso);
    }
  }
};

// Filtrar recetas según la búsqueda
const filterRecetas = async () => {
  if (searchQuery.value.trim() === '') {
    filteredRecetas.value = adminStore.recetas; // Muestra todas si no hay búsqueda
  } else {
    await adminStore.searchRecetas(searchQuery.value);
    filteredRecetas.value = adminStore.resultadosBusqueda; // Actualiza con resultados de búsqueda
  }
};
</script>


<style scoped>


.title {
    font-weight: bold;
    cursor: pointer;
  
  
}
.search-container {
  margin: 20px auto;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.recipes-summary {
  cursor: pointer;
  max-width: 600px;
  margin: 20px auto;
  font-size: 1.5em;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.recipes-table {
  width: 100%;
  border-collapse: collapse;
    font-weight: bold;
    max-width: 900px;
    margin: 20px auto;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    margin-top: -2px;
}

.recipes-table th,
.recipes-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.recipes-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.add-step-btn {
  background-color: #28a745;
  color: white;
}

.edit-section,
.edit-steps-section {
  font-weight: bold;
    max-width: 1000px;
    margin: 20px auto;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    margin-top: -2px;
}

.form-container {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 18px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
