import { useEffect, useState } from 'react'
import Campo from '../components/Campo.jsx'
import EditorDescripcion from '../components/EditorDescripcion.jsx'
import imagenes from '../data/imagenes.js'
import { administrarArticulos, cambiarPublicacion, guardarArticulo } from '../services/blogService.js'
import { textoDeHtml } from '../utils/html.js'

const formularioNuevo = { slug: '', titulo: '', resumen: '', contenidoHtml: '', imagen: '' }

export default function AdminBlog() {
  const [articulos, setArticulos] = useState([])
  const [datos, setDatos] = useState(formularioNuevo)
  const [mensaje, setMensaje] = useState('')
  const [ocupado, setOcupado] = useState(false)

  useEffect(() => {
    let activo = true
    administrarArticulos().then((lista) => {
      if (activo) setArticulos(lista)
    }).catch((fallo) => {
      if (activo) setMensaje(fallo.message)
    })
    return () => { activo = false }
  }, [])

  function cambiar(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }))
  }

  async function ejecutar(operacion, confirmacion) {
    setOcupado(true)
    setMensaje('')
    try {
      const articulo = await operacion()
      setArticulos((lista) => lista.some((item) => item.id === articulo.id)
        ? lista.map((item) => item.id === articulo.id ? articulo : item)
        : [articulo, ...lista])
      setMensaje(confirmacion)
      return articulo
    } catch (fallo) {
      setMensaje(fallo.message)
    } finally {
      setOcupado(false)
    }
  }

  async function guardar(evento) {
    evento.preventDefault()
    if (!textoDeHtml(datos.contenidoHtml)) {
      setMensaje('Escribe el contenido del artículo.')
      return
    }
    const articulo = await ejecutar(() => guardarArticulo(datos), 'Artículo guardado.')
    if (articulo) setDatos(articulo)
  }

  return (
    <>
      <h2 className="h4">Artículos del blog</h2>
      {mensaje && <p className="alert alert-info" role="status">{mensaje}</p>}
      <div className="list-group mb-4">
        {articulos.map((articulo) => (
          <div key={articulo.id} className="list-group-item d-flex flex-wrap gap-2 align-items-center">
            <span className="me-auto">{articulo.titulo} · {articulo.publicado ? 'Publicado' : 'Borrador'}</span>
            <button type="button" className="btn btn-sm btn-outline-primary" disabled={ocupado} onClick={() => setDatos(articulo)}>
              Editar
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled={ocupado}
              onClick={() => ejecutar(() => cambiarPublicacion(articulo.id, !articulo.publicado), 'Publicación actualizada.')}>
              {articulo.publicado ? 'Retirar publicación' : 'Publicar'}
            </button>
          </div>
        ))}
      </div>
      <form className="form-surface" onSubmit={guardar}>
        <h3 className="h5">{datos.id ? 'Editar artículo' : 'Nuevo artículo'}</h3>
        <fieldset disabled={ocupado}>
          <Campo id="tituloBlog" etiqueta="Título" valor={datos.titulo} cambiar={(valor) => cambiar('titulo', valor)} maxLength={160} />
          <Campo id="slugBlog" etiqueta="Identificador para la URL" valor={datos.slug} cambiar={(valor) => cambiar('slug', valor)} maxLength={120} />
          <Campo id="resumenBlog" etiqueta="Resumen" valor={datos.resumen} cambiar={(valor) => cambiar('resumen', valor)} maxLength={400} />
          <label htmlFor="imagenBlog" className="form-label">Imagen</label>
          <select id="imagenBlog" className="form-select mb-3" value={datos.imagen ?? ''} onChange={(evento) => cambiar('imagen', evento.target.value)}>
            <option value="">Sin imagen</option>
            {Object.keys(imagenes).map((imagen) => <option key={imagen}>{imagen}</option>)}
          </select>
          <EditorDescripcion id="contenidoBlog" valor={datos.contenidoHtml} cambiar={(valor) => cambiar('contenidoHtml', valor)} />
          <button type="submit" className="btn btn-primary me-2">Guardar artículo</button>
          {datos.id && (
            <button type="button" className="btn btn-outline-secondary" onClick={() => setDatos(formularioNuevo)}>
              Nuevo artículo
            </button>
          )}
        </fieldset>
      </form>
    </>
  )
}
