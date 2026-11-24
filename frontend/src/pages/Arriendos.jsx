import { useState } from "react";
import Encabezado from "../components/Encabezado";
import FormularioContacto from "../components/FormularioContacto";

export default function Arriendos() {
  const [plan, setPlan] = useState("");
  const [servicio, setServicio] = useState(1);
  return (
    <>
      <Encabezado
        seccion="Arriendo y servicios"
        titulo="El equipo que necesitas, por el tiempo que necesitas."
      />
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <h2>Cada proyecto tiene su ritmo.</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <article className="plan-card">
                <h3>Por hora</h3>
                <p>Trabajos puntuales y etapas breves.</p>
                <div className="plan-price">
                  UF 0,5 <small>/ hora</small>
                </div>
                <ul>
                  <li>Mínimo 4 horas</li>
                  <li>Operador y combustible incluidos</li>
                  <li>Coordinación de entrega</li>
                </ul>
                <a
                  className="btn btn-outline-primary"
                  href="#cotizacion"
                  onClick={function () {
                    setPlan("por hora");
                  }}
                >
                  Consultar este plan
                </a>
              </article>
            </div>
            <div className="col-md-4">
              <article className="plan-card featured">
                <span className="plan-label">Plan flexible</span>
                <h3>Por día / semana</h3>
                <p>Para avanzar una etapa completa.</p>
                <div className="plan-price">
                  UF 12 <small>/ día</small>
                </div>
                <ul>
                  <li>14% de descuento semanal</li>
                  <li>Mantenciones preventivas</li>
                  <li>Operador incluido</li>
                </ul>
                <a
                  className="btn btn-primary"
                  href="#cotizacion"
                  onClick={function () {
                    setPlan("por día o semana");
                  }}
                >
                  Consultar este plan
                </a>
              </article>
            </div>
            <div className="col-md-4">
              <article className="plan-card">
                <h3>Por mes</h3>
                <p>Continuidad para proyectos largos.</p>
                <div className="plan-price">
                  UF 40 <small>/ mes</small>
                </div>
                <ul>
                  <li>30% de descuento mensual</li>
                  <li>Opción con o sin operador</li>
                  <li>Capacitación de operadores</li>
                </ul>
                <a
                  className="btn btn-outline-primary"
                  href="#cotizacion"
                  onClick={function () {
                    setPlan("por mes");
                  }}
                >
                  Consultar este plan
                </a>
              </article>
            </div>
          </div>
          <p className="image-note mt-3">
            Planes de muestra sujetos a equipo y disponibilidad.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Tarifas de referencia</h2>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Capacidad</th>
                  <th>Arriendo mensual desde</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Grúa</td>
                  <td>50 toneladas</td>
                  <td>$450.000</td>
                </tr>
                <tr>
                  <td>Montacargas</td>
                  <td>3 toneladas</td>
                  <td>$90.000</td>
                </tr>
                <tr>
                  <td>Ascensor de obra</td>
                  <td>2 toneladas</td>
                  <td>Consultar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted">
            Valores de muestra sujetos a disponibilidad y cotización.
          </p>
        </div>
      </section>
      <section className="section" id="servicios">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <span className="eyebrow">Servicio técnico</span>
              <h2>Que tu equipo siga trabajando.</h2>
            </div>
            <div className="col-lg-7">
              <div className="accordion">
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className={
                        "accordion-button " +
                        (servicio !== 1 ? "collapsed" : "")
                      }
                      aria-expanded={servicio === 1}
                      onClick={function () {
                        setServicio(servicio === 1 ? 0 : 1);
                      }}
                    >
                      Mantención preventiva
                    </button>
                  </h3>
                  {servicio === 1 && (
                    <div className="accordion-body">
                      Revisión programada de componentes, lubricación y
                      recomendaciones de uso.
                    </div>
                  )}
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className={
                        "accordion-button " +
                        (servicio !== 2 ? "collapsed" : "")
                      }
                      aria-expanded={servicio === 2}
                      onClick={function () {
                        setServicio(servicio === 2 ? 0 : 2);
                      }}
                    >
                      Reparación y repuestos
                    </button>
                  </h3>
                  {servicio === 2 && (
                    <div className="accordion-body">
                      Evaluación de fallas, revisión del equipo y requerimientos
                      de repuestos.
                    </div>
                  )}
                </div>
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className={
                        "accordion-button " +
                        (servicio !== 3 ? "collapsed" : "")
                      }
                      aria-expanded={servicio === 3}
                      onClick={function () {
                        setServicio(servicio === 3 ? 0 : 3);
                      }}
                    >
                      Capacitación
                    </button>
                  </h3>
                  {servicio === 3 && (
                    <div className="accordion-body">
                      Orientación para operar maquinaria y utilizar protección
                      personal.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-soft" id="cotizacion">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2>Cuéntanos qué necesitas.</h2>
              <p className="text-muted">
                Selecciona un plan o completa tu consulta.
              </p>
              {plan && (
                <p className="alert alert-info">Plan seleccionado: {plan}</p>
              )}
            </div>
            <div className="col-lg-7">
              <FormularioContacto cotizacion={true} plan={plan} key={plan} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
