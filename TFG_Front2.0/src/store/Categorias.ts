import { defineStore } from 'pinia';

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;
  visible: boolean;
  fechaCreacion: string;
  icono: string;
  puntuacionPromedio: number;
}

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [] as Categoria[],  // Estado que almacena las categorías
    loading: false,                  // Estado de carga
    error: null as string | null,    // Estado de error
  }),
  actions: {
    async fetchCategorias() {
      this.loading = true;           // Iniciar carga
      this.error = null;             // Limpiar error anterior

      try {
        console.log('Iniciando petición para obtener categorías...');
        const response = await fetch('/api/Categoria');

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('El formato de los datos obtenidos no es válido.');
        }

        this.categorias = data;       // Actualizar el estado con las categorías
        console.log('Datos de categorías cargados correctamente:', this.categorias);
      } catch (error: any) {
        console.error('Error al obtener las categorías:', error);
        this.error = error.message;   // Establecer el mensaje de error
      } finally {
        this.loading = false;          // Finalizar carga
      }
    },
  },
});
