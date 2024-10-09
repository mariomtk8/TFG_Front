<template>
  <div>
    <h2>Lista de Recetas</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Recetas</th>
          <th>Ingredientes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="receta in adminStore.recetas" :key="receta.idReceta">
          <td>{{ receta.nombre }}</td>
          <td>
            <button @click="selectReceta(receta)">Editar</button>
            <button @click="deleteReceta(receta.idReceta)">Eliminar</button>
            <button @click="addPaso">Añadir Paso</button>
          </td>
          <td>
            <button @click="manageIngredientes(receta)">
              Gestionar Ingredientes
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- El desplegable aparece aquí fuera de la tabla -->
    <GestionarIngredientes
      v-if="recetaSeleccionada"
      :receta="recetaSeleccionada"
      :ingredientes="ingredientesSeleccionados"
    />
  </div>
  
  <details v-if="recetaEditar">
    <summary>Editar Receta</summary>
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

    <button @click="updateReceta">Guardar Cambios</button>
    <button @click="cancelarEdicion">Cancelar</button>
  </details>

  <details v-if="pasosSeleccionados.length > 0">
    <summary>Editar Pasos</summary>
    <div>
      <h2>Editar Pasos</h2>
      <div v-for="(paso, index) in pasosSeleccionados" :key="paso.idPaso">
        <label>Número del Paso</label>
        <input v-model="paso.numero" placeholder="Número del Paso" />
        
        <label>Descripción del Paso</label>
        <input v-model="paso.descripcion" placeholder="Descripción del paso" />
        
        <label>URL de la imagen del Paso</label>
        <input v-model="paso.imagenUrl" placeholder="URL de la imagen del paso" />
        
        <div class="button-group">
          <button @click="deletePaso(index, paso.idPaso)">Eliminar Paso</button>
        </div>
      </div>
      <button @click="addPaso">Añadir Paso</button>
      <button @click="updatePaso">Guardar Pasos</button>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';
import { useIngredientesStore } from '../store/Ingredientes';
import type { RecetaIngrediente } from '../store/Ingredientes';
import GestionarIngredientes from './GestionarIngredientes.vue';

// Stores
const adminStore = useAdminStore();
const ingredientesStore = useIngredientesStore();

// Refs
const recetaEditar = ref<Receta | null>(null);
const pasosSeleccionados = ref<Paso[]>([]);
const recetaSeleccionada = ref<Receta | null>(null);
const ingredientesSeleccionados = ref<RecetaIngrediente[]>([]);

// On Mounted
onMounted(() => {
  adminStore.getRecetas();
  adminStore.getCategorias();
});

// Función para gestionar los ingredientes de una receta
const manageIngredientes = async (receta: Receta) => {
  recetaSeleccionada.value = receta;

  // Obtén todos los ingredientes
  await ingredientesStore.getAllIngredientes();

  // Obtén los ingredientes de la receta seleccionada
  await ingredientesStore.getIngredientesByRecetaId(receta.idReceta);

  // Asignar los ingredientes seleccionados
  ingredientesSeleccionados.value = ingredientesStore.recetaIngredientes;
};

// Función para seleccionar una receta y editarla
const selectReceta = async (receta: Receta) => {
  recetaEditar.value = { ...receta };
  // Obtener los pasos de la receta seleccionada
  pasosSeleccionados.value = await adminStore.getPasosByRecetaId(receta.idReceta);
};

// Función para actualizar la receta
const updateReceta = async () => {
  if (recetaEditar.value) {
    await adminStore.updateReceta(recetaEditar.value.idReceta, recetaEditar.value);
    recetaEditar.value = null; // Limpiar la receta seleccionada
    pasosSeleccionados.value = []; // Limpiar los pasos seleccionados al actualizar la receta
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
  recetaEditar.value = null; // Limpiar la receta en edición
  pasosSeleccionados.value = []; // Limpiar los pasos seleccionados
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
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

input,
textarea {
  display: block;
  margin-bottom: 10px;
  width: 100%; /* Cambiar para ocupar todo el ancho */
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
