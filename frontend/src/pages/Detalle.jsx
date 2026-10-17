
import { Link, useParams } from 'react-router-dom'
import productos from '../data/productos.json'

import ascensores from '../assets/img/ascensores.jpg'
import camiones from '../assets/img/camiones.jpg'
import herramientas from '../assets/img/herramientas.jpg'
import indumentaria from '../assets/img/indumentaria.jpg'

const imagenes = {
  'ascensores.jpg': ascensores,
  'camiones.jpg': camiones,
  'herramientas.jpg': herramientas,
  'indumentaria.jpg': indumentaria
}

function Detalle({ onAgregar }) {
  const { id } = useParams()

  const producto = productos.find(
    (item) => String(item.id) === id
  )

  if (!producto) {
    return (
      <main className="container py-5">
        <h1>Producto no encontrado</h1>
        <p>El producto solicitado no existe.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(producto.precio)

  return (
    <main className="container py-5">

      <nav aria-label="Ruta de navegación" className="mb-4">
        <Link to="/catalogo">Catálogo</Link>
        <span> / {producto.nombre}</span>
      </nav>

      <div className="row g-5">

        <div className="col-lg-6">
          <img
            src={imagenes[producto.imagen] || ascensores}
            alt={producto.nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-lg-6">
          <span className="eyebrow">
            {producto.categoria}
          </span>

          <h1>{producto.nombre}</h1>

          <p className="lead">
            {producto.descripcion}
          </p>

          <h2 className="my-4">
            {precioFormateado}
          </h2>

          <p>
            Stock disponible: <strong>{producto.stock}</strong>
          </p>

          <div className="d-flex gap-3 flex-wrap mt-4">
            <button
                type="button"
                className="btn btn-primary"
                disabled={producto.stock < 1}
                onClick={() => onAgregar(producto.id, 1)}
                >
                {producto.stock > 0
                    ? 'Agregar al carrito'
                    : 'Sin stock'}
            </button>

            <Link
              to="/catalogo"
              className="btn btn-outline-secondary"
            >
              Seguir explorando
            </Link>
          </div>
        </div>

      </div>

    </main>
  )
}

export default Detalle
