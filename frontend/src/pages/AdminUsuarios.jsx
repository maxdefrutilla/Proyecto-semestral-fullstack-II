import { useState } from "react";
import Campo from "../components/Campo";
import ResumenPedido from "../components/ResumenPedido";
import { siguienteId, claveValida } from "../data/operaciones";

export default function AdminUsuarios(props) {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [rol, setRol] = useState("Cliente");
  const [mensaje, setMensaje] = useState("");
  const [eliminar, setEliminar] = useState(null);
  const [historialId, setHistorialId] = useState(null);
  function limpiar() {
    setId(null);
    setNombre("");
    setUsuario("");
    setCorreo("");
    setClave("");
    setRol("Cliente");
  }
  function guardar(event) {
    event.preventDefault();
    const normalizado = usuario.trim().toLowerCase();
    if (
      nombre.trim().length < 2 ||
      !/^[a-z0-9._-]{3,30}$/.test(normalizado) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      setMensaje("Revisa el nombre, usuario y correo.");
      return;
    }
    if ((id === null || clave !== "") && !claveValida(clave)) {
      setMensaje(
        "Contraseña: mínimo 6 caracteres, letra, símbolo y mayúscula.",
      );
      return;
    }
    let anterior = { direccion: "", comuna: "" };
    for (let i = 0; i < props.usuarios.length; i++) {
      if (
        props.usuarios[i].usuario === normalizado &&
        props.usuarios[i].id !== id
      ) {
        setMensaje("Ese usuario ya existe.");
        return;
      }
      if (props.usuarios[i].id === id) anterior = props.usuarios[i];
    }
    if (id === props.usuario.id && rol !== "Administrador") {
      setMensaje(
        "No puedes quitarte el rol de administrador durante tu sesión.",
      );
      return;
    }
    props.guardar(
      {
        id: id === null ? siguienteId(props.usuarios) : id,
        nombre: nombre.trim(),
        usuario: normalizado,
        correo: correo.trim(),
        clave: clave === "" ? anterior.clave : clave,
        rol,
        direccion: anterior.direccion,
        comuna: anterior.comuna,
      },
      id === null,
    );
    limpiar();
    setMensaje("Usuario guardado.");
  }
  const filas = [];
  for (let i = 0; i < props.usuarios.length; i++) {
    const cuenta = props.usuarios[i];
    filas.push(
      <tr key={cuenta.id}>
        <td>
          {cuenta.nombre}
          <br />
          <small>{cuenta.usuario}</small>
        </td>
        <td>{cuenta.rol}</td>
        <td>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={function () {
                setId(cuenta.id);
                setNombre(cuenta.nombre);
                setUsuario(cuenta.usuario);
                setCorreo(cuenta.correo);
                setClave("");
                setRol(cuenta.rol);
              }}
            >
              Editar
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={function () {
                setHistorialId(cuenta.id);
              }}
            >
              Historial
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={cuenta.id === props.usuario.id}
              onClick={function () {
                setEliminar(cuenta.id);
              }}
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>,
    );
  }
  const pedidos = [];
  for (let i = 0; i < props.pedidos.length; i++)
    if (props.pedidos[i].usuarioId === historialId)
      pedidos.push(
        <ResumenPedido key={props.pedidos[i].id} pedido={props.pedidos[i]} />,
      );
  return (
    <>
      <h2>Usuarios</h2>
      {mensaje && (
        <p className="alert alert-info" role="status">
          {mensaje}
        </p>
      )}
      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>
            ¿Eliminar este usuario? Sus pedidos anteriores conservarán el nombre
            original.
          </p>
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={function () {
              props.eliminar(eliminar);
              if (id === eliminar) limpiar();
              setEliminar(null);
            }}
          >
            Confirmar
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={function () {
              setEliminar(null);
            }}
          >
            Cancelar
          </button>
        </div>
      )}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>
      {historialId !== null && (
        <div className="mb-4">
          <h3>Historial de compras</h3>
          {pedidos.length ? (
            pedidos
          ) : (
            <p>Este usuario no tiene compras registradas.</p>
          )}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={function () {
              setHistorialId(null);
            }}
          >
            Cerrar historial
          </button>
        </div>
      )}
      <form className="form-surface" onSubmit={guardar} noValidate>
        <h3>{id === null ? "Nuevo usuario" : "Editar usuario"}</h3>
        <Campo
          id="adminNombre"
          etiqueta="Nombre"
          valor={nombre}
          cambiar={setNombre}
        />
        <Campo
          id="adminUsuario"
          etiqueta="Usuario"
          valor={usuario}
          cambiar={setUsuario}
        />
        <Campo
          id="adminCorreo"
          etiqueta="Correo"
          tipo="email"
          valor={correo}
          cambiar={setCorreo}
        />
        <Campo
          id="adminClave"
          etiqueta={id === null ? "Contraseña" : "Nueva contraseña (opcional)"}
          requerido={id === null}
          tipo="password"
          valor={clave}
          cambiar={setClave}
        />
        <label className="form-label" htmlFor="adminRol">
          Rol
        </label>
        <select
          id="adminRol"
          className="form-select mb-3"
          value={rol}
          onChange={function (e) {
            setRol(e.target.value);
          }}
        >
          <option>Cliente</option>
          <option>Administrador</option>
        </select>
        <button className="btn btn-primary me-2">Guardar usuario</button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={limpiar}
        >
          Cancelar / Nuevo
        </button>
      </form>
    </>
  );
}
