import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string;
  visible: boolean;
  fechaCreacion: string;
  icono: string;
  puntuacionPromedio: number;
}

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref<Categoria[]>([]);

  const fetchCategorias = async () => {
    try {
      console.log('Iniciando petición para obtener categorías...');
      const response = await fetch('/api/Categoria'); 

      if (!response.ok) {
        console.error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
      }

      const data = await response.json();
      
     
      if (!Array.isArray(data)) {
        console.error('El formato de los datos no es un arreglo', data);
        throw new Error('El formato de los datos obtenidos no es válido.');
      }

      categorias.value = data;
      console.log('Datos de categorías cargados correctamente:', categorias.value);

    } catch (error: any) {
      console.error('Error al obtener las categorías:', error);
      throw error; 
    }
  };

  return {
    categorias,
    fetchCategorias,
  };
});
