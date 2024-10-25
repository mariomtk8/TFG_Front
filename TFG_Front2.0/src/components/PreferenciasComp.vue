<template>
    <div class="preferencias-container">
        <section class="preferencias-categorias">
            <h2>Preferencias de Categorías</h2>
            <select v-model="categoriasSeleccionadas" multiple class="categoria-select">
                <option v-for="categoria in categoriasComputed" :key="categoria.idCategoria" :value="categoria.idCategoria">
                    {{ categoria.nombreCategoria }}
                </option>
            </select>
            <button @click="guardarCategorias" class="btn-guardar">Guardar Preferencias</button>
        </section>

        <section class="preferencias-alergenos">
            <h2>Alérgenos</h2>
            <select v-model="alergenosSeleccionados" multiple class="alergenos-select">
                <option v-for="ingrediente in ingredientesComputed" :key="ingrediente.idIngrediente" :value="ingrediente.idIngrediente">
                    {{ ingrediente.nombreIngrediente }}
                </option>
            </select>
            <button @click="guardarAlergenos" class="btn-guardar">Guardar Preferencias</button>
        </section>

        <section class="preferencias-guardadas">
            <h2>Preferencias Guardadas</h2>
            <div>
                <h3>Categorías Seleccionadas:</h3>
                <ul>
                    <li v-for="categoria in categoriasGuardadas" :key="categoria.idCategoria">
                        {{ categoria.nombreCategoria }}
                    </li>
                </ul>
                <h3>Alérgenos Seleccionados:</h3>
                <ul>
                    <li v-for="alergeno in alergenosGuardados" :key="alergeno.idAlergeno">
                        {{ alergeno.nombreIngrediente }}
                    </li>
                </ul>
            </div>
        </section>
        <button @click="generarMenuSemanal">Generar Menú Semanal</button>
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

        const generarMenuSemanal = async () => {
  try {
    // Generar el objeto completo del menú semanal
    const menu = {
      idMenuSemanal: 0, // Puedes ajustar según tu lógica
      descripcion: "Menú Semanal generado", // O ajustar este valor dinámicamente
      fechaInicio: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      tipoComida: true, // Este puede cambiar si es comida o cena, dependiendo del día
      categorias: categoriasSeleccionadas.value, // Categorías seleccionadas por el usuario
      alergenos: alergenosSeleccionados.value,   // Alergenos seleccionados por el usuario
      // Añadir propiedades necesarias para el tipo MenuSemanal
      idUsuario: 1, // Aquí se debe asignar el ID del usuario desde el token o contexto
      recetas: [], // Si ya tienes recetas seleccionadas para incluir
    };

    // Llamar a la acción del store con el objeto menú completo
    await store.crearMenuSemanal(menu);

    // Redirigir a la vista MenuSemanal.vue
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

        const categoriasComputed = computed(() => menuSemanalStore.allCategorias);
        const ingredientesComputed = computed(() => menuSemanalStore.allIngredientes);

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
            categoriasComputed,
            ingredientesComputed,
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
    color: #333;
}

select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-bottom: 20px;
}

.btn-guardar {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-guardar:hover {
    background-color: #45a049;
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
button {
  background-color: #4CAF50; /* Verde */
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
