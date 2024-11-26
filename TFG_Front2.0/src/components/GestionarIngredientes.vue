<template>
  <div class="container">
    <!-- Campo de búsqueda -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="filterRecetas" 
        placeholder="Buscar receta por nombre"
        class="search-input"/>   

    <!-- Lista de recetas -->
    <div class="recipes-list">
      <table class="recipes-table">
        <thead>
          <tr>
            <th>Nombre de la Receta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="receta in filteredRecetas" :key="receta.idReceta">
            <td>{{ receta.nombre }}</td>
            <td>
              <button class="btn manage-btn" @click="manageIngredientes(receta)">Gestionar Ingredientes</button>
            </td>
          </tr>
          <tr v-if="filteredRecetas.length === 0">
            <td colspan="2">No se encontraron recetas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

    <!-- Formulario de gestión de ingredientes y nuevo ingrediente -->
    <div class="form-section">
      <div v-if="recetaSeleccionada" class="ingredients-section">
        <h2 class="title">Ingredientes de la Receta: {{ recetaSeleccionada.nombre }}</h2>

        <!-- Lista de ingredientes de la receta seleccionada -->
        <div v-for="(ingrediente, index) in ingredientesSeleccionados" :key="index" class="ingredient-item">
          <label>Ingrediente</label>
          <select v-model="ingrediente.idIngrediente">
            <option v-for="ing in ingredientesStore.ingredientes" :key="ing.idIngrediente" :value="ing.idIngrediente">
              {{ ing.nombreIngrediente }}
            </option>
          </select>

          <label>Cantidad</label>
          <input v-model="ingrediente.cantidad" placeholder="Cantidad" />

          <label>Notas</label>
          <input v-model="ingrediente.notas" placeholder="Notas" />

          <label>¿Es opcional?</label>
          <input type="checkbox" v-model="ingrediente.esOpcional" />

          <div class="button-group">
            <button class="btn delete-btn" @click="deleteIngrediente(index, ingrediente.idRecetaIngrediente)">Eliminar Ingrediente</button>
          </div>
        </div>

        <div class="form-buttons">
          <button class="btn add-ingredient-btn" @click="addIngrediente">Añadir Ingrediente</button>
          <button class="btn save-btn" @click="updateIngredientes">Guardar Cambios</button>
          <button class="btn cancel-btn" @click="cancelarIngredientes">Cancelar</button>
        </div>
      </div>

      <!-- Formulario para añadir nuevo ingrediente -->
      <div v-if="mostrarFormularioIngrediente" class="new-ingredient-form">
        <h2>Nuevo Ingrediente</h2>

        <label>Nombre del Ingrediente</label>
        <input v-model="nuevoIngrediente.nombreIngrediente" placeholder="Nombre del ingrediente" />

        <label>Calorías</label>
        <input v-model="nuevoIngrediente.calorias" placeholder="Calorías" type="number" />

        <label>Contiene Alérgenos</label>
        <input type="checkbox" v-model="nuevoIngrediente.contieneAlergenos" />

        <label v-if="nuevoIngrediente.contieneAlergenos">Tipo de Alérgeno</label>
        <input v-if="nuevoIngrediente.contieneAlergenos" v-model="nuevoIngrediente.tipoAlergeno" placeholder="Tipo de alérgeno" />

        <label>Unidad de Medida</label>
        <input v-model="nuevoIngrediente.unidadMedida" placeholder="Unidad de medida" />

        <label>Fecha de Expiración</label>
        <input v-model="nuevoIngrediente.fechaExpiracion" type="date" />

        <div class="form-buttons">
          <button class="btn save-btn" @click="guardarIngrediente">Guardar Ingrediente</button>
          <button class="btn cancel-btn" @click="cancelarIngredienteForm">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useIngredientesStore } from '../store/Ingredientes';
import { useAdminStore } from '../store/Admin';
import type { RecetaIngrediente, Ingrediente } from '../store/Ingredientes';
import type { Receta } from '../store/Admin';

const adminStore = useAdminStore();
const searchQuery = ref('');
const filteredRecetas = ref<Receta[]>([]);
const recetaSeleccionada = ref<Receta | null>(null);
const ingredientesStore = useIngredientesStore();
const ingredientesSeleccionados = ref<RecetaIngrediente[]>([]);
const mostrarFormularioIngrediente = ref(false);
const nuevoIngrediente = ref<Ingrediente>({
  idIngrediente: 0,
  nombreIngrediente: '',
  calorias: 0,
  contieneAlergenos: false,
  tipoAlergeno: '',
  unidadMedida: '',
  fechaExpiracion: new Date().toISOString().split('T')[0],
});

