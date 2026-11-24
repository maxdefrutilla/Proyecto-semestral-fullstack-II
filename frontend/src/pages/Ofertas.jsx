import { useEffect, useState } from 'react'

import ListaProductos from '../components/ListaProductos.jsx'
import { listarProductos } from '../services/catalogoService.js'

function Ofertas({ productos: productosProp, onAgregar }) {
  const [locales, setLocales] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (productosProp) return
    let activo = true
    listarProductos()
      .then((respuesta) => { if (activo) setLocales(Array.isArray(respuesta) ? respuesta : []) })
      .catch((fallo) => {
        if (activo) setError(fallo?.message ?? 'No fue posible cargar las ofertas.')
      })
    return () => { activo = false }
  }, [productosProp])

  const productos = productosProp ?? locales
  const productosEnOferta = productos.filter(
    (producto) => producto.oferta === true || producto.enOferta === true
  )

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Ofertas INMAQUI</span>
          <h1>Oportunidades para tu próximo proyecto.</h1>
          <p>
            Descubre nuestros equipos y productos con precios especiales.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && (
            <p className="alert alert-danger" role="alert">{error}</p>
          )}
          <ListaProductos productos={productosEnOferta} onAgregar={onAgregar} />
        </div>
      </section>
    </main>
  )
}

export default Ofertas
