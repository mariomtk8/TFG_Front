import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode'


interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: boolean;
}

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
}

export const useLoginStore = defineStore({
  id: 'login',

  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null') as Usuario | null,
    error: null as string | null,
    token: localStorage.getItem('jwtToken') as string | null,
  }),

  getters: {
    rol(state): boolean {
      return state.usuario?.rol || false;
    },
  },

  actions: {
    async login(correo: string, contrasena: string): Promise<boolean> {
      const login = { correo, contrasena };

      try {
        const response = await fetch(`/api/Usuario/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(login),
        });

        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios.');
        }

        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('jwtToken', data.token);

        // Decodificar el token para obtener los detalles del usuario
        const decodedToken = jwtDecode<JwtPayload>(data.token);

        this.usuario = {
          idUsuario: parseInt(decodedToken.nameid),
          nombre: decodedToken.unique_name,
          correo: decodedToken.email,
          rol: decodedToken.role === 'Admin',  // Ejemplo de manejo de rol
        };

        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        console.log('Login exitoso');

        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    },

    async register(nombre: string, correo: string, contrasena: string): Promise<boolean> {
      try {
        const nuevoUsuario = {
          nombre: nombre,
          contrasena: contrasena,
          correo: correo

        };

        const response = await fetch('/api/Usuario/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoUsuario),
        });

        if (!response.ok) {
          throw new Error('Error al registrar el usuario.');
        }

        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('jwtToken', data.token);

        // Decodificar el token para obtener los detalles del usuario
        const decodedToken = jwtDecode<JwtPayload>(data.token);

        this.usuario = {
          idUsuario: parseInt(decodedToken.nameid),
          nombre: decodedToken.unique_name,
          correo: decodedToken.email,
          rol: decodedToken.role === 'Admin',  // Ejemplo de manejo de rol
        };

        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        console.log('Login exitoso');

        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    },

    logout() {
      this.usuario = null;
      this.token = null;
      localStorage.removeItem('usuario'); // Eliminar usuario de localStorage
      localStorage.removeItem('jwtToken'); // Eliminar token de localStorage
      console.log('Sesión cerrada');
    },
  },
});
