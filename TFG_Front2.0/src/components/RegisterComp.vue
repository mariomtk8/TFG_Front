<template>
  <div class="cont-form">
    <div class="register-container">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="nombre" placeholder="Ingrese su nombre" required />
        </div>

        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="correo" placeholder="Ingrese su correo" required />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrarse" }}
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLoginStore } from '../store/Login';
import { useRouter } from 'vue-router';

const nombre = ref('');
const correo = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

const loginStore = useLoginStore();
const router = useRouter();

const register = async () => {
  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const success = await loginStore.register(nombre.value, correo.value, password.value);

    if (success) {
      successMessage.value = 'Registro exitoso. Redirigiendo a la página de inicio de sesión...';
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      errorMessage.value = 'Hubo un problema al registrarse. Inténtalo nuevamente.';
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al registrarse.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.cont-form {
  padding: 200px;
}

.register-container {
  max-width: 400px;
  margin: auto;
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

.success-message {
  margin-top: 10px;
  color: green;
  text-align: center;
}
</style>