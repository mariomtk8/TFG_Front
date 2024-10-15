<template>
    <div>
      <CrearReceta></CrearReceta>
      <ListaRecetas></ListaRecetas>
      <GestionarIngredientes></GestionarIngredientes>
    </div>
  </template>
  
  <script setup lang="ts">
  import CrearReceta from '../components/CrearRecetas.vue';
  import GestionarIngredientes from '../components/GestionarIngredientes.vue';
  import ListaRecetas from '../components/ListaRecetas.vue';
  import { ref } from 'vue';
  </script>
  
  <style scoped>
  

  </style>
  