import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Importar Vuetify y el CSS necesario
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';


// Importar componentes de Vuetify
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Crear la instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(vuetify); // Añadir Vuetify a la app

app.mount('#app');
