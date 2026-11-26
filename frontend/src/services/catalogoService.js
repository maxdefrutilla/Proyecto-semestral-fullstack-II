import { api } from './api.js'

function normalizarProducto(producto) {
  let atributos = producto.atributos
  if (typeof atributos === 'string') {
    try {
      atributos = JSON.parse(atributos)
    } catch {
      atributos = {}
    }
  }
  return { ...producto, atributos: atributos && typeof atributos === 'object' ? atributos : {} }
}

function textoInactivos(incluirInactivos) {
  return incluirInactivos ? { incluirInactivos: 'true' } : undefined
}

export async function listarProductos({ incluirInactivos = false, auth = false } = {}) {
  const productos = await api.get('/catalogo/productos', {
    params: textoInactivos(incluirInactivos),
    auth,
  })
  return productos.map(normalizarProducto)
}

export async function obtenerProducto(id) {
  return normalizarProducto(await api.get(`/catalogo/productos/${encodeURIComponent(id)}`))
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
  return api.get('/catalogo/categorias', {
    params: textoInactivos(incluirInactivas),
    auth,
  })
}

export async function crearCategoria(categoria) {
  return api.post('/catalogo/categorias', { body: categoria, auth: true })
}

export async function actualizarCategoria(id, categoria) {
  return api.put(`/catalogo/categorias/${encodeURIComponent(id)}`, {
    body: categoria,
    auth: true,
  })
}

export async function desactivarCategoria(id) {
  return api.delete(`/catalogo/categorias/${encodeURIComponent(id)}`, { auth: true })
}

export async function listarUsuarios() {
  return api.get('/usuarios', {
    params: { incluirInactivos: 'true' },
    auth: true,
  })
}

export async function actualizarUsuarioAdministrativo(id, usuario) {
  return api.put(`/usuarios/${encodeURIComponent(id)}`, {
    body: usuario,
    auth: true,
  })
}

export async function cambiarRolUsuario(id, rol) {
  return api.patch(`/usuarios/${encodeURIComponent(id)}/rol`, { body: { rol }, auth: true })
}

export async function cambiarEstadoUsuario(id, activo) {
  return api.patch(`/usuarios/${encodeURIComponent(id)}/estado`, { body: { activo }, auth: true })
}

export async function calcularAndamios(datos) {
  return api.post('/catalogo/calculadoras/andamios', { body: datos })
}

export async function calcularAscensores(datos) {
  const productos = await api.post('/catalogo/calculadoras/ascensores', { body: datos })
  return productos.map(normalizarProducto)
}
