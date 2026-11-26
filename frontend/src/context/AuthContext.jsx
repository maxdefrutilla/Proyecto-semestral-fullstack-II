import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AuthContext } from './authContext.js'
import {
  login as loginServicio,
  renovar as renovarServicio,
  logout as logoutServicio,
  normalizarUsuario,
  registro as registroServicio,
  obtenerPerfil,
  actualizarPerfil,
} from '../services/authService.js'
import { alExpirarSesion, borrarToken } from '../services/api.js'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [inicializando, setInicializando] = useState(true)
  const renovacion = useRef(null)

  const renovar = useCallback(() => {
    if (!renovacion.current) {
      renovacion.current = renovarServicio().then(({ token, usuario }) => {
        setToken(token)
        setUsuario(usuario)
      }).catch(() => {
        borrarToken()
        setToken(null)
        setUsuario(null)
      }).finally(() => {
        renovacion.current = null
      })
    }
    return renovacion.current
  }, [])

  useEffect(() => {
    let activo = true
    const limpiar = alExpirarSesion(renovar)
    renovar().finally(() => {
      if (activo) setInicializando(false)
    })
    return () => {
      activo = false
      limpiar()
    }
  }, [renovar])

  const login = useCallback(async (credenciales) => {
    setCargando(true)
    try {
      const resultado = await loginServicio(credenciales)
      setToken(resultado.token ?? null)
      setUsuario(resultado.usuario)
      return resultado
    } finally {
      setCargando(false)
    }
  }, [])

  const registro = useCallback(async (datos) => {
    setCargando(true)
    try {
      return await registroServicio(datos)
    } finally {
      setCargando(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await renovacion.current
    await logoutServicio()
    setToken(null)
    setUsuario(null)
  }, [])

  const recargarPerfil = useCallback(async () => {
    if (!token) return null
    const perfil = await obtenerPerfil()
    setUsuario(perfil)
    return perfil
  }, [token])

  const guardarPerfil = useCallback(async (datos) => {
    const perfil = normalizarUsuario(await actualizarPerfil(datos))
    setUsuario((anterior) => ({ ...anterior, ...perfil }))
    return perfil
  }, [])

  const esAdmin = String(usuario?.rol ?? '').toUpperCase() === 'ADMINISTRADOR'

  const valor = useMemo(() => ({
    usuario,
    token,
    cargando,
    inicializando,
    esAdmin,
    login,
    registro,
    logout,
    recargarPerfil,
    guardarPerfil,
  }), [
    usuario,
    token,
    cargando,
    inicializando,
    esAdmin,
    login,
    registro,
    logout,
    recargarPerfil,
    guardarPerfil,
  ])

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
