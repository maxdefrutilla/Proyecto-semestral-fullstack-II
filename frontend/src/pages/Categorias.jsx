import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Encabezado from '../components/Encabezado.jsx'
import imagenes from '../data/imagenes.js'
import { listarCategorias } from '../services/catalogoService.js'
import { sanitizarHtml } from '../utils/html.js'

export default function Categorias({ categorias: categoriasProp }) {
  const [categoriasLocales, setCategoriasLocales] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (categoriasProp) return
    let activo = true
    listarCategorias()
      .then((respuesta) => {
        if (activo) setCategoriasLocales(Array.isArray(respuesta) ? respuesta : [])
      })
      .catch((fallo) => {
        if (activo) setError(fallo?.message ?? 'No fue posible cargar las categorías.')
      })
    return () => { activo = false }
  }, [categoriasProp])

  const categorias = categoriasProp ?? categoriasLocales

  return (
    <>
      <Encabezado
        seccion="Categorías"
        titulo="El equipo correcto para cada tarea."
      />
      <section className="section">
        <div className="container">
          {error && (
            <p className="alert alert-danger" role="alert">{error}</p>
          )}
          <div className="row g-4">
            {categorias.map((categoria) => (
              <div className="col-sm-6 col-lg-3" key={categoria.id}>
                <Link to={'/categoria/' + categoria.id} className="category-tile">
                  <img
                    src={imagenes[categoria.codigo] || imagenes.obra}
                    alt={categoria.nombre}
                  />
                  <div className="category-caption">
                    <h3>{categoria.nombre}</h3>
                    {categoria.descripcionHtml && (
                      <div
                        className="small"
                        dangerouslySetInnerHTML={{
                          __html: sanitizarHtml(categoria.descripcionHtml),
                        }}
                      />
                    )}
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
