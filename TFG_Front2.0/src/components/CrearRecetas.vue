<template> 
  <div class="recipe-form-container">
    <div class="form-content">
      <div class="form-row">
        <div class="create-recipe">
          <h2>Crear Receta</h2>
          <label>Nombre de la receta</label>
          <input v-model="nuevaReceta.nombre" placeholder="Nombre de la receta" class="input-field" />

          <label>Descripción</label>
          <textarea v-model="nuevaReceta.descripcion" placeholder="Descripción" class="input-field"></textarea>

          <label>URL de la imagen</label>
          <input v-model="nuevaReceta.imagen" placeholder="URL de la imagen" class="input-field" />

          <label>¿Es vegano?</label>
          <input type="checkbox" v-model="nuevaReceta.esVegano" /> Vegano

          <label>Nivel de dificultad</label>
          <input v-model="nuevaReceta.nivelDificultad" placeholder="Nivel de dificultad" type="number" class="input-field" />

          <label>Tiempo de preparación (minutos)</label>
          <input v-model="nuevaReceta.tiempoPreparacion" placeholder="Tiempo de preparación" type="number" class="input-field" />

          <label>Categoría</label>
          <select v-model="nuevaReceta.idCategoria" class="input-field">
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="categoria in adminStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
              {{ categoria.nombreCategoria }}
            </option>
          </select>

          <div class="button-group">
            <button @click="createReceta" class="btn save-btn">Guardar Receta</button>
            <button @click="resetNuevaReceta" class="btn cancel-btn">Cancelar</button>
          </div>
        </div>

        <div class="add-ingredient">
          <summary class="form-summary">Añadir Ingrediente</summary>
          <h3>Nuevo Ingrediente</h3>
          <label>Nombre del Ingrediente</label>
          <input v-model="nuevoIngrediente.nombreIngrediente" placeholder="Nombre del ingrediente" class="input-field" />

          <label>Calorías</label>
          <input v-model="nuevoIngrediente.calorias" placeholder="Calorías" type="number" class="input-field" />

          <label>Contiene Alérgenos</label>
          <input type="checkbox" v-model="nuevoIngrediente.contieneAlergenos" />

          <label v-if="nuevoIngrediente.contieneAlergenos">Tipo de Alérgeno</label>
          <input v-if="nuevoIngrediente.contieneAlergenos" v-model="nuevoIngrediente.tipoAlergeno" placeholder="Tipo de alérgeno" class="input-field" />

          <label>Unidad de Medida</label>
          <input v-model="nuevoIngrediente.unidadMedida" placeholder="Unidad de medida" class="input-field" />

          <label>Fecha de Expiración</label>
          <input v-model="nuevoIngrediente.fechaExpiracion" type="date" class="input-field" />

          <div class="button-group">
            <button @click="guardarIngrediente" class="btn save-btn">Guardar Ingrediente</button>
            <button @click="resetIngredienteForm" class="btn cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../store/Admin';
import { useIngredientesStore } from '../store/Ingredientes';
import type { Receta } from '../store/Admin';
import type { Ingrediente } from '../store/Ingredientes';

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
  idCategoria: 0,
});

const nuevoIngrediente = ref<Ingrediente>({
  idIngrediente: 0,
  nombreIngrediente: '',
  calorias: 0,
  contieneAlergenos: false,
  tipoAlergeno: '',
  unidadMedida: '',
  fechaExpiracion: new Date().toISOString().split('T')[0],
});

// Llamar a getCategorias al montar el componente
onMounted(async () => {
  await adminStore.getCategorias();
});

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
    idCategoria: 0,
  };
};

const guardarIngrediente = async () => {
  await ingredientesStore.createIngrediente(nuevoIngrediente.value);
  resetIngredienteForm();
};

const resetIngredienteForm = () => {
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
</script>

<style scoped>
.recipe-form-container {
  max-width: 1200px;
  margin: 20px auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

.form-summary {
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
}

.form-content {
  margin-top: 15px;
}

.form-row {
  display: flex;
  flex-direction: column; /* Cambio a columna para dispositivos móviles */
  justify-content: space-between;
}

.create-recipe,
.add-ingredient {
  flex: 1; /* Ambos ocupan la misma cantidad de espacio */
  margin: 0 10px; /* Espacio entre las columnas */
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

.save-btn {
  background-color: #28a745;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

/* Estilos responsive */
@media (min-width: 600px) {
  .form-row {
    flex-direction: row; /* Cambia a fila en pantallas más grandes */
  }
}
</style>
