<template>
  <div>
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
          <button @click="createReceta">Guardar Receta</button>
          <button @click="resetNuevaReceta">Cancelar</button>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAdminStore } from '../store/Admin';
import type { Receta } from '../store/Admin';

const adminStore = useAdminStore();

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
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

input,
textarea,
select {
  display: block;
  margin-bottom: 10px;
  width: 100%; /* Cambiar para ocupar todo el ancho */
}
</style>
