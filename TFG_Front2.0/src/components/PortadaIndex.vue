<template>
  <section class="portada">
    <div class="overlay">
      <h1>{{ $t('portada.title') }}</h1>
      <p>{{ $t('portada.description') }}</p>
      <button @click="goToExplore" class="explorar-btn">
        {{ $t('portada.button') }}
      </button>
    </div>
  </section>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useRecetasStore } from '../store/Recetas'; 

const router = useRouter();
const recetasStore = useRecetasStore();

const goToExplore = async () => {
  try {
    await recetasStore.fetchRecetas(); 
    const recetas = recetasStore.resultadosBusqueda; 

    if (recetas.length > 0) {
      const randomIndex = Math.floor(Math.random() * recetas.length); 
      const randomReceta = recetas[randomIndex]; 
      router.push(`/Recetas/${randomReceta.idReceta}`); 
    } else {
      console.error('No hay recetas disponibles.');
    }
  } catch (error) {
    console.error('Error al redirigir a una receta aleatoria:', error);
  }
};
</script>

<style scoped>
.portada {
  background-image: url('https://recetasdecocina.elmundo.es/wp-content/uploads/2022/07/que-comer-hoy-recetas-ideas.jpg');
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.6); 
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

.overlay h1 {
  font-size: 3em;
  margin-bottom: 10px;
  font-weight: bold;
}

.overlay p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.explorar-btn {
  padding: 10px 20px;
  background-color: #FF6347;
  color: white;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.explorar-btn:hover {
  background-color: #FF4500;
  transform: scale(1.05);
}
</style>
