import { Link } from "react-router-dom";


export default function Creditos() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <nav aria-label="Ruta de navegación">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Créditos
              </li>
            </ol>
          </nav>
          <span className="eyebrow">Créditos</span>
          <h1>Fotografías y recursos.</h1>
          <p>Imágenes referenciales utilizadas en este proyecto académico.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <h2 className="fs-4">Fotografías</h2>
              <ul className="mt-3" id="photoCredits">
                <li>
                  Obra, camión, taladro y casco: fotografías de Unsplash.
                  Consulta los autores y las páginas originales en{" "}
                  <a href="FUENTES-IMAGENES.md">el archivo de fuentes</a>.{" "}
                  <a
                    href="https://unsplash.com/license"
                    target="_blank"
                    rel="noopener"
                  >
                    Licencia Unsplash
                  </a>
                  .
                </li>
                <li className="mt-3">
                  Ascensor de obra:{" "}
                  <a
                    href="https://commons.wikimedia.org/wiki/File:Pankr%C3%A1c,_Pujmanov%C3%A9,_V_Tower,_stavebn%C3%AD_v%C3%BDtah_(02).jpg"
                    target="_blank"
                    rel="noopener"
                  >
                    ŠJů, Wikimedia Commons
                  </a>
                  , licencia{" "}
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener"
                  >
                    CC BY 4.0
                  </a>
                  . Imagen redimensionada y recortada visualmente para adaptarse
                  a las tarjetas.
                </li>
              </ul>
              <p>
                Las fotos ilustran categorías y pueden repetirse entre productos
                de muestra. No representan modelos comerciales específicos.
              </p>
              <h2 className="fs-4 mt-5">Bootstrap</h2>
              <p>
                Bootstrap 5.3.8, distribuido bajo licencia MIT. Copias locales
                incluidas para funcionar sin Internet.{" "}
                <a
                  href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
                  target="_blank"
                  rel="noopener"
                >
                  Documentación oficial
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
