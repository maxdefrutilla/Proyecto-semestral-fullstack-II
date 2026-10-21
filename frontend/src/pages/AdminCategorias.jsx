import { useState } from "react";
import Campo from "../components/Campo";
import { siguienteId } from "../data/operaciones";

export default function AdminCategorias(props) {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [eliminar, setEliminar] = useState(null);
  function guardar(event) {
    event.preventDefault();
    if (nombre.trim().length < 2) {
      setMensaje("Escribe un nombre de al menos 2 caracteres.");
      return;
    }
    let codigo = "";
    for (let i = 0; i < props.categorias.length; i++) {
      if (
        props.categorias[i].id !== id &&
        props.categorias[i].nombre.toLowerCase() === nombre.trim().toLowerCase()
      ) {
        setMensaje("Ya existe una categoría con ese nombre.");
        return;
      }
      if (props.categorias[i].id === id) codigo = props.categorias[i].codigo;
    }
    const numero = id === null ? siguienteId(props.categorias) : id;
    if (codigo === "") codigo = "categoria-" + numero;
    props.guardar({ id: numero, nombre: nombre.trim(), codigo }, id === null);
    setNombre("");
    setId(null);
    setMensaje("Categoría guardada.");
  }
  function borrar() {
    const respuesta = props.eliminar(eliminar);
    setMensaje(respuesta);
    if (respuesta === "Categoría eliminada." && id === eliminar) {
      setId(null);
      setNombre("");
    }
    setEliminar(null);
  }
  const filas = [];
  for (let i = 0; i < props.categorias.length; i++) {
    const categoria = props.categorias[i];
    filas.push(
      <tr key={categoria.id}>
        <td>{categoria.nombre}</td>
        <td>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={function () {
              setId(categoria.id);
              setNombre(categoria.nombre);
            }}
          >
            Editar
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={function () {
              setEliminar(categoria.id);
            }}
          >
            Eliminar
          </button>
        </td>
      </tr>,
    );
  }
  return (
    <>
      <h2>Categorías</h2>
      <p>Una categoría con productos no se puede eliminar.</p>
      {mensaje && (
        <p className="alert alert-info" role="status">
          {mensaje}
        </p>
      )}
      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>¿Eliminar la categoría?</p>
          <button className="btn btn-danger btn-sm me-2" onClick={borrar}>
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
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{filas}</tbody>
      </table>
      <form className="form-surface" onSubmit={guardar} noValidate>
        <h3>{id === null ? "Nueva categoría" : "Editar categoría"}</h3>
        <Campo
          id="categoriaNombre"
          etiqueta="Nombre"
          valor={nombre}
          cambiar={setNombre}
        />
        <button className="btn btn-primary me-2">Guardar categoría</button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={function () {
            setId(null);
            setNombre("");
          }}
        >
          Cancelar
        </button>
      </form>
    </>
  );
}
