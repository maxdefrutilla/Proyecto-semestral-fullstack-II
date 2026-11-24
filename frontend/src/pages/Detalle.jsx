import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import imagenes from '../data/imagenes.js'
import { obtenerProducto } from '../services/catalogoService.js'
import { sanitizarHtml } from '../utils/html.js'

function etiqueta(nombre) {
  return String(nombre)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letra) => letra.toUpperCase())
}

function Detalle({ productos, onAgregar }) {
  const { id } = useParams()
  const [remoto, setRemoto] = useState(null)
  const [cargando, setCargando] = useState(!productos)
  const [error, setError] = useState('')

  useEffect(() => {
    if (productos) return
    let activo = true
    Promise.resolve().then(() => {
      setCargando(true)
      obtenerProducto(id)
        .then((respuesta) => { if (activo) setRemoto(respuesta) })
        .catch((fallo) => {
          if (activo) setError(fallo?.message ?? 'No fue posible cargar el producto.')
        })
        .finally(() => { if (activo) setCargando(false) })
    })
    return () => { activo = false }
  }, [id, productos])

  const producto = productos
    ? productos.find((item) => String(item.id) === String(id))
    : remoto

  if (cargando) {
    return (
      <main className="container py-5">
        <p className="alert alert-info" role="status">Cargando producto…</p>
      </main>
    )
  }

  if (!producto) {
    return (
      <main className="container py-5">
        <h1>Producto no encontrado</h1>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p>El producto solicitado no existe.</p>
        <Link to="/catalogo" className="btn btn-primary">Volver al catálogo</Link>
      </main>
    )
  }

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(producto.precio)
  const atributos = producto.atributos && typeof producto.atributos === 'object'
    ? Object.entries(producto.atributos)
    : []
  const descripcion = producto.descripcionHtml
    ? sanitizarHtml(producto.descripcionHtml)
    : ''

  return (
    <main className="container py-5">
      <nav aria-label="Ruta de navegación" className="mb-4">
        <Link to="/catalogo">Catálogo</Link>
        <span> / {producto.nombre}</span>
      </nav>

      <div className="row g-5">
        <div className="col-lg-6">
          <img
            src={imagenes[producto.imagen] || imagenes.obra}
            alt={producto.nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-lg-6">
          <span className="eyebrow">{producto.categoria}</span>
          <h1>{producto.nombre}</h1>

          {descripcion ? (
            <div className="lead" dangerouslySetInnerHTML={{ __html: descripcion }} />
          ) : (
            <p className="lead">{producto.descripcion ?? ''}</p>
          )}

          <h2 className="my-4">{precioFormateado}</h2>
          <p>Stock disponible: <strong>{producto.stock}</strong></p>

          {atributos.length > 0 && (
            <ul className="list-unstyled">
              {atributos.map(([clave, valor]) => (
                <li key={clave}>
                  <strong>{etiqueta(clave)}:</strong>{' '}
                  {typeof valor === 'boolean' ? (valor ? 'Sí' : 'No') : String(valor)}
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex gap-3 flex-wrap mt-4">
            <button
              type="button"
              className="btn btn-primary"
              disabled={producto.stock < 1 || producto.activo === false || !onAgregar}
              onClick={() => onAgregar(producto.id, 1)}
            >
              {producto.stock > 0 && producto.activo !== false
                ? 'Agregar al carrito'
                : 'Sin stock'}
            </button>
            <Link to="/catalogo" className="btn btn-outline-secondary">
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Detalle
