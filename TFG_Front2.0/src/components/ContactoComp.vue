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
  
          <h2 class="text-center">¡Conéctate con nosotros!</h2>
          <p class="text-center">
            En <strong>RecetasRedondas</strong>, nos apasiona compartir las mejores recetas y crear menús semanales a medida para ti. Conéctate con nosotros en nuestras redes sociales.
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
              <h3>Sobre nosotros</h3>
            </v-card-title>
            <v-card-text>
              <p>
                <strong>RecetasRedondas</strong> es un proyecto dedicado a crear menús semanales adaptados a tus necesidades y gustos. Nuestro equipo está formado por expertos en gastronomía y nutrición, comprometidos en ofrecerte recetas deliciosas y saludables.
              </p>
              <p>
                Si tienes alguna consulta, no dudes en ponerte en contacto con nosotros a través de nuestras redes sociales. Estamos aquí para ayudarte a disfrutar de una alimentación variada y deliciosa.
              </p>
              <v-divider class="my-4" />
              
              <!-- Dirección y Mapa -->
              <h4>Dirección:</h4>
              <p>
                Calle Ficticia 123, Ciudad, País
              </p>
              <v-divider class="my-4" />
              <h4>Visítanos en el mapa:</h4>
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
              <h3>Información de Contacto</h3>
            </v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th class="text-left">Información</th>
                    <th class="text-left">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Teléfono</td>
                    <td>+1 234 567 890</td>
                  </tr>
                  <tr>
                    <td>Correo Electrónico</td>
                    <td>contacto@recetasredondas.com</td>
                  </tr>
                  <tr>
                    <td>Horario de Atención</td>
                    <td>Lunes a Viernes, 9:00 AM - 6:00 PM</td>
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
  