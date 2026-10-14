# INMAQUI · Grupo 09 · Versión básica

Esta versión mantiene el diseño turquesa y las fotografías. La lógica se reescribió con funciones tradicionales, constantes, condiciones, ciclos `for`, arreglos y expresiones regulares.

## Abrir el proyecto

1. Descomprime todo el ZIP.
2. Abre `index.html` en el navegador.
3. Para editar, abre la carpeta en Visual Studio Code.

Bootstrap y las fotografías están incluidos; no necesitas descargarlos. No se incluye ningún servidor, iniciador de Node.js ni instalación de paquetes.

**Carrito entre páginas:** el comportamiento de `localStorage` al abrir archivos directamente depende del navegador. Si no conserva la selección entre páginas, abre `index.html` con la extensión Live Server de Visual Studio Code, manteniendo la misma dirección durante la demostración. El proyecto no contiene código de servidor.

## Registro y login sin almacenamiento

Ambos formularios están en **login.html**, con botones para cambiar entre Ingresar y Registrarse sin abandonar la página. El panel de administrador también está allí.

- No existe una cuenta predefinida. Primero selecciona **Registrarse**.
- Las cuentas se agregan a un arreglo de JavaScript y solo existen mientras esa página permanece abierta.
- El registro comprueba campos vacíos, nombre válido y usuario repetido, aunque cambien las mayúsculas.
- La contraseña debe tener al menos 6 caracteres, una letra, un símbolo y una mayúscula. Los espacios no cuentan como símbolo.
- La confirmación debe coincidir con la contraseña.
- Después de registrarte puedes iniciar sesión y cerrar sesión sin salir de la página.
- Al recargar o salir de la página se pierden las cuentas y el acceso. No se usa almacenamiento ni se transfieren credenciales por enlaces. No confíes en que Volver del navegador reinicie siempre la página: algunos navegadores la restauran desde su memoria; para empezar de cero, recarga.

Ejemplo: nombre `Ana Pérez`, usuario `admin.grupo09`, contraseña `Admin!9`.

Es una simulación académica. Las contraseñas de prueba se comparan directamente en memoria, sin hash ni cifrado. No uses datos ni contraseñas reales.

## Carrito

Es la única función que utiliza `localStorage`. No usa JSON ni guarda el catálogo completo. Guarda una clave por producto con la cantidad como texto, por ejemplo:

`inmaquiBasico.cantidad.taladro-18v` → `2`

El cálculo usa los precios del arreglo sencillo que está en `js/datos-carrito.js`. Se permiten de 1 a 99 unidades por producto. Las filas están escritas en `carrito.html`: JavaScript solo muestra u oculta filas, cambia cantidades y actualiza los totales. No crea tarjetas ni etiquetas HTML.

Los datos del carrito de la versión anterior no se importan, ya que usaban otro formato.

## Diseño sin estilos en línea

- Toda la presentación está en **style.css** y las clases de **Bootstrap**.
- No hay atributos `style`, bloques `<style>` ni cambios de `.style` en el JavaScript propio.
- La visibilidad cambia mediante la clase Bootstrap `d-none`.
- Los atributos `onclick`, `oninput` y `onchange` conectan botones y campos con funciones, como en los ejemplos de clase. Son comportamiento, no estilos.
- Bootstrap es una biblioteca externa incluida sin modificaciones. Sus archivos internos contienen técnicas más avanzadas; las restricciones de esta adaptación se aplican al código que ustedes editan, no al código interno de Bootstrap.

## Archivos para editar

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio, carrusel y destacados escritos en HTML |
| `index2.html` | Las ocho tarjetas y botones de categorías |
| `ascensor-obra.html`, `ascensor-industrial.html` | Fichas de ascensores |
| `camion-tolva.html`, `camion-tolva-12.html` | Fichas de camiones |
| `taladro-18v.html`, `taladro-percutor.html` | Fichas de herramientas |
| `casco-seguridad.html`, `casco-supervisor.html` | Fichas de indumentaria |
| `login.html` | Registro, login y panel de administrador |
| `carrito.html` | Todas las filas y el resumen del carrito |
| `nosotros.html` | Empresa, misión, visión y valores |
| `contacto.html`, `index3.html` | Contacto, arriendo y servicios |
| `style.css` | Colores, tamaños y diseño adaptable |
| `js/general.js` | Avisos y mensajes de error |
| `js/catalogo.js` | Filtrar las tarjetas existentes por nombre y categoría |
| `js/cuentas.js` | Registro, comprobación de duplicados y login en memoria |
| `js/datos-carrito.js` | Identificadores, nombres y precios para los cálculos |
| `js/carrito.js` | Cantidades, almacenamiento y cálculo de totales |
| `js/formularios.js` | Validaciones de contacto y arriendo |

Al cambiar un precio o nombre, actualiza la ficha, las tarjetas donde aparezca, la fila del carrito y `js/datos-carrito.js`. Ahora el contenido es explícito y se repite en HTML para evitar su generación con JavaScript.

Los enlaces apuntan a archivos concretos: las fichas no usan parámetros como `?id=...`. Los enlaces internos a secciones, como `#contacto`, son anclas normales de HTML y no se procesan con JavaScript. Se retiró el ordenamiento por precio para mantener los filtros sencillos.

## Pruebas para la presentación

1. En Registro, envía los campos vacíos y observa los errores.
2. Prueba `abc123`, `Abc123`, `abc12!` y `Ab!1`: deben fallar. `Abcd!1` cumple los cuatro requisitos.
3. Registra un administrador e intenta repetir el usuario cambiando las mayúsculas.
4. Prueba login vacío, contraseña incorrecta y acceso correcto. Cierra sesión y vuelve a ingresar sin recargar.
5. Recarga la página de acceso e intenta ingresar: debes registrarte nuevamente.
6. En el catálogo, filtra por categoría y busca `camion`. Revisa el mensaje sin resultados y restablece los filtros.
7. Abre las fichas y agrega productos. Cambia cantidades, quita un producto y prueba cancelar o confirmar el vaciado del carrito.
8. Recarga el carrito y comprueba su persistencia. Revisa el total, que incluye IVA pero no despacho.
9. Prueba los formularios de contacto y arriendo. El RUT `12345678-5` sirve como ejemplo válido; el teléfono debe tener formato `+56912345678`.

Los formularios no envían correos y el carrito no cobra ni genera pedidos. Precios, capacidades, tamaños y textos son ejemplos editables. Mantener los créditos de las fotografías en `creditos.html` y `FUENTES-IMAGENES.md`.
