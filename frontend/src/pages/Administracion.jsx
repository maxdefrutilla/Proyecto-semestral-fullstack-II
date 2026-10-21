import { useState } from "react";
import { Link } from "react-router-dom";
import Encabezado from "../components/Encabezado";
import AdminProductos from "./AdminProductos";
import AdminCategorias from "./AdminCategorias";
import AdminUsuarios from "./AdminUsuarios";
import ResumenPedido from "../components/ResumenPedido";
import { dinero } from "../data/operaciones";

export default function Administracion(props) {
  const [vista, setVista] = useState("Resumen");
  const [pedidoId, setPedidoId] = useState(null);
  if (!props.usuario || props.usuario.rol !== "Administrador")
    return (
      <section className="section">
        <div className="container empty-state">
          <h1 className="fs-2">Acceso de administrador</h1>
          <p>
            Inicia sesión con una cuenta de administrador para ver el panel.
          </p>
          <Link className="btn btn-primary" to="/acceso">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  const menu = [];
  const secciones = [
    "Resumen",
    "Productos",
    "Categorías",
    "Usuarios",
    "Pedidos",
    "Reportes",
  ];
  for (let i = 0; i < secciones.length; i++) {
    const seccion = secciones[i];
    menu.push(
      <button
        key={seccion}
        className={"filter-option " + (vista === seccion ? "active" : "")}
        aria-pressed={vista === seccion}
        onClick={function () {
          setVista(seccion);
        }}
      >
        {seccion}
      </button>,
    );
  }
  let ventas = 0;
  let aprobadas = 0;
  let criticos = 0;
  for (let i = 0; i < props.productos.length; i++)
    if (props.productos[i].stock <= 5) criticos++;
  const filas = [];
  let seleccionado = null;
  for (let i = 0; i < props.pedidos.length; i++) {
    const pedido = props.pedidos[i];
    if (pedido.estado === "Aprobada") {
      ventas += pedido.total;
      aprobadas++;
    }
    if (pedido.id === pedidoId) seleccionado = pedido;
    filas.push(
      <tr key={pedido.id}>
        <td>#{pedido.id}</td>
        <td>{pedido.nombre}</td>
        <td>{pedido.estado}</td>
        <td>{dinero(pedido.total)}</td>
        <td>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={function () {
              setPedidoId(pedido.id);
            }}
          >
            Ver comprobante
          </button>
        </td>
      </tr>,
    );
  }
  return (
    <>
      <Encabezado
        seccion="Administración"
        titulo="INMAQUI en un vistazo."
        texto="Gestiona productos, categorías, usuarios y pedidos de INMAQUI."
      />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <aside className="col-lg-3">
              <div className="filter-panel">
                <span className="eyebrow">Administrador</span>
                {menu}
                <hr />
                <Link to="/perfil">Mi perfil</Link>
              </div>
            </aside>
            <div className="col-lg-9">
              {(vista === "Resumen" || vista === "Reportes") && (
                <>
                  <h2>
                    {vista === "Resumen"
                      ? "Resumen de la tienda"
                      : "Reporte de la tienda"}
                  </h2>
                  <div className="row g-3 my-3">
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Productos</p>
                        <strong className="fs-2">
                          {props.productos.length}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Ventas aprobadas</p>
                        <strong className="fs-2">{dinero(ventas)}</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Pedidos aprobados</p>
                        <strong className="fs-2">{aprobadas}</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Productos con stock crítico</p>
                        <strong className="fs-2">{criticos}</strong>
                      </div>
                    </div>
                  </div>
                  <p>
                    {props.usuarios.length} usuarios · {props.categorias.length}{" "}
                    categorías · {props.pedidos.length - aprobadas} intentos
                    rechazados
                  </p>
                </>
              )}
              {vista === "Productos" && (
                <AdminProductos
                  productos={props.productos}
                  categorias={props.categorias}
                  guardar={props.guardarProducto}
                  eliminar={props.eliminarProducto}
                />
              )}
              {vista === "Categorías" && (
                <AdminCategorias
                  categorias={props.categorias}
                  guardar={props.guardarCategoria}
                  eliminar={props.eliminarCategoria}
                />
              )}
              {vista === "Usuarios" && (
                <AdminUsuarios
                  usuarios={props.usuarios}
                  usuario={props.usuario}
                  pedidos={props.pedidos}
                  guardar={props.guardarUsuario}
                  eliminar={props.eliminarUsuario}
                />
              )}
              {vista === "Pedidos" && (
                <>
                  <h2>Pedidos y comprobantes</h2>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>N.º</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                          <th>Total</th>
                          <th>Detalle</th>
                        </tr>
                      </thead>
                      <tbody>{filas}</tbody>
                    </table>
                  </div>
                  {filas.length === 0 && (
                    <p>No hay pedidos todavía. Realiza una compra de prueba.</p>
                  )}
                  {seleccionado && <ResumenPedido pedido={seleccionado} />}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
