// store/Recetas.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRecetasStore = defineStore('Recetas', () => {
  const receta = ref(null);
  const errorMessage = ref<string | null>(null);

  const fetchRecetaPorId = async (id: number) => {
    try {
      errorMessage.value = null;
      const response = await fetch(`/Receta/${id}`);
      const data = await response.json();
      receta.value = data;
    } catch (error) {
      console.error('Error al cargar la receta:', error);
      errorMessage.value = 'No se pudo cargar la receta. Inténtalo más tarde.';
    }
  };

  return {
    receta,
    errorMessage,
    fetchRecetaPorId,
  };
});
