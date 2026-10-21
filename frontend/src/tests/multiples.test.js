
import { describe, it, expect } from 'vitest'
import {
  crearRegistro,
  editarRegistro,
  eliminarRegistro
} from '../data/operaciones.js'

describe('Pruebas múltiples - Gestión de registros INMAQUI', () => {

  const usuarios = [
    { id: 1, usuario: 'admin', rol: 'Administrador' },
    { id: 2, usuario: 'cliente', rol: 'Cliente' }
  ]

  // PRUEBA 4 - VERDADERO
  it('crea correctamente un usuario y conserva los anteriores', () => {
    const nuevo = { id: 3, usuario: 'nuevo', rol: 'Cliente' }
    const resultado = crearRegistro(usuarios, nuevo)

    expect(resultado).toHaveLength(3)
    expect(resultado).toContainEqual(nuevo)
    expect(usuarios).toHaveLength(2)
  })

  // PRUEBA 5 - FALSO
  it('al eliminar un usuario, este deja de existir en la lista', () => {
    const resultado = eliminarRegistro(usuarios, 2)

    expect(resultado).toHaveLength(1)
    expect(resultado.some(u => u.id === 2)).toBe(false)
    expect(resultado[0].usuario).toBe('admin')
  })

  // PRUEBA 6 - INVÁLIDO
  it('no modifica registros cuando se intenta editar un ID inexistente', () => {
    const inexistente = {
      id: 999,
      usuario: 'fantasma',
      rol: 'Cliente'
    }

    const resultado = editarRegistro(usuarios, inexistente)

    expect(resultado).toEqual(usuarios)
    expect(resultado.some(u => u.id === 999)).toBe(false)
    expect(resultado).not.toContainEqual(inexistente)
  })

})
