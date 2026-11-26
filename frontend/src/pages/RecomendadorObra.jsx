import { useState } from 'react'
import { Link } from 'react-router-dom'

import edificioAndamios from '../assets/img/edificio-andamios.webp'
import edificioAscensor from '../assets/img/edificio-ascensor.webp'

import Encabezado from '../components/Encabezado.jsx'
import {
  calcularAndamios,
  calcularAscensores,
  obtenerProducto,
} from '../services/catalogoService.js'

const pesos = (cantidad) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(cantidad ?? 0))

function EdificioObra({ tipo }) {
  const esFachada = tipo === 'FACHADA'

  return (
    <img
      src={esFachada ? edificioAndamios : edificioAscensor}
      alt={esFachada
        ? 'Edificio en construcción con andamios en la fachada'
        : 'Edificio en construcción con ascensor de carga exterior'}
      loading="lazy"
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: '480 / 310',
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  )
}

export default function RecomendadorObra({ productos = [], onAgregar }) {
  const [trabajo, setTrabajo] = useState('FACHADA')
  const [altura, setAltura] = useState('')
  const [largo, setLargo] = useState('')
  const [capacidad, setCapacidad] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function cambiar(setter, valor) {
    setter(valor)
    setResultado(null)
    setError('')
  }

  async function recomendar(evento) {
    evento.preventDefault()
    setResultado(null)
    setError('')

    const alturaMetros = Number(altura)
    const largoMetros = Number(largo)
    const capacidadKg = Number(capacidad)

    if (!Number.isFinite(alturaMetros) || alturaMetros <= 0) {
      setError('Ingresa una altura válida mayor que cero.')
      return
    }
    if (trabajo === 'FACHADA' && (!Number.isFinite(largoMetros) || largoMetros <= 0)) {
      setError('Ingresa un largo de fachada válido mayor que cero.')
      return
    }
    if (trabajo === 'CARGA' && (!Number.isInteger(capacidadKg) || capacidadKg <= 0)) {
      setError('Ingresa una carga válida en kilogramos enteros.')
      return
    }

    setCargando(true)
    try {
      if (trabajo === 'FACHADA') {
        const andamio = productos.find((producto) =>
          producto.categoria === 'andamios' && producto.activo !== false
        )
        if (!andamio) {
          throw new Error('No hay andamios activos en el catálogo.')
        }

        const calculo = await calcularAndamios({
          productoId: andamio.id,
          largoMetros,
          altoMetros: alturaMetros,
        })
        const producto = await obtenerProducto(calculo.productoId)

        setResultado({
          tipo: 'FACHADA',
          producto,
          cantidad: Number(calculo.cantidad),
          columnas: calculo.columnas,
          filas: calculo.filas,
          subtotal: calculo.subtotal,
          aviso: calculo.aviso,
        })
      } else {
        const compatibles = await calcularAscensores({ alturaMetros, capacidadKg })
        const ordenados = [...compatibles].sort((a, b) => {
          const disponibleA = Number(a.stock) > 0 ? 1 : 0
          const disponibleB = Number(b.stock) > 0 ? 1 : 0
          return disponibleB - disponibleA || Number(a.precio) - Number(b.precio)
        })

        setResultado({
          tipo: 'CARGA',
          producto: ordenados[0] ?? null,
          cantidad: 1,
          alternativas: ordenados.length,
        })
      }
    } catch (fallo) {
      setError(fallo?.message ?? 'No fue posible generar una recomendación.')
    } finally {
      setCargando(false)
    }
  }

  const cantidad = resultado?.cantidad ?? 0
  const stock = Number(resultado?.producto?.stock ?? 0)
  const puedeAgregar = Boolean(
    onAgregar && resultado?.producto && cantidad > 0 && cantidad <= 99 && stock >= cantidad
  )

  return (
    <main>
      <Encabezado
        seccion="Recomendador de obra"
        titulo="Encuentra el equipo adecuado para tu proyecto."
        texto="Indica las medidas de tu obra y el trabajo que necesitas realizar. Te mostraremos una recomendación comercial según el catálogo disponible."
      />

      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <form className="form-surface" onSubmit={recomendar} noValidate>
                <h2 className="h4 mb-3">Datos de tu obra</h2>

                <label className="form-label" htmlFor="tipoTrabajoObra">¿Qué necesitas realizar?</label>
                <select
                  id="tipoTrabajoObra"
                  className="form-select mb-3"
                  value={trabajo}
                  onChange={(evento) => cambiar(setTrabajo, evento.target.value)}
                >
                  <option value="FACHADA">Trabajar en la fachada</option>
                  <option value="CARGA">Elevar materiales</option>
                </select>

                <label className="form-label" htmlFor="alturaObra">Altura de la obra (metros)</label>
                <input
                  id="alturaObra"
                  type="number"
                  min="0.1"
                  step="0.1"
                  className="form-control mb-3"
                  placeholder="Ej. 12"
                  value={altura}
                  onChange={(evento) => cambiar(setAltura, evento.target.value)}
                  required
                />

                {trabajo === 'FACHADA' ? (
                  <>
                    <label className="form-label" htmlFor="largoObra">Largo de la fachada (metros)</label>
                    <input
                      id="largoObra"
                      type="number"
                      min="0.1"
                      step="0.1"
                      className="form-control mb-3"
                      placeholder="Ej. 8"
                      value={largo}
                      onChange={(evento) => cambiar(setLargo, evento.target.value)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <label className="form-label" htmlFor="cargaObra">Peso de los materiales (kg)</label>
                    <input
                      id="cargaObra"
                      type="number"
                      min="1"
                      step="1"
                      className="form-control mb-3"
                      placeholder="Ej. 800"
                      value={capacidad}
                      onChange={(evento) => cambiar(setCapacidad, evento.target.value)}
                      required
                    />
                  </>
                )}

                {error && <p className="alert alert-danger" role="alert">{error}</p>}

                <button className="btn btn-primary" type="submit" disabled={cargando}>
                  {cargando ? 'Consultando catálogo…' : 'Recomendar equipo'}
                </button>
              </form>
            </div>

            <div className="col-lg-7" aria-live="polite">
              {resultado ? (
                <div className="card overflow-hidden">
                  <EdificioObra tipo={resultado.tipo} />
                  <div className="card-body">
                    <span className="eyebrow">Recomendación INMAQUI</span>
                    <h2 className="h4 mt-2">
                      {resultado.tipo === 'FACHADA' ? 'Andamios modulares' : 'Ascensor de carga'}
                    </h2>

                    {resultado.producto ? (
                      <>
                        <p className="mb-2"><strong>Producto:</strong> {resultado.producto.nombre}</p>
                        {resultado.tipo === 'FACHADA' ? (
                          <>
                            <p className="mb-2"><strong>Distribución estimada:</strong> {resultado.columnas} columnas × {resultado.filas} filas</p>
                            <p className="mb-2"><strong>Módulos necesarios:</strong> {cantidad}</p>
                          </>
                        ) : (
                          <p className="mb-2">
                            <strong>Capacidad:</strong> {resultado.producto.atributos?.capacidadKg} kg ·
                            <strong> Altura máxima:</strong> {resultado.producto.atributos?.alturaMaxMetros} m
                          </p>
                        )}
                        <p className="mb-2"><strong>Stock disponible:</strong> {stock}</p>
                        <p className="mb-3"><strong>Total estimado:</strong> {pesos(resultado.subtotal ?? resultado.producto.precio)}</p>

                        {!puedeAgregar && (
                          <p className="alert alert-warning" role="status">
                            {cantidad > 99
                              ? 'La cantidad estimada supera el máximo de 99 unidades por compra.'
                              : 'No existe stock suficiente para esta recomendación.'}
                          </p>
                        )}

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={!puedeAgregar}
                            onClick={() => onAgregar(resultado.producto.id, cantidad)}
                          >
                            Agregar al carrito
                          </button>
                          <Link className="btn btn-outline-secondary" to={`/producto/${resultado.producto.id}`}>
                            Ver producto
                          </Link>
                        </div>
                      </>
                    ) : (
                      <p className="alert alert-warning" role="status">
                        No encontramos ascensores compatibles con esa altura y carga. Prueba con otros valores.
                      </p>
                    )}
                    <p className="form-text mt-3 mb-0">
                      {resultado.aviso ?? 'Orientación comercial. La elección y seguridad del equipo requieren evaluación técnica.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info" role="status">
                  Completa los datos y presiona «Recomendar equipo» para visualizar tu obra y los productos disponibles.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
