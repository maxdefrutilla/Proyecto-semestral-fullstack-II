import { useState } from 'react'

import Campo from '../components/Campo.jsx'
import ResumenPedido from '../components/ResumenPedido.jsx'
import { claveValida, validarRut } from '../data/operaciones.js'

export default function AdminUsuarios(props) {
  const usuarios = Array.isArray(props.usuarios) ? props.usuarios : []
  const pedidos = Array.isArray(props.pedidos) ? props.pedidos : []

  const [id, setId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [usuario, setUsuario] = useState('')
  const [rut, setRut] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [comuna, setComuna] = useState('')
  const [clave, setClave] = useState('')
  const [rol, setRol] = useState('CLIENTE')
  const [mensaje, setMensaje] = useState('')
  const [eliminar, setEliminar] = useState(null)
  const [historialId, setHistorialId] = useState(null)
  const [guardando, setGuardando] = useState(false)

  function limpiar() {
    setId(null)
    setNombre('')
    setApellidos('')
    setUsuario('')
    setRut('')
    setCorreo('')
    setTelefono('')
    setDireccion('')
    setComuna('')
    setClave('')
    setRol('CLIENTE')
  }

  function cargar(cuenta) {
    setId(cuenta.id)
    setNombre(cuenta.nombre ?? '')
    setApellidos(cuenta.apellidos ?? '')
    setUsuario(cuenta.usuario ?? '')
    setRut(cuenta.rut ?? '')
    setCorreo(cuenta.correo ?? '')
    setTelefono(cuenta.telefono ?? '')
    setDireccion(cuenta.direccion ?? '')
    setComuna(cuenta.comuna ?? '')
    setClave('')
    setRol(String(cuenta.rol ?? 'CLIENTE').toUpperCase())
    setMensaje('')
  }

  async function guardar(evento) {
    evento.preventDefault()
    setMensaje('')

    const normalizado = usuario.trim().toLowerCase()
    if (
      nombre.trim().length < 2 ||
      apellidos.trim().length < 2 ||
      !/^[a-z0-9._-]{3,30}$/.test(normalizado) ||
      !validarRut(rut) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      setMensaje('Revisa nombre, apellidos, usuario, RUT y correo.')
      return
    }
    if (id === null || clave !== '') {
      if (!claveValida(clave)) {
        setMensaje(
          'Contraseña: mínimo 6 caracteres, letra, símbolo y mayúscula.'
        )
        return
      }
    }

    const conflicto = usuarios.find(
      (cuenta) =>
        String(cuenta.id) !== String(id) &&
        (String(cuenta.usuario).toLowerCase() === normalizado ||
          String(cuenta.correo).toLowerCase() === correo.trim().toLowerCase() ||
          String(cuenta.rut).replace(/\./g, '') === rut.replace(/\./g, ''))
    )
    if (conflicto) {
      setMensaje('Ese usuario, correo o RUT ya está registrado.')
      return
    }

    if (
      id !== null &&
      String(props.usuario?.id) === String(id) &&
      rol !== 'ADMINISTRADOR'
    ) {
      setMensaje(
        'No puedes quitarte el rol de administrador durante tu sesión.'
      )
      return
    }

    const cuenta = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      usuario: normalizado,
      rut: rut.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      comuna: comuna.trim(),
      rol,
    }
    if (clave) cuenta.clave = clave
    if (id !== null) cuenta.id = id

    setGuardando(true)
    try {
      await props.guardar(cuenta, id === null)
      limpiar()
      setMensaje('Usuario guardado.')
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible guardar el usuario.')
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminacion() {
    try {
      const respuesta = await props.eliminar(eliminar)
      setMensaje(respuesta || 'Usuario eliminado.')
      if (String(id) === String(eliminar)) limpiar()
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible dar de baja el usuario.')
    } finally {
      setEliminar(null)
    }
  }

  const filas = usuarios.map((cuenta) => (
    <tr key={cuenta.id}>
      <td>
        {cuenta.nombre} {cuenta.apellidos}
        <br />
        <small>{cuenta.usuario}</small>
        {cuenta.activo === false && (
          <span className="badge bg-secondary ms-2">Inactivo</span>
        )}
      </td>
      <td>{String(cuenta.rol ?? '').toUpperCase()}</td>
      <td>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => cargar(cuenta)}
          >
            Editar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setHistorialId(cuenta.id)}
          >
            Historial
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            disabled={String(cuenta.id) === String(props.usuario?.id)}
            onClick={() => setEliminar(cuenta.id)}
          >
            Dar de baja
          </button>
        </div>
      </td>
    </tr>
  ))

  const historial = pedidos.filter(
    (pedido) => String(pedido.usuarioId) === String(historialId)
  )

  return (
    <>
      <h2>Usuarios</h2>
      <p className="text-muted">
        Roles disponibles: CLIENTE y ADMINISTRADOR. La baja es lógica y conserva
        el historial de compras.
      </p>

      {mensaje && (
        <p className="alert alert-info" role="status">{mensaje}</p>
      )}

      {eliminar !== null && (
        <div className="alert alert-warning">
          <p>¿Dar de baja este usuario? Sus pedidos conservarán el nombre original.</p>
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
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>

      {historialId !== null && (
        <div className="mb-4">
          <h3>Historial de compras</h3>
          {historial.length ? (
            historial.map((pedido) => (
              <ResumenPedido
                key={pedido.pedidoId ?? pedido.id}
                pedido={pedido}
              />
            ))
          ) : (
            <p>Este usuario no tiene compras registradas.</p>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setHistorialId(null)}
          >
            Cerrar historial
          </button>
        </div>
      )}

      <form className="form-surface" onSubmit={guardar} noValidate>
        <h3>{id === null ? 'Nuevo usuario' : 'Editar usuario'}</h3>

        <div className="row">
          <div className="col-md-6">
            <Campo
              id="adminNombre"
              etiqueta="Nombre"
              valor={nombre}
              cambiar={setNombre}
            />
          </div>
          <div className="col-md-6">
            <Campo
              id="adminApellidos"
              etiqueta="Apellidos"
              valor={apellidos}
              cambiar={setApellidos}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Campo
              id="adminUsuario"
              etiqueta="Usuario"
              valor={usuario}
              cambiar={setUsuario}
            />
          </div>
          <div className="col-md-6">
            <Campo
              id="adminRut"
              etiqueta="RUT"
              valor={rut}
              cambiar={setRut}
            />
          </div>
        </div>

        <Campo
          id="adminCorreo"
          etiqueta="Correo"
          tipo="email"
          valor={correo}
          cambiar={setCorreo}
        />

        <div className="row">
          <div className="col-md-6">
            <Campo
              id="adminTelefono"
              etiqueta="Teléfono"
              requerido={false}
              valor={telefono}
              cambiar={setTelefono}
            />
          </div>
          <div className="col-md-6">
            <Campo
              id="adminComuna"
              etiqueta="Comuna"
              requerido={false}
              valor={comuna}
              cambiar={setComuna}
            />
          </div>
        </div>

        <Campo
          id="adminDireccion"
          etiqueta="Dirección"
          requerido={false}
          valor={direccion}
          cambiar={setDireccion}
        />

        <Campo
          id="adminClave"
          etiqueta={id === null ? 'Contraseña' : 'Nueva contraseña (opcional)'}
          requerido={id === null}
          tipo="password"
          valor={clave}
          cambiar={setClave}
        />

        <label className="form-label" htmlFor="adminRol">
          Rol
        </label>
        <select
          id="adminRol"
          className="form-select mb-3"
          value={rol}
          onChange={(evento) => setRol(evento.target.value)}
        >
          <option value="CLIENTE">CLIENTE</option>
          <option value="ADMINISTRADOR">ADMINISTRADOR</option>
        </select>

        <button
          className="btn btn-primary me-2"
          type="submit"
          disabled={guardando}
        >
          {guardando ? 'Guardando…' : 'Guardar usuario'}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={limpiar}
        >
          Cancelar / Nuevo
        </button>
      </form>
    </>
  )
}
