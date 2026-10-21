import { Link } from "react-router-dom";
import Encabezado from "../components/Encabezado";
import imagenes from "../data/imagenes";

export default function Categorias(props) {
  const tarjetas = [];
  for (let i = 0; i < props.categorias.length; i++) {
    const categoria = props.categorias[i];
    tarjetas.push(
      <div className="col-sm-6 col-lg-3" key={categoria.id}>
        <Link to={"/categoria/" + categoria.id} className="category-tile">
          <img
            src={imagenes[categoria.codigo] || imagenes.obra}
            alt={categoria.nombre}
          />
          <div className="category-caption">
            <h3>{categoria.nombre}</h3>
            <span>→</span>
          </div>
        </Link>
      </div>,
    );
  }
  return (
    <>
      <Encabezado
        seccion="Categorías"
        titulo="El equipo correcto para cada tarea."
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">{tarjetas}</div>
        </div>
      </section>
    </>
  );
}
