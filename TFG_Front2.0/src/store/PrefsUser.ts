import { defineStore } from 'pinia';
import { useLoginStore } from './Login';
import urlStore from '@/store/Url';

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

export const usePreferencias = defineStore({
  id: 'Preferencias',

  state: () => ({
    allCategorias: [] as Categoria[],
    categorias: [] as Categoria[],    
    usuariosCategoria: [] as UsuariosCategoria[],
    ingredientes: [] as Ingrediente[],
    allIngredientes: [] as Ingrediente[], 
    categoriasBuscadas: [] as Categoria[], 
    ingredientesBuscados: [] as Ingrediente[],
  }),

  actions: {
    async obtenerIdUsuarioDesdeToken() {
      const storeLogin = useLoginStore();
      return storeLogin.usuario?.idUsuario || null;
    },
    async fetchCategorias() {             
        try {
          const url = urlStore.baseUrl
          console.log('Iniciando petición para obtener categorías...');
          const response = await fetch(`${url}/Categoria`);
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
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Ingrediente`);
        if (!response.ok) throw new Error('Error al obtener ingredientes');
        this.allIngredientes = await response.json();  
        // El tipo Ingrediente[] se asignará correctamente
      } catch (error) {
        console.error('Error al obtener ingredientes:', error);
      }
    },

    async buscarCategorias(query: string) {
      try {
        const url = urlStore.baseUrl
          const response = await fetch(`${url}/Categoria/search?query=${query}`);
          if (!response.ok) throw new Error('Error al buscar categorías');
          this.categoriasBuscadas = await response.json();
      } catch (error) {
          console.error('Error al buscar categorías:', error);
      }
  },

  // Función para buscar ingredientes
  async buscarIngredientes(query: string) {
      try {
        const url = urlStore.baseUrl
          const response = await fetch(`${url}/Ingrediente/search?query=${query}`);
          if (!response.ok) throw new Error('Error al buscar ingredientes');
          this.ingredientesBuscados = await response.json();
      } catch (error) {
          console.error('Error al buscar ingredientes:', error);
      }
  },

    async guardarCategoriasSeleccionadas(categoriasSeleccionadas: any[]) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;
    
      // Formato adecuado para enviar categorías (ajustar si es necesario)
      const categoriasData = categoriasSeleccionadas.map(idCategoria => ({
        idCategoria
      }));
    
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Usuario/${idUsuario}/Categorias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify(categoriasData),
        });
        if (!response.ok) throw new Error('Error al guardar categorías');
      } catch (error) {
        console.error('Error al guardar categorías seleccionadas:', error);
      }
    },

    async guardarAlergenosSeleccionados(alergenosSeleccionados: any[]) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;
    
      // Convertir el array de alergenosSeleccionados al formato adecuado
      const alergenosData = alergenosSeleccionados.map(idIngrediente => ({
        idAlergeno: 0,  // Puedes actualizar esta lógica si idAlergeno tiene un valor diferente
        idIngrediente
      }));
    
      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/Usuario/${idUsuario}/alergenos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify(alergenosData),  // Enviar el array de objetos
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
          const url = urlStore.baseUrl
          const response = await fetch(`${url}/Usuario/${idUsuario}/Categorias`, {
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
            const url = urlStore.baseUrl
            const response = await fetch(`${url}/Usuario/${idUsuario}/alergenos`, {
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
