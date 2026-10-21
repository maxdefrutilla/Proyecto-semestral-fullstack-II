import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <Link className="brand" to="/" aria-label="INMAQUI, inicio">
              <span className="brand-mark" aria-hidden="true">
                IM
              </span>
              <span>
                IN<em>MAQUI</em>
              </span>
            </Link>
            <p className="col-lg-9">
              Maquinaria, herramientas y equipamiento para acompañar cada etapa
              de tu proyecto.
            </p>
          </div>
          <div className="col-6 col-lg-3">
            <h3>Explora INMAQUI</h3>
            <ul>
              <li>
                <Link to="/catalogo">Catálogo de productos</Link>
              </li>
              <li>
                <Link to="/arriendos">Arriendo y servicios</Link>
              </li>
              <li>
                <Link to="/nosotros">Nuestra empresa</Link>
              </li>
              <li>
                <Link to="/acceso">Ingresar / Registrarse</Link>
              </li>
              <li>
                <Link to="/categorias">Categorías</Link>
              </li>
              <li>
                <Link to="/ofertas">Ofertas</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/administracion">Administración</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-lg-4">
            <h3>Hablemos de tu proyecto</h3>
            <ul>
              <li>Panamericana Norte Km 12, Santiago</li>
              <li>Lun a sáb · 8:00 a 19:00</li>
              <li>
                <Link to="/contacto">
                  Dejar mis datos{" "}
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h16m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 INMAQUI · Proyecto académico, Grupo 09</span>
          <span>
            Valores e imágenes referenciales ·{" "}
            <Link to="/creditos">Créditos de imágenes</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
