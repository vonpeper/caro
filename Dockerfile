FROM nginx:alpine

# Copiar configuracion optimizada de Nginx con gzip, cache y cabeceras de seguridad
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estaticos del sitio (HTML, CSS, JS, Assets)
COPY . /usr/share/nginx/html

# Exponer puerto 80 interno
EXPOSE 80

# Healthcheck para Dokploy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
