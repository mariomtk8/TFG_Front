<template>
  <div class="container">
    <!-- Sidebar para navegar entre las secciones -->
    <aside class="sidebar">
      <button @click="currentSection = 'crear'" :class="{ active: currentSection === 'crear' }">Crear Receta</button>
      <button @click="currentSection = 'lista'" :class="{ active: currentSection === 'lista' }">Lista de Recetas</button>
      <button @click="currentSection = 'gestionar'" :class="{ active: currentSection === 'gestionar' }">Gestionar Ingredientes</button>
    </aside>

    <!-- Área de contenido principal -->
    <main class="content">
      <CrearReceta v-if="currentSection === 'crear'" />
      <ListaRecetas v-if="currentSection === 'lista'" />
      <GestionarIngredientes v-if="currentSection === 'gestionar'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CrearReceta from '../components/CrearRecetas.vue';
import ListaRecetas from '../components/ListaRecetas.vue';
import GestionarIngredientes from '../components/GestionarIngredientes.vue';

const currentSection = ref('crear'); // Controla la sección visible
</script>

<style scoped>

.container {
  display: flex;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar button {
  background-color: transparent;
  color: #ecf0f1;
  border: none;
  padding: 10px 15px;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.sidebar button.active,
.sidebar button:hover {
  background-color: #3498db;
  color: white;
  border-radius: 4px;
}

/* Área de contenido */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f4f4f4;
  border-left: 1px solid #ddd;
}
</style>
