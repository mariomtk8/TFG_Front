<template>
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
                <button @click="addPaso">Añadir Paso</button>
                <button @click="manageIngredientes(receta)">Gestionar Ingredientes</button>
            </td>
        </tr>
      </tbody>
    </table>

    <details v-if="ingredientesSeleccionados.length > 0">
  <summary>Gestionar Ingredientes</summary>
  <div>
    <h2>Ingredientes de la Receta</h2>
    
    <div v-for="(ingrediente, index) in ingredientesSeleccionados" :key="index">
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
        <button @click="deleteIngrediente(index, ingrediente.idRecetaIngrediente)">Eliminar Ingrediente</button>
      </div>
    </div>

    <button @click="addIngrediente">Añadir Ingrediente</button>
    <button @click="updateIngredientes">Guardar Cambios</button>
  </div>
</details>


    <!-- Formulario para editar receta -->
    <details v-if="recetaSeleccionada">
      <summary>Editar Receta</summary>
      <div>
        <h2>Editar Receta</h2>
        <label>Nombre de la receta</label>
        <input v-model="recetaSeleccionada.nombre" placeholder="Nombre de la receta" />

        <label>Descripción</label>
        <textarea v-model="recetaSeleccionada.descripcion" placeholder="Descripción"></textarea>

        <label>URL de la imagen</label>
        <input v-model="recetaSeleccionada.imagen" placeholder="URL de la imagen" />

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

        <!-- Botones para guardar o cancelar la edición -->
        <button @click="updateReceta">Guardar cambios</button>
        <button @click="cancelEdit">Cancelar</button>
      </div>
    </details>

    <!-- Formulario para editar pasos -->
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
        <button @click="updatePaso">Guardar Paso</button>
      </div>
    </details>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';
import EditarIngredientes from './EditarIngredientes.vue';
import { useIngredientesStore } from '../store/Ingredientes';
import type { RecetaIngrediente } from '../store/Ingredientes';



// Importar el store
const adminStore = useAdminStore();
const ingredientesStore = useIngredientesStore();

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

const nuevoPaso = ref<Paso>({
  idPaso: 0, // Cambié a idPaso
  idReceta: 0,
  numero: 0,
  descripcion: '',
  imagenUrl: ''
});
const ingredientesSeleccionados = ref<RecetaIngrediente[]>([]);
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

// Función para seleccionar una receta y editarla
const selectReceta = async (receta: Receta) => {
  recetaSeleccionada.value = { ...receta };
  // Obtener los pasos de la receta seleccionada
  pasosSeleccionados.value = await adminStore.getPasosByRecetaId(receta.idReceta);
};

// Función para actualizar una receta seleccionada
const updateReceta = async () => {
  if (recetaSeleccionada.value) {
    await adminStore.updateReceta(recetaSeleccionada.value.idReceta, recetaSeleccionada.value);
    recetaSeleccionada.value = null; // Limpiar la receta seleccionada
  }
};

// Función para eliminar una receta
const deleteReceta = async (id: number) => {
  await adminStore.deleteReceta(id);
};

// Función para agregar un nuevo paso
const addPaso = async () => {
  if (recetaSeleccionada.value) {
    const paso: Paso = {
      idPaso: 0, // Asegúrate de que este ID se asigna en el servidor
      idReceta: recetaSeleccionada.value.idReceta,
      numero: pasosSeleccionados.value.length + 1,
      descripcion: '',
      imagenUrl: ''
    };
    await adminStore.createPaso(recetaSeleccionada.value.idReceta, paso); 
    pasosSeleccionados.value.push(paso);
  }
};

// Función para eliminar un paso
const deletePaso = async (index: number, idPaso: number) => {
  if (idPaso !== 0) {
    await adminStore.deletePaso(idPaso);
  }
  pasosSeleccionados.value.splice(index, 1);
};

// Función para actualizar un paso
const updatePaso = async () => {
  if (recetaSeleccionada.value) {
    for (const paso of pasosSeleccionados.value) {
      await adminStore.updatePaso(recetaSeleccionada.value.idReceta, paso);
    }
  }
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

// Función para cancelar la edición
const cancelEdit = () => {
  recetaSeleccionada.value = null;
  pasosSeleccionados.value = []; // Limpiar pasos seleccionados
};

const manageIngredientes = async (receta: Receta) => {
  recetaSeleccionada.value = receta;

  // Obtén todos los ingredientes
  await ingredientesStore.getAllIngredientes();

  // Asegúrate de que el método getIngredientesByRecetaId retorna correctamente
  await ingredientesStore.getIngredientesByRecetaId(receta.idReceta);

  // Verifica que el store contiene la lista de ingredientes
  const ingredientes = ingredientesStore.recetaIngredientes;

  // Asignar los ingredientes seleccionados
  if (Array.isArray(ingredientes) && ingredientes.length > 0) {
    ingredientesSeleccionados.value = ingredientes;
  } else {
    console.error("No se encontraron ingredientes para la receta.");
    ingredientesSeleccionados.value = [];
  }
};

// Función para añadir un ingrediente
const addIngrediente = async () => {
  const nuevoIngrediente: RecetaIngrediente = {
    idRecetaIngrediente: recetaSeleccionada.value!.idReceta,
    idReceta: recetaSeleccionada.value!.idReceta,
    idIngrediente: 0,
    cantidad: 1,
    notas: '',
    fechaAñadido: new Date().toISOString(),
    esOpcional: false,
  };
  ingredientesSeleccionados.value.push(nuevoIngrediente);
};

// Función para eliminar un ingrediente
// Función para eliminar un ingrediente utilizando idRecetaIngrediente
const deleteIngrediente = async (index: number, idRecetaIngrediente: number) => {
  await ingredientesStore.deleteIngredienteForReceta(idRecetaIngrediente);
  ingredientesSeleccionados.value.splice(index, 1);
};

// Función para actualizar o añadir ingredientes
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