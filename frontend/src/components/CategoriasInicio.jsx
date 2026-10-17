
import { Link } from 'react-router-dom'

import ascensores from '../assets/img/ascensores.jpg'
import camiones from '../assets/img/camiones.jpg'
import herramientas from '../assets/img/herramientas.jpg'
import indumentaria from '../assets/img/indumentaria.jpg'

const categorias = [
  {
    id: 1,
    nombre: 'Ascensores',
    descripcion: 'Elevación para tu obra',
    imagen: ascensores
  },
  {
    id: 2,
    nombre: 'Camiones',
    descripcion: 'Transporte de materiales',
    imagen: camiones
  },
  {
    id: 3,
    nombre: 'Herramientas',
    descripcion: 'Precisión en cada tarea',
    imagen: herramientas
  },
  {
    id: 4,
    nombre: 'Indumentaria',
    descripcion: 'Protección en terreno',
    imagen: indumentaria
  }
]

function CategoriasInicio() {
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
          {categorias.map((categoria) => (
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
