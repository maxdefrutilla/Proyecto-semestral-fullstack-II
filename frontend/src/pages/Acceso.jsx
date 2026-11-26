import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Campo from '../components/Campo.jsx'
import imagenes from '../data/imagenes.js'
import { validarRut } from '../data/operaciones.js'
import { useAuth } from '../context/useAuth.js'

export default function Acceso() {
  const { usuario, esAdmin, login, registro, logout, cargando } = useAuth()
  const navigate = useNavigate()

  const [registrando, setRegistrando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [usuarioTexto, setUsuarioTexto] = useState('')
  const [rut, setRut] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [clave, setClave] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [mensaje, setMensaje] = useState('')

  function cambiarModo(nuevoModo) {
    setRegistrando(nuevoModo)
    setErrores({})
    setErrorGeneral('')
    setMensaje('')
  }

  async function cerrarSesion() {
    try {
      await logout()
    } catch (fallo) {
      setErrorGeneral(fallo.message)
    }
  }

  async function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = {}
    const normalizado = usuarioTexto.trim().toLowerCase()

    if (!normalizado) nuevosErrores.usuario = 'Ingresa tu usuario.'
    if (!clave) nuevosErrores.clave = 'Ingresa tu contraseña.'

    if (registrando) {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,80}$/.test(nombre.trim())) {
        nuevosErrores.nombre = 'Ingresa un nombre válido.'
      }
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,80}$/.test(apellidos.trim())) {
        nuevosErrores.apellidos = 'Ingresa tus apellidos.'
      }
      if (!/^[a-z0-9._-]{3,30}$/.test(normalizado)) {
        nuevosErrores.usuario = 'Usa entre 3 y 30 letras, números, puntos o guiones.'
      }
      if (!validarRut(rut)) nuevosErrores.rut = 'Ingresa un RUT válido. Ejemplo: 12345678-5.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
        nuevosErrores.correo = 'Ingresa un correo válido.'
      }
      if (clave.length < 8 || clave.length > 64 || new TextEncoder().encode(clave).length > 72) {
        nuevosErrores.clave = 'Ingresa entre 8 y 64 caracteres.'
      }
      if (!confirmacion || clave !== confirmacion) {
        nuevosErrores.confirmacion = 'Las contraseñas deben coincidir.'
      }
    }

    setErrores(nuevosErrores)
    setMensaje('')
    setErrorGeneral('')
    if (Object.keys(nuevosErrores).length > 0) return

    try {
      if (registrando) {
        await registro({
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          usuario: normalizado,
          rut: rut.trim().replace(/\./g, ''),
          correo: correo.trim(),
          telefono: telefono.trim(),
          clave,
        })
        setMensaje('Cuenta creada. Ya puedes iniciar sesión.')
        setRegistrando(false)
        setClave('')
        setConfirmacion('')
      } else {
        const resultado = await login({ usuario: normalizado, clave })
        setClave('')
        const rol = String(resultado?.usuario?.rol ?? '').toUpperCase()
        navigate(rol === 'ADMINISTRADOR' ? '/administracion' : '/perfil')
      }
    } catch (fallo) {
      setErrorGeneral(fallo?.message ?? 'No fue posible completar la operación.')
    }
  }

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-story">
            <span className="eyebrow">Acceso INMAQUI</span>
            <h1>
              Tu cuenta.
              <br />
              Tu próximo proyecto.
            </h1>
            <p>Accede a tus datos y revisa tus compras.</p>
            <img src={imagenes.obra} alt="Obra en construcción" />
          </div>

          <div className="auth-form">
            {usuario ? (
              <>
                <span className="eyebrow">{usuario.rol}</span>
                <h2>Hola, {usuario.nombre}.</h2>
                <p>{usuario.correo}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <Link className="btn btn-primary" to="/perfil">
                    Mi perfil e historial
                  </Link>
                  {esAdmin && (
                    <Link className="btn btn-outline-primary" to="/administracion">
                      Administración
                    </Link>
                  )}
                  <button className="btn btn-outline-secondary" type="button" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex gap-2 mb-4">
                  <button
                    type="button"
                    className={'btn btn-sm ' + (!registrando ? 'btn-primary' : 'btn-outline-primary')}
                    onClick={() => cambiarModo(false)}
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    className={'btn btn-sm ' + (registrando ? 'btn-primary' : 'btn-outline-primary')}
                    onClick={() => cambiarModo(true)}
                  >
                    Registrarse
                  </button>
                </div>

                <h2>
                  {registrando ? 'Crear cuenta de cliente' : 'Bienvenido de vuelta.'}
                </h2>

                {mensaje && (
                  <p className="alert alert-success" role="status">{mensaje}</p>
                )}
                {errorGeneral && (
                  <p className="alert alert-danger" role="alert">{errorGeneral}</p>
                )}

                <form onSubmit={enviar} noValidate>
                  {registrando && (
                    <>
                      <Campo
                        id="nombreCuenta"
                        etiqueta="Nombre"
                        valor={nombre}
                        cambiar={setNombre}
                        error={errores.nombre}
                      />
                      <Campo
                        id="apellidosCuenta"
                        etiqueta="Apellidos"
                        valor={apellidos}
                        cambiar={setApellidos}
                        error={errores.apellidos}
                      />
                    </>
                  )}

                  <Campo
                    id="usuarioCuenta"
                    etiqueta="Usuario"
                    valor={usuarioTexto}
                    cambiar={setUsuarioTexto}
                    error={errores.usuario}
                  />

                  {registrando && (
                    <>
                      <Campo
                        id="rutCuenta"
                        etiqueta="RUT"
                        valor={rut}
                        cambiar={setRut}
                        error={errores.rut}
                      />
                      <Campo
                        id="correoCuenta"
                        etiqueta="Correo"
                        tipo="email"
                        valor={correo}
                        cambiar={setCorreo}
                        error={errores.correo}
                      />
                      <Campo
                        id="telefonoCuenta"
                        etiqueta="Teléfono (opcional)"
                        requerido={false}
                        valor={telefono}
                        cambiar={setTelefono}
                      />
                    </>
                  )}

                  <Campo
                    id="claveCuenta"
                    etiqueta="Contraseña"
                    tipo={verClave ? 'text' : 'password'}
                    valor={clave}
                    cambiar={setClave}
                    error={errores.clave}
                  />

                  {registrando && (
                    <>

                      <p className="form-text">
                        La contraseña debe tener entre 8 y 64 caracteres.
                      </p>

                      <Campo
                        id="confirmacion"
                        etiqueta="Confirmar contraseña"
                        tipo={verClave ? 'text' : 'password'}
                        valor={confirmacion}
                        cambiar={setConfirmacion}
                        error={errores.confirmacion}
                      />
                    </>
                  )}

                  <div className="form-check mb-3">
                    <input
                      id="verClave"
                      type="checkbox"
                      className="form-check-input"
                      checked={verClave}
                      onChange={(evento) => setVerClave(evento.target.checked)}
                    />
                    <label htmlFor="verClave" className="form-check-label">
                      Mostrar contraseña
                    </label>
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={cargando}>
                    {cargando
                      ? 'Procesando…'
                      : (registrando ? 'Crear cuenta' : 'Iniciar sesión')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
