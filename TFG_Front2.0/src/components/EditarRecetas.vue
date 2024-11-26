<template>
  <div class="admin-panel">
    

    <div class="side-panel left-panel">
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
      
      <details mostrarFormularioIngrediente>
        <summary>Añadir Nuevo Ingrediente</summary>
        <div>
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

          <button @click="guardarIngrediente">Guardar Ingrediente</button>
          <button @click="cancelarIngredienteForm">Cancelar</button>
        </div>
      </details>
    </div>

    <div class="content">
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
          <input type="checkbox" v-model="recetaSeleccionada.esVegano" /> Vegano

          <label>Nivel de dificultad</label>
          <input v-model="recetaSeleccionada.nivelDificultad" placeholder="Nivel de dificultad" type="number" />

          <label>Tiempo de preparación (minutos)</label>
          <input v-model="recetaSeleccionada.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" />

          <label>Categoría</label>
          <select v-model="recetaSeleccionada.idCategoria">
            <option v-for="categoria in adminStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
              {{ categoria.nombreCategoria }}
            </option>
          </select>

          <div class="button-group">
            <button @click="updateReceta">Guardar cambios</button>
            <button @click="cancelEdit">Cancelar</button>
          </div>
        </div>
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
          <button @click="updatePaso">Guardar Paso</button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta, Paso } from '../store/Admin';
import EditarIngredientes from './EditarIngredientes.vue';
import { useIngredientesStore } from '../store/Ingredientes';
import type { RecetaIngrediente, Ingrediente } from '../store/Ingredientes';


const adminStore = useAdminStore();
const ingredientesStore = useIngredientesStore();
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
onMounted(() => {
  adminStore.getRecetas();
  adminStore.getCategorias();
});

// Función para crear una nueva receta
const createReceta = async () => {
  await adminStore.createReceta(nuevaReceta.value);
  resetNuevaReceta();
};

// Nuevas propiedades para el formulario de ingredientes
const mostrarFormularioIngrediente = ref(false);
const nuevoIngrediente = ref<Ingrediente>({
  idIngrediente: 0,
  nombreIngrediente: '',
  calorias: 0,
  contieneAlergenos: false,
  tipoAlergeno: '',
  unidadMedida: '',
  fechaExpiracion: new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
});


const nuevoPaso = ref<Paso>({
  idPaso: 0, 
  idReceta: 0,
  numero: 0,
  descripcion: '',
  imagenUrl: ''
});
const ingredientesSeleccionados = ref<RecetaIngrediente[]>([]);
const recetaSeleccionada = ref<Receta | null>(null);
const pasosSeleccionados = ref<Paso[]>([]); 

onMounted(() => {
  adminStore.getRecetas();
  adminStore.getCategorias();
});

//  seleccionar una receta y editarla
const selectReceta = async (receta: Receta) => {
  recetaSeleccionada.value = { ...receta };
  // Obtener los pasos de la receta seleccionada
  pasosSeleccionados.value = await adminStore.getPasosByRecetaId(receta.idReceta);
  console.log(receta.idReceta)
};

// actualizar una receta seleccionada
const updateReceta = async () => {
  if (recetaSeleccionada.value) {
    await adminStore.updateReceta(recetaSeleccionada.value.idReceta, recetaSeleccionada.value);
    recetaSeleccionada.value = null; // Limpiar la receta seleccionada
  }
};

//  eliminar una receta
const deleteReceta = async (id: number) => {
  await adminStore.deleteReceta(id);
};

// nuevo paso
const addPaso = async () => {
  if (recetaSeleccionada.value) {
    const paso: Paso = {
      idPaso: 0, 
      idReceta: recetaSeleccionada.value.idReceta,
      numero: pasosSeleccionados.value.length + 1,
      descripcion: '',
      imagenUrl: ''
    };
    await adminStore.createPaso(recetaSeleccionada.value.idReceta, paso); 
    pasosSeleccionados.value.push(paso);
  }
};

//eliminar un paso
const deletePaso = async (index: number, idPaso: number) => {
  if (idPaso !== 0) {
    await adminStore.deletePaso(idPaso);
  }
  pasosSeleccionados.value.splice(index, 1);
};

// a actualizar un paso
const updatePaso = async () => {
  if (recetaSeleccionada.value) {
    for (const paso of pasosSeleccionados.value) {
      await adminStore.updatePaso(recetaSeleccionada.value.idReceta, paso);
    }
  }
};

// limpiar los campos de nueva receta
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

// cancelar la edición
const cancelEdit = () => {
  recetaSeleccionada.value = null;
  pasosSeleccionados.value = []; 
};

const manageIngredientes = async (receta: Receta) => {
  recetaSeleccionada.value = receta;

  await ingredientesStore.getAllIngredientes();

  await ingredientesStore.getIngredientesByRecetaId(receta.idReceta);

  ingredientesSeleccionados.value = ingredientesStore.recetaIngredientes;
};


// Función para añadir un nuevo ingrediente
const addIngrediente = async () => {
  const nuevoIngrediente: RecetaIngrediente = {
    idRecetaIngrediente: 0,  
    idReceta: recetaSeleccionada.value!.idReceta,
    idIngrediente: 0,  
    cantidad: 1,
    notas: '',
    fechaAñadido: new Date().toISOString(),
    esOpcional: false,
  };

  await ingredientesStore.createIngredienteForReceta(nuevoIngrediente);

  ingredientesSeleccionados.value.push({ ...nuevoIngrediente });
};

// Función para guardar un nuevo ingrediente
const guardarIngrediente = async () => {
  await ingredientesStore.createIngrediente(nuevoIngrediente.value);
  await ingredientesStore.getAllIngredientes();
  cancelarIngredienteForm(); // Ocultar formulario después de guardar
};

// Función para alternar el formulario de nuevo ingrediente
const toggleIngredienteForm = () => {
  mostrarFormularioIngrediente.value = !mostrarFormularioIngrediente.value;
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

// Función para actualizar o añadir ingredientes
const updateIngredientes = async () => {
  for (const ingrediente of ingredientesSeleccionados.value) {
    if (!ingrediente.idRecetaIngrediente) {
      // Si el ingrediente no tiene un id, es uno nuevo
      await ingredientesStore.createIngredienteForReceta(ingrediente);
    } else {
      // Si ya tiene id, actualiza el ingrediente existente
      await ingredientesStore.updateIngredienteForReceta(ingrediente);
    }
  }
};

// Función para eliminar un ingrediente
const deleteIngrediente = async (index: number, idRecetaIngrediente: number) => {
  if (idRecetaIngrediente) {
    await ingredientesStore.deleteIngredienteForReceta(idRecetaIngrediente);
  }
  ingredientesSeleccionados.value.splice(index, 1);
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

.admin-panel {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.side-panel {
  flex: 1;
  margin: 10px;
  padding: 10px;
  background-color: #f0f0f0;
}

.content {
  flex: 2;
  margin: 10px;
  padding: 10px;
  background-color: #ffffff;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
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