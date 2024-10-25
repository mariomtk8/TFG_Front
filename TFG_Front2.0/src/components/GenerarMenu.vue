<template>
    <div>
      <h1>Menú Semanal</h1>
      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Comida</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dia, index) in diasSemana" :key="index">
            <td>{{ dia }}</td>
            <td>
              <div v-if="menuSemanal[index * 2]">
                <img
                  :src="menuSemanal[index * 2]?.receta?.imagen"
                  alt="Receta"
                  width="50"
                  height="50"
                />
                <p>ID Receta: {{ menuSemanal[index * 2]?.idReceta }}</p>
                <p>{{ menuSemanal[index * 2]?.receta?.nombre }}</p>
              </div>
            </td>
            <td>
              <div v-if="menuSemanal[index * 2 + 1]">
                <img
                  :src="menuSemanal[index * 2 + 1]?.receta?.imagen"
                  alt="Receta"
                  width="50"
                  height="50"
                />
                <p>ID Receta: {{ menuSemanal[index * 2 + 1]?.idReceta, }}</p>
                <p>{{ menuSemanal[index * 2 + 1]?.receta?.nombre }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="actualizarMenuSemanal">Actualizar Menú</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { useMenuSemanalStore } from '../store/MenuSemanal';
  
  export default defineComponent({
    data() {
      return {
        diasSemana: [
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
          'Domingo',
        ],
      };
    },
    computed: {
      menuSemanal() {
        const store = useMenuSemanalStore();
        return store.menuSemanal || []; // Proveer un valor predeterminado vacío
      },
      // Aquí mapeamos el menú semanal a las recetas
      recetasDelMenu() {
        return this.menuSemanal.map((item) => ({
          idReceta: item.idReceta,
          nombre: item.receta?.nombre,
          imagen: item.receta?.imagen,
        })) 
      },
    },
    methods: {
      async actualizarMenuSemanal() {
        const store = useMenuSemanalStore();
        await store.actualizarMenuSemanal(this.menuSemanal);
      },
    },
    async mounted() {
      const store = useMenuSemanalStore();
      await store.obtenerMenuSemanal(); // Cargar el menú semanal al montar el componente
    },
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
  }
  img {
    display: block;
    margin: 0 auto;
  }
  button {
    margin-top: 20px;
  }
  </style>
  