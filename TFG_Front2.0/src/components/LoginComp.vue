<template>
  <div class="login-page">
    <div class="login-container">
      <div class="header__logo">
        <RouterLink to="/"><img src="../assets/Logo-design.png" alt="Logo" /></RouterLink>
      </div>
      <h2>{{ $t('login.title') }}</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">{{ $t('login.emailLabel') }}</label>
          <input
            type="email"
            id="email"
            v-model="nombre"
            :placeholder="$t('login.emailPlaceholder')"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">{{ $t('login.passwordLabel') }}</label>
          <input
            type="password"
            id="password"
            v-model="password"
            :placeholder="$t('login.passwordPlaceholder')"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? $t('login.loading') : $t('login.submit') }}
        </button>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </div>
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
      if (loginStore.usuario?.rol) {
        router.push('/PanelAdmin');
      } else {
        router.push('/'); 
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
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
  background-color: #fafafa;
  padding: 20px;
}
.header__logo img {
  max-width: 120px;
  border-radius: 100px
}

/* Contenedor del formulario */
.login-container {
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
  border-color: #d96b45;
}

/* Estilo del botón */
button {
  width: 100%;
  padding: 12px;
  background-color: #d96b45;
  color: white;
  border: none;
  margin-top: 2vh;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #d96b45;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #f0ccc0;
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
.link-container {
  margin-top: 15px;
  text-align: center;
}

.router-link {
  color: #d96b45;
  text-decoration: none;
  font-size: 1rem;
}

.router-link:hover {
  text-decoration: underline;
}

/* Media Queries para adaptabilidad */
@media (max-width: 480px) {
  .login-container {
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

  .error-message {
    font-size: 0.8rem;
  }
}
</style>
