<template>
    <div>
        <h2>Preferencias de Categorías</h2>
        <select v-model="categoriasSeleccionadas" multiple>
            <option v-for="categoria in categoriasComputed" :key="categoria.idCategoria" :value="categoria.idCategoria">
                {{ categoria.nombreCategoria }}
            </option>
        </select>
        <h2>Alérgenos</h2>
        <select v-model="alergenosSeleccionados" multiple>
            <option v-for="ingrediente in ingredientesComputed" :key="ingrediente.idIngrediente"
                :value="ingrediente.idIngrediente">
                {{ ingrediente.nombreIngrediente }}
            </option>
        </select>

        <button @click="guardarPreferencias">Guardar Preferencias</button>

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
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useMenuSemanalStore } from '../store/MenuSemanal';

export default defineComponent({
    setup() {
        const menuSemanalStore = useMenuSemanalStore();
        const categoriasSeleccionadas = ref<number[]>([]);
        const alergenosSeleccionados = ref<number[]>([]);

        const categoriasGuardadas = ref<any[]>([]);
        const alergenosGuardados = ref<any[]>([]);

        const guardarPreferencias = async () => {
            try {
                await menuSemanalStore.guardarCategoriasSeleccionadas(categoriasSeleccionadas.value);
                await menuSemanalStore.guardarAlergenosSeleccionados(alergenosSeleccionados.value);
                alert('Preferencias guardadas exitosamente');
                await obtenerPreferenciasGuardadas(); // Actualiza las preferencias guardadas
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
                alert('Hubo un error al guardar tus preferencias');
            }
        };

        const obtenerPreferenciasGuardadas = async () => {
            try {
                await menuSemanalStore.obtenerCategorias(); // Carga las categorías del usuario
                await menuSemanalStore.obtenerAlergenos();  // Carga los alérgenos del usuario
                categoriasGuardadas.value = menuSemanalStore.usuariosCategoria; // Asignar categorías desde el store
                alergenosGuardados.value = menuSemanalStore.ingredientes.filter(ingrediente =>
                    menuSemanalStore.ingredientes.some(alergeno => alergeno.idIngrediente == ingrediente.idIngrediente)
                ); // Filtra los alérgenos guardados
            } catch (error) {
                console.error('Error al obtener preferencias guardadas:', error);
            }
        };
        const categoriasComputed = computed(() => menuSemanalStore.allCategorias);
        const ingredientesComputed = computed(() => menuSemanalStore.allIngredientes);

        onMounted(async () => {
            await menuSemanalStore.fetchCategorias(); // Carga todas las categorías
            await menuSemanalStore.getAllIngredientes(); // Carga todos los ingredientes
            await obtenerPreferenciasGuardadas(); // Carga las preferencias guardadas
        });

        return {
            categoriasSeleccionadas,
            alergenosSeleccionados,
            categoriasGuardadas,
            alergenosGuardados,
            categoriasComputed,
            ingredientesComputed,
            guardarPreferencias,
            menuSemanalStore,
        };
    },
});
</script>

<style scoped>
select {
    margin-bottom: 20px;
    width: 200px;
}
</style>