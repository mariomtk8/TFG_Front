<template>
  <div class="register-page">
    <div class="register-container">
      <h2>{{ $t('register.title') }}</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label for="nombre">{{ $t('register.name') }}</label>
          <input
            type="text"
            id="nombre"
            v-model="nombre"
            :placeholder="$t('register.namePlaceholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">{{ $t('register.email') }}</label>
          <input
            type="email"
            id="email"
            v-model="correo"
            :placeholder="$t('register.emailPlaceholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">{{ $t('register.password') }}</label>
          <input
            type="password"
            id="password"
            v-model="password"
            :placeholder="$t('register.passwordPlaceholder')"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? $t('register.registering') : $t('register.registerButton') }}
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>
      <div class="link-container">
        <router-link to="/">{{ $t('register.backToHome') }}</router-link>
      </div>
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
/* Contenedor principal */
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
  background-color: #fafafa;
  padding: 20px;
}

/* Contenedor del formulario */
.register-container {
  width: 100%;
  max-width: 450px;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Título del formulario */
h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

/* Estilo de los campos de entrada */
.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  text-align: left;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.input-group input {
  width: 75%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #4caf50;
}

/* Estilo del botón */
button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

/* Estilo de mensaje de error */
.error-message {
  margin-top: 10px;
  color: red;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

/* Estilo de mensaje de éxito */
.success-message {
  margin-top: 10px;
  color: green;
  font-size: 0.9rem;
  text-align: center;
  padding: 10px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}
.link-container {
  margin-top: 15px;
  text-align: center;
}

.router-link {
  color: #4caf50;
  text-decoration: none;
  font-size: 1rem;
}

.router-link:hover {
  text-decoration: underline;
}

/* Media Queries para adaptabilidad */
@media (max-width: 480px) {
  .register-container {
    padding: 20px;
  }

  h2 {
    font-size: 1.3rem;
  }

  .input-group input {
    font-size: 0.9rem;
  }

  button {
    font-size: 1rem;
  }

  .error-message,
  .success-message {
    font-size: 0.8rem;
  }
}
</style>
