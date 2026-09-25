<!-- BEGIN:vps-deploy-rules -->
# Manual de despliegue en la infraestructura Prosuite

> Para agentes de código que trabajan en repos que se publican en los servidores de Prosuite.
> Versión 2026-09-24. Sustituye a cualquier regla anterior que mencione **Dokploy**, `dokploy-network`,
> `COMPOSE_ID`, `APPLICATION_ID`, `stack.yml` o `/home/jose/apps`. Todo eso ya no existe.

## 0. Lo que tienes que saber antes de nada

- **Dokploy ya no existe.** Los servidores corren **Podman**, no Docker. Cada app es una unidad
  **Quadlet** de systemd (`/etc/containers/systemd/<app>.container`). No hay panel, no hay API de deploy
  y no hay IDs que pedir.
- **Traefik v3** enruta y saca los certificados. La red compartida se llama **`prosuite`**, no `dokploy-network`.
  El certresolver es **`letsencrypt-dns`**.
- Servidores:
  | Alias | IP | SSH | Qué hay |
  |---|---|---|---|
  | `propodvps1` | 66.94.114.222 | puerto **2226** | Vendetta, DVP, WordPress, static-proposals, caro… |
  | `propodvps2` | 195.26.255.71 | puerto **2226** | Apps nuevas por defecto, correo, CRMs |
  | `panel-prosuite` (66.29.152.229) | — | — | **Retirado. No desplegar ahí nunca.** |
- **Tú trabajas en el repo. El host lo administra Felix.** No necesitas entrar al servidor para desplegar.
  Si crees que lo necesitas, lo que te falta es algo de la sección 5 (alta), y eso se pide.

## 1. Cómo llega un cambio a producción

```
push a main ──► GitHub Actions: build ──► ghcr.io/<owner>/<app>:latest + :sha-<commit completo>
                                    └──► ssh (llave limitada) ──► /usr/local/bin/<app>-deploy
                                                                   ├─ podman pull de la imagen
                                                                   ├─ systemctl restart <app>
                                                                   ├─ espera a que el healthcheck dé healthy
                                                                   ├─ comprueba que corre ESE commit
                                                                   └─ si queda unhealthy: rollback solo al sha anterior
```

- La llave SSH del CI **no es una shell**: está atada con `command=` a un script de deploy de esa app.
  Aunque mandes otro comando, sólo corre ese script. No sirve para inspeccionar el servidor.
- **El log del job de GitHub Actions es tu fuente de verdad.** El script imprime la revisión anterior,
  la esperada, los intentos de healthcheck y, si falla, las últimas 50 líneas del contenedor.
  Job verde = el commit está sirviendo y sano. Job rojo = no llegó, y el log dice por qué.

## 2. Qué debe tener el repo

### 2.1 `Dockerfile`
- Imagen propia, multi-stage si hay build. La app escucha en un puerto interno (80 para nginx, 3000 para Next.js).
- **No expongas puertos al host** (nada de `ports:`). Traefik llega por la red.
- El `HEALTHCHECK` del Dockerfile **se pierde** (la imagen se publica como OCI y ese formato no lo guarda).
  El healthcheck real va en el Quadlet (2.3). Puedes dejarlo en el Dockerfile para pruebas locales.

### 2.2 `.github/workflows/deploy.yml` (un solo archivo: build + deploy)
- Ver plantilla en el manual.

### 2.3 `deploy/<app>.container` (copia versionada de la unit del servidor)
- Ver plantilla en el manual.

### 2.4 `docker-compose.yml`
- Opcional, sólo para desarrollo local. El servidor no lo usa.

## 8. Prohibido (resumen)

1. Dokploy, `dokploy-network`, `docker compose up`, Swarm, `stack.yml`: no existen.
2. Procesos sueltos en el host: PM2, `nohup`, `npm start`, `node server.js`, systemd a mano.
3. Código o datos de apps en `/home/`. Todo va en `/opt/stacks/<app>/` y lo crea Felix.
4. `podman build` en el servidor. Las imágenes se construyen en GitHub Actions.
5. `sudo`, editar `/etc/containers/systemd/`, `systemctl restart` o `podman` a mano para desplegar.
6. Scripts ad hoc contra bases de producción. Probar APIs externas con llaves de producción desde el servidor.
7. `ports:` / publicar puertos en el host.
8. Desplegar sólo con `:latest` sin `sha-<commit>`: sin él no hay rollback.
9. Secretos en el repo, en la imagen, en argumentos de comandos o en el chat.
10. Reintentos automáticos de SSH (sección 6).
<!-- END:vps-deploy-rules -->
