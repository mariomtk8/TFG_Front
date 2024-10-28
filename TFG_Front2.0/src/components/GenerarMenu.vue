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
              <p>{{ menuRecetas[dia].comida.nombre }}</p>
              <img :src="menuRecetas[dia].comida.imagen" alt="Imagen de la receta" width="100" />
            </div>
            <span v-else>Sin receta asignada</span>
          </td>
        </tr>
        <tr>
          <td>Cena</td>
          <td v-for="(dia, index) in diasSemana" :key="`cena-${index}`">
            <div v-if="menuRecetas[dia]?.cena">
              <p>{{ menuRecetas[dia].cena.nombre }}</p>
              <img :src="menuRecetas[dia].cena.imagen" alt="Imagen de la receta" width="100" />
            </div>
            <span v-else>Sin receta asignada</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="botones">
      <button @click="actualizarMenuSemanal">Actualizar Menú</button>
      <router-link to="/PreferenciasUsuario">Volver a Preferencias</router-link>
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
      const recetasMapeadas: Record<string, { comida?: { nombre: string; imagen?: string }; cena?: { nombre: string; imagen?: string } }> = {};
      
      let recetaIndex = 0;
      this.diasSemana.forEach((dia, index) => {
        recetasMapeadas[dia] = {};
        
        // Asignar receta para "comida"
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].comida = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
          };
          recetaIndex++;
        }
        
        // Asignar receta para "cena"
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].cena = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
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
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th,
td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}
thead {
  background-color: #3f197c;
  color: #fff;
}
img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin: 8px 0;
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
router-link {
  color: #3f197c;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #3f197c;
}
router-link:hover {
  background-color: #3f197c;
  color: white;
}
</style>
