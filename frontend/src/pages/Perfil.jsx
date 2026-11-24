import { useState } from "react";
import { Link } from "react-router-dom";
import Campo from "../components/Campo";
import Encabezado from "../components/Encabezado";
import ResumenPedido from "../components/ResumenPedido";

function DatosPerfil(props) {
  const [nombre, setNombre] = useState(props.usuario.nombre);
  const [correo, setCorreo] = useState(props.usuario.correo);
  const [direccion, setDireccion] = useState(props.usuario.direccion);
  const [comuna, setComuna] = useState(props.usuario.comuna);
  const [mensaje, setMensaje] = useState("");
  function guardar(event) {
    event.preventDefault();
    if (
      nombre.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      setMensaje("Ingresa un nombre y correo válidos.");
      return;
    }
    props.guardar({
      ...props.usuario,
      nombre: nombre.trim(),
      correo: correo.trim(),
      direccion: direccion.trim(),
      comuna: comuna.trim(),
    });
    setMensaje("Perfil actualizado en memoria.");
  }
  const historial = [];
  for (let i = 0; i < props.pedidos.length; i++) {
    if (props.pedidos[i].usuarioId === props.usuario.id)
      historial.push(
        <ResumenPedido key={props.pedidos[i].id} pedido={props.pedidos[i]} />,
      );
  }
  return (
    <>
      <Encabezado
        seccion="Mi perfil"
        titulo={"Hola, " + props.usuario.nombre + "."}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <form className="form-surface" onSubmit={guardar} noValidate>
                <h2 className="fs-4">Mis datos</h2>
                <Campo
                  id="perfilNombre"
                  etiqueta="Nombre"
                  valor={nombre}
                  cambiar={setNombre}
                />
                <Campo
                  id="perfilCorreo"
                  etiqueta="Correo"
                  tipo="email"
                  valor={correo}
                  cambiar={setCorreo}
                />
                <Campo
                  id="perfilDireccion"
                  etiqueta="Dirección"
                  valor={direccion}
                  cambiar={setDireccion}
                  requerido={false}
                />
                <Campo
                  id="perfilComuna"
                  etiqueta="Comuna"
                  valor={comuna}
                  cambiar={setComuna}
                  requerido={false}
                />
                <button className="btn btn-primary">Guardar cambios</button>
                {mensaje && (
                  <p className="alert alert-info mt-3" role="status">
                    {mensaje}
                  </p>
                )}
              </form>
            </div>
            <div className="col-lg-7">
              <h2 className="fs-4">Historial de compras</h2>
              {historial.length ? (
                historial
              ) : (
                <p className="text-muted">
                  Todavía no hay pedidos de esta cuenta.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default function Perfil(props) {
  if (!props.usuario)
    return (
      <section className="section">
        <div className="container empty-state">
          <h1 className="fs-2">Inicia sesión para ver tu perfil.</h1>
          <Link to="/acceso">Ingresar</Link>
        </div>
      </section>
    );
  return <DatosPerfil {...props} key={props.usuario.id} />;
}
