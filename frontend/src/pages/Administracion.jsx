import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Encabezado from '../components/Encabezado.jsx'
import AdminProductos from './AdminProductos.jsx'
import AdminCategorias from './AdminCategorias.jsx'
import AdminUsuarios from './AdminUsuarios.jsx'
import AdminBlog from './AdminBlog.jsx'
import ResumenPedido from '../components/ResumenPedido.jsx'
import { dinero } from '../data/operaciones.js'
import {
  actualizarCategoria,
  actualizarProducto,
  actualizarUsuarioAdministrativo,
  crearCategoria,
  crearProducto,
  cambiarRolUsuario,
  desactivarCategoria,
  desactivarProducto,
  cambiarEstadoUsuario,
  listarCategorias,
  listarProductos,
  listarUsuarios,
} from '../services/catalogoService.js'
import { listarPedidos } from '../services/ventasService.js'

function esAdministrador(usuario) {
  const rol = String(usuario?.rol ?? '').toUpperCase()
  return rol === 'ADMINISTRADOR' || rol === 'ADMIN'
}

export default function Administracion(props) {
  const [vista, setVista] = useState('Resumen')
  const [pedidoId, setPedidoId] = useState(null)
  const [productosLocales, setProductosLocales] = useState([])
  const [categoriasLocales, setCategoriasLocales] = useState([])
  const [usuariosLocales, setUsuariosLocales] = useState([])
  const [pedidosLocales, setPedidosLocales] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const autorizado = esAdministrador(props.usuario)

  const recargar = useCallback(async () => {
    if (!autorizado) return
    setCargando(true)
    try {
      const [productos, categorias, usuarios, pedidos] = await Promise.all([
        listarProductos({ incluirInactivos: true, auth: true }),
        listarCategorias({ incluirInactivas: true, auth: true }),
        listarUsuarios(),
        listarPedidos(),
      ])
      setProductosLocales(Array.isArray(productos) ? productos : [])
      setCategoriasLocales(Array.isArray(categorias) ? categorias : [])
      setUsuariosLocales(Array.isArray(usuarios) ? usuarios : [])
      setPedidosLocales(Array.isArray(pedidos) ? pedidos : [])
      setError('')
    } catch (fallo) {
      setError(fallo?.message ?? 'No fue posible cargar los datos de administración.')
    } finally {
      setCargando(false)
    }
  }, [autorizado])

  useEffect(() => {
    let activo = true
    Promise.resolve().then(() => {
      if (activo) recargar()
    })
    return () => { activo = false }
  }, [recargar])

  if (!autorizado) {
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
    )
  }

  const productos = props.productos ?? productosLocales
  const categorias = props.categorias ?? categoriasLocales
  const usuarios = props.usuarios ?? usuariosLocales
  const pedidos = props.pedidos ?? pedidosLocales

  async function guardarProducto(producto, esNuevo) {
    const respuesta = esNuevo
      ? await crearProducto(producto)
      : await actualizarProducto(producto.id, producto)
    await recargar()
    await props.onCatalogoCambio?.()
    return respuesta
  }

  async function eliminarProducto(id) {
    await desactivarProducto(id)
    await recargar()
    await props.onCatalogoCambio?.()
    return 'Producto dado de baja.'
  }

  async function guardarCategoria(categoria, esNueva) {
    const respuesta = esNueva
      ? await crearCategoria(categoria)
      : await actualizarCategoria(categoria.id, categoria)
    await recargar()
    await props.onCatalogoCambio?.()
    return respuesta
  }

  async function eliminarCategoria(id) {
    await desactivarCategoria(id)
    await recargar()
    await props.onCatalogoCambio?.()
    return 'Categoría eliminada.'
  }

  async function guardarUsuario({ id, rol, clave, nombre, apellidos, correo, direccion, comuna, telefono }) {
    await actualizarUsuarioAdministrativo(id, { nombre, apellidos, correo, direccion, comuna, telefono, password: clave })
    const anterior = usuarios.find((cuenta) => cuenta.id === id)
    if (anterior?.rol !== rol) await cambiarRolUsuario(id, rol)
    await recargar()
  }

  async function eliminarUsuario(id) {
    await cambiarEstadoUsuario(id, false)
    await recargar()
    return 'Usuario dado de baja.'
  }

  async function reactivarUsuario(id) {
    await cambiarEstadoUsuario(id, true)
    await recargar()
  }

  const secciones = [
    'Resumen',
    'Productos',
    'Categorías',
    'Usuarios',
    'Pedidos',
    'Reportes',
    'Blog',
  ]
  const menu = secciones.map((seccion) => (
    <button
      key={seccion}
      type="button"
      className={'filter-option ' + (vista === seccion ? 'active' : '')}
      aria-pressed={vista === seccion}
      onClick={() => setVista(seccion)}
    >
      {seccion}
    </button>
  ))

  let ventas = 0
  let confirmados = 0
  const criticos = productos.filter((producto) => producto.stock <= 5).length

  const filas = []
  let seleccionado = null
  pedidos.forEach((pedido) => {
    const id = pedido.pedidoId ?? pedido.id
    if (pedido.estado === 'CONFIRMADO') {
      ventas += Number(pedido.total ?? 0)
      confirmados++
    }
    if (String(id) === String(pedidoId)) seleccionado = pedido
    filas.push(
      <tr key={id}>
        <td>#{id}</td>
        <td>{pedido.comprador?.nombre ?? pedido.nombre}</td>
        <td>{pedido.estado}</td>
        <td>{dinero(pedido.total)}</td>
        <td>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setPedidoId(id)}
          >
            Ver comprobante
          </button>
        </td>
      </tr>
    )
  })

  return (
    <>
      <Encabezado
        seccion="Administración"
        titulo="INMAQUI en un vistazo."
        texto="Gestiona productos, categorías, usuarios y pedidos de INMAQUI."
      />
      <section className="section">
        <div className="container">
          {cargando && (
            <p className="alert alert-info" role="status">
              Cargando datos de administración…
            </p>
          )}
          {error && (
            <p className="alert alert-danger" role="alert">{error}</p>
          )}

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
              {vista === 'Blog' && <AdminBlog />}
              {(vista === 'Resumen' || vista === 'Reportes') && (
                <>
                  <h2>
                    {vista === 'Resumen'
                      ? 'Resumen de la tienda'
                      : 'Reporte de la tienda'}
                  </h2>
                  <div className="row g-3 my-3">
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Productos</p>
                        <strong className="fs-2">{productos.length}</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Ventas confirmadas</p>
                        <strong className="fs-2">{dinero(ventas)}</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="value-card">
                        <p>Pedidos confirmados</p>
                        <strong className="fs-2">{confirmados}</strong>
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
                    {usuarios.length} usuarios · {categorias.length} categorías ·{' '}
                    {pedidos.length - confirmados} intentos rechazados
                  </p>
                </>
              )}

              {vista === 'Productos' && (
                <AdminProductos
                  productos={productos}
                  categorias={categorias}
                  guardar={guardarProducto}
                  eliminar={eliminarProducto}
                />
              )}

              {vista === 'Categorías' && (
                <AdminCategorias
                  categorias={categorias}
                  guardar={guardarCategoria}
                  eliminar={eliminarCategoria}
                />
              )}

              {vista === 'Usuarios' && (
                <AdminUsuarios
                  usuarios={usuarios}
                  usuario={props.usuario}
                  pedidos={pedidos}
                  guardar={guardarUsuario}
                  eliminar={eliminarUsuario}
                  reactivar={reactivarUsuario}
                />
              )}

              {vista === 'Pedidos' && (
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
  )
}
