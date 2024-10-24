import { defineStore } from 'pinia';
import { useLoginStore } from './Login';

export interface UsuariosCategoria {
    idUsuarioCategoria: number;
    idCategoria: number;
    idUsuario: number;
    nombreCategoria: string;
}

export interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
  }

export interface Ingrediente {
  idIngrediente: number;
  nombreIngrediente: string;
}
export interface Alergeno {
    idAlergeno: number;
    idUsuario: number;
    idIngrediente: number;
    nombreIngrediente: string;
  }

export const useMenuSemanalStore = defineStore({
  id: 'menuSemanal',

  state: () => ({
    allCategorias: [] as Categoria[],
    categorias: [] as Categoria[],    // Define el tipo explícitamente para categorias
    usuariosCategoria: [] as UsuariosCategoria[],
    ingredientes: [] as Ingrediente[],
    allIngredientes: [] as Ingrediente[], // Define el tipo explícitamente para ingredientes
  }),

  actions: {
    async obtenerIdUsuarioDesdeToken() {
      const storeLogin = useLoginStore();
      return storeLogin.usuario?.idUsuario || null;
    },
    async fetchCategorias() {             
        try {
          console.log('Iniciando petición para obtener categorías...');
          const response = await fetch('/api/Categoria');
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
          }
          this.allCategorias = await response.json();  // El tipo Ingrediente[] se asignará correctamente
          
        } catch (error) {
          console.error('Error al obtener categorias:', error);
        }
    },

    async getAllIngredientes() {
      try {
        const response = await fetch('/api/Ingrediente');
        if (!response.ok) throw new Error('Error al obtener ingredientes');
        this.allIngredientes = await response.json();  
        // El tipo Ingrediente[] se asignará correctamente
      } catch (error) {
        console.error('Error al obtener ingredientes:', error);
      }
    },

    async guardarCategoriasSeleccionadas(categoriasSeleccionadas: any[]) {

      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;

      try {
        const response = await fetch(`/api/Usuario/${idUsuario}/Categorias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify({ categorias: categoriasSeleccionadas }),
        });
        if (!response.ok) throw new Error('Error al guardar categorías');
      } catch (error) {
        console.error('Error al guardar categorías seleccionadas:', error);
      }
    },

    async guardarAlergenosSeleccionados(alergenosSeleccionados: number[]) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;

      try {
        const response = await fetch(`/api/Usuario/${idUsuario}/alergenos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify({ alergenos: alergenosSeleccionados }),
        });
        if (!response.ok) throw new Error('Error al guardar alérgenos');
      } catch (error) {
        console.error('Error al guardar alérgenos seleccionados:', error);
      }
    },

    async obtenerCategorias() {
        const idUsuario = await this.obtenerIdUsuarioDesdeToken();
        if (!idUsuario) return;
        try {
          const response = await fetch(`/api/Usuario/${idUsuario}/Categorias`, {
            headers: { 'Authorization': `Bearer ${useLoginStore().token}` },
          });
          if (!response.ok) throw new Error('Error al obtener categorías');
          this.usuariosCategoria = await response.json();
        } catch (error) {
          console.error('Error al obtener categorías:', error);
        }
      },
      async obtenerAlergenos() {
          const idUsuario = await this.obtenerIdUsuarioDesdeToken();
          if (!idUsuario) return;
          try {
            const response = await fetch(`/api/Usuario/${idUsuario}/alergenos`, {
              headers: { 'Authorization': `Bearer ${useLoginStore().token}` },
            });
            if (!response.ok) throw new Error('Error al obtener categorías');
            this.ingredientes = await response.json();
          } catch (error) {
            console.error('Error al obtener categorías:', error);
          }
        },
  },
});
