// Único cliente HTTP de la aplicación. Todas las rutas son relativas: en
// desarrollo Vite las proxya a los microservicios y en producción lo hace Nginx.
const BASE_URL = '/api/v1'

let tokenEnMemoria = null
let renovarSesion = null

export function alExpirarSesion(callback) {
  renovarSesion = callback
  return () => { renovarSesion = null }
}

export function guardarToken(token) {
  tokenEnMemoria = token || null
}

export function leerToken() {
  return tokenEnMemoria
}

export function borrarToken() {
  tokenEnMemoria = null
}

export class ApiError extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.detalles = detalles
  }
}

function construirUrl(ruta, parametros) {
  const url = new URL(`${BASE_URL}${ruta}`, window.location.origin)
  if (parametros) {
    Object.entries(parametros).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        url.searchParams.set(clave, String(valor))
      }
    })
  }
  return url.pathname + url.search
}

function mensajePorEstado(status, cuerpo) {
  const mensaje = cuerpo?.mensaje ?? cuerpo?.message ?? cuerpo?.error
  if (typeof mensaje === 'string' && mensaje.trim()) return mensaje

  const mensajes = {
    400: 'Revisa los datos ingresados.',
    401: 'Debes iniciar sesión para continuar.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'No encontramos el recurso solicitado.',
    409: 'Los datos entran en conflicto con el estado actual.',
    500: 'El servidor no pudo completar la operación.'
  }
  return mensajes[status] ?? 'No fue posible completar la operación.'
}

async function parsearRespuesta(respuesta) {
  const texto = await respuesta.text()
  if (!texto) return null
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

export async function request(ruta, opciones = {}) {
  const {
    method = 'GET',
    body,
    params,
    auth = false,
    cabeceras = {},
    reintentar = true,
    signal
  } = opciones

  const headers = { Accept: 'application/json', ...cabeceras }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && tokenEnMemoria) {
    headers.Authorization = `Bearer ${tokenEnMemoria}`
  }

  let respuesta
  try {
    respuesta = await fetch(construirUrl(ruta, params), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal
    })
  } catch (error) {
    if (error?.name === 'AbortError') throw error
    throw new ApiError(0, 'No fue posible conectar con el servidor.')
  }

  if (respuesta.status === 401 && auth && reintentar && renovarSesion) {
    if (!tokenEnMemoria || headers.Authorization === `Bearer ${tokenEnMemoria}`) {
      await renovarSesion()
    }
    if (tokenEnMemoria) return request(ruta, { ...opciones, reintentar: false })
  }

  const datos = await parsearRespuesta(respuesta)
  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, mensajePorEstado(respuesta.status, datos), datos)
  }
  return datos
}

export const api = {
  get: (ruta, opciones = {}) => request(ruta, { ...opciones, method: 'GET' }),
  post: (ruta, opciones = {}) => request(ruta, { ...opciones, method: 'POST' }),
  put: (ruta, opciones = {}) => request(ruta, { ...opciones, method: 'PUT' }),
  patch: (ruta, opciones = {}) => request(ruta, { ...opciones, method: 'PATCH' }),
  delete: (ruta, opciones = {}) => request(ruta, { ...opciones, method: 'DELETE' }),
}

export { BASE_URL }
