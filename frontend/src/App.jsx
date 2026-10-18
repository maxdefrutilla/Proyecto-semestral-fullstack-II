import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Checkout from './pages/Checkout.jsx'
import ResultadoCompra from './pages/ResultadoCompra.jsx'
import Header from './components/Header.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Detalle from './pages/Detalle.jsx'
import Carrito from './pages/Carrito.jsx'

import productosIniciales from './data/productos.json'

const CLAVE_CARRITO = 'inmaqui.carrito'

const CLAVE_PRODUCTOS = 'inmaqui.productos'
const CLAVE_PEDIDOS = 'inmaqui.pedidos'

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

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    if (!guardado) return []

    const datos = JSON.parse(guardado)
    if (!Array.isArray(datos)) return []

    return datos.flatMap((item) => {
      const producto = productos.find(
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

const [productos, setProductos] = useState(cargarProductos)
const [pedidos, setPedidos] = useState(cargarPedidos)
const [ultimoPedido, setUltimoPedido] = useState(() => {
  const guardados = cargarPedidos()
  return guardados.at(-1) ?? null
})

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


  return (
    <>
      <Header />

      {/* Acceso temporal al carrito */}
      <div className="container d-flex justify-content-end py-2">
        <Link className="btn btn-outline-primary btn-sm" to="/carrito">
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
      </Routes>
    </>
  )
}

export default App

