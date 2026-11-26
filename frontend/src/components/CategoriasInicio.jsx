
import { Link } from 'react-router-dom'

import ascensores from '../assets/img/ascensores.jpg'
import camiones from '../assets/img/camiones.jpg'
import herramientas from '../assets/img/herramientas.jpg'
import indumentaria from '../assets/img/indumentaria.jpg'

const categorias = [
  {
    id: 1,
    codigo: 'ascensores',
    nombre: 'Ascensores',
    descripcion: 'Elevación para tu obra',
    imagen: ascensores
  },
  {
    id: 2,
    codigo: 'camiones',
    nombre: 'Camiones',
    descripcion: 'Transporte de materiales',
    imagen: camiones
  },
  {
    id: 3,
    codigo: 'herramientas',
    nombre: 'Herramientas',
    descripcion: 'Precisión en cada tarea',
    imagen: herramientas
  },
  {
    id: 4,
    codigo: 'indumentaria',
    nombre: 'Indumentaria',
    descripcion: 'Protección en terreno',
    imagen: indumentaria
  }
]

function CategoriasInicio({ disponibles = [] }) {
  const visibles = categorias.flatMap((categoria) => {
    const registro = disponibles.find((item) => item.codigo === categoria.codigo)
    return registro ? [{ ...categoria, nombre: registro.nombre }] : []
  })
  if (!visibles.length) return null
  return (
    <section className="section">
      <div className="container">

        <div className="section-heading">
          <div>
            <span className="eyebrow">
              01 / Nuestras categorías
            </span>
            <h2>Todo parte con el equipo correcto.</h2>
          </div>

          <Link className="text-link" to="/catalogo">
            Ver todo el catálogo →
          </Link>
        </div>

        <div className="row g-3">
          {visibles.map((categoria) => (
            <div
              className="col-6 col-lg-3"
              key={categoria.id}
            >
              <Link
                className="category-tile"
                to="/catalogo"
              >
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  loading="lazy"
                />

                <div className="category-caption">
                  <div>
                    <h3>{categoria.nombre}</h3>
                    <small>{categoria.descripcion}</small>
                  </div>

                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CategoriasInicio
