import { createI18n } from 'vue-i18n';

// Traducciones
const messages = {
  en: {
    header: {
      categories: 'Categories',
      preferences: 'Preferences',
      weeklyMenu: 'Weekly Menu',
      contact: 'Contact Us',
      favorites: 'Favorites',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      adminPanel: 'Admin Panel',
      welcome: 'Welcome',
    },
    banner: {
      title: 'Ready to cook something amazing?',
      description: 'Explore hundreds of recipes, customize your weekly menu, and find dishes that fit your needs and tastes.',
    },
    categories: {
      title: 'Categories',
      searchLabel: 'Search Category',
      viewRecipes: 'View Recipes',
      loadingMessage: 'Loading categories...',
    },
    comentarios: {
        title: 'Comments',
        noComments: 'No comments yet. Be the first to comment!',
        commentBy: 'By',
        on: 'on',
        deleteConfirmation: 'Are you sure?',
        deleteText: 'This comment will be permanently deleted.',
        deleteSuccess: 'Comment successfully deleted.',
        commentSent: 'Comment sent',
        commentSentText: 'Thank you for your comment!',
        emptyComment: 'Empty comment',
        emptyCommentText: 'You must write something before submitting the comment.',
        writeComment: 'Write your comment here...',
        addComment: 'Add Comment',
      },
      contact: {
        connectWithUs: 'Connect with us!',
        description: 'At {appName}, we are passionate about sharing the best recipes and creating custom weekly menus for you. Connect with us on our social media.',
        aboutUs: 'About us',
        appName: 'RecetasRedondas',
        aboutText: 'is a project dedicated to creating weekly menus tailored to your needs and tastes. Our team is made up of experts in gastronomy and nutrition, committed to offering you delicious and healthy recipes.',
        contactUsText: 'If you have any questions, feel free to reach out to us via our social media. We are here to help you enjoy a varied and delicious diet.',
        address: 'Address',
        addressText: '123 Fictional Street, City, Country',
        visitUsOnMap: 'Visit us on the map',
        contactInformation: 'Contact Information',
        information: 'Information',
        details: 'Details',
        phone: 'Phone',
        email: 'Email',
        openingHours: 'Business Hours',
        hours: 'Monday to Friday, 9:00 AM - 6:00 PM',
      },
      favorites: {
        delete: 'Remove', 
      },
      filtrar: {
        dificultadTitle: 'Recipes by Difficulty Level',
        ordenarPorDificultad: 'Sort by Difficulty',
        menorAMayor: 'Least to Greatest',
        mayorAMenor: 'Greatest to Least',
        dificultad: 'Difficulty',
      },
      filtrarT: {
        tiempoTitle: 'Recipes by Preparation Time',
        ordenarPorTiempo: 'Sort by Time',
        menorAMayor: 'Least to Greatest',
        mayorAMenor: 'Greatest to Least',
        tiempo: 'Time',
      },
      footer: {
        politicas: 'Privacy Policy',
        terminos: 'Terms of Use',
        contacto: 'Contact',
      },
  },
  es: {
    header: {
      categories: 'Categorías',
      preferences: 'Preferencias',
      weeklyMenu: 'Menú Semanal',
      contact: 'Contáctanos',
      favorites: 'Favoritos',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar sesión',
      adminPanel: 'Panel Admin',
      welcome: 'Bienvenido',
    },
    banner: {
      title: '¿Listo para cocinar algo increíble?',
      description: 'Explora cientos de recetas, personaliza tu menú semanal y encuentra platos que se adapten a tus necesidades y gustos.',
    },
    categories: {
      title: 'Categorías',
      searchLabel: 'Buscar Categoría',
      viewRecipes: 'Ver Recetas',
      loadingMessage: 'Cargando categorías...',
    },
    comentarios: {
        title: 'Comentarios',
        noComments: 'No hay comentarios aún. ¡Sé el primero en comentar!',
        commentBy: 'Por',
        on: 'el',
        deleteConfirmation: '¿Estás seguro?',
        deleteText: 'Este comentario será eliminado permanentemente.',
        deleteSuccess: 'Comentario eliminado exitosamente.',
        commentSent: 'Comentario enviado',
        commentSentText: '¡Gracias por tu comentario!',
        emptyComment: 'Comentario vacío',
        emptyCommentText: 'Debes escribir algo antes de enviar el comentario.',
        writeComment: 'Escribe tu comentario aquí...',
        addComment: 'Agregar Comentario',
      },
      contact: {
        connectWithUs: '¡Conéctate con nosotros!',
        description: 'En {appName}, nos apasiona compartir las mejores recetas y crear menús semanales a medida para ti. Conéctate con nosotros en nuestras redes sociales.',
        aboutUs: 'Sobre nosotros',
        appName: 'RecetasRedondas',
        aboutText: 'es un proyecto dedicado a crear menús semanales adaptados a tus necesidades y gustos. Nuestro equipo está formado por expertos en gastronomía y nutrición, comprometidos en ofrecerte recetas deliciosas y saludables.',
        contactUsText: 'Si tienes alguna consulta, no dudes en ponerte en contacto con nosotros a través de nuestras redes sociales. Estamos aquí para ayudarte a disfrutar de una alimentación variada y deliciosa.',
        address: 'Dirección',
        addressText: 'Calle Ficticia 123, Ciudad, País',
        visitUsOnMap: 'Visítanos en el mapa',
        contactInformation: 'Información de Contacto',
        information: 'Información',
        details: 'Detalles',
        phone: 'Teléfono',
        email: 'Correo Electrónico',
        openingHours: 'Horario de Atención',
        hours: 'Lunes a Viernes, 9:00 AM - 6:00 PM',
      },
      favorites: {
        delete: 'Eliminar',  // Texto del botón de eliminar
      },
      filtrar: {
        dificultadTitle: 'Recetas por Nivel de Dificultad',
        ordenarPorDificultad: 'Ordenar por Dificultad',
        menorAMayor: 'Menor a Mayor',
        mayorAMenor: 'Mayor a Menor',
        dificultad: 'Dificultad',
      },
      filtrarT: {
        tiempoTitle: 'Recetas por Tiempo de Preparación',
        ordenarPorTiempo: 'Ordenar por Tiempo',
        menorAMayor: 'Menor a Mayor',
        mayorAMenor: 'Mayor a Menor',
        tiempo: 'Tiempo',
      },
        footer: {
          politicas: 'Políticas de Privacidad',
          terminos: 'Términos de uso',
          contacto: 'Contacto',
        },
  },
};

// Configuración de i18n
const i18n = createI18n({
  legacy: false, // Desactiva el modo legado
  locale: 'es', // Idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo
  messages,
});

export default i18n;
