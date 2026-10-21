export function buscarRegistro(lista, id) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === id) return lista[i];
  }
  return null;
}

export function siguienteId(lista) {
  let mayor = 0;
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id > mayor) mayor = lista[i].id;
  }
  return mayor + 1;
}

export function crearRegistro(lista, registro) {
  return [...lista, registro];
}

export function editarRegistro(lista, registro) {
  const nuevaLista = [];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === registro.id) nuevaLista.push(registro);
    else nuevaLista.push(lista[i]);
  }
  return nuevaLista;
}

export function eliminarRegistro(lista, id) {
  const nuevaLista = [];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id !== id) nuevaLista.push(lista[i]);
  }
  return nuevaLista;
}

export function dinero(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

export function nombreCategoria(categorias, codigo) {
  for (let i = 0; i < categorias.length; i++) {
    if (categorias[i].codigo === codigo) return categorias[i].nombre;
  }
  return codigo;
}

export function claveValida(clave) {
  const letra = /[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/;
  const mayuscula = /[A-ZÁÉÍÓÚÑÜ]/;
  const simbolo = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]/;
  return (
    clave.length >= 6 &&
    letra.test(clave) &&
    mayuscula.test(clave) &&
    simbolo.test(clave)
  );
}

export function validarRut(rut) {
  const limpio = rut.trim().replace(/\./g, "").toUpperCase();
  if (!/^\d{7,8}-[0-9K]$/.test(limpio)) return false;
  const partes = limpio.split("-");
  let suma = 0;
  let factor = 2;
  for (let i = partes[0].length - 1; i >= 0; i--) {
    suma += Number(partes[0][i]) * factor;
    factor++;
    if (factor === 8) factor = 2;
  }
  const resultado = 11 - (suma % 11);
  let digito = String(resultado);
  if (resultado === 11) digito = "0";
  if (resultado === 10) digito = "K";
  return partes[1] === digito;
}
