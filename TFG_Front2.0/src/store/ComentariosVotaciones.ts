import { defineStore } from 'pinia';
import { useLoginStore } from './Login';

interface Comentario {
    id: number;
    usuarioId: number;
    recetaId: number;
    contenido: string;
    fecha: Date;
    nombreUsuario: string; 
}

interface Votacion {
    usuarioId: number;
    recetaId: number;
    puntuacion: number;
}

export const useComentariosStore = defineStore('comentarios', {
    state: () => ({
        comentarios: [] as Comentario[],
        promedioVotaciones: 0,
        puntuacionSeleccionada: 0,
    }),
    actions: {
        async agregarComentario(recetaId: number, contenido: string) {
            const usuarioId = await this.obtenerIdUsuarioDesdeToken();
            if (!usuarioId) {
                throw new Error("Usuario no autenticado");
            }

            const url = `/api/Comentarios?usuarioId=${usuarioId}&recetaId=${recetaId}&contenido=${encodeURIComponent(contenido)}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const comentario = await response.json();
                this.comentarios.push(comentario);
            } else {
                console.error('Error al agregar comentario:', response.statusText);
            }
        },

        async obtenerComentarios(recetaId: number) {
            const response = await fetch(`/api/Comentarios/${recetaId}`);
            if (response.ok) {
                this.comentarios = await response.json();
            } else {
                console.error('Error al obtener comentarios:', response.statusText);
            }
        },

        async eliminarComentario(comentarioId: number) {
            const usuarioId = await this.obtenerIdUsuarioDesdeToken();
            if (!usuarioId) {
                throw new Error("Usuario no autenticado");
            }

            const response = await fetch(`/api/Comentarios/${comentarioId}/usuario/${usuarioId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.comentarios = this.comentarios.filter(c => c.id !== comentarioId);
            } else {
                console.error('Error al eliminar comentario:', response.statusText);
            }
        },

        async agregarVotacion(recetaId: number, puntuacion: number) {
            const usuarioId = await this.obtenerIdUsuarioDesdeToken();
            if (!usuarioId) {
                throw new Error("Usuario no autenticado");
            }

            const url = `/api/Votaciones?usuarioId=${usuarioId}&recetaId=${recetaId}&puntuacion=${puntuacion}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                this.puntuacionSeleccionada = puntuacion;
                await this.obtenerPromedioVotaciones(recetaId);
            } else {
                console.error('Error al agregar votación:', response.statusText);
            }
        },

        async obtenerPromedioVotaciones(recetaId: number) {
            const response = await fetch(`/api/Votaciones/promedio/${recetaId}`);
            if (response.ok) {
                this.promedioVotaciones = await response.json();
            } else {
                console.error('Error al obtener promedio de votaciones:', response.statusText);
            }
        },

        async obtenerIdUsuarioDesdeToken() {
            const storeLogin = useLoginStore();
            return storeLogin.usuario?.idUsuario || null;
        },
    },
});
