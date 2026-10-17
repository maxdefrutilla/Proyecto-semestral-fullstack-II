
import { useState } from 'react'
import ListaProductos from '../components/ListaProductos.jsx'
import productos from '../data/productos.json'

const categorias = [
  { id: 'todas', nombre: 'Todas las categorías' },
  { id: 'ascensores', nombre: 'Ascensores' },
  { id: 'camiones', nombre: 'Camiones' },
  { id: 'herramientas', nombre: 'Herramientas' },
  { id: 'indumentaria', nombre: 'Indumentaria' }
]

function Catalogo() {
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoria === 'todas' || producto.categoria === categoria

    const coincideBusqueda = normalizar(producto.nombre)
      .includes(normalizar(busqueda))

    return coincideCategoria && coincideBusqueda
  })

  function limpiarFiltros() {
    setCategoria('todas')
    setBusqueda('')
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Catálogo INMAQUI</span>
          <h1>Encuentra tu próximo equipo.</h1>
          <p>
            Compara capacidades, revisa los detalles
            y prepara tu selección.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-4">

            {/* FILTROS */}
            <aside className="col-lg-3">
              <div className="filter-panel">
                <h2>Categorías</h2>

                {categorias.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      'filter-option ' +
                      (categoria === item.id ? 'active' : '')
                    }
                    aria-pressed={categoria === item.id}
                    onClick={() => setCategoria(item.id)}
                  >
                    {item.nombre}
                  </button>
                ))}
              </div>
            </aside>

            {/* PRODUCTOS */}
            <div className="col-lg-9">

              <label
                className="form-label"
                htmlFor="busqueda"
              >
                Buscar producto
              </label>

              <input
                id="busqueda"
                type="search"
                className="form-control mb-3"
                placeholder="Ej. ascensor, camión, taladro..."
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
              />

              <div className="catalog-toolbar">
                <p role="status">
                  {productosFiltrados.length} productos
                </p>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={limpiarFiltros}
                >
                  Restablecer filtros
                </button>
              </div>

              <ListaProductos productos={productosFiltrados} />

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Catalogo
