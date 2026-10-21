
// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import Catalogo from '../pages/Catalogo.jsx'

afterEach(() => {
  cleanup()
})

// Datos controlados para las pruebas
const productosPrueba = [
  {
    id: 1,
    nombre: 'Ascensor de obra',
    categoria: 'ascensores',
    precio: 150000,
    stock: 3
  },
  {
    id: 2,
    nombre: 'Camión tolva',
    categoria: 'camiones',
    precio: 120000,
    stock: 5
  },
  {
    id: 3,
    nombre: 'Taladro industrial',
    categoria: 'herramientas',
    precio: 25000,
    stock: 10
  }
]

const categoriasPrueba = [
  { id: 1, nombre: 'Ascensores', codigo: 'ascensores' },
  { id: 2, nombre: 'Camiones', codigo: 'camiones' },
  { id: 3, nombre: 'Herramientas', codigo: 'herramientas' }
]

function mostrarCatalogo(ruta = '/catalogo') {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route
          path="/catalogo"
          element={
            <Catalogo
              productos={productosPrueba}
              categorias={categoriasPrueba}
              onAgregar={vi.fn()}
            />
          }
        />
        <Route
          path="/categoria/:id"
          element={
            <Catalogo
              productos={productosPrueba}
              categorias={categoriasPrueba}
              onAgregar={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('Pruebas de componentes - Catálogo INMAQUI', () => {

  // PRUEBA 7 - VERDADERO
  it('muestra los productos recibidos mediante props', () => {
    mostrarCatalogo()

    expect(screen.getByText('Ascensor de obra')).toBeTruthy()
    expect(screen.getByText('Camión tolva')).toBeTruthy()
    expect(screen.getByText('Taladro industrial')).toBeTruthy()
  })

  // PRUEBA 8 - FALSO
  it('oculta los productos de otras categorías al filtrar Camiones', () => {
    mostrarCatalogo()

    fireEvent.click(
      screen.getByRole('button', { name: /^camiones$/i })
    )

    expect(screen.getByText('Camión tolva')).toBeTruthy()
    expect(screen.queryByText('Ascensor de obra')).toBeNull()
    expect(screen.queryByText('Taladro industrial')).toBeNull()
  })

  // PRUEBA 9 - INVÁLIDO
  it('muestra cero resultados cuando la búsqueda no coincide', () => {
    mostrarCatalogo()

    fireEvent.change(
      screen.getByRole('searchbox', { name: /buscar producto/i }),
      { target: { value: 'producto-inexistente-999' } }
    )

    expect(screen.getByText(/0 productos/i)).toBeTruthy()
    expect(screen.queryByText('Ascensor de obra')).toBeNull()
    expect(screen.queryByText('Camión tolva')).toBeNull()
  })

})
