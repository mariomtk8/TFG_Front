<template>
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="nombre">Nombre de Usuario</label>
          <input
            type="nombre"
            id="nombre"
            v-model="nombre"
            placeholder="Ingrese su Usuario"
            required
          />
        </div>
  
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
  
        <button type="submit" :disabled="loading">
          {{ loading ? "Iniciando sesión..." : "Iniciar Sesión" }}
        </button>
  
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useLoginStore } from '../store/Login';
  import { useRouter } from 'vue-router';
  
  const nombre = ref('');
  const password = ref('');
  const errorMessage = ref<string | null>(null);
  const loginStore = useLoginStore();
  const router = useRouter();
  const loading = ref(false);
  
  const login = async () => {
    loading.value = true;
    errorMessage.value = null;
  
    try {
      const success = await loginStore.login(nombre.value, password.value);
  
      if (success) {
        if (loginStore.usuario?.esAdmin) {
          router.push('/PanelAdmin'); // Redirige a la página de administración si es admin
        } else {
          router.push('/'); // Redirige a la página de usuarios normales
        }
      } else {
        errorMessage.value = 'Credenciales incorrectas. Inténtalo nuevamente.';
      }
    } catch (error) {
      errorMessage.value = 'Ocurrió un error al iniciar sesión.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
  
  .error-message {
    margin-top: 10px;
    color: red;
    text-align: center;
  }
  </style>
  