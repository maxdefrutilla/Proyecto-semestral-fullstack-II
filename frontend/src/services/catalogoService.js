import { api } from './api.js'

function textoInactivos(incluirInactivos) {
  return incluirInactivos ? { incluirInactivos: 'true' } : undefined
}

export async function listarProductos({ incluirInactivos = false, auth = false } = {}) {
  return api.get('/catalogo/productos', {
    params: textoInactivos(incluirInactivos),
    auth,
  })
}

export async function obtenerProducto(id) {
  return api.get(`/catalogo/productos/${encodeURIComponent(id)}`)
}

export async function crearProducto(producto) {
  return api.post('/catalogo/productos', { body: producto, auth: true })
}

export async function actualizarProducto(id, producto) {
  return api.put(`/catalogo/productos/${encodeURIComponent(id)}`, {
    body: producto,
    auth: true,
  })
}

export async function desactivarProducto(id) {
  return api.delete(`/catalogo/productos/${encodeURIComponent(id)}`, { auth: true })
}

export async function listarCategorias({ incluirInactivas = false, auth = false } = {}) {
  return api.get('/categorias', {
    params: textoInactivos(incluirInactivas),
    auth,
  })
}

export async function crearCategoria(categoria) {
  return api.post('/categorias', { body: categoria, auth: true })
}

export async function actualizarCategoria(id, categoria) {
  return api.put(`/categorias/${encodeURIComponent(id)}`, {
    body: categoria,
    auth: true,
  })
}

export async function desactivarCategoria(id) {
  return api.delete(`/categorias/${encodeURIComponent(id)}`, { auth: true })
}

export async function listarUsuarios() {
  return api.get('/usuarios', {
    params: { incluirInactivos: 'true' },
    auth: true,
  })
}

export async function crearUsuarioAdministrativo(usuario) {
  return api.post('/usuarios', { body: usuario, auth: true })
}

export async function actualizarUsuarioAdministrativo(id, usuario) {
  return api.put(`/usuarios/${encodeURIComponent(id)}`, {
    body: usuario,
    auth: true,
  })
}

export async function desactivarUsuario(id) {
  return api.delete(`/usuarios/${encodeURIComponent(id)}`, { auth: true })
}

export async function calcularAndamios(datos) {
  return api.post('/catalogo/calculadoras/andamios', { body: datos })
}

export async function calcularAscensores(datos) {
  return api.post('/catalogo/calculadoras/ascensores', { body: datos })
}
