<script setup lang="ts">
import { computed } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter();

const isLoggedIn = computed(() => loginStore.usuario !== null);

const goToMenuSemanal = () => {
  if (isLoggedIn.value) {
    router.push('/PreferenciasUsuario');
  } else {
    alert("Debes iniciar sesión para acceder al Menú Semanal.");
    router.push('/Login');
  }
};
</script>

<template>
  <section class="menu-semanal-section">
    <div class="menu-semanal-content">
      <h2>{{ $t('menuSemanalC.title') }}</h2>
      <p>{{ $t('menuSemanalC.description') }}</p>
      <button @click="goToMenuSemanal" class="menu-semanal-btn">
        {{ $t('menuSemanalC.button') }}
      </button>
    </div>
  </section>
</template>


<style scoped>
.menu-semanal-section {
  background-image: url('/path/to/your/background-image.jpg'); 
  background-size: cover;
  background-position: center;
  color: black;
  padding: 60px 20px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 4vh;
}

.menu-semanal-content {
  max-width: 600px;
  background-color: #FFE5A2(0, 0, 0, 0.); 
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.4);
}

.menu-semanal-content h2 {
  font-size: 2em;
  margin-bottom: 10px;
  font-weight: bold;
}

.menu-semanal-content p {
  font-size: 1.2em;
  margin-bottom: 20px;
  line-height: 1.6;
}

.menu-semanal-btn {
  padding: 12px 24px;
  background-color: #FF6347; 
  color: white;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.menu-semanal-btn:hover {
  background-color: #FF4500; /* Un color más oscuro al hacer hover */
  transform: scale(1.05);
}
</style>