const filterRecetas = async () => {
  if (searchQuery.value.trim() === '') {
    filteredRecetas.value = adminStore.recetas;
  } else {
    await adminStore.searchRecetas(searchQuery.value);
    filteredRecetas.value = adminStore.resultadosBusqueda;
  }
};

onMounted(async () => {
  await adminStore.getRecetas();
  filteredRecetas.value = adminStore.recetas;
});

// Función para gestionar los ingredientes de una receta
const manageIngredientes = async (receta: Receta) => {
  recetaSeleccionada.value = receta;

  await ingredientesStore.getAllIngredientes();
  
  await ingredientesStore.getIngredientesByRecetaId(receta.idReceta);

  ingredientesSeleccionados.value = ingredientesStore.recetaIngredientes;
};

// Función para añadir un nuevo ingrediente a la receta
const addIngrediente = async () => {
  const nuevoIngrediente: RecetaIngrediente = {
    idRecetaIngrediente: 0,
    idReceta: recetaSeleccionada.value ? recetaSeleccionada.value.idReceta : 0, 
    idIngrediente: 0,
    cantidad: 0,
    notas: '',
    fechaAñadido: new Date().toISOString(),
    esOpcional: false,
  };

  await ingredientesStore.updateIngredienteForReceta(nuevoIngrediente);
  ingredientesSeleccionados.value.push({ ...nuevoIngrediente });
};

// Función para guardar un nuevo ingrediente
const guardarIngrediente = async () => {
  await ingredientesStore.createIngrediente(nuevoIngrediente.value);
  cancelarIngredienteForm();
};

// Función para cancelar la edición de los ingredientes de la receta
const cancelarIngredientes = () => {
  recetaSeleccionada.value = null;
  ingredientesSeleccionados.value = [];
};

// Función para cancelar el formulario de nuevo ingrediente
const cancelarIngredienteForm = () => {
  mostrarFormularioIngrediente.value = false;
  nuevoIngrediente.value = {
    idIngrediente: 0,
    nombreIngrediente: '',
    calorias: 0,
    contieneAlergenos: false,
    tipoAlergeno: '',
    unidadMedida: '',
    fechaExpiracion: new Date().toISOString().split('T')[0],
  };
};

// Función para eliminar un ingrediente
const deleteIngrediente = async (index: number, idRecetaIngrediente: number) => {
  if (idRecetaIngrediente) {
    await ingredientesStore.deleteIngredienteForReceta(idRecetaIngrediente);
  }
  ingredientesSeleccionados.value.splice(index, 1);
};

// Función para actualizar los ingredientes
const updateIngredientes = async () => {
  for (const ingrediente of ingredientesSeleccionados.value) {
    if (!ingrediente.idRecetaIngrediente) {
      await ingredientesStore.createIngredienteForReceta(ingrediente);
    } else {
      await ingredientesStore.updateIngredienteForReceta(ingrediente);
    }
  }
};
</script>

<style scoped>

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.search-container {
  margin: 20px auto;
  max-width: 600px;
}
.search-input {
  width: 80%;
  margin-left: 2vh;
  margin-bottom: 3vh;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}
th {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
}

.recipes-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
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
.form-section{
  margin-right: 10vh;
  margin-top: 5vh;
}

.ingredients-section {
    font-weight: bold;
    max-width: 1000px;
    margin: 20px auto;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    margin-top: -2px;
}

.ingredient-item {
  margin-bottom: 15px;
}

/* Estilos para botones */
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2c3e50;
  color:white;
}

.manage-btn {
  background-color: #2c3e50;
  color: white;
}

.add-ingredient-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

/* Estilos para grupo de botones */
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; 
}

.form-buttons { 
  display: flex; 
  justify-content: space-between; 
  margin-top: 20px; 
}

.summary-title { 
  cursor: pointer; 
  font-weight: bold; 
  font-size: 1.5em;
  max-width: 600px;
    margin: 20px auto;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    margin-top: -2px;
}

@media (max-width: 768px) {
  .recipes-table {
    font-size: 14px; /* Ajusta el tamaño de fuente para pantallas pequeñas */
  }

  .btn {
    width: 100%; /* Botones ocupan todo el ancho en pantallas pequeñas */
    margin-bottom: 10px; /* Espacio entre botones */
  }

  .form-buttons {
    flex-direction: column; /* Coloca los botones en columna */
    align-items: stretch; /* Estira los botones para ocupar todo el ancho */
  }

  .search-input {
    margin-bottom: 15px; /* Espacio adicional en pantallas pequeñas */
  }

  .ingredient-item label {
    display: block; /* Muestra etiquetas en bloque */
    margin-top: 10px; /* Espacio entre etiquetas y campos */
  }
}
</style>
