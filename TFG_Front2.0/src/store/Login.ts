import { defineStore } from 'pinia';

interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  contraseña: string;
  fechaRegistro: string;
  esAdmin: boolean;
}

export const useLoginStore = defineStore({
  id: 'login',

  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null') as Usuario | null,
    error: null as string | null,
  }),

  getters: {
    esAdmin(state): boolean {
      return state.usuario?.esAdmin || false;
    },
  },

  actions: {
    async login(nombre: string, contraseña: string): Promise<boolean> {
      try {
        const response = await fetch('/api/Usuario');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios.');
        }

        const usuarios: Usuario[] = await response.json();
        const usuarioEncontrado = usuarios.find(
          (user) => user.nombre === nombre && user.contraseña === contraseña
        );

        if (usuarioEncontrado) {
          this.usuario = usuarioEncontrado;
          localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado)); // Guardar en localStorage
          return true; // Login exitoso
        } else {
          return false; // Credenciales incorrectas
        }
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    },

    async register(nombre: string, email: string, contraseña: string): Promise<boolean> {
      try {
        const nuevoUsuario = {
          nombre,
          email,
          contraseña,
          esAdmin: false, // Los usuarios nuevos no serán admin por defecto
          fechaRegistro: new Date().toISOString(),
        };

        const response = await fetch('/api/Usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (!response.ok) {
          throw new Error('Error al registrar el usuario.');
        }

        return true; // Registro exitoso
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    },

    logout() {
      this.usuario = null;
      localStorage.removeItem('usuario'); // Eliminar usuario de localStorage
    },
  },
});
