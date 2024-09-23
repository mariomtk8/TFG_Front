import { defineStore } from 'pinia';

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

export const useRecetasStore = defineStore({
  id: 'recetas',
  state: () => ({
    recetas: [] as Receta[],
    categoriaActual: null as number | null,
  }),
  actions: {
    async fetchRecetasPorCategoria(idCategoria: number) {
      try {
        this.recetas = [];
        this.categoriaActual = idCategoria;

        console.log(`Iniciando petición para obtener recetas de la categoría ${idCategoria}...`);
        const response = await fetch(`/api/Receta/categoria/${idCategoria}?timestamp=${new Date().getTime()}`);

        if (!response.ok) {
          console.error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('El formato de los datos no es un arreglo', data);
          throw new Error('El formato de los datos obtenidos no es válido.');
        }

        this.recetas = [...data];
        console.log('Datos de recetas cargados correctamente:', this.recetas);

      } catch (error) {
        console.error('Error al obtener las recetas:', error);
        throw error;
      }
    },
  },
});
