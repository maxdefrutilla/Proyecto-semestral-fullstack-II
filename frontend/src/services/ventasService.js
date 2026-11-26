import { api } from './api.js'

export function normalizarPedido(pedido = {}) {
  const estado = String(pedido.estado ?? '').toUpperCase()
  const items = Array.isArray(pedido.items)
    ? pedido.items.map((item) => ({
        ...item,
        productoId: item.productoId ?? item.id,
        nombre: item.nombreProducto ?? item.nombre ?? item.productoNombre ?? 'Producto',
        cantidad: Number(item.cantidad ?? 0),
        precio: Number(item.precio ?? item.precioUnitario ?? 0),
      }))
    : []

  return {
    ...pedido,
    id: pedido.pedidoId ?? pedido.id,
    pedidoId: pedido.pedidoId ?? pedido.id,
    estado,
    fecha: pedido.creadoEn ?? pedido.fecha,
    items,
    comprador: pedido.comprador ?? {
      nombre: pedido.nombre ?? '',
      apellidos: pedido.apellidos ?? '',
      correo: pedido.correo ?? '',
      rut: pedido.rut ?? '',
    },
    nombre: pedido.nombre ?? pedido.comprador?.nombre ?? '',
    apellidos: pedido.apellidos ?? pedido.comprador?.apellidos ?? '',
    correo: pedido.correo ?? pedido.comprador?.correo ?? '',
    tipoEntrega: pedido.tipoEntrega ?? pedido.entrega ?? 'RETIRO',
    entrega: pedido.tipoEntrega ?? pedido.entrega ?? 'RETIRO',
    direccion: pedido.direccion ?? '',
    comuna: pedido.comuna ?? '',
    subtotal: Number(pedido.subtotal ?? 0),
    costoDespacho: Number(pedido.costoDespacho ?? pedido.despacho ?? 0),
    despacho: Number(pedido.costoDespacho ?? pedido.despacho ?? 0),
    total: Number(pedido.total ?? 0),
  }
}

export async function crearPedido(payload, { auth = false } = {}) {
  const respuesta = await api.post('/ventas/pedidos', { body: payload, auth })
  return normalizarPedido(respuesta)
}

export async function misPedidos() {
  const respuesta = await api.get('/ventas/mis-pedidos', { auth: true })
  const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.pedidos ?? [])
  return lista.map(normalizarPedido)
}

export async function listarPedidos() {
  const respuesta = await api.get('/ventas/pedidos', { auth: true })
  const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.pedidos ?? [])
  return lista.map(normalizarPedido)
}
