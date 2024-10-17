import { defineStore } from 'pinia';
import { useLoginStore } from './Login';

export interface Receta {
  idReceta: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  esVegano: boolean;
  fechaCreacion: string;
  nivelDificultad: number;
  tiempoPreparacion: number;
  idCategoria: number;
}

export interface Favorito {
  idFavorito: number;
  idUsuario: number;
  usuario: any;
  idReceta: number;
  receta: Receta;
  fechaFavorito: Date;
}

export interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
}

export const useFavoritosStore = defineStore({
  id: 'favoritos',

  state: () => ({
    recetasFavoritas: [] as Favorito[],
  }),

  actions: {
    async obtenerIdUsuarioDesdeToken() {
      try {
        const storeLogin = useLoginStore();
        const idUsuario = storeLogin.usuario?.idUsuario;

        if (!idUsuario) {
          console.error('ID de usuario no disponible');
          return null;
        }

        return idUsuario;
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return null;
      }
    },

    async obtenerFavoritos() {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();

      if (!idUsuario) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }

      try {
        const response = await fetch(`/api/Favorito/usuario/${idUsuario}`, {
          headers: {
            'Authorization': `Bearer ${useLoginStore().token}`, // Si necesitas pasar el token
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener favoritos');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          this.recetasFavoritas = await response.json();
        } else {
          throw new Error('Respuesta no es un JSON válido');
        }
      } catch (error) {
        console.error('Error en obtenerFavoritos:', error);
      }
    },

    async agregarFavorito(idReceta: number) {
      const idUsuario = await this.obtenerIdUsuarioDesdeToken();

      if (!idUsuario) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }

      try {
        const response = await fetch(`/api/Favorito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify({ idUsuario, idReceta }),
        });

        if (!response.ok) {
          throw new Error('Error al agregar favorito');
        }

        await this.obtenerFavoritos();
      } catch (error) {
        console.error('Error en agregarFavorito:', error);
      }
    },

    async eliminarFavorito(favoritoId: number) {
      try {
        const response = await fetch(`/api/Favorito/${favoritoId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${useLoginStore().token}`,
          },
          body: JSON.stringify({ id: favoritoId }),
        });

        if (!response.ok) {
          throw new Error('Error al eliminar favorito');
        }

        await this.obtenerFavoritos();
      } catch (error) {
        console.error('Error en eliminarFavorito:', error);
      }
    },
  },
});
