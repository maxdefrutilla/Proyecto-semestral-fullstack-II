import { useState } from 'react'

import Encabezado from '../components/Encabezado.jsx'
import { calcularAndamios } from '../services/catalogoService.js'

const dinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor ?? 0))

export default function CalculadoraAndamios({ productoId, onAgregar }) {
  const [largo, setLargo] = useState('')
  const [altura, setAltura] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function calcular(evento) {
    evento.preventDefault()
    setError('')
    setResultado(null)

    const largoMetros = Number(largo)
    const alturaMetros = Number(altura)
    if (!(largoMetros > 0) || !(alturaMetros > 0)) {
      setError('Ingresa un largo y una altura mayores a cero.')
      return
    }

    setCargando(true)
    try {
      const respuesta = await calcularAndamios({
        productoId,
        largoMetros,
        alturaMetros,
      })
      setResultado(respuesta)
    } catch (fallo) {
      setError(fallo?.message ?? 'No fue posible calcular los módulos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <Encabezado
        seccion="Calculadora de andamios"
        titulo="Estima los módulos que necesitas."
        texto="Ingresa el largo y la altura del trabajo. El servidor calcula la cantidad estimada."
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <form className="form-surface" onSubmit={calcular} noValidate>
                <h2 className="fs-4">Medidas del proyecto</h2>
                <label className="form-label" htmlFor="largoAndamio">Largo (m)</label>
                <input
                  id="largoAndamio"
                  className="form-control mb-3"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={largo}
                  onChange={(evento) => setLargo(evento.target.value)}
                />
                <label className="form-label" htmlFor="alturaAndamio">Altura (m)</label>
                <input
                  id="alturaAndamio"
                  className="form-control mb-3"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={altura}
                  onChange={(evento) => setAltura(evento.target.value)}
                />
                {error && (
                  <p className="alert alert-danger" role="alert">{error}</p>
                )}
                <button className="btn btn-primary" type="submit" disabled={cargando}>
                  {cargando ? 'Calculando…' : 'Calcular módulos'}
                </button>
              </form>
            </div>

            <div className="col-lg-7">
              {resultado ? (
                <div className="card card-body">
                  <h2 className="h4">Estimación comercial</h2>
                  <p><strong>Módulos estimados:</strong> {resultado.cantidad}</p>
                  <p>
                    <strong>Distribución:</strong> {resultado.modulosAncho} × {resultado.modulosAlto}
                  </p>
                  <p><strong>Precio por módulo:</strong> {dinero(resultado.precioUnitario)}</p>
                  <p><strong>Subtotal estimado:</strong> {dinero(resultado.subtotal)}</p>
                  <p>Stock disponible: {resultado.stockDisponible}</p>
                  {!resultado.suficiente && (
                    <p className="alert alert-warning" role="status">
                      Stock insuficiente para la cantidad estimada.
                    </p>
                  )}
                  <p className="alert alert-info" role="status">
                    {resultado.aviso ?? 'Estimación comercial, requiere evaluación técnica.'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!resultado.suficiente || !onAgregar}
                    onClick={() => onAgregar(resultado.productoId ?? productoId, resultado.cantidad)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ) : (
                <div className="alert alert-info">
                  Completa las medidas para ver la estimación.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
