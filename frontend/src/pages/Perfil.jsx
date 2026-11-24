import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Campo from '../components/Campo.jsx'
import Encabezado from '../components/Encabezado.jsx'
import ResumenPedido from '../components/ResumenPedido.jsx'
import { useAuth } from '../context/useAuth.js'
import { misPedidos } from '../services/ventasService.js'

function DatosPerfil({ usuario, pedidos, guardar }) {
  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [apellidos, setApellidos] = useState(usuario?.apellidos ?? '')
  const [correo, setCorreo] = useState(usuario?.correo ?? '')
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '')
  const [direccion, setDireccion] = useState(usuario?.direccion ?? '')
  const [comuna, setComuna] = useState(usuario?.comuna ?? '')
  const [mensaje, setMensaje] = useState('')

  async function guardarCambios(evento) {
    evento.preventDefault()
    setMensaje('')
    if (
      nombre.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
    ) {
      setMensaje('Ingresa un nombre y correo válidos.')
      return
    }
    try {
      await guardar({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        comuna: comuna.trim(),
      })
      setMensaje('Perfil actualizado.')
    } catch (fallo) {
      setMensaje(fallo?.message ?? 'No fue posible actualizar el perfil.')
    }
  }

  return (
    <>
      <Encabezado
        seccion="Mi perfil"
        titulo={'Hola, ' + (usuario?.nombre ?? '') + '.'}
      />
      <section className="section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <form className="form-surface" onSubmit={guardarCambios} noValidate>
                <h2 className="fs-4">Mis datos</h2>
                <Campo id="perfilNombre" etiqueta="Nombre" valor={nombre} cambiar={setNombre} />
                <Campo id="perfilApellidos" etiqueta="Apellidos" valor={apellidos} cambiar={setApellidos} />
                <div className="mb-3">
                  <label className="form-label" htmlFor="perfilRut">RUT</label>
                  <input id="perfilRut" className="form-control" value={usuario?.rut ?? ''} readOnly />
                </div>
                <Campo id="perfilCorreo" etiqueta="Correo" tipo="email" valor={correo} cambiar={setCorreo} />
                <Campo
                  id="perfilTelefono"
                  etiqueta="Teléfono"
                  requerido={false}
                  valor={telefono}
                  cambiar={setTelefono}
                />
                <Campo
                  id="perfilDireccion"
                  etiqueta="Dirección"
                  valor={direccion}
                  cambiar={setDireccion}
                  requerido={false}
                />
                <Campo
                  id="perfilComuna"
                  etiqueta="Comuna"
                  valor={comuna}
                  cambiar={setComuna}
                  requerido={false}
                />
                <button className="btn btn-primary">Guardar cambios</button>
                {mensaje && (
                  <p className="alert alert-info mt-3" role="status">{mensaje}</p>
                )}
              </form>
            </div>

            <div className="col-lg-7">
              <h2 className="fs-4">Historial de compras</h2>
              {pedidos.length ? (
                pedidos.map((pedido) => (
                  <ResumenPedido key={pedido.id ?? pedido.pedidoId} pedido={pedido} />
                ))
              ) : (
                <p className="text-muted">Todavía no hay pedidos de esta cuenta.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Perfil() {
  const { usuario, token, recargarPerfil, guardarPerfil } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')
  const usuarioId = usuario?.id

  useEffect(() => {
    if (!usuarioId || !token) return
    let activo = true
    Promise.all([recargarPerfil(), misPedidos()])
      .then(([, lista]) => {
        if (!activo) return
        setPedidos(lista)
        setError('')
      })
      .catch((fallo) => {
        if (activo) setError(fallo?.message ?? 'No fue posible cargar tus datos.')
      })
    return () => { activo = false }
  }, [usuarioId, token, recargarPerfil])

  if (!usuario) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1 className="fs-2">Inicia sesión para ver tu perfil.</h1>
          <Link to="/acceso">Ingresar</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {error && (
        <div className="container mt-3">
          <p className="alert alert-danger" role="alert">{error}</p>
        </div>
      )}
      <DatosPerfil
        key={usuario.id}
        usuario={usuario}
        pedidos={pedidos}
        guardar={guardarPerfil}
      />
    </>
  )
}
