import Encabezado from "../components/Encabezado";
import FormularioContacto from "../components/FormularioContacto";

export default function Contacto() {
  return (
    <>
      <Encabezado
        seccion="Contacto"
        titulo="Conversemos sobre tu proyecto."
        texto="Déjanos tus datos y cuéntanos cómo podemos ayudarte."
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <span className="eyebrow">Estamos para orientarte</span>
              <h2>El primer paso es conversar.</h2>
              <p className="text-muted mt-3">
                Consultas sobre equipos, arriendo y servicios.
              </p>
              <hr />
              <h3 className="fs-6">Dónde encontrarnos</h3>
              <p>Panamericana Norte Km 12, Santiago</p>
              <h3 className="fs-6">Horario</h3>
              <p>Lunes a sábado · 8:00 a 19:00</p>
            </div>
            <div className="col-lg-8">
              <FormularioContacto />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
