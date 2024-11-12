<script setup lang="ts">
import { useRoute } from 'vue-router'; 
import { RouterView } from 'vue-router';
import Header from './components/AppHeader.vue';
import Footer from './components/footer.vue';

const route = useRoute(); 
</script>

<template>
    <Header v-if="route.name !== 'Login' && route.name !== 'Register'"></Header>
    <main>
    <RouterView></RouterView>
  </main>
  <Footer v-if="route.name !== 'Login' && route.name !== 'Register'"></Footer>
</template>

<style>
a{
  text-decoration: none;
  color: black;
  
}
</style>