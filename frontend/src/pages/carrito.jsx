import { useState } from 'react'
import { Link } from 'react-router-dom'

import imagenes from '../data/imagenes.js'
import { dinero } from '../data/operaciones.js'

export default function Carrito({
  carrito,
  productos,
  onCambiarCantidad,
  onEliminar,
  onVaciar,
}) {
  const [confirmarVaciado, setConfirmarVaciado] = useState(false)

  const items = carrito.flatMap((item) => {
    const producto = productos.find(
      (registro) => String(registro.id) === String(item.productoId)
    )
    return producto ? [{ ...producto, cantidad: item.cantidad }] : []
  })

  const faltantes = carrito.length - items.length
  const itemsInvalidos = items.filter(
    (item) => item.activo === false || item.cantidad > item.stock
  )
  const hayProblemas = faltantes > 0 || itemsInvalidos.length > 0

  const total = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  )

  if (items.length === 0) {
    return (
      <main className="container py-5">
        <h1>Tu carrito de compras</h1>

        <div className="alert alert-info mt-4">
          Tu carrito está vacío.
        </div>

        <Link to="/catalogo" className="btn btn-primary">
          Explorar catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <h1>Tu carrito de compras</h1>
      <p>Revisa los productos y cantidades seleccionadas.</p>
      <p className="small text-muted">
        Precios, stock y disponibilidad se obtienen desde el servidor.
      </p>

      {faltantes > 0 && (
        <p className="alert alert-warning" role="status">
          {faltantes} producto(s) ya no están disponibles en el catálogo.
        </p>
      )}
      {itemsInvalidos.length > 0 && (
        <p className="alert alert-warning" role="status">
          Algunos productos cambiaron de precio o no tienen stock suficiente.
          Revisa las cantidades antes de continuar.
        </p>
      )}

      <div className="row g-4 mt-2">
        <div className="col-lg-8">
          {items.map((producto) => (
            <article className="card mb-3" key={producto.id}>
              <div className="card-body">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={imagenes[producto.imagen] || imagenes.obra}
                      alt={producto.nombre}
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="col-md-9">
                    <h2 className="h5">
                      <Link to={`/producto/${producto.id}`}>
                        {producto.nombre}
                      </Link>
                    </h2>

                    <p className="text-muted mb-2">
                      {dinero(producto.precio)} por unidad
                    </p>

                    <p className="small">
                      Stock disponible: {producto.stock}
                    </p>

                    {producto.activo === false && (
                      <p className="small text-danger mb-2">
                        Producto dado de baja.
                      </p>
                    )}

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={producto.cantidad <= 1}
                        onClick={() =>
                          onCambiarCantidad(producto.id, producto.cantidad - 1)
                        }
                      >
                        −
                      </button>

                      <span className="fw-bold px-2">{producto.cantidad}</span>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={
                          producto.cantidad >= producto.stock ||
                          producto.cantidad >= 99
                        }
                        onClick={() =>
                          onCambiarCantidad(producto.id, producto.cantidad + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger ms-md-auto"
                        onClick={() => onEliminar(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>

                    <p className="fw-bold mt-3 mb-0">
                      Subtotal: {dinero(producto.precio * producto.cantidad)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {!confirmarVaciado ? (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setConfirmarVaciado(true)}
            >
              Vaciar carrito
            </button>
          ) : (
            <div className="alert alert-warning">
              <p>¿Quieres eliminar todos los productos?</p>
              <button
                type="button"
                className="btn btn-danger me-2"
                onClick={onVaciar}
              >
                Sí, vaciar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setConfirmarVaciado(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h4">Resumen</h2>

              <p className="d-flex justify-content-between">
                <span>Productos</span>
                <strong>{dinero(total)}</strong>
              </p>

              <p>IVA incluido</p>
              <p className="small text-muted">
                El despacho se calcula en el checkout según la comuna.
              </p>

              <hr />

              <p className="d-flex justify-content-between fs-5">
                <strong>Subtotal</strong>
                <strong>{dinero(total)}</strong>
              </p>

              {hayProblemas ? (
                <button type="button" className="btn btn-primary w-100" disabled>
                  Continuar con la compra
                </button>
              ) : (
                <Link to="/checkout" className="btn btn-primary w-100">
                  Continuar con la compra
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>

      <Link className="btn btn-link mt-4" to="/catalogo">
        ← Seguir explorando
      </Link>
    </main>
  )
}
