// Los usuarios existen solamente en este arreglo, mientras la página está abierta.
// No se guardan cuentas ni contraseñas en el navegador.
const usuariosRegistrados = [];

const formRegistro = document.getElementById("formRegistro");
const formLogin = document.getElementById("formLogin");

function mensajeCuenta(texto, correcto) {
    const mensaje = document.getElementById("mensajeCuenta");
    mensaje.textContent = texto;
    mensaje.classList.remove("d-none", "alert-success", "alert-danger");
    if (correcto) {
        mensaje.classList.add("alert-success");
    } else {
        mensaje.classList.add("alert-danger");
    }
    mensaje.focus();
}

function mostrarLogin() {
    document.getElementById("seccionLogin").classList.remove("d-none");
    document.getElementById("seccionRegistro").classList.add("d-none");
    document.getElementById("mensajeCuenta").classList.add("d-none");
    document.getElementById("botonIngresar").className = "btn btn-primary btn-sm";
    document.getElementById("botonRegistrar").className = "btn btn-outline-primary btn-sm";
    document.getElementById("botonIngresar").setAttribute("aria-pressed", "true");
    document.getElementById("botonRegistrar").setAttribute("aria-pressed", "false");
    document.getElementById("loginUsuario").focus();
}

function mostrarRegistro() {
    document.getElementById("seccionLogin").classList.add("d-none");
    document.getElementById("seccionRegistro").classList.remove("d-none");
    document.getElementById("mensajeCuenta").classList.add("d-none");
    document.getElementById("botonIngresar").className = "btn btn-outline-primary btn-sm";
    document.getElementById("botonRegistrar").className = "btn btn-primary btn-sm";
    document.getElementById("botonIngresar").setAttribute("aria-pressed", "false");
    document.getElementById("botonRegistrar").setAttribute("aria-pressed", "true");
    document.getElementById("registroNombre").focus();
}

function marcarRequisito(id, cumple) {
    const requisito = document.getElementById(id);
    if (cumple) {
        requisito.classList.add("passed");
    } else {
        requisito.classList.remove("passed");
    }
}

function revisarRequisitos() {
    const clave = document.getElementById("registroClave").value;
    const regexLetra = /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/;
    const regexMayuscula = /[A-ZÁÉÍÓÚÑÜ]/;
    const regexSimbolo = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]/;

    marcarRequisito("requisitoLargo", clave.length >= 6);
    marcarRequisito("requisitoLetra", regexLetra.test(clave));
    marcarRequisito("requisitoSimbolo", regexSimbolo.test(clave));
    marcarRequisito("requisitoMayuscula", regexMayuscula.test(clave));
}

formRegistro.addEventListener("submit", function(event) {
    event.preventDefault();
    limpiarErrores(formRegistro);
    document.getElementById("mensajeCuenta").classList.add("d-none");

    const nombre = document.getElementById("registroNombre").value.trim();
    const usuario = document.getElementById("registroUsuario").value.trim().toLowerCase();
    const clave = document.getElementById("registroClave").value;
    const confirmacion = document.getElementById("registroConfirmacion").value;

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,80}$/;
    const regexUsuario = /^[a-z0-9._-]{3,30}$/;
    const regexLetra = /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/;
    const regexMayuscula = /[A-ZÁÉÍÓÚÑÜ]/;
    const regexSimbolo = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]/;
    let valido = true;

    if (!regexNombre.test(nombre)) {
        mostrarError("registroNombre", "Ingresa un nombre válido de 2 a 80 letras.");
        valido = false;
    }

    if (!regexUsuario.test(usuario)) {
        mostrarError("registroUsuario", "Usa de 3 a 30 letras, números, puntos o guiones.");
        valido = false;
    } else {
        for (let i = 0; i < usuariosRegistrados.length; i++) {
            if (usuariosRegistrados[i].usuario === usuario) {
                mostrarError("registroUsuario", "Este usuario ya está registrado. Elige otro.");
                valido = false;
            }
        }
    }

    if (clave.trim() === "") {
        mostrarError("registroClave", "Ingresa una contraseña.");
        valido = false;
    } else if (clave.length < 6 || !regexLetra.test(clave) || !regexSimbolo.test(clave) || !regexMayuscula.test(clave)) {
        mostrarError("registroClave", "Usa al menos 6 caracteres, una letra, un símbolo y una mayúscula.");
        valido = false;
    }

    if (confirmacion === "" || clave !== confirmacion) {
        mostrarError("registroConfirmacion", "Repite la misma contraseña.");
        valido = false;
    }

    if (valido === false) {
        enfocarPrimerError(formRegistro);
        return;
    }

    usuariosRegistrados.push({ nombre: nombre, usuario: usuario, clave: clave });
    formRegistro.reset();
    verClaveRegistro();
    revisarRequisitos();
    mostrarLogin();
    document.getElementById("loginUsuario").value = usuario;
    mensajeCuenta("Administrador registrado. Ahora puedes iniciar sesión en esta misma página.", true);
});

formLogin.addEventListener("submit", function(event) {
    event.preventDefault();
    limpiarErrores(formLogin);
    document.getElementById("mensajeCuenta").classList.add("d-none");

    const usuario = document.getElementById("loginUsuario").value.trim().toLowerCase();
    const clave = document.getElementById("loginClave").value;
    let valido = true;

    if (usuario === "") {
        mostrarError("loginUsuario", "Ingresa tu usuario.");
        valido = false;
    }
    if (clave.trim() === "") {
        mostrarError("loginClave", "Ingresa tu contraseña.");
        valido = false;
    }
    if (valido === false) {
        enfocarPrimerError(formLogin);
        return;
    }

    let posicion = -1;
    for (let i = 0; i < usuariosRegistrados.length; i++) {
        if (usuariosRegistrados[i].usuario === usuario && usuariosRegistrados[i].clave === clave) {
            posicion = i;
        }
    }

    if (posicion === -1) {
        mensajeCuenta("Usuario o contraseña incorrectos. Debes registrarte primero en esta página.", false);
        return;
    }

    document.getElementById("saludoAdministrador").textContent = "Hola, " + usuariosRegistrados[posicion].nombre + ".";
    document.getElementById("usuarioAdministrador").textContent = usuariosRegistrados[posicion].usuario;
    document.getElementById("seccionLogin").classList.add("d-none");
    document.getElementById("opcionesCuenta").classList.add("d-none");
    document.getElementById("panelAdministrador").classList.remove("d-none");
    formLogin.reset();
    verClaveLogin();
}
);

function cerrarSesion() {
    document.getElementById("panelAdministrador").classList.add("d-none");
    document.getElementById("opcionesCuenta").classList.remove("d-none");
    document.getElementById("saludoAdministrador").textContent = "";
    document.getElementById("usuarioAdministrador").textContent = "";
    mostrarLogin();
}

function verClaveLogin() {
    const clave = document.getElementById("loginClave");
    if (document.getElementById("verLogin").checked) {
        clave.type = "text";
    } else {
        clave.type = "password";
    }
}

function verClaveRegistro() {
    const clave = document.getElementById("registroClave");
    const confirmacion = document.getElementById("registroConfirmacion");
    if (document.getElementById("verRegistro").checked) {
        clave.type = "text";
        confirmacion.type = "text";
    } else {
        clave.type = "password";
        confirmacion.type = "password";
    }
}
