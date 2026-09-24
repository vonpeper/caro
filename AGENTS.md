<!-- BEGIN:vps-deploy-rules -->
# Reglas de Despliegue en VPS Dokploy

Este proyecto se despliega en un VPS compartido administrado por Dokploy y Traefik.

## Prohibiciones Estrictas:
1. NUNCA usar PM2, systemd, nohup o 'npm start' directo en el host.
2. NUNCA exponer puertos con `ports: ["3000:3000"]` o `ports: ["80:80"]` en el docker-compose. Todo se expone mediante Traefik Labels y la red `dokploy-network`.
3. NUNCA usar el puerto SSH 22 (el puerto SSH es 2226).
4. NUNCA modificar archivos de producción en `/home/` o directamente en el VPS.
5. NUNCA reutilizar nombres de routers o services de Traefik existentes.

## Requisitos de Contenedor:
- Toda app corre en Docker con imagen propia / multi-stage build.
- Debe incluir healthcheck funcional.
- Debe tener asignados límites de memoria (`mem_limit: 256m` o acorde).
- Los logs deben tener rotación json-file (`max-size: 10m`, `max-file: 3`).
- El servicio debe conectarse a `networks: [dokploy-network]` (external: true).
- El router y service de Traefik deben ser únicos: `caro-fisioterapia`.
<!-- END:vps-deploy-rules -->
