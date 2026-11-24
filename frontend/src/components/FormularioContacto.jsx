import { useState } from "react";
import Campo from "./Campo";
import { validarRut } from "../data/operaciones";

export default function FormularioContacto(props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [rut, setRut] = useState("");
  const [asunto, setAsunto] = useState("");
  const [tipo, setTipo] = useState(props.plan ? "arriendo" : "");
  const [equipo, setEquipo] = useState("");
  const [mensaje, setMensaje] = useState(
    props.plan ? "Me interesa el plan " + props.plan + ". Fechas: " : "",
  );
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function enviar(event) {
    event.preventDefault();
    const error = {};
    let valido = true;
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/.test(nombre.trim())) {
      error.nombre = "Ingresa un nombre válido.";
      valido = false;
    }
    if (!/^\+569[0-9]{8}$/.test(telefono.trim())) {
      error.telefono = "Usa el formato +56912345678.";
      valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      error.correo = "Ingresa un correo válido.";
      valido = false;
    }
    if (props.cotizacion) {
      if (tipo === "" || equipo === "") {
        error.solicitud = "Selecciona el tipo de solicitud y el equipo.";
        valido = false;
      }
    } else {
      if (empresa.trim().length < 2) {
        error.empresa = "Ingresa tu empresa.";
        valido = false;
      }
      if (!validarRut(rut)) {
        error.rut = "Ingresa un RUT válido. Ejemplo: 12345678-5.";
        valido = false;
      }
      if (asunto.trim() === "" || asunto.length > 50) {
        error.asunto = "Ingresa un asunto de hasta 50 caracteres.";
        valido = false;
      }
    }
    if (mensaje.trim() === "" || mensaje.trim().split(/\s+/).length > 500) {
      error.mensaje = "Escribe un mensaje de hasta 500 palabras.";
      valido = false;
    }
    setErrores(error);
    setEnviado(valido);
  }
  return (
    <form className="form-surface" onSubmit={enviar} noValidate>
      <h2 className="fs-4 mb-4">
        {props.cotizacion ? "Solicitar cotización" : "Dejar mis datos"}
      </h2>
      <Campo
        id="nombreContacto"
        etiqueta="Nombre completo"
        valor={nombre}
        cambiar={setNombre}
        error={errores.nombre}
      />
      <div className="row">
        <div className="col-md-6">
          <Campo
            id="telefono"
            etiqueta="Teléfono"
            tipo="tel"
            valor={telefono}
            cambiar={setTelefono}
            error={errores.telefono}
          />
        </div>
        <div className="col-md-6">
          <Campo
            id="correoContacto"
            etiqueta="Correo"
            tipo="email"
            valor={correo}
            cambiar={setCorreo}
            error={errores.correo}
          />
        </div>
      </div>
      {props.cotizacion ? (
        <>
          <label className="form-label" htmlFor="tipoSolicitud">
            Tipo de solicitud
          </label>
          <select
            id="tipoSolicitud"
            className="form-select mb-3"
            value={tipo}
            onChange={function (e) {
              setTipo(e.target.value);
            }}
          >
            <option value="">Selecciona una opción</option>
            <option value="arriendo">Arriendo</option>
            <option value="compra">Compra</option>
            <option value="servicio">Servicio técnico</option>
            <option value="capacitacion">Capacitación</option>
          </select>
          <label className="form-label" htmlFor="equipo">
            Equipo de interés
          </label>
          <select
            id="equipo"
            className="form-select mb-3"
            value={equipo}
            onChange={function (e) {
              setEquipo(e.target.value);
            }}
          >
            <option value="">Selecciona un equipo</option>
            <option>Ascensor</option>
            <option>Camión</option>
            <option>Herramientas</option>
            <option>Indumentaria</option>
            <option>Montacargas</option>
            <option>Grúa</option>
            <option>Otro</option>
          </select>
          {errores.solicitud && (
            <p className="text-danger" role="alert">
              {errores.solicitud}
            </p>
          )}
        </>
      ) : (
        <>
          <Campo
            id="empresa"
            etiqueta="Empresa"
            valor={empresa}
            cambiar={setEmpresa}
            error={errores.empresa}
          />
          <Campo
            id="rut"
            etiqueta="RUT"
            valor={rut}
            cambiar={setRut}
            error={errores.rut}
          />
          <Campo
            id="asunto"
            etiqueta="Asunto"
            maxLength={50}
            valor={asunto}
            cambiar={setAsunto}
            error={errores.asunto}
          />
        </>
      )}
      <label className="form-label" htmlFor="mensajeContacto">
        Mensaje
      </label>
      <textarea
        id="mensajeContacto"
        className={"form-control " + (errores.mensaje ? "is-invalid" : "")}
        rows="5"
        value={mensaje}
        onChange={function (e) {
          setMensaje(e.target.value);
          setEnviado(false);
        }}
      />
      <div className="invalid-feedback">{errores.mensaje}</div>
      <p className="form-text">Máximo 500 palabras.</p>
      <button type="submit" className="btn btn-primary">
        Validar solicitud
      </button>
      {enviado && (
        <div className="alert alert-success mt-3" role="status">
          Los datos son válidos. Esta demostración no envía mensajes reales.
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Cerrar aviso"
            onClick={function () {
              setEnviado(false);
            }}
          />
        </div>
      )}
    </form>
  );
}
