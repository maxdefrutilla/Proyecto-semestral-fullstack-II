# INMAQUI · Ejecución local

INMAQUI reúne el frontend React de I2, la interfaz de UI3 y tres microservicios Spring Boot. El frontend usa React 19.3.1, React Router DOM 7.18.4, Vite 8.3.4, Bootstrap 5.3.8, Vitest 5.0.5, Tiptap 3.35, DOMPurify 3.5, GSAP 3.15.1 y @gsap/react 2.1.2. El lockfile fija las versiones transitivas.

Necesitas un JDK 21, Node.js 24 con npm 11, MySQL 8.4, OpenSSL y acceso a npm y Maven Central para la primera instalación. Cada servicio incluye Maven Wrapper 3.10.1. Usuarios y Ventas usan Spring Boot 4.2.0 y springdoc 3.2.1. Catálogo usa Spring Boot 3.3.5 y springdoc 2.6.0.

## 1. Preparar MySQL

Arranca MySQL localmente. Abre el cliente `mysql -u root -p` desde la raíz del proyecto y ejecuta estos comandos de cliente MySQL, compatibles con Bash y PowerShell.

```sql
SOURCE sql/01_schema.sql
SOURCE sql/02_seed.sql
```

Se crean `inmaqui_usuarios`, `inmaqui_catalogo` e `inmaqui_ventas`. La semilla incorpora cinco categorías, nueve productos y dos artículos. Los scripts conservan los registros existentes. Consulta [CONFIGURACION_MANUAL.md](CONFIGURACION_MANUAL.md) para crear el usuario de aplicación y exportar las variables.

## 2. Arrancar los servicios

Configura las variables de entorno en cada terminal y abre una terminal por servicio. Desde la carpeta de cada servicio ejecuta `./mvnw spring-boot:run` en Bash o `.\mvnw.cmd spring-boot:run` en PowerShell. Inicia Catálogo antes de Ventas.

| Servicio | Puerto | Swagger |
| --- | --- | --- |
| Usuarios | 8081 | http://localhost:8081/swagger-ui.html |
| Catálogo | 8082 | http://localhost:8082/swagger-ui.html |
| Ventas | 8083 | http://localhost:8083/swagger-ui.html |

Cada servicio sirve OpenAPI en `/v3/api-docs`. Para probar rutas protegidas desde un cliente HTTP, obtén el JWT con `POST /api/v1/auth/login` (campos `usuario` y `password`) y envíalo en `Authorization: Bearer <token>`.

## 3. Arrancar React

```sh
cd frontend
npm ci
npm run dev
```

Abre http://localhost:5173. El proxy de Vite dirige `/api/v1/auth`, `/api/v1/usuarios`, `/api/v1/catalogo` y `/api/v1/ventas` a los servicios. `npm run dev:mock` mantiene una simulación parcial para desarrollo. Para usar las cuentas iniciales de prueba puedes exportar valores ficticios con `INMAQUI_MOCK_ADMIN_PASSWORD` o `INMAQUI_MOCK_CLIENT_PASSWORD`. Para la comprobación completa usa `npm run dev`.

```sh
npm run build
npm run lint
npm test
```

Para correr las pruebas de contexto de cada servicio, ejecuta `./mvnw test` o `.\mvnw.cmd test` con MySQL disponible, el esquema importado y las variables configuradas.

## Diagnóstico local

- Si falla la compilación con `release version 21 not supported`, comprueba `javac -version` y el JDK indicado por `./mvnw -v`.
- Si Hibernate informa tablas ausentes, vuelve a importar `01_schema.sql` y confirma que los nombres en las variables coincidan con los tres esquemas.
- Si Vite devuelve 502, confirma que el servicio correspondiente arrancó y que los puertos en sus terminales y en la de Vite coincidan.
- Si el login devuelve un JWT pero la sesión desaparece al recargar mediante HTTP local, revisa `JWT_COOKIE_SECURE` y usa siempre el mismo nombre de host.
- Si el checkout informa que debe comprobar el inventario, reintenta con la misma compra y los mismos datos. El pedido pendiente conserva su ID y permite recuperar una confirmación interrumpida.

El [checklist local](CHECKLIST_VERIFICACION.md) describe los flujos de entrega.
