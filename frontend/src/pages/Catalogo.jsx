import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ListaProductos from '../components/ListaProductos.jsx'
import { listarCategorias, listarProductos } from '../services/catalogoService.js'

function normalizar(texto = '') {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function Catalogo({
  productos: productosProp,
  categorias: categoriasProp,
  onAgregar,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [productosLocales, setProductosLocales] = useState([])
  const [categoriasLocales, setCategoriasLocales] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  const productos = productosProp ?? productosLocales
  const categorias = categoriasProp ?? categoriasLocales

  useEffect(() => {
    if (productosProp && categoriasProp) return
    let activo = true
    Promise.resolve().then(() => {
      setCargando(true)
      setError('')
      Promise.all([listarProductos(), listarCategorias()])
        .then(([listaProductos, listaCategorias]) => {
          if (!activo) return
          setProductosLocales(Array.isArray(listaProductos) ? listaProductos : [])
          setCategoriasLocales(Array.isArray(listaCategorias) ? listaCategorias : [])
        })
        .catch((fallo) => {
          if (activo) setError(fallo?.message ?? 'No fue posible cargar el catálogo.')
        })
        .finally(() => {
          if (activo) setCargando(false)
        })
    })
    return () => { activo = false }
  }, [productosProp, categoriasProp])

  const filtros = [
    { id: 'todas', nombre: 'Todas las categorías' },
    ...categorias.map((item) => ({ id: item.codigo, nombre: item.nombre })),
  ]

  const categoriaSeleccionada = categorias.find(
    (item) => String(item.id) === String(id) || item.codigo === id
  )
  const categoriaActiva = id ? (categoriaSeleccionada?.codigo ?? null) : categoria
  const rutaInvalida = Boolean(id && categorias.length > 0 && !categoriaSeleccionada)

  const productosFiltrados = rutaInvalida
    ? []
    : productos.filter((producto) => {
        const coincideCategoria =
          categoriaActiva === 'todas' ||
          normalizar(producto.categoria) === normalizar(categoriaActiva)
        const coincideBusqueda = normalizar(producto.nombre).includes(normalizar(busqueda))
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
                    className={'filter-option ' + (categoriaActiva === item.id ? 'active' : '')}
                    aria-pressed={categoriaActiva === item.id}
                    onClick={() => seleccionarCategoria(item.id)}
                  >
                    {item.nombre}
                  </button>
                ))}
              </div>
            </aside>

            <div className="col-lg-9">
              <label className="form-label" htmlFor="busqueda">Buscar producto</label>
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

              {error && (
                <div className="alert alert-danger" role="alert">{error}</div>
              )}
              {cargando ? (
                <div className="alert alert-info" role="status">Cargando catálogo…</div>
              ) : rutaInvalida ? (
                <div className="alert alert-warning">La categoría solicitada no existe.</div>
              ) : (
                <ListaProductos productos={productosFiltrados} onAgregar={onAgregar} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Catalogo
