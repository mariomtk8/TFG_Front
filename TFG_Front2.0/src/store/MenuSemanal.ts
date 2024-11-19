import { defineStore } from 'pinia';
import { useLoginStore } from './Login';
import urlStore from '@/store/Url';


// Receta.ts
export interface Receta {
    idReceta: number;
    nombre: string;
    imagen: string;
    // Otros campos relevantes
  }
  
  // MenuSemanal.ts
  export interface MenuSemanal {
    idMenuSemanal: number;
    descripcion: string | null;
    fechaInicio: string;  
    tipoComida: boolean;  
    idUsuario: number;
    usuario: any;  
    idReceta: number;
    receta: Receta;  
  }
  

export const useMenuSemanalStore = defineStore('menuSemanal', {
  state: () => ({
    menuSemanal: [] as Array<any>, 
    recetas: [] as Array<Receta>,
  }),

  actions: {
    // Obtener ID de usuario desde el token
    async obtenerIdUsuarioDesdeToken() {
      const storeLogin = useLoginStore();
      return storeLogin.usuario?.idUsuario || null;
    },

    // Obtener el menú semanal
    async obtenerMenuSemanal() {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/MenuSemanal/usuario/${idUsuario}`);
        if (!response.ok) throw new Error("Error al obtener el menú semanal");

        this.menuSemanal = await response.json();
      } catch (error) {
        console.error('Error al obtener el menú semanal:', error);
      }
    },
    async hasMenuSemanal(idUsuario: number): Promise<boolean> {
      
      await this.obtenerMenuSemanal();
      return this.menuSemanal.length > 0;
    },

    // Crear un nuevo menú semanal
    async crearMenuSemanal(menu: any) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/MenuSemanal/${idUsuario}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menu),
        });

        if (!response.ok) throw new Error("Error al crear el menú semanal");

        await this.obtenerMenuSemanal(); 
      } catch (error) {
        console.error('Error al crear el menú semanal:', error);
      }
    },

    // Actualizar el menú semanal
    async actualizarMenuSemanal(menu: any) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();
      if (!idUsuario) return;

      try {
        const url = urlStore.baseUrl
        const response = await fetch(`${url}/MenuSemanal/usuario/${idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(menu),
        });

        if (!response.ok) throw new Error("Error al actualizar el menú semanal");

        await this.obtenerMenuSemanal(); 
      } catch (error) {
        console.error('Error al actualizar el menú semanal:', error);
      }
    },
  },
});
