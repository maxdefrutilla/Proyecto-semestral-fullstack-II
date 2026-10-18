
import { Link } from 'react-router-dom'

const dinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor)

function ResultadoCompra({ pedido, estado }) {
  if (!pedido || pedido.estado !== estado) {
    return (
      <main className="container py-5">
        <h1>No hay un resultado disponible.</h1>
        <Link to="/carrito">Volver al carrito</Link>
      </main>
    )
  }

  const aprobada = estado === 'Aprobada'

  return (
    <main className="container py-5">
      <div
        className={`alert ${aprobada ? 'alert-success' : 'alert-danger'}`}
        role="status"
      >
        <h1 className="h3">
          {aprobada
            ? 'Tu compra de prueba fue aprobada'
            : 'El pago de prueba fue rechazado'}
        </h1>

        <p className="mb-0">
          {aprobada
            ? 'Se registró el pedido y se descontó el stock.'
            : 'No se descontó stock y tu carrito se conserva.'}
        </p>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h2 className="h4">Resumen del pedido</h2>

          <p><strong>Número:</strong> {pedido.id}</p>
          <p><strong>Cliente:</strong> {pedido.nombre}</p>
          <p><strong>Correo:</strong> {pedido.correo}</p>
          <p><strong>Entrega:</strong> {pedido.entrega}</p>

          {pedido.entrega === 'Despacho a domicilio' && (
            <p>
              <strong>Dirección:</strong> {pedido.direccion}, {pedido.comuna}
            </p>
          )}

          <hr />

          {pedido.items.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between mb-2"
            >
              <span>{item.nombre} × {item.cantidad}</span>
              <span>{dinero(item.precio * item.cantidad)}</span>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between">
            <strong>Total</strong>
            <strong>{dinero(pedido.total)}</strong>
          </div>
        </div>
      </div>

      <Link
        to={aprobada ? '/catalogo' : '/checkout'}
        className="btn btn-primary mt-4"
      >
        {aprobada ? 'Seguir explorando' : 'Intentar nuevamente'}
      </Link>
    </main>
  )
}

export default ResultadoCompra
