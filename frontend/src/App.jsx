import { useCallback, useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Detalle from './pages/Detalle.jsx'
import Categorias from './pages/Categorias.jsx'
import Ofertas from './pages/Ofertas.jsx'
import Carrito from './pages/carrito.jsx'
import Checkout from './pages/Checkout.jsx'
import ResultadoCompra from './pages/ResultadoCompra.jsx'
import Acceso from './pages/Acceso.jsx'
import Perfil from './pages/Perfil.jsx'
import Administracion from './pages/Administracion.jsx'
import CalculadoraAndamios from './pages/CalculadoraAndamios.jsx'
import CalculadoraAscensores from './pages/CalculadoraAscensores.jsx'
import RecomendadorObra from './pages/RecomendadorObra.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Contacto from './pages/Contacto.jsx'
import Blog from './pages/Blog.jsx'
import Creditos from './pages/Creditos.jsx'

import { useAuth } from './context/useAuth.js'
import { listarCategorias, listarProductos } from './services/catalogoService.js'
import { crearPedido } from './services/ventasService.js'

// El carrito es la única información persistida localmente: solo id y cantidad.
// Productos, precios y stock se obtienen siempre desde el servidor.
const CLAVE_CARRITO = 'inmaqui.carrito'

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    const datos = guardado ? JSON.parse(guardado) : []
    if (!Array.isArray(datos)) return []

    const normalizados = datos
      .map((item) => {
        const productoId = item?.productoId ?? item?.id
        const cantidad = Number(item?.cantidad)
        if (!productoId || !Number.isInteger(cantidad) || cantidad < 1) return null
        return { productoId, cantidad: Math.min(cantidad, 99) }
      })
      .filter(Boolean)

    return normalizados.filter(
      (item, indice, lista) =>
        lista.findIndex(
          (otro) => String(otro.productoId) === String(item.productoId)
        ) === indice
    )
  } catch {
    return []
  }
}

function buscarProducto(productos, id) {
  return productos.find((producto) => String(producto.id) === String(id)) ?? null
}

