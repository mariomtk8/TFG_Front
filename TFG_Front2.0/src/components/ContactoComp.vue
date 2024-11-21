<template>
  <v-container class="contactanos-container" fluid>
    <v-row>
      <!-- Sección de Logo y Redes Sociales -->
      <v-col cols="12" md="6" class="d-flex flex-column align-center">
        <v-img
          src="../assets/Logo-design.png"
          alt="Logo RecetasRedondas"
          max-width="200"
          class="logo"
        ></v-img>

        <v-divider class="my-4" />

        <h2 class="text-center">{{ $t('contact.connectWithUs') }}</h2>
        <p class="text-center">
          {{ $t('contact.description', { appName: 'RecetasRedondas' }) }}
        </p>

        <!-- Redes Sociales -->
        <v-row justify="center" class="social-icons">
          <v-col class="d-flex justify-center" v-for="(icon, index) in socialIcons" :key="index">
            <v-btn
              :href="icon.link"
              target="_blank"
              icon
              class="social-btn"
            >
              <v-icon>{{ icon.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- Sección de Información Adicional -->
      <v-col cols="12" md="6">
        <v-card class="contact-info-card">
          <v-card-title>
            <h3>{{ $t('contact.aboutUs') }}</h3>
          </v-card-title>
          <v-card-text>
            <p>
              <strong>{{ $t('contact.appName') }}</strong> {{ $t('contact.aboutText') }}
            </p>
            <p>
              {{ $t('contact.contactUsText') }}
            </p>
            <v-divider class="my-4" />
            
            <!-- Dirección y Mapa -->
            <h4>{{ $t('contact.address') }}:</h4>
            <p>
              {{ $t('contact.addressText') }}
            </p>
            <v-divider class="my-4" />
            <h4>{{ $t('contact.visitUsOnMap') }}:</h4>
            <v-img
              src="https://via.placeholder.com/400x300.png?text=Mapa+de+ubicación"
              alt="Mapa de ubicación"
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de Contacto Adicional con Diseño Mejorado -->
    <v-row>
      <v-col cols="12">
        <v-card class="contact-table-card">
          <v-card-title>
            <h3>{{ $t('contact.contactInformation') }}</h3>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">{{ $t('contact.information') }}</th>
                  <th class="text-left">{{ $t('contact.details') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ $t('contact.phone') }}</td>
                  <td>+1 234 567 890</td>
                </tr>
                <tr>
                  <td>{{ $t('contact.email') }}</td>
                  <td>contacto@recetasredondas.com</td>
                </tr>
                <tr>
                  <td>{{ $t('contact.openingHours') }}</td>
                  <td>{{ $t('contact.hours') }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    setup() {
      const socialIcons = [
        { icon: 'mdi-facebook', link: 'https://www.facebook.com/RecetasRedondas' },
        { icon: 'mdi-twitter', link: 'https://twitter.com/RecetasRedondas' },
        { icon: 'mdi-instagram', link: 'https://www.instagram.com/RecetasRedondas' },
        { icon: 'mdi-youtube', link: 'https://www.youtube.com/c/RecetasRedondas' }
      ];
  
      return {
        socialIcons,
      };
    }
  });
  </script>
  
  <style scoped>
  .contactanos-container {
    margin-top: 20px;
  }
  
  .logo {
    margin-bottom: 20px;
  }
  
  .social-icons .v-btn {
    margin: 0 10px;
  }
  
  .social-btn {
    font-size: 36px;
    color: #4caf50;
    transition: color 0.3s ease;
  }
  
  .social-btn:hover {
    color: #45a049;
  }
  
  .contact-info-card {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .contact-table-card {
    margin-top: 20px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .v-simple-table thead {
    background-color: #f4f4f4;
    color: #333;
  }
  
  .v-simple-table th {
    font-weight: bold;
  }
  
  .v-simple-table td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  
  .v-simple-table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  @media (max-width: 768px) {
    .social-btn {
      font-size: 30px;
    }
  
    .contact-table-card {
      margin-top: 20px;
      width: 100%;
    }
  }
  </style>
  