import { Link } from "react-router-dom";
import Encabezado from "../components/Encabezado";
import imagenes from "../data/imagenes";
import "../styles/paginas.css";

export default function Blog(props) {
  if (props.articulo === 1)
    return (
      <>
        <Encabezado
          seccion="Blog"
          titulo="Qué revisar antes de elegir un equipo."
        />
        <section className="section">
          <div className="container lectura">
            <p>
              Empieza por definir la tarea, el lugar de trabajo y el tiempo de
              uso. Esa información permite comparar alternativas con un criterio
              común.
            </p>
            <h2 className="fs-4">Capacidad y dimensiones</h2>
            <p>
              Revisa el tonelaje y el tamaño en la ficha del producto. Confirma
              con el proveedor los requerimientos de instalación y operación del
              modelo real.
            </p>
            <h2 className="fs-4">Compra o arriendo</h2>
            <p>
              Considera si el equipo se necesita para una etapa puntual o para
              distintos proyectos. Cotiza ambas alternativas antes de decidir.
            </p>
            <Link to="/blog">Volver al blog</Link>
          </div>
        </section>
      </>
    );
  if (props.articulo === 2)
    return (
      <>
        <Encabezado
          seccion="Blog"
          titulo="Cómo preparar una consulta de arriendo."
        />
        <section className="section">
          <div className="container lectura">
            <p>
              Una consulta clara permite revisar equipos y plazos con menos
              intercambios.
            </p>
            <h2 className="fs-4">Los datos de tu proyecto</h2>
            <p>
              Indica el tipo de tarea, las fechas, la ubicación y la capacidad
              requerida. Agrega si necesitas operador o traslado.
            </p>
            <h2 className="fs-4">Antes de confirmar</h2>
            <p>
              Consulta qué incluye la tarifa y cuáles son las condiciones de
              entrega, retiro y mantención. Los valores de este sitio son
              ejemplos académicos.
            </p>
            <Link to="/contacto">Conversemos sobre tu arriendo</Link>
            <br />
            <Link to="/blog">Volver al blog</Link>
          </div>
        </section>
      </>
    );
  return (
    <>
      <Encabezado
        seccion="Blog"
        titulo="Ideas para preparar tu próxima obra."
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <article className="product-card">
                <img
                  className="blog-image"
                  src={imagenes.obra}
                  alt="Obra en construcción"
                />
                <div className="product-body">
                  <h2 className="fs-4">
                    Qué revisar antes de elegir un equipo
                  </h2>
                  <p>La tarea, el espacio y la capacidad que necesitas.</p>
                  <Link to="/blog/elegir-equipo">Leer artículo</Link>
                </div>
              </article>
            </div>
            <div className="col-md-6">
              <article className="product-card">
                <img
                  className="blog-image"
                  src={imagenes.camiones}
                  alt="Camión de obra"
                />
                <div className="product-body">
                  <h2 className="fs-4">
                    Cómo preparar una consulta de arriendo
                  </h2>
                  <p>Los datos que ayudan a definir un plan.</p>
                  <Link to="/blog/planificar-arriendo">Leer artículo</Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
