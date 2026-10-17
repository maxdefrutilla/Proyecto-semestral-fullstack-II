
import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

import Header from './components/Header.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Detalle from './pages/Detalle.jsx'
import Carrito from './pages/Carrito.jsx'

import productos from './data/productos.json'

const CLAVE_CARRITO = 'inmaqui.carrito'

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
          element={<Inicio onAgregar={agregarProducto} />}
        />

        <Route
          path="/catalogo"
          element={<Catalogo onAgregar={agregarProducto} />}
        />

        <Route
          path="/producto/:id"
          element={<Detalle onAgregar={agregarProducto} />}
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
      </Routes>
    </>
  )
}

export default App

