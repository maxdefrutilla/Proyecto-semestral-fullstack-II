
import { useState } from 'react'
import { Link } from 'react-router-dom'

const dinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor)

function Checkout({ carrito, productos, onComprar }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [entrega, setEntrega] = useState('Retiro en tienda')
  const [direccion, setDireccion] = useState('')
  const [comuna, setComuna] = useState('')
  const [resultado, setResultado] = useState('Aprobada')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const subtotal = carrito.reduce((total, item) => {
    const producto = productos.find((p) => p.id === item.id)
    return total + (producto?.precio ?? 0) * item.cantidad
  }, 0)

  const despacho = entrega === 'Despacho a domicilio' ? 15000 : 0
  const total = subtotal + despacho

  function enviar(evento) {
    evento.preventDefault()

    const nuevosErrores = {}

    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = 'Ingresa tu nombre completo.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo válido.'
    }

    if (entrega === 'Despacho a domicilio') {
      if (direccion.trim().length < 5) {
        nuevosErrores.direccion = 'Ingresa calle y número.'
      }

      if (comuna.trim().length < 2) {
        nuevosErrores.comuna = 'Ingresa una comuna válida.'
      }
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    const respuesta = onComprar({
      nombre: nombre.trim(),
      correo: correo.trim(),
      entrega,
      direccion: direccion.trim(),
      comuna: comuna.trim(),
      despacho,
      estado: resultado
    })

    if (respuesta) {
      setErrorGeneral(respuesta)
    }
  }

  if (carrito.length === 0) {
    return (
      <main className="container py-5">
        <h1>No tienes productos para comprar</h1>
        <Link to="/catalogo" className="btn btn-primary">
          Explorar catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <span className="eyebrow">Checkout</span>
      <h1>Completa los datos de tu compra.</h1>

      <p className="text-muted">
        Simulación académica. No ingreses datos bancarios.
      </p>

      <div className="row g-4 mt-2">
        <div className="col-lg-8">
          <form onSubmit={enviar} noValidate className="card card-body p-4">

            {errorGeneral && (
              <div className="alert alert-danger" role="alert">
                {errorGeneral}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="nombreCompra" className="form-label">
                Nombre completo
              </label>
              <input
                id="nombreCompra"
                className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="invalid-feedback">{errores.nombre}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="correoCompra" className="form-label">
                Correo electrónico
              </label>
              <input
                id="correoCompra"
                type="email"
                className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <div className="invalid-feedback">{errores.correo}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="entrega" className="form-label">
                Método de entrega
              </label>
              <select
                id="entrega"
                className="form-select"
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
              >
                <option>Retiro en tienda</option>
                <option>Despacho a domicilio</option>
              </select>
            </div>

            {entrega === 'Despacho a domicilio' && (
              <>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Calle y número
                  </label>
                  <input
                    id="direccion"
                    className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <div className="invalid-feedback">{errores.direccion}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="comuna" className="form-label">
                    Comuna
                  </label>
                  <input
                    id="comuna"
                    className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                  />
                  <div className="invalid-feedback">{errores.comuna}</div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label htmlFor="resultado" className="form-label">
                Resultado simulado del pago
              </label>
              <select
                id="resultado"
                className="form-select"
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
              >
                <option>Aprobada</option>
                <option>Rechazada</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Simular pago
            </button>
          </form>
        </div>

        <aside className="col-lg-4">
          <div className="card card-body">
            <h2 className="h4">Resumen de compra</h2>

            <div className="d-flex justify-content-between">
              <span>Productos</span>
              <strong>{dinero(subtotal)}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Despacho</span>
              <strong>{dinero(despacho)}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong>{dinero(total)}</strong>
            </div>

            <p className="small text-muted mt-3">
              Despacho de prueba: $15.000. IVA incluido.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Checkout
