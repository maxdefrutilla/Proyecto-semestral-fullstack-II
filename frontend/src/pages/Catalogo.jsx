import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ListaProductos from '../components/ListaProductos.jsx'

// Estas claves coinciden con producto.categoria en productos.json.
const filtros = [
  { id: 'todas', nombre: 'Todas las categorías' },
  { id: 'ascensores', nombre: 'Ascensores' },
  { id: 'camiones', nombre: 'Camiones' },
  { id: 'herramientas', nombre: 'Herramientas' },
  { id: 'indumentaria', nombre: 'Indumentaria' }
]

function normalizar(texto = '') {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function Catalogo({ productos = [], onAgregar, categorias = [] }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  // /categoria/:id utiliza el ID numérico del JSON de categorías.
  const categoriaSeleccionada = categorias.find(
    (item) => String(item.id) === id
  )

  // Admitimos tanto un slug existente como un nombre de categoría.
  // Ninguno de los dos se presume obligatorio en el JSON.
  const categoriaRuta = categoriaSeleccionada
    ? normalizar(categoriaSeleccionada.slug || categoriaSeleccionada.nombre)
    : null

  // En /catalogo usamos el filtro local; en /categoria/:id, el de la URL.
  const categoriaActiva = id ? categoriaRuta : categoria
  const rutaInvalida = Boolean(id && !categoriaRuta)

  const productosFiltrados = rutaInvalida
    ? []
    : productos.filter((producto) => {
        const coincideCategoria =
          categoriaActiva === 'todas' ||
          normalizar(producto.categoria) === categoriaActiva

        const coincideBusqueda = normalizar(producto.nombre)
          .includes(normalizar(busqueda))

        return coincideCategoria && coincideBusqueda
      })

  function seleccionarCategoria(nuevaCategoria) {
    setCategoria(nuevaCategoria)
    if (id) navigate('/catalogo')
  }

  function limpiarFiltros() {
    setCategoria('todas')
    setBusqueda('')
    if (id) navigate('/catalogo')
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Catálogo INMAQUI</span>
          <h1>Encuentra tu próximo equipo.</h1>
          <p>Compara capacidades, revisa los detalles y prepara tu selección.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-4">
            <aside className="col-lg-3">
              <div className="filter-panel">
                <h2>Categorías</h2>
                {filtros.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={'filter-option ' +
                      (categoriaActiva === item.id ? 'active' : '')}
                    aria-pressed={categoriaActiva === item.id}
                    onClick={() => seleccionarCategoria(item.id)}
                  >
                    {item.nombre}
                  </button>
                ))}
              </div>
            </aside>

            <div className="col-lg-9">
              <label className="form-label" htmlFor="busqueda">
                Buscar producto
              </label>
              <input
                id="busqueda"
                type="search"
                className="form-control mb-3"
                placeholder="Ej. ascensor, camión, taladro..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />

              <div className="catalog-toolbar">
                <p role="status">{productosFiltrados.length} productos</p>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={limpiarFiltros}
                >
                  Restablecer filtros
                </button>
              </div>

              {rutaInvalida ? (
                <div className="alert alert-warning">
                  La categoría solicitada no existe.
                </div>
              ) : (
                <ListaProductos
                  productos={productosFiltrados}
                  onAgregar={onAgregar}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Catalogo
