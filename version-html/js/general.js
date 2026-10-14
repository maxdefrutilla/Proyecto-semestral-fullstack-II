// Funciones pequeñas compartidas por los formularios y los avisos.

function mostrarAviso(mensaje) {
    const texto = document.getElementById("toastMessage");
    texto.textContent = mensaje;

    const aviso = new bootstrap.Toast(document.getElementById("siteToast"));
    aviso.show();
}

function mostrarError(id, mensaje) {
    const campo = document.getElementById(id);
    const error = document.getElementById(id + "Error");

    campo.classList.add("is-invalid");
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function limpiarErrores(formulario) {
    const campos = formulario.querySelectorAll(".is-invalid");
    const mensajes = formulario.querySelectorAll(".invalid-feedback");

    for (let i = 0; i < campos.length; i++) {
        campos[i].classList.remove("is-invalid");
        campos[i].removeAttribute("aria-invalid");
    }

    for (let i = 0; i < mensajes.length; i++) {
        mensajes[i].textContent = "";
    }
}

function enfocarPrimerError(formulario) {
    const campo = formulario.querySelector(".is-invalid");
    if (campo !== null) {
        campo.focus();
    }
}
