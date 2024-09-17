<script setup lang="ts">
import { useRoute } from 'vue-router'; 
import { RouterView } from 'vue-router';
import Header from './components/AppHeader.vue';
import Footer from './components/footer.vue';

const route = useRoute(); 
</script>

<template>
    <Header></Header>
    <main>
    <RouterView></RouterView>
  </main>
    <Footer></Footer>
</template>