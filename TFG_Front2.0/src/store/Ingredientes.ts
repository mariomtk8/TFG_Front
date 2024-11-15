import { defineStore } from 'pinia';
import { useLoginStore } from './Login';
import urlStore from '@/store/Url';

export interface Ingrediente {
    idIngrediente: number;
    nombreIngrediente: string;
    calorias: 0;
    contieneAlergenos: boolean;
    tipoAlergeno: string;
    unidadMedida: string;
    fechaExpiracion: string;
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
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Ingrediente`);
        if (!response.ok) throw new Error('Error al obtener ingredientes');
        this.ingredientes = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    async getIngredientesByRecetaId(recetaId: number) {
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/RecetaIngredientes/receta/${recetaId}`);
        if (!response.ok) throw new Error('Error al obtener los ingredientes de la receta');
        this.recetaIngredientes = await response.json();
      } catch (error: any) {
        this.error = error.message;
      }
    },

    async createIngrediente(nuevoIngrediente: Ingrediente) {
      const loginStore = useLoginStore();
      const token = loginStore.token;
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/ingrediente`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoIngrediente),
        });

        if (!response.ok) throw new Error('Error al crear el ingrediente');
        const createdIngrediente = await response.json();
        this.ingredientes.push(createdIngrediente); // Añadir el ingrediente creado a la lista
        return createdIngrediente; // Retornar el ingrediente creado
      } catch (error: any) {
        this.error = error.message;
        throw error; // Lanzar el error para manejarlo en el componente si es necesario
      }
    },

    async createIngredienteForReceta(recetaIngrediente: RecetaIngrediente) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/RecetaIngredientes`, {
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

    async updateIngredienteForReceta(recetaIngrediente: RecetaIngrediente) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/RecetaIngredientes/${recetaIngrediente.idRecetaIngrediente}`, {
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

    async deleteIngredienteForReceta(idRecetaIngrediente: number) {
      const loginStore = useLoginStore();
      const token = loginStore.token;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/RecetaIngredientes/${idRecetaIngrediente}`, {
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
