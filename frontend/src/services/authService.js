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

function extraerToken(datos = {}) {
  return datos.token ?? datos.accessToken ?? datos.jwt ?? datos.tokenAcceso ?? null
}

export async function login({ usuario, clave }) {
  const datos = await api.post('/auth/login', { body: { usuario, clave } })
  const token = extraerToken(datos)
  if (token) guardarToken(token)
  const perfil = datos.usuario ?? datos.usuarioDto ?? datos
  return { token, usuario: normalizarUsuario(perfil) }
}

export async function registro(datos) {
  return api.post('/auth/registro', { body: datos })
}

export async function obtenerPerfil() {
  return normalizarUsuario(await api.get('/usuarios/me', { auth: true }))
}

export async function actualizarPerfil(datos) {
  return normalizarUsuario(
    await api.put('/usuarios/me', { body: datos, auth: true })
  )
}

export function logout() {
  borrarToken()
}
