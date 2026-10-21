import { useState } from "react";
import { Link } from "react-router-dom";
import Campo from "../components/Campo";
import imagenes from "../data/imagenes";
import { claveValida, siguienteId } from "../data/operaciones";

export default function Acceso(props) {
  const [registro, setRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [clave, setClave] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  function enviar(event) {
    event.preventDefault();
    const nuevosErrores = {};
    const normalizado = usuario.trim().toLowerCase();
    let valido = true;
    if (normalizado === "") {
      nuevosErrores.usuario = "Ingresa tu usuario.";
      valido = false;
    }
    if (clave.trim() === "") {
      nuevosErrores.clave = "Ingresa tu contraseña.";
      valido = false;
    }
    if (registro) {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,80}$/.test(nombre.trim())) {
        nuevosErrores.nombre = "Ingresa un nombre válido.";
        valido = false;
      }
      if (!/^[a-z0-9._-]{3,30}$/.test(normalizado)) {
        nuevosErrores.usuario =
          "Usa entre 3 y 30 letras, números, puntos o guiones.";
        valido = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
        nuevosErrores.correo = "Ingresa un correo válido.";
        valido = false;
      }
      if (!claveValida(clave)) {
        nuevosErrores.clave =
          "Mínimo 6 caracteres, una letra, un símbolo y una mayúscula.";
        valido = false;
      }
      if (clave !== confirmacion || confirmacion === "") {
        nuevosErrores.confirmacion = "Las contraseñas deben coincidir.";
        valido = false;
      }
      for (let i = 0; i < props.usuarios.length; i++) {
        if (props.usuarios[i].usuario === normalizado) {
          nuevosErrores.usuario = "Este usuario ya existe.";
          valido = false;
        }
      }
    }
    setErrores(nuevosErrores);
    setMensaje("");
    if (!valido) return;

    if (registro) {
      props.registrar({
        id: siguienteId(props.usuarios),
        nombre: nombre.trim(),
        usuario: normalizado,
        correo: correo.trim(),
        clave: clave,
        rol: "Cliente",
        direccion: direccion.trim(),
        comuna: comuna.trim(),
      });
      setRegistro(false);
      setClave("");
      setConfirmacion("");
      setMensaje("Cuenta creada. Ya puedes iniciar sesión.");
    } else {
      let encontrado = null;
      for (let i = 0; i < props.usuarios.length; i++) {
        if (
          props.usuarios[i].usuario === normalizado &&
          props.usuarios[i].clave === clave
        )
          encontrado = props.usuarios[i];
      }
      if (encontrado === null)
        setErrores({ clave: "Usuario o contraseña incorrectos." });
      else {
        props.ingresar(encontrado);
        setClave("");
      }
    }
  }

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-story">
            <span className="eyebrow">Acceso INMAQUI</span>
            <h1>
              Tu cuenta.
              <br />
              Tu próximo proyecto.
            </h1>
            <p>Accede a tus datos y revisa tus compras.</p>
            <img src={imagenes.obra} alt="Obra en construcción" />
          </div>
          <div className="auth-form">
            {props.usuario ? (
              <>
                <span className="eyebrow">{props.usuario.rol}</span>
                <h2>Hola, {props.usuario.nombre}.</h2>
                <p>{props.usuario.correo}</p>
                <div className="d-flex gap-2 flex-wrap">
                  {props.usuario.rol === "Administrador" && (
                    <Link className="btn btn-outline-primary" to="/admin">
                      Administración
                    </Link>
                  )}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={props.salir}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex gap-2 mb-4">
                  <button
                    className={
                      "btn btn-sm " +
                      (!registro ? "btn-primary" : "btn-outline-primary")
                    }
                    onClick={function () {
                      setRegistro(false);
                      setErrores({});
                      setMensaje("");
                    }}
                  >
                    Ingresar
                  </button>
                  <button
                    className={
                      "btn btn-sm " +
                      (registro ? "btn-primary" : "btn-outline-primary")
                    }
                    onClick={function () {
                      setRegistro(true);
                      setErrores({});
                      setMensaje("");
                    }}
                  >
                    Registrarse
                  </button>
                </div>
                <h2>
                  {registro
                    ? "Crear cuenta de cliente"
                    : "Bienvenido de vuelta."}
                </h2>
                {mensaje && (
                  <p className="alert alert-success" role="status">
                    {mensaje}
                  </p>
                )}
                <form onSubmit={enviar} noValidate>
                  {registro && (
                    <Campo
                      id="nombreCuenta"
                      etiqueta="Nombre completo"
                      valor={nombre}
                      cambiar={setNombre}
                      error={errores.nombre}
                    />
                  )}
                  <Campo
                    id="usuarioCuenta"
                    etiqueta="Usuario"
                    valor={usuario}
                    cambiar={setUsuario}
                    error={errores.usuario}
                  />
                  {registro && (
                    <>
                      <Campo
                        id="correoCuenta"
                        etiqueta="Correo"
                        tipo="email"
                        valor={correo}
                        cambiar={setCorreo}
                        error={errores.correo}
                      />
                      <Campo
                        id="direccionCuenta"
                        etiqueta="Dirección (opcional)"
                        requerido={false}
                        valor={direccion}
                        cambiar={setDireccion}
                      />
                      <Campo
                        id="comunaCuenta"
                        etiqueta="Comuna (opcional)"
                        requerido={false}
                        valor={comuna}
                        cambiar={setComuna}
                      />
                    </>
                  )}
                  <Campo
                    id="claveCuenta"
                    etiqueta="Contraseña"
                    tipo={verClave ? "text" : "password"}
                    valor={clave}
                    cambiar={setClave}
                    error={errores.clave}
                  />
                  {registro && (
                    <>
                      <p className="form-text">
                        6 caracteres mínimo, una letra, un símbolo y una
                        mayúscula.
                      </p>
                      <Campo
                        id="confirmacion"
                        etiqueta="Confirmar contraseña"
                        tipo={verClave ? "text" : "password"}
                        valor={confirmacion}
                        cambiar={setConfirmacion}
                        error={errores.confirmacion}
                      />
                    </>
                  )}
                  <div className="form-check mb-3">
                    <input
                      id="verClave"
                      type="checkbox"
                      className="form-check-input"
                      checked={verClave}
                      onChange={function (e) {
                        setVerClave(e.target.checked);
                      }}
                    />
                    <label htmlFor="verClave" className="form-check-label">
                      Mostrar contraseña
                    </label>
                  </div>
                  <button className="btn btn-primary w-100" type="submit">
                    {registro ? "Crear cuenta" : "Iniciar sesión"}
                  </button>
                </form>
              </>
            )}
            <p className="form-notice">
              Demostración académica. Usa datos de prueba. Las cuentas y la
              sesión se mantienen hasta recargar. Los administradores pueden
              crear otras cuentas desde el panel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
