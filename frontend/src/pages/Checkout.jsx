import { useState } from 'react'
import { Link } from 'react-router-dom'

import Campo from '../components/Campo.jsx'
import { COMUNAS_RM, esComunaRM } from '../data/comunas.js'
import { dinero, validarRut } from '../data/operaciones.js'

function nuevaClaveOperacion() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  } catch {
    // Algunos navegadores antiguos no exponen crypto.randomUUID.
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caracter) => {
    const aleatorio = (Math.random() * 16) | 0
    const valor = caracter === 'x' ? aleatorio : (aleatorio & 0x3) | 0x8
    return valor.toString(16)
  })
}

export default function Checkout({ carrito, productos, usuario, onComprar }) {
  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [apellidos, setApellidos] = useState(usuario?.apellidos ?? '')
  const [rut, setRut] = useState(usuario?.rut ?? '')
  const [correo, setCorreo] = useState(usuario?.correo ?? '')
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '')
  const [observaciones, setObservaciones] = useState('')
  const [entrega, setEntrega] = useState('RETIRO')
  const [direccion, setDireccion] = useState('')
  const [comuna, setComuna] = useState('')
  const [resultadoPagoPrueba, setResultadoPagoPrueba] = useState('APROBAR')
  const [claveOperacion, setClaveOperacion] = useState(nuevaClaveOperacion)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const items = carrito
    .map((item) => {
      const producto = productos.find(
        (registro) => String(registro.id) === String(item.productoId)
      )
      return producto ? { ...producto, cantidad: item.cantidad } : null
    })
    .filter(Boolean)

  const subtotal = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  )
  const costoEstimado = entrega === 'RETIRO'
    ? 0
    : (subtotal >= 1000000 ? 100000 : 50000)
  const totalEstimado = subtotal + costoEstimado

  async function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = {}

    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = 'Ingresa tu nombre.'
    }
    if (apellidos.trim().length < 2) {
      nuevosErrores.apellidos = 'Ingresa tus apellidos.'
    }
    if (!validarRut(rut)) {
      nuevosErrores.rut = 'Ingresa un RUT válido. Ejemplo: 12345678-5.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo válido.'
    }
    if (entrega === 'DESPACHO') {
      if (direccion.trim().length < 5) {
        nuevosErrores.direccion = 'Ingresa calle y número.'
      }
      if (!esComunaRM(comuna)) {
        nuevosErrores.comuna = 'El despacho solo está disponible en la RM.'
      }
    }
    if (!['APROBAR', 'RECHAZAR'].includes(resultadoPagoPrueba)) {
      nuevosErrores.resultado = 'Selecciona el resultado de pago de prueba.'
    }

    setErrores(nuevosErrores)
    setErrorGeneral('')
    if (Object.keys(nuevosErrores).length > 0) return

    const clave = nuevaClaveOperacion()
    setClaveOperacion(clave)
    setEnviando(true)

    try {
      await onComprar({
        comprador: {
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          rut: rut.trim(),
          correo: correo.trim(),
          telefono: telefono.trim(),
          observaciones: observaciones.trim(),
        },
        tipoEntrega: entrega,
        direccion: entrega === 'DESPACHO' ? direccion.trim() : '',
        comuna: entrega === 'DESPACHO' ? comuna : '',
        resultadoPagoPrueba,
        claveOperacion: clave,
      })
    } catch (fallo) {
      setErrorGeneral(
        fallo?.message ?? 'No fue posible procesar el pedido. Intenta nuevamente.'
      )
    } finally {
      setEnviando(false)
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
        Puedes comprar como invitado. El servidor confirmará precios, stock y
        el total final.
      </p>

      {usuario ? (
        <p className="alert alert-info" role="status">
          Comprando como <strong>{usuario.nombre} {usuario.apellidos}</strong>.
        </p>
      ) : (
        <p className="alert alert-secondary" role="status">
          Compra como invitado.{' '}
          <Link to="/acceso">Iniciar sesión</Link> para guardar tu historial.
        </p>
      )}

      <div className="row g-4 mt-2">
        <div className="col-lg-8">
          <form onSubmit={enviar} noValidate className="card card-body p-4">
            {errorGeneral && (
              <div className="alert alert-danger" role="alert">
                {errorGeneral}
              </div>
            )}

            <h2 className="h4">Datos del comprador</h2>

            <div className="row">
              <div className="col-md-6">
                <Campo
                  id="nombreCompra"
                  etiqueta="Nombre"
                  valor={nombre}
                  cambiar={setNombre}
                  error={errores.nombre}
                  autoComplete="given-name"
                />
              </div>
              <div className="col-md-6">
                <Campo
                  id="apellidosCompra"
                  etiqueta="Apellidos"
                  valor={apellidos}
                  cambiar={setApellidos}
                  error={errores.apellidos}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Campo
                  id="rutCompra"
                  etiqueta="RUT"
                  valor={rut}
                  cambiar={setRut}
                  error={errores.rut}
                />
              </div>
              <div className="col-md-6">
                <Campo
                  id="correoCompra"
                  etiqueta="Correo electrónico"
                  tipo="email"
                  valor={correo}
                  cambiar={setCorreo}
                  error={errores.correo}
                  autoComplete="email"
                />
              </div>
            </div>

            <Campo
              id="telefonoCompra"
              etiqueta="Teléfono (opcional)"
              requerido={false}
              valor={telefono}
              cambiar={setTelefono}
            />

            <h2 className="h4 mt-3">Entrega</h2>

            <div className="mb-3">
              <label htmlFor="entrega" className="form-label">
                Modalidad
              </label>
              <select
                id="entrega"
                className="form-select"
                value={entrega}
                onChange={(evento) => setEntrega(evento.target.value)}
              >
                <option value="RETIRO">Retiro en tienda ($0)</option>
                <option value="DESPACHO">Despacho a domicilio</option>
              </select>
            </div>

            {entrega === 'DESPACHO' && (
              <>
                <p className="small text-muted">
                  Despacho solo en la Región Metropolitana: $50.000 si el
                  subtotal es menor a $1.000.000 y $100.000 si es igual o mayor.
                </p>
                <Campo
                  id="direccionCompra"
                  etiqueta="Calle y número"
                  valor={direccion}
                  cambiar={setDireccion}
                  error={errores.direccion}
                  autoComplete="street-address"
                />
                <div className="mb-3">
                  <label htmlFor="comunaCompra" className="form-label">
                    Comuna (RM)
                  </label>
                  <select
                    id="comunaCompra"
                    className={
                      'form-select' + (errores.comuna ? ' is-invalid' : '')
                    }
                    value={comuna}
                    onChange={(evento) => setComuna(evento.target.value)}
                    aria-invalid={Boolean(errores.comuna)}
                  >
                    <option value="">Selecciona una comuna</option>
                    {COMUNAS_RM.map((nombreComuna) => (
                      <option key={nombreComuna} value={nombreComuna}>
                        {nombreComuna}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errores.comuna}</div>
                </div>
              </>
            )}

            <div className="mb-3">
              <label htmlFor="observacionesCompra" className="form-label">
                Observaciones (opcional)
              </label>
              <textarea
                id="observacionesCompra"
                className="form-control"
                rows="2"
                value={observaciones}
                onChange={(evento) => setObservaciones(evento.target.value)}
              />
            </div>

            <h2 className="h4 mt-3">Pago de prueba</h2>

            <div className="mb-3">
              <label htmlFor="resultadoPago" className="form-label">
                Resultado de la transacción
              </label>
              <select
                id="resultadoPago"
                className="form-select"
                value={resultadoPagoPrueba}
                onChange={(evento) => setResultadoPagoPrueba(evento.target.value)}
              >
                <option value="APROBAR">APROBAR</option>
                <option value="RECHAZAR">RECHAZAR</option>
              </select>
              {errores.resultado && (
                <div className="text-danger small">{errores.resultado}</div>
              )}
            </div>

            <p className="small text-muted">
              Clave de operación de este intento:{' '}
              <code>{claveOperacion}</code>
            </p>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={enviando}
            >
              {enviando ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        <aside className="col-lg-4">
          <div className="card card-body">
            <h2 className="h4">Resumen de compra</h2>

            {items.map((item) => (
              <div
                key={item.productoId ?? item.id}
                className="d-flex justify-content-between small"
              >
                <span>{item.nombre} × {item.cantidad}</span>
                <span>{dinero(item.precio * item.cantidad)}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span>Productos</span>
              <strong>{dinero(subtotal)}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Despacho estimado</span>
              <strong>{dinero(costoEstimado)}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Total estimado</strong>
              <strong>{dinero(totalEstimado)}</strong>
            </div>

            <p className="small text-muted mt-3">
              Estimación informativa. El servidor confirma el total final según
              precios, stock y comuna.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
