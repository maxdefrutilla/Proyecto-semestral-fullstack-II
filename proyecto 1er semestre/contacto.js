// BOTON PARA MOSTRAR FORMULARIO
const btnMostrarContacto =
    document.getElementById("btnMostrarContacto");

const contenedorFormularioContacto =
    document.getElementById("contenedorFormularioContacto");


// MOSTRAR FORMULARIO AL HACER CLICK
btnMostrarContacto.addEventListener("click", function() {

    contenedorFormularioContacto.classList.remove(
        "formulario-oculto"
    );

    contenedorFormularioContacto.classList.add(
        "formulario-visible"
    );

});


// OBTENER FORMULARIO
const formContacto =
    document.getElementById("formContacto");


// OBTENER DATOS
const contactoNombre =
    document.getElementById("contactoNombre");

const contactoRut =
    document.getElementById("contactoRut");

const contactoTelefono =
    document.getElementById("contactoTelefono");

const contactoCorreo =
    document.getElementById("contactoCorreo");

const contactoEmpresa =
    document.getElementById("contactoEmpresa");

const contactoAsunto =
    document.getElementById("contactoAsunto");

const contactoMensaje =
    document.getElementById("contactoMensaje");


// MENSAJES DE ERROR
const errorContactoNombre =
    document.getElementById("errorContactoNombre");

const errorContactoRUT =
    document.getElementById("errorContactoRUT");

const errorContactoTelefono =
    document.getElementById("errorContactoTelefono");

const errorContactoCorreo =
    document.getElementById("errorContactoCorreo");

const errorContactoEmpresa =
    document.getElementById("errorContactoEmpresa");

const errorContactoAsunto =
    document.getElementById("errorContactoAsunto");

const errorContactoMensaje =
    document.getElementById("errorContactoMensaje");


// MODAL
const modalContacto =
    document.getElementById("modalContacto");

const cerrarModalContacto =
    document.getElementById("cerrarModalContacto");


// VALIDACION MATEMATICA DEL RUT
function validarRutContacto(rut) {

    const [cuerpo, dv] = rut.toUpperCase().split("-");

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {

        suma += cuerpo[i] * multiplicador;

        multiplicador =
            multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);

    const dvCalculado =
        resultado === 11 ? "0" :
        resultado === 10 ? "K" :
        resultado.toString();

    return dv === dvCalculado;
}


// VALIDAR FORMULARIO
formContacto.addEventListener("submit", function(event) {

    event.preventDefault();

    const regexNombre =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/;

    const regexRut =
        /^\d{7,8}-[Kk\d]$/;

    const regexTel =
        /^\+569[0-9]{8}$/;

    const regexCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let formularioValido = true;


    // LIMPIAR ERRORES
    errorContactoNombre.textContent = "";
    errorContactoRUT.textContent = "";
    errorContactoTelefono.textContent = "";
    errorContactoCorreo.textContent = "";
    errorContactoEmpresa.textContent = "";
    errorContactoAsunto.textContent = "";
    errorContactoMensaje.textContent = "";


    // NOMBRE
    if (!regexNombre.test(contactoNombre.value.trim())) {

        errorContactoNombre.textContent =
            "Ingrese un nombre válido.";

        contactoNombre.classList.add("is-invalid");
        contactoNombre.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoNombre.classList.remove("is-invalid");
        contactoNombre.classList.add("is-valid");
    }


    // RUT
    if (!regexRut.test(contactoRut.value.trim())) {

        errorContactoRUT.textContent =
            "Ingrese un RUT con formato válido. Ejemplo: 12345678-5";

        contactoRut.classList.add("is-invalid");
        contactoRut.classList.remove("is-valid");

        formularioValido = false;

    } else if (!validarRutContacto(contactoRut.value.trim())) {

        errorContactoRUT.textContent =
            "El RUT ingresado no es válido.";

        contactoRut.classList.add("is-invalid");
        contactoRut.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoRut.classList.remove("is-invalid");
        contactoRut.classList.add("is-valid");
    }


    // TELEFONO
    if (!regexTel.test(contactoTelefono.value.trim())) {

        errorContactoTelefono.textContent =
            "El número ingresado no es válido. Ejemplo: +56912345678";

        contactoTelefono.classList.add("is-invalid");
        contactoTelefono.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoTelefono.classList.remove("is-invalid");
        contactoTelefono.classList.add("is-valid");
    }


    // CORREO
    if (!regexCorreo.test(contactoCorreo.value.trim())) {

        errorContactoCorreo.textContent =
            "Ingrese un correo válido.";

        contactoCorreo.classList.add("is-invalid");
        contactoCorreo.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoCorreo.classList.remove("is-invalid");
        contactoCorreo.classList.add("is-valid");
    }


    // EMPRESA
    if (contactoEmpresa.value.trim().length < 2) {

        errorContactoEmpresa.textContent =
            "Ingrese el nombre de la empresa.";

        contactoEmpresa.classList.add("is-invalid");
        contactoEmpresa.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoEmpresa.classList.remove("is-invalid");
        contactoEmpresa.classList.add("is-valid");
    }


    // ASUNTO
    if (contactoAsunto.value.trim().length === 0) {

        errorContactoAsunto.textContent =
            "Ingrese un asunto.";

        contactoAsunto.classList.add("is-invalid");
        contactoAsunto.classList.remove("is-valid");

        formularioValido = false;

    } else if (contactoAsunto.value.trim().length > 50) {

        errorContactoAsunto.textContent =
            "El asunto no puede superar los 50 caracteres.";

        contactoAsunto.classList.add("is-invalid");
        contactoAsunto.classList.remove("is-valid");

        formularioValido = false;

    } else {

        contactoAsunto.classList.remove("is-invalid");
        contactoAsunto.classList.add("is-valid");
    }


    // MENSAJE
    if (contactoMensaje.value.trim().length === 0) {

        errorContactoMensaje.textContent =
            "Ingrese un mensaje.";

        contactoMensaje.classList.add("is-invalid");
        contactoMensaje.classList.remove("is-valid");

        formularioValido = false;

    } else {

        const cantidadPalabras =
            contactoMensaje.value.trim().split(/\s+/).length;

        if (cantidadPalabras > 500) {

            errorContactoMensaje.textContent =
                "El mensaje no puede superar las 500 palabras.";

            contactoMensaje.classList.add("is-invalid");
            contactoMensaje.classList.remove("is-valid");

            formularioValido = false;

        } else {

            contactoMensaje.classList.remove("is-invalid");
            contactoMensaje.classList.add("is-valid");
        }
    }


    // TODO CORRECTO
    if (formularioValido) {

        modalContacto.style.display = "flex";
    }

});


// CERRAR MODAL
cerrarModalContacto.addEventListener("click", function() {

    modalContacto.style.display = "none";
});


// CERRAR MODAL AL HACER CLICK AFUERA
modalContacto.addEventListener("click", function(event) {

    if (event.target === modalContacto) {

        modalContacto.style.display = "none";
    }

});