<template>
    <div>
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
  
      <details v-if="mostrarFormularioIngrediente">
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
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useIngredientesStore } from '../store/Ingredientes';
  import type { RecetaIngrediente, Ingrediente } from '../store/Ingredientes';
  
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
  
  const addIngrediente = async () => {
    const nuevoIngrediente: RecetaIngrediente = {
      idRecetaIngrediente: 0,
      idReceta: 0, // Aquí debes pasar el ID de la receta actual
      idIngrediente: 0,
      cantidad: 1,
      notas: '',
      fechaAñadido: new Date().toISOString(),
      esOpcional: false,
    };
  
    await ingredientesStore.createIngredienteForReceta(nuevoIngrediente);
    ingredientesSeleccionados.value.push({ ...nuevoIngrediente });
  };
  
  const guardarIngrediente = async () => {
    await ingredientesStore.createIngrediente(nuevoIngrediente.value);
    cancelarIngredienteForm();
  };
  
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
  
  const deleteIngrediente = async (index: number, idRecetaIngrediente: number) => {
    if (idRecetaIngrediente) {
      await ingredientesStore.deleteIngredienteForReceta(idRecetaIngrediente);
    }
    ingredientesSeleccionados.value.splice(index, 1);
  };
  
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
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  input,
  select {
    display: block;
    margin-bottom: 10px;
    width: 100%; /* Cambiar para ocupar todo el ancho */
  }
  </style>
  