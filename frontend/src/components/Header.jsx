import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const enlaces = [
  { ruta: '/', texto: 'Inicio', exacta: true },
  { ruta: '/catalogo', texto: 'Catálogo' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/contacto', texto: 'Contacto' },
]

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto((anterior) => !anterior)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <>
      <div className="top-strip">
        <div className="container">
          <span>Maquinaria y equipamiento para tu obra</span>
          <span>Santiago, Chile · Lun a sáb, 8:00 a 19:00</span>
        </div>
      </div>

      <header className="site-header">
        <nav className="navbar navbar-expand-lg" aria-label="Navegación principal">
          <div className="container">
            <Link className="brand navbar-brand" to="/" onClick={cerrarMenu}>
              <span className="brand-mark">IM</span>
              <span>IN<em>MAQUI</em></span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={alternarMenu}
              aria-controls="menuPrincipal"
              aria-expanded={menuAbierto}
              aria-label="Abrir o cerrar menú"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className={`collapse navbar-collapse${menuAbierto ? ' show' : ''}`}
              id="menuPrincipal"
            >
              <ul className="navbar-nav mx-auto flex-wrap justify-content-center">
                {enlaces.map((enlace) => (
                  <li className="nav-item" key={enlace.ruta}>
                    <NavLink
                      className="nav-link"
                      to={enlace.ruta}
                      end={enlace.exacta ?? false}
                      onClick={cerrarMenu}
                    >
                      {enlace.texto}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header
