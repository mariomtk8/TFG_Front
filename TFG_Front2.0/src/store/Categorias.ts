import { defineStore } from 'pinia';
import urlStore from '@/store/Url';

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;
  Especial: boolean;
  fechaCreacion: string;
  icono: string;
  puntuacion: number;
}

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [] as Categoria[],  
    loading: false,                 
    error: null as string | null,    
  }),
  actions: {
    async fetchCategorias() {
      this.loading = true;           
      this.error = null;             

      try {
        const url = urlStore.baseUrl
        console.log('Iniciando petición para obtener categorías...');
        const response = await fetch(`http://a4f3d54b75e49485791db4994f42a014-387405513.us-east-1.elb.amazonaws.com/Categoria`);

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('El formato de los datos obtenidos no es válido.');
        }

        this.categorias = data;       
        console.log('Datos de categorías cargados correctamente:', this.categorias);
      } catch (error: any) {
        console.error('Error al obtener las categorías:', error);
        this.error = error.message;   
      } finally {
        this.loading = false;          
      }
    },
  },
});
