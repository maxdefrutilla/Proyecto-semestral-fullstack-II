import { useState } from 'react'

import Campo from '../components/Campo.jsx'
import EditorDescripcion from '../components/EditorDescripcion.jsx'
import { dinero } from '../data/operaciones.js'
import { sanitizarHtml, textoDeHtml } from '../utils/html.js'

function etiquetaDe(nombre) {
  return String(nombre ?? '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letra) => letra.toUpperCase())
}

function camposDe(tipoAtributos) {
  if (Array.isArray(tipoAtributos)) {
    return tipoAtributos
      .map((campo) => ({
        nombre: String(campo?.nombre ?? '').trim(),
        etiqueta: campo?.etiqueta ?? etiquetaDe(campo?.nombre),
        tipo: campo?.tipo ?? 'text',
        obligatorio: Boolean(campo?.obligatorio),
        unidad: campo?.unidad ?? '',
      }))
      .filter((campo) => campo.nombre)
  }
  if (tipoAtributos && typeof tipoAtributos === 'object') {
    return Object.entries(tipoAtributos).map(([nombre, definicion]) => ({
      nombre,
      etiqueta:
        typeof definicion === 'object'
          ? (definicion?.etiqueta ?? etiquetaDe(nombre))
          : etiquetaDe(nombre),
      tipo:
        typeof definicion === 'object' ? (definicion?.tipo ?? 'text') : 'text',
      obligatorio:
        typeof definicion === 'object' ? Boolean(definicion?.obligatorio) : false,
      unidad: typeof definicion === 'object' ? (definicion?.unidad ?? '') : '',
    }))
  }
  return []
}

export default function AdminProductos(props) {
  const productos = Array.isArray(props.productos) ? props.productos : []
  const categorias = Array.isArray(props.categorias) ? props.categorias : []
  const categoriaInicial = categorias[0]?.codigo ?? ''

  const [editando, setEditando] = useState(null)
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState(categoriaInicial)
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [descripcionHtml, setDescripcionHtml] = useState('')
  const [atributos, setAtributos] = useState({})
  const [imagen, setImagen] = useState('ascensores.jpg')
  const [etiqueta, setEtiqueta] = useState('')
  const [oferta, setOferta] = useState(false)
  const [anterior, setAnterior] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [eliminar, setEliminar] = useState(null)
  const [soloCriticos, setSoloCriticos] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [guardando, setGuardando] = useState(false)

  const categoriaSeleccionada = categorias.find(
    (item) => item.codigo === categoria
  )
  const campos = camposDe(categoriaSeleccionada?.tipoAtributos)

  function limpiar() {
    setEditando(null)
    setNombre('')
    setCategoria(categoriaInicial)
    setPrecio('')
    setStock('')
    setDescripcionHtml('')
    setAtributos({})
    setImagen('ascensores.jpg')
    setEtiqueta('')
    setOferta(false)
    setAnterior('')
  }

  function cargar(producto) {
    setEditando(producto.id)
    setNombre(producto.nombre ?? '')
    setCategoria(producto.categoria ?? categoriaInicial)
    setPrecio(String(producto.precio ?? ''))
    setStock(String(producto.stock ?? ''))
    setDescripcionHtml(producto.descripcionHtml ?? '')
    const atributosCargados = {
      ...(producto.atributos && typeof producto.atributos === 'object'
        ? producto.atributos
        : {}),
    }
    if (producto.tonelaje && !atributosCargados.tonelaje) {
      atributosCargados.tonelaje = producto.tonelaje
    }
    if (producto.tamano && !atributosCargados.tamano) {
      atributosCargados.tamano = producto.tamano
    }
    setAtributos(atributosCargados)
    setImagen(producto.imagen ?? 'ascensores.jpg')
    setEtiqueta(producto.etiqueta ?? '')
    setOferta(Boolean(producto.oferta))
    setAnterior(String(producto.precioAnterior ?? ''))
    setMensaje('')
  }

  function cambiarCategoria(nuevaCategoria) {
    setCategoria(nuevaCategoria)
    setAtributos({})
  }

  function cambiarAtributo(nombreCampo, valor) {
    setAtributos((anterior) => ({ ...anterior, [nombreCampo]: valor }))
  }

  async function guardar(evento) {
    evento.preventDefault()
    setMensaje('')

    const categoriaExiste = categorias.some((item) => item.codigo === categoria)
    if (!nombre.trim() || !categoriaExiste) {
      setMensaje('Completa el nombre y selecciona una categoría válida.')
      return
    }
    if (!textoDeHtml(descripcionHtml)) {
      setMensaje('La descripción no puede estar vacía.')
      return
    }
    if (!/^[1-9][0-9]{0,9}$/.test(precio) || !/^[0-9]{1,6}$/.test(stock)) {
      setMensaje(
        'Ingresa un precio entero positivo y un stock entero mayor o igual a cero.'
      )
      return
    }

    for (const campo of campos.filter((item) => item.obligatorio)) {
      const valor = atributos[campo.nombre]
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        setMensaje(`Completa el atributo ${campo.etiqueta}.`)
        return
      }
      if (campo.tipo === 'number' && !Number.isFinite(Number(valor))) {
        setMensaje(`El atributo ${campo.etiqueta} debe ser numérico.`)
        return
      }
    }

    if (
      oferta &&
      (!/^[1-9][0-9]{0,9}$/.test(anterior) ||
        Number(anterior) <= Number(precio))
    ) {
      setMensaje('El precio anterior debe ser mayor al precio de oferta.')
      return
    }

    const esNuevo = editando === null
    const producto = {
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
      etiqueta: etiqueta.trim() || 'Equipamiento de obra',
      descripcionHtml: sanitizarHtml(descripcionHtml),
      atributos,
      oferta,
      precioAnterior: oferta ? Number(anterior) : 0,
    }

    setGuardando(true)
    try {
      await props.guardar(producto, esNuevo)
      limpiar()
      setMensaje(
        esNuevo
          ? 'Producto creado y publicado en el catálogo.'
          : 'Producto actualizado en el catálogo.'
      )
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminacion() {
    try {
      const respuesta = await props.eliminar(eliminar)
      setMensaje(respuesta || 'Producto dado de baja.')
      if (editando === eliminar) limpiar()
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible dar de baja el producto.')
    } finally {
      setEliminar(null)
    }
  }

  const filas = productos
    .filter((producto) => !soloCriticos || producto.stock <= 5)
    .filter((producto) =>
      (producto.nombre ?? '')
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim())
    )
    .map((producto) => (
      <tr key={producto.id}>
        <td>
          {producto.nombre}
          {producto.activo === false && (
            <span className="badge bg-secondary ms-2">Inactivo</span>
          )}
        </td>
        <td>{dinero(producto.precio)}</td>
        <td>{producto.stock}</td>
        <td>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => cargar(producto)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              disabled={producto.activo === false}
              onClick={() => setEliminar(producto.id)}
            >
              Dar de baja
            </button>
          </div>
        </td>
      </tr>
    ))

  return (
    <>
      <h2>Productos</h2>
      <p className="text-muted">
        Los cambios se envían a la API y se reflejan en el catálogo. La baja es
        lógica: el historial de pedidos no se elimina.
      </p>

      <label className="form-label" htmlFor="buscarAdmin">
        Buscar producto
      </label>
      <input
        id="buscarAdmin"
        className="form-control mb-3"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />
      <div className="form-check mb-3">
        <input
          id="criticos"
          className="form-check-input"
          type="checkbox"
          checked={soloCriticos}
          onChange={(evento) => setSoloCriticos(evento.target.checked)}
        />
        <label className="form-check-label" htmlFor="criticos">
          Solo stock crítico: 5 unidades o menos
        </label>
      </div>

      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>¿Dar de baja este producto del catálogo?</p>
          <button
            type="button"
            className="btn btn-danger btn-sm me-2"
            onClick={confirmarEliminacion}
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
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
        {filas.length === 0 && <p>No hay productos para este filtro.</p>}
      </div>

      <form className="form-surface mt-4" onSubmit={guardar} noValidate>
        <h3>{editando === null ? 'Nuevo producto' : 'Editar producto'}</h3>
        {mensaje && (
          <p className="alert alert-info" role="status">{mensaje}</p>
        )}

        <Campo
          id="productoNombre"
          etiqueta="Nombre"
          valor={nombre}
          cambiar={setNombre}
        />

        <label className="form-label" htmlFor="productoCategoria">
          Categoría
        </label>
        <select
          id="productoCategoria"
          className="form-select mb-3"
          value={categoria}
          onChange={(evento) => cambiarCategoria(evento.target.value)}
        >
          {categorias.map((item) => (
            <option key={item.id} value={item.codigo}>
              {item.nombre}
            </option>
          ))}
        </select>

        {campos.length > 0 && (
          <fieldset className="mb-3">
            <legend className="form-label fs-6">
              Atributos de {categoriaSeleccionada?.nombre ?? 'la categoría'}
            </legend>
            {campos.map((campo) => {
              const id = `atributo-${campo.nombre}`
              const valor = atributos[campo.nombre]
              return campo.tipo === 'checkbox' ? (
                <div className="form-check mb-2" key={campo.nombre}>
                  <input
                    id={id}
                    type="checkbox"
                    className="form-check-input"
                    checked={Boolean(valor)}
                    onChange={(evento) =>
                      cambiarAtributo(campo.nombre, evento.target.checked)
                    }
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {campo.etiqueta}
                  </label>
                </div>
              ) : (
                <div className="mb-2" key={campo.nombre}>
                  <label className="form-label" htmlFor={id}>
                    {campo.etiqueta}
                    {campo.obligatorio ? ' *' : ''}
                    {campo.unidad ? ` (${campo.unidad})` : ''}
                  </label>
                  <input
                    id={id}
                    className="form-control"
                    type={campo.tipo === 'number' ? 'number' : 'text'}
                    step={campo.tipo === 'number' ? 'any' : undefined}
                    value={valor ?? ''}
                    onChange={(evento) =>
                      cambiarAtributo(campo.nombre, evento.target.value)
                    }
                  />
                </div>
              )
            })}
          </fieldset>
        )}

        <div className="row">
          <div className="col-md-6">
            <Campo
              id="productoPrecio"
              etiqueta="Precio CLP"
              tipo="number"
              valor={precio}
              cambiar={setPrecio}
              min="1"
              step="1"
            />
          </div>
          <div className="col-md-6">
            <Campo
              id="productoStock"
              etiqueta="Stock"
              tipo="number"
              valor={stock}
              cambiar={setStock}
              min="0"
              step="1"
            />
          </div>
        </div>

        <Campo
          id="productoEtiqueta"
          etiqueta="Etiqueta"
          requerido={false}
          valor={etiqueta}
          cambiar={setEtiqueta}
        />

        <label htmlFor="descripcionProducto" className="form-label">
          Descripción con formato
        </label>
        <EditorDescripcion
          id="descripcionProducto"
          valor={descripcionHtml}
          cambiar={setDescripcionHtml}
        />

        <label htmlFor="imagenProducto" className="form-label">
          Imagen referencial
        </label>
        <select
          id="imagenProducto"
          className="form-select mb-3"
          value={imagen}
          onChange={(evento) => setImagen(evento.target.value)}
        >
          <option value="ascensores.jpg">Ascensor</option>
          <option value="camiones.jpg">Camión</option>
          <option value="herramientas.jpg">Herramientas</option>
          <option value="indumentaria.jpg">Indumentaria</option>
          <option value="obra.jpg">Obra / andamios</option>
        </select>

        <div className="form-check mb-3">
          <input
            id="productoOferta"
            className="form-check-input"
            type="checkbox"
            checked={oferta}
            onChange={(evento) => setOferta(evento.target.checked)}
          />
          <label className="form-check-label" htmlFor="productoOferta">
            En oferta
          </label>
        </div>

        {oferta && (
          <Campo
            id="precioAnterior"
            etiqueta="Precio anterior CLP"
            tipo="number"
            valor={anterior}
            cambiar={setAnterior}
            min="1"
            step="1"
          />
        )}

        <button
          className="btn btn-primary me-2"
          type="submit"
          disabled={guardando}
        >
          {guardando ? 'Guardando…' : 'Guardar producto'}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={limpiar}
        >
          Cancelar / Nuevo
        </button>
      </form>
    </>
  )
}
