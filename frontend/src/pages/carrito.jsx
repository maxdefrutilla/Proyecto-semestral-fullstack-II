
import { useState } from 'react'
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

function dinero(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor)
}

function Carrito({
  carrito,
  productos,
  onCambiarCantidad,
  onEliminar,
  onVaciar
}) {
  const [confirmarVaciado, setConfirmarVaciado] = useState(false)

  const items = carrito.flatMap((item) => {
    const producto = productos.find((p) => p.id === item.id)

    return producto
      ? [{ ...producto, cantidad: item.cantidad }]
      : []
  })

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

      <div className="row g-4 mt-2">

        {/* PRODUCTOS DEL CARRITO */}
        <div className="col-lg-8">
          {items.map((producto) => (
            <article
              className="card mb-3"
              key={producto.id}
            >
              <div className="card-body">
                <div className="row g-3 align-items-center">

                  <div className="col-md-3">
                    <img
                      src={imagenes[producto.imagen] || ascensores}
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

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={producto.cantidad <= 1}
                        onClick={() =>
                          onCambiarCantidad(
                            producto.id,
                            producto.cantidad - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span className="fw-bold px-2">
                        {producto.cantidad}
                      </span>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={
                          producto.cantidad >= producto.stock ||
                          producto.cantidad >= 99
                        }
                        onClick={() =>
                          onCambiarCantidad(
                            producto.id,
                            producto.cantidad + 1
                          )
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
                      Subtotal: {dinero(
                        producto.precio * producto.cantidad
                      )}
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

        {/* RESUMEN DEL CARRITO */}
        <aside className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="h4">Resumen</h2>

              <p className="d-flex justify-content-between">
                <span>Productos</span>
                <strong>{dinero(total)}</strong>
              </p>

              <p>IVA incluido</p>

              <hr />

              <p className="d-flex justify-content-between fs-5">
                <strong>Total</strong>
                <strong>{dinero(total)}</strong>
              </p>

              <Link
                to="/checkout"
                className="btn btn-primary w-100"
              >
                Continuar con la compra
              </Link>
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

export default Carrito
