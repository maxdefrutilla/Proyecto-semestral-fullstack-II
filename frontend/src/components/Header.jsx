import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Header(props) {
  const [menuAbierto, setMenuAbierto] = useState(false)

function alternarMenu() {
  setMenuAbierto(anterior => !anterior)
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
        <nav
          className="navbar navbar-expand-lg"
          aria-label="Navegación principal"
        >
          <div className="container">

            {/* LOGOTIPO */}
        <Link className="brand navbar-brand" to="/">
            <span className="brand-mark">IM</span>
            <span>IN<em>MAQUI</em></span>
        </Link>

            {/* BOTÓN DEL MENÚ MÓVIL */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={alternarMenu}
              aria-controls="menuPrincipal"
              aria-expanded={menuAbierto}
              aria-label="Abrir o cerrar menú"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* ENLACES DE NAVEGACIÓN */}
            <div
              className={
                'collapse navbar-collapse ' +
                (menuAbierto ? 'show' : '')
              }
              id="menuPrincipal"
            >
              <ul className="navbar-nav mx-auto">
  <li className="nav-item">
    <NavLink className="nav-link" to="/" onClick={cerrarMenu} end>
      Inicio
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink className="nav-link" to="/catalogo" onClick={cerrarMenu}>
      Catálogo
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink className="nav-link" to="/categorias" onClick={cerrarMenu}>
      Categorías
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink className="nav-link" to="/nosotros" onClick={cerrarMenu}>
      Nosotros
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink className="nav-link" to="/contacto" onClick={cerrarMenu}>
      Contacto
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink className="nav-link" to="/blog" onClick={cerrarMenu}>
      Blog
    </NavLink>
  </li>
</ul>

<div className="navbar-actions">
  <NavLink
    className="btn btn-outline-primary btn-sm"
    to="/acceso"
    onClick={cerrarMenu}
  >
    {props.usuario ? 'Mi cuenta' : 'Ingresar'}
  </NavLink>
  {props.usuario && props.usuario.rol === 'Administrador' && (
    <NavLink
      className="btn btn-primary btn-sm"
      to="/admin"
      onClick={cerrarMenu}
    >
      Admin
    </NavLink>
  )}
</div>
            </div>

          </div>
        </nav>
      </header>
    </>
  )
}

export default Header