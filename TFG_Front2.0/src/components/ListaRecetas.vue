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

    <div class="content">
      <!-- Lista fija de recetas -->
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
              <button class="btn add-step-btn1" @click="addPaso">Añadir Paso</button>
            </td>
          </tr>
          <tr v-if="filteredRecetas.length === 0">
            <td colspan="2">No se encontraron recetas.</td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario para editar receta -->
      <div v-if="recetaEditar" class="edit-section">
        <h3>Editar Receta</h3>
        <div class="form-container">
          <div class="form-group">
            <label for="nombreReceta">Nombre de la receta</label>
            <input id="nombreReceta" v-model="recetaEditar.nombre" placeholder="Nombre de la receta" />
          </div>

          <div class="form-group">
            <label for="descripcionReceta">Descripción</label>
            <textarea id="descripcionReceta" v-model="recetaEditar.descripcion" placeholder="Descripción"></textarea>
          </div>

          <div class="form-group">
            <label for="imagenReceta">URL de la imagen</label>
            <input id="imagenReceta" v-model="recetaEditar.imagen" placeholder="URL de la imagen" />
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="recetaEditar.esVegano" /> ¿Es vegano?
            </label>
          </div>

          <div class="form-group">
            <label for="nivelDificultad">Nivel de dificultad</label>
            <input id="nivelDificultad" v-model="recetaEditar.nivelDificultad" placeholder="Nivel de dificultad" type="number" />
          </div>

          <div class="form-group">
            <label for="tiempoPreparacion">Tiempo de preparación (minutos)</label>
            <input id="tiempoPreparacion" v-model="recetaEditar.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />
          </div>
          <div class="form-group">
            <label for="categoriaReceta">Categoría</label>
            <select id="categoriaReceta" v-model="recetaEditar.idCategoria">
              <option v-for="categoria in adminStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
                {{ categoria.nombreCategoria }}
              </option>
            </select>
          </div>

          <div class="form-buttons">
            <button class="btn save-btn" @click="updateReceta">Guardar Cambios</button>
            <button class="btn cancel-btn" @click="cancelarEdicion">Cancelar</button>
          </div>
        </div>
      </div>

      <!-- Sección para editar pasos -->
      <div v-if="pasosSeleccionados.length > 0" class="edit-steps-section">
        <h3>Editar Pasos</h3>
        <div class="form-container">
          <div v-for="(paso, index) in pasosSeleccionados" :key="paso.idPaso" class="step-item">
            <div class="form-group">
              <label for="numeroPaso-{{ index }}">Número del Paso</label>
              <input id="numeroPaso-{{ index }}" v-model="paso.numero" placeholder="Número del Paso" />
            </div>

            <div class="form-group">
              <label for="descripcionPaso-{{ index }}">Descripción del Paso</label>
              <textarea id="descripcionPaso-{{ index }}" v-model="paso.descripcion" placeholder="Descripción del paso"></textarea>
            </div>

            <div class="form-group">
              <label for="imagenPaso-{{ index }}">URL de la imagen del Paso</label>
              <input id="imagenPaso-{{ index }}" v-model="paso.imagenUrl" placeholder="URL de la imagen del paso" />
            </div>

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';

const adminStore = useAdminStore();
const recetaEditar = ref<Receta | null>(null);
const pasosSeleccionados = ref<Paso[]>([]);
const searchQuery = ref('');
const filteredRecetas = ref<Receta[]>([]);

onMounted(async () => {
  await adminStore.getRecetas();
  filteredRecetas.value = adminStore.recetas;
  await adminStore.getCategorias();
});

const selectReceta = async (receta: Receta) => {
  recetaEditar.value = { ...receta };
  pasosSeleccionados.value = await adminStore.getPasosByRecetaId(receta.idReceta);
};

const updateReceta = async () => {
  if (recetaEditar.value) {
    await adminStore.updateReceta(recetaEditar.value.idReceta, recetaEditar.value);
    recetaEditar.value = null;
    pasosSeleccionados.value = [];
    await filterRecetas();
  }
};

const deleteReceta = async (idReceta: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
    await adminStore.deleteReceta(idReceta);
    await filterRecetas();
  }
};

const cancelarEdicion = () => {
  recetaEditar.value = null;
  pasosSeleccionados.value = [];
};

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

const deletePaso = async (index: number, idPaso: number) => {
  if (idPaso !== 0) {
    await adminStore.deletePaso(idPaso);
  }
  pasosSeleccionados.value.splice(index, 1);
};

const updatePaso = async () => {
  if (recetaEditar.value) {
    for (const paso of pasosSeleccionados.value) {
      await adminStore.updatePaso(recetaEditar.value.idReceta, paso);
    }
  }
};

const filterRecetas = async () => {
  if (searchQuery.value.trim() === '') {
    filteredRecetas.value = adminStore.recetas;
  } else {
    await adminStore.searchRecetas(searchQuery.value);
    filteredRecetas.value = adminStore.resultadosBusqueda;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.content {
  display: flex;
  justify-content: center; 
  width: 100%;
  max-width: 1500px;
}

.recipes-table {
  width: 60%;
  border-collapse: collapse;
  margin: 20px auto; 
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

th {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
}

td {
  padding: 10px;
  border: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-section, .edit-steps-section {
  margin: 20px;
  width: 35%;
}

.form-container {
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin: 10px;
}

.form-group input, 
.form-group textarea {
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons, .button-group {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2c3e50;
  color:white;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}


.add-step-btn {
  margin-top: 3vh;
  background-color: #2c3e50;
  color: white;
}
</style>
