import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Encabezado from '../components/Encabezado.jsx'
import imagenes from '../data/imagenes.js'
import { listarArticulos, obtenerArticulo } from '../services/blogService.js'
import { sanitizarHtml } from '../utils/html.js'

export default function Blog() {
  const { slug } = useParams()
  return <ContenidoBlog key={slug ?? 'blog'} slug={slug} />
}

function ContenidoBlog({ slug }) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    const consulta = slug ? obtenerArticulo(slug) : listarArticulos()
    consulta.then((resultado) => {
      if (activo) setDatos(resultado)
    }).catch((fallo) => {
      if (activo) setError(fallo.message)
    })
    return () => { activo = false }
  }, [slug])

  return (
    <>
      <Encabezado seccion="Blog" titulo={datos?.titulo ?? 'Ideas para preparar tu próxima obra.'} />
      <section className="section">
        <div className={slug ? 'container lectura' : 'container'}>
          {error && <p role="alert">{error}</p>}
          {!datos && !error && <p role="status">Cargando artículos…</p>}
          {slug ? (
            <>
              {datos && <div dangerouslySetInnerHTML={{ __html: sanitizarHtml(datos.contenidoHtml) }} />}
              <Link to="/blog">Volver al blog</Link>
            </>
          ) : datos && (
            <div className="row g-4">
              {datos.map((articulo) => (
                <div key={articulo.id} className="col-md-6">
                  <article className="product-card">
                    {articulo.imagen && (
                      <img className="blog-image" src={imagenes[articulo.imagen] || imagenes.obra} alt="" />
                    )}
                    <div className="product-body">
                      <h2 className="fs-4">{articulo.titulo}</h2>
                      <p>{articulo.resumen}</p>
                      <Link to={`/blog/${articulo.slug}`}>Leer artículo</Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
