import { defineStore } from 'pinia';

interface Paso {
  idPaso: number;
  idReceta: number;
  numero: number;
  descripcion: string;
  imagenUrl: string;
}

interface Receta {
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

export const useAdminStore = defineStore({
  id: 'admin',
  
  state: () => ({
    recetas: [] as Receta[],
    receta: null as Receta | null,
    error: null as string | null,
  }),

  actions: {
    // Obtener todas las recetas
    async getRecetas() {
      try {
        const response = await fetch('/api/Receta');
        if (!response.ok) throw new Error('Error al obtener recetas');
        this.recetas = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Obtener una receta por su ID
    async getRecetaById(id: number) {
      try {
        const response = await fetch(`/api/Receta/${id}`);
        if (!response.ok) throw new Error(`Error al obtener la receta con id ${id}`);
        this.receta = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Crear una nueva receta
    async createReceta(nuevaReceta: Receta) {
      try {
        const response = await fetch('/api/Receta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevaReceta),
        });
        if (!response.ok) throw new Error('Error al crear la receta');
        await this.getRecetas(); // Actualizar la lista de recetas
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Actualizar una receta existente por ID
    async updateReceta(id: number, recetaActualizada: Receta) {
      try {
        const response = await fetch(`/api/Receta/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recetaActualizada),
        });
        if (!response.ok) throw new Error(`Error al actualizar la receta con id ${id}`);
        await this.getRecetas(); // Actualizar la lista de recetas
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Eliminar una receta por su ID
    async deleteReceta(id: number) {
      try {
        const response = await fetch(`/api/Receta/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Error al eliminar la receta con id ${id}`);
        await this.getRecetas(); // Actualizar la lista de recetas
      } catch (error: any) {
        this.error = error.message;
      }
    },
  },
});
