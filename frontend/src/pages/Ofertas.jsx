import ListaProductos from '../components/ListaProductos.jsx'

function Ofertas({ productos, onAgregar }) {
  const productosEnOferta = productos.filter(
    (producto) => producto.oferta === true
  )

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Ofertas INMAQUI</span>
          <h1>Oportunidades para tu próximo proyecto.</h1>
          <p>
            Descubre nuestros equipos y productos
            con precios especiales.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ListaProductos
            productos={productosEnOferta}
            onAgregar={onAgregar}
          />
        </div>
      </section>
    </main>
  )
}

export default Ofertas
