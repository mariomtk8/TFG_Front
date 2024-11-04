<template>
  <div class="menu-semanal">
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Comida</td>
          <td v-for="(dia, index) in diasSemana" :key="`comida-${index}`">
            <div v-if="menuRecetas[dia]?.comida">
              <router-link :to="`/Recetas/${menuRecetas[dia].comida.id}`" class="receta-link">
                <p class="receta-nombre">{{ menuRecetas[dia].comida.nombre }}</p>
                <img :src="menuRecetas[dia].comida.imagen" alt="Imagen de la receta" />
              </router-link>
            </div>
            <span v-else>Sin receta asignada</span>
          </td>
        </tr>
        <tr>
          <td>Cena</td>
          <td v-for="(dia, index) in diasSemana" :key="`cena-${index}`">
            <div v-if="menuRecetas[dia]?.cena">
              <router-link :to="`/Recetas/${menuRecetas[dia].cena.id}`" class="receta-link">
                <p class="receta-nombre">{{ menuRecetas[dia].cena.nombre }}</p>
                <img :src="menuRecetas[dia].cena.imagen" alt="Imagen de la receta" />
              </router-link>
            </div>
            <span v-else>Sin receta asignada</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="botones">
      <button @click="actualizarMenuSemanal">Actualizar Menú</button>
      <router-link to="/PreferenciasUsuario" class="volver-link">Volver a Preferencias</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMenuSemanalStore } from '../store/MenuSemanal';

export default defineComponent({
  data() {
    return {
      diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    };
  },
  computed: {
    menuSemanal() {
      const store = useMenuSemanalStore();
      return store.menuSemanal || [];
    },
    menuRecetas() {
      const recetasMapeadas: Record<string, { comida?: { nombre: string; imagen?: string; id: number }; cena?: { nombre: string; imagen?: string; id: number } }> = {};
      
      let recetaIndex = 0;
      this.diasSemana.forEach((dia) => {
        recetasMapeadas[dia] = {};
        
        // Asignar receta para "comida"
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].comida = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
            id: this.menuSemanal[recetaIndex].receta.id,
          };
          recetaIndex++;
        }
        
        // Asignar receta para "cena"
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].cena = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
            id: this.menuSemanal[recetaIndex].receta.id,
          };
          recetaIndex++;
        }
      });

      return recetasMapeadas;
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
    await store.obtenerMenuSemanal();
  },
});
</script>

<style scoped>
.menu-semanal {
  margin: 20px auto;
  max-width: 800px;
  overflow-x: auto; /* Para permitir el desplazamiento horizontal */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 16px;
  text-align: center;
  border: 1px solid #ddd;
}

thead {
  background-color: #3f197c;
  color: #fff;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternar color de fila */
}

.receta-link {
  text-decoration: none;
  color: #3f197c;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.receta-nombre {
  margin: 8px 0;
}

img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.botones {
  display: flex;
  justify-content: space-between;
}

button {
  background-color: #3f197c;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #5a3ab0;
}

.volver-link {
  color: #3f197c;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #3f197c;
}

.volver-link:hover {
  background-color: #3f197c;
  color: white;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  th,
  td {
    padding: 8px;
  }

  img {
    width: 60px;
    height: 60px;
  }

  button, .volver-link {
    padding: 8px;
  }
}
</style>
