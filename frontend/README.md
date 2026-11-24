# INMAQUI · Frontend (React + Vite)

Frontend migrado a una API REST con JWT. Todo el tráfico usa rutas relativas
`/api/v1/...`; el proxy de Vite en desarrollo y Nginx en producción enrutan los
microservicios.

## Comandos

```bash
npm install
npm run dev          # proxy a Java (8081/8082/8083)
npm run dev:mock     # mocks de desarrollo, sin backend
npm run lint
npm test
npm run build
```

También puedes activar los mocks con `INMAQUI_MOCKS=1`. **No** actives los
mocks en producción.

## Proxy de desarrollo

| Ruta | Destino |
| --- | --- |
| `/api/v1/auth`, `/api/v1/usuarios` | `http://localhost:8081` |
| `/api/v1/categorias`, `/api/v1/catalogo` | `http://localhost:8082` |
| `/api/v1/ventas` | `http://localhost:8083` |

## Sesión y carrito

- El JWT se guarda **solo en memoria** (`src/services/api.js`). No hay
  `localStorage`, `sessionStorage` ni refresh token.
- Al recargar la página hay que volver a iniciar sesión (limitación acordada).
- El único dato persistido es el carrito provisional en `localStorage` con
  `{ productoId, cantidad }`. Productos, precios y stock se obtienen siempre de
  la API.

## Credenciales de los mocks

| Usuario | Clave | Rol |
| --- | --- | --- |
| `admin` | `Admin!9` | `ADMINISTRADOR` |
| `cliente` | `Cliente!9` | `CLIENTE` |

RUTs válidos para probar checkout: `11111111-1`, `12345678-5`.

## Rutas principales

`/`, `/catalogo`, `/producto/:id`, `/categoria/:id`, `/categorias`, `/ofertas`,
`/carrito`, `/checkout`, `/resultado-compra`, `/acceso`, `/perfil`,
`/administracion`, `/calculadora/andamios`, `/calculadora/ascensores`,
`/nosotros`, `/contacto`, `/blog`, `/creditos`.

La ruta `/arriendos` fue eliminada: los cálculos se hacen en las calculadoras y
la oferta comercial se consulta en el catálogo.

## Reglas de negocio implementadas

- Checkout invitado o registrado con nombre, apellidos, RUT, correo y
  `resultadoPagoPrueba` (`APROBAR|RECHAZAR`).
- `claveOperacion` UUID por intento; la API rechaza duplicados con 409.
- RETIRO: $0. DESPACHO: solo RM; $50.000 si subtotal < $1.000.000 y $100.000
  si es >=. Totales finales los confirma la API.
- Pedidos: `PENDIENTE/CONFIRMADO/RECHAZADO`. Solo CONFIRMADO descuenta stock.
- Admin: CRUD por API, baja lógica e `incluirInactivos=true`.
- Atributos dinámicos desde `categoria.tipoAtributos`; no se exige
  `tonelaje: 'No aplica'`.
- Descripciones con Tiptap y sanitización DOMPurify antes de renderizar HTML.

## Handoff para I3 (archivos que no se modificaron)

No se tocaron `Header.jsx`, `Footer.jsx`, `ServiciosInicio.jsx`, `Hero.jsx`,
`Blog.jsx`, `inmaqui.css` ni los tests. Pendiente allí:

1. Quitar enlaces y textos de `/arriendos`:
   - `src/components/Footer.jsx:29`
   - `src/components/ServiciosInicio.jsx:17,24`
   - `src/components/Hero.jsx:73,109` (y textos de arriendo en 95,105)
   - `src/pages/Blog.jsx:60`
2. Quitar el enlace público a `/administracion` en
   `src/components/Footer.jsx:47`. El panel ya es accesible desde el encabezado
   de la app y desde `/acceso` solo para usuarios `ADMINISTRADOR`.
3. Agregar enlaces a `/calculadora/andamios` y `/calculadora/ascensores` en el
   menú del footer/header.
4. Animar `.product-card` con GSAP: instalar `gsap`, crear un contexto en el
   efecto y llamar a `ctx.revert()` en la limpieza. Si se quiere animar el
   título del hero, primero añadir la clase `.hero-title` a los `<h1>` de
   `Hero.jsx` (hoy no existe).

## Verificación

- `npm run lint`: sin errores.
- `npm test`: 4 archivos, 12 pruebas en verde.
- `npm run build`: correcto; aviso no bloqueante de chunk > 500 kB (Tiptap).
- Smoke test con `npm run dev:mock`: catálogo, login JWT, 401 sin token,
  calculadoras, pedidos APROBAR/RECHAZAR, 409 por clave duplicada, tarifas de
  despacho y descuento de stock solo en pedidos confirmados.
