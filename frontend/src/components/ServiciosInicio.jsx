
import { Link } from 'react-router-dom'

const servicios = [
  {
    numero: '01',
    titulo: 'Venta de maquinaria',
    descripcion:
      'Encuentra maquinaria, herramientas y equipos para tus proyectos.',
    ruta: '/catalogo'
  },
  {
    numero: '02',
    titulo: 'Ofertas en equipos',
    descripcion:
      'Revisa nuestra selección de productos con precios especiales.',
    ruta: '/ofertas'
  },
  {
    numero: '03',
    titulo: 'Consultas sobre productos',
    descripcion:
      'Contáctanos para resolver tus dudas sobre los equipos disponibles.',
    ruta: '/contacto'
  }
]

function ServiciosInicio({ mostrarFranja = false }) {
  if (mostrarFranja) {
    return (
      <div className="service-strip">
        <div className="container">
          <span>✓ Venta de maquinaria y equipamiento</span>
          <span>✓ Retiro gratuito de productos</span>
          <span>✓ Despacho disponible en la Región Metropolitana</span>
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
                03 / Compra en INMAQUI
              </span>
              <h2>Todo lo que necesitas para equipar tu proyecto.</h2>
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
