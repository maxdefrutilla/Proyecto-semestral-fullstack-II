// Validaciones con el mismo estilo de los formularios originales:
// constantes, expresiones regulares, condiciones y mensajes junto a cada campo.

function validarRut(rut) {
    const limpio = rut.trim().replace(/\./g, "").toUpperCase();
    const regexRut = /^\d{7,8}-[0-9K]$/;
    if (!regexRut.test(limpio)) {
        return false;
    }

    const partes = limpio.split("-");
    const cuerpo = partes[0];
    const digito = partes[1];
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma = suma + Number(cuerpo[i]) * multiplicador;
        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resultado = 11 - suma % 11;
    let calculado = String(resultado);
    if (resultado === 11) {
        calculado = "0";
    } else if (resultado === 10) {
        calculado = "K";
    }
    return digito === calculado;
}

function seleccionarPlan(plan) {
    document.getElementById("tipo").value = "arriendo";
    document.getElementById("mensaje").value = "Me interesa el plan " + plan.toLowerCase() + ". Fechas de mi proyecto: ";
}

function validarFormulario(event) {
    event.preventDefault();
    const formulario = event.currentTarget;
    limpiarErrores(formulario);
    let valido = true;

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/;
    const regexTelefono = /^\+569[0-9]{8}$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexNombre.test(nombre)) {
        mostrarError("nombre", "Ingresa un nombre válido de 2 a 50 letras.");
        valido = false;
    }
    if (!regexTelefono.test(telefono)) {
        mostrarError("telefono", "Ingresa un celular con formato +56912345678.");
        valido = false;
    }
    if (!regexCorreo.test(correo)) {
        mostrarError("correo", "Ingresa un correo electrónico válido.");
        valido = false;
    }

    if (formulario.id === "contactForm") {
        const empresa = document.getElementById("empresa").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const asunto = document.getElementById("asunto").value.trim();
        if (empresa.length < 2) {
            mostrarError("empresa", "Ingresa el nombre de tu empresa.");
            valido = false;
        }
        if (!validarRut(rut)) {
            mostrarError("rut", "Ingresa un RUT válido. Ejemplo: 12345678-5.");
            valido = false;
        }
        if (asunto === "" || asunto.length > 50) {
            mostrarError("asunto", "Ingresa un asunto de hasta 50 caracteres.");
            valido = false;
        }
    } else {
        if (document.getElementById("tipo").value === "") {
            mostrarError("tipo", "Selecciona un tipo de solicitud.");
            valido = false;
        }
        if (document.getElementById("equipo").value === "") {
            mostrarError("equipo", "Selecciona un equipo de interés.");
            valido = false;
        }
    }

    if (mensaje === "") {
        mostrarError("mensaje", "Escribe tu mensaje.");
        valido = false;
    } else if (mensaje.split(/\s+/).length > 500) {
        mostrarError("mensaje", "El mensaje no puede superar las 500 palabras.");
        valido = false;
    }

    if (valido) {
        const modal = new bootstrap.Modal(document.getElementById("confirmationModal"));
        modal.show();
    } else {
        enfocarPrimerError(formulario);
    }
}

const contacto = document.getElementById("contactForm");
const cotizacion = document.getElementById("quoteForm");
if (contacto !== null) {
    contacto.addEventListener("submit", validarFormulario);
}
if (cotizacion !== null) {
    cotizacion.addEventListener("submit", validarFormulario);
}
