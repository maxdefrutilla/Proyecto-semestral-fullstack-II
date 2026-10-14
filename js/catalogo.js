// Las tarjetas ya están escritas en index2.html.
// Estos filtros solo agregan o quitan clases para mostrarlas u ocultarlas.

let categoriaSeleccionada = "todas";

function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;
    const botones = document.querySelectorAll(".filter-option");

    for (let i = 0; i < botones.length; i++) {
        botones[i].classList.remove("active");
        botones[i].setAttribute("aria-pressed", "false");
    }

    const seleccionado = document.getElementById("filtro-" + categoria);
    seleccionado.classList.add("active");
    seleccionado.setAttribute("aria-pressed", "true");
    filtrarProductos();
}

function textoBusqueda(texto) {
    // Permite buscar "camion" aunque el nombre diga "camión".
    return texto.toLowerCase().trim()
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u");
}

function filtrarProductos() {
    const busqueda = textoBusqueda(document.getElementById("productSearch").value);
    const tarjetas = document.querySelectorAll(".producto-catalogo");
    let encontrados = 0;

    for (let i = 0; i < tarjetas.length; i++) {
        const categoria = tarjetas[i].getAttribute("data-categoria");
        const nombre = textoBusqueda(tarjetas[i].getAttribute("data-nombre"));
        const coincideCategoria = categoriaSeleccionada === "todas" || categoria === categoriaSeleccionada;
        const coincideNombre = nombre.indexOf(busqueda) !== -1;

        if (coincideCategoria && coincideNombre) {
            tarjetas[i].classList.remove("d-none");
            encontrados++;
        } else {
            tarjetas[i].classList.add("d-none");
        }
    }

    document.getElementById("resultCount").textContent = encontrados + " productos";
    const sinResultados = document.getElementById("sinResultados");
    if (encontrados === 0) {
        sinResultados.classList.remove("d-none");
    } else {
        sinResultados.classList.add("d-none");
    }
}

function restablecerFiltros() {
    document.getElementById("productSearch").value = "";
    seleccionarCategoria("todas");
}
