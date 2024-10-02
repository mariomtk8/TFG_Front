import { defineStore } from 'pinia';
import { useLoginStore } from './Login'; 

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
    categorias: [] as Categoria[]
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

    // Obtener todas las categorías
    async getCategorias() {
      try {
        const response = await fetch('/api/Categoria');
        if (!response.ok) throw new Error('Error al obtener categorías');
        this.categorias = await response.json();
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
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const response = await fetch('/api/Receta', {
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

    async updateReceta(id: number, recetaActualizada: Receta) {
      const loginStore = useLoginStore();
      const token = loginStore.token;
    
      try {
        console.log("Datos enviados:", JSON.stringify(recetaActualizada));
    
        const response = await fetch(`/api/Receta/${id}`, {
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

    // Eliminar una receta por su ID 
    async deleteReceta(id: number) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const response = await fetch(`/api/Receta/${id}`, {
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
    },
    async getIngredientesByReceta(idReceta: number) {
      try {
        const response = await fetch(`/api/RecetaIngredientes/receta/${idReceta}`);
        if (!response.ok) throw new Error('Error al obtener ingredientes');
        this.ingredientes = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Añadir un nuevo ingrediente a una receta
    async addIngrediente(idReceta: number, nuevoIngrediente: Ingrediente) {
      try {
        const response = await fetch(`/api/RecetaIngredientes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idReceta,
            idIngrediente: nuevoIngrediente.idIngrediente,
            cantidad: nuevoIngrediente.cantidad
          }),
        });
        if (!response.ok) throw new Error('Error al añadir ingrediente');
        await this.getIngredientesByReceta(idReceta); // Refrescar ingredientes
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Actualizar un ingrediente de una receta
    async updateIngrediente(idReceta: number, ingredienteActualizado: Ingrediente) {
      try {
        const response = await fetch(`/api/RecetaIngredientes/${idReceta}/${ingredienteActualizado.idIngrediente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cantidad: ingredienteActualizado.cantidad
          }),
        });
        if (!response.ok) throw new Error('Error al actualizar ingrediente');
        await this.getIngredientesByReceta(idReceta);
      } catch (error: any) {
        this.error = error.message;
      }
    },

    // Eliminar un ingrediente de una receta
    async deleteIngrediente(idReceta: number, idIngrediente: number) {
      try {
        const response = await fetch(`/api/RecetaIngredientes/${idReceta}/${idIngrediente}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar ingrediente');
        await this.getIngredientesByReceta(idReceta);
      } catch (error: any) {
        this.error = error.message;
      }
    },
  },
});
