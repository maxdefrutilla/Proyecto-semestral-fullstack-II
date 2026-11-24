import { Link } from "react-router-dom";

export default function Encabezado(props) {
  return (
    <section className="page-intro">
      <div className="container">
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {props.seccion}
            </li>
          </ol>
        </nav>
        <span className="eyebrow">{props.seccion}</span>
        <h1>{props.titulo}</h1>
        <p>{props.texto}</p>
      </div>
    </section>
  );
}
