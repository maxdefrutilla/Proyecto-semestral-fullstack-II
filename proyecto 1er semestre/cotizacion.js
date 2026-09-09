// ============================================
// FORMULARIO DE COTIZACION
// ============================================


// OBTENER EL FORMULARIO
const formCotizacion =
    document.getElementById("formCotizacion");


// OBTENER DATOS DEL FORMULARIO
const cotNombre =
    document.getElementById("cotNombre");

const cotTelefono =
    document.getElementById("cotTelefono");

const cotCorreo =
    document.getElementById("cotCorreo");

const cotTipo =
    document.getElementById("cotTipo");

const cotEquipo =
    document.getElementById("cotEquipo");

const cotMensaje =
    document.getElementById("cotMensaje");

// MODAL COTIZACION
const modalCotizacion =
    document.getElementById("modalCotizacion");

const cerrarModalCotizacion =
    document.getElementById("cerrarModalCotizacion");

// OBTENER MENSAJES DE ERROR
const errorCotNombre =
    document.getElementById("errorCotNombre");

const errorCotTelefono =
    document.getElementById("errorCotTelefono");

const errorCotCorreo =
    document.getElementById("errorCotCorreo");

const errorCotTipo =
    document.getElementById("errorCotTipo");

const errorCotEquipo =
    document.getElementById("errorCotEquipo");

const errorCotMensaje =
    document.getElementById("errorCotMensaje");




// ============================================
// VALIDAR FORMULARIO
// ============================================

formCotizacion.addEventListener("submit", function(event) {

    // EVITA QUE LA PAGINA SE RECARGUE
    event.preventDefault();


    // EXPRESIONES REGULARES
    const regexNombre =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/;

    const regexTelefono =
        /^\+569[0-9]{8}$/;

    const regexCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    let formularioValido = true;


    // LIMPIAR ERRORES ANTERIORES
    errorCotNombre.textContent = "";
    errorCotTelefono.textContent = "";
    errorCotCorreo.textContent = "";
    errorCotTipo.textContent = "";
    errorCotEquipo.textContent = "";
    errorCotMensaje.textContent = "";


    // ============================================
    // VALIDAR NOMBRE
    // ============================================

    if (!regexNombre.test(cotNombre.value.trim())) {

        errorCotNombre.textContent =
            "Ingrese un nombre válido.";

        cotNombre.classList.add("is-invalid");
        cotNombre.classList.remove("is-valid");

        formularioValido = false;

    } else {

        cotNombre.classList.remove("is-invalid");
        cotNombre.classList.add("is-valid");
    }


    // ============================================
    // VALIDAR TELEFONO
    // ============================================

    if (!regexTelefono.test(cotTelefono.value.trim())) {

        errorCotTelefono.textContent =
            "Ingrese un teléfono válido. Ejemplo: +56912345678";

        cotTelefono.classList.add("is-invalid");
        cotTelefono.classList.remove("is-valid");

        formularioValido = false;

    } else {

        cotTelefono.classList.remove("is-invalid");
        cotTelefono.classList.add("is-valid");
    }


    // ============================================
    // VALIDAR CORREO
    // ============================================

    if (!regexCorreo.test(cotCorreo.value.trim())) {

        errorCotCorreo.textContent =
            "Ingrese un correo válido.";

        cotCorreo.classList.add("is-invalid");
        cotCorreo.classList.remove("is-valid");

        formularioValido = false;

    } else {

        cotCorreo.classList.remove("is-invalid");
        cotCorreo.classList.add("is-valid");
    }


    // ============================================
    // VALIDAR TIPO DE SOLICITUD
    // ============================================

    if (cotTipo.value === "") {

        errorCotTipo.textContent =
            "Seleccione un tipo de solicitud.";

        cotTipo.classList.add("is-invalid");
        cotTipo.classList.remove("is-valid");

        formularioValido = false;

    } else {

        cotTipo.classList.remove("is-invalid");
        cotTipo.classList.add("is-valid");
    }


    // ============================================
    // VALIDAR EQUIPO
    // ============================================

    if (cotEquipo.value === "") {

        errorCotEquipo.textContent =
            "Seleccione un equipo.";

        cotEquipo.classList.add("is-invalid");
        cotEquipo.classList.remove("is-valid");

        formularioValido = false;

    } else {

        cotEquipo.classList.remove("is-invalid");
        cotEquipo.classList.add("is-valid");
    }


    // ============================================
    // VALIDAR MENSAJE
    // ============================================

    if (cotMensaje.value.trim().length === 0) {

        errorCotMensaje.textContent =
            "Ingrese un mensaje.";

        cotMensaje.classList.add("is-invalid");
        cotMensaje.classList.remove("is-valid");

        formularioValido = false;

    } else {

        const cantidadPalabras =
            cotMensaje.value.trim().split(/\s+/).length;

        if (cantidadPalabras > 500) {

            errorCotMensaje.textContent =
                "El mensaje no puede superar las 500 palabras.";

            cotMensaje.classList.add("is-invalid");
            cotMensaje.classList.remove("is-valid");

            formularioValido = false;

        } else {

            cotMensaje.classList.remove("is-invalid");
            cotMensaje.classList.add("is-valid");
        }
    }


    // ============================================
    // SI TODO ES VALIDO
    // ============================================

        if (formularioValido) {

            modalCotizacion.style.display = "flex";
        }

});

// CERRAR MODAL AL HACER CLICK EN ACEPTAR
cerrarModalCotizacion.addEventListener("click", function() {

    modalCotizacion.style.display = "none";
});


// CERRAR MODAL AL HACER CLICK FUERA DEL CUADRO
modalCotizacion.addEventListener("click", function(event) {

    if (event.target === modalCotizacion) {

        modalCotizacion.style.display = "none";
    }

});