import { useState } from 'react'

import Encabezado from '../components/Encabezado.jsx'
import { calcularAscensores } from '../services/catalogoService.js'

const dinero = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor ?? 0))

export default function CalculadoraAscensores({ onAgregar }) {
  const [altura, setAltura] = useState('')
  const [capacidad, setCapacidad] = useState('')
  const [opciones, setOpciones] = useState(null)
  const [aviso, setAviso] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function calcular(evento) {
    evento.preventDefault()
    setError('')
    setOpciones(null)

    const alturaMetros = Number(altura)
    const capacidadKg = Number(capacidad)
    if (!(alturaMetros > 0) || !(capacidadKg > 0)) {
      setError('Ingresa una altura y una capacidad mayores a cero.')
      return
    }

    setCargando(true)
    try {
      const respuesta = await calcularAscensores({ alturaMetros, capacidadKg })
      setOpciones(respuesta)
      setAviso(respuesta?.aviso ?? 'Estimación comercial, requiere evaluación técnica.')
    } catch (fallo) {
      setError(fallo?.message ?? 'No fue posible calcular las opciones.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <Encabezado
        seccion="Calculadora de ascensores"
        titulo="Encuentra un equipo compatible."
        texto="Indica la altura y la capacidad requerida. El catálogo responde con las opciones compatibles."
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <form className="form-surface" onSubmit={calcular} noValidate>
                <h2 className="fs-4">Requerimientos</h2>
                <label className="form-label" htmlFor="alturaAscensor">Altura requerida (m)</label>
                <input
                  id="alturaAscensor"
                  className="form-control mb-3"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={altura}
                  onChange={(evento) => setAltura(evento.target.value)}
                />
                <label className="form-label" htmlFor="capacidadAscensor">Capacidad requerida (kg)</label>
                <input
                  id="capacidadAscensor"
                  className="form-control mb-3"
                  type="number"
                  min="1"
                  step="1"
                  value={capacidad}
                  onChange={(evento) => setCapacidad(evento.target.value)}
                />
                {error && (
                  <p className="alert alert-danger" role="alert">{error}</p>
                )}
                <button className="btn btn-primary" type="submit" disabled={cargando}>
                  {cargando ? 'Buscando…' : 'Buscar opciones'}
                </button>
              </form>
            </div>

            <div className="col-lg-7">
              <p className="alert alert-info" role="status">
                Estimación comercial, requiere evaluación técnica.
              </p>
              {opciones === null ? (
                <div className="alert alert-secondary">
                  Completa los requerimientos para ver opciones.
                </div>
              ) : opciones.length === 0 ? (
                <div className="alert alert-warning" role="status">
                  No hay ascensores compatibles con esos requerimientos.
                </div>
              ) : (
                <div className="list-group">
                  {opciones.map((opcion) => (
                    <div className="list-group-item" key={opcion.id}>
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div>
                          <h2 className="h5 mb-1">{opcion.nombre}</h2>
                          <p className="mb-1 small text-muted">
                            {opcion.atributos.capacidadKg} kg · {opcion.atributos.alturaMaxMetros} m · Stock {opcion.stock}
                          </p>
                          <strong>{dinero(opcion.precioUnitario ?? opcion.precio)}</strong>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={!onAgregar || Number(opcion.stock) < 1}
                          onClick={() => onAgregar(opcion.id, 1)}
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {aviso && opciones !== null && (
                <p className="form-text mt-3">{aviso}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
