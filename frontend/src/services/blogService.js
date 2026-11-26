import { api } from './api.js'

export function listarArticulos() {
  return api.get('/catalogo/blog')
}

export function obtenerArticulo(slug) {
  return api.get(`/catalogo/blog/${encodeURIComponent(slug)}`)
}

export function administrarArticulos() {
  return api.get('/catalogo/admin/blog', { auth: true })
}

export function guardarArticulo({ id, slug, titulo, resumen, contenidoHtml, imagen }) {
  const opciones = { body: { slug, titulo, resumen, contenidoHtml, imagen: imagen || null }, auth: true }
  return id ? api.put(`/catalogo/blog/${id}`, opciones) : api.post('/catalogo/blog', opciones)
}

export function cambiarPublicacion(id, publicado) {
  return api.patch(`/catalogo/blog/${id}/estado`, { body: { publicado }, auth: true })
}
