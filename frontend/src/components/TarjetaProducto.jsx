
import { Link } from 'react-router-dom'

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

const nombresCategorias = {
  ascensores: 'Ascensores',
  camiones: 'Camiones',
  herramientas: 'Herramientas',
  indumentaria: 'Indumentaria'
}

function TarjetaProducto({ producto, onAgregar }) {
  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(producto.precio)

  return (
    <article className="product-card">

      <Link
        className="product-image"
        to={`/producto/${producto.id}`}
      >
        <img
          src={imagenes[producto.imagen] || ascensores}
          alt={`Imagen referencial: ${producto.nombre}`}
          loading="lazy"
        />

        <span className="product-category">
          {nombresCategorias[producto.categoria]}
        </span>
      </Link>

      <div className="product-body">
        <span className="muted-label">
          {producto.etiqueta}
        </span>

        <h3>
          <Link to={`/producto/${producto.id}`}>
            {producto.nombre}
          </Link>
        </h3>

        <p className="product-meta">
          {producto.tonelaje} · {producto.tamano}
        </p>

        {producto.oferta && (
          <span className="oferta-label">
            Oferta · Antes ${producto.precioAnterior.toLocaleString('es-CL')}
          </span>
        )}

        <div className="product-price">
          {precioFormateado}
          <small>IVA incluido · Precio referencial</small>
        </div>

        <div className="product-actions">
          <Link
            className="btn btn-outline-primary"
            to={`/producto/${producto.id}`}
          >
            Ver detalle
          </Link>

          <button
            className="btn btn-primary"
            disabled={producto.stock < 1 || !onAgregar}
            onClick={() => onAgregar(producto.id, 1)}
          >
            {producto.stock > 0 ? '+ Agregar' : 'Sin stock'}
          </button>
        </div>
      </div>

    </article>
  )
}

export default TarjetaProducto
