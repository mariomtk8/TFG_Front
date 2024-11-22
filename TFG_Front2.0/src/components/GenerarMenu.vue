<template>
  <div class="menu-semanal">
    <table class="responsive-table">
      <thead>
        <tr>
          <th></th>
          <th v-for="dia in diasSemana" :key="dia">{{ $t(`${dia}`) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('menuSemanal.comida') }}</td>
          <td v-for="(dia, index) in diasSemana" :key="`comida-${index}`">
            <div v-if="menuRecetas[dia]?.comida">
              <router-link :to="`/Recetas/${menuRecetas[dia]?.comida?.idReceta}`" class="receta-link">
                <p class="receta-nombre">{{ menuRecetas[dia]?.comida?.nombre }}</p>
                <img :src="menuRecetas[dia]?.comida?.imagen" :alt="$t('menuSemanal.altImagen')" />
              </router-link>
            </div>
            <span>{{ $t('menuSemanal.sinReceta') }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('menuSemanal.cena') }}</td>
          <td v-for="(dia, index) in diasSemana" :key="`cena-${index}`">
            <div v-if="menuRecetas[dia]?.cena">
              <router-link :to="`/Recetas/${menuRecetas[dia]?.cena?.idReceta}`" class="receta-link">
                <p class="receta-nombre">{{ menuRecetas[dia]?.cena?.nombre }}</p>
                <img :src="menuRecetas[dia]?.cena?.imagen" :alt="$t('menuSemanal.altImagen')" />
              </router-link>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
    <div class="botones">
      <button @click="actualizarMenuSemanal">{{ $t('menuSemanal.actualizar') }}</button>
      <router-link to="/PreferenciasUsuario" class="volver-link">{{ $t('menuSemanal.volver') }}</router-link>
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
      const recetasMapeadas: Record<string, { comida?: { nombre: string; imagen?: string; idReceta: number }; cena?: { nombre: string; imagen?: string; idReceta: number } }> = {};
      
      let recetaIndex = 0;
      this.diasSemana.forEach((dia) => {
        recetasMapeadas[dia] = {};
        
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].comida = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
            idReceta: this.menuSemanal[recetaIndex].receta.idReceta,
          };
          recetaIndex++;
        }
        
        if (this.menuSemanal[recetaIndex]) {
          recetasMapeadas[dia].cena = {
            nombre: this.menuSemanal[recetaIndex].receta.nombre,
            imagen: this.menuSemanal[recetaIndex].receta.imagen || undefined,
            idReceta: this.menuSemanal[recetaIndex].receta.idReceta,
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
  max-width: 1000px;
  overflow-x: auto;
}

.responsive-table {
  width: 100%;
  
  margin-bottom: 20px;
}

th,
td {
  padding: 16px;
  text-align: center;
  border: 1px solid #ddd;
}

thead {
  background-color: #FF8A5C;
  color: #fff;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.receta-link {
  text-decoration: none;
  color: #000000;
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
  justify-content: space-around;
}

button {
  background-color: #FF8A5C;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ffcab5;
}

.volver-link {
  background-color: #FF8A5C;
  color: #fafafa;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
}

.volver-link:hover {
  background-color: #ffcab5;
  color: white;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .responsive-table th,
  .responsive-table td {
    padding: 8px;
    font-size: 0.9em;
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
