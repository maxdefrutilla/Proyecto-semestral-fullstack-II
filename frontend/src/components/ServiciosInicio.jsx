
import { Link } from 'react-router-dom'

const servicios = [
  {
    numero: '01',
    titulo: 'Venta de equipos',
    descripcion:
      'Compara capacidades y encuentra la alternativa para tu trabajo.',
    ruta: '/catalogo'
  },
  {
    numero: '02',
    titulo: 'Arriendo a tu medida',
    descripcion:
      'Planes por hora, día y mes para diferentes etapas de obra.',
    ruta: '/arriendos'
  },
  {
    numero: '03',
    titulo: 'Servicio técnico',
    descripcion:
      'Mantención preventiva, revisión y asesoría para tus equipos.',
    ruta: '/arriendos'
  }
]

function ServiciosInicio({ mostrarFranja = false }) {
      if (mostrarFranja) {
    return (
      <div className="service-strip">
        <div className="container">
          <span>✓ Venta y arriendo de equipos</span>
          <span>✓ Asesoría para tu proyecto</span>
          <span>✓ Maquinaria y protección en un lugar</span>
        </div>
      </div>
    )
  }
  return (
    <>
      <section className="section">
        <div className="container">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                03 / Más que maquinaria
              </span>
              <h2>Te acompañamos en cada etapa.</h2>
            </div>
          </div>

          <div className="services-list">
            {servicios.map((servicio) => (
              <div
                className="service-row"
                key={servicio.numero}
              >
                <span className="service-number">
                  {servicio.numero}
                </span>

                <h3>{servicio.titulo}</h3>

                <p>{servicio.descripcion}</p>

                <Link
                  to={servicio.ruta}
                  aria-label={`Ver ${servicio.titulo}`}
                >
                  →
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default ServiciosInicio
