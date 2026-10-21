import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import Checkout from './pages/Checkout.jsx'
import ResultadoCompra from './pages/ResultadoCompra.jsx'
import Header from './components/Header.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Detalle from './pages/Detalle.jsx'
import Carrito from './pages/Carrito.jsx'

import Nosotros from './pages/Nosotros.jsx'
import Contacto from './pages/Contacto.jsx'
import Arriendos from './pages/Arriendos.jsx'
import Blog from './pages/Blog.jsx'
import Creditos from './pages/Creditos.jsx'
import Footer from './components/Footer.jsx'

import usuariosIniciales from './data/usuarios.json'
import Acceso from './pages/Acceso.jsx'
import Perfil from './pages/Perfil.jsx'

import Ofertas from './pages/Ofertas.jsx'


import Categorias from './pages/Categorias.jsx'
import Administracion from './pages/Administracion.jsx'

import productosIniciales from './data/productos.json'
import categoriasIniciales from './data/categorias.json'
//carrito
const CLAVE_CARRITO = 'inmaqui.carrito'
//productos y pedidos
const CLAVE_PRODUCTOS = 'inmaqui.productos'
const CLAVE_CATEGORIAS = 'inmaqui.categorias'
const CLAVE_PEDIDOS = 'inmaqui.pedidos'
//usuarios y sesion
const CLAVE_USUARIOS = 'inmaqui.usuarios'
const CLAVE_SESION = 'inmaqui.sesion'


function cargarUsuarios() {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS)
    if (!guardados) return usuariosIniciales

    const datos = JSON.parse(guardados)
    return Array.isArray(datos) ? datos : usuariosIniciales
  } catch {
    return usuariosIniciales
  }
}

function cargarSesion() {
  try {
    const id = JSON.parse(
      sessionStorage.getItem(CLAVE_SESION)
    )

    const usuarios = cargarUsuarios()

    return usuarios.find((u) => u.id === id)?.id ?? null
  } catch {
    return null
  }
}

function cargarProductos() {
  try {
    const guardados = localStorage.getItem(CLAVE_PRODUCTOS)

    if (!guardados) return productosIniciales

    const datos = JSON.parse(guardados)

    return Array.isArray(datos) ? datos : productosIniciales
  } catch {
    return productosIniciales
  }
}

function cargarPedidos() {
  try {
    const guardados = localStorage.getItem(CLAVE_PEDIDOS)

    if (!guardados) return []

    const datos = JSON.parse(guardados)

    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function cargarCategorias() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CATEGORIAS))
    return Array.isArray(datos) ? datos : categoriasIniciales
  } catch {
    return categoriasIniciales
  }
}

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    if (!guardado) return []

    const datos = JSON.parse(guardado)
    if (!Array.isArray(datos)) return []

    return datos.flatMap((item) => {
      const producto = cargarProductos().find(
        (p) => p.id === item?.id
      )

      if (!producto) return []

      const cantidad = Number(item.cantidad)

      if (!Number.isInteger(cantidad) || cantidad < 1) {
        return []
      }

      const cantidadValida = Math.min(
        cantidad,
        producto.stock,
        99
      )

      return cantidadValida > 0
        ? [{ id: producto.id, cantidad: cantidadValida }]
        : []
    }).filter(
      (item, indice, lista) =>
        lista.findIndex((otro) => otro.id === item.id) === indice
    )
  } catch {
    return []
  }
}

function App() {
  const [carrito, setCarrito] = useState(cargarCarrito)
  const [aviso, setAviso] = useState('')
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState(cargarUsuarios)
  const [usuarioId, setUsuarioId] = useState(cargarSesion)
  const usuario = usuarios.find(
    (cuenta) => cuenta.id === usuarioId
  ) ?? null

const [productos, setProductos] = useState(cargarProductos)
const [pedidos, setPedidos] = useState(cargarPedidos)
const [ultimoPedido, setUltimoPedido] = useState(() => {
  const guardados = cargarPedidos()
  return guardados.at(-1) ?? null
})

const [categorias, setCategorias] = useState(cargarCategorias)


useEffect(() => {
  localStorage.setItem(
    CLAVE_USUARIOS,
    JSON.stringify(usuarios)
  )
}, [usuarios])

useEffect(() => {
  if (usuarioId === null) {
    sessionStorage.removeItem(CLAVE_SESION)
  } else {
    sessionStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(usuarioId)
    )
  }
}, [usuarioId])

  // Guardar el carrito cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
      )
    } catch {
      // Si falla localStorage, el carrito sigue en memoria
    }
  }, [carrito])

  useEffect(() => {
  try {
    localStorage.setItem(
      CLAVE_PRODUCTOS,
      JSON.stringify(productos)
    )
  } catch {
    console.error('No fue posible guardar los productos')
  }
}, [productos])

