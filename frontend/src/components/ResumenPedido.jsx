import { dinero } from "../data/operaciones";

export default function ResumenPedido(props) {
  const pedido = props.pedido;
  const filas = [];
  for (let i = 0; i < pedido.items.length; i++) {
    const item = pedido.items[i];
    filas.push(
      <tr key={item.id}>
        <td>{item.nombre}</td>
        <td>{item.cantidad}</td>
        <td>{dinero(item.precio * item.cantidad)}</td>
      </tr>,
    );
  }
  return (
    <div className="form-surface mt-3">
      <h3>Pedido de prueba #{pedido.id}</h3>
      <p>
        {pedido.fecha} · {pedido.nombre} · {pedido.estado}
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
        {pedido.entrega}
        {pedido.entrega === "Despacho a domicilio"
          ? ": " + pedido.direccion + ", " + pedido.comuna
          : ""}
      </p>
      <p>Entrega: {dinero(pedido.despacho)}</p>
      <strong>Total: {dinero(pedido.total)}</strong>
      <p className="image-note mt-2 mb-0">
        Comprobante de demostración. No es una boleta tributaria.
      </p>
    </div>
  );
}
