
import { Link } from 'react-router-dom'

import Hero from '../components/Hero.jsx'
import CategoriasInicio from '../components/CategoriasInicio.jsx'
import ServiciosInicio from '../components/ServiciosInicio.jsx'
import ContactoInicio from '../components/ContactoInicio.jsx'
import ListaProductos from '../components/ListaProductos.jsx'

import productos from '../data/productos.json'

function Inicio() {

  const categorias = [
    'ascensores',
    'camiones',
    'herramientas',
    'indumentaria'
  ]

  const destacados = categorias
    .map((categoria) =>
      productos.find((producto) => producto.categoria === categoria)
    )
    .filter(Boolean)

  return (
    <main id="contenido">

      <Hero />

      <ServiciosInicio mostrarFranja={true} />

      <CategoriasInicio />

      <section className="section section-soft">
        <div className="container">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                02 / Selección INMAQUI
              </span>

              <h2>
                Listos para tu próximo proyecto.
              </h2>
            </div>

            <Link className="text-link" to="/catalogo">
              Explorar productos →
            </Link>
          </div>

          <ListaProductos productos={destacados} />

        </div>
      </section>

      <ServiciosInicio />

      <ContactoInicio />

    </main>
  )
}

export default Inicio
