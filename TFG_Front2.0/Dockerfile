# Etapa de construcción
FROM node:lts-alpine AS build-stage

WORKDIR /app

# Copia solo package.json y package-lock.json para caché de dependencias
COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Corre el build
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS production-stage

# Copia los archivos generados en el build
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
