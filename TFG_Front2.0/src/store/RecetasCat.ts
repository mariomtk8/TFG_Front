import { defineStore } from 'pinia';
import urlStore from '@/store/Url';

interface Receta {
  idReceta: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  instrucciones: string;
  esVegano: boolean;
  fechaCreacion: string;
  nivelDificultad: number;
  tiempoPreparacion: number;
  idCategoria: number;
}

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export const useRecetasStore = defineStore({
  id: 'recetasCat',

  state: () => ({
    recetas: [] as Receta[],
    categorias: [] as Categoria[], // Agregamos el estado para las categorías
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchRecetasPorCategoria(idCategoria: number): Promise<Receta[]> {
      try {
        const url = urlStore.baseUrl

        this.loading = true;
        this.error = null;

        const response = await fetch(`${url}/Receta/categoria/${idCategoria}`);

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        this.recetas = data;
        return data; // Retorna los datos para que puedan ser usados en el componente
      } catch (error: any) {
        this.error = 'Error al obtener las recetas. Intenta nuevamente más tarde.';
        return []; // En caso de error, retorna un arreglo vacío
      } finally {
        this.loading = false;
      }
    },

    async fetchNombreCategoria(idCategoria: number): Promise<string | null> {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Categoria/${idCategoria}`); // Asegúrate de que la API soporte esta ruta

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const categoria = await response.json();
        return categoria.nombreCategoria; // Devuelve el nombre de la categoría
      } catch (error) {
        console.error('Error al obtener el nombre de la categoría:', error);
        return null;
      }
    },
  },
});