useEffect(() => {
  try {
    localStorage.setItem(
      CLAVE_PEDIDOS,
      JSON.stringify(pedidos)
    )
  } catch {
    console.error('No fue posible guardar los pedidos')
  }
}, [pedidos])

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categorias))
    } catch {
      console.error('No fue posible guardar las categorías')
    }
  }, [categorias])

  function guardarProducto(producto, esNuevo) {
    setProductos(prev => esNuevo
      ? [...prev, producto]
      : prev.map(p => p.id === producto.id ? producto : p))
    setCarrito(prev => prev.map(item => {
      if (item.id !== producto.id) return item
      return { ...item, cantidad: Math.min(item.cantidad, producto.stock, 99) }
    }).filter(item => item.cantidad > 0))
  }

  function eliminarProductoAdmin(id) {
    setProductos(prev => prev.filter(p => p.id !== id))
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  function guardarCategoria(categoria, esNueva) {
    setCategorias(prev => esNueva
      ? [...prev, categoria]
      : prev.map(c => c.id === categoria.id ? categoria : c))
  }

  function eliminarCategoria(id) {
    const categoria = categorias.find(c => c.id === id)
    if (!categoria) return 'Categoría no encontrada.'
    if (productos.some(p => p.categoria === categoria.codigo)) {
      return 'No se puede eliminar una categoría con productos asociados.'
    }
    setCategorias(prev => prev.filter(c => c.id !== id))
    return 'Categoría eliminada.'
  }

  function guardarUsuarioAdmin(cuenta, esNuevo) {
    setUsuarios(prev => esNuevo
      ? [...prev, cuenta]
      : prev.map(u => u.id === cuenta.id ? cuenta : u))
  }

  function eliminarUsuarioAdmin(id) {
    if (usuarioId === id) return 'No puedes eliminar tu propia cuenta activa.'
    setUsuarios(prev => prev.filter(u => u.id !== id))
    return 'Usuario eliminado.'
  }

  function agregarProducto(id, cantidad = 1) {
    const producto = productos.find((p) => p.id === id)

    if (!producto || !Number.isInteger(cantidad) || cantidad < 1) {
      setAviso('Producto o cantidad inválida.')
      return
    }

    const existente = carrito.find((item) => item.id === id)
    const total = (existente?.cantidad || 0) + cantidad

    if (total > producto.stock || total > 99) {
      setAviso('No puedes superar el stock disponible ni 99 unidades.')
      return
    }

    setCarrito((anterior) => {
      const encontrado = anterior.some((item) => item.id === id)

      if (encontrado) {
        return anterior.map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }

      return [...anterior, { id, cantidad }]
    })

    setAviso(`${producto.nombre} agregado al carrito.`)
  }

  function cambiarCantidad(id, cantidad) {
    const producto = productos.find((p) => p.id === id)
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
        item.id === id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    )

    setAviso('')
  }

  function eliminarProducto(id) {
    setCarrito((anterior) =>
      anterior.filter((item) => item.id !== id)
    )
  }

  function vaciarCarrito() {
    setCarrito([])
    setAviso('')
  }

  const unidades = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  
