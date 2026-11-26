USE inmaqui_catalogo;

-- Categorías
INSERT INTO categorias (id, codigo, nombre, descripcion_html, tipo_atributos, activo) VALUES
(1, 'ascensores', 'Ascensores', '<p>Equipos de elevación vertical para carga y obra.</p>', 'ASCENSOR', TRUE),
(2, 'camiones', 'Camiones', '<p>Vehículos pesados para transporte y movimiento de tierra.</p>', 'CAMION', TRUE),
(3, 'herramientas', 'Herramientas', '<p>Herramientas eléctricas e inalámbricas para faenas.</p>', 'HERRAMIENTA', TRUE),
(4, 'indumentaria', 'Indumentaria', '<p>Elementos de protección personal y seguridad en obra.</p>', 'INDUMENTARIA', TRUE),
(5, 'andamios', 'Andamios', '<p>Estructuras modulares tubulares para trabajo en altura.</p>', 'ANDAMIO', TRUE)
ON DUPLICATE KEY UPDATE activo = categorias.activo;

-- Productos
INSERT INTO productos (id, codigo, nombre, categoria_id, descripcion_html, precio, precio_anterior, stock, imagen, atributos, activo, creado_en) VALUES
(1, 'ASC-2T', 'Ascensor de obra 2T', 1, 
 '<p>Ascensor de obra para el traslado vertical de materiales en proyectos de construcción. Su cabina facilita la carga de herramientas e insumos entre distintos niveles.</p><p><strong>Nota:</strong> Altura de elevación referencial de 100 m.</p>', 
 6500000, NULL, 10, 'ascensores.jpg', 
 '{"capacidadKg": 2000, "alturaMaxMetros": 100, "tamano": "3,2 × 1,5 × 2,5 m"}', TRUE, NOW()),

(2, 'ASC-1T', 'Ascensor industrial 1T', 1, 
 '<p>Equipo de elevación pensado para mover materiales entre niveles de bodegas y espacios industriales.</p><p><strong>Nota:</strong> Altura de elevación referencial de 30 m.</p>', 
 4900000, NULL, 12, 'ascensores.jpg', 
 '{"capacidadKg": 1000, "alturaMaxMetros": 30, "tamano": "2,0 × 1,5 × 2,2 m"}', TRUE, NOW()),

(3, 'CAM-20T', 'Camión tolva 20T', 2, 
 '<p>Camión para transportar áridos, tierra y materiales a granel en faenas de construcción.</p>', 
 48900000, NULL, 14, 'camiones.jpg', 
 '{"tonelaje": 20, "tamano": "8,5 × 2,5 × 3,4 m"}', TRUE, NOW()),

(4, 'CAM-12T', 'Camión tolva 12T', 2, 
 '<p>Camión tolva de capacidad intermedia para el transporte de materiales en obras.</p>', 
 34900000, NULL, 16, 'camiones.jpg', 
 '{"tonelaje": 12, "tamano": "7,1 × 2,5 × 3,1 m"}', TRUE, NOW()),

(5, 'HERR-18V', 'Taladro inalámbrico 18V', 3, 
 '<p>Taladro inalámbrico para tareas de perforación y atornillado con movilidad.</p>', 
 89990, 99990, 18, 'herramientas.jpg', 
 '{"voltaje": "18V", "tamano": "22 × 8 × 24 cm"}', TRUE, NOW()),

(6, 'HERR-20V', 'Taladro percutor 20V', 3, 
 '<p>Taladro con función percutora para trabajos de instalación en obra.</p>', 
 129990, NULL, 20, 'herramientas.jpg', 
 '{"voltaje": "20V", "tamano": "24 × 8 × 25 cm"}', TRUE, NOW()),

(7, 'IND-CASCO-AMARILLO', 'Casco de seguridad amarillo', 4, 
 '<p>Casco para equipar al personal con ajuste de contorno de 53 a 63 cm.</p>', 
 12990, 15990, 22, 'indumentaria.jpg', 
 '{"ajusteMinCm": 53, "ajusteMaxCm": 63, "certificacionVerificada": false}', TRUE, NOW()),

(8, 'IND-CASCO-SUPERVISOR', 'Casco de supervisor', 4, 
 '<p>Casco ajustable para supervisión en terreno con ajuste de 54 a 62 cm.</p>', 
 18990, NULL, 24, 'indumentaria.jpg', 
 '{"ajusteMinCm": 54, "ajusteMaxCm": 62, "certificacionVerificada": false}', TRUE, NOW()),

(9, 'AND-MOD-2X1', 'Andamio modular estándar 2x1', 5, 
 '<p>Módulo de andamio tubular prefabricado para fachada y mantenimiento. Dimensiones referenciales por cuerpo: 2,00 m ancho x 1,00 m alto.</p><p><em>Aviso: Cálculo de modulación comercial referencial.</em></p>', 
 45000, NULL, 50, 'andamios.jpg', 
 '{"anchoModuloMetros": 2.0, "altoModuloMetros": 1.0}', TRUE, NOW())
ON DUPLICATE KEY UPDATE stock = productos.stock;

INSERT INTO articulos_blog (slug, titulo, resumen, contenido_html, imagen, publicado) VALUES
('elegir-equipo', 'Qué revisar antes de elegir un equipo',
 'La tarea, el espacio y la capacidad que necesitas.',
 '<p>Define la tarea y el lugar de trabajo. Esa información permite comparar equipos con un criterio común.</p><h2>Capacidad y dimensiones</h2><p>Revisa el tonelaje y las dimensiones en la ficha del producto y confirma los requerimientos de instalación y operación.</p>',
 'obra', TRUE),
('preparar-entrega', 'Cómo preparar la entrega de tu maquinaria',
 'Los datos que ayudan a coordinar el retiro o despacho.',
 '<p>Antes de comprar, revisa el espacio necesario para recibir y maniobrar el equipo.</p><h2>Coordina la recepción</h2><ul><li>Confirma la dirección y las condiciones de acceso.</li><li>Designa a la persona que recibirá la maquinaria.</li><li>Comprueba que el equipo recibido coincide con tu comprobante.</li></ul>',
 'camiones', TRUE)
ON DUPLICATE KEY UPDATE publicado = articulos_blog.publicado;