function App() {
  const navigate = useNavigate()
  const { usuario, esAdmin, logout, inicializando: cargandoSesion } = useAuth()

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [errorCatalogo, setErrorCatalogo] = useState('')
  const [carrito, setCarrito] = useState(cargarCarrito)
  const [aviso, setAviso] = useState('')
  const [ultimoPedido, setUltimoPedido] = useState(null)

  const cargarCatalogo = useCallback(async () => {
    setCargandoCatalogo(true)
    try {
      const [listaProductos, listaCategorias] = await Promise.all([
        listarProductos(),
        listarCategorias(),
      ])
      setProductos(Array.isArray(listaProductos) ? listaProductos : [])
      setCategorias(Array.isArray(listaCategorias) ? listaCategorias : [])
      setErrorCatalogo('')
    } catch (fallo) {
      setErrorCatalogo(fallo?.message ?? 'No fue posible cargar el catálogo.')
    } finally {
      setCargandoCatalogo(false)
    }
  }, [])

  useEffect(() => {
    let activo = true
    Promise.resolve().then(() => {
      if (activo) cargarCatalogo()
    })
    return () => { activo = false }
  }, [cargarCatalogo])

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch {
      // Si localStorage falla, el carrito sigue disponible en memoria.
    }
  }, [carrito])

  function agregarProducto(productoId, cantidad = 1) {
    const producto = buscarProducto(productos, productoId)
    const cantidadSolicitada = Number(cantidad)

    if (!producto || producto.activo === false) {
      setAviso('El producto ya no está disponible en el catálogo.')
      return
    }
    if (!Number.isInteger(cantidadSolicitada) || cantidadSolicitada < 1) {
      setAviso('Cantidad inválida.')
      return
    }

    const existente = carrito.find(
      (item) => String(item.productoId) === String(productoId)
    )
    const total = (existente?.cantidad ?? 0) + cantidadSolicitada

    if (total > producto.stock || total > 99) {
      setAviso('No puedes superar el stock disponible ni 99 unidades.')
      return
    }

    setCarrito((anterior) => {
      const encontrado = anterior.some(
        (item) => String(item.productoId) === String(productoId)
      )
      if (encontrado) {
        return anterior.map((item) =>
          String(item.productoId) === String(productoId)
            ? { ...item, cantidad: item.cantidad + cantidadSolicitada }
            : item
        )
      }
      return [...anterior, { productoId: producto.id, cantidad: cantidadSolicitada }]
    })
    setAviso(`${producto.nombre} agregado al carrito.`)
  }

  function cambiarCantidad(productoId, cantidad) {
    const producto = buscarProducto(productos, productoId)
    const nuevaCantidad = Number(cantidad)

    if (
      !producto ||
      !Number.isInteger(nuevaCantidad) ||
      nuevaCantidad < 1 ||
      nuevaCantidad > producto.stock ||
      nuevaCantidad > 99
    ) {
      setAviso('Cantidad inválida o superior al stock.')
      return
    }
    setCarrito((anterior) =>
      anterior.map((item) =>
        String(item.productoId) === String(productoId)
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    )
    setAviso('')
  }

  function eliminarProducto(productoId) {
    setCarrito((anterior) =>
      anterior.filter(
        (item) => String(item.productoId) !== String(productoId)
      )
    )
  }

  function vaciarCarrito() {
    setCarrito([])
    setAviso('')
  }

  async function comprar(datos) {
    if (carrito.length === 0) {
      throw new Error('El carrito está vacío.')
    }

    const items = carrito.map(({ productoId, cantidad }) => ({
      productoId,
      cantidad,
    }))

    const pedido = await crearPedido(
      { ...datos, items },
      { auth: Boolean(usuario) }
    )

    setUltimoPedido(pedido)
    if (pedido.estado === 'CONFIRMADO') {
      vaciarCarrito()
      cargarCatalogo()
    }
    navigate('/resultado-compra')
    return pedido
  }

  async function cerrarSesion() {
    try {
      await logout()
      setUltimoPedido(null)
      navigate('/')
    } catch (fallo) {
      setAviso(fallo.message)
    }
  }

  const unidades = carrito.reduce((total, item) => total + item.cantidad, 0)
  const idAndamio = productos.find(
    (producto) => producto.categoria === 'andamios'
  )?.id

  return (
    <>
      <Header />

      <div className="container d-flex justify-content-end gap-2 py-2">
        {usuario ? (
          <>
            <Link to="/perfil" className="btn btn-outline-secondary btn-sm">
              Mi perfil
            </Link>
            {esAdmin && (
              <Link
                to="/administracion"
                className="btn btn-outline-primary btn-sm"
              >
                Administración
              </Link>
            )}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/acceso" className="btn btn-outline-secondary btn-sm">
            Iniciar sesión
          </Link>
        )}

        <Link to="/carrito" className="btn btn-outline-primary btn-sm">
          Carrito ({unidades})
        </Link>
      </div>

      {aviso && (
        <div className="container mt-2">
          <div className="alert alert-info alert-dismissible" role="status">
            {aviso}
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar aviso"
              onClick={() => setAviso('')}
            />
          </div>
        </div>
      )}

      {cargandoCatalogo && (
        <div className="container mt-2">
          <p className="alert alert-info" role="status">Cargando catálogo…</p>
        </div>
      )}

      {errorCatalogo && (
        <div className="container mt-2">
          <p className="alert alert-danger" role="alert">{errorCatalogo}</p>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<Inicio productos={productos} categoriasDisponibles={categorias} onAgregar={agregarProducto} />}
        />
        <Route
          path="/catalogo"
          element={
            <Catalogo
              productos={productos}
              categorias={categorias}
              onAgregar={agregarProducto}
            />
          }
        />
        <Route
          path="/producto/:id"
          element={
            <Detalle productos={productos} onAgregar={agregarProducto} />
          }
        />
        <Route
          path="/categoria/:id"
          element={
            <Catalogo
              productos={productos}
              categorias={categorias}
              onAgregar={agregarProducto}
            />
          }
        />
        <Route
          path="/categorias"
          element={<Categorias categorias={categorias} />}
        />
        <Route
          path="/ofertas"
          element={<Ofertas productos={productos} onAgregar={agregarProducto} />}
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              productos={productos}
              onCambiarCantidad={cambiarCantidad}
              onEliminar={eliminarProducto}
              onVaciar={vaciarCarrito}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            cargandoSesion ? null : <Checkout
              key={usuario?.id ?? 'invitado'}
              carrito={carrito}
              productos={productos}
              usuario={usuario}
              onComprar={comprar}
            />
          }
        />
        <Route
          path="/resultado-compra"
          element={<ResultadoCompra pedido={ultimoPedido} />}
        />
        <Route
          path="/compra-aprobada"
          element={<ResultadoCompra pedido={ultimoPedido} estado="CONFIRMADO" />}
        />
        <Route
          path="/compra-rechazada"
          element={<ResultadoCompra pedido={ultimoPedido} estado="RECHAZADO" />}
        />

        <Route
          path="/recomendador-obra"
          element={<RecomendadorObra productos={productos} onAgregar={agregarProducto} />}
        />
        <Route
          path="/calculadora/andamios"
          element={
            <CalculadoraAndamios
              productoId={idAndamio}
              onAgregar={agregarProducto}
            />
          }
        />
        <Route
          path="/calculadora/ascensores"
          element={<CalculadoraAscensores onAgregar={agregarProducto} />}
        />

        <Route path="/acceso" element={cargandoSesion ? null : <Acceso />} />
        <Route path="/perfil" element={cargandoSesion ? null : <Perfil />} />
        <Route
          path="/administracion"
          element={cargandoSesion ? null : <Administracion usuario={usuario} onCatalogoCambio={cargarCatalogo} />}
        />

        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/creditos" element={<Creditos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />

        <Route
          path="*"
          element={
            <main className="container py-5 text-center">
              <h1>Página no encontrada</h1>
              <p>La dirección que buscas no existe en INMAQUI.</p>
              <Link to="/" className="btn btn-primary">
                Volver al inicio
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