function comprar(datos) {
  if (carrito.length === 0) {
    return 'El carrito está vacío.'
  }

  const items = []

  for (const item of carrito) {
    const producto = productos.find((p) => p.id === item.id)

    if (!producto) {
      return 'Uno de los productos ya no existe.'
    }

    if (
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      item.cantidad > producto.stock
    ) {
      return `Stock insuficiente para ${producto.nombre}.`
    }

    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: item.cantidad
    })
  }

  const subtotal = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  )

  const pedido = {
    id: `PED-${Date.now()}`,
    fecha: new Date().toISOString(),
    ...datos,
    usuarioId: usuario?.id ?? null,
    items,
    subtotal,
    total: subtotal + datos.despacho
  }

  setUltimoPedido(pedido)
  setPedidos((anteriores) => [...anteriores, pedido])

  if (datos.estado === 'Aprobada') {
    setProductos((anteriores) =>
      anteriores.map((producto) => {
        const comprado = items.find(
          (item) => item.id === producto.id
        )

        if (!comprado) return producto

        return {
          ...producto,
          stock: producto.stock - comprado.cantidad
        }
      })
    )

    vaciarCarrito()
    navigate('/compra-aprobada')
  } else {
    navigate('/compra-rechazada')
  }

  return ''
}


function registrarUsuario(nuevoUsuario) {
  setUsuarios((anteriores) => [
    ...anteriores,
    nuevoUsuario
  ])
}

function ingresar(usuarioSeleccionado) {
  setUsuarioId(usuarioSeleccionado.id)
}

function salir() {
  setUsuarioId(null)
}

function guardarPerfil(datosActualizados) {
  setUsuarios((anteriores) =>
    anteriores.map((cuenta) =>
      cuenta.id === datosActualizados.id
        ? { ...cuenta, ...datosActualizados }
        : cuenta
    )
  )
}



  return (
    <>
      <Header />

      
<div className="container d-flex justify-content-end gap-2 py-2">
  {usuario ? (
    <>
    {/* Acceso temporal de usuarios */}
      <Link to="/perfil" className="btn btn-outline-secondary btn-sm">
        Mi perfil
      </Link>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={salir}
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

      <Routes>
        <Route
          path="/"
          element={ 
          <Inicio
            productos={productos}
            onAgregar={agregarProducto}
          />}
        />

        <Route
          path="/catalogo"
          element={
          <Catalogo
            productos={productos}
            categorias={categorias}
            onAgregar={agregarProducto}
          />}
        />

        <Route
          path="/producto/:id"
          element={  
          <Detalle
            productos={productos}
            onAgregar={agregarProducto}
          />}
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
              <Checkout
                carrito={carrito}
                productos={productos}
                onComprar={comprar}
              />
            }
          />

        <Route
            path="/compra-aprobada"
            element={
              <ResultadoCompra
                pedido={ultimoPedido}
                estado="Aprobada"
              />
            }
          />

        <Route
            path="/compra-rechazada"
            element={
              <ResultadoCompra
                pedido={ultimoPedido}
                estado="Rechazada"
          />
            }
          />
          
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/arriendos" element={<Arriendos />} />
        <Route path="/creditos" element={<Creditos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/elegir-equipo" element={<Blog articulo={1} />} />
        <Route path="/blog/planificar-arriendo" element={<Blog articulo={2} />} />

        
        <Route
          path="/acceso"
          element={
            <Acceso
              usuarios={usuarios}
              usuario={usuario}
              registrar={registrarUsuario}
              ingresar={ingresar}
              salir={salir}
            />
          }
        />

        <Route
          path="/perfil"
          element={
            <Perfil
              usuario={usuario}
              pedidos={pedidos}
              guardar={guardarPerfil}
            />
          }
        />
       <Route
        path="/categorias"
        element={<Categorias categorias={categorias} />}
      />

        <Route
          path="/ofertas"
          element={
            <Ofertas
              productos={productos}
              onAgregar={agregarProducto}
            />
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
          path="/administracion"
          element={
            <Administracion
              usuario={usuario}
              productos={productos}
              categorias={categorias}
              usuarios={usuarios}
              pedidos={pedidos}
              guardarProducto={guardarProducto}
              eliminarProducto={eliminarProductoAdmin}
              guardarCategoria={guardarCategoria}
              eliminarCategoria={eliminarCategoria}
              guardarUsuario={guardarUsuarioAdmin}
              eliminarUsuario={eliminarUsuarioAdmin}
            />
          }
        />
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

