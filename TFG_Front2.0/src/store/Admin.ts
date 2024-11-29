import { defineStore } from 'pinia';
import { useLoginStore } from './Login'; 
import urlStore from '@/store/Url';

export interface Paso {
  idPaso: number;
  idReceta: number;
  numero: number;
  descripcion: string;
  imagenUrl: string;
}

export interface Receta {
  idReceta: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  pasos: Paso[];
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
interface Ingrediente {
  idIngrediente: number;
  nombreIngrediente: string;
  cantidad: string;
}
export const useAdminStore = defineStore({
  id: 'admin',
  
  state: () => ({
    recetas: [] as Receta[],
    receta: null as Receta | null,
    ingredientes: [] as Ingrediente[],
    error: null as string | null,
    categorias: [] as Categoria[],
    resultadosBusqueda: [] as Receta[],
    paginaActual: 1,  // Nueva propiedad para controlar la página actual
    recetasCargadas: false,  // Para saber si todas las recetas fueron cargadas
    cargando: false  // Para manejar el estado de carga
  }),

  actions: {
    // Obtener recetas con paginación
    async getRecetas(pagina: number = 1, pageSize: number = 10) {
      try {
        if (this.cargando || this.recetasCargadas) return; // Evitar llamadas mientras se cargan datos
        this.cargando = true;

        const url = `${urlStore.baseUrl}/Receta?page=${pagina}&pageSize=${pageSize}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener recetas');
        
        const recetasNuevas = await response.json();
        if (recetasNuevas.length < pageSize) {
          this.recetasCargadas = true; // Si el número de recetas es menor que el tamaño de página, ya no hay más recetas.
        }

        this.recetas.push(...recetasNuevas);
        this.paginaActual = pagina;  // Actualizamos la página actual
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.cargando = false;
      }
    },
    resetRecetas() {
      this.recetas = [];
      this.recetasCargadas = false;
      this.paginaActual = 1;
    },

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

    // Obtener todas las categorías
    async getCategorias() {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Categoria`);
        if (!response.ok) throw new Error('Error al obtener categorías');
        this.categorias = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Obtener una receta por su ID
    async getRecetaById(id: number) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${id}`);
        if (!response.ok) throw new Error(`Error al obtener la receta con id ${id}`);
        this.receta = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Crear una nueva receta 
    async createReceta(nuevaReceta: Receta) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(nuevaReceta),
        });
        if (!response.ok) throw new Error('Error al crear la receta');
        await this.getRecetas(); 
      } catch (error: any) {
        this.error = error.message;
      }
    },
      //Actualizar receta
    async updateReceta(id: number, recetaActualizada: Receta) {
      const loginStore = useLoginStore();
      const token = loginStore.token;
    
      try {
        const url = urlStore.baseUrl
        console.log("Datos enviados:", JSON.stringify(recetaActualizada));
    
        const response = await fetch(`${url}/Receta/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(recetaActualizada),
        });
        if (!response.ok) throw new Error(`Error al actualizar la receta con id ${id}`);
        await this.getRecetas(); 
      } catch (error: any) {
        this.error = error.message;
      }
    },
    // Obtener los pasos de una receta por su ID
    async getPasosByRecetaId(recetaId: number) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${recetaId}/Pasos`);
        if (!response.ok) throw new Error('Error al obtener los pasos');
        return await response.json();
      } catch (error: any) {
        console.error('Error al obtener los pasos:', error);
        return [];
      }
    },
    // Función para manejar los pasos
    async createPaso(recetaId: number, paso: Paso) {
      const loginStore = useLoginStore();
      const token = loginStore.token;
    
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${recetaId}/paso`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(paso),
        });
        if (!response.ok) throw new Error('Error al crear el paso');
      } catch (error: any) {
        this.error = error.message;
      }
    },
    
    async updatePaso(recetaId: number, paso: Paso) {
      const loginStore = useLoginStore();
      const token = loginStore.token;
    
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${recetaId}/paso`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(paso),
        });
        if (!response.ok) throw new Error('Error al actualizar el paso');
      } catch (error: any) {
        this.error = error.message;
      }
    },
     // Eliminar un paso
     async deletePaso(idPaso: number) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Paso/${idPaso}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al eliminar el paso');
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Eliminar una receta por su ID 
    async deleteReceta(id: number) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Receta/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!response.ok) throw new Error(`Error al eliminar la receta con id ${id}`);
        await this.getRecetas(); 
      } catch (error: any) {
        this.error = error.message;
      }
    }
  },
});
