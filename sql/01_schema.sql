-- =============================================================================
-- ESQUEMA 1: inmaqui_usuarios
-- =============================================================================
CREATE DATABASE IF NOT EXISTS inmaqui_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inmaqui_usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(80) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL UNIQUE,
    correo VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NULL,
    comuna VARCHAR(100) NULL,
    telefono VARCHAR(20) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ESQUEMA 2: inmaqui_catalogo
-- =============================================================================
CREATE DATABASE IF NOT EXISTS inmaqui_catalogo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inmaqui_catalogo;

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion_html TEXT NULL,
    tipo_atributos VARCHAR(30) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    categoria_id BIGINT NOT NULL,
    descripcion_html TEXT NOT NULL,
    precio BIGINT NOT NULL,
    precio_anterior BIGINT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(500) NULL,
    atributos JSON NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS reservas_stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reserva_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reserva_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario BIGINT NOT NULL,
    CONSTRAINT fk_reserva_items_reserva FOREIGN KEY (reserva_id) REFERENCES reservas_stock(id),
    CONSTRAINT fk_reserva_items_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- =============================================================================
-- ESQUEMA 3: inmaqui_ventas
-- =============================================================================
CREATE DATABASE IF NOT EXISTS inmaqui_ventas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inmaqui_ventas;

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL,
    nombre VARCHAR(80) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    telefono VARCHAR(20) NULL,
    tipo_entrega VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NULL,
    comuna VARCHAR(100) NULL,
    observaciones VARCHAR(500) NULL,
    subtotal BIGINT NOT NULL,
    costo_despacho BIGINT NOT NULL,
    total BIGINT NOT NULL,
    estado VARCHAR(20) NOT NULL,
    motivo_rechazo VARCHAR(255) NULL,
    clave_operacion VARCHAR(36) NOT NULL UNIQUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedido_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    nombre_producto VARCHAR(120) NOT NULL,
    precio_unitario BIGINT NOT NULL,
    cantidad INT NOT NULL,
    subtotal BIGINT NOT NULL,
    CONSTRAINT fk_pedido_items_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);