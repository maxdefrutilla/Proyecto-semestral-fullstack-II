
import TarjetaProducto from './TarjetaProducto.jsx'

function ListaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return (
      <div className="alert alert-info">
        No hay productos disponibles.
      </div>
    )
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div
          className="col-md-6 col-xl-3"
          key={producto.id}
        >
          <TarjetaProducto
            producto={producto}
            onAgregar={onAgregar}
          />
        </div>
      ))}
    </div>
  )
}

export default ListaProductos
