// Único archivo que utiliza localStorage.
// Cada producto tiene una clave y guarda solamente su cantidad como texto.
// Ejemplo: inmaquiBasico.cantidad.taladro-18v = "2"

let almacenamientoAvisado = false;

function leerCantidad(id) {
    try {
        const cantidad = localStorage.getItem("inmaquiBasico.cantidad." + id);
        const regexCantidad = /^[1-9][0-9]?$/;

        if (cantidad !== null && regexCantidad.test(cantidad)) {
            return Number(cantidad);
        }
    } catch (error) {
        if (almacenamientoAvisado === false) {
            mostrarAviso("Habilita el almacenamiento del navegador para usar el carrito.");
            almacenamientoAvisado = true;
        }
    }

    return 0;
}

function guardarCantidad(id, cantidad) {
    // Si el navegador bloquea el almacenamiento, se informa al usuario.
    try {
        if (cantidad === 0) {
            localStorage.removeItem("inmaquiBasico.cantidad." + id);
        } else {
            localStorage.setItem("inmaquiBasico.cantidad." + id, String(cantidad));
        }
        return true;
    } catch (error) {
        mostrarAviso("No se pudo guardar el carrito. Revisa el almacenamiento del navegador.");
        return false;
    }
}

function formatoPrecio(precio) {
    return "$" + precio.toLocaleString("es-CL");
}

function agregarCarrito(id, cantidad) {
    const regexCantidad = /^[1-9][0-9]?$/;
    if (!regexCantidad.test(String(cantidad))) {
        mostrarAviso("Ingresa una cantidad entera entre 1 y 99.");
        return;
    }

    let nombre = "";
    for (let i = 0; i < productosCarrito.length; i++) {
        if (productosCarrito[i].id === id) {
            nombre = productosCarrito[i].nombre;
        }
    }
    if (nombre === "") {
        mostrarAviso("No se encontró el producto.");
        return;
    }

    const nuevaCantidad = leerCantidad(id) + Number(cantidad);
    if (nuevaCantidad > 99) {
        mostrarAviso("Puedes agregar hasta 99 unidades de cada producto.");
        return;
    }

    if (guardarCantidad(id, nuevaCantidad)) {
        actualizarCarrito();
        mostrarAviso(nombre + ": agregado al carrito.");
    }
}

function actualizarCarrito() {
    let unidades = 0;
    let total = 0;

    for (let i = 0; i < productosCarrito.length; i++) {
        const producto = productosCarrito[i];
        const cantidad = leerCantidad(producto.id);
        unidades = unidades + cantidad;
        total = total + producto.precio * cantidad;

        // Las filas también están escritas en HTML, dentro de carrito.html.
        const fila = document.getElementById("fila-" + producto.id);
        if (fila !== null) {
            if (cantidad > 0) {
                fila.classList.remove("d-none");
                document.getElementById("cantidad-" + producto.id).value = cantidad;
                document.getElementById("subtotal-" + producto.id).textContent = formatoPrecio(producto.precio * cantidad);
            } else {
                fila.classList.add("d-none");
            }
        }
    }

    document.getElementById("cartCount").textContent = unidades;
    document.getElementById("cartCount").setAttribute("aria-label", unidades + " unidades en el carrito");

    const contenido = document.getElementById("carritoConProductos");
    if (contenido !== null) {
        const vacio = document.getElementById("carritoVacio");
        if (unidades === 0) {
            contenido.classList.add("d-none");
            vacio.classList.remove("d-none");
        } else {
            contenido.classList.remove("d-none");
            vacio.classList.add("d-none");
        }

        document.getElementById("unidadesCarrito").textContent = unidades + " unidades seleccionadas";
        document.getElementById("precioProductos").textContent = formatoPrecio(total);
        document.getElementById("totalCarrito").textContent = formatoPrecio(total);
        document.getElementById("checkoutSummary").textContent = "Tu selección contiene " + unidades + " unidades. Total de productos: " + formatoPrecio(total) + ", IVA incluido, sin despacho.";
    }
}

function cambiarCantidad(id, cambio) {
    const nuevaCantidad = leerCantidad(id) + cambio;
    if (nuevaCantidad < 1 || nuevaCantidad > 99) {
        mostrarAviso("La cantidad debe estar entre 1 y 99. Usa Quitar producto para eliminarlo.");
        return;
    }

    guardarCantidad(id, nuevaCantidad);
    actualizarCarrito();
}

function editarCantidad(id) {
    const campo = document.getElementById("cantidad-" + id);
    const regexCantidad = /^[1-9][0-9]?$/;

    if (!regexCantidad.test(campo.value)) {
        mostrarAviso("Ingresa una cantidad entera entre 1 y 99.");
        campo.value = leerCantidad(id);
        return;
    }

    guardarCantidad(id, Number(campo.value));
    actualizarCarrito();
}

function quitarProducto(id) {
    if (guardarCantidad(id, 0)) {
        actualizarCarrito();
        mostrarAviso("Producto eliminado del carrito.");
    }
}

function vaciarCarrito() {
    let completo = true;
    for (let i = 0; i < productosCarrito.length; i++) {
        if (!guardarCantidad(productosCarrito[i].id, 0)) {
            completo = false;
        }
    }
    actualizarCarrito();
    if (completo) {
        mostrarAviso("Carrito vaciado.");
    }
}

function revisarSolicitud() {
    actualizarCarrito();
    const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
    modal.show();
}

// Se ejecuta al abrir cada página para actualizar el contador del menú.
actualizarCarrito();
