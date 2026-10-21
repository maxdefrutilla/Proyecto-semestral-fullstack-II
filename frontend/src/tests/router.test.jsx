
// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import Catalogo from '../pages/Catalogo.jsx'
import Administracion from '../pages/Administracion.jsx'

afterEach(() => {
  cleanup()
})

const productosPrueba = [
  {
    id: 1,
    nombre: 'Ascensor de prueba',
    categoria: 'ascensores',
    precio: 100000,
    stock: 5
  }
]

const categoriasPrueba = [
  { id: 1, nombre: 'Ascensores', codigo: 'ascensores' }
]

function mostrarRutas(ruta) {
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
          path="/administracion"
          element={
            <Administracion
              usuario={null}
              productos={productosPrueba}
              categorias={categoriasPrueba}
              usuarios={[]}
              pedidos={[]}
            />
          }
        />
        <Route
          path="*"
          element={<h1>Página no encontrada</h1>}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('Pruebas React Router - INMAQUI', () => {

  // PRUEBA 10 - VÁLIDA
  it('muestra el catálogo al acceder a /catalogo', () => {
    mostrarRutas('/catalogo')

    expect(
      screen.getByRole('heading', { name: /encuentra tu próximo equipo/i })
    ).toBeTruthy()

    expect(screen.getByText('Ascensor de prueba')).toBeTruthy()
  })

  // PRUEBA 11 - NEGATIVA
  
it('restringe el acceso a administración sin una sesión válida', () => {
  mostrarRutas('/administracion')

  expect(
    screen.getByRole('heading', { name: /acceso de administrador/i })
  ).toBeTruthy()

  expect(
    screen.getByText(/inicia sesión con una cuenta de administrador/i)
  ).toBeTruthy()

  expect(
    screen.getByRole('link', { name: /iniciar sesión/i })
      .getAttribute('href')
  ).toBe('/acceso')

  expect(
    screen.queryByText('Gestión de productos')
  ).toBeNull()
})


  // PRUEBA 12 - INVÁLIDA
  it('muestra una página de error al acceder a una ruta inexistente', () => {
  mostrarRutas('/ruta-inexistente')

  expect(
    screen.getByRole('heading', { name: /página no encontrada/i })
  ).toBeTruthy()

  expect(
    screen.queryByText('Ascensor de prueba')
  ).toBeNull()
})

})
