import { Link } from "react-router-dom";
import imagenes from "../data/imagenes";

export default function Nosotros() {
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
                Nosotros
              </li>
            </ol>
          </nav>
          <span className="eyebrow">Nosotros</span>
          <h1>Equipos para construir. Personas para acompañar.</h1>
          <p>
            Somos INMAQUI: una empresa dedicada a la venta, el arriendo y los
            servicios de maquinaria para proyectos de construcción.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <img
                className="about-image"
                src={imagenes.obra}
                alt="Maquinaria apoyando la construcción de un edificio"
              />
            </div>
            <div className="col-lg-6">
              <span className="eyebrow">Nuestra empresa</span>
              <h2>Con los pies en la obra.</h2>
              <p className="mt-4">
                En INMAQUI reunimos maquinaria, herramientas e indumentaria para
                apoyar el trabajo en terreno. Nuestra propuesta es facilitar la
                elección de equipos según la tarea, la capacidad y el tiempo de
                uso que requiere cada proyecto.
              </p>
              <p className="text-muted">
                Desde Santiago, buscamos acompañar a constructoras, contratistas
                y equipos de trabajo con una atención cercana. Contamos con
                alternativas de compra, arriendo y servicio técnico en un mismo
                lugar.
              </p>
              <Link className="btn btn-primary mt-2" to="/contacto">
                Conversemos{" "}
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="value-card">
                <span className="eyebrow">Lo que nos mueve</span>
                <h2>Nuestra misión</h2>
                <p className="mt-3 mb-0">
                  Facilitar el acceso a equipos adecuados para cada obra, con
                  información clara y acompañamiento durante la compra, el
                  arriendo y la mantención.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="value-card">
                <span className="eyebrow">Hacia dónde vamos</span>
                <h2>Nuestra visión</h2>
                <p className="mt-3 mb-0">
                  Ser un proveedor de confianza para los equipos de
                  construcción, reconocido por una atención responsable y
                  soluciones que respondan al trabajo real en terreno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Nuestra forma de trabajar.</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="value-card">
                <span className="service-number">01</span>
                <h3>Responsabilidad</h3>
                <p className="text-muted mb-0">
                  Entregar información clara sobre los equipos y las condiciones
                  de cada servicio.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <span className="service-number">02</span>
                <h3>Cercanía</h3>
                <p className="text-muted mb-0">
                  Escuchar las necesidades de cada proyecto antes de proponer
                  una alternativa.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <span className="service-number">03</span>
                <h3>Seguridad</h3>
                <p className="text-muted mb-0">
                  Promover la revisión de los equipos y el uso de protección en
                  las tareas de obra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
