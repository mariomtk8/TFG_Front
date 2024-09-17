import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Receta {
  idReceta: number;
  nombre: string;
  descripcion: string;
  instrucciones: string;
  esVegano: boolean;
  fechaCreacion: string;
  nivelDificultad: number;
  tiempoPreparacion: number;
  idCategoria: number;
}

export const useRecetasStore = defineStore('recetas', () => {
  const recetas = ref<Receta[]>([]);

  // Función para obtener las recetas por ID de categoría
  const fetchRecetasPorCategoria = async (idCategoria: number) => {
    try {
      console.log(`Iniciando petición para obtener recetas de la categoría ${idCategoria}...`);
      const response = await fetch(`/api/categoria/${idCategoria}/recetas`); // Ajusta la URL según tu backend

      if (!response.ok) {
        console.error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Verificar si la estructura de la respuesta es la que esperamos
      if (!Array.isArray(data)) {
        console.error('El formato de los datos no es un arreglo', data);
        throw new Error('El formato de los datos obtenidos no es válido.');
      }

      recetas.value = data;
      console.log('Datos de recetas cargados correctamente:', recetas.value);

    } catch (error: any) {
      console.error('Error al obtener las recetas:', error);
      throw error; // Volvemos a lanzar el error para manejarlo en el componente
    }
  };

  return {
    recetas,
    fetchRecetasPorCategoria,
  };
});
