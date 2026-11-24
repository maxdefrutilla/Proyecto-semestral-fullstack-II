import { useState } from 'react'

import Campo from '../components/Campo.jsx'
import EditorDescripcion from '../components/EditorDescripcion.jsx'
import { sanitizarHtml } from '../utils/html.js'

function slug(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminCategorias(props) {
  const categorias = Array.isArray(props.categorias) ? props.categorias : []

  const [id, setId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descripcionHtml, setDescripcionHtml] = useState('')
  const [tipoAtributosTexto, setTipoAtributosTexto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [eliminar, setEliminar] = useState(null)
  const [guardando, setGuardando] = useState(false)

  function limpiar() {
    setId(null)
    setNombre('')
    setCodigo('')
    setDescripcionHtml('')
    setTipoAtributosTexto('')
  }

  function cargar(categoria) {
    setId(categoria.id)
    setNombre(categoria.nombre ?? '')
    setCodigo(categoria.codigo ?? '')
    setDescripcionHtml(categoria.descripcionHtml ?? '')
    setTipoAtributosTexto(
      JSON.stringify(categoria.tipoAtributos ?? [], null, 2)
    )
    setMensaje('')
  }

  async function guardar(evento) {
    evento.preventDefault()
    setMensaje('')

    if (nombre.trim().length < 2) {
      setMensaje('Escribe un nombre de al menos 2 caracteres.')
      return
    }

    const codigoNormalizado = slug(codigo || nombre)
    if (!codigoNormalizado) {
      setMensaje('El código de la categoría no es válido.')
      return
    }

    const conflicto = categorias.find(
      (categoria) =>
        String(categoria.id) !== String(id) &&
        (String(categoria.codigo) === codigoNormalizado ||
          String(categoria.nombre).toLowerCase() === nombre.trim().toLowerCase())
    )
    if (conflicto) {
      setMensaje('Ya existe una categoría con ese nombre o código.')
      return
    }

    let tipoAtributos = []
    if (tipoAtributosTexto.trim()) {
      try {
        const parseado = JSON.parse(tipoAtributosTexto)
        if (
          !Array.isArray(parseado) &&
          (!parseado || typeof parseado !== 'object')
        ) {
          throw new Error('Formato inválido')
        }
        tipoAtributos = parseado
      } catch {
        setMensaje('El JSON de atributos no es válido.')
        return
      }
    }

    const categoria = {
      nombre: nombre.trim(),
      codigo: codigoNormalizado,
      descripcionHtml: sanitizarHtml(descripcionHtml),
      tipoAtributos,
    }

    setGuardando(true)
    try {
      await props.guardar(categoria, id === null)
      limpiar()
      setMensaje('Categoría guardada.')
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible guardar la categoría.')
    } finally {
      setGuardando(false)
    }
  }

  async function borrar() {
    try {
      const respuesta = await props.eliminar(eliminar)
      setMensaje(respuesta || 'Categoría eliminada.')
      if (
        String(respuesta || '').includes('eliminada') &&
        String(id) === String(eliminar)
      ) {
        limpiar()
      }
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible dar de baja la categoría.')
    } finally {
      setEliminar(null)
    }
  }

  const filas = categorias.map((categoria) => (
    <tr key={categoria.id}>
      <td>
        {categoria.nombre}
        {categoria.activo === false && (
          <span className="badge bg-secondary ms-2">Inactiva</span>
        )}
        <br />
        <small className="text-muted">{categoria.codigo}</small>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm me-2"
          onClick={() => cargar(categoria)}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          disabled={categoria.activo === false}
          onClick={() => setEliminar(categoria.id)}
        >
          Dar de baja
        </button>
      </td>
    </tr>
  ))

  return (
    <>
      <h2>Categorías</h2>
      <p className="text-muted">
        La baja es lógica: los productos y el historial de pedidos se conservan.
      </p>

      {mensaje && (
        <p className="alert alert-info" role="status">{mensaje}</p>
      )}

      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>¿Dar de baja la categoría?</p>
          <button
            type="button"
            className="btn btn-danger btn-sm me-2"
            onClick={borrar}
          >
            Confirmar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setEliminar(null)}
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>

      <form className="form-surface" onSubmit={guardar} noValidate>
        <h3>{id === null ? 'Nueva categoría' : 'Editar categoría'}</h3>

        <Campo
          id="categoriaNombre"
          etiqueta="Nombre"
          valor={nombre}
          cambiar={setNombre}
        />
        <Campo
          id="categoriaCodigo"
          etiqueta="Código"
          requerido={false}
          valor={codigo}
          cambiar={setCodigo}
        />

        <label htmlFor="descripcionCategoria" className="form-label">
          Descripción con formato
        </label>
        <EditorDescripcion
          id="descripcionCategoria"
          valor={descripcionHtml}
          cambiar={setDescripcionHtml}
        />

        <label htmlFor="tipoAtributos" className="form-label">
          Tipos de atributos (JSON, opcional)
        </label>
        <textarea
          id="tipoAtributos"
          className="form-control mb-3"
          rows="6"
          value={tipoAtributosTexto}
          placeholder='[{"nombre":"tonelaje","etiqueta":"Tonelaje","tipo":"text","obligatorio":true}]'
          onChange={(evento) => setTipoAtributosTexto(evento.target.value)}
        />
        <p className="form-text">
          Define los campos dinámicos que aparecerán al crear productos de esta
          categoría.
        </p>

        <button
          className="btn btn-primary me-2"
          type="submit"
          disabled={guardando}
        >
          {guardando ? 'Guardando…' : 'Guardar categoría'}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={limpiar}
        >
          Cancelar
        </button>
      </form>
    </>
  )
}
