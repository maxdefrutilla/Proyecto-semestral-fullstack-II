import { Link } from 'react-router-dom'

import { dinero } from '../data/operaciones.js'

export default function ResultadoCompra({ pedido, estado }) {
  const estadoPedido = String(pedido?.estado ?? '').toUpperCase()
  const estadoEsperado = estado ? String(estado).toUpperCase() : estadoPedido

  if (!pedido || !estadoPedido || estadoPedido !== estadoEsperado) {
    return (
      <main className="container py-5">
        <h1>No hay un resultado disponible.</h1>
        <Link to="/carrito">Volver al carrito</Link>
      </main>
    )
  }

  const confirmado = estadoPedido === 'CONFIRMADO'
  const comprador = pedido.comprador ?? {}
  const items = Array.isArray(pedido.items) ? pedido.items : []
  const esDespacho = String(pedido.tipoEntrega ?? pedido.entrega ?? '').toUpperCase() === 'DESPACHO'

  return (
    <main className="container py-5">
      <div
        className={`alert ${confirmado ? 'alert-success' : 'alert-danger'}`}
        role="status"
      >
        <h1 className="h3">
          {confirmado
            ? '¡Tu pedido fue confirmado!'
            : 'No pudimos procesar tu pedido'}
        </h1>
        <p className="mb-0">
          {confirmado
            ? 'El servidor registró tu pedido correctamente.'
            : (pedido.motivoRechazo || 'La operación no se completó. Puedes intentarlo nuevamente.')}
        </p>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h2 className="h4">Resumen del pedido</h2>

          <p><strong>Número:</strong> {pedido.pedidoId ?? pedido.id}</p>
          <p><strong>Estado:</strong> {estadoPedido}</p>
          <p>
            <strong>Cliente:</strong>{' '}
            {comprador.nombre ?? pedido.nombre}{' '}
            {comprador.apellidos ?? pedido.apellidos ?? ''}
          </p>
          <p><strong>RUT:</strong> {comprador.rut ?? pedido.rut}</p>
          <p><strong>Correo:</strong> {comprador.correo ?? pedido.correo}</p>
          <p>
            <strong>Entrega:</strong>{' '}
            {esDespacho ? 'Despacho a domicilio' : 'Retiro en tienda'}
          </p>

          {esDespacho && (
            <p>
              <strong>Dirección:</strong> {pedido.direccion}, {pedido.comuna}
            </p>
          )}

          <hr />

          {items.map((item) => (
            <div
              key={item.productoId ?? item.id ?? item.nombre}
              className="d-flex justify-content-between mb-2"
            >
              <span>{item.nombre} × {item.cantidad}</span>
              <span>
                {dinero((item.precio ?? item.precioUnitario ?? 0) * item.cantidad)}
              </span>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <strong>{dinero(pedido.subtotal ?? 0)}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Entrega</span>
            <strong>{dinero(pedido.costoDespacho ?? pedido.despacho ?? 0)}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <strong>Total confirmado por el servidor</strong>
            <strong>{dinero(pedido.total ?? 0)}</strong>
          </div>

          <p className="image-note mt-3 mb-0">
            Comprobante de demostración. No es una boleta tributaria.
          </p>
        </div>
      </div>

      <Link
        to={confirmado ? '/catalogo' : '/checkout'}
        className="btn btn-primary mt-4"
      >
        {confirmado ? 'Seguir explorando' : 'Intentar nuevamente'}
      </Link>
    </main>
  )
}
