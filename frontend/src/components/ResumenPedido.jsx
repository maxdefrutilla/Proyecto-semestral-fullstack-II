import { dinero } from '../data/operaciones.js'

export default function ResumenPedido({ pedido = {} }) {
  const items = Array.isArray(pedido.items) ? pedido.items : []
  const entrega = pedido.tipoEntrega ?? pedido.entrega ?? 'RETIRO'
  const esDespacho = String(entrega).toUpperCase() === 'DESPACHO' || entrega === 'Despacho a domicilio'
  const filas = items.map((item) => (
    <tr key={item.productoId ?? item.id ?? `${item.nombre}-${item.cantidad}`}>
      <td>{item.nombre}</td>
      <td>{item.cantidad}</td>
      <td>{dinero((item.precio ?? item.precioUnitario ?? 0) * item.cantidad)}</td>
    </tr>
  ))

  return (
    <div className="form-surface mt-3">
      <h3>Pedido #{pedido.pedidoId ?? pedido.id}</h3>
      <p>
        {pedido.fecha ?? ''} · {pedido.comprador?.nombre ?? pedido.nombre ?? ''} · {pedido.estado ?? ''}
      </p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>
      <p>
        {esDespacho
          ? `Despacho a domicilio: ${pedido.direccion ?? ''}, ${pedido.comuna ?? ''}`
          : 'Retiro en tienda'}
      </p>
      <p>Entrega: {dinero(pedido.costoDespacho ?? pedido.despacho ?? 0)}</p>
      <strong>Total: {dinero(pedido.total ?? 0)}</strong>
      <p className="image-note mt-2 mb-0">
        Comprobante de demostración. No es una boleta tributaria.
      </p>
    </div>
  )
}
