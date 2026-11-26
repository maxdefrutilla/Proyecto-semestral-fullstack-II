import { api, guardarToken, borrarToken } from './api.js'

function normalizarRol(rol) {
  const texto = String(rol ?? '').toUpperCase()
  if (texto === 'ADMIN' || texto === 'ADMINISTRADOR') return 'ADMINISTRADOR'
  return texto || 'CLIENTE'
}

export function normalizarUsuario(datos = {}) {
  return {
    ...datos,
    id: datos.id ?? datos.usuarioId ?? null,
    nombre: datos.nombre ?? '',
    apellidos: datos.apellidos ?? '',
    usuario: datos.usuario ?? '',
    rut: datos.rut ?? '',
    correo: datos.correo ?? '',
    direccion: datos.direccion ?? '',
    comuna: datos.comuna ?? '',
    telefono: datos.telefono ?? '',
    rol: normalizarRol(datos.rol),
    activo: datos.activo !== false,
  }
}

const cabeceras = { 'X-Inmaqui-Session': '1' }

function leerSesion(datos) {
  const { token, usuario } = datos
  if (!token || !usuario) throw new Error('La respuesta de autenticación no es válida.')
  guardarToken(token)
  return { token, usuario: normalizarUsuario(usuario) }
}

export async function login({ usuario, clave }) {
  const operacion = async () => leerSesion(await api.post('/auth/login', {
    body: { usuario, password: clave }, cabeceras,
  }))
  return navigator.locks ? navigator.locks.request('inmaqui-sesion', operacion) : operacion()
}

export async function renovar() {
  const operacion = async () => leerSesion(await api.post('/auth/refresh', { cabeceras }))
  return navigator.locks ? navigator.locks.request('inmaqui-sesion', operacion) : operacion()
}

export async function registro({ clave, ...datos }) {
  return api.post('/auth/registro', { body: { ...datos, password: clave } })
}

export async function obtenerPerfil() {
  return normalizarUsuario(await api.get('/usuarios/me', { auth: true }))
}

export async function actualizarPerfil(datos) {
  return normalizarUsuario(
    await api.put('/usuarios/me', { body: datos, auth: true })
  )
}

export async function logout() {
  const operacion = () => api.post('/auth/logout', { cabeceras })
  await (navigator.locks ? navigator.locks.request('inmaqui-sesion', operacion) : operacion())
  borrarToken()
}
