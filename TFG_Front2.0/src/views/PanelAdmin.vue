<template>
    <div>
      <CrearReceta />
      <GestionarIngredientes :ingredientesSeleccionados="ingredientesSeleccionados" />
      <ListaRecetas />
    </div>
  </template>
  
  <script setup lang="ts">
  import CrearReceta from '../components/CrearRecetas.vue';
  import GestionarIngredientes from '../components/GestionarIngredientes.vue';
  import ListaRecetas from '../components/ListaRecetas.vue';
  import { ref } from 'vue';
  
  const ingredientesSeleccionados = ref([]);
  </script>
  
  <style scoped>
  /* Puedes agregar estilos globales aquí si es necesario */
  </style>
  