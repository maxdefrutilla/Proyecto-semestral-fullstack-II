# INMAQUI — Backend Microservicios

Backend desarrollado en **Java 21** y **Spring Boot** para el sistema de venta de maquinaria INMAQUI.

## 1. Arquitectura y Puertos

| Microservicio | Puerto Local | Base de Datos | Responsabilidad | Swagger UI |
| :--- | :--- | :--- | :--- | :--- |
| **`usuarios-service`** | `:8081` | `inmaqui_usuarios` | Gestión de usuarios, roles (`CLIENTE`, `ADMINISTRADOR`) y emisión JWT RS256 | `http://localhost:8081/swagger-ui.html` |
| **`catalogo-service`** | `:8082` | `inmaqui_catalogo` | Categorías, productos, calculadoras comerciales (andamios/ascensores) y reserva interna de stock | `http://localhost:8082/swagger-ui.html` |
| **`ventas-service`** | `:8083` | `inmaqui_ventas` | Checkout público/invitado o autenticado, tarifas de despacho RM e histórico | `http://localhost:8083/swagger-ui.html` |

---

## 2. Inicialización de la Base de Datos

Ejecutar los scripts SQL ubicados en la carpeta `sql/` en tu servidor MySQL:

```bash
# 1. Crear esquemas y tablas (7 tablas exactas)
mysql -u root -p < sql/01_schema.sql

# 2. Cargar datos iniciales del catálogo
mysql -u root -p < sql/02_seed.sql
```

---

## 3. Configuración de Variables de Entorno

Copiar el archivo de ejemplo y configurar las credenciales locales:

```bash
cp .env.example .env
```

Variables principales:
* `DB_HOST`: Host de MySQL (defecto: `127.0.0.1`)
* `DB_PORT`: Puerto de MySQL (defecto: `3306`)
* `DB_USUARIO`: Usuario de base de datos
* `DB_PASSWORD`: Contraseña de base de datos
* `INTERNAL_SERVICE_TOKEN`: Token compartido para comunicación privada entre `ventas-service` y `catalogo-service`.
* `ADMIN_INIT_USERNAME`: Usuario del administrador inicial creado automáticamente al arrancar `usuarios-service`.
* `ADMIN_INIT_PASSWORD`: Contraseña del administrador inicial (hasheada en BCrypt).

---

## 4. Compilación y Arranque

### Compilar los 3 microservicios:
```bash
# usuarios-service
cd usuarios-service && ./mvnw clean package -DskipTests && cd ..

# catalogo-service
cd catalogo-service && ./mvnw clean package -DskipTests && cd ..

# ventas-service
cd ventas-service && ./mvnw clean package -DskipTests && cd ..
```

### Ejecutar cada servicio en terminales separadas o en segundo plano:

```bash
# Terminal 1 - Usuarios
java -jar usuarios-service/target/usuarios-service-*.jar

# Terminal 2 - Catálogo
java -jar catalogo-service/target/catalogo-service-*.jar

# Terminal 3 - Ventas
java -jar ventas-service/target/ventas-service-*.jar
```

---

## 5. Reglas Técnicas Clave
1. **Autenticación JWT:** Token firmado asimétricamente con clave privada RSA (RS256) en `usuarios-service`. `catalogo-service` y `ventas-service` validan los tokens utilizando la clave pública (`app.pub`).
2. **Sanitización HTML:** Las descripciones HTML de productos y categorías son sanitizadas en backend con **OWASP Java HTML Sanitizer** antes de persistir, evitando ataques XSS.
3. **Idempotencia:** Los pedidos registran una `claveOperacion` única (UUID) para evitar duplicidad de cobro y de descuento de stock.
4. **Calculadoras Comerciales:**
   * **Andamios:** `POST /api/v1/catalogo/calculadoras/andamios` calcula modulación referencial y advierte si supera stock en bodega.
   * **Ascensores:** `POST /api/v1/catalogo/calculadoras/ascensores` filtra equipos que cumplen altura y capacidad solicitada.
