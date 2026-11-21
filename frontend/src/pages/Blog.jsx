import { Link } from "react-router-dom";
import Encabezado from "../components/Encabezado";
import imagenes from "../data/imagenes";
// TODO ENTREGA FINAL:
// Integrante 2: convertir Blog.jsx en un blog dinámico.
// Los artículos deben crearse y editarse mediante Tiptap.
// Integrante 1: guardar artículos en MySQL mediante REST.
// Sanitizar HTML en backend y con DOMPurify en React.
// Reemplazar rutas estáticas por /blog/:slug.
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
              Empieza por definir la tarea, el lugar de trabajo y la reglamentación. Esa información permite comparar alternativas con un criterio
              común.
            </p>
            <h2 className="fs-4">Capacidad y dimensiones</h2>
            <p>
              Revisa el tonelaje y el tamaño en la ficha del producto. Confirma
              con el proveedor los requerimientos de instalación y operación del
              modelo real.
            </p>
            <h2 className="fs-4">Antes de comprar</h2>
            <p>
              Compara las características técnicas, el precio y la capacidad
              de los equipos disponibles. Selecciona el producto que mejor
              se adapte a las necesidades de tu proyecto.
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
          titulo="Cómo elegir entre retiro y despacho"
        />
        <section className="section">
          <div className="container lectura">
            <h2 className="fs-4">Retiro de productos:</h2>
            <p>
              Gratuito y sin restricción regional.
            </p>
            <h2 className="fs-4">Despacho</h2>
            <p>
              Disponible exclusivamente en la Región Metropolitana, con un costo de $50.000 para compras inferiores a $1.000.000 y $100.000 desde ese monto.
            </p>
            <Link to="/catalogo">Explorar catálogo</Link>
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
                    Cómo elegir entre retiro y despacho
                  </h2>
                  <p>
                    Conoce nuestras alternativas para recibir tus productos.
                  </p>
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

