<template>
    <div class="preferencias-container">
      <section class="preferencias-categorias">
        <h2>{{ $t('preferencias.categoriasTitulo') }}</h2>
        <input
          type="text"
          v-model="busquedaCategorias"
          :placeholder="$t('preferencias.buscarCategorias')"
          class="buscador-categorias"
        />
        <select v-model="categoriasSeleccionadas" multiple class="categoria-select">
          <option
            v-for="categoria in categoriasFiltradas"
            :key="categoria.idCategoria"
            :value="categoria.idCategoria"
          >
            {{ categoria.nombreCategoria }}
          </option>
        </select>
        <button @click="guardarCategorias" class="btn-guardar">
          {{ $t('preferencias.guardar') }}
        </button>
      </section>
  
      <section class="preferencias-alergenos">
        <h2>{{ $t('preferencias.alergenosTitulo') }}</h2>
        <input
          type="text"
          v-model="busquedaAlergenos"
          :placeholder="$t('preferencias.buscarAlergenos')"
          class="buscador-alergenos"
        />
        <select v-model="alergenosSeleccionados" multiple class="alergenos-select">
          <option
            v-for="ingrediente in alergenosFiltrados"
            :key="ingrediente.idIngrediente"
            :value="ingrediente.idIngrediente"
          >
            {{ ingrediente.nombreIngrediente }}
          </option>
        </select>
        <button @click="guardarAlergenos" class="btn-guardar">
          {{ $t('preferencias.guardar') }}
        </button>
      </section>
  
      <section class="preferencias-guardadas">
        <h2>{{ $t('preferencias.guardadasTitulo') }}</h2>
        <div>
          <h3>{{ $t('preferencias.categoriasSeleccionadas') }}</h3>
          <ul>
            <li v-for="categoria in categoriasGuardadas" :key="categoria.idCategoria">
              {{ categoria.nombreCategoria }}
            </li>
          </ul>
          <h3>{{ $t('preferencias.alergenosSeleccionados') }}</h3>
          <ul>
            <li v-for="alergeno in alergenosGuardados" :key="alergeno.idAlergeno">
              {{ alergeno.nombreIngrediente }}
            </li>
          </ul>
        </div>
      </section>
      <button @click="generarMenuSemanal" class="btn-generar-menu">
        {{ $t('preferencias.generarMenu') }}
      </button>
    </div>
  </template>
  

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useMenuSemanalStore } from '../store/MenuSemanal';
import { usePreferencias } from '../store/PrefsUser';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const menuSemanalStore = usePreferencias();
        const categoriasSeleccionadas = ref<number[]>([]);
        const alergenosSeleccionados = ref<number[]>([]);
        const store = useMenuSemanalStore();
        const router = useRouter();

        const categoriasGuardadas = ref<any[]>([]);
        const alergenosGuardados = ref<any[]>([]);

        const busquedaCategorias = ref('');
        const busquedaAlergenos = ref('');

        const categoriasComputed = computed(() => menuSemanalStore.allCategorias);
        const ingredientesComputed = computed(() => menuSemanalStore.allIngredientes);

        const categoriasFiltradas = computed(() => {
            return categoriasComputed.value.filter(categoria => 
                categoria.nombreCategoria.toLowerCase().includes(busquedaCategorias.value.toLowerCase())
            );
        });

        const alergenosFiltrados = computed(() => {
            return ingredientesComputed.value.filter(ingrediente => 
                ingrediente.nombreIngrediente.toLowerCase().includes(busquedaAlergenos.value.toLowerCase())
            );
        });

        const generarMenuSemanal = async () => {
            try {
                const menu = {
                    idMenuSemanal: 0, 
                    descripcion: "Menú Semanal generado", 
                    fechaInicio: new Date().toISOString().split('T')[0],
                    tipoComida: true, 
                    categorias: categoriasSeleccionadas.value, 
                    alergenos: alergenosSeleccionados.value,   
                    idUsuario: 1, 
                    recetas: [],
                };

                // Llamar a la acción del store con el objeto menú completo
                await store.crearMenuSemanal(menu);

                router.push('/MenuSemanal');
            } catch (error) {
                console.error('Error al generar el menú semanal:', error);
            }
        };

        const guardarCategorias = async () => {
            try {
                await menuSemanalStore.guardarCategoriasSeleccionadas(categoriasSeleccionadas.value);
                alert('Preferencias guardadas exitosamente');
                await obtenerPreferenciasGuardadas();
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
            }
        };

        const guardarAlergenos = async () => {
            try {
                await menuSemanalStore.guardarAlergenosSeleccionados(alergenosSeleccionados.value);
                alert('Preferencias guardadas exitosamente');
                await obtenerPreferenciasGuardadas();
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
            }
        };

        const obtenerPreferenciasGuardadas = async () => {
            try {
                await menuSemanalStore.obtenerCategorias();
                await menuSemanalStore.obtenerAlergenos();
                categoriasGuardadas.value = menuSemanalStore.usuariosCategoria;
                alergenosGuardados.value = menuSemanalStore.ingredientes.filter(ingrediente =>
                    menuSemanalStore.ingredientes.some(alergeno => alergeno.idIngrediente == ingrediente.idIngrediente)
                );
            } catch (error) {
                console.error('Error al obtener preferencias guardadas:', error);
            }
        };

        onMounted(async () => {
            await menuSemanalStore.fetchCategorias();
            await menuSemanalStore.getAllIngredientes();
            await obtenerPreferenciasGuardadas();
        });

        return {
            categoriasSeleccionadas,
            alergenosSeleccionados,
            categoriasGuardadas,
            alergenosGuardados,
            busquedaCategorias,
            busquedaAlergenos,
            categoriasFiltradas,
            alergenosFiltrados,
            guardarCategorias,
            guardarAlergenos,
            generarMenuSemanal,
        };
    },
});
</script>

<style scoped>
.preferencias-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin: 0 auto;
    max-width: 600px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.preferencias-categorias, .preferencias-alergenos, .preferencias-guardadas {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 24px;
    margin-bottom: 15px;
    color: #4f3f77; /* Color principal */
}

select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-bottom: 20px;
}

.buscador-categorias, .buscador-alergenos {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-bottom: 20px;
}

.btn-guardar, .btn-generar-menu {
    background-color: #FF8A5C; 
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-guardar:hover, .btn-generar-menu:hover {
    background-color: #45a049; /* Verde más oscuro */
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

/* Estilos responsive */
@media (max-width: 768px) {
    .preferencias-container {
        padding: 10px;
    }

    h2 {
        font-size: 20px;
    }

    .btn-guardar, .btn-generar-menu {
        font-size: 14px;
        padding: 8px 16px;
    }

    select, .buscador-categorias, .buscador-alergenos {
        font-size: 14px;
    }
}
</style>
