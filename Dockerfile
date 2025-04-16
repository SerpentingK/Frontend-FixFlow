### ETAPA DE CONSUTRUCCION
# Utiliza una imagen base de Node.js
# La imagen base es una versión ligera de Node.js (23-alpine)
# que es adecuada para entornos de producción.


FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


### ETAPA DE PRODUCCION

# Establece el directorio de trabajo en el contenedor de producción

# Copia los archivos de la etapa de construcción al contenedor de producción
# Copia el contenido de la carpeta dist generada por la etapa de construcción
# al directorio /usr/share/nginx/html en el contenedor de producción
# que es donde Nginx sirve los archivos estáticos.
# Esto permite que la aplicación esté disponible en el servidor Nginx.
# El comando COPY --from=builder indica que los archivos se copian desde la etapa de construcción llamada "builder".
# La ruta /app/dist es la ubicación de los archivos generados por el comando npm run build.
# La ruta /usr/share/nginx/html es la ubicación predeterminada donde Nginx busca los archivos estáticos para servir.
# Por lo tanto, al copiar los archivos a esta ubicación, Nginx podrá servir la aplicación correctamente.
# Esto es esencial para que la aplicación esté disponible para los usuarios finales a través del servidor web Nginx.
# La imagen de Nginx se utiliza para servir la aplicación en producción.
# La imagen de Nginx es una versión estable y ligera de Nginx (stable-alpine)
# que es adecuada para entornos de producción.
# La imagen de Nginx es un servidor web popular y eficiente que se utiliza para servir aplicaciones web.

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
# El comando CMD se utiliza para iniciar el servidor Nginx en primer plano
# y mantener el contenedor en ejecución. El argumento -g daemon off; se utiliza para evitar que Nginx se ejecute en segundo plano,
# lo que es necesario para que el contenedor de Docker permanezca activo y sirva la aplicación correctamente.
# Esto es esencial para que la aplicación esté disponible para los usuarios finales a través del servidor web Nginx.
# El contenedor se mantendrá en ejecución mientras el servidor Nginx esté activo.
# Esto es importante para que la aplicación esté disponible para los usuarios finales a través del servidor web Nginx.
# La imagen de Nginx se utiliza para servir la aplicación en producción.
# La imagen de Nginx es una versión estable y ligera de Nginx (stable-alpine)
# que es adecuada para entornos de producción.
