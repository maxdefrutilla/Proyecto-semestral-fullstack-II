import { useState } from "react";
import Campo from "../components/Campo";
import { siguienteId, dinero, buscarRegistro } from "../data/operaciones";

export default function AdminProductos(props) {
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(props.categorias[0].codigo);
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [tonelaje, setTonelaje] = useState("No aplica");
  const [tamano, setTamano] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("ascensores.jpg");
  const [oferta, setOferta] = useState(false);
  const [anterior, setAnterior] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [eliminar, setEliminar] = useState(null);
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  function limpiar() {
    setEditando(null);
    setNombre("");
    setPrecio("");
    setStock("");
    setTamano("");
    setDescripcion("");
    setTonelaje("No aplica");
    setOferta(false);
    setAnterior("");
  }
  function cargar(producto) {
    setEditando(producto.id);
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setPrecio(String(producto.precio));
    setStock(String(producto.stock));
    setTonelaje(producto.tonelaje);
    setTamano(producto.tamano);
    setDescripcion(producto.descripcion);
    setImagen(producto.imagen);
    setOferta(producto.oferta);
    setAnterior(String(producto.precioAnterior));
    setMensaje("");
  }
  function guardar(event) {
    event.preventDefault();
    let categoriaExiste = false;
    for (let i = 0; i < props.categorias.length; i++)
      if (props.categorias[i].codigo === categoria) categoriaExiste = true;
    if (
      nombre.trim() === "" ||
      tamano.trim() === "" ||
      tonelaje.trim() === "" ||
      descripcion.trim() === "" ||
      !categoriaExiste
    ) {
      setMensaje("Completa nombre, categoría, tonelaje, tamaño y descripción.");
      return;
    }
    if (!/^[1-9][0-9]{0,9}$/.test(precio) || !/^[0-9]{1,6}$/.test(stock)) {
      setMensaje(
        "Ingresa un precio entero positivo y stock entero mayor o igual a cero.",
      );
      return;
    }
    if (
      oferta &&
      (!/^[1-9][0-9]{0,9}$/.test(anterior) ||
        Number(anterior) <= Number(precio))
    ) {
      setMensaje("El precio anterior debe ser mayor al precio de oferta.");
      return;
    }
    const original = buscarRegistro(props.productos, editando);
    const producto = {
      id: editando === null ? siguienteId(props.productos) : editando,
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      tonelaje: tonelaje.trim(),
      tamano: tamano.trim(),
      descripcion: descripcion.trim(),
      imagen,
      oferta,
      precioAnterior: oferta ? Number(anterior) : 0,
      etiqueta: "Equipamiento de obra",
      detalles: original
        ? original.detalles
        : [
            "Características referenciales. Editar según la ficha del fabricante.",
          ],
    };
    props.guardar(producto, editando === null);
    limpiar();
    setMensaje("Producto guardado. El catálogo ya está actualizado.");
  }
  const opciones = [];
  for (let i = 0; i < props.categorias.length; i++)
    opciones.push(
      <option key={props.categorias[i].id} value={props.categorias[i].codigo}>
        {props.categorias[i].nombre}
      </option>,
    );
  const filas = [];
  for (let i = 0; i < props.productos.length; i++) {
    const producto = props.productos[i];
    if (soloCriticos && producto.stock > 5) continue;
    if (
      producto.nombre.toLowerCase().indexOf(busqueda.toLowerCase().trim()) ===
      -1
    )
      continue;
    filas.push(
      <tr key={producto.id}>
        <td>{producto.nombre}</td>
        <td>{dinero(producto.precio)}</td>
        <td>{producto.stock}</td>
        <td>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={function () {
                cargar(producto);
              }}
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={function () {
                setEliminar(producto.id);
              }}
            >
              Eliminar
            </button>
          </div>
        </td>
      </tr>,
    );
  }
  return (
    <>
      <h2>Productos</h2>
      <p className="text-muted">
        Los cambios se reflejan en la tienda y se reinician al recargar.
      </p>
      <label className="form-label" htmlFor="buscarAdmin">
        Buscar producto
      </label>
      <input
        id="buscarAdmin"
        className="form-control mb-3"
        value={busqueda}
        onChange={function (e) {
          setBusqueda(e.target.value);
        }}
      />
      <div className="form-check mb-3">
        <input
          id="criticos"
          className="form-check-input"
          type="checkbox"
          checked={soloCriticos}
          onChange={function (e) {
            setSoloCriticos(e.target.checked);
          }}
        />
        <label className="form-check-label" htmlFor="criticos">
          Solo stock crítico: 5 unidades o menos
        </label>
      </div>
      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>¿Eliminar este producto del catálogo y del carrito?</p>
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={function () {
              props.eliminar(eliminar);
              if (editando === eliminar) limpiar();
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
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
        {filas.length === 0 && <p>No hay productos para este filtro.</p>}
      </div>
      <form className="form-surface mt-4" onSubmit={guardar} noValidate>
        <h3>{editando === null ? "Nuevo producto" : "Editar producto"}</h3>
        {mensaje && (
          <p className="alert alert-info" role="status">
            {mensaje}
          </p>
        )}
        <Campo
          id="productoNombre"
          etiqueta="Nombre"
          valor={nombre}
          cambiar={setNombre}
        />
        <label className="form-label" htmlFor="productoCategoria">
          Categoría
        </label>
        <select
          id="productoCategoria"
          className="form-select mb-3"
          value={categoria}
          onChange={function (e) {
            setCategoria(e.target.value);
          }}
        >
          {opciones}
        </select>
        <div className="row">
          <div className="col-md-6">
            <Campo
              id="productoPrecio"
              etiqueta="Precio CLP"
              tipo="number"
              valor={precio}
              cambiar={setPrecio}
              min="1"
              step="1"
            />
          </div>
          <div className="col-md-6">
            <Campo
              id="productoStock"
              etiqueta="Stock"
              tipo="number"
              valor={stock}
              cambiar={setStock}
              min="0"
              step="1"
            />
          </div>
        </div>
        <Campo
          id="productoTonelaje"
          etiqueta="Tonelaje"
          valor={tonelaje}
          cambiar={setTonelaje}
        />
        <Campo
          id="productoTamano"
          etiqueta="Tamaño"
          valor={tamano}
          cambiar={setTamano}
        />
        <label htmlFor="descripcionProducto" className="form-label">
          Descripción
        </label>
        <textarea
          id="descripcionProducto"
          className="form-control mb-3"
          value={descripcion}
          rows="3"
          onChange={function (e) {
            setDescripcion(e.target.value);
          }}
        />
        <label htmlFor="imagenProducto" className="form-label">
          Imagen referencial
        </label>
        <select
          id="imagenProducto"
          className="form-select mb-3"
          value={imagen}
          onChange={function (e) {
            setImagen(e.target.value);
          }}
        >
          <option value="ascensores.jpg">Ascensor</option>
          <option value="camiones.jpg">Camión</option>
          <option value="herramientas.jpg">Herramientas</option>
          <option value="indumentaria.jpg">Indumentaria</option>
          <option value="obra.jpg">Obra</option>
        </select>
        <div className="form-check mb-3">
          <input
            id="productoOferta"
            className="form-check-input"
            type="checkbox"
            checked={oferta}
            onChange={function (e) {
              setOferta(e.target.checked);
            }}
          />
          <label htmlFor="productoOferta" className="form-check-label">
            En oferta
          </label>
        </div>
        {oferta && (
          <Campo
            id="precioAnterior"
            etiqueta="Precio anterior CLP"
            tipo="number"
            valor={anterior}
            cambiar={setAnterior}
            min="1"
            step="1"
          />
        )}
        <button className="btn btn-primary me-2" type="submit">
          Guardar producto
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={limpiar}
        >
          Cancelar / Nuevo
        </button>
      </form>
    </>
  );
}
