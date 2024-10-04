import { defineStore } from 'pinia';
import { useLoginStore } from './Login'; 

interface Ingrediente {
    idIngrediente: number;
    nombreIngrediente: string;
    cantidad: string;
}

export interface RecetaIngrediente {
  idRecetaIngrediente: number;
  idReceta: number;
  idIngrediente: number;
  cantidad: number;
  notas: string;
  fechaAñadido: string;
  esOpcional: boolean;
}
export interface Receta {
    idReceta: number;
    nombre: string;
}

export const useIngredientesStore = defineStore({
    id: 'ingredientes',
    
    state: () => ({
      ingredientes: [] as Ingrediente[],
      recetaIngredientes: [] as RecetaIngrediente[],
      error: null as string | null,
    }),
  
    actions: {
      async getAllIngredientes() {
        try {
          const response = await fetch('/api/RecetaIngredientes');
          if (!response.ok) throw new Error('Error al obtener ingredientes');
          this.ingredientes = await response.json();
        } catch (error: any) {
          this.error = error.message;
        }
      },
      
      async getIngredientesByRecetaId(recetaId: number) {
        try {
          const response = await fetch(`/api/RecetaIngredientes/receta/${recetaId}`);
          if (!response.ok) throw new Error('Error al obtener los ingredientes de la receta');
          this.recetaIngredientes = await response.json();
        } catch (error: any) {
          this.error = error.message;
        }
      },
  
      async createIngredienteForReceta(recetaIngrediente: RecetaIngrediente) {
        const loginStore = useLoginStore();
        const token = loginStore.token;
  
        try {
          const response = await fetch(`/api/RecetaIngredientes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(recetaIngrediente),
          });
          if (!response.ok) throw new Error('Error al añadir ingrediente a la receta');
        } catch (error: any) {
          this.error = error.message;
        }
      },
  
      // Cambiado para que use el idRecetaIngrediente
      async updateIngredienteForReceta(recetaIngrediente: RecetaIngrediente) {
        const loginStore = useLoginStore();
        const token = loginStore.token;
  
        try {
          const response = await fetch(`/api/RecetaIngredientes/${recetaIngrediente.idRecetaIngrediente}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(recetaIngrediente),
          });
          if (!response.ok) throw new Error('Error al actualizar ingrediente de la receta');
        } catch (error: any) {
          this.error = error.message;
        }
      },
  
      // Cambiado para que use el idRecetaIngrediente
      async deleteIngredienteForReceta(idRecetaIngrediente: number) {
        const loginStore = useLoginStore();
        const token = loginStore.token;
  
        try {
          const response = await fetch(`/api/RecetaIngredientes/${idRecetaIngrediente}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al eliminar el ingrediente de la receta');
        } catch (error: any) {
          this.error = error.message;
        }
      },
    },
  });