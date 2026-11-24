
import { describe, it, expect } from 'vitest'
import { claveValida } from '../data/operaciones.js'

describe('Validación de contraseña - INMAQUI', () => {

  it('acepta una contraseña que cumple las reglas', () => {
    const resultado = claveValida('Clave123!')
    expect(resultado).toBe(true)
  })

  it('rechaza una contraseña sin mayúscula ni símbolo', () => {
    const resultado = claveValida('clave123')
    expect(resultado).toBe(false)
  })

  it('rechaza una contraseña vacía', () => {
    const resultado = claveValida('')
    expect(resultado).toBe(false)
  })

})
