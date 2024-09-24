import { defineStore } from 'pinia';

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

export const useRecetasStore = defineStore({
  id: 'recetasCat',
  
  state: () => ({
    recetas: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchRecetasPorCategoria(idCategoria: number): Promise<any[]> {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch(`/api/Receta/categoria/${idCategoria}`);

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
  },
});