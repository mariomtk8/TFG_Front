import { defineStore } from 'pinia';

interface Receta {
  idReceta: number;
  nombre: string;
  imagen: string;
  promedioVotos: number;
  nivelDificultad?: string;
  tiempoPreparacion?: number;
  temaCocina?: string;
}

export const useFiltradosStore = defineStore('filtrados', {
  state: () => ({
    recetasPopulares: [] as Receta[],
    recetasPorNivel: [] as Receta[],
    recetasPorTiempo: [] as Receta[],
  }),
  actions: {
    async fetchRecetasPopulares() {
      try {
        const response = await fetch('/api/Votaciones/populares');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}. Respuesta: ${errorText}`);
        }

        const data = await response.json();
        this.recetasPopulares = data.slice(0, 5);
      } catch (error) {
        console.error(error);
      }
    },

    async filtrarPorNivelDificultad(ascendente: boolean) {
      try {
        const response = await fetch(`/api/Receta/filtrarPorNivelDificultad?ascendente=${ascendente}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}. Respuesta: ${errorText}`);
        }

        const data = await response.json();
        this.recetasPorNivel = data.slice(0, 5);
      } catch (error) {
        console.error(error);
      }
    },

    async filtrarPorTiempoPreparacion(ascendente: boolean) {
      try {
        const response = await fetch(`/api/Receta/filtrarPorTiempoPreparacion?ascendente=${ascendente}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en la respuesta del servidor: ${response.statusText}. Respuesta: ${errorText}`);
        }

        const data = await response.json();
        this.recetasPorTiempo = data.slice(0, 5);
      } catch (error) {
        console.error(error);
      }
    }
  }
});
