import { defineStore } from 'pinia';
import urlStore from '@/store/Url';

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

interface Paso {
  idPaso: number;
  idReceta: number;
  numero: number;
  descripcion: string;
  imagenUrl: string;
}

interface Ingrediente {
  idIngrediente: number;
  nombreIngrediente: string;
  cantidad: string; // Puedes ajustar según la estructura de tus ingredientes
  calorias: number;
  contieneAlergenos: boolean;
  tipoAlergeno: string;
  unidadMedida: string;
  fechaExpiracion: string;
}

export const useRecetasStore = defineStore('recetas', {
  state: () => ({
    recetaActual: null as Receta | null,
    ingredientes: [] as Ingrediente[], // Agregar un nuevo estado para los ingredientes
    pasos: [] as Paso[],
    loading: false,
    error: null as string | null,
    resultadosBusqueda: [] as Receta[],
  }),

  actions: {
    async searchRecetas(query: string) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/search?searchTerm=${query}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las recetas.')
        }

        const data = await response.json()

        this.resultadosBusqueda = data

      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async fetchRecetaPorId(id: number) {
      try {
        const url = urlStore.baseUrl
        this.loading = true;
        this.error = null;

        const response = await fetch(`${url}/Receta/${id}`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('El formato de los datos obtenidos no es válido.');
        }

        this.recetaActual = data;
        this.pasos = await this.getPasosByRecetaId(id); // Cargar los pasos usando la función
      } catch (error: any) {
        this.error = 'Error al obtener la receta. Intenta nuevamente más tarde.';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchRecetas() {
      try {
        const url = urlStore.baseUrl
        this.loading = true;
        const response = await fetch(`${url}/Receta`); // Ajusta la URL según tu API
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
        const data = await response.json();
        this.resultadosBusqueda = data; // Almacena los datos en el estado
      } catch (error) {
        console.error('Error al obtener recetas:', error);
      } finally {
        this.loading = false;
      }
    },
    // Obtener los pasos de una receta por su ID
    async getPasosByRecetaId(recetaId: number) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${recetaId}/Pasos`);
        if (!response.ok) throw new Error('Error al obtener los pasos');
        const pasosData = await response.json(); // Guardar los pasos en una variable
        this.pasos = pasosData; // Asignar pasos a la propiedad del store
        return pasosData; // Retornar los pasos para usar en fetchRecetaPorId si es necesario
      } catch (error: any) {
        console.error('Error al obtener los pasos:', error);
        return [];
      }
    },

    async fetchIngredientesPorRecetaId(id: number) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/RecetaIngredientes/receta/${id}`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('El formato de los datos de ingredientes no es válido.');
        }

        // Mapear cada ingrediente para obtener detalles adicionales
        this.ingredientes = await Promise.all(data.map(async (ingrediente: Ingrediente) => {
          const detalleResponse = await fetch(`/api/Ingrediente/${ingrediente.idIngrediente}`);
          if (!detalleResponse.ok) {
            throw new Error(`Error al obtener el detalle del ingrediente: ${detalleResponse.statusText}`);
          }
          const detalleData = await detalleResponse.json();
          return { ...ingrediente, ...detalleData }; // Combina la información
        }));
      } catch (error: any) {
        this.error = 'Error al obtener los ingredientes. Intenta nuevamente más tarde.';
      }
    },
  }
});
