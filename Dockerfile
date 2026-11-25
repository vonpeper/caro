FROM nginx:alpine

# Copiar configuracion para responder 404 y deshabilitar contenido
COPY default.conf /etc/nginx/conf.d/default.conf

# Eliminar cualquier archivo estatico (el contenedor no tendra contenido)
RUN rm -rf /usr/share/nginx/html/*

# Exponer puerto 80 interno
EXPOSE 80

# Healthcheck interno para localhost
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
